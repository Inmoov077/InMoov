import os
import sys
import time
import logging
import threading
import serial
import serial.tools.list_ports
import requests
from flask import Flask, request, jsonify, send_file, redirect

# Load .env if present (optional — no extra dependency required)
_env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(_env_path):
    with open(_env_path, encoding='utf-8') as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith('#') and '=' in _line:
                _k, _v = _line.split('=', 1)
                os.environ.setdefault(_k.strip(), _v.strip().strip('"\''))

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(__file__)
DASHBOARD_HTML = os.path.join(BASE_DIR, 'dashboard.html')
FRONTEND_DIST = os.path.join(BASE_DIR, 'frontend', 'dist')
SERVO_CONFIG_PATH = os.path.join(BASE_DIR, 'shared', 'servo_config.json')
PIN_OVERRIDES_PATH = os.path.join(BASE_DIR, 'shared', 'pin_overrides.json')
CALIB_OVERRIDES_PATH = os.path.join(BASE_DIR, 'shared', 'calibration_overrides.json')
WAVE_PATTERNS_PATH = os.path.join(BASE_DIR, 'shared', 'wave_patterns.json')
MRL_GESTURES_PATH = os.path.join(BASE_DIR, 'shared', 'mrl_gestures.json')
MRL_BASE_URL = os.environ.get('MRL_BASE_URL', 'http://localhost:8888').rstrip('/')
MRL_WEBGUI_ROOT = os.path.join(BASE_DIR, 'myrobotlab-1.1.1610', 'resource', 'WebGui', 'app')


def _read_json(path, default=None):
    import json
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default if default is not None else {}


def _write_json(path, data):
    import json
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


def _load_servo_config():
    """Load canonical servo map with user pin/calibration overrides applied."""
    base = _read_json(SERVO_CONFIG_PATH)
    if not base:
        logger.warning("servo_config.json not found")
        return None
    pin_ov = _read_json(PIN_OVERRIDES_PATH, {})
    cal_ov = _read_json(CALIB_OVERRIDES_PATH, {})
    servos = []
    for s in base.get('servos', []):
        entry = dict(s)
        key = entry.get('key')
        if key in pin_ov:
            entry['pin'] = int(pin_ov[key])
            entry['pinOverride'] = True
        if key in cal_ov:
            for field in ('min', 'max', 'rest'):
                if field in cal_ov[key]:
                    entry[field] = int(cal_ov[key][field])
            entry['calibrationSource'] = 'user'
        servos.append(entry)
    base['servos'] = servos
    base['pinOverrides'] = pin_ov
    base['calibrationOverrides'] = cal_ov
    return base


def _reload_servo_config():
    global SERVO_CONFIG
    SERVO_CONFIG = _load_servo_config()
    return SERVO_CONFIG


SERVO_CONFIG = _load_servo_config()

def _servo_by_key(key):
    if not SERVO_CONFIG:
        return None
    for s in SERVO_CONFIG.get('servos', []):
        if s.get('key') == key:
            return s
    return None

def _clamp_angle(val, lo=0, hi=180):
    return max(lo, min(hi, int(val)))


def _clamp_servo_key(key, val, default=90):
    s = _servo_by_key(key)
    if s:
        return max(s['min'], min(s['max'], int(val)))
    return _clamp_angle(val)

# Gemini API key — set via .env or GEMINI_API_KEY environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

app = Flask(__name__)

# Thread-safety lock for serial port access
serial_lock = threading.Lock()

# Global Serial Connection State
class SerialManager:
    def __init__(self):
        self.conn = None
        self.port = None

    def is_connected(self):
        return self.conn is not None and self.conn.is_open

    def connect(self, port_name):
        with serial_lock:
            if self.is_connected():
                if self.port == port_name:
                    logger.info(f"Already connected to {port_name}")
                    return True
                self.disconnect_unsafe()

            try:
                logger.info(f"Connecting to port {port_name} at 9600 baud...")
                self.conn = serial.Serial(port_name, 9600, timeout=1, write_timeout=1)
                self.port = port_name
                # Give Arduino time to reset after opening serial port
                time.sleep(1.5)
                logger.info(f"Successfully connected to {port_name}")
                return True
            except Exception as e:
                logger.error(f"Failed to connect to {port_name}: {e}")
                self.conn = None
                self.port = None
                raise e

    def disconnect(self):
        with serial_lock:
            self.disconnect_unsafe()

    def disconnect_unsafe(self):
        if self.conn:
            try:
                logger.info(f"Closing serial connection to {self.port}")
                self.conn.close()
            except Exception as e:
                logger.error(f"Error closing port: {e}")
        self.conn = None
        self.port = None

    def send_cmd(self, cmd_str):
        with serial_lock:
            if not self.is_connected():
                logger.warning("Attempted to send command while disconnected")
                return False
            try:
                self.conn.write(cmd_str.encode('utf-8'))
                self.conn.flush()
                return True
            except Exception as e:
                logger.error(f"Failed to write to serial port {self.port}: {e}")
                # Auto-disconnect if write fails (e.g. device unplugged)
                self.disconnect_unsafe()
                return False

    def query_handshake(self, port_name):
        """Attempts to open port and send a handshake request '?'.
        Accepts any valid InMoov firmware response:
          - 'ARDUINO_OK'  (combined_servo_control.ino / servo_control.ino)
          - 'NECK_OK'     (neck_servo_control.ino)
          - 'NECK_READY'  (neck_servo_control.ino on startup)
          - Any token ending in '_OK' or '_READY'
        """
        # All valid handshake tokens from any InMoov firmware
        VALID_TOKENS = ["ARDUINO_OK", "NECK_OK", "NECK_READY", "INMOOV_OK", "FULL_BODY_READY"]
        try:
            logger.info(f"Testing port {port_name} for handshake...")
            test_conn = serial.Serial(port_name, 9600, timeout=2, write_timeout=1)
            time.sleep(1.8)  # Wait for Arduino to reset fully
            test_conn.reset_input_buffer()
            test_conn.reset_output_buffer()

            test_conn.write(b'?')
            test_conn.flush()

            # Try reading up to 3 lines (Arduino may send startup noise first)
            for _ in range(3):
                response = test_conn.readline().decode('utf-8', errors='ignore').strip()
                logger.info(f"Handshake response from {port_name}: '{response}'")
                if any(tok in response for tok in VALID_TOKENS):
                    test_conn.close()
                    return True

            test_conn.close()
        except Exception as e:
            logger.debug(f"Handshake failed on {port_name}: {e}")
        return False

