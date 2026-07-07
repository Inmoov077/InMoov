"""Extract InMoov gestures, voice commands, and joint config from local MyRobotLab 1.1.1610."""
from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
MRL = ROOT / "myrobotlab-1.1.1610" / "resource" / "InMoov2"
PROGRAM_AB = ROOT / "myrobotlab-1.1.1610" / "resource" / "ProgramAB"
CONFIG_YAML = ROOT / "vendor" / "inmoov_ros" / "inmoov_bringup" / "config" / "config.yaml"

OUT_GESTURES = ROOT / "shared" / "mrl_gestures.json"
OUT_PRESETS_TS = ROOT / "frontend" / "src" / "lib" / "mrlPresets.ts"
OUT_OFFLINE = ROOT / "shared" / "offline_commands.json"
OUT_JOINT_MAP = ROOT / "frontend" / "src" / "lib" / "inmoovJointMap.ts"
OUT_SERVO_CONFIG = ROOT / "shared" / "servo_config.json"
OUT_SERVO_CONFIG_TS = ROOT / "frontend" / "src" / "lib" / "servoConfig.ts"
OUT_SERVO_CONFIG_H = ROOT / "servo_config.h"
OUT_WAVE_PATTERNS = ROOT / "shared" / "wave_patterns.json"
OUT_PIN_OVERRIDES = ROOT / "shared" / "pin_overrides.json"
OUT_CALIB_OVERRIDES = ROOT / "shared" / "calibration_overrides.json"
VDB_SERVER = ROOT / "VDB (1)" / "VDB" / "server.py"

# Our dashboard rest pose (hardware-calibrated)
REST = {
    "hneck": 85,
    "eye": 90,
    "jaw": 8,
    "rot": 60,
    "tilt": 50,
    "roll": 120,
}

GESTURE_ICON = {
    "head": "◎",
    "arm": "💪",
    "hand": "✋",
    "full": "🤖",
    "social": "👋",
}

SKIP_GESTURES = {
    "test1",
    "testSensor",
    "printList",
    "datestring",
    "disable",
    "email",
    "darknet",
    "facerecognizer",
    "memorisePerson",
    "whoisthis",
    "batterylevel",
    "offkinect",
    "close_image",
    "CloseImage",
    "DisplayPic",
    "display",
    "captureGesture1",
    "captureGesture2",
    "startcopygestures",
    "EyelidMovements",
    "CheekMovements",
    "stopTrackHumans",
    "stopTrackingPoint",
    "stoprockpaperscissors",
    "stopit",
    "stopingGesture",
    "power_down",
    "shutdown",
    "healthCheckSequence",
}

MOVE_HEAD = re.compile(
    r"i01(?:_head)?\.moveHead(?:Blocking)?\s*\(\s*([^)]+)\)",
    re.IGNORECASE,
)
MOVE_ARM = re.compile(r'i01\.moveArm\s*\(\s*"(\w+)"\s*,\s*([^)]+)\)', re.IGNORECASE)
MOVE_HAND = re.compile(r'i01\.moveHand\s*\(\s*"(\w+)"\s*,\s*([^)]+)\)', re.IGNORECASE)
MOVE_TORSO = re.compile(r"i01\.moveTorso\s*\(\s*([^)]+)\)", re.IGNORECASE)
NECK_MOVE = re.compile(r"i01_head_neck\.moveToBlocking\s*\(\s*([^)]+)\)", re.IGNORECASE)
ROTHEAD_MOVE = re.compile(r"i01_head_rothead\.moveToBlocking\s*\(\s*([^)]+)\)", re.IGNORECASE)
SLEEP = re.compile(r"sleep\s*\(\s*([^)]+)\s*\)", re.IGNORECASE)
FUNC_DEF = re.compile(r"^def\s+(\w+)\s*\(", re.MULTILINE)

AIML_PATTERN = re.compile(r"<pattern>([^<]+)</pattern>", re.IGNORECASE)
AIML_TEMPLATE_TEXT = re.compile(r"<template>([\s\S]*?)</template>", re.IGNORECASE)
AIML_EXEC = re.compile(
    r"<param>([a-zA-Z_][\w]*(?:\([^)]*\))?)</param>",
    re.IGNORECASE,
)
AIML_RANDOM_LI = re.compile(r"<li>([^<]+)</li>", re.IGNORECASE)


def clamp(v: float, lo: float = 0, hi: float = 180) -> int:
    return int(max(lo, min(hi, round(v))))


def mrl_head_roll_to_ours(mrl_roll: float) -> int:
    """MRL head roll 0–180 (rest 90) → our roll servo (rest 120)."""
    if mrl_roll <= 90:
        return clamp(120 + (90 - mrl_roll) * 50 / 90)
    return clamp(120 - (mrl_roll - 90) * 50 / 90)


def mrl_torso_to_ours(a: float, b: float, c: float) -> tuple[int, int, int]:
    """MRL moveTorso (rest 90,90,90) → our neck servos (rest 60,50,120)."""
    return clamp(a - 30), clamp(b - 40), clamp(c + 30)


def parse_nums(raw: str) -> list[float]:
    nums: list[float] = []
    for part in raw.split(","):
        part = part.strip()
        if not part:
            continue
        if "=" in part:
            part = part.split("=", 1)[1].strip()
        try:
            nums.append(float(part))
        except ValueError:
            continue
    return nums


def new_keyframe(hold: int = 500) -> dict:
    return {**REST, "hold": hold}


def apply_head(kf: dict, nums: list[float]) -> None:
    if not nums:
        return
    kf["hneck"] = clamp(nums[0])
    if len(nums) >= 2:
        kf["eye"] = clamp(nums[1])
    if len(nums) >= 3:
        kf["roll"] = mrl_head_roll_to_ours(nums[2])


