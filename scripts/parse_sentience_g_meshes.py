import re
import urllib.request

t = urllib.request.urlopen(
    "https://raw.githubusercontent.com/Sentience-Robotics/inmoov_ros_sim/master/urdf/sentience_gz.urdf",
    timeout=60,
).read().decode()

for m in re.finditer(r'<link name="([^"]+)">(.*?)</link>', t, re.DOTALL):
    name, body = m.group(1), m.group(2)
    g_meshes = re.findall(r'filename="[^"]*/(G-__[^"]+)"', body)
    if g_meshes:
        print(f"\n{name} ({len(g_meshes)} G meshes):")
        for g in g_meshes:
            print(f"  {g}")

# Also print joint origins for G-mesh links' parent chain
for jm in re.finditer(
    r'<joint name="([^"]+)" type="([^"]+)">(.*?)</joint>', t, re.DOTALL
):
    body = jm.group(3)
    if "G-__" in body:
        continue
    parent = re.search(r'<parent link="([^"]+)"/>', body)
    child = re.search(r'<child link="([^"]+)"/>', body)
    origin = re.search(r'<origin[^>]*xyz="([^"]+)"[^>]*rpy="([^"]+)"', body)
    axis = re.search(r'<axis xyz="([^"]+)"', body)
    if parent and child:
        link_name = child.group(1)
        link_block = re.search(rf'<link name="{re.escape(link_name)}">(.*?)</link>', t, re.DOTALL)
        if link_block and "G-__" in link_block.group(1):
            print(
                f"\nJoint {jm.group(1)} ({jm.group(2)}): "
                f"{parent.group(1)} -> {child.group(1)}"
            )
            if origin:
                print(f"  origin xyz={origin.group(1)} rpy={origin.group(2)}")
            if axis:
                print(f"  axis={axis.group(1)}")