serial_mgr = SerialManager()

def _serve_dashboard():
    """Serve React production build when available, else legacy dashboard.html."""
    react_index = os.path.join(FRONTEND_DIST, 'index.html')
    if os.path.exists(react_index):
        return send_file(react_index)
    if os.path.exists(DASHBOARD_HTML):
        return send_file(DASHBOARD_HTML)
    return (
        "UI not found. Run: cd frontend && npm install && npm run build",
        404,
    )

@app.route('/')
def index():
    return _serve_dashboard()

@app.route('/assets/<path:filename>')
def serve_frontend_assets(filename):
    asset_path = os.path.join(FRONTEND_DIST, 'assets', filename)
    if os.path.exists(asset_path):
        return send_file(asset_path)
    return f"{filename} not found.", 404

@app.route('/models/<path:filename>')
def serve_model(filename):
    """Serve 3D model files (GLB/GLTF/STL/URDF) from the project directory."""
    base = os.path.dirname(__file__)
    candidates = [
        os.path.join(base, filename),
        os.path.join(base, 'models', filename),
    ]
    model_path = next((p for p in candidates if os.path.exists(p)), None)
    if not model_path:
        return f"{filename} not found.", 404
    ext = os.path.splitext(filename)[1].lower()
    mime = {
        '.glb': 'model/gltf-binary',
        '.gltf': 'model/gltf+json',
        '.stl': 'model/stl',
        '.urdf': 'application/xml',
    }.get(ext, 'application/octet-stream')
    return send_file(model_path, mimetype=mime)

@app.route('/<path:path>')
def spa_fallback(path):
    """SPA routes — return index.html for client-side routing."""
    if path.startswith('api/') or path.startswith('models/') or path.startswith('js/'):
        return f"{path} not found.", 404
    asset_path = os.path.join(FRONTEND_DIST, path)
    if os.path.exists(asset_path) and os.path.isfile(asset_path):
        return send_file(asset_path)
    react_index = os.path.join(FRONTEND_DIST, 'index.html')
    if os.path.exists(react_index):
        return send_file(react_index)
    return _serve_dashboard()

@app.route('/combined')
@app.route('/neck')
@app.route('/offline')
def legacy_routes():
    return redirect('/', code=302)

@app.route('/img/<path:filename>')
def serve_image(filename):
    """Serve image files (PNG, JPG) from the project directory."""
    img_path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.exists(img_path):
        return send_file(img_path)
    return f"{filename} not found.", 404

@app.route('/js/<path:filename>')
def serve_js(filename):
    """Serve JavaScript files (robot_viewer.js etc.) from the project directory."""
    js_path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.exists(js_path):
        return send_file(js_path, mimetype='application/javascript')
    return f"{filename} not found.", 404

@app.route('/css/<path:filename>')
def serve_css(filename):
    """Serve CSS theme files from the project directory."""
    css_path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.exists(css_path):
        return send_file(css_path, mimetype='text/css')
    return f"{filename} not found.", 404

