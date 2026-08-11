/**
 * Clear human-readable names for Studio (Left / Right, omoplate, elbow…).
 */

export const GROUP_LABELS: Record<string, string> = {
  head: 'Head',
  neck: 'Neck',
  leftArm: 'Left arm',
  rightArm: 'Right arm',
  leftHand: 'Left hand',
  rightHand: 'Right hand',
  leftLeg: 'Left leg',
  rightLeg: 'Right leg',
  arms: 'Arms',
  hands: 'Hands',
  legs: 'Legs',
  all: 'All',
};

/** Full professional display name */
export const SERVO_DISPLAY_NAMES: Record<string, string> = {
  head_neck: 'Head pitch',
  head_eye: 'Eyes',
  head_jaw: 'Jaw',
  neck_rot: 'Neck rotate',
  neck_tilt: 'Neck tilt',
  neck_roll: 'Neck roll',

  l_shoulder: 'Left shoulder',
  l_lift: 'Left omoplate',
  l_rotate: 'Left rotate',
  l_elbow: 'Left elbow',
  l_wrist: 'Left wrist',

  r_shoulder: 'Right shoulder',
  r_lift: 'Right omoplate',
  r_rotate: 'Right rotate',
  r_elbow: 'Right elbow',
  r_wrist: 'Right wrist',

  l_thumb: 'Left thumb',
  l_index: 'Left index finger',
  l_middle: 'Left middle finger',
  l_ring: 'Left ring finger',
  l_pinky: 'Left pinky',

  r_thumb: 'Right thumb',
  r_index: 'Right index finger',
  r_middle: 'Right middle finger',
  r_ring: 'Right ring finger',
  r_pinky: 'Right pinky',

  l_hip: 'Left hip',
  l_thigh: 'Left thigh',
  l_knee: 'Left knee',
  l_ankle: 'Left ankle',
  l_foot: 'Left foot',

  r_hip: 'Right hip',
  r_thigh: 'Right thigh',
  r_knee: 'Right knee',
  r_ankle: 'Right ankle',
  r_foot: 'Right foot',
};

/** Short joint word when side is shown separately */
export const JOINT_SHORT: Record<string, string> = {
  head_neck: 'Head pitch',
  head_eye: 'Eyes',
  head_jaw: 'Jaw',
  neck_rot: 'Rotate',
  neck_tilt: 'Tilt',
  neck_roll: 'Roll',
  l_shoulder: 'Shoulder',
  r_shoulder: 'Shoulder',
  l_lift: 'Omoplate',
  r_lift: 'Omoplate',
  l_rotate: 'Rotate',
  r_rotate: 'Rotate',
  l_elbow: 'Elbow',
  r_elbow: 'Elbow',
  l_wrist: 'Wrist',
  r_wrist: 'Wrist',
  l_thumb: 'Thumb',
  r_thumb: 'Thumb',
  l_index: 'Index',
  r_index: 'Index',
  l_middle: 'Middle',
  r_middle: 'Middle',
  l_ring: 'Ring',
  r_ring: 'Ring',
  l_pinky: 'Pinky',
  r_pinky: 'Pinky',
  l_hip: 'Hip',
  r_hip: 'Hip',
  l_thigh: 'Thigh',
  r_thigh: 'Thigh',
  l_knee: 'Knee',
  r_knee: 'Knee',
  l_ankle: 'Ankle',
  r_ankle: 'Ankle',
  l_foot: 'Foot',
  r_foot: 'Foot',
};

export function servoDisplayName(key: string, fallback?: string): string {
  return SERVO_DISPLAY_NAMES[key] || fallback || key.replace(/_/g, ' ');
}

export function groupDisplayName(group: string): string {
  return GROUP_LABELS[group] || group;
}

/** List label: "Left shoulder" style — full side word, not L/R */
export function servoShortName(key: string, fallback?: string): string {
  // Prefer full professional name with Left/Right
  if (SERVO_DISPLAY_NAMES[key]) return SERVO_DISPLAY_NAMES[key];
  if (JOINT_SHORT[key]) return JOINT_SHORT[key];
  return (fallback || key).replace(/_/g, ' ');
}

/** Side label for a servo key */
export function servoSideLabel(key: string): 'Left' | 'Right' | null {
  if (key.startsWith('l_')) return 'Left';
  if (key.startsWith('r_')) return 'Right';
  return null;
}
