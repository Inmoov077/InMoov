"""
InMoov Upper Body — Movement Controller Dashboard (Python Backend)

Flask + Flask-SocketIO server that bridges the web dashboard
to the Arduino Mega via serial. Auto-detects the Arduino COM port.
Supports both arms (20 servos), 10 movement patterns, body-part
enable/disable, and runtime pin configuration.

Run:  python server.py
Open: http://localhost:5000
"""

import serial
import serial.tools.list_ports
import threading
import time
import json
import sys
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit

# ─────────────────────────── App Setup ───────────────────────────
app = Flask(__name__)
app.config["SECRET_KEY"] = "inmoov-flag-waver-2025"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# ─────────────────────────── Serial State ────────────────────────
arduino = None
serial_thread = None
running = False
start_time = time.time()
bytes_sent = 0
bytes_recv = 0

# ─────────────────────────── Servo Config ────────────────────────
SERVO_LIMITS = {
    # Right arm (DS5160 60kg)
    "r_shoulder":  {"min": 0,  "max": 150, "rest": 30,  "type": "DS5160", "pin": 23,  "group": "r_arm"},
    "r_omoplate": {"min": 10, "max": 70,  "rest": 10,  "type": "DS5160", "pin": 25,  "group": "r_arm"},
    "r_bicep":    {"min": 0,  "max": 85,  "rest": 5,   "type": "DS5160", "pin": 27,  "group": "r_arm"},
    "r_rotate":   {"min": 40, "max": 150, "rest": 90,  "type": "DS5160", "pin": 29,  "group": "r_arm"},
    # Right hand (MG996R via PCA9685)
    "r_thumb":    {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 0,    "group": "r_hand"},
    "r_index":    {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 1,    "group": "r_hand"},
    "r_middle":   {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 2,    "group": "r_hand"},
    "r_ring":     {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 3,    "group": "r_hand"},
    "r_pinky":    {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 4,    "group": "r_hand"},
    "r_wrist":    {"min": 10, "max": 160, "rest": 90,  "type": "MG996R", "ch": 5,    "group": "r_hand"},
    # Left arm (DS5160 60kg)
    "l_shoulder":  {"min": 0,  "max": 150, "rest": 30,  "type": "DS5160", "pin": 22,  "group": "l_arm"},
    "l_omoplate": {"min": 10, "max": 70,  "rest": 10,  "type": "DS5160", "pin": 24,  "group": "l_arm"},
    "l_bicep":    {"min": 0,  "max": 85,  "rest": 5,   "type": "DS5160", "pin": 26,  "group": "l_arm"},
    "l_rotate":   {"min": 40, "max": 150, "rest": 90,  "type": "DS5160", "pin": 28,  "group": "l_arm"},
    # Left hand (MG996R via PCA9685)
    "l_thumb":    {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 6,    "group": "l_hand"},
    "l_index":    {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 7,    "group": "l_hand"},
    "l_middle":   {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 8,    "group": "l_hand"},
    "l_ring":     {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 9,    "group": "l_hand"},
    "l_pinky":    {"min": 10, "max": 130, "rest": 10,  "type": "MG996R", "ch": 10,   "group": "l_hand"},
    "l_wrist":    {"min": 10, "max": 160, "rest": 90,  "type": "MG996R", "ch": 11,   "group": "l_hand"},
}

servo_state = {name: cfg["rest"] for name, cfg in SERVO_LIMITS.items()}

wave_state = {
    "active": False,
    "pattern": "gentle",
    "speed": 50,
    "amplitude": 50,
}

# Body-part enable state
enabled_parts = {
    "r_arm": True,
    "r_hand": True,
    "l_arm": True,
    "l_hand": True,
}

PATTERNS = [
    {"id": "gentle",    "name": "Gentle",       "icon": "🌊", "hands": "right"},
    {"id": "vigorous",  "name": "Vigorous",     "icon": "💪", "hands": "right"},
    {"id": "sideway",   "name": "Side-to-Side", "icon": "↔️", "hands": "right"},
    {"id": "figure8",   "name": "Figure-8",     "icon": "∞",  "hands": "right"},
    {"id": "greeting",  "name": "Greeting",     "icon": "👋", "hands": "right"},
    {"id": "salute",    "name": "Salute",       "icon": "🫡", "hands": "right"},
    {"id": "pride",     "name": "Pride",        "icon": "🇮🇳", "hands": "right"},
    {"id": "celebrate", "name": "Celebrate",    "icon": "🎉", "hands": "both"},
    {"id": "drstrange", "name": "Dr. Strange",  "icon": "🔮", "hands": "both"},
    {"id": "gunshoot",  "name": "Gun Shoot",    "icon": "🔫", "hands": "both"},
]