def apply_arm(kf: dict, side: str, nums: list[float]) -> None:
    if len(nums) < 4:
        return
    arm = {
        "shoulder": clamp(nums[0]),
        "lift": clamp(nums[1]),
        "rotate": 90,
        "elbow": clamp(nums[2]),
        "wrist": clamp(nums[3]),
    }
    if side == "left":
        kf["leftArm"] = arm
    else:
        kf["rightArm"] = arm


def apply_hand(kf: dict, side: str, nums: list[float]) -> None:
    if len(nums) < 5:
        return
    hand = {
        "thumb": clamp(nums[0]),
        "index": clamp(nums[1]),
        "middle": clamp(nums[2]),
        "ring": clamp(nums[3]),
        "pinky": clamp(nums[4]),
    }
    if side == "left":
        kf["leftHand"] = hand
        if len(nums) >= 6:
            la = kf.get("leftArm") or {
                "shoulder": 90,
                "lift": 45,
                "rotate": 90,
                "elbow": 90,
                "wrist": 90,
            }
            la["wrist"] = clamp(nums[5])
            kf["leftArm"] = la
    else:
        kf["rightHand"] = hand
        if len(nums) >= 6:
            ra = kf.get("rightArm") or {
                "shoulder": 90,
                "lift": 45,
                "rotate": 90,
                "elbow": 90,
                "wrist": 90,
            }
            ra["wrist"] = clamp(nums[5])
            kf["rightArm"] = ra


def apply_torso(kf: dict, nums: list[float]) -> None:
    if len(nums) < 3:
        return
    rot, tilt, roll = mrl_torso_to_ours(nums[0], nums[1], nums[2])
    kf["rot"] = rot
    kf["tilt"] = tilt
    kf["roll"] = roll


def parse_gesture_file(path: Path) -> tuple[str, list[dict]] | None:
    text = path.read_text(encoding="utf-8", errors="replace")
    match = FUNC_DEF.search(text)
    if not match:
        return None
    name = match.group(1)
    if name in SKIP_GESTURES:
        return None

    lines = text.splitlines()
    keyframes: list[dict] = []
    current = new_keyframe(400)
    pending_hold = 400

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("#") or not stripped:
            continue

        sleep_m = SLEEP.search(stripped)
        if sleep_m:
            try:
                pending_hold = max(200, int(float(sleep_m.group(1)) * 1000))
            except ValueError:
                pending_hold = 500
            continue

        changed = False

        for m in MOVE_HEAD.finditer(stripped):
            apply_head(current, parse_nums(m.group(1)))
            changed = True

        for m in MOVE_ARM.finditer(stripped):
            apply_arm(current, m.group(1).lower(), parse_nums(m.group(2)))
            changed = True

        for m in MOVE_HAND.finditer(stripped):
            apply_hand(current, m.group(1).lower(), parse_nums(m.group(2)))
            changed = True

        for m in MOVE_TORSO.finditer(stripped):
            apply_torso(current, parse_nums(m.group(1)))
            changed = True

        for m in NECK_MOVE.finditer(stripped):
            nums = parse_nums(m.group(1))
            if nums:
                current["tilt"] = clamp(nums[0])
                changed = True

        for m in ROTHEAD_MOVE.finditer(stripped):
            nums = parse_nums(m.group(1))
            if nums:
                current["hneck"] = clamp(nums[0])
                changed = True

        if changed:
            current["hold"] = pending_hold
            keyframes.append(_clean_kf(current))
            current = new_keyframe(400)
            pending_hold = 400

    if not keyframes:
        return None
    if len(keyframes) > 24:
        keyframes = keyframes[:24]
    return name, keyframes


def _clean_kf(kf: dict) -> dict:
    out: dict = {
        "hneck": kf["hneck"],
        "eye": kf["eye"],
        "jaw": kf["jaw"],
        "rot": kf["rot"],
        "tilt": kf["tilt"],
        "roll": kf["roll"],
        "hold": kf["hold"],
    }
    for side in ("leftArm", "rightArm", "leftHand", "rightHand"):
        if side in kf:
            out[side] = kf[side]
    return out


def classify_gesture(name: str, kfs: list[dict]) -> str:
    has_arm = any("leftArm" in k or "rightArm" in k for k in kfs)
    has_hand = any("leftHand" in k or "rightHand" in k for k in kfs)
    if has_arm and has_hand:
        return "full"
    if has_arm:
        return "arm"
    if has_hand:
        return "hand"
    if name.lower() in {"shakehand", "giving", "comehere", "presentation"}:
        return "social"
    return "head"


def humanize(name: str) -> str:
    spaced = re.sub(r"([a-z])([A-Z])", r"\1 \2", name)
    spaced = spaced.replace("_", " ")
    return spaced.strip().title()


def extract_gestures() -> dict:
    gesture_dirs = [
        MRL / "gestures",
        MRL / "minimal",
    ]
    all_gestures: dict[str, dict] = {}

    for gdir in gesture_dirs:
        if not gdir.is_dir():
            continue
        for path in sorted(gdir.glob("*.py")):
            parsed = parse_gesture_file(path)
            if not parsed:
                continue
            name, keyframes = parsed
            if len(keyframes) < 1:
                continue
            cat = classify_gesture(name, keyframes)
            preset_id = f"mrl-{name}"
            all_gestures[preset_id] = {
                "id": preset_id,
                "mrlName": name,
                "name": humanize(name),
                "category": cat,
                "icon": GESTURE_ICON.get(cat, "✦"),
                "source": str(path.relative_to(ROOT)).replace("\\", "/"),
                "keyframes": keyframes,
            }

    return all_gestures