@app.route('/api/offline/search', methods=['POST'])
def offline_search():
    try:
        data = request.get_json() or {}
        query = data.get('query', '').strip()
        if not query:
            return jsonify({"ok": False, "error": "Empty query"}), 400
        
        import vector_db
        res = vector_db.search_db(query, top_k=1)
        if res.get("ok") and res.get("results"):
            best = res["results"][0]
            return jsonify({
                "ok": True,
                "match": True if best["score"] >= 0.08 else False,
                "text": best["chunk"],
                "score": best["score"]
            })
        return jsonify({"ok": True, "match": False, "text": ""})
    except Exception as e:
        logger.error(f"Error in offline search: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route('/api/offline/index', methods=['POST'])
def offline_index():
    try:
        data = request.get_json() or {}
        file_path = data.get('path', '').strip()
        if not file_path:
            return jsonify({"ok": False, "error": "No file path provided"}), 400
        
        import vector_db
        res = vector_db.build_db(file_path)
        return jsonify(res)
    except Exception as e:
        logger.error(f"Error indexing: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route('/api/serial/ports', methods=['GET'])
def get_ports():
    ports = [port.device for port in serial.tools.list_ports.comports()]
    return jsonify({
        "ports": ports,
        "current": serial_mgr.port if serial_mgr.is_connected() else None
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "serial": {
            "connected": serial_mgr.is_connected(),
            "port": serial_mgr.port
        }
    })

@app.route('/api/serial/connect', methods=['POST'])
def connect_port():
    data = request.get_json() or {}
    port = data.get('port')
    if not port:
        return jsonify({"ok": False, "error": "No port specified"}), 400

    try:
        serial_mgr.connect(port)
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route('/api/serial/disconnect', methods=['POST'])
def disconnect_port():
    serial_mgr.disconnect()
    return jsonify({"ok": True})

@app.route('/api/serial/autodetect', methods=['POST'])
def autodetect():
    ports = list(serial.tools.list_ports.comports())
    if not ports:
        return jsonify({"ok": False, "error": "No serial ports found on system"}), 404

    # 1. Prioritize ports that look like Arduino by description
    arduino_keywords = ["arduino", "genuino", "ch340", "usb-serial", "usb serial", "usb_serial", "ftdi"]
    target_ports = []
    other_ports = []

    for p in ports:
        desc = p.description.lower() if p.description else ""
        mfg = p.manufacturer.lower() if p.manufacturer else ""
        if any(kw in desc or kw in mfg for kw in arduino_keywords):
            target_ports.append(p.device)
        else:
            other_ports.append(p.device)

    # 2. Try handshake on prioritized target ports
    for port in target_ports:
        if serial_mgr.query_handshake(port):
            try:
                serial_mgr.connect(port)
                return jsonify({"ok": True, "port": port})
            except Exception as e:
                logger.error(f"Auto-detect matched handshake but connect failed on {port}: {e}")

    # 3. Fallback: If no handshake response, try connecting to target ports anyway
    for port in target_ports:
        try:
            logger.info(f"Fallback: Connecting to likely Arduino port {port} without handshake confirmation...")
            serial_mgr.connect(port)
            return jsonify({"ok": True, "port": port})
        except Exception as e:
            logger.error(f"Fallback connection failed on {port}: {e}")

    # 4. Try handshake on other ports
    for port in other_ports:
        if serial_mgr.query_handshake(port):
            try:
                serial_mgr.connect(port)
                return jsonify({"ok": True, "port": port})
            except Exception as e:
                logger.error(f"Handshake succeeded but connection failed on {port}: {e}")

    return jsonify({"ok": False, "error": "No Arduino detected. Please select the port manually."}), 404

@app.route('/api/servo/head', methods=['POST'])
def set_servo_head():
    data = request.get_json() or {}
    neck = _clamp_servo_key('head_neck', data.get('neck', 85), 85)
    eye = _clamp_servo_key('head_eye', data.get('eye', 90), 90)
    jaw = _clamp_servo_key('head_jaw', data.get('jaw', 8), 8)

    # Form serial packet H,<neck>,<eye>,<jaw>\n
    cmd = f"H,{neck},{eye},{jaw}\n"
    sent = False
    if serial_mgr.is_connected():
        sent = serial_mgr.send_cmd(cmd)
    
    return jsonify({
        "ok": True,
        "serial_sent": sent
    })

@app.route('/api/servo/neck3', methods=['POST'])
def set_neck_3axis():
    """Controls 3-axis neck: rotation (pan), tilt (nod), roll (side-tilt)."""
    data = request.get_json() or {}
    rot  = _clamp_servo_key('neck_rot', data.get('rot', 60), 60)
    tilt = _clamp_servo_key('neck_tilt', data.get('tilt', 50), 50)
    roll = _clamp_servo_key('neck_roll', data.get('roll', 120), 120)

    # Serial protocol: N,<rot>,<tilt>,<roll>\n
    cmd = f"N,{rot},{tilt},{roll}\n"
    sent = False
    if serial_mgr.is_connected():
        sent = serial_mgr.send_cmd(cmd)

    return jsonify({
        "ok": True,
        "serial_sent": sent,
        "angles": {"rot": rot, "tilt": tilt, "roll": roll}
    })

@app.route('/api/servo/arm', methods=['POST'])
def set_servo_arm():
    """Controls one arm: shoulder, lift, rotate, elbow, wrist."""
    data = request.get_json() or {}
    side = data.get('side', 'left')
    shoulder = _clamp_angle(data.get('shoulder', 90))
    lift = _clamp_angle(data.get('lift', 45))
    rotate = _clamp_angle(data.get('rotate', 90))
    elbow = _clamp_angle(data.get('elbow', 90))
    wrist = _clamp_angle(data.get('wrist', 90))

    prefix = 'LA' if side == 'left' else 'RA'
    cmd = f"{prefix},{shoulder},{lift},{rotate},{elbow},{wrist}\n"
    sent = serial_mgr.is_connected() and serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent, "side": side})


@app.route('/api/servo/hand', methods=['POST'])
def set_servo_hand():
    """Controls one hand: thumb, index, middle, ring, pinky."""
    data = request.get_json() or {}
    side = data.get('side', 'left')
    thumb = _clamp_angle(data.get('thumb', 10))
    index = _clamp_angle(data.get('index', 10))
    middle = _clamp_angle(data.get('middle', 10))
    ring = _clamp_angle(data.get('ring', 10))
    pinky = _clamp_angle(data.get('pinky', 10))

    prefix = 'LH' if side == 'left' else 'RH'
    cmd = f"{prefix},{thumb},{index},{middle},{ring},{pinky}\n"
    sent = serial_mgr.is_connected() and serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent, "side": side})


@app.route('/api/servo/leg', methods=['POST'])
def set_servo_leg():
    """Controls one leg: hip, thigh, knee, ankle, foot."""
    data = request.get_json() or {}
    side = data.get('side', 'left')
    hip = _clamp_angle(data.get('hip', 90))
    thigh = _clamp_angle(data.get('thigh', 90))
    knee = _clamp_angle(data.get('knee', 10), hi=160)
    ankle = _clamp_angle(data.get('ankle', 90))
    foot = _clamp_angle(data.get('foot', 90))

    prefix = 'LL' if side == 'left' else 'RL'
    cmd = f"{prefix},{hip},{thigh},{knee},{ankle},{foot}\n"
    sent = serial_mgr.is_connected() and serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent, "side": side})


