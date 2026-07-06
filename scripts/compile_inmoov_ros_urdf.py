"""Compile official MyRobotLab/inmoov_ros xacro → plain URDF for Three.js viewer."""
from __future__ import annotations

import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import xacro

ROOT = Path(__file__).resolve().parents[1]
VENDOR = ROOT / "vendor" / "inmoov_ros"
DESC = VENDOR / "inmoov_description"
BRINGUP = VENDOR / "inmoov_bringup"
OUT = ROOT / "models" / "inmoov" / "inmoov_official.urdf"
LEGS_OUT = ROOT / "models" / "inmoov" / "inmoov_full.urdf"
MESH_PKG = "package://inmoov_meshes/meshes"

RAW_BASE = "https://raw.githubusercontent.com/MyRobotLab/inmoov_ros/master"

XACRO_FILES = [
    "inmoov_description/robots/inmoov.urdf.xacro",
    "inmoov_description/urdf/asmArm.urdf.xacro",
    "inmoov_description/urdf/asmBase.urdf.xacro",
    "inmoov_description/urdf/asmEye.urdf.xacro",
    "inmoov_description/urdf/asmFace.urdf.xacro",
    "inmoov_description/urdf/asmHand.urdf.xacro",
    "inmoov_description/urdf/asmHead.urdf.xacro",
    "inmoov_description/urdf/asmTorso.urdf.xacro",
    "inmoov_description/urdf/config.joints.urdf.xacro",
    "inmoov_description/urdf/materials.urdf.xacro",
    "inmoov_description/urdf/config.inertial.urdf.xacro",
    "inmoov_description/urdf/inmoov.gazebo",
    "inmoov_bringup/config/config.yaml",
]


def download_vendor() -> None:
    for rel in XACRO_FILES:
        dest = VENDOR / rel
        if dest.exists() and dest.stat().st_size > 10:
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        print(f"fetch {rel}")
        urllib.request.urlretrieve(f"{RAW_BASE}/{rel}", dest)


def patch_xacro_paths(text: str) -> str:
    text = text.replace("$(find inmoov_description)", str(DESC).replace("\\", "/"))
    text = text.replace("$(find inmoov_bringup)", str(BRINGUP).replace("\\", "/"))
    return text


def stub_gazebo() -> None:
    """Empty gazebo stub — full inmoov.gazebo breaks web URDF and adds junk tags."""
    path = DESC / "urdf" / "inmoov.gazebo"
    path.write_text('<?xml version="1.0"?>\n<robot xmlns:xacro="http://ros.org/wiki/xacro"/>\n', encoding="utf-8")


def strip_for_web(text: str) -> str:
    """Remove gazebo/plugin/inertial blocks — viewer only needs visuals + joints."""
    text = re.sub(r"<gazebo[^>]*>.*?</gazebo>", "", text, flags=re.DOTALL)
    text = re.sub(r"<inertial>.*?</inertial>", "", text, flags=re.DOTALL)
    text = re.sub(r"<collision>.*?</collision>", "", text, flags=re.DOTALL)
    # Remove world link — attach robot at base_link directly
    text = re.sub(r'<link name="world"/>', "", text)
    text = re.sub(
        r'<joint name="fixed" type="fixed">\s*<parent link="world"/>.*?</joint>',
        "",
        text,
        flags=re.DOTALL,
    )
    materials = """
  <material name="cframe"><color rgba="0.94 0.93 0.91 1"/></material>
  <material name="ccover"><color rgba="0.97 0.96 0.94 1"/></material>
  <material name="ceyeball"><color rgba="0.98 0.98 0.98 1"/></material>
  <material name="ciris"><color rgba="0.25 0.41 0.88 1"/></material>
  <material name="cbase"><color rgba="0.08 0.08 0.09 1"/></material>
  <material name="ckinect"><color rgba="0.08 0.08 0.09 1"/></material>
  <material name="ccamera"><color rgba="0.08 0.08 0.09 1"/></material>
  <material name="grey"><color rgba="0.88 0.87 0.85 1"/></material>
  <material name="cover"><color rgba="0.97 0.96 0.94 1"/></material>
  <material name="base"><color rgba="0.08 0.08 0.09 1"/></material>
"""
    text = text.replace("<robot name=\"inmoov\">", "<robot name=\"inmoov\">" + materials, 1)
    return text


