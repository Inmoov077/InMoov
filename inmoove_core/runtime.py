"""
InMoove Core runtime — self-contained InMoov stack.

Owns peers, virtual servos, gesture playback, speech, and a safe script DSL.
Motion goes through the host app's serial callbacks (Arduino firmware).
"""

from __future__ import annotations

import ast
import json
import logging
import os
import re
import threading
import time
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)

CORE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = CORE_DIR / "assets"
CONFIG_DIR = CORE_DIR / "config"
VERSION = "1.0.0"
PRODUCT = "InMoove Core"

# Virtual service name → shared/servo_config.json key
# Accept both product names (robot.*) and legacy i01.* aliases.
SERVO_SERVICE_MAP: Dict[str, str] = {
    # Head / neck
    "robot.head.rothead": "neck_rot",
    "robot.head.neck": "head_neck",
    "robot.head.rollNeck": "neck_roll",
    "robot.head.eyeX": "head_eye",
    "robot.head.eyeY": "head_eye",
    "robot.head.jaw": "head_jaw",
    "robot.head.eyelidLeft": "head_eye",
    "robot.head.eyelidRight": "head_eye",
    "i01.head.rothead": "neck_rot",
    "i01.head.neck": "head_neck",
    "i01.head.rollNeck": "neck_roll",
    "i01.head.eyeX": "head_eye",
    "i01.head.eyeY": "head_eye",
    "i01.head.jaw": "head_jaw",
    "i01.head.eyelidLeft": "head_eye",
    "i01.head.eyelidRight": "head_eye",
    # Left arm (keys match shared/servo_config.json)
    "robot.leftArm.shoulder": "l_shoulder",
    "robot.leftArm.omoplate": "l_lift",
    "robot.leftArm.rotate": "l_rotate",
    "robot.leftArm.bicep": "l_elbow",
    "i01.leftArm.shoulder": "l_shoulder",
    "i01.leftArm.omoplate": "l_lift",
    "i01.leftArm.rotate": "l_rotate",
    "i01.leftArm.bicep": "l_elbow",
    # Right arm
    "robot.rightArm.shoulder": "r_shoulder",
    "robot.rightArm.omoplate": "r_lift",
    "robot.rightArm.rotate": "r_rotate",
    "robot.rightArm.bicep": "r_elbow",
    "i01.rightArm.shoulder": "r_shoulder",
    "i01.rightArm.omoplate": "r_lift",
    "i01.rightArm.rotate": "r_rotate",
    "i01.rightArm.bicep": "r_elbow",
    # Hands
    "robot.leftHand.thumb": "l_thumb",
    "robot.leftHand.index": "l_index",
    "robot.leftHand.majeure": "l_middle",
    "robot.leftHand.ringFinger": "l_ring",
    "robot.leftHand.pinky": "l_pinky",
    "robot.leftHand.wrist": "l_wrist",
    "i01.leftHand.thumb": "l_thumb",
    "i01.leftHand.index": "l_index",
    "i01.leftHand.majeure": "l_middle",
    "i01.leftHand.ringFinger": "l_ring",
    "i01.leftHand.pinky": "l_pinky",
    "i01.leftHand.wrist": "l_wrist",
    "robot.rightHand.thumb": "r_thumb",
    "robot.rightHand.index": "r_index",
    "robot.rightHand.majeure": "r_middle",
    "robot.rightHand.ringFinger": "r_ring",
    "robot.rightHand.pinky": "r_pinky",
    "robot.rightHand.wrist": "r_wrist",
    "i01.rightHand.thumb": "r_thumb",
    "i01.rightHand.index": "r_index",
    "i01.rightHand.majeure": "r_middle",
    "i01.rightHand.ringFinger": "r_ring",
    "i01.rightHand.pinky": "r_pinky",
    "i01.rightHand.wrist": "r_wrist",
    # Legs
    "robot.leftLeg.hip": "l_hip",
    "robot.leftLeg.thigh": "l_thigh",
    "robot.leftLeg.knee": "l_knee",
    "robot.leftLeg.ankle": "l_ankle",
    "robot.leftLeg.foot": "l_foot",
    "i01.leftLeg.hip": "l_hip",
    "i01.leftLeg.thigh": "l_thigh",
    "i01.leftLeg.knee": "l_knee",
    "i01.leftLeg.ankle": "l_ankle",
    "i01.leftLeg.foot": "l_foot",
    "robot.rightLeg.hip": "r_hip",
    "robot.rightLeg.thigh": "r_thigh",
    "robot.rightLeg.knee": "r_knee",
    "robot.rightLeg.ankle": "r_ankle",
    "robot.rightLeg.foot": "r_foot",
    "i01.rightLeg.hip": "r_hip",
    "i01.rightLeg.thigh": "r_thigh",
    "i01.rightLeg.knee": "r_knee",
    "i01.rightLeg.ankle": "r_ankle",
    "i01.rightLeg.foot": "r_foot",
    # Torso (optional / soft keys)
    "robot.torso.topStom": "torso_top",
    "robot.torso.midStom": "torso_mid",
    "robot.torso.lowStom": "torso_low",
    "i01.torso.topStom": "torso_top",
    "i01.torso.midStom": "torso_mid",
    "i01.torso.lowStom": "torso_low",
}