@app.route('/api/servo/body', methods=['POST'])
def set_servo_body():
    """Batch update arms, hands, and legs."""
    data = request.get_json() or {}

    def arm_vals(key, defaults):
        block = data.get(key, {})
        return (
            _clamp_angle(block.get('shoulder', defaults[0])),
            _clamp_angle(block.get('lift', defaults[1])),
            _clamp_angle(block.get('rotate', defaults[2])),
            _clamp_angle(block.get('elbow', defaults[3])),
            _clamp_angle(block.get('wrist', defaults[4])),
        )

    def hand_vals(key):
        block = data.get(key, {})
        return (
            _clamp_angle(block.get('thumb', 10)),
            _clamp_angle(block.get('index', 10)),
            _clamp_angle(block.get('middle', 10)),
            _clamp_angle(block.get('ring', 10)),
            _clamp_angle(block.get('pinky', 10)),
        )

    def leg_vals(key):
        block = data.get(key, {})
        return (
            _clamp_angle(block.get('hip', 90)),
            _clamp_angle(block.get('thigh', 90)),
            _clamp_angle(block.get('knee', 10), hi=160),
            _clamp_angle(block.get('ankle', 90)),
            _clamp_angle(block.get('foot', 90)),
        )

    la = arm_vals('leftArm', (90, 45, 90, 90, 90))
    ra = arm_vals('rightArm', (90, 45, 90, 90, 90))
    lh = hand_vals('leftHand')
    rh = hand_vals('rightHand')
    ll = leg_vals('leftLeg')
    rl = leg_vals('rightLeg')

    parts = [
        f"LA,{la[0]},{la[1]},{la[2]},{la[3]},{la[4]}",
        f"RA,{ra[0]},{ra[1]},{ra[2]},{ra[3]},{ra[4]}",
        f"LH,{lh[0]},{lh[1]},{lh[2]},{lh[3]},{lh[4]}",
        f"RH,{rh[0]},{rh[1]},{rh[2]},{rh[3]},{rh[4]}",
        f"LL,{ll[0]},{ll[1]},{ll[2]},{ll[3]},{ll[4]}",
        f"RL,{rl[0]},{rl[1]},{rl[2]},{rl[3]},{rl[4]}",
    ]
    sent = False
    if serial_mgr.is_connected():
        for part in parts:
            sent = serial_mgr.send_cmd(part + '\n') or sent

    return jsonify({"ok": True, "serial_sent": sent})


@app.route('/api/servo/combined6', methods=['POST'])
def set_combined_6axis():
    """Controls all 6 servos: Head (neck, eye, jaw) and Neck (rot, tilt, roll)."""
    data = request.get_json() or {}
    hn = _clamp_servo_key('head_neck', data.get('headNeck', 85), 85)
    he = _clamp_servo_key('head_eye', data.get('headEye', 90), 90)
    hj = _clamp_servo_key('head_jaw', data.get('headJaw', 8), 8)
    nr = _clamp_servo_key('neck_rot', data.get('neckRot', 60), 60)
    nt = _clamp_servo_key('neck_tilt', data.get('neckTilt', 50), 50)
    nro = _clamp_servo_key('neck_roll', data.get('neckRoll', 120), 120)

    # Serial protocol: C,<hn>,<he>,<hj>,<nr>,<nt>,<nro>\n
    cmd = f"C,{hn},{he},{hj},{nr},{nt},{nro}\n"
    sent = False
    if serial_mgr.is_connected():
        sent = serial_mgr.send_cmd(cmd)

    return jsonify({
        "ok": True,
        "serial_sent": sent
    })

@app.route('/api/serial/raw', methods=['POST'])
def send_raw_serial():
    """Send a raw serial command string to the Arduino (for testing)."""
    data = request.get_json() or {}
    cmd = (data.get('cmd') or '').strip()
    if not cmd:
        return jsonify({"ok": False, "error": "Empty command"}), 400
    if cmd not in ('?', 'S', 'R') and not cmd.endswith('\n'):
        cmd += '\n'
    sent = False
    if serial_mgr.is_connected():
        sent = serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent, "cmd": cmd.strip()})


@app.route('/api/servo/neck3/stop', methods=['POST'])
def neck_emergency_stop():
    """Sends emergency center command to neck servos."""
    logger.warning("NECK EMERGENCY STOP TRIGGERED")
    cmd = "S"
    sent = False
    if serial_mgr.is_connected():
        sent = serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent})

@app.route('/api/scripts/stop', methods=['POST'])
def emergency_stop():
    logger.warning("EMERGENCY STOP TRIGGERED")
    # Centering command to safety reset
    cmd = "H,85,90,8\n"
    if serial_mgr.is_connected():
        serial_mgr.send_cmd(cmd)
    serial_mgr.disconnect()
    return jsonify({"ok": True})

@app.route('/api/servo/config', methods=['GET'])
def get_servo_config():
    cfg = _reload_servo_config()
    if cfg:
        return jsonify({"ok": True, **cfg})
    return jsonify({"ok": False, "error": "servo_config.json missing — run scripts/extract_mrl_inmoov.py"}), 404


@app.route('/api/servo/pins', methods=['GET', 'POST'])
def servo_pins():
    if request.method == 'GET':
        return jsonify({"ok": True, "pins": _read_json(PIN_OVERRIDES_PATH, {})})

    data = request.get_json() or {}
    pins = data.get('pins') or {}
    if not isinstance(pins, dict):
        return jsonify({"ok": False, "error": "pins must be an object"}), 400

    cleaned = {k: int(v) for k, v in pins.items() if 2 <= int(v) <= 53}
    _write_json(PIN_OVERRIDES_PATH, cleaned)
    _reload_servo_config()

    sent = []
    if serial_mgr.is_connected() and data.get('applyToFirmware', True):
        for s in SERVO_CONFIG.get('servos', []):
            key = s.get('key')
            if key in cleaned:
                cmd = f"W,{s['id']},{cleaned[key]}\n"
                if serial_mgr.send_cmd(cmd):
                    sent.append(key)

    return jsonify({"ok": True, "pins": cleaned, "firmware_applied": sent})


