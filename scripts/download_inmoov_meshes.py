"""Download official InMoov STL meshes from MyRobotLab/inmoov_ros."""
from __future__ import annotations

import time
import urllib.error
import urllib.request
from pathlib import Path

BASE = (
    "https://raw.githubusercontent.com/MyRobotLab/inmoov_ros/master/"
    "inmoov_meshes/meshes"
)
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "models" / "inmoov" / "meshes"

MESHES = [
    "mid_stomach.stl",
    "top_stomach.stl",
    "disk.stl",
    "torso.stl",
    "chest.stl",
    "head_base.stl",
    "head.stl",
    "skull.stl",
    "jaw.stl",
    "face.stl",
    "earleftv1.stl",
    "earrightv1.stl",
    "eyesupport.stl",
    "eye.stl",
    "iris.stl",
    "l_eyesupport.stl",
    "r_eyesupport.stl",
    "camera.stl",
    "l_shoulder_base.stl",
    "l_shoulder.stl",
    "bicep.stl",
    "bicepcover.stl",
    "l_forearm.stl",
    "l_hand.stl",
    "r_shoulder_base.stl",
    "r_shoulder.stl",
    "r_forearm.stl",
    "r_hand.stl",
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name in MESHES:
        dest = OUT / name
        if dest.exists() and dest.stat().st_size > 500:
            print(f"skip {name}")
            continue
        url = f"{BASE}/{name}"
        for attempt in range(5):
            try:
                print(f"fetch {name}" + (f" (retry {attempt})" if attempt else ""))
                urllib.request.urlretrieve(url, dest)
                break
            except (urllib.error.URLError, ConnectionResetError, TimeoutError) as exc:
                if attempt == 4:
                    raise
                print(f"  warn: {exc}; retrying...")
                time.sleep(2 * (attempt + 1))
    print(f"done — {len(MESHES)} meshes in {OUT}")


if __name__ == "__main__":
    main()