def extract_aiml_commands(gestures: dict) -> list[dict]:
    """Parse InMoov gesture AIML → offline voice commands linked to MRL presets."""
    gesture_by_mrl = {g["mrlName"]: g["id"] for g in gestures.values()}
    commands: list[dict] = []
    seen_patterns: set[str] = set()

    # English gesture AIML only — other locales duplicate the same patterns
    aiml_files = list((PROGRAM_AB / "en-US" / "aiml").glob("_inmoovGestures.aiml"))
    if not aiml_files:
        aiml_files = list(PROGRAM_AB.rglob("_inmoovGestures.aiml"))

    for aiml_path in aiml_files:
        try:
            content = aiml_path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue

        for cat_block in re.findall(r"<category>([\s\S]*?)</category>", content, re.IGNORECASE):
            pat_m = AIML_PATTERN.search(cat_block)
            if not pat_m:
                continue
            pattern = pat_m.group(1).strip().upper()
            if pattern in seen_patterns or len(pattern) < 3:
                continue
            # Skip wildcards and system tokens
            if "<" in pattern or "*" in pattern or pattern.startswith("SYSTEM"):
                continue

            tmpl_m = AIML_TEMPLATE_TEXT.search(cat_block)
            if not tmpl_m:
                continue
            tmpl = tmpl_m.group(1)

            exec_m = AIML_EXEC.search(tmpl)
            if not exec_m:
                continue

            param = exec_m.group(1).strip()
            func = param.split("(")[0]
            animation = None
            if func in gesture_by_mrl:
                animation = gesture_by_mrl[func]
            elif func in {"Yes", "No", "rest", "relax"}:
                animation = f"mrl-{func}"
            else:
                continue  # only import voice triggers that run a known gesture

            responses = AIML_RANDOM_LI.findall(tmpl)
            if not responses:
                plain = re.sub(r"<[^>]+>", "", tmpl).strip()
                if plain:
                    responses = [plain]

            if not responses:
                continue

            phrase = pattern.lower().replace("_", " ")
            inputs = [phrase]

            commands.append(
                {
                    "inputs": inputs,
                    "response": responses[0].strip()[:200],
                    "angles": {
                        "hneck": REST["hneck"],
                        "eye": REST["eye"],
                        "neckRot": REST["rot"],
                        "neckTilt": REST["tilt"],
                        "neckRoll": REST["roll"],
                    },
                    "animation": animation,
                }
            )
            seen_patterns.add(pattern)

    return commands


# VDB hardware-tested calibration (VDB (1)/VDB/server.py SERVO_LIMITS).
# Mapped: omoplate→lift, bicep→elbow. Pins kept as Mega direct-map defaults.
VDB_CALIBRATION: dict[str, dict] = {
    "l_shoulder": {"min": 0, "max": 150, "rest": 30, "motor": "DS5160", "vdb_pin": 22},
    "l_lift": {"min": 10, "max": 70, "rest": 10, "motor": "DS5160", "vdb_key": "l_omoplate", "vdb_pin": 24},
    "l_elbow": {"min": 0, "max": 85, "rest": 5, "motor": "DS5160", "vdb_key": "l_bicep", "vdb_pin": 26},
    "l_rotate": {"min": 40, "max": 150, "rest": 90, "motor": "DS5160", "vdb_pin": 28},
    "l_wrist": {"min": 10, "max": 160, "rest": 90, "motor": "MG996R", "vdb_pin": 11},
    "r_shoulder": {"min": 0, "max": 150, "rest": 30, "motor": "DS5160", "vdb_pin": 23},
    "r_lift": {"min": 10, "max": 70, "rest": 10, "motor": "DS5160", "vdb_key": "r_omoplate", "vdb_pin": 25},
    "r_elbow": {"min": 0, "max": 85, "rest": 5, "motor": "DS5160", "vdb_key": "r_bicep", "vdb_pin": 27},
    "r_rotate": {"min": 40, "max": 150, "rest": 90, "motor": "DS5160", "vdb_pin": 29},
    "r_wrist": {"min": 10, "max": 160, "rest": 90, "motor": "MG996R", "vdb_pin": 5},
    "l_thumb": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "l_index": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "l_middle": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "l_ring": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "l_pinky": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "r_thumb": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "r_index": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "r_middle": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "r_ring": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
    "r_pinky": {"min": 10, "max": 130, "rest": 10, "motor": "MG996R"},
}

