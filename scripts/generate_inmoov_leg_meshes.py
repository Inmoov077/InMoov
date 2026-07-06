"""Generate InMoov-style leg STL meshes (mm units, scaled 0.001 in URDF)."""
from __future__ import annotations

import math
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "models" / "inmoov" / "meshes"


def _add_tri(tris: list, a, b, c) -> None:
    tris.append((a, b, c))


def box_tris(cx: float, cy: float, cz: float, sx: float, sy: float, sz: float) -> list:
    x0, x1 = cx - sx / 2, cx + sx / 2
    y0, y1 = cy - sy / 2, cy + sy / 2
    z0, z1 = cz - sz / 2, cz + sz / 2
    v = [
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
        (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
    ]
    faces = [
        (0, 2, 1), (0, 3, 2),
        (4, 5, 6), (4, 6, 7),
        (0, 1, 5), (0, 5, 4),
        (2, 3, 7), (2, 7, 6),
        (1, 2, 6), (1, 6, 5),
        (3, 0, 4), (3, 4, 7),
    ]
    return [(v[i], v[j], v[k]) for i, j, k in faces]


def cylinder_tris(
    cx: float, cy: float, z0: float, z1: float, r0: float, r1: float, segments: int = 24
) -> list:
    tris: list = []
    for i in range(segments):
        a0 = 2 * math.pi * i / segments
        a1 = 2 * math.pi * (i + 1) / segments
        x0, y0 = math.cos(a0), math.sin(a0)
        x1, y1 = math.cos(a1), math.sin(a1)
        p0 = (cx + r0 * x0, cy + r0 * y0, z0)
        p1 = (cx + r0 * x1, cy + r0 * y1, z0)
        p2 = (cx + r1 * x0, cy + r1 * y0, z1)
        p3 = (cx + r1 * x1, cy + r1 * y1, z1)
        _add_tri(tris, p0, p1, p3)
        _add_tri(tris, p0, p3, p2)
        # caps
        _add_tri(tris, (cx, cy, z0), p1, p0)
        _add_tri(tris, (cx, cy, z1), p2, p3)
    return tris


def sphere_tris(cx: float, cy: float, cz: float, r: float, stacks: int = 10, slices: int = 16) -> list:
    tris: list = []
    for i in range(stacks):
        phi0 = math.pi * i / stacks
        phi1 = math.pi * (i + 1) / stacks
        for j in range(slices):
            th0 = 2 * math.pi * j / slices
            th1 = 2 * math.pi * (j + 1) / slices

            def pt(phi, th):
                return (
                    cx + r * math.sin(phi) * math.cos(th),
                    cy + r * math.sin(phi) * math.sin(th),
                    cz + r * math.cos(phi),
                )

            a = pt(phi0, th0)
            b = pt(phi0, th1)
            c = pt(phi1, th1)
            d = pt(phi1, th0)
            _add_tri(tris, a, b, c)
            _add_tri(tris, a, c, d)
    return tris


def write_binary_stl(path: Path, triangles: list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as f:
        header = b"InMoov leg mesh" + b"\0" * 67
        f.write(header[:80])
        f.write(struct.pack("<I", len(triangles)))
        for t in triangles:
            ax, ay, az = t[0]
            bx, by, bz = t[1]
            cx, cy, cz = t[2]
            ux, uy, uz = (by - ay) * (cz - az) - (bz - az) * (cy - ay), (bz - az) * (cx - ax) - (bx - ax) * (cz - az), (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
            ln = math.sqrt(ux * ux + uy * uy + uz * uz) or 1.0
            ux, uy, uz = ux / ln, uy / ln, uz / ln
            f.write(struct.pack("<3f", ux, uy, uz))
            f.write(struct.pack("<3f", ax, ay, az))
            f.write(struct.pack("<3f", bx, by, bz))
            f.write(struct.pack("<3f", cx, cy, cz))
            f.write(struct.pack("<H", 0))


def hip_mesh() -> list:
    """Origin at hip pan axis; geometry hangs below."""
    tris: list = []
    tris.extend(box_tris(0, 0, -22, 72, 58, 44))
    tris.extend(cylinder_tris(22, 0, -42, -8, 24, 24))
    tris.extend(sphere_tris(0, 0, -48, 30))
    return tris


def thigh_mesh() -> list:
    tris: list = []
    tris.extend(cylinder_tris(0, 0, 0, -360, 42, 34))
    tris.extend(box_tris(-8, 0, -120, 25, 50, 80))
    tris.extend(box_tris(5, 0, -200, 20, 45, 60))
    return tris


def thigh_cover_mesh() -> list:
    tris: list = []
    tris.extend(box_tris(18, 0, -150, 8, 55, 280))
    tris.extend(box_tris(18, 0, -80, 6, 48, 120))
    return tris


def knee_mesh() -> list:
    tris: list = []
    tris.extend(box_tris(0, 0, 0, 65, 55, 55))
    tris.extend(sphere_tris(0, 28, 0, 22))
    tris.extend(cylinder_tris(0, 0, -15, 15, 18, 18))
    return tris


def shin_mesh() -> list:
    tris: list = []
    tris.extend(cylinder_tris(0, 0, 0, -320, 34, 28))
    tris.extend(box_tris(-5, 0, -140, 18, 40, 50))
    return tris


def shin_cover_mesh() -> list:
    tris: list = []
    tris.extend(box_tris(14, 0, -150, 7, 48, 260))
    return tris


def ankle_mesh() -> list:
    tris: list = []
    tris.extend(box_tris(0, 0, 0, 55, 50, 40))
    tris.extend(cylinder_tris(0, 0, -10, 10, 20, 20))
    return tris


def foot_mesh() -> list:
    tris: list = []
    tris.extend(box_tris(45, 0, -12, 200, 85, 35))
    tris.extend(box_tris(130, 0, -5, 40, 70, 20))
    tris.extend(box_tris(30, 0, 8, 60, 75, 15))
    return tris


MESH_BUILDERS = {
    "leg_hip.stl": hip_mesh,
    "leg_thigh.stl": thigh_mesh,
    "leg_thigh_cover.stl": thigh_cover_mesh,
    "leg_knee.stl": knee_mesh,
    "leg_shin.stl": shin_mesh,
    "leg_shin_cover.stl": shin_cover_mesh,
    "leg_ankle.stl": ankle_mesh,
    "leg_foot.stl": foot_mesh,
}


def main() -> None:
    for name, builder in MESH_BUILDERS.items():
        path = OUT / name
        tris = builder()
        write_binary_stl(path, tris)
        print(f"Wrote {path.name} ({len(tris)} tris, {path.stat().st_size} bytes)")
    print(f"Done — {len(MESH_BUILDERS)} leg meshes in {OUT}")


if __name__ == "__main__":
    main()