@app.route('/api/servo/pin', methods=['POST'])
def set_servo_pin():
    data = request.get_json() or {}
    key = (data.get('key') or '').strip()
    pin = int(data.get('pin', 0))
    servo = _servo_by_key(key)
    if not servo:
        return jsonify({"ok": False, "error": f"Unknown servo: {key}"}), 400
    if pin < 2 or pin > 53:
        return jsonify({"ok": False, "error": "Pin must be 2–53"}), 400

    overrides = _read_json(PIN_OVERRIDES_PATH, {})
    overrides[key] = pin
    _write_json(PIN_OVERRIDES_PATH, overrides)
    _reload_servo_config()

    sent = False
    if serial_mgr.is_connected():
        sent = serial_mgr.send_cmd(f"W,{servo['id']},{pin}\n")
    return jsonify({"ok": True, "key": key, "pin": pin, "serial_sent": sent})


@app.route('/api/servo/calibration', methods=['GET', 'POST'])
def servo_calibration():
    if request.method == 'GET':
        return jsonify({"ok": True, "calibration": _read_json(CALIB_OVERRIDES_PATH, {})})

    data = request.get_json() or {}
    cal = data.get('calibration') or {}
    if not isinstance(cal, dict):
        return jsonify({"ok": False, "error": "calibration must be an object"}), 400

    cleaned = {}
    for key, vals in cal.items():
        if not isinstance(vals, dict):
            continue
        entry = {}
        for field in ('min', 'max', 'rest'):
            if field in vals:
                entry[field] = max(0, min(180, int(vals[field])))
        if entry:
            cleaned[key] = entry

    _write_json(CALIB_OVERRIDES_PATH, cleaned)
    _reload_servo_config()

    sent = []
    if serial_mgr.is_connected() and data.get('applyToFirmware', True):
        for s in SERVO_CONFIG.get('servos', []):
            key = s.get('key')
            if key in cleaned:
                v = cleaned[key]
                mn = v.get('min', s['min'])
                mx = v.get('max', s['max'])
                rs = v.get('rest', s['rest'])
                cmd = f"U,{s['id']},{mn},{mx},{rs}\n"
                if serial_mgr.send_cmd(cmd):
                    sent.append(key)

    return jsonify({"ok": True, "calibration": cleaned, "firmware_applied": sent})


@app.route('/api/servo/limits', methods=['POST'])
def set_servo_limits():
    data = request.get_json() or {}
    key = (data.get('key') or '').strip()
    servo = _servo_by_key(key)
    if not servo:
        return jsonify({"ok": False, "error": f"Unknown servo: {key}"}), 400

    mn = max(0, min(180, int(data.get('min', servo['min']))))
    mx = max(0, min(180, int(data.get('max', servo['max']))))
    rs = max(0, min(180, int(data.get('rest', servo['rest']))))
    if mn > mx:
        return jsonify({"ok": False, "error": "min must be <= max"}), 400
    rs = max(mn, min(mx, rs))

    overrides = _read_json(CALIB_OVERRIDES_PATH, {})
    overrides[key] = {"min": mn, "max": mx, "rest": rs}
    _write_json(CALIB_OVERRIDES_PATH, overrides)
    _reload_servo_config()

    sent = False
    if serial_mgr.is_connected():
        sent = serial_mgr.send_cmd(f"U,{servo['id']},{mn},{mx},{rs}\n")
    return jsonify({"ok": True, "key": key, "min": mn, "max": mx, "rest": rs, "serial_sent": sent})


@app.route('/api/servo/grip', methods=['POST'])
def servo_grip():
    data = request.get_json() or {}
    side = (data.get('side') or 'B').strip().upper()[:1]
    pct = max(0, min(100, int(data.get('percent', 80))))
    if side not in ('L', 'R', 'B'):
        return jsonify({"ok": False, "error": "side must be L, R, or B"}), 400
    cmd = f"K,{side},{pct}\n"
    sent = serial_mgr.is_connected() and serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent, "side": side, "percent": pct})


@app.route('/api/servo/enable', methods=['GET', 'POST'])
def servo_enable():
    groups = (SERVO_CONFIG or {}).get('bodyPartGroups', {})
    if request.method == 'GET':
        return jsonify({"ok": True, "groups": groups, "mask": 255})

    data = request.get_json() or {}
    enabled = data.get('enabled') or {}
    mask = 0
    for gkey, gdef in groups.items():
        if enabled.get(gkey, True):
            mask |= int(gdef.get('bit', 0))
    cmd = f"E,{mask}\n"
    sent = serial_mgr.is_connected() and serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent, "mask": mask, "enabled": enabled})


@app.route('/api/servo/wave-patterns', methods=['GET'])
def get_wave_patterns():
    patterns = _read_json(WAVE_PATTERNS_PATH, [])
    return jsonify({"ok": True, "patterns": patterns})


@app.route('/api/servo/apply-vdb-pins', methods=['POST'])
def apply_vdb_pins():
    """Apply VDB upper-body wiring profile (DS5160 arms on pins 22-29)."""
    vdb_map = {
        "l_shoulder": 22, "l_lift": 24, "l_elbow": 26, "l_rotate": 28,
        "r_shoulder": 23, "r_lift": 25, "r_elbow": 27, "r_rotate": 29,
    }
    _write_json(PIN_OVERRIDES_PATH, vdb_map)
    _reload_servo_config()
    sent = []
    if serial_mgr.is_connected():
        for s in SERVO_CONFIG.get('servos', []):
            key = s.get('key')
            if key in vdb_map:
                if serial_mgr.send_cmd(f"W,{s['id']},{vdb_map[key]}\n"):
                    sent.append(key)
    return jsonify({"ok": True, "pins": vdb_map, "firmware_applied": sent, "profile": "vdb_upper_body"})