# VDB flag-wave patterns → dashboard keyframes (5-DOF arm mapping).
WAVE_PATTERNS: list[dict] = [
    {"id": "gentle", "name": "Gentle Wave", "icon": "🌊", "hands": "right", "speed": 50, "amplitude": 50,
     "setup": {"rightArm": {"shoulder": 80, "lift": 30, "rotate": 90, "elbow": 60, "wrist": 90},
               "rightHand": {"thumb": 110, "index": 110, "middle": 110, "ring": 110, "pinky": 110}}},
    {"id": "vigorous", "name": "Vigorous Wave", "icon": "💪", "hands": "right", "speed": 70, "amplitude": 80,
     "setup": {"rightArm": {"shoulder": 80, "lift": 30, "rotate": 90, "elbow": 60, "wrist": 90},
               "rightHand": {"thumb": 110, "index": 110, "middle": 110, "ring": 110, "pinky": 110}}},
    {"id": "greeting", "name": "Greeting", "icon": "👋", "hands": "right", "speed": 50, "amplitude": 60,
     "setup": {"rightArm": {"shoulder": 100, "lift": 35, "rotate": 90, "elbow": 40, "wrist": 90},
               "rightHand": {"thumb": 10, "index": 10, "middle": 10, "ring": 10, "pinky": 10}}},
    {"id": "salute", "name": "Salute", "icon": "🫡", "hands": "right", "speed": 40, "amplitude": 50,
     "keyframes": [
         {"rightArm": {"shoulder": 140, "lift": 10, "rotate": 90, "elbow": 80, "wrist": 90},
          "rightHand": {"thumb": 130, "index": 130, "middle": 130, "ring": 130, "pinky": 130}, "hold": 2000},
         {"rightArm": {"shoulder": 30, "lift": 10, "rotate": 90, "elbow": 5, "wrist": 90},
          "rightHand": {"thumb": 10, "index": 10, "middle": 10, "ring": 10, "pinky": 10}, "hold": 1000},
     ]},
    {"id": "pride", "name": "Pride Flag", "icon": "🇮🇳", "hands": "right", "speed": 45, "amplitude": 55,
     "setup": {"rightArm": {"shoulder": 80, "lift": 30, "rotate": 90, "elbow": 60, "wrist": 90},
               "rightHand": {"thumb": 110, "index": 110, "middle": 110, "ring": 110, "pinky": 110}}},
    {"id": "celebrate", "name": "Celebrate", "icon": "🎉", "hands": "both", "speed": 60, "amplitude": 70,
     "setup": {"rightArm": {"shoulder": 90, "lift": 25, "rotate": 90, "elbow": 50, "wrist": 90},
               "leftArm": {"shoulder": 90, "lift": 25, "rotate": 90, "elbow": 50, "wrist": 90},
               "rightHand": {"thumb": 110, "index": 110, "middle": 110, "ring": 110, "pinky": 110},
               "leftHand": {"thumb": 130, "index": 130, "middle": 130, "ring": 130, "pinky": 130}}},
    {"id": "drstrange", "name": "Dr. Strange", "icon": "🔮", "hands": "both", "speed": 40, "amplitude": 50,
     "setup": {"rightArm": {"shoulder": 80, "lift": 40, "rotate": 90, "elbow": 50, "wrist": 90},
               "leftArm": {"shoulder": 80, "lift": 40, "rotate": 90, "elbow": 50, "wrist": 90},
               "rightHand": {"thumb": 10, "index": 10, "middle": 10, "ring": 10, "pinky": 10},
               "leftHand": {"thumb": 10, "index": 10, "middle": 10, "ring": 10, "pinky": 10}}},
    {"id": "gunshoot", "name": "Gun Shoot", "icon": "🔫", "hands": "both", "speed": 35, "amplitude": 40,
     "setup": {"rightArm": {"shoulder": 70, "lift": 45, "rotate": 90, "elbow": 30, "wrist": 90},
               "leftArm": {"shoulder": 70, "lift": 45, "rotate": 90, "elbow": 30, "wrist": 90},
               "rightHand": {"thumb": 10, "index": 10, "middle": 10, "ring": 130, "pinky": 130},
               "leftHand": {"thumb": 10, "index": 10, "middle": 10, "ring": 130, "pinky": 130}}},
]

BODY_PART_GROUPS = {
    "head": {"label": "Head", "bit": 1, "servoKeys": ["head_neck", "head_eye", "head_jaw"]},
    "neck": {"label": "Neck", "bit": 2, "servoKeys": ["neck_rot", "neck_tilt", "neck_roll"]},
    "leftArm": {"label": "Left Arm", "bit": 4, "servoKeys": ["l_shoulder", "l_lift", "l_rotate", "l_elbow", "l_wrist"]},
    "rightArm": {"label": "Right Arm", "bit": 8, "servoKeys": ["r_shoulder", "r_lift", "r_rotate", "r_elbow", "r_wrist"]},
    "leftHand": {"label": "Left Hand", "bit": 16, "servoKeys": ["l_thumb", "l_index", "l_middle", "l_ring", "l_pinky"]},
    "rightHand": {"label": "Right Hand", "bit": 32, "servoKeys": ["r_thumb", "r_index", "r_middle", "r_ring", "r_pinky"]},
    "leftLeg": {"label": "Left Leg", "bit": 64, "servoKeys": ["l_hip", "l_thigh", "l_knee", "l_ankle", "l_foot"]},
    "rightLeg": {"label": "Right Leg", "bit": 128, "servoKeys": ["r_hip", "r_thigh", "r_knee", "r_ankle", "r_foot"]},
}

