"""Sync arm min/max/rest from shared/servo_config.json into frontend servoConfig.ts"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
cfg = json.loads((ROOT / "shared" / "servo_config.json").read_text(encoding="utf-8"))
ts_path = ROOT / "frontend" / "src" / "lib" / "servoConfig.ts"
t = ts_path.read_text(encoding="utf-8")
keys = {
    "l_lift",
    "l_elbow",
    "l_shoulder",
    "l_rotate",
    "r_lift",
    "r_elbow",
    "r_shoulder",
    "r_rotate",
    "l_wrist",
    "r_wrist",
}
for s in cfg["servos"]:
    k = s["key"]
    if k not in keys:
        continue
    pat = rf'("key": "{k}"[\s\S]*?"min": )\d+(,\s*"max": )\d+(,\s*"rest": )\d+'
    t2, n = re.subn(pat, rf'\g<1>{s["min"]}\g<2>{s["max"]}\g<3>{s["rest"]}', t, count=1)
    print(k, "ok" if n else "MISS", s["min"], s["max"], s["rest"])
    t = t2
ts_path.write_text(t, encoding="utf-8")
print("wrote", ts_path)
