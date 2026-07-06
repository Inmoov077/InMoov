"""HTTP-check every STL referenced in inmoov_full.urdf."""
from __future__ import annotations

import re
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
URDF = ROOT / "models" / "inmoov" / "inmoov_full.urdf"
BASE = "http://localhost:5000"


def main() -> None:
    text = URDF.read_text(encoding="utf-8")
    meshes = sorted(set(re.findall(r"meshes/([A-Za-z0-9_-]+\.stl)", text)))
    ok = fail = 0
    for name in meshes:
        url = f"{BASE}/models/inmoov/meshes/{name}"
        try:
            with urllib.request.urlopen(url, timeout=8) as r:
                size = r.headers.get("Content-Length", "?")
                if int(size or 0) < 100:
                    print(f"WARN {name} tiny ({size})")
                    fail += 1
                else:
                    ok += 1
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            print(f"FAIL {name}: {exc}")
            fail += 1
    urdf_url = f"{BASE}/models/inmoov/inmoov_full.urdf"
    with urllib.request.urlopen(urdf_url, timeout=8) as r:
        print(f"URDF OK ({r.headers.get('Content-Length')} bytes)")
    print(f"Meshes: {ok} OK, {fail} failed of {len(meshes)}")
    if fail:
        raise SystemExit(1)


if __name__ == "__main__":
    main()