# Canonical 36-servo Mega pinout — single source for firmware + dashboard.
# Limits/rest: MRL defaults merged with VDB hardware-tested values for arms/hands.
SERVO_DEFINITIONS: list[dict] = [
    {"id": 0, "key": "head_neck", "group": "head", "label": "Head neck", "pin": 3, "min": 0, "max": 180, "rest": 85, "ease": 0.08},
    {"id": 1, "key": "head_eye", "group": "head", "label": "Eye", "pin": 4, "min": 60, "max": 120, "rest": 90, "ease": 0.07},
    {"id": 2, "key": "head_jaw", "group": "head", "label": "Jaw", "pin": 5, "min": 0, "max": 40, "rest": 8, "ease": 0.22},
    {"id": 3, "key": "neck_rot", "group": "neck", "label": "Neck rotation", "pin": 6, "min": 0, "max": 180, "rest": 60, "ease": 0.06},
    {"id": 4, "key": "neck_tilt", "group": "neck", "label": "Neck tilt", "pin": 7, "min": 0, "max": 180, "rest": 50, "ease": 0.05},
    {"id": 5, "key": "neck_roll", "group": "neck", "label": "Neck roll", "pin": 8, "min": 60, "max": 130, "rest": 120, "ease": 0.07},
    {"id": 6, "key": "l_shoulder", "group": "leftArm", "label": "L shoulder", "pin": 9, "min": 0, "max": 180, "rest": 90, "ease": 0.08},
    {"id": 7, "key": "l_lift", "group": "leftArm", "label": "L lift", "pin": 10, "min": 0, "max": 180, "rest": 45, "ease": 0.07},
    {"id": 8, "key": "l_rotate", "group": "leftArm", "label": "L rotate", "pin": 11, "min": 40, "max": 180, "rest": 90, "ease": 0.08},
    {"id": 9, "key": "l_elbow", "group": "leftArm", "label": "L elbow", "pin": 12, "min": 0, "max": 90, "rest": 90, "ease": 0.08},
    {"id": 10, "key": "l_wrist", "group": "leftArm", "label": "L wrist", "pin": 13, "min": 0, "max": 180, "rest": 90, "ease": 0.07},
    {"id": 11, "key": "r_shoulder", "group": "rightArm", "label": "R shoulder", "pin": 14, "min": 0, "max": 180, "rest": 90, "ease": 0.08},
    {"id": 12, "key": "r_lift", "group": "rightArm", "label": "R lift", "pin": 15, "min": 0, "max": 180, "rest": 45, "ease": 0.07},
    {"id": 13, "key": "r_rotate", "group": "rightArm", "label": "R rotate", "pin": 16, "min": 40, "max": 180, "rest": 90, "ease": 0.08},
    {"id": 14, "key": "r_elbow", "group": "rightArm", "label": "R elbow", "pin": 17, "min": 0, "max": 90, "rest": 90, "ease": 0.08},
    {"id": 15, "key": "r_wrist", "group": "rightArm", "label": "R wrist", "pin": 18, "min": 0, "max": 180, "rest": 90, "ease": 0.07},
    {"id": 16, "key": "l_thumb", "group": "leftHand", "label": "L thumb", "pin": 19, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 17, "key": "l_index", "group": "leftHand", "label": "L index", "pin": 20, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 18, "key": "l_middle", "group": "leftHand", "label": "L middle", "pin": 21, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 19, "key": "l_ring", "group": "leftHand", "label": "L ring", "pin": 22, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 20, "key": "l_pinky", "group": "leftHand", "label": "L pinky", "pin": 23, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 21, "key": "r_thumb", "group": "rightHand", "label": "R thumb", "pin": 24, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 22, "key": "r_index", "group": "rightHand", "label": "R index", "pin": 25, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 23, "key": "r_middle", "group": "rightHand", "label": "R middle", "pin": 26, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 24, "key": "r_ring", "group": "rightHand", "label": "R ring", "pin": 27, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 25, "key": "r_pinky", "group": "rightHand", "label": "R pinky", "pin": 28, "min": 0, "max": 180, "rest": 10, "ease": 0.15},
    {"id": 26, "key": "l_hip", "group": "leftLeg", "label": "L hip", "pin": 29, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
    {"id": 27, "key": "l_thigh", "group": "leftLeg", "label": "L thigh", "pin": 30, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
    {"id": 28, "key": "l_knee", "group": "leftLeg", "label": "L knee", "pin": 31, "min": 0, "max": 160, "rest": 10, "ease": 0.05},
    {"id": 29, "key": "l_ankle", "group": "leftLeg", "label": "L ankle", "pin": 32, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
    {"id": 30, "key": "l_foot", "group": "leftLeg", "label": "L foot", "pin": 33, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
    {"id": 31, "key": "r_hip", "group": "rightLeg", "label": "R hip", "pin": 34, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
    {"id": 32, "key": "r_thigh", "group": "rightLeg", "label": "R thigh", "pin": 35, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
    {"id": 33, "key": "r_knee", "group": "rightLeg", "label": "R knee", "pin": 36, "min": 0, "max": 160, "rest": 10, "ease": 0.05},
    {"id": 34, "key": "r_ankle", "group": "rightLeg", "label": "R ankle", "pin": 37, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
    {"id": 35, "key": "r_foot", "group": "rightLeg", "label": "R foot", "pin": 38, "min": 0, "max": 180, "rest": 90, "ease": 0.06},
]

# Built-in head/neck patterns stored in firmware (subset of dashboard builtins).
FIRMWARE_PATTERNS: dict[str, list[dict]] = {
    "nod": [
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 80, "roll": 120, "hold": 600},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 20, "roll": 120, "hold": 600},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 50, "roll": 120, "hold": 400},
    ],
    "shake": [
        {"hneck": 85, "eye": 60, "jaw": 8, "rot": 10, "tilt": 50, "roll": 170, "hold": 600},
        {"hneck": 85, "eye": 120, "jaw": 8, "rot": 110, "tilt": 50, "roll": 70, "hold": 600},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 50, "roll": 120, "hold": 400},
    ],
    "yes": [
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 35, "roll": 120, "hold": 400},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 70, "roll": 120, "hold": 400},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 35, "roll": 120, "hold": 400},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 50, "roll": 120, "hold": 300},
    ],
    "no": [
        {"hneck": 85, "eye": 60, "jaw": 8, "rot": 25, "tilt": 50, "roll": 150, "hold": 400},
        {"hneck": 85, "eye": 120, "jaw": 8, "rot": 95, "tilt": 50, "roll": 90, "hold": 400},
        {"hneck": 85, "eye": 60, "jaw": 8, "rot": 25, "tilt": 50, "roll": 150, "hold": 400},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 50, "roll": 120, "hold": 300},
    ],
    "bow": [
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 50, "roll": 120, "hold": 500},
        {"hneck": 85, "eye": 90, "jaw": 10, "rot": 60, "tilt": 15, "roll": 120, "hold": 1200},
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 50, "roll": 120, "hold": 500},
    ],
    "relax": [
        {"hneck": 85, "eye": 90, "jaw": 8, "rot": 60, "tilt": 50, "roll": 120, "hold": 300},
    ],
}


def _ease_to_byte(ease: float) -> int:
    return max(1, min(255, int(round(ease * 255))))


def _merge_vdb_calibration(servos: list[dict]) -> list[dict]:
    merged = []
    for s in servos:
        entry = dict(s)
        vdb = VDB_CALIBRATION.get(s["key"])
        if vdb:
            entry["min"] = vdb["min"]
            entry["max"] = vdb["max"]
            entry["rest"] = vdb["rest"]
            if "motor" in vdb:
                entry["motor"] = vdb["motor"]
            if "vdb_pin" in vdb:
                entry["vdbPin"] = vdb["vdb_pin"]
            if "vdb_key" in vdb:
                entry["vdbKey"] = vdb["vdb_key"]
            entry["calibrationSource"] = "vdb+mrl"
        else:
            entry["calibrationSource"] = "mrl"
        merged.append(entry)
    return merged


