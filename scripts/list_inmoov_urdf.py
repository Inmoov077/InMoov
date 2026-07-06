import json
import urllib.request

REPO = "https://api.github.com/repos/MyRobotLab/inmoov_ros/contents"


def list_dir(path: str) -> None:
    data = json.load(urllib.request.urlopen(f"{REPO}/{path}?per_page=100"))
    print(f"=== {path} ===")
    for item in data:
        print(f"  {item['name']} ({item['type']})")


if __name__ == "__main__":
    list_dir("inmoov_description/urdf")
    list_dir("inmoov_description/robots")