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
GESTURES_PATH = os.path.join(BASE_DIR, 'shared', 'gestures.json')
if not os.path.isfile(GESTURES_PATH):
    GESTURES_PATH = os.path.join(BASE_DIR, 'shared', 'mrl_gestures.json')

# Native InMoove Core (no external MyRobotLab / Java process)
from inmoove_core import get_core  # noqa: E402


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


def _normalize_pwm_angle(val, default=90):
    """Hobby servos use 0–180° PWM. Map 360-style input into that range."""
    try:
        n = int(round(float(val)))
    except (TypeError, ValueError):
        return int(default)
    # Continuous / user typed 360 → full travel 180
    if n > 180:
        # 0–360 continuous: map proportionally into 0–180
        if n <= 360:
            n = int(round(n * 180.0 / 360.0))
        else:
            n = 180
    if n < 0:
        n = 0
    return n


def _sanitize_limits(mn, mx, rs, default_rest=90):
    """Absolute PWM walls 0–180. User calibration may expand past factory defaults."""
    mn = _normalize_pwm_angle(mn, 0)
    mx = _normalize_pwm_angle(mx, 180)
    rs = _normalize_pwm_angle(rs, default_rest)
    if mn > mx:
        mn, mx = mx, mn
    rs = max(mn, min(mx, rs))
    return mn, mx, rs


def _load_servo_config():
    """Load canonical servo map with user pin/calibration overrides applied.

    User calibration (calibration_overrides.json) is authoritative for min/max/rest
    within absolute PWM range 0–180. Factory values are defaults only.
    """
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
        factory_min = int(entry.get('min', 0))
        factory_max = int(entry.get('max', 180))
        factory_rest = int(entry.get('rest', 90))
        entry['factoryMin'] = factory_min
        entry['factoryMax'] = factory_max
        if key in pin_ov:
            entry['pin'] = int(pin_ov[key])
            entry['pinOverride'] = True
        if key in cal_ov:
            ov = cal_ov[key] or {}
            mn = int(ov.get('min', factory_min))
            mx = int(ov.get('max', factory_max))
            rs = int(ov.get('rest', factory_rest))
            mn, mx, rs = _sanitize_limits(mn, mx, rs, factory_rest)
            entry['min'] = mn
            entry['max'] = mx
            entry['rest'] = rs
            entry['calibrationSource'] = 'user'
        else:
            # Still clamp factory to PWM walls
            mn, mx, rs = _sanitize_limits(factory_min, factory_max, factory_rest, factory_rest)
            entry['min'] = mn
            entry['max'] = mx
            entry['rest'] = rs
        servos.append(entry)
    base['servos'] = servos
    base['pinOverrides'] = pin_ov
    base['calibrationOverrides'] = cal_ov
    return base


def _reload_servo_config():
    global SERVO_CONFIG
    SERVO_CONFIG = _load_servo_config()
    # Keep native core virtual servos in sync with pin/limit overrides
    try:
        from inmoove_core.runtime import get_core as _gc
        core = _gc(project_root=BASE_DIR)
        if core is not None and hasattr(core, "_rebuild_servos"):
            core._rebuild_servos()
    except Exception as e:
        logger.debug("core rebuild after config reload: %s", e)
    return SERVO_CONFIG


SERVO_CONFIG = _load_servo_config()


def _servo_by_key(key):
    if not SERVO_CONFIG:
        return None
    for s in SERVO_CONFIG.get('servos', []):
        if s.get('key') == key:
            return s
    return None


def _pin_conflicts(cfg=None):
    """Return list of {pin, keys} where more than one servo shares a Mega pin."""
    cfg = cfg or SERVO_CONFIG or {}
    by_pin = {}
    for s in cfg.get("servos", []):
        pin = int(s.get("pin", 0))
        if pin < 2:
            continue
        by_pin.setdefault(pin, []).append(s.get("key"))
    return [{"pin": p, "keys": keys} for p, keys in sorted(by_pin.items()) if len(keys) > 1]


def _push_config_to_firmware(include_limits=True, include_pins=True):
    """After USB connect (or pin save), push pins + limits so board matches software."""
    result = {
        "pins": [],
        "limits": [],
        "failed_pins": [],
        "failed_limits": [],
        "conflicts": [],
        "ok": True,
        "connected": serial_mgr.is_connected(),
    }
    if not serial_mgr.is_connected():
        result["ok"] = False
        result["error"] = "serial not connected"
        return result

    cfg = SERVO_CONFIG or _reload_servo_config() or {}
    conflicts = _pin_conflicts(cfg)
    result["conflicts"] = conflicts
    if conflicts:
        logger.warning("Pin conflicts before firmware sync: %s", conflicts)

    # Bulk mode: never auto-drop COM while programming pins/limits
    serial_mgr.begin_batch()
    try:
        # Heavy motors first (arms), then head/neck, hands, legs — reduces brownouts
        order_groups = (
            "leftArm",
            "rightArm",
            "head",
            "neck",
            "leftHand",
            "rightHand",
            "leftLeg",
            "rightLeg",
        )
        servos_sorted = []
        for g in order_groups:
            servos_sorted.extend([s for s in cfg.get("servos", []) if s.get("group") == g])
        seen = {s.get("key") for s in servos_sorted}
        servos_sorted.extend([s for s in cfg.get("servos", []) if s.get("key") not in seen])

        for s in servos_sorted:
            if not serial_mgr.is_connected():
                result["ok"] = False
                result["error"] = "USB dropped during firmware sync"
                break
            key = s.get("key")
            sid = s.get("id")
            if sid is None:
                continue
            if include_pins:
                pin = int(s.get("pin", 0))
                if 2 <= pin <= 53:
                    ok = serial_mgr.send_cmd(f"W,{sid},{pin}\n", drain=True, wait_ms=20)
                    if ok:
                        result["pins"].append(key)
                    else:
                        # One retry after settle
                        time.sleep(0.08)
                        ok = serial_mgr.send_cmd(f"W,{sid},{pin}\n", drain=True, wait_ms=30)
                        if ok:
                            result["pins"].append(key)
                        else:
                            result["failed_pins"].append(key)
                    time.sleep(0.055)  # rebindPin delay on Mega
            if include_limits:
                mn, mx, rs = _sanitize_limits(s["min"], s["max"], s["rest"], s.get("rest", 90))
                ok = serial_mgr.send_cmd(f"U,{sid},{mn},{mx},{rs}\n", drain=True, wait_ms=10)
                if ok:
                    result["limits"].append(key)
                else:
                    time.sleep(0.05)
                    ok = serial_mgr.send_cmd(f"U,{sid},{mn},{mx},{rs}\n", drain=True)
                    if ok:
                        result["limits"].append(key)
                    else:
                        result["failed_limits"].append(key)
                time.sleep(0.025)

        if serial_mgr.is_connected():
            serial_mgr.send_cmd("E,255\n", drain=True)
            time.sleep(0.05)
            # Soft rest — avoid slamming all heavy servos at once
            serial_mgr.send_cmd("S\n", drain=True)
    finally:
        serial_mgr.end_batch()

    result["ok"] = (
        serial_mgr.is_connected()
        and not result["failed_pins"]
        and not result["failed_limits"]
    )
    result["connected"] = serial_mgr.is_connected()
    logger.info(
        "Firmware sync: pins ok=%s fail=%s limits ok=%s fail=%s conflicts=%s connected=%s",
        len(result["pins"]),
        len(result["failed_pins"]),
        len(result["limits"]),
        len(result["failed_limits"]),
        len(conflicts),
        serial_mgr.is_connected(),
    )
    return result


