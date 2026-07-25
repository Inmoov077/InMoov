#!/usr/bin/env python3
"""Sanity-check shared JSON configs used by InMoove."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    "shared/servo_config.json",
    "shared/gestures.json",
    "shared/offline_commands.json",
    "shared/realsense_config.json",
    "inmoove_core/config/peers.json",
]


def main() -> int:
    errors = 0
    for rel in FILES:
        path = ROOT / rel
        if not path.exists():
            print(f"MISSING {rel}")
            errors += 1
            continue
        try:
            json.loads(path.read_text(encoding="utf-8"))
            print(f"OK      {rel}")
        except Exception as e:
            print(f"BAD     {rel}: {e}")
            errors += 1
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