@app.route('/api/servo/pattern', methods=['POST'])
def run_firmware_pattern():
    """Trigger a built-in pattern on the Arduino firmware (nod, shake, yes, no, bow, relax)."""
    data = request.get_json() or {}
    name = (data.get('name') or '').strip().lower()
    if not name:
        return jsonify({"ok": False, "error": "Pattern name required"}), 400
    allowed = set((SERVO_CONFIG or {}).get('patterns', {}).keys())
    if allowed and name not in allowed:
        return jsonify({"ok": False, "error": f"Unknown pattern. Available: {', '.join(sorted(allowed))}"}), 400
    cmd = f"G,{name}\n"
    sent = serial_mgr.is_connected() and serial_mgr.send_cmd(cmd)
    return jsonify({"ok": True, "serial_sent": sent, "pattern": name})


@app.route('/api/config', methods=['GET'])
def get_config():
    return jsonify({
        "gemini_api_key": GEMINI_API_KEY,
        "gemini_configured": bool(GEMINI_API_KEY),
        "app_name": "InMoov Control Center",
        "firmware": "full_body_servo_control.ino",
        "firmware_head_only": "full_body_servo_control.ino (define HEAD_ONLY)",
        "baud_rate": 9600,
        "servo_count": (SERVO_CONFIG or {}).get('servoCount', 36),
        "mrl_version": (SERVO_CONFIG or {}).get('version', '1.1.1610'),
        "mrl_url": MRL_BASE_URL,
    })


def _mrl_request(method, path, json_body=None, timeout=15):
    """Forward a request to the live MyRobotLab REST API."""
    url = f"{MRL_BASE_URL}/api/{path.lstrip('/')}"
    try:
        if method == 'POST':
            resp = requests.post(url, json=json_body, timeout=timeout)
        else:
            resp = requests.get(url, timeout=timeout)
        content_type = resp.headers.get('Content-Type', '')
        if 'application/json' in content_type:
            try:
                data = resp.json()
            except Exception:
                data = resp.text
        else:
            data = resp.text
        return {"ok": resp.status_code < 400, "status": resp.status_code, "data": data}
    except requests.exceptions.ConnectionError:
        return {"ok": False, "status": 503, "error": f"MyRobotLab not reachable at {MRL_BASE_URL}"}
    except requests.exceptions.Timeout:
        return {"ok": False, "status": 504, "error": "MyRobotLab request timed out"}
    except Exception as e:
        logger.error(f"MRL proxy error: {e}")
        return {"ok": False, "status": 500, "error": str(e)}


@app.route('/api/mrl/status', methods=['GET'])
def mrl_status():
    version = _mrl_request('GET', 'service/runtime/getVersion')
    services = _mrl_request('GET', 'service/runtime/getServiceNames')
    state = _mrl_request('GET', 'service/i01/getState')
    online = version.get('ok') and services.get('ok')
    svc_list = services.get('data') if isinstance(services.get('data'), list) else []
    return jsonify({
        "ok": online,
        "online": online,
        "url": MRL_BASE_URL,
        "version": version.get('data'),
        "serviceCount": len(svc_list),
        "services": svc_list,
        "i01State": state.get('data'),
        "error": version.get('error') or services.get('error'),
    })


@app.route('/api/mrl/services', methods=['GET'])
def mrl_services():
    result = _mrl_request('GET', 'service/runtime/getServiceNames')
    if not result.get('ok'):
        return jsonify(result), result.get('status', 503)
    services = result.get('data') or []
    grouped = {}
    for name in services:
        parts = name.split('.')
        root = parts[0] if parts else name
        grouped.setdefault(root, []).append(name)
    return jsonify({"ok": True, "services": services, "grouped": grouped, "count": len(services)})


@app.route('/api/mrl/proxy/<path:subpath>', methods=['GET', 'POST'])
def mrl_proxy(subpath):
    result = _mrl_request(
        request.method,
        subpath,
        json_body=request.get_json(silent=True) if request.method == 'POST' else None,
    )
    status = result.get('status', 200 if result.get('ok') else 500)
    return jsonify(result), status


@app.route('/api/mrl/call/<path:service>/<method>', methods=['GET', 'POST'])
@app.route('/api/mrl/call/<path:service>/<method>/<path:args>', methods=['GET', 'POST'])
def mrl_call(service, method, args=None):
    """Convenience wrapper: /api/mrl/call/i01.head.neck/moveTo/90"""
    path = f"service/{service}/{method}"
    if args:
        path = f"{path}/{args}"
    result = _mrl_request(request.method, path, json_body=request.get_json(silent=True))
    status = result.get('status', 200 if result.get('ok') else 500)
    return jsonify(result), status


@app.route('/api/mrl/gestures', methods=['GET'])
def mrl_gestures():
    data = _read_json(MRL_GESTURES_PATH, {})
    gestures = []
    for gid, g in data.items():
        gestures.append({
            "id": gid,
            "mrlName": g.get('mrlName', gid.replace('mrl-', '')),
            "name": g.get('name', gid),
            "category": g.get('category', 'full'),
            "icon": g.get('icon', ''),
        })
    gestures.sort(key=lambda x: x['name'].lower())
    return jsonify({"ok": True, "gestures": gestures, "count": len(gestures)})


@app.route('/api/mrl/exec', methods=['POST'])
@app.route('/api/mrl/exec/<gesture>', methods=['GET', 'POST'])
def mrl_exec(gesture=None):
    if request.method == 'POST' and not gesture:
        body = request.get_json() or {}
        gesture = body.get('gesture') or body.get('mrlName')
    if not gesture:
        return jsonify({"ok": False, "error": "Gesture name required"}), 400
    gesture = gesture.strip()
    if gesture.startswith('mrl-'):
        gesture = gesture[4:]
    script = f"i01.{gesture}()"
    result = _mrl_request('GET', f"service/python/exec/{script}", timeout=60)
    return jsonify({
        "ok": result.get('ok'),
        "gesture": gesture,
        "script": script,
        "result": result.get('data'),
        "error": result.get('error'),
    }), result.get('status', 200 if result.get('ok') else 500)


