"""Build a plain URDF with official InMoov hand finger meshes (from asmHand.xacro)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "models" / "inmoov" / "inmoov.urdf"
OUT = ROOT / "models" / "inmoov" / "inmoov_full.urdf"
PKG = "package://inmoov_meshes/meshes"


def mesh(file: str) -> str:
    return f'<geometry><mesh filename="{PKG}/{file}" scale="0.001 0.001 0.001"/></geometry>'


def visual(file: str, material: str = "frame", xyz: str = "0 0 0", rpy: str = "0 0 0") -> str:
    return f"""    <visual>
      <origin xyz="{xyz}" rpy="{rpy}"/>
      {mesh(file)}
      <material name="{material}"/>
    </visual>"""


def revolute(
    name: str,
    parent: str,
    child: str,
    xyz: str,
    rpy: str,
    axis: str,
    lower: str = "-1.57",
    upper: str = "1.57",
    mimic: str | None = None,
) -> str:
    mimic_xml = ""
    if mimic:
        mimic_xml = f"\n    <mimic {mimic}/>"
    return f"""  <joint name="{name}" type="revolute">
    <parent link="{parent}"/><child link="{child}"/>
    <origin xyz="{xyz}" rpy="{rpy}"/>
    <axis xyz="{axis}"/>
    <limit lower="{lower}" upper="{upper}" effort="1000" velocity="1"/>{mimic_xml}
  </joint>"""


def fixed(name: str, parent: str, child: str, xyz: str, rpy: str = "0 0 0") -> str:
    return f"""  <joint name="{name}" type="fixed">
    <parent link="{parent}"/><child link="{child}"/>
    <origin xyz="{xyz}" rpy="{rpy}"/>
  </joint>"""


def hand_side(side: str, flip: int) -> str:
    f = flip
    s = side
    parts: list[str] = []

    def link(name: str, stl: str, mat: str = "frame") -> None:
        parts.append(f'  <link name="{name}">\n{visual(stl, mat)}\n  </link>')

    link(f"{s}_hand_link", f"{s}_hand.stl")
    link(f"{s}_thumb1_link", f"{s}_thumb5_1.stl")
    link(f"{s}_thumb2_link", "thumb5_2.stl")
    link(f"{s}_thumb3_link", "thumb5_3.stl")
    link(f"{s}_index1_link", "index3_1.stl")
    link(f"{s}_index2_link", "index3_2.stl")
    link(f"{s}_index3_link", "index3_3.stl")
    link(f"{s}_middle1_link", "middle3_1.stl")
    link(f"{s}_middle2_link", "middle3_2.stl")
    link(f"{s}_middle3_link", "middle3_3.stl")
    link(f"{s}_ring1_link", f"{s}_ring3_1.stl")
    link(f"{s}_ring2_link", "ring3_2.stl")
    link(f"{s}_ring3_link", "ring3_3.stl")
    link(f"{s}_ring4_link", "ring3_4.stl")
    link(f"{s}_pinky1_link", f"{s}_pinky3_1.stl")
    link(f"{s}_pinky2_link", "pinky3_2.stl")
    link(f"{s}_pinky3_link", "pinky3_3.stl")
    link(f"{s}_pinky4_link", "pinky3_4.stl")
    link(f"{s}_handcover_link", f"{s}_cover_hand.stl", "cover")
    link(f"{s}_cover_thumb_link", f"{s}_cover_thumb.stl", "cover")
    link(f"{s}_cover_index_link", f"{s}_cover_index.stl", "cover")
    link(f"{s}_cover_middle_link", f"{s}_cover_middle.stl", "cover")
    link(f"{s}_cover_ring_link", f"{s}_cover_ring.stl", "cover")
    link(f"{s}_cover_pinky_link", f"{s}_cover_pinky.stl", "cover")
    link(f"{s}_cover_handring_link", f"{s}_cover_handring.stl", "cover")
    link(f"{s}_cover_handpinky_link", f"{s}_cover_handpinky.stl", "cover")

    parts.append(
        revolute(
            f"{s}_thumb1_joint",
            f"{s}_hand_link",
            f"{s}_thumb1_link",
            f"0 {f * 0.029} -0.0577",
            f"{f * 0.1} 0 0",
            "0 0 1",
            mimic=f'joint="{s}_thumb_joint" multiplier="{f * 0.75}" offset="0"',
        )
    )
    parts.append(
        revolute(
            f"{s}_thumb_joint",
            f"{s}_thumb1_link",
            f"{s}_thumb2_link",
            f"-0.00052 {f * 0.02725} -0.013",
            f"{f * 0.825} -0.1 {f * 0.3}",
            "0 1 0",
            lower="0",
            upper="1.4",
        )
    )
    parts.append(
        revolute(
            f"{s}_thumb3_joint",
            f"{s}_thumb2_link",
            f"{s}_thumb3_link",
            "0 0 -0.035",
            "0 0 0",
            "0 1 0",
            lower="0",
            upper="1.4",
            mimic=f'joint="{s}_thumb_joint" multiplier="1" offset="0"',
        )
    )

    finger_specs = [
        ("index", f"-0.0015 {f * 0.0342} -0.119", "0 0.001 -0.03595", "0 0 -0.024", f"{f * 0.1} 0 0", f"{f * 0.05} 0 0", "0 1 0", "1"),
        ("middle", f"-0.00175 {f * 0.007} -0.12325", "0 0.000 -0.0389", "0 0.0005 -0.0259", "0 0 0", f"0 {f * -0.05} 0", "0 1 0", "1"),
        ("ring", f"0 {f * -0.00705} -0.0794", f"0.00126 {f * -0.0351} -0.0166", "0 0.0005 -0.0345", f"{f * 0.7} 0 0", f"{f * -0.7775} 0 0", "0 0 1", f"{f * -0.1}"),
        ("pinky", f"0 {f * -0.0270} -0.0555", f"0 {f * -0.046} -0.0228", "0 0.0005 -0.031", f"{f * 0.7} 0 0", f"{f * -0.93} 0 0", "0 0 1", f"{f * -0.1}"),
    ]
    for finger, o1, o2, o3, m1, m2, axis1, mimic_mul in finger_specs:
        parts.append(
            revolute(
                f"{s}_{finger}1_joint",
                f"{s}_hand_link",
                f"{s}_{finger}1_link",
                o1,
                m1,
                axis1,
                lower="0",
                upper="1.4",
                mimic=f'joint="{s}_{finger}_joint" multiplier="{mimic_mul}" offset="0"',
            )
        )
        parts.append(
            revolute(
                f"{s}_{finger}_joint",
                f"{s}_{finger}1_link",
                f"{s}_{finger}2_link",
                o2,
                m2,
                "0 1 0",
                lower="0",
                upper="1.4",
            )
        )
        parts.append(
            revolute(
                f"{s}_{finger}3_joint",
                f"{s}_{finger}2_link",
                f"{s}_{finger}3_link",
                o3,
                "0 0 0",
                "0 1 0",
                lower="0",
                upper="1.4",
                mimic=f'joint="{s}_{finger}_joint" multiplier="1" offset="0"',
            )
        )
        if finger in ("ring", "pinky"):
            o4 = "0 0.0004 -0.0229" if finger == "ring" else "0 0.0004 -0.0208"
            parts.append(
                revolute(
                    f"{s}_{finger}4_joint",
                    f"{s}_{finger}3_link",
                    f"{s}_{finger}4_link",
                    o4,
                    "0 0 0",
                    "0 1 0",
                    lower="0",
                    upper="1.4",
                    mimic=f'joint="{s}_{finger}_joint" multiplier="1" offset="0"',
                )
            )

    parts.append(fixed(f"{s}_handcover_joint", f"{s}_hand_link", f"{s}_handcover_link", f"0.009 {f * 0.0192} -0.0977"))
    parts.append(fixed(f"{s}_cover_thumb_joint", f"{s}_thumb1_link", f"{s}_cover_thumb_link", f"0.01 {f * 0.02125} 0.0047", f"{f * 0.05} 0 0"))
    parts.append(fixed(f"{s}_cover_index_joint", f"{s}_index1_link", f"{s}_cover_index_link", "0.0071 0 -0.012", f"0 {f * 0.05} 0"))
    parts.append(fixed(f"{s}_cover_middle_joint", f"{s}_middle1_link", f"{s}_cover_middle_link", "0.0071 0 -0.012", f"0 {f * -0.05} 0"))
    parts.append(fixed(f"{s}_cover_ring_joint", f"{s}_ring2_link", f"{s}_cover_ring_link", "0.005 0 -0.011", f"{f * 0.1} {f * -0.05} 0"))
    parts.append(fixed(f"{s}_cover_pinky_joint", f"{s}_pinky2_link", f"{s}_cover_pinky_link", "0.005 0 -0.011", f"{f * 0.1} {f * -0.05} 0"))
    parts.append(fixed(f"{s}_cover_handring_joint", f"{s}_ring1_link", f"{s}_cover_handring_link", f"0.009 {f * -0.015} -0.0008", f"{f * -0.7} 0 0"))
    parts.append(fixed(f"{s}_cover_handpinky_joint", f"{s}_pinky1_link", f"{s}_cover_handpinky_link", f"0.01 {f * -0.02025} -0.0071", f"{f * -0.7} 0 0"))

    return "\n".join(parts)


def strip_old_hands_and_legs(text: str) -> str:
    markers = [
        "  <!-- Right arm -->",
        "  <link name=\"r_shoulder_base_link\">",
    ]
    start = text.find(markers[0])
    end = text.find("</robot>")
    if start < 0 or end < 0:
        raise RuntimeError("Could not locate arm section in base URDF")
    return text[:start] + text[end:]


def arm_hand_block(side: str, flip: int, attach_link: str, attach_xyz: str, attach_rpy: str = "0 0 0") -> str:
    s = side
    lines = [
        f"  <!-- {side.upper()} arm + hand (official meshes) -->",
        f'  <joint name="{s}_wrist_roll_joint" type="revolute">',
        f'    <parent link="{s}_forearm_link"/><child link="{s}_hand_link"/>',
        f'    <origin xyz="{attach_xyz}" rpy="{attach_rpy}"/>',
        '    <axis xyz="0 0 1"/>',
        '    <limit lower="-1.57" upper="1.57" effort="1000" velocity="1"/>',
        "  </joint>",
        hand_side(s, flip),
    ]
    return "\n".join(lines)


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    cut = text.find("  <!-- Right arm -->")
    if cut < 0:
        raise RuntimeError("arm marker missing")
    head = text[:cut]

    right = """
  <!-- Right arm + hand -->
  <link name="r_shoulder_base_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/r_shoulder_base.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="frame"/>
    </visual>
  </link>
  <joint name="r_shoulder_out_joint" type="revolute">
    <parent link="torso_link"/><child link="r_shoulder_base_link"/>
    <origin xyz="0 -0.143 0.298" rpy="0 0 0"/>
    <axis xyz="1 0 0"/><limit lower="-1.047" upper="-0.087" effort="1000" velocity="1"/>
  </joint>
  <link name="r_shoulder_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/r_shoulder.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="frame"/>
    </visual>
  </link>
  <joint name="r_shoulder_lift_joint" type="revolute">
    <parent link="r_shoulder_base_link"/><child link="r_shoulder_link"/>
    <origin xyz="0 0.012 -0.04" rpy="0 0 0"/>
    <axis xyz="0 1 0"/><limit lower="-2.356" upper="0.785" effort="1000" velocity="1"/>
  </joint>
  <link name="r_bicep_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/bicep.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="frame"/>
    </visual>
  </link>
  <joint name="r_upper_arm_roll_joint" type="revolute">
    <parent link="r_shoulder_link"/><child link="r_bicep_link"/>
    <origin xyz="0 0.066 -0.060" rpy="0 0 0"/>
    <axis xyz="0 0 1"/><limit lower="-1.57" upper="1.57" effort="1000" velocity="1"/>
  </joint>
  <link name="r_bicepcover_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/bicepcover.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="cover"/>
    </visual>
  </link>
  <joint name="r_bicepcover_joint" type="fixed">
    <parent link="r_bicep_link"/><child link="r_bicepcover_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
  </joint>
  <link name="r_forearm_link">
    <visual>
      <origin xyz="0.001 0 0" rpy="0 0 0"/>
      <geometry><mesh filename="package://inmoov_meshes/meshes/r_forearm.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="cover"/>
    </visual>
  </link>
  <joint name="r_elbow_flex_joint" type="revolute">
    <parent link="r_bicep_link"/><child link="r_forearm_link"/>
    <origin xyz="-0.0278 0 -0.2235" rpy="0 0 0"/>
    <axis xyz="0 1 0"/><limit lower="-1.484" upper="-0.262" effort="1000" velocity="1"/>
  </joint>