def _ensure_override_files() -> None:
    for path, default in (
        (OUT_PIN_OVERRIDES, {}),
        (OUT_CALIB_OVERRIDES, {}),
    ):
        if not path.exists():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(default, indent=2), encoding="utf-8")


def generate_servo_config(gestures: dict) -> None:
    """Emit shared/servo_config.json, frontend TS, and Arduino header from one map."""
    _ensure_override_files()
    servos = _merge_vdb_calibration(SERVO_DEFINITIONS)

    pin_overrides: dict = {}
    calib_overrides: dict = {}
    if OUT_PIN_OVERRIDES.exists():
        pin_overrides = json.loads(OUT_PIN_OVERRIDES.read_text(encoding="utf-8"))
    if OUT_CALIB_OVERRIDES.exists():
        calib_overrides = json.loads(OUT_CALIB_OVERRIDES.read_text(encoding="utf-8"))

    for s in servos:
        key = s["key"]
        if key in pin_overrides:
            s["pin"] = int(pin_overrides[key])
            s["pinOverride"] = True
        if key in calib_overrides:
            for field in ("min", "max", "rest"):
                if field in calib_overrides[key]:
                    s[field] = int(calib_overrides[key][field])
            s["calibrationSource"] = "user"

    config = {
        "version": "1.1.1610",
        "source": "myrobotlab-1.1.1610/resource/InMoov2 + VDB (1)/VDB",
        "firmware": "full_body_servo_control.ino",
        "baud": 9600,
        "servoCount": len(servos),
        "servos": servos,
        "patterns": FIRMWARE_PATTERNS,
        "wavePatterns": WAVE_PATTERNS,
        "bodyPartGroups": BODY_PART_GROUPS,
        "mrlGestureCount": len(gestures),
        "hardwareProfiles": {
            "mega_direct": {"description": "Default — all servos on Mega pins 3-38"},
            "vdb_upper_body": {"description": "VDB rig — DS5160 arms + PCA9685 hands", "note": "Use pin overrides to match VDB wiring"},
        },
    }
    OUT_WAVE_PATTERNS.write_text(json.dumps(WAVE_PATTERNS, indent=2), encoding="utf-8")
    print(f"wrote {OUT_WAVE_PATTERNS}")
    OUT_SERVO_CONFIG.parent.mkdir(parents=True, exist_ok=True)
    OUT_SERVO_CONFIG.write_text(json.dumps(config, indent=2), encoding="utf-8")
    print(f"wrote {OUT_SERVO_CONFIG}")

    ts_lines = [
        "/**",
        " * Canonical servo map — auto-generated by scripts/extract_mrl_inmoov.py.",
        " * Regenerate: python scripts/extract_mrl_inmoov.py",
        " */",
        "",
        "export interface ServoDef {",
        "  id: number;",
        "  key: string;",
        "  group: string;",
        "  label: string;",
        "  pin: number;",
        "  min: number;",
        "  max: number;",
        "  rest: number;",
        "  ease: number;",
        "  motor?: string;",
        "  vdbPin?: number;",
        "  vdbKey?: string;",
        "  calibrationSource?: string;",
        "  pinOverride?: boolean;",
        "}",
        "",
        "export const SERVO_CONFIG: {",
        "  version: string;",
        "  source: string;",
        "  firmware: string;",
        "  baud: number;",
        "  servoCount: number;",
        "  servos: ServoDef[];",
        "  patterns: Record<string, unknown[]>;",
        "  wavePatterns: unknown[];",
        "  bodyPartGroups: Record<string, { label: string; bit: number; servoKeys: string[] }>;",
        "  mrlGestureCount: number;",
        "  hardwareProfiles: Record<string, { description: string; note?: string }>;",
        "} = " + json.dumps(config, indent=2) + ";",
        "",
        "export const SERVOS: ServoDef[] = SERVO_CONFIG.servos;",
        "export const SERVO_COUNT = SERVO_CONFIG.servoCount;",
        "",
        "export function servoByKey(key: string): ServoDef | undefined {",
        "  return SERVOS.find((s) => s.key === key);",
        "}",
        "",
        "export function pinFor(key: string): number {",
        "  return servoByKey(key)?.pin ?? 0;",
        "}",
        "",
    ]
    OUT_SERVO_CONFIG_TS.write_text("\n".join(ts_lines), encoding="utf-8")
    print(f"wrote {OUT_SERVO_CONFIG_TS}")

    pins = [s["pin"] for s in SERVO_DEFINITIONS]
    mins = [s["min"] for s in SERVO_DEFINITIONS]
    maxs = [s["max"] for s in SERVO_DEFINITIONS]
    rests = [s["rest"] for s in SERVO_DEFINITIONS]
    eases = [_ease_to_byte(s["ease"]) for s in SERVO_DEFINITIONS]

    h_lines = [
        "// Auto-generated by scripts/extract_mrl_inmoov.py — do not edit by hand.",
        "#pragma once",
        "",
        f"#define SERVO_COUNT {len(SERVO_DEFINITIONS)}",
        "",
        f"const uint8_t SERVO_PINS[SERVO_COUNT] PROGMEM = {{{', '.join(str(p) for p in pins)}}};",
        f"const uint8_t SERVO_MIN[SERVO_COUNT] PROGMEM = {{{', '.join(str(m) for m in mins)}}};",
        f"const uint8_t SERVO_MAX[SERVO_COUNT] PROGMEM = {{{', '.join(str(m) for m in maxs)}}};",
        f"const uint8_t SERVO_REST[SERVO_COUNT] PROGMEM = {{{', '.join(str(r) for r in rests)}}};",
        f"const uint8_t SERVO_EASE[SERVO_COUNT] PROGMEM = {{{', '.join(str(e) for e in eases)}}};",
        "",
    ]

    # Pattern tables for firmware
    pattern_names = list(FIRMWARE_PATTERNS.keys())
    h_lines.append(f"#define PATTERN_COUNT {len(pattern_names)}")
    h_lines.append("")
    h_lines.append("struct PatternStep {")
    h_lines.append("  int8_t vals[6];  // head_neck, eye, jaw, rot, tilt, roll (-1 = skip)")
    h_lines.append("  uint16_t holdMs;")
    h_lines.append("};")
    h_lines.append("")
    h_lines.append("struct PatternDef {")
    h_lines.append("  const char* name;")
    h_lines.append("  const PatternStep* steps;")
    h_lines.append("  uint8_t stepCount;")
    h_lines.append("};")
    h_lines.append("")

    for pname in pattern_names:
        steps = FIRMWARE_PATTERNS[pname]
        h_lines.append(f"const PatternStep PATTERN_{pname.upper()}_STEPS[] PROGMEM = {{")
        for step in steps:
            vals = [
                step["hneck"],
                step["eye"],
                step["jaw"],
                step["rot"],
                step["tilt"],
                step["roll"],
            ]
            h_lines.append(
                f"  {{{{{', '.join(str(v) for v in vals)}}}, {step['hold']}}},"
            )
        h_lines.append("};")
        h_lines.append("")

    h_lines.append("const PatternDef PATTERNS[PATTERN_COUNT] PROGMEM = {")
    for pname in pattern_names:
        h_lines.append(
            f'  {{"{pname}", PATTERN_{pname.upper()}_STEPS, {len(FIRMWARE_PATTERNS[pname])}}},'
        )
    h_lines.append("};")
    h_lines.append("")

    OUT_SERVO_CONFIG_H.write_text("\n".join(h_lines), encoding="utf-8")
    print(f"wrote {OUT_SERVO_CONFIG_H}")