@app.route('/api/mrl/servo/<path:service>/state', methods=['GET'])
def mrl_servo_state(service):
    """Aggregate common ServoGui fields for one MRL servo service."""
    fields = ('getPin', 'getMin', 'getMax', 'getRest', 'getSpeed', 'getPosition', 'isAttached', 'isSweeping')
    state = {"service": service}
    for field in fields:
        r = _mrl_request('GET', f"service/{service}/{field}")
        state[field] = r.get('data')
    state['ok'] = True
    return jsonify(state)


# Known MRL i01 servo services for the body map
MRL_I01_SERVOS = [
    {"service": "i01.head.rothead", "label": "Head pan", "group": "head"},
    {"service": "i01.head.neck", "label": "Head tilt", "group": "head"},
    {"service": "i01.head.rollNeck", "label": "Head roll", "group": "head"},
    {"service": "i01.head.eyeX", "label": "Eye X", "group": "head"},
    {"service": "i01.head.eyeY", "label": "Eye Y", "group": "head"},
    {"service": "i01.head.jaw", "label": "Jaw", "group": "head"},
    {"service": "i01.head.eyelidLeft", "label": "Eyelid L", "group": "head"},
    {"service": "i01.head.eyelidRight", "label": "Eyelid R", "group": "head"},
    {"service": "i01.leftArm.shoulder", "label": "L shoulder", "group": "leftArm"},
    {"service": "i01.leftArm.omoplate", "label": "L omoplate", "group": "leftArm"},
    {"service": "i01.leftArm.rotate", "label": "L rotate", "group": "leftArm"},
    {"service": "i01.leftArm.bicep", "label": "L bicep", "group": "leftArm"},
    {"service": "i01.rightArm.shoulder", "label": "R shoulder", "group": "rightArm"},
    {"service": "i01.rightArm.omoplate", "label": "R omoplate", "group": "rightArm"},
    {"service": "i01.rightArm.rotate", "label": "R rotate", "group": "rightArm"},
    {"service": "i01.rightArm.bicep", "label": "R bicep", "group": "rightArm"},
    {"service": "i01.torso.topStom", "label": "Torso top", "group": "torso"},
    {"service": "i01.torso.midStom", "label": "Torso mid", "group": "torso"},
    {"service": "i01.torso.lowStom", "label": "Torso low", "group": "torso"},
]


@app.route('/api/mrl/i01/servos', methods=['GET'])
def mrl_i01_servos():
    return jsonify({"ok": True, "servos": MRL_I01_SERVOS})


@app.route('/api/mrl/assets/<path:filename>')
def mrl_assets(filename):
    """Serve original MyRobotLab WebGui assets (InMoov2 images, icons)."""
    path = os.path.join(MRL_WEBGUI_ROOT, filename.replace('/', os.sep))
    if os.path.isfile(path):
        return send_file(path)
    return jsonify({"ok": False, "error": f"Asset not found: {filename}"}), 404


@app.route('/api/mrl/i01/config', methods=['GET'])
def mrl_i01_config():
    result = _mrl_request('GET', 'service/i01/getConfig')
    return jsonify(result), result.get('status', 200 if result.get('ok') else 503)


@app.route('/api/mrl/i01/peer/<action>/<peer>', methods=['GET', 'POST'])
def mrl_i01_peer(action, peer):
    """startPeer / releasePeer on i01."""
    if action not in ('startPeer', 'releasePeer'):
        return jsonify({"ok": False, "error": "action must be startPeer or releasePeer"}), 400
    result = _mrl_request('GET', f'service/i01/{action}/{peer}')
    return jsonify({"ok": result.get('ok'), "peer": peer, "action": action, "result": result.get('data'), "error": result.get('error')}), result.get('status', 200)


@app.route('/api/mrl/i01/speak', methods=['POST'])
def mrl_i01_speak():
    data = request.get_json() or {}
    text = (data.get('text') or '').strip()
    if not text:
        return jsonify({"ok": False, "error": "text required"}), 400
    result = _mrl_request('GET', f'service/i01/speakBlocking/{requests.utils.quote(text, safe="")}')
    return jsonify({"ok": result.get('ok'), "text": text, "error": result.get('error')})


@app.route('/api/mrl/python/exec', methods=['POST'])
def mrl_python_exec():
    data = request.get_json() or {}
    script = (data.get('script') or '').strip()
    if not script:
        return jsonify({"ok": False, "error": "script required"}), 400
    result = _mrl_request('GET', f'service/python/exec/{script}', timeout=120)
    return jsonify({"ok": result.get('ok'), "script": script, "result": result.get('data'), "error": result.get('error')}), result.get('status', 200 if result.get('ok') else 500)