def _send_move_by_key(key, angle):
    """
    Move one servo by config key over serial.
    Uses firmware M,<id>,<angle> when possible, else group packets.
    Accepts 0–360 style input and maps into this servo's min–max (PWM 0–180).
    """
    s = _servo_by_key(key)
    if not s:
        return {"ok": False, "error": f"Unknown servo: {key}", "serial_sent": False}

    raw_in = angle
    note = None
    try:
        if int(angle) > 180:
            note = f"Mapped {int(angle)}° → PWM range (hobby servos are 0–180°)"
    except (TypeError, ValueError):
        pass
    angle = _clamp_servo_key(key, angle, s.get("rest", 90))

    if not serial_mgr.is_connected():
        return {
            "ok": False,
            "error": "USB not connected — open Studio → USB and Connect first",
            "key": key,
            "angle": angle,
            "requested": raw_in,
            "serial_sent": False,
            "note": note,
        }

    pin = int(s.get("pin", 0))
    conflicts = [c for c in _pin_conflicts() if c["pin"] == pin]
    sid = int(s["id"])

    # Single M command — quiet, no disconnect on one glitch
    sent = serial_mgr.send_cmd(f"M,{sid},{int(angle)}\n", drain=True, wait_ms=15)
    if not sent:
        time.sleep(0.05)
        sent = serial_mgr.send_cmd(f"M,{sid},{int(angle)}\n", drain=True, wait_ms=25)
    if not sent:
        try:
            core = _get_inmoove_core()
            sent = bool(core._send_key_angle(key, int(angle)))
        except Exception as e:
            logger.warning("move fallback: %s", e)
            sent = False

    try:
        core = _get_inmoove_core()
        for vs in core.servos.values():
            if vs.key == key:
                vs.position = int(angle)
                break
    except Exception:
        pass

    warn = None
    if conflicts:
        warn = f"Pin {pin} is shared by {conflicts[0]['keys']} — moves may fight each other"

    return {
        "ok": sent,
        "key": key,
        "id": sid,
        "pin": pin,
        "angle": int(angle),
        "requested": raw_in,
        "serial_sent": sent,
        "serial_connected": serial_mgr.is_connected(),
        "warning": warn,
        "note": note,
        "limits": {"min": int(s["min"]), "max": int(s["max"]), "rest": int(s["rest"])},
        "error": None if sent else "Serial write failed — reconnect USB",
    }

def _clamp_angle(val, lo=0, hi=180):
    n = _normalize_pwm_angle(val, lo)
    return max(lo, min(hi, n))


def _clamp_servo_key(key, val, default=90):
    """Clamp to this servo's working min/max (user calibration), after 360→180 map."""
    s = _servo_by_key(key)
    if s:
        n = _normalize_pwm_angle(val, s.get('rest', default))
        return max(int(s['min']), min(int(s['max']), n))
    return _clamp_angle(val)


# Per-side arm joint keys in shared/servo_config.json
_ARM_JOINT_KEYS = {
    'left': {
        'shoulder': 'l_shoulder',
        'lift': 'l_lift',
        'rotate': 'l_rotate',
        'elbow': 'l_elbow',
        'wrist': 'l_wrist',
    },
    'right': {
        'shoulder': 'r_shoulder',
        'lift': 'r_lift',
        'rotate': 'r_rotate',
        'elbow': 'r_elbow',
        'wrist': 'r_wrist',
    },
}


def _arm_hard_limits(side):
    """Absolute min/max walls from servo config (never exceeded)."""
    keys = _ARM_JOINT_KEYS.get(side, _ARM_JOINT_KEYS['left'])
    out = {}
    defaults = {
        'shoulder': (30, 180, 30),
        'lift': (10, 60 if side == 'left' else 65, 10),
        'rotate': (40, 180, 90),
        'elbow': (0, 80 if side == 'left' else 90, 5),
        'wrist': (10, 160, 90),
    }
    for joint, key in keys.items():
        s = _servo_by_key(key)
        dmin, dmax, drest = defaults[joint]
        if s:
            out[joint] = {
                'min': int(s.get('min', dmin)),
                'max': int(s.get('max', dmax)),
                'rest': int(s.get('rest', drest)),
            }
        else:
            out[joint] = {'min': dmin, 'max': dmax, 'rest': drest}
    return out


def _safe_arm(side, data):
    """
    Hard-clamp arm angles to config limits, then apply anti-overlap coupling so
    omoplate/bicep/rotate/shoulder cannot stack into a mechanical bind.
    Returns dict shoulder/lift/rotate/elbow/wrist (ints).
    """
    hard = _arm_hard_limits(side)
    data = data or {}

    def hclamp(joint, val):
        r = hard[joint]
        try:
            n = int(val)
        except (TypeError, ValueError):
            n = r['rest']
        return max(r['min'], min(r['max'], n))

    arm = {
        'shoulder': hclamp('shoulder', data.get('shoulder', hard['shoulder']['rest'])),
        'lift': hclamp('lift', data.get('lift', hard['lift']['rest'])),
        'rotate': hclamp('rotate', data.get('rotate', hard['rotate']['rest'])),
        'elbow': hclamp('elbow', data.get('elbow', hard['elbow']['rest'])),
        'wrist': hclamp('wrist', data.get('wrist', hard['wrist']['rest'])),
    }

    for _ in range(4):
        shoulder = arm['shoulder']
        lift = arm['lift']
        rotate = arm['rotate']
        elbow = arm['elbow']

        lift_max = hard['lift']['max']
        elbow_max = hard['elbow']['max']
        rotate_min = hard['rotate']['min']
        rotate_max = hard['rotate']['max']
        shoulder_max = hard['shoulder']['max']

        # High elbow → cut omoplate (forearm into torso/shoulder cover)
        elbow_over = max(0, elbow - 40)
        lift_max = max(hard['lift']['min'] + 4, lift_max - int(round(elbow_over * 0.4)))

        # High omoplate → cut elbow flex (bicep housing bind)
        lift_over = max(0, lift - 32)
        elbow_max = max(hard['elbow']['min'] + 4, elbow_max - int(round(lift_over * 0.7)))

        # High shoulder → head/ear clearance
        if shoulder > 125:
            lift_max = max(hard['lift']['min'] + 4, lift_max - int(round((shoulder - 125) * 0.25)))

        # High omoplate → slightly lower shoulder max
        if lift > 45:
            shoulder_max = max(hard['shoulder']['min'] + 20, shoulder_max - int(round((lift - 45) * 1.2)))

        # Bent elbow → keep rotate nearer neutral (torso/hip clearance)
        if elbow > 35:
            shrink = int(round((elbow - 35) * 0.55))
            rotate_min = min(rotate_max - 12, rotate_min + shrink)
            rotate_max = max(rotate_min + 12, rotate_max - shrink)

        # Arm at side → avoid extreme inward rotate into hip
        if shoulder < 55:
            shrink = int(round((55 - shoulder) * 0.45))
            rotate_min = min(95, rotate_min + shrink)

        # Raised + forward → keep rotate out of head zone
        if lift > 42 and shoulder > 100:
            rotate_min = max(rotate_min, 55)
            rotate_max = min(rotate_max, 155)

        # Extreme rotate → slightly limit elbow
        rotate_edge = max(abs(rotate - 90) - 40, 0)
        if rotate_edge > 0:
            elbow_max = max(hard['elbow']['min'] + 4, elbow_max - int(round(rotate_edge * 0.25)))

        nxt = {
            'shoulder': max(hard['shoulder']['min'], min(shoulder_max, arm['shoulder'])),
            'lift': max(hard['lift']['min'], min(lift_max, arm['lift'])),
            'rotate': max(rotate_min, min(rotate_max, arm['rotate'])),
            'elbow': max(hard['elbow']['min'], min(elbow_max, arm['elbow'])),
            'wrist': arm['wrist'],
        }
        if nxt == arm:
            break
        arm = nxt

    return arm


# Hardware inversion (walkthrough): output = min + max - input.
# All arm joints inverted except right omoplate (right lift).
_ARM_INVERT = {
    'left': {'shoulder': True, 'lift': True, 'rotate': True, 'elbow': True, 'wrist': True},
    'right': {'shoulder': True, 'lift': False, 'rotate': True, 'elbow': True, 'wrist': True},
}


def _invert_joint_angle(angle: int, mn: int, mx: int) -> int:
    """Mirror angle inside [mn, mx] without leaving the range."""
    return int(mn) + int(mx) - int(angle)


def _arm_to_hw(side: str, arm: dict) -> dict:
    """Convert logical UI angles → hardware serial angles (with inversions)."""
    hard = _arm_hard_limits(side)
    inv = _ARM_INVERT.get(side, _ARM_INVERT['left'])
    out = {}
    for joint, value in arm.items():
        r = hard.get(joint) or {'min': 0, 'max': 180}
        mn, mx = int(r['min']), int(r['max'])
        v = max(mn, min(mx, int(value)))
        out[joint] = _invert_joint_angle(v, mn, mx) if inv.get(joint) else v
    return out


def _pack_arm_cmd(side: str, logical_arm: dict) -> tuple:
    """Return (serial_cmd, logical_arm, hw_arm) for LA/RA packets."""
    arm = _safe_arm(side, logical_arm)
    hw = _arm_to_hw(side, arm)
    prefix = 'LA' if side == 'left' else 'RA'
    cmd = f"{prefix},{hw['shoulder']},{hw['lift']},{hw['rotate']},{hw['elbow']},{hw['wrist']}\n"
    return cmd, arm, hw


