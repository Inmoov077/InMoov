"""Download all official InMoov STL meshes from MyRobotLab/inmoov_ros."""
from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.github.com/repos/MyRobotLab/inmoov_ros/contents/inmoov_meshes/meshes?per_page=100"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "models" / "inmoov" / "meshes"


def fetch_mesh_list() -> list[str]:
    data = json.loads(urllib.request.urlopen(API, timeout=30).read())
    return sorted(x["name"] for x in data if x["name"].endswith(".stl"))


def download(name: str) -> None:
    dest = OUT / name
    if dest.exists() and dest.stat().st_size > 500:
        print(f"skip {name}")
        return
    url = f"https://raw.githubusercontent.com/MyRobotLab/inmoov_ros/master/inmoov_meshes/meshes/{name}"
    for attempt in range(5):
        try:
            print(f"fetch {name}" + (f" (retry {attempt})" if attempt else ""))
            urllib.request.urlretrieve(url, dest)
            return
        except (urllib.error.URLError, ConnectionResetError, TimeoutError, OSError) as exc:
            if attempt == 4:
                raise
            print(f"  warn: {exc}; retrying...")
            time.sleep(2 * (attempt + 1))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    meshes = fetch_mesh_list()
    for name in meshes:
        download(name)
    print(f"done — {len(meshes)} meshes in {OUT}")


if __name__ == "__main__":
    main()