# ─────────────────────────── Auto Detect ─────────────────────────
def detect_arduino_port():
    """Scan COM ports and auto-detect an Arduino Mega."""
    ports = serial.tools.list_ports.comports()
    candidates = []

    for p in ports:
        desc = (p.description or "").lower()
        hwid = (p.hwid or "").lower()
        score = 0

        # Arduino Mega official VID:PID
        if "2341:0042" in hwid or "2341:0010" in hwid:
            score += 100
        # CH340 clone (very common for Mega clones)
        if "1a86:7523" in hwid:
            score += 80
        # CP2102 / FTDI
        if "10c4:ea60" in hwid or "0403:6001" in hwid:
            score += 60
        # Keyword match
        for kw in ["mega", "arduino", "ch340", "cp210", "ftdi", "usb-serial", "usb serial", "serial"]:
            if kw in desc:
                score += 20

        if score > 0:
            candidates.append((score, p.device))

    candidates.sort(key=lambda x: -x[0])
    if candidates:
        return candidates[0][1]

    # Last resort: first available port
    if ports:
        return ports[0].device
    return None


# ─────────────────────────── Serial I/O ──────────────────────────
def serial_reader():
    """Background thread — reads lines from Arduino and pushes to clients."""
    global arduino, running

    while running:
        if arduino is None or not arduino.is_open:
            time.sleep(0.2)
            continue
        try:
            if arduino.in_waiting:
                raw = arduino.readline()
                global bytes_recv
                bytes_recv += len(raw)
                line = raw.decode("utf-8", errors="ignore").strip()
                if line:
                    _parse_response(line)
        except serial.SerialException:
            _handle_disconnect("Serial connection lost")
            break
        except Exception as e:
            print(f"[serial_reader] {e}")
        time.sleep(0.008)


def _parse_response(line):
    """Parse a response line from the Arduino."""
    global servo_state, wave_state, enabled_parts

    socketio.emit("serial_log", {"data": line, "ts": time.time()})

    if line.startswith("RSP:STATUS"):
        parts = line.split(":")
        for part in parts[2:]:
            if "=" not in part:
                continue
            key, val = part.split("=", 1)
            if key == "waving":
                wave_state["active"] = (val == "1")
            elif key == "enable":
                try:
                    mask = int(val)
                    enabled_parts["r_arm"]  = bool(mask & 0x01)
                    enabled_parts["r_hand"] = bool(mask & 0x02)
                    enabled_parts["l_arm"]  = bool(mask & 0x04)
                    enabled_parts["l_hand"] = bool(mask & 0x08)
                except ValueError:
                    pass
            elif key in servo_state:
                try:
                    servo_state[key] = int(val)
                except ValueError:
                    pass
        socketio.emit("status_update", {
            "servos": servo_state,
            "wave": wave_state,
            "connected": True,
            "enabled_parts": enabled_parts,
        })

    elif line.startswith("RSP:READY"):
        socketio.emit("arduino_ready", {"message": line})

    elif line.startswith("RSP:OK"):
        socketio.emit("command_ok", {"response": line})

    elif line.startswith("RSP:ERR"):
        socketio.emit("command_error", {"error": line})


def _send(cmd: str) -> bool:
    """Send a newline-terminated command to the Arduino."""
    global arduino, bytes_sent
    if arduino and arduino.is_open:
        try:
            data_to_send = (cmd + "\n").encode()
            arduino.write(data_to_send)
            bytes_sent += len(data_to_send)
            return True
        except Exception as e:
            print(f"[_send] {e}")
    return False


def _handle_disconnect(msg="Disconnected"):
    global arduino, running
    running = False
    if arduino:
        try:
            arduino.close()
        except Exception:
            pass
        arduino = None
    socketio.emit("connection_status", {"connected": False, "msg": msg})


def _get_enable_mask():
    """Convert enabled_parts dict to bitmask."""
    mask = 0
    if enabled_parts.get("r_arm"):  mask |= 0x01
    if enabled_parts.get("r_hand"): mask |= 0x02
    if enabled_parts.get("l_arm"):  mask |= 0x04
    if enabled_parts.get("l_hand"): mask |= 0x08
    return mask


# ─────────────────────────── HTTP Routes ─────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/ports")
def api_ports():
    ports = serial.tools.list_ports.comports()
    detected = detect_arduino_port()
    return jsonify({
        "ports": [{"device": p.device, "description": p.description, "hwid": p.hwid} for p in ports],
        "detected": detected,
    })


@app.route("/api/limits")
def api_limits():
    return jsonify(SERVO_LIMITS)


@app.route("/api/patterns")
def api_patterns():
    return jsonify(PATTERNS)


@app.route("/api/system_info")
def api_system_info():
    uptime = time.time() - start_time
    return jsonify({
        "uptime": uptime,
        "bytes_sent": bytes_sent,
        "bytes_recv": bytes_recv,
    })


# ─────────────────────────── WebSocket Events ────────────────────
@socketio.on("connect")
def ws_connect():
    connected = arduino is not None and arduino.is_open
    emit("connection_status", {
        "connected": connected,
        "port": arduino.port if connected else None,
        "msg": f"Connected to {arduino.port}" if connected else "Not connected",
    })
    emit("status_update", {
        "servos": servo_state,
        "wave": wave_state,
        "connected": connected,
        "enabled_parts": enabled_parts,
    })
    emit("limits", SERVO_LIMITS)
    emit("patterns", PATTERNS)


