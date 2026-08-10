#!/usr/bin/env python3
"""Sync min/max/rest/ease from shared/servo_config.json into frontend servoConfig.ts"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "shared" / "servo_config.json").read_text(encoding="utf-8"))
ts_path = ROOT / "frontend" / "src" / "lib" / "servoConfig.ts"
ts = ts_path.read_text(encoding="utf-8")

for s in data["servos"]:
    key = s["key"]
    pattern = (
        rf'("key"\s*:\s*"{re.escape(key)}"[\s\S]*?"min"\s*:\s*)(-?\d+)'
        rf'([\s\S]*?"max"\s*:\s*)(-?\d+)'
        rf'([\s\S]*?"rest"\s*:\s*)(-?\d+)'
        rf'([\s\S]*?"ease"\s*:\s*)([0-9.]+)'
    )

    def repl(m, _s=s):
        return f"{m.group(1)}{_s['min']}{m.group(3)}{_s['max']}{m.group(5)}{_s['rest']}{m.group(7)}{_s['ease']}"

    ts, n = re.subn(pattern, repl, ts, count=1)
    if not n:
        print("miss", key)

ts_path.write_text(ts, encoding="utf-8")
print("synced", ts_path)
