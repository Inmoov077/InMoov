#!/usr/bin/env python3
"""Generate servo_config.h from shared/servo_config.json (latest limits/pins)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "shared" / "servo_config.json"
OUT_H = ROOT / "servo_config.h"


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    servos = data["servos"]
    assert len(servos) == 36, f"expected 36 servos, got {len(servos)}"

    pins = [int(s["pin"]) for s in servos]
    mins = [int(s["min"]) for s in servos]
    maxs = [int(s["max"]) for s in servos]
    rests = [int(s["rest"]) for s in servos]
    eases = [
        max(1, min(255, int(round(float(s.get("ease", 0.08)) * 255)))) for s in servos
    ]
    keys = [s["key"] for s in servos]

    # Walkthrough invert map (optional firmware-side; host may also invert).
    # All arm joints inverted except right omoplate (r_lift).
    invert: list[int] = []
    for k in keys:
        if k in ("l_shoulder", "l_lift", "l_rotate", "l_elbow", "l_wrist"):
            invert.append(1)
        elif k in ("r_shoulder", "r_rotate", "r_elbow", "r_wrist"):
            invert.append(1)
        else:
            invert.append(0)

    patterns = data.get("patterns") or {}

    def pat_steps(name: str, default: list[tuple[list[int], int]]):
        src = patterns.get(name)
        if not src:
            return default
        out = []
        for st in src:
            vals = [
                int(st.get("hneck", 85)),
                int(st.get("eye", 90)),
                int(st.get("jaw", 8)),
                int(st.get("rot", 60)),
                int(st.get("tilt", 50)),
                int(st.get("roll", 120)),
            ]
            out.append((vals, int(st.get("hold", 400))))
        return out

    nod = pat_steps(
        "nod",
        [
            ([85, 90, 8, 60, 80, 120], 600),
            ([85, 90, 8, 60, 20, 120], 600),
            ([85, 90, 8, 60, 50, 120], 400),
        ],
    )
    shake = pat_steps(
        "shake",
        [
            ([85, 60, 8, 10, 50, 170], 600),
            ([85, 120, 8, 110, 50, 70], 600),
            ([85, 90, 8, 60, 50, 120], 400),
        ],
    )
    yes = pat_steps(
        "yes",
        [
            ([85, 90, 8, 60, 35, 120], 400),
            ([85, 90, 8, 60, 70, 120], 400),
            ([85, 90, 8, 60, 35, 120], 400),
            ([85, 90, 8, 60, 50, 120], 300),
        ],
    )
    no = pat_steps(
        "no",
        [
            ([85, 60, 8, 25, 50, 150], 400),
            ([85, 120, 8, 95, 50, 90], 400),
            ([85, 60, 8, 25, 50, 150], 400),
            ([85, 90, 8, 60, 50, 120], 300),
        ],
    )
    bow = pat_steps(
        "bow",
        [
            ([85, 90, 8, 60, 50, 120], 500),
            ([85, 90, 10, 60, 15, 120], 1200),
            ([85, 90, 8, 60, 50, 120], 500),
        ],
    )
    relax = pat_steps("relax", [([85, 90, 8, 60, 50, 120], 300)])

    lines: list[str] = []
    lines.append("// Auto-generated from shared/servo_config.json by scripts/generate_servo_config_h.py")
    lines.append("// Do not edit by hand — re-run the script after changing servo_config.json")
    lines.append("#pragma once")
    lines.append("")
    lines.append("#define SERVO_COUNT 36")
    lines.append('#define FIRMWARE_VERSION "1.2.1"')
    lines.append("")
    lines.append("// Index map:")
    lines.append("//  0-2 head, 3-5 neck, 6-10 L arm, 11-15 R arm,")
    lines.append("//  16-20 L hand, 21-25 R hand, 26-30 L leg, 31-35 R leg")
    lines.append("// " + ", ".join(f"{i}:{k}" for i, k in enumerate(keys)))
    lines.append("")
    lines.append(
        f"const uint8_t SERVO_PINS[SERVO_COUNT] PROGMEM = {{{', '.join(map(str, pins))}}};"
    )
    lines.append(
        f"const uint8_t SERVO_MIN[SERVO_COUNT] PROGMEM = {{{', '.join(map(str, mins))}}};"
    )
    lines.append(
        f"const uint8_t SERVO_MAX[SERVO_COUNT] PROGMEM = {{{', '.join(map(str, maxs))}}};"
    )
    lines.append(
        f"const uint8_t SERVO_REST[SERVO_COUNT] PROGMEM = {{{', '.join(map(str, rests))}}};"
    )
    lines.append(
        f"const uint8_t SERVO_EASE[SERVO_COUNT] PROGMEM = {{{', '.join(map(str, eases))}}};"
    )
    lines.append(
        f"const uint8_t SERVO_INVERT[SERVO_COUNT] PROGMEM = {{{', '.join(map(str, invert))}}};"
    )
    lines.append("")
    lines.append("#define PATTERN_COUNT 6")
    lines.append("")
    lines.append("struct PatternStep {")
    lines.append("  int8_t vals[6];  // head_neck, eye, jaw, rot, tilt, roll (-1 = skip)")
    lines.append("  uint16_t holdMs;")
    lines.append("};")
    lines.append("")
    lines.append("struct PatternDef {")
    lines.append("  const char* name;")
    lines.append("  const PatternStep* steps;")
    lines.append("  uint8_t stepCount;")
    lines.append("};")
    lines.append("")

    def emit_steps(cname: str, steps: list[tuple[list[int], int]]) -> None:
        lines.append(f"const PatternStep {cname}[] PROGMEM = {{")
        for vals, hold in steps:
            v = ", ".join(str(int(x)) for x in vals)
            lines.append(f"  {{{{{v}}}, {hold}}},")
        lines.append("};")
        lines.append("")

    emit_steps("PATTERN_NOD_STEPS", nod)
    emit_steps("PATTERN_SHAKE_STEPS", shake)
    emit_steps("PATTERN_YES_STEPS", yes)
    emit_steps("PATTERN_NO_STEPS", no)
    emit_steps("PATTERN_BOW_STEPS", bow)
    emit_steps("PATTERN_RELAX_STEPS", relax)

    lines.append("const PatternDef PATTERNS[PATTERN_COUNT] PROGMEM = {")
    lines.append(f'  {{"nod", PATTERN_NOD_STEPS, {len(nod)}}},')
    lines.append(f'  {{"shake", PATTERN_SHAKE_STEPS, {len(shake)}}},')
    lines.append(f'  {{"yes", PATTERN_YES_STEPS, {len(yes)}}},')
    lines.append(f'  {{"no", PATTERN_NO_STEPS, {len(no)}}},')
    lines.append(f'  {{"bow", PATTERN_BOW_STEPS, {len(bow)}}},')
    lines.append(f'  {{"relax", PATTERN_RELAX_STEPS, {len(relax)}}},')
    lines.append("};")
    lines.append("")

    OUT_H.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_H}")
    print("Arm limits:")
    for i in range(6, 16):
        print(
            f"  [{i}] {keys[i]:12s} pin={pins[i]:3d} "
            f"{mins[i]:3d}-{maxs[i]:3d} rest={rests[i]:3d} inv={invert[i]}"
        )


if __name__ == "__main__":
    main()
