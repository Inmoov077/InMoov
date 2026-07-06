"""Download official InMoov leg STLs from inmoov.fr (Gael Langevin, CC BY-NC)."""
from __future__ import annotations

import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "models" / "inmoov" / "meshes"
BASE = "https://inmoov.fr/wp-content/uploads/stl"

# Curated set: main leg segments + pelvis supports (skip bolts/clamps)
OFFICIAL_LEGS = [
    # Pelvis / hip mount
    ("Low-Stomach/StomSupportLeftV1.stl", "StomSupportLeftV1.stl"),
    ("Low-Stomach/StomSupportRightV1.stl", "StomSupportRightV1.stl"),
    ("Low-Stomach/TStoLowLeftV1.stl", "TStoLowLeftV1.stl"),
    ("Low-Stomach/TStoLowRightV1.stl", "TStoLowRightV1.stl"),
    # Thigh
    ("Legs-Thigh/LegHolderLeft.stl", "LegHolderLeft.stl"),
    ("Legs-Thigh/LegHolderRight.stl", "LegHolderRight.stl"),
    ("Legs-Thigh/LegFixerLeftV1.stl", "LegFixerLeftV1.stl"),
    ("Legs-Thigh/LegFixerV1.stl", "LegFixerV1.stl"),
    ("Legs-Thigh/ThighHighTempLeftV1.stl", "ThighHighTempLeftV1.stl"),
    ("Legs-Thigh/ThighHighTempV1.stl", "ThighHighTempV1.stl"),
    ("Legs-Thigh/ThighHighLeftV1.stl", "ThighHighLeftV1.stl"),
    ("Legs-Thigh/ThighHighRightV1.stl", "ThighHighRightV1.stl"),
    ("Legs-Thigh/ThighMidLeftV1.stl", "ThighMidLeftV1.stl"),
    ("Legs-Thigh/ThighMidRightV1.stl", "ThighMidRightV1.stl"),
    ("Legs-Thigh/ThighLowLeftV3.stl", "ThighLowLeftV3.stl"),
    ("Legs-Thigh/ThighLowRightV3.stl", "ThighLowRightV3.stl"),
    ("Legs-Thigh/ThighSideAccessLeftV1.stl", "ThighSideAccessLeftV1.stl"),
    ("Legs-Thigh/ThighSideAccessRightV1.stl", "ThighSideAccessRightV1.stl"),
    # Knee
    ("Legs-Knee/KneeHighLeftV3.stl", "KneeHighLeftV3.stl"),
    ("Legs-Knee/KneeHighRightV3.stl", "KneeHighRightV3.stl"),
    ("Legs-Knee/KneeLowLeftV3.stl", "KneeLowLeftV3.stl"),
    ("Legs-Knee/KneeLowRightV3.stl", "KneeLowRightV3.stl"),
    ("Legs-Knee/KneeClampLeftV1.stl", "KneeClampLeftV1.stl"),
    ("Legs-Knee/KneeClampRightV1.stl", "KneeClampRightV1.stl"),
    # Tibia
    ("Legs-Tibia/TibiaHighLeftV1.stl", "TibiaHighLeftV1.stl"),
    ("Legs-Tibia/TibiaHighRightV1.stl", "TibiaHighRightV1.stl"),
    ("Legs-Tibia/TibiaLowS1LeftV1.stl", "TibiaLowS1LeftV1.stl"),
    ("Legs-Tibia/TibiaLowS1RightV1.stl", "TibiaLowS1RightV1.stl"),
    ("Legs-Tibia/TibiaLowS2LeftV1.stl", "TibiaLowS2LeftV1.stl"),
    ("Legs-Tibia/TibiaLowS2RightV1.stl", "TibiaLowS2RightV1.stl"),
    # Ankle & foot
    ("Legs-Ankle/leftAnkleBaseV1.stl", "leftAnkleBaseV1.stl"),
    ("Legs-Ankle/AnkleBaseV1.stl", "AnkleBaseV1.stl"),
    ("Legs-Ankle/LeftAnkleDownV2.stl", "LeftAnkleDownV2.stl"),
    ("Legs-Ankle/AnkleDownV2.stl", "AnkleDownV2.stl"),
    ("Legs-Ankle/LeftAnkpartV1.stl", "LeftAnkpartV1.stl"),
    ("Legs-Ankle/AnkpartV1.stl", "AnkpartV1.stl"),
    ("Legs-Ankle/LeftAnkHolderV1.stl", "LeftAnkHolderV1.stl"),
    ("Legs-Ankle/AnkHolderV1.stl", "AnkHolderV1.stl"),
    ("Legs-Ankle/LeftAnkMidleFootV1.stl", "LeftAnkMidleFootV1.stl"),
    ("Legs-Ankle/AnkMidleFootV1.stl", "AnkMidleFootV1.stl"),
    ("Legs-Ankle/LeftAnkToesFootV2.stl", "LeftAnkToesFootV2.stl"),
    ("Legs-Ankle/AnkToesFootV2.stl", "AnkToesFootV2.stl"),
    ("Legs-Ankle/LeftAnkBackFootV1.stl", "LeftAnkBackFootV1.stl"),
    ("Legs-Ankle/AnkBackFootV1.stl", "AnkBackFootV1.stl"),
]

MARKER = "ThighHighLeftV1.stl"
UA = {"User-Agent": "InMoov-ControlDeck/1.0 (educational robot viewer)"}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ok, skip, fail = 0, 0, 0

    for rel_path, filename in OFFICIAL_LEGS:
        dest = OUT / filename
        if dest.exists() and dest.stat().st_size > 500:
            skip += 1
            continue
        url = f"{BASE}/{rel_path}"
        try:
            data = fetch(url)
            if len(data) < 84:
                raise ValueError(f"STL too small ({len(data)} bytes)")
            dest.write_bytes(data)
            ok += 1
            print(f"  OK {filename} ({len(data) // 1024} KB)")
        except (urllib.error.URLError, ValueError, OSError) as exc:
            fail += 1
            print(f"  FAIL {filename}: {exc}")

    print(f"Done — downloaded {ok}, skipped {skip}, failed {fail} → {OUT}")
    if fail and not (OUT / MARKER).exists():
        raise SystemExit(1)


if __name__ == "__main__":
    main()