# Gemini API key — set via .env or GEMINI_API_KEY environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

app = Flask(__name__)

# Thread-safety lock for serial port access
serial_lock = threading.Lock()

VALID_HANDSHAKE_TOKENS = (
    "ARDUINO_OK",
    "NECK_OK",
    "NECK_READY",
    "INMOOV_OK",
    "FULL_BODY_READY",
)


def _friendly_serial_error(port_name: str, exc: Exception) -> str:
    """Human-readable COM errors (Windows Access Denied is the common case)."""
    msg = str(exc)
    low = msg.lower()
    if "access is denied" in low or "permissionerror" in low or "permission" in low:
        return (
            f"{port_name} is busy (Access denied). "
            "Close Arduino IDE Serial Monitor, another Control Deck tab, PuTTY, or any app using this COM port. "
            "Then click Disconnect → Force free → Connect again."
        )
    if "file not found" in low or "cannot find" in low or "no such file" in low:
        return f"{port_name} not found — unplug/replug USB and Refresh ports."
    if "semiconductor" in low or "device" in low and "refused" in low:
        return f"{port_name} refused connection — try another USB cable/port."
    return f"{port_name}: {msg}"


# Global Serial Connection State
class SerialManager:
    """
    Durable USB serial manager for Arduino Mega servo firmware.

    Design goals:
    - Never drop the link on a single write glitch (streak threshold).
    - Continuously drain RX so POS / chatter never fills the OS buffer.
    - Auto-reconnect after unplug/replug or Access-denied recovery.
    - Quiet firmware POS flood (Q,0) so host commands always get through.
    """

    def __init__(self):
        self.conn = None
        self.port = None
        self.last_error = None
        self.desired_port = None  # last user-requested port (for auto-reconnect)
        self.auto_reconnect = True
        self._fail_streak = 0
        self._reconnect_lock = threading.Lock()
        self._reconnect_thread = None
        self._manual_disconnect = False
        self.connected_at = None
        self.last_ok_write = None
        self.reconnecting = False
        self._batch_depth = 0  # >0: bulk pin/limit writes — never hard-drop link
        self._drain_stop = threading.Event()
        self._drain_thread = None
        self._watchdog_stop = threading.Event()
        self._watchdog_thread = None
        self._start_watchdog()

    def begin_batch(self):
        """Bulk pin/limit ops — suppress disconnect on transient write fails."""
        self._batch_depth += 1
        if self.is_connected():
            self.send_cmd("Q,0\n", drain=True)

    def end_batch(self):
        self._batch_depth = max(0, self._batch_depth - 1)
        if self._batch_depth == 0 and self.is_connected():
            self.send_cmd("Q,0\n", drain=True)
            self._fail_streak = 0

    def is_connected(self):
        try:
            return self.conn is not None and getattr(self.conn, "is_open", False)
        except Exception:
            return False

    def status_dict(self):
        return {
            "connected": self.is_connected(),
            "port": self.port,
            "desired_port": self.desired_port,
            "last_error": self.last_error,
            "auto_reconnect": self.auto_reconnect,
            "fail_streak": self._fail_streak,
            "connected_at": self.connected_at,
            "last_ok_write": self.last_ok_write,
            "reconnecting": self.reconnecting,
            "manual_disconnect": self._manual_disconnect,
        }

    def _open_port(self, port_name: str, timeout: float = 1.0):
        """Open COM with Windows-friendly flags (no RTS/DTR handshake spam)."""
        return serial.Serial(
            port=port_name,
            baudrate=9600,
            bytesize=serial.EIGHTBITS,
            parity=serial.PARITY_NONE,
            stopbits=serial.STOPBITS_ONE,
            timeout=timeout,
            write_timeout=max(3.0, timeout),  # generous under POS / multi-W traffic
            xonxoff=False,
            rtscts=False,
            dsrdtr=False,
            # Larger buffers help when firmware still floods POS (pre-reflash)
            inter_byte_timeout=None,
        )

    def _start_drain_thread(self):
        """Background RX drain — prevents input buffer fill → write timeout.

        Never takes serial_lock (avoids deadlock with connect/send_cmd).
        pyserial read of in_waiting bytes is safe concurrent with write.
        """
        self._stop_drain_thread()
        self._drain_stop.clear()

        def _drain():
            while not self._drain_stop.is_set():
                try:
                    c = self.conn
                    if c is None or not getattr(c, "is_open", False):
                        break
                    try:
                        waiting = getattr(c, "in_waiting", 0) or 0
                        if waiting > 0:
                            c.read(waiting)
                    except Exception:
                        pass
                    time.sleep(0.05)
                except Exception:
                    time.sleep(0.15)

        self._drain_thread = threading.Thread(target=_drain, daemon=True, name="serial-drain")
        self._drain_thread.start()

    def _stop_drain_thread(self):
        self._drain_stop.set()
        t = self._drain_thread
        self._drain_thread = None
        # Do not join while holding serial_lock — just signal stop (daemon thread)
        if t and t.is_alive() and t is not threading.current_thread():
            try:
                t.join(timeout=0.25)
            except Exception:
                pass

    def _start_watchdog(self):
        """Periodic: if we want a port but lost it, auto-reconnect."""
        if self._watchdog_thread and self._watchdog_thread.is_alive():
            return
        self._watchdog_stop.clear()

        def _watch():
            while not self._watchdog_stop.is_set():
                try:
                    if (
                        not self._manual_disconnect
                        and self.auto_reconnect
                        and self.desired_port
                        and not self.is_connected()
                        and not self.reconnecting
                    ):
                        logger.info(
                            "Watchdog: desired %s offline — scheduling reconnect",
                            self.desired_port,
                        )
                        self._schedule_reconnect()
                    # Soft health: if connected but write has been stale, drain + quiet
                    elif self.is_connected() and self.last_ok_write:
                        age = time.time() - self.last_ok_write
                        if age > 30:
                            try:
                                with serial_lock:
                                    if self.is_connected():
                                        try:
                                            self.conn.reset_input_buffer()
                                        except Exception:
                                            pass
                                        self.conn.write(b"Q,0\n")
                                        self.conn.flush()
                                        self.last_ok_write = time.time()
                            except Exception as e:
                                logger.warning("Watchdog quiet pulse failed: %s", e)
                                self._fail_streak += 1
                                if self._fail_streak >= 5:
                                    with serial_lock:
                                        self.disconnect_unsafe(clear_desired=False)
                                    self._schedule_reconnect()
                except Exception as e:
                    logger.debug("Watchdog tick error: %s", e)
                self._watchdog_stop.wait(4.0)

        self._watchdog_thread = threading.Thread(target=_watch, daemon=True, name="serial-watchdog")
        self._watchdog_thread.start()

    def _quiet_firmware(self):
        """Tell board to stop POS flood (safe if firmware lacks Q — just ignored)."""
        if not self.is_connected():
            return
        try:
            self.conn.write(b"Q,0\n")
            self.conn.flush()
            time.sleep(0.04)
            try:
                self.conn.reset_input_buffer()
            except Exception:
                pass
        except Exception:
            pass

    def connect(self, port_name: str, retries: int = 4, force: bool = True):
        """
        Connect with force-close + retries.
        Windows often returns PermissionError(13) if the previous handle
        was not released yet (or Arduino IDE holds the port).
        """
        port_name = (port_name or "").strip()
        if not port_name:
            raise ValueError("No port specified")

        self.desired_port = port_name
        self._manual_disconnect = False
        self.auto_reconnect = True

        with serial_lock:
            # Only close if already open on same or other port
            if force or self.is_connected():
                self._stop_drain_thread()
                self.disconnect_unsafe(clear_desired=False)
                # Windows needs a beat before the same COM can reopen
                time.sleep(0.5)

            last_err = None
            for attempt in range(1, retries + 1):
                try:
                    logger.info("Connecting to %s @ 9600 (attempt %s/%s)...", port_name, attempt, retries)
                    self.conn = self._open_port(port_name, timeout=1.5)
                    self.port = port_name
                    self.last_error = None
                    self._fail_streak = 0
                    self.connected_at = time.time()
                    self.last_ok_write = time.time()
                    self.reconnecting = False
                    # Arduino resets on open — wait for bootloader
                    time.sleep(1.8)
                    try:
                        self.conn.reset_input_buffer()
                        self.conn.reset_output_buffer()
                    except Exception:
                        pass
                    # Quiet POS spam so command writes don't timeout
                    self._quiet_firmware()
                    time.sleep(0.05)
                    self._quiet_firmware()  # twice: boot noise can swallow first
                    # Optional soft handshake (non-fatal)
                    try:
                        self.conn.write(b"?")
                        self.conn.flush()
                        line = self.conn.readline().decode("utf-8", errors="ignore").strip()
                        if line:
                            logger.info("Post-connect reply on %s: %s", port_name, line)
                    except Exception:
                        pass
                    self._start_drain_thread()
                    logger.info("Connected to %s", port_name)
                    return True
                except Exception as e:
                    last_err = e
                    logger.warning("Connect attempt %s failed on %s: %s", attempt, port_name, e)
                    self._stop_drain_thread()
                    self.disconnect_unsafe(clear_desired=False)
                    # Backoff longer on access-denied
                    delay = 0.85 * attempt if "denied" in str(e).lower() or "permission" in str(e).lower() else 0.4 * attempt
                    time.sleep(delay)

            self.last_error = _friendly_serial_error(port_name, last_err or Exception("unknown"))
            raise PermissionError(self.last_error) if last_err and (
                "denied" in str(last_err).lower() or isinstance(last_err, PermissionError)
            ) else OSError(self.last_error)

    def disconnect(self, permanent=True):
        with serial_lock:
            if permanent:
                self._manual_disconnect = True
                self.auto_reconnect = False
                self.desired_port = None
                self.reconnecting = False
            self._stop_drain_thread()
            self.disconnect_unsafe(clear_desired=permanent)

    def disconnect_unsafe(self, clear_desired=True):
        if self.conn:
            try:
                logger.info("Closing serial connection to %s", self.port)
                try:
                    if getattr(self.conn, "is_open", False):
                        self.conn.close()
                except Exception as e:
                    logger.error("Error closing port: %s", e)
            finally:
                # Drop reference so GC releases the Windows handle
                self.conn = None
        self.conn = None
        self.port = None
        if clear_desired:
            pass  # desired_port managed by disconnect/connect

    def force_release(self, port_name=None):
        """Disconnect and pause so Windows frees the COM port. Stops auto-reconnect."""
        with serial_lock:
            target = port_name or self.port or self.desired_port
            self._manual_disconnect = True
            self.auto_reconnect = False
            self.reconnecting = False
            self._stop_drain_thread()
            self.disconnect_unsafe(clear_desired=True)
            self.desired_port = None
            time.sleep(0.8)
            return {"ok": True, "released": target, "hint": "Port handle released. Try Connect again."}

    def _schedule_reconnect(self):
        """Background auto-reconnect after transient USB drop (not after user Disconnect)."""
        if self._manual_disconnect or not self.auto_reconnect or not self.desired_port:
            return
        if not self._reconnect_lock.acquire(blocking=False):
            return

        self.reconnecting = True

        def worker():
            try:
                port = self.desired_port
                if not port or self._manual_disconnect:
                    return
                for attempt in range(1, 8):
                    if self.is_connected() or self._manual_disconnect:
                        return
                    # Port may disappear briefly on USB re-enumerate
                    present = {p.device for p in serial.tools.list_ports.comports()}
                    if port not in present:
                        logger.info("Auto-reconnect wait: %s not in system ports yet", port)
                        time.sleep(1.0 * attempt)
                        continue
                    logger.info("Auto-reconnect %s attempt %s/7...", port, attempt)
                    try:
                        self.connect(port, force=True, retries=2)
                        logger.info("Auto-reconnect OK on %s", port)
                        try:
                            _push_config_to_firmware(include_pins=True, include_limits=True)
                        except Exception as e:
                            logger.warning("post-reconnect sync: %s", e)
                        return
                    except Exception as e:
                        logger.warning("Auto-reconnect failed: %s", e)
                        time.sleep(1.3 * attempt)
                self.last_error = f"Auto-reconnect gave up on {port}"
            finally:
                self.reconnecting = False
                try:
                    self._reconnect_lock.release()
                except Exception:
                    pass

        if self._reconnect_thread and self._reconnect_thread.is_alive():
            # Already running — release the lock we just took carefully
            try:
                self._reconnect_lock.release()
            except Exception:
                pass
            return
        self._reconnect_thread = threading.Thread(target=worker, daemon=True, name="serial-reconnect")
        self._reconnect_thread.start()

    def send_cmd(self, cmd_str, drain=False, wait_ms=0):
        """Write a command. Retries transient write errors; only drops link after streak."""
        should_reconnect = False
        with serial_lock:
            if not self.is_connected():
                logger.warning("Attempted to send command while disconnected")
                should_reconnect = (
                    self.auto_reconnect
                    and self.desired_port
                    and not self._manual_disconnect
                )
            else:
                try:
                    if not cmd_str.endswith("\n") and cmd_str not in ("?",):
                        cmd_str = cmd_str + "\n"
                    if drain:
                        try:
                            n = self.conn.in_waiting or 0
                            if n:
                                self.conn.read(n)
                        except Exception:
                            try:
                                self.conn.reset_input_buffer()
                            except Exception:
                                pass
                    # Retry write up to 3 times without closing port
                    last_exc = None
                    for attempt in range(3):
                        try:
                            # Soft quiet every few drains when buffer is noisy
                            if drain and attempt == 0:
                                try:
                                    waiting = self.conn.in_waiting or 0
                                    if waiting > 200:
                                        self.conn.write(b"Q,0\n")
                                        self.conn.flush()
                                        time.sleep(0.03)
                                        n = self.conn.in_waiting or 0
                                        if n:
                                            self.conn.read(n)
                                except Exception:
                                    pass
                            self.conn.write(cmd_str.encode("utf-8"))
                            self.conn.flush()
                            self._fail_streak = 0
                            self.last_ok_write = time.time()
                            self.last_error = None
                            if wait_ms > 0:
                                time.sleep(wait_ms / 1000.0)
                            return True
                        except Exception as e:
                            last_exc = e
                            logger.warning(
                                "Serial write retry %s on %s: %s", attempt + 1, self.port, e
                            )
                            try:
                                self.conn.reset_output_buffer()
                                self.conn.reset_input_buffer()
                            except Exception:
                                pass
                            time.sleep(0.08 * (attempt + 1))
                    # After retries, count failure — do NOT drop on first glitch
                    self._fail_streak += 1
                    self.last_error = str(last_exc) if last_exc else "write failed"
                    logger.error(
                        "Serial write failed (streak=%s) on %s: %s",
                        self._fail_streak,
                        self.port,
                        last_exc,
                    )
                    # Only disconnect after repeated hard failures (USB unplug etc.)
                    # Never drop during pin/limit batch programming.
                    threshold = 12 if self._batch_depth > 0 else 5
                    if self._fail_streak >= threshold and self._batch_depth == 0:
                        logger.error("Serial fail streak high — closing and scheduling reconnect")
                        self._stop_drain_thread()
                        self.disconnect_unsafe(clear_desired=False)
                        should_reconnect = self.auto_reconnect and not self._manual_disconnect
                    return False
                except Exception as e:
                    logger.error("Unexpected serial error on %s: %s", self.port, e)
                    self._fail_streak += 1
                    if self._fail_streak >= 5 and self._batch_depth == 0:
                        self._stop_drain_thread()
                        self.disconnect_unsafe(clear_desired=False)
                        should_reconnect = self.auto_reconnect and not self._manual_disconnect
                    return False

        if should_reconnect:
            self._schedule_reconnect()
        return False

    def ping(self):
        """Lightweight health check — True if link still usable."""
        if not self.is_connected():
            if (
                self.auto_reconnect
                and self.desired_port
                and not self._manual_disconnect
            ):
                self._schedule_reconnect()
            return False
        try:
            with serial_lock:
                if not self.is_connected():
                    return False
                try:
                    n = self.conn.in_waiting or 0
                    if n:
                        self.conn.read(n)
                except Exception:
                    pass
                self.conn.write(b"V\n")
                self.conn.flush()
                deadline = time.time() + 0.35
                while time.time() < deadline:
                    line = self.conn.readline().decode("utf-8", errors="ignore").strip()
                    if line:
                        self._fail_streak = 0
                        self.last_ok_write = time.time()
                        return True
                return True  # write OK — still consider up
        except Exception as e:
            logger.warning("Serial ping failed: %s", e)
            self._fail_streak += 1
            if self._fail_streak >= 4:
                with serial_lock:
                    self._stop_drain_thread()
                    self.disconnect_unsafe(clear_desired=False)
                self._schedule_reconnect()
            return False

    def query_handshake(self, port_name: str) -> bool:
        """Open briefly, ask '?', close cleanly (always)."""
        test_conn = None
        try:
            logger.info("Testing port %s for handshake...", port_name)
            # Ensure we are not holding the port
            if self.port == port_name:
                self._stop_drain_thread()
                self.disconnect_unsafe()
                time.sleep(0.4)
            test_conn = self._open_port(port_name, timeout=2.0)
            time.sleep(1.5)
            try:
                test_conn.reset_input_buffer()
                test_conn.reset_output_buffer()
            except Exception:
                pass
            test_conn.write(b"?")
            test_conn.flush()
            for _ in range(4):
                response = test_conn.readline().decode("utf-8", errors="ignore").strip()
                logger.info("Handshake response from %s: '%s'", port_name, response)
                if any(tok in response for tok in VALID_HANDSHAKE_TOKENS):
                    return True
            return False
        except Exception as e:
            logger.debug("Handshake failed on %s: %s", port_name, e)
            return False
        finally:
            if test_conn is not None:
                try:
                    test_conn.close()
                except Exception:
                    pass
                # Windows: wait before caller re-opens
                time.sleep(0.5)