# Public servo catalog for Studio UI (legacy service names for frontend compatibility)
ROBOT_SERVOS = [
    {"service": "i01.head.rothead", "label": "Head pan", "group": "head", "key": "neck_rot"},
    {"service": "i01.head.neck", "label": "Head tilt", "group": "head", "key": "head_neck"},
    {"service": "i01.head.rollNeck", "label": "Head roll", "group": "head", "key": "neck_roll"},
    {"service": "i01.head.eyeX", "label": "Eye X", "group": "head", "key": "head_eye"},
    {"service": "i01.head.eyeY", "label": "Eye Y", "group": "head", "key": "head_eye"},
    {"service": "i01.head.jaw", "label": "Jaw", "group": "head", "key": "head_jaw"},
    {"service": "i01.head.eyelidLeft", "label": "Eyelid L", "group": "head", "key": "head_eye"},
    {"service": "i01.head.eyelidRight", "label": "Eyelid R", "group": "head", "key": "head_eye"},
    {"service": "i01.leftArm.shoulder", "label": "L shoulder", "group": "leftArm", "key": "l_shoulder"},
    {"service": "i01.leftArm.omoplate", "label": "L omoplate", "group": "leftArm", "key": "l_lift"},
    {"service": "i01.leftArm.rotate", "label": "L rotate", "group": "leftArm", "key": "l_rotate"},
    {"service": "i01.leftArm.bicep", "label": "L bicep", "group": "leftArm", "key": "l_elbow"},
    {"service": "i01.rightArm.shoulder", "label": "R shoulder", "group": "rightArm", "key": "r_shoulder"},
    {"service": "i01.rightArm.omoplate", "label": "R omoplate", "group": "rightArm", "key": "r_lift"},
    {"service": "i01.rightArm.rotate", "label": "R rotate", "group": "rightArm", "key": "r_rotate"},
    {"service": "i01.rightArm.bicep", "label": "R bicep", "group": "rightArm", "key": "r_elbow"},
    {"service": "i01.leftHand.thumb", "label": "L thumb", "group": "leftHand", "key": "l_thumb"},
    {"service": "i01.leftHand.index", "label": "L index", "group": "leftHand", "key": "l_index"},
    {"service": "i01.leftHand.majeure", "label": "L middle", "group": "leftHand", "key": "l_middle"},
    {"service": "i01.leftHand.ringFinger", "label": "L ring", "group": "leftHand", "key": "l_ring"},
    {"service": "i01.leftHand.pinky", "label": "L pinky", "group": "leftHand", "key": "l_pinky"},
    {"service": "i01.leftHand.wrist", "label": "L wrist", "group": "leftHand", "key": "l_wrist"},
    {"service": "i01.rightHand.thumb", "label": "R thumb", "group": "rightHand", "key": "r_thumb"},
    {"service": "i01.rightHand.index", "label": "R index", "group": "rightHand", "key": "r_index"},
    {"service": "i01.rightHand.majeure", "label": "R middle", "group": "rightHand", "key": "r_middle"},
    {"service": "i01.rightHand.ringFinger", "label": "R ring", "group": "rightHand", "key": "r_ring"},
    {"service": "i01.rightHand.pinky", "label": "R pinky", "group": "rightHand", "key": "r_pinky"},
    {"service": "i01.rightHand.wrist", "label": "R wrist", "group": "rightHand", "key": "r_wrist"},
    {"service": "i01.leftLeg.hip", "label": "L hip", "group": "leftLeg", "key": "l_hip"},
    {"service": "i01.leftLeg.thigh", "label": "L thigh", "group": "leftLeg", "key": "l_thigh"},
    {"service": "i01.leftLeg.knee", "label": "L knee", "group": "leftLeg", "key": "l_knee"},
    {"service": "i01.leftLeg.ankle", "label": "L ankle", "group": "leftLeg", "key": "l_ankle"},
    {"service": "i01.leftLeg.foot", "label": "L foot", "group": "leftLeg", "key": "l_foot"},
    {"service": "i01.rightLeg.hip", "label": "R hip", "group": "rightLeg", "key": "r_hip"},
    {"service": "i01.rightLeg.thigh", "label": "R thigh", "group": "rightLeg", "key": "r_thigh"},
    {"service": "i01.rightLeg.knee", "label": "R knee", "group": "rightLeg", "key": "r_knee"},
    {"service": "i01.rightLeg.ankle", "label": "R ankle", "group": "rightLeg", "key": "r_ankle"},
    {"service": "i01.rightLeg.foot", "label": "R foot", "group": "rightLeg", "key": "r_foot"},
    {"service": "i01.torso.topStom", "label": "Torso top", "group": "torso", "key": "torso_top"},
    {"service": "i01.torso.midStom", "label": "Torso mid", "group": "torso", "key": "torso_mid"},
    {"service": "i01.torso.lowStom", "label": "Torso low", "group": "torso", "key": "torso_low"},
]

# MRL life subsystem script names (InMoov2/life)
LIFE_ACTIONS = (
    "sleepMode",
    "wake",
    "healthCheck",
    "moveHeadRandomize",
    "moveEyesRandomize",
    "moveBodyRandomize",
    "moveRandomize",
    "shutdown",
    "power_up",
    "power_down",
    "rest",
    "stopGesture",
)


def _read_json(path: Path, default=None):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default if default is not None else {}


class VirtualServo:
    def __init__(self, service: str, key: str, cfg: Optional[dict] = None):
        cfg = cfg or {}
        self.service = service
        self.key = key
        self.pin = int(cfg.get("pin", 0))
        self.min = int(cfg.get("min", 0))
        self.max = int(cfg.get("max", 180))
        self.rest = int(cfg.get("rest", 90))
        self.speed = float(cfg.get("speed", 50))
        self.position = self.rest
        self.attached = True
        self.enabled = True
        self.sweeping = False
        self.inverted = bool(cfg.get("inverted", False))

    def clamp(self, angle: int) -> int:
        return max(self.min, min(self.max, int(angle)))