def fix_visual_colors(text: str) -> str:
    """Remove inline rgba overrides — xacro embeds dark gray that breaks the white PLA look."""
    text = re.sub(
        r"(<material name=\"[^\"]+\">)\s*<color[^>]*/>\s*(</material>)",
        r"\1\2",
        text,
        flags=re.DOTALL,
    )
    replacements = {
        'rgba="0.40 0.40 0.40 1"': 'rgba="0.94 0.93 0.91 1"',
        'rgba="0.40 0.40 0.40 1.0"': 'rgba="0.94 0.93 0.91 1"',
        'rgba="0.75 0.75 0.75 1.0"': 'rgba="0.97 0.96 0.94 1"',
        'rgba="0.75 0.75 0.75 1"': 'rgba="0.97 0.96 0.94 1"',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def strip_wheelbase_visuals(text: str) -> str:
    """Full-body mode: hide wheel + pole — legs provide standing support."""
    for link in ("base_link", "pedestal_link"):
        text = re.sub(
            rf"<link name=\"{link}\">.*?</link>",
            f'<link name="{link}"/>',
            text,
            flags=re.DOTALL,
        )
    return text


def reposition_for_standing(text: str) -> str:
    """Place pelvis at natural standing height — legs reach the floor."""
    text = re.sub(
        r'(<joint name="pedestal_to_mid_stomach_joint" type="fixed">.*?)'
        r'<origin rpy="0 0 0" xyz="0 0 0"/>',
        r'\1<origin rpy="0 0 0" xyz="0 0 0.94"/>',
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"(<joint name=\"base_to_pedestal_link\" type=\"fixed\">.*?)"
        r"<origin rpy=\"0 0 0\" xyz=\"0 0 0\"/>",
        r"\1<origin rpy=\"0 0 0\" xyz=\"0 0 0\"/>",
        text,
        flags=re.DOTALL,
    )
    return text


def compile_official() -> str:
    download_vendor()
    stub_gazebo()

    src = DESC / "robots" / "inmoov.urdf.xacro"
    work = DESC / "robots" / "inmoov.web.xacro"
    work.write_text(patch_xacro_paths(src.read_text(encoding="utf-8")), encoding="utf-8")

    # Patch included files that use $(find ...)
    for xac in (DESC / "urdf").glob("*.xacro"):
        text = xac.read_text(encoding="utf-8")
        patched = patch_xacro_paths(text)
        if patched != text:
            xac.write_text(patched, encoding="utf-8")

    joints = DESC / "urdf" / "config.joints.urdf.xacro"
    jtext = joints.read_text(encoding="utf-8")
    cfg = (BRINGUP / "config" / "config.yaml").as_posix()
    jtext = re.sub(
        r'<xacro:property name="filename" value="[^"]*"/>',
        f'<xacro:property name="filename" value="{cfg}"/>',
        jtext,
    )
    joints.write_text(jtext, encoding="utf-8")

    doc = xacro.process_file(str(work))
    xml = doc.toprettyxml(indent="  ")
    # Strip XML declaration noise & empty lines
    lines = [ln for ln in xml.splitlines() if ln.strip()]
    if lines[0].startswith("<?xml"):
        lines = lines[1:]
    return "<?xml version=\"1.0\"?>\n" + "\n".join(lines) + "\n"


def rewrite_mesh_paths(text: str) -> str:
    return text.replace("package://inmoov_meshes/meshes/", f"{MESH_PKG}/")


def _mesh_visual(
    stl: str,
    xyz: str = "0 0 0",
    rpy: str = "0 0 0",
    material: str = "grey",
    scale: str = "0.001 0.001 0.001",
) -> str:
    return f"""    <visual>
      <origin xyz="{xyz}" rpy="{rpy}"/>
      <geometry><mesh filename="{MESH_PKG}/{stl}" scale="{scale}"/></geometry>
      <material name="{material}"/>
    </visual>"""


def _leg_side(side: str, y_sign: int) -> str:
    s = side
    y = y_sign * 0.092
    # Mirror right-leg meshes on Y (cleaner than 180° body flip)
    scale = "0.001 0.001 0.001" if y_sign > 0 else "0.001 -0.001 0.001"
    cover_scale = scale
    return f"""
  <!-- {s.upper()} leg — hip 92mm spacing, joint origins match STL mm geometry -->
  <link name="{s}_hip_link">
{_mesh_visual("leg_hip.stl", "0 0 0", "0 0 0", "grey", scale)}
  </link>
  <joint name="{s}_hip_pan_joint" type="revolute">
    <parent link="pelvis_link"/><child link="{s}_hip_link"/>
    <origin xyz="0 {y:.3f} -0.02" rpy="0 0 0"/><axis xyz="0 0 1"/>
    <limit lower="-0.785" upper="0.785" effort="1000" velocity="1"/>
  </joint>
  <link name="{s}_thigh_link">
{_mesh_visual("leg_thigh.stl", "0 0 -0.18", "0 0 0", "grey", scale)}
  </link>
  <joint name="{s}_hip_lift_joint" type="revolute">
    <parent link="{s}_hip_link"/><child link="{s}_thigh_link"/>
    <origin xyz="0 0 -0.048" rpy="0 0 0"/><axis xyz="1 0 0"/>
    <limit lower="-1.2" upper="1.2" effort="1000" velocity="1"/>
  </joint>
  <link name="{s}_thigh_cover_link">
{_mesh_visual("leg_thigh_cover.stl", "0 0 -0.18", "0 0 0", "cover", cover_scale)}
  </link>
  <joint name="{s}_thigh_cover_joint" type="fixed">
    <parent link="{s}_thigh_link"/><child link="{s}_thigh_cover_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
  </joint>
  <link name="{s}_knee_link">
{_mesh_visual("leg_knee.stl", "0 0 0", "0 0 0", "grey", scale)}
  </link>
  <joint name="{s}_knee_joint" type="revolute">
    <parent link="{s}_thigh_link"/><child link="{s}_knee_link"/>
    <origin xyz="0 0 -0.36" rpy="0 0 0"/><axis xyz="1 0 0"/>
    <limit lower="0" upper="2.27" effort="1000" velocity="1"/>
  </joint>
  <link name="{s}_shin_link">
{_mesh_visual("leg_shin.stl", "0 0 -0.16", "0 0 0", "cover", cover_scale)}
  </link>
  <joint name="{s}_shin_attach_joint" type="fixed">
    <parent link="{s}_knee_link"/><child link="{s}_shin_link"/>
    <origin xyz="0 0 -0.028" rpy="0 0 0"/>
  </joint>
  <link name="{s}_shin_cover_link">
{_mesh_visual("leg_shin_cover.stl", "0 0 -0.16", "0 0 0", "cover", cover_scale)}
  </link>
  <joint name="{s}_shin_cover_joint" type="fixed">
    <parent link="{s}_shin_link"/><child link="{s}_shin_cover_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
  </joint>
  <link name="{s}_ankle_link">
{_mesh_visual("leg_ankle.stl", "0 0 0", "0 0 0", "grey", scale)}
  </link>
  <joint name="{s}_ankle_joint" type="revolute">
    <parent link="{s}_shin_link"/><child link="{s}_ankle_link"/>
    <origin xyz="0 0 -0.32" rpy="0 0 0"/><axis xyz="1 0 0"/>
    <limit lower="-0.52" upper="0.52" effort="1000" velocity="1"/>
  </joint>
  <link name="{s}_foot_roll_link">
{_mesh_visual("leg_foot.stl", "0.045 0 -0.012", "0 0 0", "base", scale)}
  </link>
  <joint name="{s}_foot_roll_joint" type="revolute">
    <parent link="{s}_ankle_link"/><child link="{s}_foot_roll_link"/>
    <origin xyz="0 0 -0.022" rpy="0 0 0"/><axis xyz="0 0 1"/>
    <limit lower="-0.44" upper="0.44" effort="1000" velocity="1"/>
  </joint>"""


def pelvis_block() -> str:
    return """
  <!-- Pelvis hub — legs attach here (below mid_stomach) -->
  <link name="pelvis_link">
    <visual>
      <origin xyz="0 0 -0.03" rpy="0 0 0"/>
      <geometry><box size="0.22 0.20 0.08"/></geometry>
      <material name="grey"/>
    </visual>
  </link>
  <joint name="pelvis_fixed_joint" type="fixed">
    <parent link="mid_stomach_link"/><child link="pelvis_link"/>
    <origin xyz="0 0 -0.04" rpy="0 0 0"/>
  </joint>
"""


def leg_block() -> str:
    return pelvis_block() + _leg_side("l", 1) + _leg_side("r", -1)


def add_legs(text: str) -> str:
    end = text.rfind("</robot>")
    if end < 0:
        raise RuntimeError("No </robot> in compiled URDF")
    return text[:end] + leg_block() + "\n</robot>\n"


def ensure_leg_meshes() -> None:
    marker = ROOT / "models" / "inmoov" / "meshes" / "leg_hip.stl"
    if marker.exists() and marker.stat().st_size > 500:
        return
    print("Generating leg STL meshes...")
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate_inmoov_leg_meshes.py")], check=True)


def main() -> None:
    ensure_leg_meshes()
    print("Compiling official inmoov_ros xacro...")
    xml = compile_official()
    xml = strip_for_web(xml)
    xml = fix_visual_colors(xml)
    xml = rewrite_mesh_paths(xml)
    OUT.write_text(xml, encoding="utf-8")
    print(f"Wrote {OUT} ({len(xml)} bytes)")

    full = add_legs(xml)
    full = strip_wheelbase_visuals(full)
    full = reposition_for_standing(full)
    full = fix_visual_colors(full)
    LEGS_OUT.write_text(full, encoding="utf-8")
    print(f"Wrote {LEGS_OUT} ({len(full)} bytes) with legs")


if __name__ == "__main__":
    main()