serial_mgr = SerialManager()


# ── RealSense D455 chest camera — presence wake ───────────────

from inmoove_core.realsense_presence import get_presence_guard  # noqa: E402


def _enable_all_motors() -> dict:
    """Enable every body-part group on firmware (mask 255) and go to rest pose."""
    result = {"enable_sent": False, "rest_sent": False, "cmds": []}
    if not serial_mgr.is_connected():
        result["error"] = "serial not connected"
        return result

    # All bodyPartGroups bits: head|neck|arms|hands|legs = 255
    if serial_mgr.send_cmd("E,255\n"):
        result["enable_sent"] = True
        result["cmds"].append("E,255")

    # Head + neck rest from servo config
    by_key = {s.get("key"): s for s in (SERVO_CONFIG or {}).get("servos", [])}
    def rest(key, default):
        s = by_key.get(key) or {}
        return int(s.get("rest", default))

    hn = rest("head_neck", 85)
    he = rest("head_eye", 90)
    hj = rest("head_jaw", 8)
    nr = rest("neck_rot", 60)
    nt = rest("neck_tilt", 50)
    nro = rest("neck_roll", 120)
    cmd = f"C,{hn},{he},{hj},{nr},{nt},{nro}\n"
    if serial_mgr.send_cmd(cmd):
        result["rest_sent"] = True
        result["cmds"].append(cmd.strip())

    # Upper body rest (arms inverted for HW, hands direct)
    la_logical = {
        'shoulder': rest("l_shoulder", 30), 'lift': rest("l_lift", 10),
        'rotate': rest("l_rotate", 90), 'elbow': rest("l_elbow", 5), 'wrist': rest("l_wrist", 90),
    }
    ra_logical = {
        'shoulder': rest("r_shoulder", 30), 'lift': rest("r_lift", 10),
        'rotate': rest("r_rotate", 90), 'elbow': rest("r_elbow", 5), 'wrist': rest("r_wrist", 90),
    }
    la_cmd, _, _ = _pack_arm_cmd('left', la_logical)
    ra_cmd, _, _ = _pack_arm_cmd('right', ra_logical)
    lh = (
        rest("l_thumb", 10), rest("l_index", 10), rest("l_middle", 10),
        rest("l_ring", 10), rest("l_pinky", 10),
    )
    rh = (
        rest("r_thumb", 10), rest("r_index", 10), rest("r_middle", 10),
        rest("r_ring", 10), rest("r_pinky", 10),
    )
    for part in (
        la_cmd.strip(),
        ra_cmd.strip(),
        f"LH,{lh[0]},{lh[1]},{lh[2]},{lh[3]},{lh[4]}",
        f"RH,{rh[0]},{rh[1]},{rh[2]},{rh[3]},{rh[4]}",
    ):
        if serial_mgr.send_cmd(part + "\n"):
            result["cmds"].append(part)

    # Soft firmware relax if available
    if serial_mgr.send_cmd("G,relax\n"):
        result["cmds"].append("G,relax")

    return result


