import re
import urllib.request

t = urllib.request.urlopen(
    "https://raw.githubusercontent.com/Sentience-Robotics/inmoov_ros_sim/master/urdf/sentience_gz.urdf",
    timeout=60,
).read().decode()
print("G meshes", len(re.findall(r"G-__", t)))
print("Texture", len(re.findall(r"Texture", t)))
links = sorted(set(re.findall(r'<link name="([^"]+)"', t)))
print("links", len(links))
for l in links:
    print(l)