"""
    right += arm_hand_block("r", 1, "r_forearm_link", "-0.0144 0.01 -0.2885")

    left = """
  <!-- Left arm + hand -->
  <link name="l_shoulder_base_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/l_shoulder_base.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="frame"/>
    </visual>
  </link>
  <joint name="l_shoulder_out_joint" type="revolute">
    <parent link="torso_link"/><child link="l_shoulder_base_link"/>
    <origin xyz="0 0.143 0.298" rpy="0 0 0"/>
    <axis xyz="1 0 0"/><limit lower="0.087" upper="1.047" effort="1000" velocity="1"/>
  </joint>
  <link name="l_shoulder_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/l_shoulder.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="frame"/>
    </visual>
  </link>
  <joint name="l_shoulder_lift_joint" type="revolute">
    <parent link="l_shoulder_base_link"/><child link="l_shoulder_link"/>
    <origin xyz="0 -0.012 -0.04" rpy="0 0 0"/>
    <axis xyz="0 1 0"/><limit lower="-2.356" upper="0.785" effort="1000" velocity="1"/>
  </joint>
  <link name="l_bicep_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/bicep.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="frame"/>
    </visual>
  </link>
  <joint name="l_upper_arm_roll_joint" type="revolute">
    <parent link="l_shoulder_link"/><child link="l_bicep_link"/>
    <origin xyz="0 -0.066 -0.060" rpy="0 0 0"/>
    <axis xyz="0 0 1"/><limit lower="-1.57" upper="1.57" effort="1000" velocity="1"/>
  </joint>
  <link name="l_bicepcover_link">
    <visual>
      <geometry><mesh filename="package://inmoov_meshes/meshes/bicepcover.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="cover"/>
    </visual>
  </link>
  <joint name="l_bicepcover_joint" type="fixed">
    <parent link="l_bicep_link"/><child link="l_bicepcover_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
  </joint>
  <link name="l_forearm_link">
    <visual>
      <origin xyz="-0.001 0 0" rpy="0 0 0"/>
      <geometry><mesh filename="package://inmoov_meshes/meshes/l_forearm.stl" scale="0.001 0.001 0.001"/></geometry>
      <material name="cover"/>
    </visual>
  </link>
  <joint name="l_elbow_flex_joint" type="revolute">
    <parent link="l_bicep_link"/><child link="l_forearm_link"/>
    <origin xyz="-0.0278 0 -0.2235" rpy="0 0 0"/>
    <axis xyz="0 1 0"/><limit lower="-1.484" upper="-0.262" effort="1000" velocity="1"/>
  </joint>