def _on_realsense_wake(event: dict):
    """Person stood in front of D455 for N seconds → motors on + speak."""
    logger.info(
        "D455 wake: person present %.1fs @ %s m — enabling motors and greeting",
        event.get("presence_seconds", 0),
        event.get("median_distance_m"),
    )
    motor_result = {}
    if event.get("enable_motors", True):
        try:
            motor_result = _enable_all_motors()
            logger.info("Motor wake result: %s", motor_result)
        except Exception as e:
            logger.exception("Motor wake failed: %s", e)
            motor_result = {"error": str(e)}

    greet = (event.get("greet_text") or "Hello, how are you?").strip()
    speak_result = {}
    try:
        # Run TTS off the camera thread so the depth loop keeps running
        def _speak():
            try:
                res = _get_inmoove_core().speak(greet)
                logger.info("Wake greeting: %s", res)
            except Exception as ex:
                logger.exception("Wake speak failed: %s", ex)

        threading.Thread(target=_speak, name="d455-greet", daemon=True).start()
        speak_result = {"queued": True, "text": greet}
    except Exception as e:
        speak_result = {"ok": False, "error": str(e)}

    # Stash last wake payload for UI
    guard = get_presence_guard()
    with getattr(guard, "_lock", threading.Lock()):
        guard._state.last_greet_text = greet  # type: ignore[attr-defined]


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
    detailed = []
    devices = []
    for p in serial.tools.list_ports.comports():
        devices.append(p.device)
        vid = f"{p.vid:04X}" if p.vid is not None else None
        pid = f"{p.pid:04X}" if p.pid is not None else None
        # Arduino Mega 2560 often 2341:0042
        is_arduino = False
        blob = f"{p.description or ''} {p.manufacturer or ''} {p.hwid or ''}".lower()
        if any(k in blob for k in ("arduino", "genuino", "ch340", "ftdi", "usb serial", "usb-serial")):
            is_arduino = True
        if p.vid == 0x2341 or p.vid == 0x2A03:  # Arduino / official clones
            is_arduino = True
        detailed.append({
            "device": p.device,
            "description": p.description or p.device,
            "manufacturer": p.manufacturer or "",
            "hwid": p.hwid or "",
            "vid": vid,
            "pid": pid,
            "likely_arduino": is_arduino,
        })
    return jsonify({
        "ports": devices,
        "details": detailed,
        "current": serial_mgr.port if serial_mgr.is_connected() else None,
        "connected": serial_mgr.is_connected(),
        "last_error": serial_mgr.last_error,
        "desired_port": serial_mgr.desired_port,
        "reconnecting": serial_mgr.reconnecting,
        "auto_reconnect": serial_mgr.auto_reconnect,
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "serial": serial_mgr.status_dict(),
    })


@app.route('/api/serial/status', methods=['GET'])
def serial_status():
    """Full serial health for frontend connection watchdog."""
    st = serial_mgr.status_dict()
    st["ok"] = True
    return jsonify(st)

@app.route('/api/serial/connect', methods=['POST'])
def connect_port():
    data = request.get_json() or {}
    port = (data.get('port') or '').strip()
    force = bool(data.get('force', True))
    sync = bool(data.get('sync', True))
    if not port:
        return jsonify({"ok": False, "error": "No port specified"}), 400

    try:
        serial_mgr.connect(port, force=force)
        sync_result = None
        if sync:
            # Push pin map + limits so board matches software (critical after pin edits)
            time.sleep(0.2)
            sync_result = _push_config_to_firmware(include_pins=True, include_limits=True)
        return jsonify({
            "ok": True,
            "port": port,
            "connected": True,
            "firmware_sync": sync_result,
        })
    except Exception as e:
        err = serial_mgr.last_error or _friendly_serial_error(port, e)
        logger.error("Connect API failed: %s", err)
        return jsonify({"ok": False, "error": err, "port": port}), 500

@app.route('/api/serial/disconnect', methods=['POST'])
def disconnect_port():
    serial_mgr.disconnect()
    # Give Windows time to free the handle
    time.sleep(0.35)
    return jsonify({"ok": True, "connected": False})


@app.route('/api/serial/force-release', methods=['POST'])
def force_release_port():
    """Force-close our handle so COM can be reopened (Access denied recovery)."""
    data = request.get_json() or {}
    port = data.get('port')
    result = serial_mgr.force_release(port)
    return jsonify(result)

