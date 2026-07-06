"""Parse sentience URDF torso/leg mesh attachments."""
from __future__ import annotations

import re
import urllib.request

URL = "https://raw.githubusercontent.com/Sentience-Robotics/inmoov_ros_sim/master/urdf/sentience_gz.urdf"


def main() -> None:
    text = urllib.request.urlopen(URL, timeout=60).read().decode("utf-8", "replace")

    # Split into link blocks
    for m in re.finditer(r'<link name="([^"]+)">(.*?)</link>', text, re.DOTALL):
        name, body = m.group(1), m.group(2)
        if "torso" in name.lower() or "leg" in name.lower() or "stom" in name.lower():
            meshes = re.findall(r'filename="([^"]+)"', body)
            joints_to = []
            print(f"\nLINK {name}")
            for mesh in meshes:
                print(f"  mesh: {mesh.split('/')[-1]}")
            # find child joints
            for jm in re.finditer(
                rf'<joint name="([^"]+)"[^>]*>.*?<parent link="{re.escape(name)}"/>.*?<child link="([^"]+)"/>',
                text,
                re.DOTALL,
            ):
                print(f"  child joint: {jm.group(1)} -> {jm.group(2)}")

    # G- mesh groups used in URDF
    meshes = re.findall(r'filename="meshes/stl/([^"]+)"', text)
    groups: dict[str, list[str]] = {}
    for m in meshes:
        base = m.split(".")[0]
        groups.setdefault(base, []).append(m)
    print(f"\nMesh groups in URDF ({len(groups)}):")
    for base, files in sorted(groups.items()):
        print(f"  {base}: {len(files)} parts")


if __name__ == "__main__":
    main()