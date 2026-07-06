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
        VALID_TOKENS = ["ARDUINO_OK", "NECK_OK", "NECK_READY", "INMOOV_OK"]
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

@app.route('/models/<path:filename>')
def serve_model(filename):
    """Serve 3D model files (GLB/GLTF) from the project directory."""
    model_path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.exists(model_path):
        return send_file(model_path, mimetype='model/gltf-binary')
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
    neck = data.get('neck', 85)
    eye = data.get('eye', 90)
    jaw = data.get('jaw', 8)

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
    rot  = int(data.get('rot',  60))   # Left/Right rotation
    tilt = int(data.get('tilt', 50))   # Up/Down tilt
    roll = int(data.get('roll', 120))   # Side-to-side roll

    # Clamp to 0-180 range
    rot  = max(0, min(180, rot))
    tilt = max(0, min(180, tilt))
    roll = max(0, min(180, roll))

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

@app.route('/api/servo/combined6', methods=['POST'])
def set_combined_6axis():
    """Controls all 6 servos: Head (neck, eye, jaw) and Neck (rot, tilt, roll)."""
    data = request.get_json() or {}
    hn = int(data.get('headNeck', 85))
    he = int(data.get('headEye', 90))
    hj = int(data.get('headJaw', 8))
    nr = int(data.get('neckRot', 60))
    nt = int(data.get('neckTilt', 50))
    nro = int(data.get('neckRoll', 120))

    # Clamp neck values to 0-180 range
    nr = max(0, min(180, nr))
    nt = max(0, min(180, nt))
    nro = max(0, min(180, nro))

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

@app.route('/api/config', methods=['GET'])
def get_config():
    return jsonify({
        "gemini_api_key": GEMINI_API_KEY,
        "gemini_configured": bool(GEMINI_API_KEY),
        "app_name": "InMoov Control Center",
        "firmware": "combined_servo_control.ino",
        "baud_rate": 9600,
    })

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