def merge_offline_commands(mrl_cmds: list[dict]) -> list[dict]:
    existing_path = ROOT / "shared" / "offline_commands.json"
    existing: list[dict] = []
    if existing_path.exists():
        existing = json.loads(existing_path.read_text(encoding="utf-8"))

    merged = list(existing)
    existing_inputs = {
        inp.lower().strip()
        for cmd in existing
        for inp in cmd.get("inputs", [])
    }

    for cmd in mrl_cmds:
        new_inputs = [i for i in cmd["inputs"] if i.lower().strip() not in existing_inputs]
        if not new_inputs:
            continue
        merged.append({**cmd, "inputs": new_inputs})
        for inp in new_inputs:
            existing_inputs.add(inp.lower().strip())

    return merged


def generate_joint_map_ts() -> None:
    if not CONFIG_YAML.exists():
        print(f"skip joint map — {CONFIG_YAML} missing")
        return

    data = yaml.safe_load(CONFIG_YAML.read_text(encoding="utf-8"))
    joints = data.get("joints", {})

    joint_to_const = {
        "head_pan_joint": "HEAD_PAN",
        "head_tilt_joint": "HEAD_TILT",
        "head_roll_joint": "HEAD_ROLL",
        "waist_pan_joint": "WAIST_PAN",
        "waist_roll_joint": "WAIST_ROLL",
        "eyes_tilt_joint": "EYES_TILT",
        "eyes_pan_joint": "EYES_PAN",
        "jaw_joint": "JAW",
        "l_shoulder_out_joint": "L_SHOULDER_OUT",
        "r_shoulder_out_joint": "R_SHOULDER_OUT",
        "l_shoulder_lift_joint": "SHOULDER_LIFT",
        "r_shoulder_lift_joint": "SHOULDER_LIFT",
        "l_upper_arm_roll_joint": "L_UPPER_ARM_ROLL",
        "r_upper_arm_roll_joint": "R_UPPER_ARM_ROLL",
        "l_elbow_flex_joint": "ELBOW_FLEX",
        "r_elbow_flex_joint": "ELBOW_FLEX",
        "l_wrist_roll_joint": "L_WRIST_ROLL",
        "r_wrist_roll_joint": "R_WRIST_ROLL",
        "l_thumb_joint": "THUMB",
        "r_thumb_joint": "THUMB",
        "l_index_joint": "FINGER",
        "l_middle_joint": "FINGER",
        "l_ring_joint": "FINGER",
        "l_pinky_joint": "FINGER",
        "r_index_joint": "FINGER",
        "r_middle_joint": "FINGER",
        "r_ring_joint": "FINGER",
        "r_pinky_joint": "FINGER",
    }

    lines = [
        "/**",
        " * Official InMoov joint ranges from MyRobotLab/inmoov_ros config.yaml.",
        " * Auto-generated by scripts/extract_mrl_inmoov.py — do not edit by hand.",
        " */",
        "",
        "const DEG = Math.PI / 180;",
        "",
        "export interface JointGoalRange {",
        "  minGoal: number;",
        "  maxGoal: number;",
        "}",
        "",
        "/** Servo value that maps to 0 rad on this joint (official rest pose). */",
        "export function restServoForZero(range: JointGoalRange, servoMin = 0, servoMax = 180): number {",
        "  const span = range.maxGoal - range.minGoal;",
        "  if (Math.abs(span) < 1e-6) return (servoMin + servoMax) / 2;",
        "  let t = -range.minGoal / span;",
        "  t = Math.min(1, Math.max(0, t));",
        "  return servoMin + t * (servoMax - servoMin);",
        "}",
        "",
        "/** Servo slider → URDF radians using official minGoal/maxGoal (degrees). */",
        "export function servoToUrdfRad(",
        "  servoDeg: number,",
        "  range: JointGoalRange,",
        "  servoMin = 0,",
        "  servoMax = 180,",
        "): number {",
        "  const t = Math.min(1, Math.max(0, (servoDeg - servoMin) / (servoMax - servoMin)));",
        "  const goalDeg = range.minGoal + t * (range.maxGoal - range.minGoal);",
        "  return goalDeg * DEG;",
        "}",
        "",
        "/** Map servo to joint angle relative to rest pose (default slider = 0 rad). */",
        "export function servoToJointRad(",
        "  servoDeg: number,",
        "  range: JointGoalRange,",
        "  restServo: number,",
        "  servoMin = 0,",
        "  servoMax = 180,",
        "): number {",
        "  return (",
        "    servoToUrdfRad(servoDeg, range, servoMin, servoMax) -",
        "    servoToUrdfRad(restServo, range, servoMin, servoMax)",
        "  );",
        "}",
        "",
        "export function fingerServoToRad(",
        "  servoDeg: number,",
        "  range: JointGoalRange = FINGER,",
        "  restServo = 10,",
        "): number {",
        "  return servoToJointRad(servoDeg, range, restServo);",
        "}",
        "",
    ]

    emitted: set[str] = set()
    for joint_name, cfg in sorted(joints.items()):
        const = joint_to_const.get(joint_name)
        if not const or const in emitted:
            continue
        emitted.add(const)
        lo = float(cfg["minGoal"])
        hi = float(cfg["maxGoal"])
        lines.append(f"export const {const}: JointGoalRange = {{ minGoal: {lo}, maxGoal: {hi} }};")

    lines += [
        "",
        "/** Leg servos — BodyPage sliders and Arduino firmware */",
        "export const HIP_PAN: JointGoalRange = { minGoal: -45, maxGoal: 45 };",
        "export const HIP_LIFT: JointGoalRange = { minGoal: -45, maxGoal: 45 };",
        "export const KNEE: JointGoalRange = { minGoal: 0, maxGoal: 130 };",
        "export const ANKLE: JointGoalRange = { minGoal: -30, maxGoal: 30 };",
        "export const FOOT_ROLL: JointGoalRange = { minGoal: -25, maxGoal: 25 };",
        "",
    ]

    OUT_JOINT_MAP.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {OUT_JOINT_MAP}")