"""
    left += arm_hand_block("l", -1, "l_forearm_link", "-0.0144 -0.01 -0.2885")

    legs = """
  <!-- Legs (procedural — leg STLs not in inmoov_ros bundle) -->
  <link name="l_hip_link">
    <visual><origin xyz="0 0.09 -0.12" rpy="0 0 0"/><geometry><sphere radius="0.04"/></geometry><material name="frame"/></visual>
  </link>
  <joint name="l_hip_pan_joint" type="revolute">
    <parent link="mid_stomach_link"/><child link="l_hip_link"/>
    <origin xyz="0 0.09 1.02" rpy="0 0 0"/><axis xyz="0 0 1"/><limit lower="-0.8" upper="0.8" effort="1000" velocity="1"/>
  </joint>
  <link name="l_thigh_link">
    <visual><origin xyz="0 0 -0.18" rpy="0 0 0"/><geometry><cylinder length="0.36" radius="0.035"/></geometry><material name="frame"/></visual>
  </link>
  <joint name="l_hip_lift_joint" type="revolute">
    <parent link="l_hip_link"/><child link="l_thigh_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/><axis xyz="1 0 0"/><limit lower="-1.2" upper="1.2" effort="1000" velocity="1"/>
  </joint>
  <link name="l_shin_link">
    <visual><origin xyz="0 0 -0.16" rpy="0 0 0"/><geometry><cylinder length="0.32" radius="0.03"/></geometry><material name="cover"/></visual>
  </link>
  <joint name="l_knee_joint" type="revolute">
    <parent link="l_thigh_link"/><child link="l_shin_link"/>
    <origin xyz="0 0 -0.36" rpy="0 0 0"/><axis xyz="1 0 0"/><limit lower="0" upper="2.2" effort="1000" velocity="1"/>
  </joint>
  <link name="l_foot_link"/>
  <joint name="l_ankle_joint" type="revolute">
    <parent link="l_shin_link"/><child link="l_foot_link"/>
    <origin xyz="0 0 -0.32" rpy="0 0 0"/><axis xyz="1 0 0"/><limit lower="-0.8" upper="0.8" effort="1000" velocity="1"/>
  </joint>
  <link name="l_foot_roll_link">
    <visual><origin xyz="0.06 0 -0.04" rpy="0 0 0"/><geometry><box size="0.18 0.08 0.04"/></geometry><material name="base"/></visual>
  </link>
  <joint name="l_foot_roll_joint" type="revolute">
    <parent link="l_foot_link"/><child link="l_foot_roll_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/><axis xyz="0 0 1"/><limit lower="-0.5" upper="0.5" effort="1000" velocity="1"/>
  </joint>
  <link name="r_hip_link">
    <visual><origin xyz="0 -0.09 -0.12" rpy="0 0 0"/><geometry><sphere radius="0.04"/></geometry><material name="frame"/></visual>
  </link>
  <joint name="r_hip_pan_joint" type="revolute">
    <parent link="mid_stomach_link"/><child link="r_hip_link"/>
    <origin xyz="0 -0.09 1.02" rpy="0 0 0"/><axis xyz="0 0 1"/><limit lower="-0.8" upper="0.8" effort="1000" velocity="1"/>
  </joint>
  <link name="r_thigh_link">
    <visual><origin xyz="0 0 -0.18" rpy="0 0 0"/><geometry><cylinder length="0.36" radius="0.035"/></geometry><material name="frame"/></visual>
  </link>
  <joint name="r_hip_lift_joint" type="revolute">
    <parent link="r_hip_link"/><child link="r_thigh_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/><axis xyz="1 0 0"/><limit lower="-1.2" upper="1.2" effort="1000" velocity="1"/>
  </joint>
  <link name="r_shin_link">
    <visual><origin xyz="0 0 -0.16" rpy="0 0 0"/><geometry><cylinder length="0.32" radius="0.03"/></geometry><material name="cover"/></visual>
  </link>
  <joint name="r_knee_joint" type="revolute">
    <parent link="r_thigh_link"/><child link="r_shin_link"/>
    <origin xyz="0 0 -0.36" rpy="0 0 0"/><axis xyz="1 0 0"/><limit lower="0" upper="2.2" effort="1000" velocity="1"/>
  </joint>
  <link name="r_foot_link"/>
  <joint name="r_ankle_joint" type="revolute">
    <parent link="r_shin_link"/><child link="r_foot_link"/>
    <origin xyz="0 0 -0.32" rpy="0 0 0"/><axis xyz="1 0 0"/><limit lower="-0.8" upper="0.8" effort="1000" velocity="1"/>
  </joint>
  <link name="r_foot_roll_link">
    <visual><origin xyz="0.06 0 -0.04" rpy="0 0 0"/><geometry><box size="0.18 0.08 0.04"/></geometry><material name="base"/></visual>
  </link>
  <joint name="r_foot_roll_joint" type="revolute">
    <parent link="r_foot_link"/><child link="r_foot_roll_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/><axis xyz="0 0 1"/><limit lower="-0.5" upper="0.5" effort="1000" velocity="1"/>
  </joint>

</robot>
"""

    out_text = head + right + "\n" + left + legs
    OUT.write_text(out_text, encoding="utf-8")
    print(f"Wrote {OUT} ({len(out_text)} bytes)")


if __name__ == "__main__":
    main()