@app.route('/api/serial/autodetect', methods=['POST'])
def autodetect():
    ports = list(serial.tools.list_ports.comports())
    if not ports:
        return jsonify({"ok": False, "error": "No serial ports found — plug in USB and refresh."}), 404

    # Always free our handle before probing
    serial_mgr.disconnect()
    time.sleep(0.4)

    arduino_keywords = ["arduino", "genuino", "ch340", "usb-serial", "usb serial", "usb_serial", "ftdi", "mega"]
    target_ports = []
    other_ports = []

    for p in ports:
        desc = (p.description or "").lower()
        mfg = (p.manufacturer or "").lower()
        hwid = (p.hwid or "").lower()
        # Prefer real Arduino VID
        if p.vid in (0x2341, 0x2A03) or any(kw in desc or kw in mfg or kw in hwid for kw in arduino_keywords):
            target_ports.append(p.device)
        else:
            other_ports.append(p.device)

    # Prefer direct connect with retries (handshake double-open causes Access Denied on Windows)
    errors = []
    for port in target_ports + other_ports:
        try:
            logger.info("Auto-detect: connecting to %s...", port)
            serial_mgr.connect(port, force=True, retries=3)
            return jsonify({"ok": True, "port": port, "connected": True})
        except Exception as e:
            err = serial_mgr.last_error or _friendly_serial_error(port, e)
            errors.append(f"{port}: {err}")
            logger.error("Auto-detect failed on %s: %s", port, e)
            serial_mgr.disconnect()
            time.sleep(0.5)

    tip = (
        "Could not open any COM port. "
        "Close Arduino Serial Monitor / other apps, unplug+replug USB, then Force free + Connect."
    )
    return jsonify({
        "ok": False,
        "error": tip,
        "details": errors,
    }), 404

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
    """Controls one arm: hard limits + anti-overlap + hardware inversion (walkthrough)."""
    data = request.get_json() or {}
    side = 'right' if data.get('side') == 'right' else 'left'
    cmd, arm, hw = _pack_arm_cmd(side, data)
    sent = serial_mgr.is_connected() and serial_mgr.send_cmd(cmd)
    return jsonify({
        "ok": True,
        "serial_sent": sent,
        "side": side,
        "angles": arm,
        "hw_angles": hw,
        "limits": _arm_hard_limits(side),
    })


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
    """Batch update arms, hands, and legs (arms use hard limits + anti-overlap)."""
    data = request.get_json() or {}

    def hand_vals(key):
        block = data.get(key, {})
        return (
            _clamp_servo_key('l_thumb' if 'left' in key else 'r_thumb', block.get('thumb', 10), 10),
            _clamp_servo_key('l_index' if 'left' in key else 'r_index', block.get('index', 10), 10),
            _clamp_servo_key('l_middle' if 'left' in key else 'r_middle', block.get('middle', 10), 10),
            _clamp_servo_key('l_ring' if 'left' in key else 'r_ring', block.get('ring', 10), 10),
            _clamp_servo_key('l_pinky' if 'left' in key else 'r_pinky', block.get('pinky', 10), 10),
        )

    def leg_vals(key):
        block = data.get(key, {})
        p = 'l' if 'left' in key else 'r'
        return (
            _clamp_servo_key(f'{p}_hip', block.get('hip', 90), 90),
            _clamp_servo_key(f'{p}_thigh', block.get('thigh', 90), 90),
            _clamp_servo_key(f'{p}_knee', block.get('knee', 10), 10),
            _clamp_servo_key(f'{p}_ankle', block.get('ankle', 90), 90),
            _clamp_servo_key(f'{p}_foot', block.get('foot', 90), 90),
        )

    la_cmd, la_d, _ = _pack_arm_cmd('left', data.get('leftArm') or {})
    ra_cmd, ra_d, _ = _pack_arm_cmd('right', data.get('rightArm') or {})
    lh = hand_vals('leftHand')
    rh = hand_vals('rightHand')
    ll = leg_vals('leftLeg')
    rl = leg_vals('rightLeg')

    parts = [
        la_cmd.strip(),
        ra_cmd.strip(),
        f"LH,{lh[0]},{lh[1]},{lh[2]},{lh[3]},{lh[4]}",
        f"RH,{rh[0]},{rh[1]},{rh[2]},{rh[3]},{rh[4]}",
        f"LL,{ll[0]},{ll[1]},{ll[2]},{ll[3]},{ll[4]}",
        f"RL,{rl[0]},{rl[1]},{rl[2]},{rl[3]},{rl[4]}",
    ]
    sent = False
    if serial_mgr.is_connected():
        for part in parts:
            sent = serial_mgr.send_cmd(part + '\n') or sent

    return jsonify({
        "ok": True,
        "serial_sent": sent,
        "leftArm": la_d,
        "rightArm": ra_d,
    })


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
    """Rest all servos — keep USB open (disconnect was a major 'auto drop' bug)."""
    logger.warning("EMERGENCY STOP TRIGGERED")
    sent = False
    if serial_mgr.is_connected():
        # Abort patterns + rest all + quiet
        serial_mgr.send_cmd("X\n", drain=True)
        sent = serial_mgr.send_cmd("S\n", drain=True)
        serial_mgr.send_cmd("Q,0\n", drain=True)
    return jsonify({"ok": True, "serial_sent": sent, "connected": serial_mgr.is_connected()})

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

    cleaned = {}
    for k, v in pins.items():
        try:
            p = int(v)
        except (TypeError, ValueError):
            continue
        if 2 <= p <= 53:
            cleaned[str(k)] = p
    _write_json(PIN_OVERRIDES_PATH, cleaned)
    _reload_servo_config()

    sent = []
    failed = []
    connected = serial_mgr.is_connected()
    apply = bool(data.get('applyToFirmware', True))
    if connected and apply:
        serial_mgr.begin_batch()
        try:
            for s in SERVO_CONFIG.get('servos', []):
                key = s.get('key')
                if key not in cleaned:
                    continue
                cmd = f"W,{s['id']},{cleaned[key]}\n"
                ok = serial_mgr.send_cmd(cmd, drain=True, wait_ms=25)
                if not ok:
                    time.sleep(0.08)
                    ok = serial_mgr.send_cmd(cmd, drain=True, wait_ms=40)
                if ok:
                    sent.append(key)
                else:
                    failed.append(key)
                time.sleep(0.055)  # let rebindPin settle — do not flood
        finally:
            serial_mgr.end_batch()
        connected = serial_mgr.is_connected()

    return jsonify({
        "ok": True,
        "pins": cleaned,
        "firmware_applied": sent,
        "firmware_failed": failed,
        "serial_connected": connected,
        "warning": (
            None if connected
            else "Pins saved to disk only — connect USB to apply to Arduino"
        ) if apply else "Saved to disk only (applyToFirmware=false)",
    })


@app.route('/api/servo/pin', methods=['POST'])
def set_servo_pin():
    data = request.get_json() or {}
    key = (data.get('key') or '').strip()
    try:
        pin = int(data.get('pin', 0))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "pin must be a number"}), 400

    if pin < 2 or pin > 53:
        return jsonify({"ok": False, "error": "Pin must be 2–53"}), 400

    # Save override first, then reload so id/pin match
    overrides = _read_json(PIN_OVERRIDES_PATH, {})
    overrides[key] = pin
    _write_json(PIN_OVERRIDES_PATH, overrides)
    _reload_servo_config()

    servo = _servo_by_key(key)
    if not servo:
        return jsonify({"ok": False, "error": f"Unknown servo: {key}"}), 400

    connected = serial_mgr.is_connected()
    conflicts = [c for c in _pin_conflicts() if c["pin"] == pin]
    conflict_keys = conflicts[0]["keys"] if conflicts else []

    sent = False
    tested = False
    if not connected:
        return jsonify({
            "ok": True,  # disk save succeeded
            "error": "USB not connected — pin saved to disk; connect then Apply again",
            "key": key,
            "pin": pin,
            "serial_sent": False,
            "saved": True,
            "conflicts": conflict_keys,
            "hint": "Connect USB and Apply again to program the board",
        }), 200

    # Soft batch: one W must not kill COM
    serial_mgr.begin_batch()
    try:
        sent = serial_mgr.send_cmd(f"W,{servo['id']},{pin}\n", drain=True, wait_ms=50)
        if not sent:
            time.sleep(0.12)
            sent = serial_mgr.send_cmd(f"W,{servo['id']},{pin}\n", drain=True, wait_ms=60)
        time.sleep(0.1)  # Mega rebindPin settle
        # Gentle rest pulse only (no big wiggle — avoids brownout / disconnect)
        if sent and data.get('test', True):
            rest = int(servo.get('rest', 90))
            tested = serial_mgr.send_cmd(f"M,{servo['id']},{rest}\n", drain=True, wait_ms=30)
            if not tested:
                r = _send_move_by_key(key, rest)
                tested = bool(r.get("serial_sent"))
    finally:
        serial_mgr.end_batch()

    connected = serial_mgr.is_connected()
    warn = None
    if conflict_keys and len(conflict_keys) > 1:
        warn = f"Pin {pin} is also used by {conflict_keys} — reassign duplicates or motors will fight"

    return jsonify({
        "ok": bool(sent),
        "key": key,
        "id": servo["id"],
        "pin": pin,
        "serial_sent": sent,
        "test_sent": tested,
        "serial_connected": connected,
        "conflicts": conflict_keys,
        "warning": warn,
        "error": None if sent else "Failed to send W command — try Force free + Connect, then Apply again",
    })