def generate_presets_ts(gestures: dict) -> None:
    # Prioritize well-known gestures first
    priority = [
        "mrl-Yes",
        "mrl-No",
        "mrl-lookleftside",
        "mrl-lookrightside",
        "mrl-lookinmiddle",
        "mrl-lookup",
        "mrl-lookdown",
        "mrl-tiltHeadAgree",
        "mrl-tiltHeadRightSide",
        "mrl-raiserightarm",
        "mrl-raiseleftarm",
        "mrl-shakehand",
        "mrl-victory",
        "mrl-shrug",
        "mrl-presentation",
        "mrl-giving",
        "mrl-comehere",
        "mrl-agreeanswersmall",
        "mrl-fistHips",
        "mrl-armsUp",
        "mrl-surrender",
        "mrl-muscle",
        "mrl-relax",
    ]

    ordered_ids = [gid for gid in priority if gid in gestures]
    ordered_ids += sorted(gid for gid in gestures if gid not in ordered_ids)

    lines = [
        "/**",
        " * MyRobotLab 1.1.1610 InMoov2 gestures — auto-extracted from local install.",
        " * Regenerate: python scripts/extract_mrl_inmoov.py",
        " */",
        "import type { PresetKeyframe } from '@/lib/presets';",
        "",
        "export type MrlPresetCategory = 'head' | 'arm' | 'hand' | 'full' | 'social';",
        "",
        "export interface MrlPresetMeta {",
        "  id: string;",
        "  name: string;",
        "  desc: string;",
        "  icon: string;",
        "  category: MrlPresetCategory;",
        "  mrlName: string;",
        "}",
        "",
        "export const MRL_PRESETS: Record<string, PresetKeyframe[]> = {",
    ]

    meta_lines = ["export const MRL_PRESET_META: MrlPresetMeta[] = ["]

    for gid in ordered_ids:
        g = gestures[gid]
        kfs_json = json.dumps(g["keyframes"], indent=2)
        kfs_indented = "\n".join("  " + line for line in kfs_json.splitlines())
        lines.append(f"  '{gid}': {kfs_indented},")

        desc = f"From MRL InMoov2/{g['mrlName']}.py"
        meta_lines.append(
            f"  {{ id: '{gid}', name: {json.dumps(g['name'])}, "
            f"desc: {json.dumps(desc)}, icon: {json.dumps(g['icon'])}, "
            f"category: '{g['category']}', mrlName: {json.dumps(g['mrlName'])} }},"
        )

    lines.append("};")
    lines.append("")
    meta_lines.append("];")
    lines.extend(meta_lines)
    lines.append("")

    OUT_PRESETS_TS.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {OUT_PRESETS_TS} ({len(ordered_ids)} presets)")


def main() -> None:
    if not MRL.is_dir():
        raise SystemExit(f"MyRobotLab InMoov2 not found at {MRL}")

    gestures = extract_gestures()
    OUT_GESTURES.parent.mkdir(parents=True, exist_ok=True)
    OUT_GESTURES.write_text(json.dumps(gestures, indent=2), encoding="utf-8")
    print(f"wrote {OUT_GESTURES} ({len(gestures)} gestures)")

    generate_presets_ts(gestures)
    generate_joint_map_ts()
    generate_servo_config(gestures)

    mrl_cmds = extract_aiml_commands(gestures)
    existing_count = 0
    if OUT_OFFLINE.exists():
        existing_count = len(json.loads(OUT_OFFLINE.read_text(encoding="utf-8")))
    merged = merge_offline_commands(mrl_cmds)
    OUT_OFFLINE.parent.mkdir(parents=True, exist_ok=True)
    OUT_OFFLINE.write_text(json.dumps(merged, indent=2), encoding="utf-8")
    print(f"wrote {OUT_OFFLINE} ({len(merged)} commands, +{len(merged) - existing_count} from MRL)")


if __name__ == "__main__":
    main()