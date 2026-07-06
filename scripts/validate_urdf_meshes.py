"""Verify all STL files referenced in inmoov_full.urdf exist."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
URDF = ROOT / "models" / "inmoov" / "inmoov_full.urdf"
MESHES = ROOT / "models" / "inmoov" / "meshes"


def main() -> None:
    text = URDF.read_text(encoding="utf-8")
    refs = sorted(set(re.findall(r"meshes/([A-Za-z0-9_./-]+\.stl)", text)))
    missing = [m for m in refs if not (MESHES / Path(m).name).exists()]
    joints = re.findall(r'<joint name="([^"]+)"', text)
    leg_joints = [j for j in joints if any(k in j for k in ("hip", "knee", "ankle", "foot", "thigh", "shin"))]

    print(f"URDF: {URDF.name} ({len(text)} bytes)")
    print(f"Mesh refs: {len(refs)} — missing: {len(missing)}")
    for m in missing:
        print(f"  MISSING {m}")
    print(f"Leg joints: {len(leg_joints)}")
    for j in leg_joints:
        print(f"  {j}")
    if missing:
        raise SystemExit(1)
    print("OK — all meshes present")


if __name__ == "__main__":
    main()