@app.route('/api/servo/calibration', methods=['GET', 'POST'])
def servo_calibration():
    if request.method == 'GET':
        return jsonify({"ok": True, "calibration": _read_json(CALIB_OVERRIDES_PATH, {})})

    data = request.get_json() or {}
    cal = data.get('calibration') or {}
    if not isinstance(cal, dict):
        return jsonify({"ok": False, "error": "calibration must be an object"}), 400

    factory = _read_json(SERVO_CONFIG_PATH, {}) or {}
    factory_by_key = {s.get('key'): s for s in factory.get('servos', []) if s.get('key')}

    cleaned = {}
    for key, vals in cal.items():
        if not isinstance(vals, dict):
            continue
        fac = factory_by_key.get(key) or {}
        fmin = int(fac.get('min', 0))
        fmax = int(fac.get('max', 180))
        frest = int(fac.get('rest', 90))
        mn = int(vals.get('min', fmin)) if any(k in vals for k in ('min', 'max', 'rest')) else fmin
        mx = int(vals.get('max', fmax)) if any(k in vals for k in ('min', 'max', 'rest')) else fmax
        rs = int(vals.get('rest', frest)) if any(k in vals for k in ('min', 'max', 'rest')) else frest
        # User may expand past factory (PWM 0–180 absolute)
        mn, mx, rs = _sanitize_limits(mn, mx, rs, frest)
        cleaned[key] = {'min': mn, 'max': mx, 'rest': rs}

    _write_json(CALIB_OVERRIDES_PATH, cleaned)
    _reload_servo_config()

    sent = []
    failed = []
    if serial_mgr.is_connected() and data.get('applyToFirmware', True):
        serial_mgr.begin_batch()
        try:
            for s in SERVO_CONFIG.get('servos', []):
                key = s.get('key')
                if key not in cleaned:
                    continue
                v = cleaned[key]
                cmd = f"U,{s['id']},{v['min']},{v['max']},{v['rest']}\n"
                ok = serial_mgr.send_cmd(cmd, drain=True, wait_ms=15)
                if ok:
                    sent.append(key)
                else:
                    failed.append(key)
                time.sleep(0.03)
        finally:
            serial_mgr.end_batch()

    return jsonify({
        "ok": True,
        "calibration": cleaned,
        "firmware_applied": sent,
        "firmware_failed": failed,
        "serial_connected": serial_mgr.is_connected(),
    })


@app.route('/api/servo/limits', methods=['POST'])
def set_servo_limits():
    """Set working min/max/rest for one servo (0–180 PWM). Expands past factory defaults."""
    data = request.get_json() or {}
    key = (data.get('key') or '').strip()
    factory = _read_json(SERVO_CONFIG_PATH, {}) or {}
    fac = next((s for s in factory.get('servos', []) if s.get('key') == key), None)
    servo = _servo_by_key(key)
    if not fac and not servo:
        return jsonify({"ok": False, "error": f"Unknown servo: {key}"}), 400
    if not fac:
        fac = servo
    if not servo:
        servo = fac

    fmin = int(fac.get('min', 0))
    fmax = int(fac.get('max', 180))
    try:
        raw_min = data.get('min', servo.get('min', fmin))
        raw_max = data.get('max', servo.get('max', fmax))
        raw_rest = data.get('rest', servo.get('rest', 90))
        mn, mx, rs = _sanitize_limits(raw_min, raw_max, raw_rest, servo.get('rest', 90))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "min/max/rest must be numbers"}), 400

    note = None
    # Surface 360-style inputs clearly
    for label, raw in (("min", data.get("min")), ("max", data.get("max")), ("rest", data.get("rest"))):
        try:
            if raw is not None and int(raw) > 180:
                note = (
                    f"Hobby servos use 0–180° PWM (not 360). "
                    f"Mapped your values into 0–180 (e.g. 360 → 180)."
                )
                break
        except (TypeError, ValueError):
            pass

    overrides = _read_json(CALIB_OVERRIDES_PATH, {})
    overrides[key] = {"min": mn, "max": mx, "rest": rs}
    _write_json(CALIB_OVERRIDES_PATH, overrides)
    _reload_servo_config()
    servo = _servo_by_key(key) or servo

    sent = False
    if serial_mgr.is_connected():
        serial_mgr.begin_batch()
        try:
            sent = serial_mgr.send_cmd(
                f"U,{servo['id']},{mn},{mx},{rs}\n", drain=True, wait_ms=30
            )
            if not sent:
                time.sleep(0.08)
                sent = serial_mgr.send_cmd(
                    f"U,{servo['id']},{mn},{mx},{rs}\n", drain=True, wait_ms=40
                )
        finally:
            serial_mgr.end_batch()

    return jsonify({
        "ok": True,
        "key": key,
        "min": mn,
        "max": mx,
        "rest": rs,
        "factoryMin": fmin,
        "factoryMax": fmax,
        "serial_sent": sent,
        "serial_connected": serial_mgr.is_connected(),
        "note": note,
        "error": None if sent or not serial_mgr.is_connected() else "U command failed",
    })


@app.route('/api/servo/move', methods=['POST'])
def servo_move_by_key():
    """1:1 move a single servo by config key (head/arm/hand/leg)."""
    data = request.get_json() or {}
    key = (data.get('key') or '').strip()
    if not key:
        return jsonify({"ok": False, "error": "key required"}), 400
    result = _send_move_by_key(key, data.get('angle', 90))
    status = 200 if result.get("ok") else 400
    return jsonify(result), status


@app.route('/api/servo/sync-firmware', methods=['POST'])
def sync_firmware_config():
    """Push all pins + limits to Arduino (call after connect or pin edits)."""
    if not serial_mgr.is_connected():
        return jsonify({"ok": False, "error": "USB not connected"}), 400
    result = _push_config_to_firmware(include_pins=True, include_limits=True)
    return jsonify(result)


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
    core = _get_inmoove_core()
    return jsonify({
        "gemini_api_key": GEMINI_API_KEY,
        "gemini_configured": bool(GEMINI_API_KEY),
        "app_name": "InMoove Control Center",
        "firmware": "full_body_servo_control.ino",
        "firmware_head_only": "full_body_servo_control.ino (define HEAD_ONLY)",
        "baud_rate": 9600,
        "servo_count": (SERVO_CONFIG or {}).get('servoCount', 36),
        "core_version": core.status().get("version"),
        "core_online": True,
        "product": "InMoove",
    })


def _get_inmoove_core():
    """Always-online native core — serial bridged to Arduino firmware."""
    return get_core(
        project_root=BASE_DIR,
        send_serial=lambda cmd: serial_mgr.send_cmd(cmd) if serial_mgr.is_connected() else False,
        get_servo_config=lambda: SERVO_CONFIG,
    )


# ── InMoove Core API (primary). /api/mrl/* aliases for older clients. ──

@app.route('/api/core/status', methods=['GET'])
@app.route('/api/mrl/status', methods=['GET'])
def core_status():
    return jsonify(_get_inmoove_core().status())


@app.route('/api/core/services', methods=['GET'])
@app.route('/api/mrl/services', methods=['GET'])
def core_services():
    return jsonify(_get_inmoove_core().services_grouped())


@app.route('/api/core/call/<path:service>/<method>', methods=['GET', 'POST'])
@app.route('/api/core/call/<path:service>/<method>/<path:args>', methods=['GET', 'POST'])
@app.route('/api/mrl/call/<path:service>/<method>', methods=['GET', 'POST'])
@app.route('/api/mrl/call/<path:service>/<method>/<path:args>', methods=['GET', 'POST'])
def core_call(service, method, args=None):
    arg_list = args.split('/') if args else []
    result = _get_inmoove_core().call(service, method, arg_list)
    status = result.get('status', 200 if result.get('ok') else 500)
    return jsonify(result), status


