"""Inspect Sentience inmoov_ros_sim URDF for leg structure."""
from __future__ import annotations

import re
import urllib.request

URL = "https://raw.githubusercontent.com/Sentience-Robotics/inmoov_ros_sim/master/urdf/sentience_gz.urdf"


def main() -> None:
    text = urllib.request.urlopen(URL, timeout=60).read().decode("utf-8", "replace")
    print(f"URDF size: {len(text)} bytes")

    for pat in ["hip", "thigh", "shin", "knee", "ankle", "foot", "leg", "pelvis", "stomach", "torso"]:
        matches = sorted(set(m.group(0) for m in re.finditer(rf'name="[^"]*{pat}[^"]*"', text, re.I)))
        if matches:
            print(f"\n--- {pat} ({len(matches)}) ---")
            for m in matches[:40]:
                print(m)

    joints = re.findall(r'<joint name="([^"]+)"', text)
    print(f"\nTotal joints: {len(joints)}")
    leg_kw = re.compile(r"leg|hip|knee|ankle|foot|thigh|pelvis|femur|tibia|shin", re.I)
    leg_joints = [j for j in joints if leg_kw.search(j)]
    print(f"Leg-like joints: {len(leg_joints)}")
    for j in leg_joints[:50]:
        print(f"  {j}")

    # Sample mesh filenames
    meshes = sorted(set(re.findall(r'filename="([^"]+\.stl)"', text, re.I)))
    print(f"\nTotal mesh refs: {len(meshes)}")
    leg_meshes = [m for m in meshes if leg_kw.search(m)]
    print(f"Leg-like meshes: {len(leg_meshes)}")
    for m in leg_meshes[:30]:
        print(f"  {m}")

    print("\nAll joints:")
    for j in joints:
        print(f"  {j}")

    # i01 link names
    links = re.findall(r'<link name="([^"]+)"', text)
    i01_links = [l for l in links if "i01" in l.lower()]
    print(f"\ni01 links: {len(i01_links)}")
    for l in i01_links[:60]:
        print(f"  {l}")

    # Find meshes with leg-ish G- prefixes - list unique base names
    bases = sorted(set(m.split("/")[-1] for m in meshes))
    print(f"\nFirst 40 mesh files:")
    for m in bases[:40]:
        print(f"  {m}")


if __name__ == "__main__":
    main()