class InMooveCore:
    """Native robot runtime used by Flask /api/core/* routes."""

    def __init__(
        self,
        project_root: str | Path,
        send_serial: Optional[Callable[[str], bool]] = None,
        get_servo_config: Optional[Callable[[], Optional[dict]]] = None,
    ):
        self.root = Path(project_root)
        self.send_serial = send_serial or (lambda _cmd: False)
        self.get_servo_config = get_servo_config or (lambda: None)
        self.started_at = time.time()
        self.state = "idle"
        self._lock = threading.RLock()
        self._gesture_thread: Optional[threading.Thread] = None
        self._gesture_stop = threading.Event()

        peers_path = CONFIG_DIR / "peers.json"
        peers_data = _read_json(peers_path, {})
        self.peers: Dict[str, dict] = {}
        for name, meta in (peers_data.get("peers") or {}).items():
            self.peers[name] = dict(meta)
            self.peers[name].setdefault("started", bool(meta.get("autoStart")))

        self.servos: Dict[str, VirtualServo] = {}
        self._rebuild_servos()

        self.gestures_path = self.root / "shared" / "gestures.json"
        if not self.gestures_path.is_file():
            alt = self.root / "shared" / "mrl_gestures.json"
            if alt.is_file():
                self.gestures_path = alt

        self.opencv_capturing = False
        self.opencv_camera_index = 0
        self.opencv_filters: List[str] = ["None"]
        self.opencv_display_filter = "None"
        self.last_script_result: Any = None

        # Life subsystem (MRL InMoov2/life)
        self.life_mode = "awake"  # awake | sleep | random | shutdown
        self._life_stop = threading.Event()
        self._life_thread: Optional[threading.Thread] = None
        self._life_log: List[str] = []

    # ── lifecycle ──────────────────────────────────────────────

    def _rebuild_servos(self):
        cfg = self.get_servo_config() or {}
        by_key = {s.get("key"): s for s in cfg.get("servos", []) if s.get("key")}
        self.servos = {}
        for entry in ROBOT_SERVOS:
            key = entry["key"]
            self.servos[entry["service"]] = VirtualServo(entry["service"], key, by_key.get(key))
        # Also register robot.* aliases pointing at same objects
        for svc, key in SERVO_SERVICE_MAP.items():
            if svc.startswith("robot.") and svc not in self.servos:
                # find matching i01 service with same key
                for i01_svc, s in self.servos.items():
                    if s.key == key:
                        self.servos[svc] = s
                        break
                else:
                    self.servos[svc] = VirtualServo(svc, key, by_key.get(key))

    def uptime(self) -> str:
        secs = int(time.time() - self.started_at)
        h, rem = divmod(secs, 3600)
        m, s = divmod(rem, 60)
        return f"{h:02d}:{m:02d}:{s:02d}"

    def status(self) -> dict:
        services = self.service_names()
        started_peers = sum(1 for p in self.peers.values() if p.get("started"))
        return {
            "ok": True,
            "online": True,
            "url": "local://inmoove-core",
            "version": VERSION,
            "product": PRODUCT,
            "serviceCount": len(services),
            "services": services,
            "i01State": self.state,
            "robotState": self.state,
            "lifeMode": self.life_mode,
            "peersStarted": started_peers,
            "peersTotal": len(self.peers),
            "gestureCount": self.load_gestures_catalog().get("count", 0),
            "uptime": self.uptime(),
            "serialReady": True,
        }

    def service_names(self) -> List[str]:
        names = ["runtime", "robot", "python", "webgui"]
        names.extend(sorted(self.servos.keys()))
        for peer in sorted(self.peers.keys()):
            names.append(f"robot.{peer}")
            names.append(f"i01.{peer}")
        # unique preserve order
        seen = set()
        out = []
        for n in names:
            if n not in seen:
                seen.add(n)
                out.append(n)
        return out

    def services_grouped(self) -> dict:
        services = self.service_names()
        grouped: Dict[str, List[str]] = {}
        for name in services:
            root = name.split(".")[0]
            grouped.setdefault(root, []).append(name)
        return {"ok": True, "services": services, "grouped": grouped, "count": len(services)}

    def robot_servos(self) -> dict:
        return {"ok": True, "servos": [{"service": e["service"], "label": e["label"], "group": e["group"]} for e in ROBOT_SERVOS]}

    def robot_config(self) -> dict:
        return {
            "ok": True,
            "data": {
                "peers": {
                    name: {
                        "autoStart": meta.get("autoStart", False),
                        "name": f"robot.{name}",
                        "type": meta.get("type"),
                        "started": meta.get("started", False),
                    }
                    for name, meta in self.peers.items()
                },
                "state": self.state,
                "product": PRODUCT,
                "version": VERSION,
            },
        }

    # ── peers ──────────────────────────────────────────────────

    def peer_action(self, action: str, peer: str) -> dict:
        peer = peer.strip()
        if peer.startswith("i01."):
            peer = peer[4:]
        if peer.startswith("robot."):
            peer = peer[6:]
        if peer not in self.peers:
            # allow creating soft peers
            self.peers[peer] = {"label": peer, "type": "Peer", "autoStart": False, "started": False}
        if action == "startPeer":
            self.peers[peer]["started"] = True
            if peer == "opencv":
                self.opencv_capturing = True
            return {"ok": True, "peer": peer, "action": action, "started": True}
        if action == "releasePeer":
            self.peers[peer]["started"] = False
            if peer == "opencv":
                self.opencv_capturing = False
            return {"ok": True, "peer": peer, "action": action, "started": False}
        return {"ok": False, "error": "action must be startPeer or releasePeer"}

    def list_peers(self) -> dict:
        peers = []
        for name, meta in sorted(self.peers.items()):
            peers.append(
                {
                    "name": name,
                    "label": meta.get("label", name),
                    "type": meta.get("type", "Peer"),
                    "autoStart": bool(meta.get("autoStart")),
                    "started": bool(meta.get("started")),
                    "service": f"i01.{name}",
                }
            )
        return {"ok": True, "peers": peers, "count": len(peers)}

    # ── life (MRL InMoov2/life) ─────────────────────────────────

    def stop_gesture(self) -> dict:
        self._gesture_stop.set()
        self.state = "idle"
        return {"ok": True, "action": "stopGesture"}

    def rest_all(self) -> dict:
        """Send rest pose for all mapped servos (MRL rest)."""
        cmds = 0
        for entry in ROBOT_SERVOS:
            key = entry.get("key")
            if not key:
                continue
            servo = None
            for s in self.servos.values():
                if s.key == key:
                    servo = s
                    break
            angle = servo.rest if servo else 90
            if self._send_key_angle(key, angle):
                cmds += 1
                if servo:
                    servo.position = angle
        # full-body batch for firmware
        self.send_serial("C,85,90,8,60,50,120\n")
        self.send_serial("LA,30,10,90,5,90\n")
        self.send_serial("RA,30,10,90,5,90\n")
        self.send_serial("LH,10,10,10,10,10\n")
        self.send_serial("RH,10,10,10,10,10\n")
        self.send_serial("LL,90,90,10,90,90\n")
        self.send_serial("RL,90,90,10,90,90\n")
        self.state = "idle"
        self.life_mode = "awake"
        return {"ok": True, "action": "rest", "servos": cmds}

    def _life_log_push(self, msg: str):
        self._life_log.append(f"{time.strftime('%H:%M:%S')} {msg}")
        self._life_log = self._life_log[-40:]

    def _stop_life_thread(self):
        self._life_stop.set()
        if self._life_thread and self._life_thread.is_alive():
            self._life_thread.join(timeout=1.0)
        self._life_thread = None

    def life_action(self, action: str) -> dict:
        """Run MRL life scripts as native behaviors."""
        action = (action or "").strip()
        if action not in LIFE_ACTIONS:
            return {"ok": False, "error": f"Unknown life action: {action}", "actions": list(LIFE_ACTIONS)}

        if action == "stopGesture":
            return self.stop_gesture()

        if action == "rest":
            self._stop_life_thread()
            return self.rest_all()

        if action == "power_up":
            self._stop_life_thread()
            self.life_mode = "awake"
            for peer in ("head", "leftArm", "rightArm", "leftHand", "rightHand", "torso", "mouth"):
                if peer in self.peers:
                    self.peers[peer]["started"] = True
            self._life_log_push("power_up — peers started")
            r = self.rest_all()
            self.speak("I am powered up")
            return {"ok": True, "action": action, "rest": r}

        if action == "power_down" or action == "shutdown":
            self._stop_life_thread()
            self.life_mode = "shutdown"
            self.stop_gesture()
            self.rest_all()
            for peer in self.peers:
                if peer not in ("audioPlayer",):
                    self.peers[peer]["started"] = False
            self._life_log_push("shutdown / power_down")
            self.speak("Powering down")
            self.state = "shutdown"
            return {"ok": True, "action": action}

        if action == "sleepMode":
            self._stop_life_thread()
            self.life_mode = "sleep"
            self.stop_gesture()
            # head down slightly
            self.send_serial("C,85,90,8,60,20,120\n")
            self._life_log_push("sleepMode")
            self.speak("Going to sleep")
            self.state = "sleep"
            return {"ok": True, "action": action}

        if action == "wake":
            self._stop_life_thread()
            self.life_mode = "awake"
            self.rest_all()
            self._life_log_push("wake")
            self.speak("I am awake")
            return {"ok": True, "action": action}

        if action == "healthCheck":
            self._life_log_push("healthCheck start")
            report = {
                "servos": len(self.servos),
                "peersStarted": sum(1 for p in self.peers.values() if p.get("started")),
                "peersTotal": len(self.peers),
                "gestures": self.load_gestures_catalog().get("count", 0),
                "lifeMode": self.life_mode,
                "state": self.state,
            }
            # brief head nod as self-check
            self.send_serial("C,85,90,8,60,35,120\n")
            time.sleep(0.3)
            self.send_serial("C,85,90,8,60,65,120\n")
            time.sleep(0.3)
            self.send_serial("C,85,90,8,60,50,120\n")
            self.speak(f"Health check complete. {report['gestures']} gestures ready.")
            self._life_log_push(f"healthCheck ok servos={report['servos']}")
            return {"ok": True, "action": action, "report": report}

        # randomize family
        if action in (
            "moveHeadRandomize",
            "moveEyesRandomize",
            "moveBodyRandomize",
            "moveRandomize",
        ):
            return self._start_randomize(action)

        return {"ok": False, "error": f"Unhandled life action: {action}"}

    def _start_randomize(self, mode: str) -> dict:
        self._stop_life_thread()
        self._life_stop.clear()
        self.life_mode = "random"
        self.state = f"life:{mode}"
        self.peers.setdefault("random", {})["started"] = True
        self._life_log_push(f"{mode} started")

        def runner():
            import random

            cycles = 0
            while not self._life_stop.is_set() and cycles < 40:
                cycles += 1
                try:
                    if mode in ("moveHeadRandomize", "moveRandomize"):
                        rot = random.randint(40, 100)
                        tilt = random.randint(30, 80)
                        roll = random.randint(90, 140)
                        self.send_serial(f"C,85,90,8,{rot},{tilt},{roll}\n")
                    if mode in ("moveEyesRandomize", "moveRandomize"):
                        eye = random.randint(70, 110)
                        self.send_serial(f"H,85,{eye},8\n")
                    if mode in ("moveBodyRandomize", "moveRandomize"):
                        sh = random.randint(40, 100)
                        lift = random.randint(15, 45)
                        el = random.randint(10, 55)
                        self.send_serial(f"RA,{sh},{lift},90,{el},90\n")
                        self.send_serial(f"LA,{sh},{lift},90,{el},90\n")
                except Exception as e:
                    logger.debug("randomize tick: %s", e)
                # ~1.2s between poses
                for _ in range(12):
                    if self._life_stop.is_set():
                        break
                    time.sleep(0.1)
            self.life_mode = "awake"
            self.state = "idle"
            self.peers.setdefault("random", {})["started"] = False
            self._life_log_push(f"{mode} stopped")

        self._life_thread = threading.Thread(target=runner, daemon=True, name=f"life-{mode}")
        self._life_thread.start()
        return {"ok": True, "action": mode, "running": True}

    def life_status(self) -> dict:
        return {
            "ok": True,
            "lifeMode": self.life_mode,
            "state": self.state,
            "actions": list(LIFE_ACTIONS),
            "log": list(self._life_log),
            "randomRunning": bool(self._life_thread and self._life_thread.is_alive()),
        }

    # ── gestures ───────────────────────────────────────────────

    def load_gestures_catalog(self) -> dict:
        data = _read_json(self.gestures_path, {})
        gestures = []
        for gid, g in data.items():
            mrl_name = g.get("mrlName") or g.get("name") or gid.replace("mrl-", "").replace("g-", "")
            gestures.append(
                {
                    "id": gid,
                    "mrlName": mrl_name,
                    "name": g.get("name", mrl_name),
                    "category": g.get("category", "full"),
                    "icon": g.get("icon", ""),
                }
            )
        gestures.sort(key=lambda x: x["name"].lower())
        return {"ok": True, "gestures": gestures, "count": len(gestures)}

    def _find_gesture(self, name: str) -> Optional[dict]:
        data = _read_json(self.gestures_path, {})
        raw = name.strip()
        candidates = [raw, raw.replace("mrl-", ""), f"mrl-{raw}", f"g-{raw}", raw.lower()]
        # exact id
        for c in candidates:
            if c in data:
                return data[c]
        # by mrlName
        lower = raw.lower().replace("mrl-", "")
        for g in data.values():
            if str(g.get("mrlName", "")).lower() == lower:
                return g
            if str(g.get("name", "")).lower() == lower:
                return g
        return None

    def exec_gesture(self, name: str) -> dict:
        gesture = name.strip()
        if gesture.startswith("mrl-"):
            gesture = gesture[4:]
        entry = self._find_gesture(gesture)
        if not entry:
            return {"ok": False, "error": f"Unknown gesture: {name}", "gesture": gesture}

        keyframes = entry.get("keyframes") or []
        self.state = f"gesture:{gesture}"
        self._gesture_stop.set()
        if self._gesture_thread and self._gesture_thread.is_alive():
            self._gesture_thread.join(timeout=0.5)
        self._gesture_stop.clear()

        def runner():
            try:
                self._play_keyframes(keyframes)
            finally:
                self.state = "idle"

        self._gesture_thread = threading.Thread(target=runner, daemon=True)
        self._gesture_thread.start()
        return {
            "ok": True,
            "gesture": gesture,
            "script": f"robot.{gesture}()",
            "frames": len(keyframes),
            "result": "started",
        }

    def _play_keyframes(self, keyframes: List[dict]):
        for kf in keyframes:
            if self._gesture_stop.is_set():
                return
            self._apply_keyframe(kf)
            hold = float(kf.get("hold", 300)) / 1000.0
            time.sleep(max(0.05, min(hold, 5.0)))

    def _apply_keyframe(self, kf: dict):
        hneck = kf.get("hneck", 85)
        eye = kf.get("eye", 90)
        jaw = kf.get("jaw", 8)
        rot = kf.get("rot", 60)
        tilt = kf.get("tilt", 50)
        roll = kf.get("roll", 120)
        self.send_serial(f"C,{int(hneck)},{int(eye)},{int(jaw)},{int(rot)},{int(tilt)},{int(roll)}\n")

        # update virtual positions
        mapping = {
            "i01.head.neck": hneck,
            "i01.head.eyeX": eye,
            "i01.head.jaw": jaw,
            "i01.head.rothead": rot,
            "i01.head.rollNeck": roll,
        }
        # neck tilt is head_neck in some maps; keep rothead as rot
        for svc, pos in mapping.items():
            if svc in self.servos:
                self.servos[svc].position = int(pos)

        def arm_cmd(side: str, arm: dict):
            if not arm:
                return
            # Clamp each arm joint through VirtualServo hard min/max walls
            p = "l" if side == "left" else "r"
            key_map = {
                "shoulder": f"{p}_shoulder",
                "lift": f"{p}_lift",
                "rotate": f"{p}_rotate",
                "elbow": f"{p}_elbow",
                "wrist": f"{p}_wrist",
            }
            defaults = {"shoulder": 30, "lift": 10, "rotate": 90, "elbow": 5, "wrist": 90}

            def clamp_joint(name: str) -> int:
                raw = arm.get(name, defaults[name])
                try:
                    val = int(raw)
                except (TypeError, ValueError):
                    val = defaults[name]
                key = key_map[name]
                for s in self.servos.values():
                    if s.key == key:
                        return s.clamp(val)
                # Fallback absolute walls matching shared/servo_config
                walls = {
                    "shoulder": (30, 180),
                    "lift": (10, 60 if side == "left" else 65),
                    "rotate": (40, 180),
                    "elbow": (0, 80 if side == "left" else 90),
                    "wrist": (10, 160),
                }
                lo, hi = walls[name]
                return max(lo, min(hi, val))

            shoulder = clamp_joint("shoulder")
            lift = clamp_joint("lift")
            rotate = clamp_joint("rotate")
            elbow = clamp_joint("elbow")
            wrist = clamp_joint("wrist")

            # Anti-overlap soft coupling (same rules as app._safe_arm)
            for _ in range(3):
                lift_max = 60 if side == "left" else 65
                elbow_max = 80 if side == "left" else 90
                rotate_min, rotate_max = 40, 180
                shoulder_max = 180
                shoulder_min = 30
                lift_min = 10
                elbow_min = 0
                for s in self.servos.values():
                    if s.key == key_map["lift"]:
                        lift_min, lift_max = s.min, s.max
                    elif s.key == key_map["elbow"]:
                        elbow_min, elbow_max = s.min, s.max
                    elif s.key == key_map["rotate"]:
                        rotate_min, rotate_max = s.min, s.max
                    elif s.key == key_map["shoulder"]:
                        shoulder_min, shoulder_max = s.min, s.max

                elbow_over = max(0, elbow - 40)
                lift_max = max(lift_min + 4, lift_max - int(round(elbow_over * 0.4)))
                lift_over = max(0, lift - 32)
                elbow_max = max(elbow_min + 4, elbow_max - int(round(lift_over * 0.7)))
                if shoulder > 125:
                    lift_max = max(lift_min + 4, lift_max - int(round((shoulder - 125) * 0.25)))
                if lift > 45:
                    shoulder_max = max(shoulder_min + 20, shoulder_max - int(round((lift - 45) * 1.2)))
                if elbow > 35:
                    shrink = int(round((elbow - 35) * 0.55))
                    rotate_min = min(rotate_max - 12, rotate_min + shrink)
                    rotate_max = max(rotate_min + 12, rotate_max - shrink)
                if shoulder < 55:
                    shrink = int(round((55 - shoulder) * 0.45))
                    rotate_min = min(95, rotate_min + shrink)
                if lift > 42 and shoulder > 100:
                    rotate_min = max(rotate_min, 55)
                    rotate_max = min(rotate_max, 155)

                n_shoulder = max(shoulder_min, min(shoulder_max, shoulder))
                n_lift = max(lift_min, min(lift_max, lift))
                n_rotate = max(rotate_min, min(rotate_max, rotate))
                n_elbow = max(elbow_min, min(elbow_max, elbow))
                if (n_shoulder, n_lift, n_rotate, n_elbow) == (shoulder, lift, rotate, elbow):
                    break
                shoulder, lift, rotate, elbow = n_shoulder, n_lift, n_rotate, n_elbow

            # Hardware inversion: output = min + max - input
            # All joints inverted except right omoplate (right lift)
            invert = {
                "shoulder": True,
                "lift": side != "right",
                "rotate": True,
                "elbow": True,
                "wrist": True,
            }
            logical = {
                "shoulder": shoulder,
                "lift": lift,
                "rotate": rotate,
                "elbow": elbow,
                "wrist": wrist,
            }
            hw = {}
            for name, val in logical.items():
                mn, mx = 0, 180
                for s in self.servos.values():
                    if s.key == key_map[name]:
                        mn, mx = s.min, s.max
                        break
                else:
                    defaults = {
                        "shoulder": (30, 180),
                        "lift": (10, 60 if side == "left" else 65),
                        "rotate": (40, 180),
                        "elbow": (0, 80 if side == "left" else 90),
                        "wrist": (10, 160),
                    }
                    mn, mx = defaults[name]
                hw[name] = (mn + mx - val) if invert[name] else val

            prefix = "LA" if side == "left" else "RA"
            self.send_serial(
                f"{prefix},{hw['shoulder']},{hw['lift']},{hw['rotate']},{hw['elbow']},{hw['wrist']}\n"
            )
            # Keep virtual servo positions as logical UI angles
            for name, pos in logical.items():
                key = key_map[name]
                for s in self.servos.values():
                    if s.key == key:
                        s.position = pos
                        break

        def hand_cmd(side: str, hand: dict):
            if not hand:
                return
            t = int(hand.get("thumb", 90))
            i = int(hand.get("index", 90))
            m = int(hand.get("middle", hand.get("majeure", 90)))
            r = int(hand.get("ring", hand.get("ringFinger", 90)))
            p = int(hand.get("pinky", 90))
            prefix = "LH" if side == "left" else "RH"
            self.send_serial(f"{prefix},{t},{i},{m},{r},{p}\n")

        def leg_cmd(side: str, leg: dict):
            if not leg:
                return
            hip = int(leg.get("hip", 90))
            thigh = int(leg.get("thigh", 90))
            knee = int(leg.get("knee", 90))
            ankle = int(leg.get("ankle", 90))
            foot = int(leg.get("foot", 90))
            prefix = "LL" if side == "left" else "RL"
            self.send_serial(f"{prefix},{hip},{thigh},{knee},{ankle},{foot}\n")

        arm_cmd("left", kf.get("leftArm") or {})
        arm_cmd("right", kf.get("rightArm") or {})
        hand_cmd("left", kf.get("leftHand") or {})
        hand_cmd("right", kf.get("rightHand") or {})
        leg_cmd("left", kf.get("leftLeg") or {})
        leg_cmd("right", kf.get("rightLeg") or {})

    # ── servo API ──────────────────────────────────────────────

    def _resolve_servo(self, service: str) -> Optional[VirtualServo]:
        if service in self.servos:
            return self.servos[service]
        # try alias
        key = SERVO_SERVICE_MAP.get(service)
        if key:
            for s in self.servos.values():
                if s.key == key:
                    return s
        return None

    def servo_state(self, service: str) -> dict:
        s = self._resolve_servo(service)
        if not s:
            return {
                "service": service,
                "ok": False,
                "error": "unknown servo",
                "getPin": None,
                "getMin": 0,
                "getMax": 180,
                "getRest": 90,
                "getSpeed": 50,
                "getPosition": None,
                "isAttached": False,
                "isSweeping": False,
            }
        return {
            "service": service,
            "ok": True,
            "getPin": s.pin,
            "getMin": s.min,
            "getMax": s.max,
            "getRest": s.rest,
            "getSpeed": s.speed,
            "getPosition": s.position,
            "isAttached": s.attached,
            "isSweeping": s.sweeping,
        }

    def _send_key_angle(self, key: str, angle: int) -> bool:
        """Map a config key to the best serial command."""
        cfg = self.get_servo_config() or {}
        by_key = {s.get("key"): s for s in cfg.get("servos", [])}
        # group keys
        head_keys = {"head_neck", "head_eye", "head_jaw"}
        neck_keys = {"neck_rot", "neck_tilt", "neck_roll"}

        # collect current positions for combined commands
        positions = {}
        for k, s in [(sv.key, sv) for sv in self.servos.values()]:
            positions[k] = s.position
        positions[key] = angle

        if key in head_keys or key in neck_keys:
            hneck = positions.get("head_neck", 85)
            eye = positions.get("head_eye", 90)
            jaw = positions.get("head_jaw", 8)
            rot = positions.get("neck_rot", 60)
            tilt = positions.get("neck_tilt", 50)
            roll = positions.get("neck_roll", 120)
            return bool(self.send_serial(f"C,{hneck},{eye},{jaw},{rot},{tilt},{roll}\n"))

        left_arm = ["l_shoulder", "l_lift", "l_rotate", "l_elbow", "l_wrist"]
        right_arm = ["r_shoulder", "r_lift", "r_rotate", "r_elbow", "r_wrist"]
        left_hand = ["l_thumb", "l_index", "l_middle", "l_ring", "l_pinky"]
        right_hand = ["r_thumb", "r_index", "r_middle", "r_ring", "r_pinky"]
        left_leg = ["l_hip", "l_thigh", "l_knee", "l_ankle", "l_foot"]
        right_leg = ["r_hip", "r_thigh", "r_knee", "r_ankle", "r_foot"]

        def pack(keys, prefix):
            vals = [int(positions.get(k, by_key.get(k, {}).get("rest", 90))) for k in keys]
            return self.send_serial(f"{prefix},{','.join(str(v) for v in vals)}\n")

        if key in left_arm:
            return bool(pack(left_arm, "LA"))
        if key in right_arm:
            return bool(pack(right_arm, "RA"))
        if key in left_hand:
            return bool(pack(left_hand, "LH"))
        if key in right_hand:
            return bool(pack(right_hand, "RH"))
        if key in left_leg:
            return bool(pack(left_leg, "LL"))
        if key in right_leg:
            return bool(pack(right_leg, "RL"))
        return False

    def call(self, service: str, method: str, args: Optional[List[str]] = None) -> dict:
        args = args or []
        service = service.strip()
        method = method.strip()

        # runtime
        if service in ("runtime", "webgui"):
            if method == "getVersion":
                return {"ok": True, "data": VERSION}
            if method == "getUptime":
                return {"ok": True, "data": self.uptime()}
            if method == "getServiceNames":
                return {"ok": True, "data": self.service_names()}
            if method == "start":
                return {"ok": True, "data": f"started:{args[0] if args else 'ok'}"}
            return {"ok": True, "data": None}

        # robot / i01 facade
        if service in ("robot", "i01"):
            if method in ("getState",):
                return {"ok": True, "data": self.state}
            if method in ("getConfig",):
                return self.robot_config()
            if method in ("startPeer", "releasePeer") and args:
                return {"ok": True, "data": self.peer_action(method, args[0])}
            if method in ("speakBlocking", "speak") and args:
                return self.speak(" ".join(args))
            if method and self._find_gesture(method):
                return {"ok": True, "data": self.exec_gesture(method)}
            return {"ok": True, "data": None}

        # python service
        if service == "python":
            if method == "exec" and args:
                script = "/".join(args) if isinstance(args, list) else str(args)
                # path may have encoded spaces — reconstruct from remaining
                return self.exec_script(script)
            return {"ok": True, "data": None}

        # opencv
        if service in ("i01.opencv", "robot.opencv"):
            return self._opencv_call(method, args)

        # chatBot
        if service in ("i01.chatBot", "robot.chatBot"):
            if method == "getResponse" and args:
                text = " ".join(args)
                return {"ok": True, "data": f"(InMoove) I heard: {text}. Use Chat page for full AI."}
            return {"ok": True, "data": None}

        # servo methods
        servo = self._resolve_servo(service)
        if servo:
            return self._servo_call(servo, method, args)

        return {"ok": False, "error": f"Unknown service: {service}", "status": 404}

    def _servo_call(self, servo: VirtualServo, method: str, args: List[str]) -> dict:
        if method in ("getPin", "getMin", "getMax", "getRest", "getSpeed", "getPosition", "isAttached", "isSweeping"):
            state = self.servo_state(servo.service)
            return {"ok": True, "data": state.get(method)}

        if method == "moveTo" and args:
            angle = servo.clamp(int(float(args[0])))
            servo.position = angle
            sent = self._send_key_angle(servo.key, angle)
            return {"ok": True, "data": angle, "serial_sent": sent}

        if method == "rest":
            servo.position = servo.rest
            sent = self._send_key_angle(servo.key, servo.rest)
            return {"ok": True, "data": servo.rest, "serial_sent": sent}

        if method == "setPin" and args:
            servo.pin = int(args[0])
            return {"ok": True, "data": servo.pin}

        if method == "setSpeed" and args:
            servo.speed = float(args[0])
            return {"ok": True, "data": servo.speed}

        if method == "setMinMax" and len(args) >= 2:
            servo.min = int(float(args[0]))
            servo.max = int(float(args[1]))
            return {"ok": True, "data": [servo.min, servo.max]}

        if method == "setInverted" and args:
            servo.inverted = str(args[0]).lower() in ("1", "true", "yes")
            return {"ok": True, "data": servo.inverted}

        if method == "attach":
            servo.attached = True
            return {"ok": True, "data": True}
        if method == "detach":
            servo.attached = False
            return {"ok": True, "data": True}
        if method == "enable":
            servo.enabled = True
            return {"ok": True, "data": True}
        if method == "disable":
            servo.enabled = False
            return {"ok": True, "data": True}
        if method == "sweep":
            servo.sweeping = True
            return {"ok": True, "data": True}
        if method == "stop":
            servo.sweeping = False
            self._gesture_stop.set()
            self.send_serial("S\n")
            return {"ok": True, "data": True}

        return {"ok": True, "data": None}

    def _opencv_call(self, method: str, args: List[str]) -> dict:
        if method == "isCapturing":
            return {"ok": True, "data": self.opencv_capturing}
        if method == "getFilters":
            return {"ok": True, "data": self.opencv_filters}
        if method == "getDisplayFilter":
            return {"ok": True, "data": self.opencv_display_filter}
        if method == "setCameraIndex" and args:
            self.opencv_camera_index = int(args[0])
            return {"ok": True, "data": self.opencv_camera_index}
        if method == "capture":
            self.opencv_capturing = True
            self.peers.setdefault("opencv", {})["started"] = True
            return {"ok": True, "data": True}
        if method == "stopCapture":
            self.opencv_capturing = False
            return {"ok": True, "data": True}
        if method == "setWebViewer":
            return {"ok": True, "data": True}
        if method == "setDisplayFilter" and args:
            self.opencv_display_filter = args[0]
            return {"ok": True, "data": self.opencv_display_filter}
        return {"ok": True, "data": None}

    # ── speech ─────────────────────────────────────────────────

    def speak(self, text: str) -> dict:
        text = (text or "").strip()
        if not text:
            return {"ok": False, "error": "text required"}
        # jaw wiggle
        try:
            jaw = self._resolve_servo("i01.head.jaw")
            rest = jaw.rest if jaw else 8
            open_a = min(40, rest + 20)
            for _ in range(max(1, min(6, len(text) // 8))):
                self.send_serial(f"H,85,90,{open_a}\n")
                time.sleep(0.12)
                self.send_serial(f"H,85,90,{rest}\n")
                time.sleep(0.1)
        except Exception as e:
            logger.debug("jaw wiggle: %s", e)

        spoken = False
        try:
            import pyttsx3

            engine = pyttsx3.init()
            engine.say(text)
            engine.runAndWait()
            spoken = True
        except Exception as e:
            logger.info("pyttsx3 unavailable or failed: %s", e)

        return {"ok": True, "text": text, "spoken": spoken, "error": None if spoken else "TTS engine unavailable; text accepted"}

    # ── safe script DSL ────────────────────────────────────────

    def exec_script(self, script: str) -> dict:
        script = (script or "").strip()
        if not script:
            return {"ok": False, "error": "script required", "script": script}

        # Normalize common patterns
        results = []
        try:
            # multi-line: split statements
            lines = [ln.strip() for ln in script.replace(";", "\n").splitlines() if ln.strip() and not ln.strip().startswith("#")]
            for line in lines:
                r = self._exec_line(line)
                results.append(r)
                if not r.get("ok"):
                    return {"ok": False, "script": script, "result": results, "error": r.get("error")}
            self.last_script_result = results
            return {"ok": True, "script": script, "result": results}
        except Exception as e:
            logger.exception("script error")
            return {"ok": False, "script": script, "error": str(e)}

    def _exec_line(self, line: str) -> dict:
        # sleep(n)
        m = re.match(r"sleep\s*\(\s*([0-9.]+)\s*\)", line)
        if m:
            time.sleep(min(10.0, float(m.group(1))))
            return {"ok": True, "op": "sleep", "value": float(m.group(1))}

        # speak("...")
        m = re.match(r'(?:robot\.|i01\.)?speak(?:Blocking)?\s*\(\s*[\'"](.+?)[\'"]\s*\)', line)
        if m:
            return self.speak(m.group(1))

        # robot.hello() / i01.relax()
        m = re.match(r"(?:robot|i01)\.([A-Za-z_][\w]*)\s*\(\s*\)", line)
        if m:
            name = m.group(1)
            if name in ("loadGestures", "finishedGesture"):
                return {"ok": True, "op": name}
            return self.exec_gesture(name)

        # robot.head.neck.moveTo(90) / i01.head.jaw.moveTo(10)
        m = re.match(
            r"((?:robot|i01)(?:\.[A-Za-z_][\w]*)+)\.([A-Za-z_][\w]*)\s*\(\s*([^)]*)\s*\)",
            line,
        )
        if m:
            service, method, argstr = m.group(1), m.group(2), m.group(3).strip()
            args = []
            if argstr:
                for part in argstr.split(","):
                    part = part.strip().strip("'\"")
                    if part:
                        args.append(part)
            return self.call(service, method, args)

        # bare gesture name()
        m = re.match(r"([A-Za-z_][\w]*)\s*\(\s*\)", line)
        if m and self._find_gesture(m.group(1)):
            return self.exec_gesture(m.group(1))

        return {"ok": False, "error": f"Unsupported or unsafe script line: {line}"}

    # ── assets ─────────────────────────────────────────────────

    def resolve_asset(self, filename: str) -> Optional[Path]:
        """Resolve asset path under inmoove_core/assets with friendly aliases."""
        rel = filename.replace("\\", "/").lstrip("/")
        # strip common MRL WebGui prefixes
        for prefix in ("img/InMoov2/", "service/img/", "img/", "resource/"):
            if rel.startswith(prefix):
                rel = rel[len(prefix) :]
                break

        candidates = [
            ASSETS_DIR / rel,
            ASSETS_DIR / "body" / Path(rel).name,
            ASSETS_DIR / "icons" / Path(rel).name,
            ASSETS_DIR / "expressions" / Path(rel).name,
            ASSETS_DIR / "sounds" / Path(rel).name,
        ]
        # If path is just Brain.png etc.
        name = Path(rel).name
        candidates.extend(
            [
                ASSETS_DIR / "icons" / name,
                ASSETS_DIR / "body" / name,
                ASSETS_DIR / "expressions" / name,
            ]
        )
        for c in candidates:
            if c.is_file():
                return c
        return None


_core: Optional[InMooveCore] = None


def get_core(
    project_root: Optional[str | Path] = None,
    send_serial: Optional[Callable[[str], bool]] = None,
    get_servo_config: Optional[Callable[[], Optional[dict]]] = None,
) -> InMooveCore:
    global _core
    if _core is None:
        root = project_root or Path(__file__).resolve().parents[1]
        _core = InMooveCore(root, send_serial=send_serial, get_servo_config=get_servo_config)
    else:
        # Refresh host bridges when Flask (re)binds serial / config loaders
        if send_serial is not None:
            _core.send_serial = send_serial
        if get_servo_config is not None:
            _core.get_servo_config = get_servo_config
            _core._rebuild_servos()
    return _core


def reset_core():
    global _core
    _core = None