@app.route('/api/core/proxy/<path:subpath>', methods=['GET', 'POST'])
@app.route('/api/mrl/proxy/<path:subpath>', methods=['GET', 'POST'])
def core_proxy(subpath):
    parts = subpath.strip('/').split('/')
    if parts and parts[0] == 'service':
        parts = parts[1:]
    if len(parts) < 2:
        return jsonify({"ok": False, "error": "path must be service/{name}/{method}/..."}), 400
    service, method, *rest = parts
    result = _get_inmoove_core().call(service, method, rest)
    status = result.get('status', 200 if result.get('ok') else 500)
    return jsonify(result), status


@app.route('/api/core/gestures', methods=['GET'])
@app.route('/api/mrl/gestures', methods=['GET'])
def core_gestures():
    return jsonify(_get_inmoove_core().load_gestures_catalog())


@app.route('/api/core/exec', methods=['POST'])
@app.route('/api/core/exec/<gesture>', methods=['GET', 'POST'])
@app.route('/api/mrl/exec', methods=['POST'])
@app.route('/api/mrl/exec/<gesture>', methods=['GET', 'POST'])
def core_exec(gesture=None):
    if request.method == 'POST' and not gesture:
        body = request.get_json() or {}
        gesture = body.get('gesture') or body.get('mrlName') or body.get('name')
    if not gesture:
        return jsonify({"ok": False, "error": "Gesture name required"}), 400
    result = _get_inmoove_core().exec_gesture(gesture)
    return jsonify(result), (200 if result.get('ok') else 404)


@app.route('/api/core/servo/<path:service>/state', methods=['GET'])
@app.route('/api/mrl/servo/<path:service>/state', methods=['GET'])
def core_servo_state(service):
    return jsonify(_get_inmoove_core().servo_state(service))


@app.route('/api/core/robot/servos', methods=['GET'])
@app.route('/api/mrl/i01/servos', methods=['GET'])
def core_robot_servos():
    return jsonify(_get_inmoove_core().robot_servos())


@app.route('/api/core/assets/<path:filename>')
@app.route('/api/mrl/assets/<path:filename>')
def core_assets(filename):
    path = _get_inmoove_core().resolve_asset(filename)
    if path is not None:
        return send_file(path)
    return jsonify({"ok": False, "error": f"Asset not found: {filename}"}), 404


@app.route('/api/core/robot/config', methods=['GET'])
@app.route('/api/mrl/i01/config', methods=['GET'])
def core_robot_config():
    return jsonify(_get_inmoove_core().robot_config())


@app.route('/api/core/robot/peer/<action>/<peer>', methods=['GET', 'POST'])
@app.route('/api/mrl/i01/peer/<action>/<peer>', methods=['GET', 'POST'])
def core_robot_peer(action, peer):
    if action not in ('startPeer', 'releasePeer'):
        return jsonify({"ok": False, "error": "action must be startPeer or releasePeer"}), 400
    result = _get_inmoove_core().peer_action(action, peer)
    return jsonify(result), (200 if result.get('ok') else 400)


@app.route('/api/core/robot/speak', methods=['POST'])
@app.route('/api/mrl/i01/speak', methods=['POST'])
def core_robot_speak():
    data = request.get_json() or {}
    text = (data.get('text') or '').strip()
    if not text:
        return jsonify({"ok": False, "error": "text required"}), 400
    return jsonify(_get_inmoove_core().speak(text))


@app.route('/api/core/script', methods=['POST'])
@app.route('/api/mrl/python/exec', methods=['POST'])
def core_script():
    data = request.get_json() or {}
    script = (data.get('script') or '').strip()
    if not script:
        return jsonify({"ok": False, "error": "script required"}), 400
    result = _get_inmoove_core().exec_script(script)
    return jsonify(result), (200 if result.get('ok') else 400)


@app.route('/api/core/peers', methods=['GET'])
@app.route('/api/mrl/peers', methods=['GET'])
def core_peers():
    return jsonify(_get_inmoove_core().list_peers())


@app.route('/api/core/life', methods=['GET'])
@app.route('/api/mrl/life', methods=['GET'])
def core_life_status():
    return jsonify(_get_inmoove_core().life_status())


@app.route('/api/core/life/<action>', methods=['GET', 'POST'])
@app.route('/api/mrl/life/<action>', methods=['GET', 'POST'])
def core_life_action(action):
    result = _get_inmoove_core().life_action(action)
    return jsonify(result), (200 if result.get('ok') else 400)


@app.route('/api/core/stop', methods=['POST', 'GET'])
@app.route('/api/mrl/stop', methods=['POST', 'GET'])
def core_stop():
    core = _get_inmoove_core()
    g = core.stop_gesture()
    # also halt random life
    core._stop_life_thread()
    core.life_mode = "awake"
    return jsonify({"ok": True, "gesture": g, "lifeMode": core.life_mode})


@app.route('/api/core/rest', methods=['POST', 'GET'])
@app.route('/api/mrl/rest', methods=['POST', 'GET'])
def core_rest():
    return jsonify(_get_inmoove_core().rest_all())


# ── RealSense D455 API ────────────────────────────────────────

@app.route('/api/realsense/devices', methods=['GET'])
def realsense_devices():
    guard = get_presence_guard(on_wake=_on_realsense_wake)
    return jsonify({"ok": True, "devices": guard.list_devices()})


@app.route('/api/realsense/status', methods=['GET'])
def realsense_status():
    guard = get_presence_guard(on_wake=_on_realsense_wake)
    return jsonify({"ok": True, **guard.status()})


@app.route('/api/realsense/start', methods=['POST'])
def realsense_start():
    guard = get_presence_guard(on_wake=_on_realsense_wake)
    data = request.get_json(silent=True) or {}
    # Optional config overrides on start
    cfg_keys = (
        "presence_seconds", "min_distance_m", "max_distance_m",
        "min_person_pixel_ratio", "greet_cooldown_s", "greet_text",
        "enable_motors_on_wake", "require_leave", "use_hog_confirm",
    )
    overrides = {k: data[k] for k in cfg_keys if k in data}
    if overrides:
        guard.update_config(**overrides)
    result = guard.start()
    status = 200 if result.get("ok") else 500
    return jsonify(result), status


@app.route('/api/realsense/stop', methods=['POST'])
def realsense_stop():
    guard = get_presence_guard(on_wake=_on_realsense_wake)
    return jsonify(guard.stop())


@app.route('/api/realsense/config', methods=['GET', 'POST'])
def realsense_config():
    guard = get_presence_guard(on_wake=_on_realsense_wake)
    if request.method == 'GET':
        return jsonify({"ok": True, "config": guard.status().get("config", {})})
    data = request.get_json() or {}
    cfg = guard.update_config(**data)
    return jsonify({"ok": True, "config": cfg})


@app.route('/api/realsense/wake-now', methods=['POST'])
def realsense_wake_now():
    """Manual test of the same wake path (motors + hello)."""
    data = request.get_json(silent=True) or {}
    event = {
        "greet_text": data.get("greet_text") or "Hello, how are you?",
        "enable_motors": data.get("enable_motors", True),
        "presence_seconds": data.get("presence_seconds", 5.0),
        "median_distance_m": data.get("median_distance_m"),
        "timestamp": time.time(),
        "manual": True,
    }
    _on_realsense_wake(event)
    return jsonify({"ok": True, "event": event})


@app.route('/api/realsense/stream')
def realsense_stream():
    """MJPEG color stream with presence overlay (chest D455)."""
    from flask import Response

    kind = (request.args.get("kind") or "color").lower()
    guard = get_presence_guard(on_wake=_on_realsense_wake)

    def generate():
        # Auto-start if not running so the UI can just open the stream
        if not guard.status().get("running"):
            guard.start()
        boundary = b"--frame\r\n"
        while True:
            jpeg = guard.get_jpeg(kind)
            if jpeg:
                yield boundary
                yield b"Content-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n"
            else:
                # Placeholder frame while camera warms up
                time.sleep(0.05)
                continue
            time.sleep(0.06)  # ~15 fps cap

    return Response(
        generate(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
        headers={"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache"},
    )


@app.route('/api/realsense/snapshot')
def realsense_snapshot():
    kind = (request.args.get("kind") or "color").lower()
    guard = get_presence_guard(on_wake=_on_realsense_wake)
    jpeg = guard.get_jpeg(kind)
    if not jpeg:
        return jsonify({"ok": False, "error": "No frame yet — start the D455 guard first"}), 404
    from flask import Response
    return Response(jpeg, mimetype="image/jpeg")


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