@socketio.on("connect_arduino")
def ws_connect_arduino(data=None):
    global arduino, serial_thread, running

    if arduino and arduino.is_open:
        emit("connection_status", {"connected": True, "port": arduino.port, "msg": f"Already connected to {arduino.port}"})
        return

    port = detect_arduino_port()
    if not port:
        emit("connection_status", {"connected": False, "msg": "No Arduino detected — check USB cable"})
        return

    try:
        arduino = serial.Serial(port, 115200, timeout=1)
        time.sleep(2)  # Arduino resets on serial open

        running = True
        serial_thread = threading.Thread(target=serial_reader, daemon=True)
        serial_thread.start()

        time.sleep(0.5)
        _send("CMD:STATUS")

        emit("connection_status", {"connected": True, "port": port, "msg": f"Connected to {port}"})
    except Exception as e:
        emit("connection_status", {"connected": False, "msg": f"Failed: {e}"})


@socketio.on("disconnect_arduino")
def ws_disconnect_arduino():
    _send("CMD:HOME")
    time.sleep(0.3)
    _handle_disconnect("Disconnected by user")


@socketio.on("move_servo")
def ws_move(data):
    name = data.get("servo", "")
    angle = int(data.get("angle", 0))
    if name in SERVO_LIMITS:
        lim = SERVO_LIMITS[name]
        angle = max(lim["min"], min(lim["max"], angle))
        _send(f"CMD:MOVE:{name}:{angle}")
        servo_state[name] = angle


@socketio.on("start_wave")
def ws_start_wave(data):
    pat = data.get("pattern", "gentle")
    spd = max(1, min(100, int(data.get("speed", 50))))
    amp = max(1, min(100, int(data.get("amplitude", 50))))
    wave_state.update(active=True, pattern=pat, speed=spd, amplitude=amp)
    _send(f"CMD:WAVE:{pat}:{spd}:{amp}")


@socketio.on("stop_wave")
def ws_stop_wave():
    wave_state["active"] = False
    _send("CMD:STOP")


@socketio.on("emergency_stop")
def ws_estop():
    wave_state["active"] = False
    _send("CMD:STOP")
    emit("command_ok", {"response": "🔴 Emergency Stop Activated"})


@socketio.on("go_home")
def ws_home():
    wave_state["active"] = False
    _send("CMD:HOME")
    for name, cfg in SERVO_LIMITS.items():
        servo_state[name] = cfg["rest"]


@socketio.on("grip")
def ws_grip(data):
    pct = max(0, min(100, int(data.get("percentage", 80))))
    side = data.get("side", "right")
    if side == "both":
        _send(f"CMD:GRIP:both:{pct}")
    elif side == "left":
        _send(f"CMD:GRIP:left:{pct}")
    else:
        _send(f"CMD:GRIP:{pct}")


@socketio.on("set_part_enabled")
def ws_set_part_enabled(data):
    part = data.get("part", "")
    enabled = data.get("enabled", True)
    if part in enabled_parts:
        enabled_parts[part] = enabled
        mask = _get_enable_mask()
        _send(f"CMD:ENABLE:{mask}")
        emit("enabled_parts_update", enabled_parts)


@socketio.on("set_pin_config")
def ws_set_pin(data):
    servo_name = data.get("servo", "")
    new_pin = int(data.get("pin", 0))
    if servo_name in SERVO_LIMITS:
        _send(f"CMD:SETPIN:{servo_name}:{new_pin}")
        # Update local config
        if "pin" in SERVO_LIMITS[servo_name]:
            SERVO_LIMITS[servo_name]["pin"] = new_pin
        elif "ch" in SERVO_LIMITS[servo_name]:
            SERVO_LIMITS[servo_name]["ch"] = new_pin


@socketio.on("request_status")
def ws_request_status():
    _send("CMD:STATUS")
    emit("status_update", {
        "servos": servo_state,
        "wave": wave_state,
        "connected": arduino is not None and arduino.is_open,
        "enabled_parts": enabled_parts,
    })


@socketio.on("send_raw")
def ws_send_raw(data):
    cmd = data.get("cmd", "")
    if cmd:
        _send(cmd)


@socketio.on("sweep_test")
def ws_sweep_test(data):
    part = data.get("part", "")
    action = data.get("action", "start")
    if action == "start":
        _send(f"CMD:SWEEP:{part}")
    else:
        _send("CMD:STOP")


@socketio.on("drive")
def ws_drive(data):
    speed = data.get("speed", 0)
    turn = data.get("turn", 0)
    _send(f"CMD:DRIVE:{speed}:{turn}")


# ─────────────────────────── Main ────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("  InMoov Upper Body Dashboard")
    print("=" * 50)
    print("  Dashboard -> http://localhost:5000")
    print("=" * 50)

    det = detect_arduino_port()
    if det:
        print(f"  Arduino detected on: {det}")
    else:
        print("  No Arduino detected (connect via dashboard)")
    print()

    socketio.run(app, host="0.0.0.0", port=5000, debug=False, allow_unsafe_werkzeug=True)