@app.route('/api/conversation', methods=['POST'])
def handle_conversation():
    data = request.get_json() or {}
    message = data.get('message', '')
    model_provider = data.get('model_provider', 'gemini-text')
    image = data.get('image') # Base64 data URL
    local_url = data.get('local_url', 'http://localhost:11434')
    language = data.get('language', 'en-US')  # Language code: en-US, hi-IN, gu-IN
    api_key = data.get('api_key') or GEMINI_API_KEY or os.environ.get('GEMINI_API_KEY')
    
    if not message:
        return jsonify({"ok": False, "error": "Message is empty"}), 400

    # Strip data URI prefix if present
    raw_base64_image = None
    if image:
        try:
            if ',' in image:
                raw_base64_image = image.split(',')[1]
            else:
                raw_base64_image = image
        except Exception as e:
            logger.error(f"Failed to parse base64 image: {e}")

    # Language instruction appended to system prompt
    LANGUAGE_NAMES = {
        'en-US': 'English',
        'hi-IN': 'Hindi',
        'gu-IN': 'Gujarati',
    }
    lang_name = LANGUAGE_NAMES.get(language, 'English')
    lang_instruction = (
        f" You MUST reply ONLY in {lang_name}. "
        f"If the user speaks {lang_name}, respond in {lang_name}. "
        "Do NOT switch to English unless the user asks you to."
    ) if language != 'en-US' else ''

    system_prompt = (
        "You are InMoov, a friendly physical humanoid robot conversing with a human. "
        "Keep your replies friendly, natural, and very short (1-2 sentences maximum, suitable for voice text-to-speech output). "
        "Choose one of the following physical moods matching your emotional state: "
        "'happy', 'surprised', 'thinking', 'sad', or 'normal'. "
        "You MUST output response in JSON format with exact keys 'text' (reply) and 'mood' (mood string)."
        + lang_instruction
    )

    if model_provider == 'llama-vision':
        # Local Llama 3.2 Vision via Ollama
        ollama_endpoint = f"{local_url.rstrip('/')}/api/chat"
        
        payload = {
            "model": "llama3.2-vision",
            "messages": [
                {
                    "role": "user",
                    "content": f"{system_prompt} User says: \"{message}\"",
                }
            ],
            "stream": False,
            "format": "json"
        }
        
        if raw_base64_image:
            payload["messages"][0]["images"] = [raw_base64_image]
            payload["messages"][0]["content"] += " Feel free to reference their snapshot, surroundings, or what they are holding."
            
        try:
            logger.info(f"Sending message to local Ollama model (llama3.2-vision) at {ollama_endpoint}")
            response = requests.post(ollama_endpoint, json=payload, timeout=90)
            
            if response.status_code != 200:
                logger.error(f"Ollama returned status code {response.status_code}: {response.text}")
                return jsonify({"ok": False, "error": f"Ollama error (Status {response.status_code}): {response.text}"}), 500
                
            res_data = response.json()
            raw_text = res_data['message']['content']
            logger.info(f"Ollama response text: {raw_text}")
            
            import json
            structured_data = json.loads(raw_text.strip())
            return jsonify({
                "ok": True,
                "text": structured_data.get('text', ''),
                "mood": structured_data.get('mood', 'normal')
            })
        except Exception as e:
            logger.error(f"Error calling local Ollama API: {e}")
            return jsonify({"ok": False, "error": f"Failed to connect to local Ollama at {ollama_endpoint}. Make sure Ollama is running and 'llama3.2-vision' is installed. Error: {str(e)}"}), 500

    else:
        # Gemini Text or Gemini Vision - with automatic model fallback chain
        if not api_key:
            return jsonify({"ok": False, "error": "Gemini API key is missing. Please provide it on the dashboard or set the GEMINI_API_KEY environment variable."}), 400

        # Priority list of models to try - if one is quota-exhausted or unavailable,
        # the system automatically falls back to the next model in the chain.
        GEMINI_MODEL_FALLBACK_CHAIN = [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite",
        ]
        
        # Build the shared contents payload (same for all models)
        parts = [{"text": system_prompt}]
        
        # If Gemini Vision is requested and image is present
        if model_provider == 'gemini-vision' and raw_base64_image:
            parts.append({
                "inlineData": {
                    "mimeType": "image/jpeg",
                    "data": raw_base64_image
                }
            })
            parts[0]["text"] += " You are also given a live webcam snapshot of your user. Feel free to reference their expression, what they are holding, or their surroundings."
            
        parts.append({"text": f"User says: \"{message}\""})
        
        payload = {
            "contents": [{"parts": parts}]
        }

        last_error = None
        import json

        for model_name in GEMINI_MODEL_FALLBACK_CHAIN:
            # Use v1beta for broadest model support (all flash/pro variants work)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            try:
                logger.info(f"Sending message to Gemini API (Model: {model_name})")
                headers = {"Content-Type": "application/json"}
                response = requests.post(url, json=payload, headers=headers, timeout=12)
                
                if response.status_code == 429 or response.status_code == 503:
                    # Quota exceeded or model overloaded - try next model
                    logger.warning(f"Model {model_name} returned {response.status_code}. Trying next model...")
                    last_error = f"{model_name} returned status {response.status_code}"
                    continue

                if response.status_code != 200:
                    logger.error(f"Gemini API ({model_name}) returned status code {response.status_code}: {response.text}")
                    last_error = f"Gemini API error on {model_name} (Status {response.status_code})"
                    continue
                    
                res_data = response.json()
                raw_text = res_data['candidates'][0]['content']['parts'][0]['text']
                logger.info(f"Gemini response from {model_name}: {raw_text}")
                
                # Clean and parse JSON from raw text (handles raw JSON and markdown code blocks)
                cleaned_text = raw_text.strip()
                if cleaned_text.startswith("```"):
                    lines = cleaned_text.splitlines()
                    if lines[0].startswith("```"):
                        lines = lines[1:]
                    if lines and lines[-1].startswith("```"):
                        lines = lines[:-1]
                    cleaned_text = "\n".join(lines).strip()

                try:
                    structured_data = json.loads(cleaned_text)
                    return jsonify({
                        "ok": True,
                        "text": structured_data.get('text', ''),
                        "mood": structured_data.get('mood', 'normal'),
                        "model_used": model_name
                    })
                except json.JSONDecodeError:
                    logger.warning(f"Failed to parse structured JSON from {model_name}, returning raw text")
                    return jsonify({"ok": True, "text": raw_text, "mood": "normal", "model_used": model_name})

            except Exception as e:
                logger.error(f"Exception calling Gemini model {model_name}: {e}")
                last_error = str(e)
                continue  # Try next model

        # All models exhausted - return final error
        logger.error(f"All Gemini models exhausted. Last error: {last_error}")
        return jsonify({"ok": False, "error": f"All Gemini models are currently unavailable or quota-exceeded. Last error: {last_error}"}), 503

if __name__ == '__main__':
    logger.info("InMoov Control Center → http://localhost:5000")
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — AI chat requires a key in .env or Settings tab")
    app.run(host='0.0.0.0', port=5000, debug=False)
