export type BodySide = 'left' | 'right';

export interface ArmJoints {
  shoulder: number;
  lift: number;
  rotate: number;
  elbow: number;
  wrist: number;
}

export interface HandJoints {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export interface LegJoints {
  hip: number;
  thigh: number;
  knee: number;
  ankle: number;
  foot: number;
}

export const DEFAULT_ARM: ArmJoints = {
  shoulder: 90,
  lift: 45,
  rotate: 90,
  elbow: 90,
  wrist: 90,
};

export const DEFAULT_HAND: HandJoints = {
  thumb: 10,
  index: 10,
  middle: 10,
  ring: 10,
  pinky: 10,
};

export const DEFAULT_LEG: LegJoints = {
  hip: 90,
  thigh: 90,
  knee: 10,
  ankle: 90,
  foot: 90,
};

export const ARM_JOINT_META: {
  key: keyof ArmJoints;
  label: string;
  hint: string;
  pin: { left: number; right: number };
  min?: number;
  max?: number;
  urdf: { left: string; right: string };
}[] = [
  {
    key: 'shoulder',
    label: 'Shoulder pan',
    hint: 'Swing arm forward / back',
    pin: { left: 9, right: 15 },
    urdf: { left: 'l_shoulder_out_joint', right: 'r_shoulder_out_joint' },
  },
  {
    key: 'lift',
    label: 'Shoulder lift',
    hint: 'Raise / lower arm',
    pin: { left: 10, right: 16 },
    urdf: { left: 'l_shoulder_lift_joint', right: 'r_shoulder_lift_joint' },
  },
  {
    key: 'rotate',
    label: 'Upper arm roll',
    hint: 'Rotate bicep',
    pin: { left: 11, right: 17 },
    urdf: { left: 'l_upper_arm_roll_joint', right: 'r_upper_arm_roll_joint' },
  },
  {
    key: 'elbow',
    label: 'Elbow',
    hint: 'Bend forearm',
    pin: { left: 12, right: 18 },
    urdf: { left: 'l_elbow_flex_joint', right: 'r_elbow_flex_joint' },
  },
  {
    key: 'wrist',
    label: 'Wrist roll',
    hint: 'Rotate hand',
    pin: { left: 13, right: 19 },
    urdf: { left: 'l_wrist_roll_joint', right: 'r_wrist_roll_joint' },
  },
];

export const HAND_JOINT_META: {
  key: keyof HandJoints;
  label: string;
  hint: string;
  pin: { left: number; right: number };
  min: number;
  max: number;
  urdf: { left: string; right: string };
}[] = [
  { key: 'thumb', label: 'Thumb', hint: 'Opposable grip', pin: { left: 21, right: 26 }, min: 0, max: 180, urdf: { left: 'l_thumb_joint', right: 'r_thumb_joint' } },
  { key: 'index', label: 'Index', hint: 'Point finger', pin: { left: 22, right: 27 }, min: 0, max: 180, urdf: { left: 'l_index_joint', right: 'r_index_joint' } },
  { key: 'middle', label: 'Middle', hint: 'Center finger', pin: { left: 23, right: 28 }, min: 0, max: 180, urdf: { left: 'l_middle_joint', right: 'r_middle_joint' } },
  { key: 'ring', label: 'Ring', hint: 'Ring finger', pin: { left: 24, right: 29 }, min: 0, max: 180, urdf: { left: 'l_ring_joint', right: 'r_ring_joint' } },
  { key: 'pinky', label: 'Pinky', hint: 'Little finger', pin: { left: 25, right: 30 }, min: 0, max: 180, urdf: { left: 'l_pinky_joint', right: 'r_pinky_joint' } },
];

export const LEG_JOINT_META: {
  key: keyof LegJoints;
  label: string;
  hint: string;
  pin: { left: number; right: number };
  min?: number;
  max?: number;
  urdf: { left: string; right: string };
}[] = [
  { key: 'hip', label: 'Hip pan', hint: 'Swing leg sideways', pin: { left: 31, right: 36 }, urdf: { left: 'l_hip_pan_joint', right: 'r_hip_pan_joint' } },
  { key: 'thigh', label: 'Hip lift', hint: 'Raise / lower thigh', pin: { left: 32, right: 37 }, urdf: { left: 'l_hip_lift_joint', right: 'r_hip_lift_joint' } },
  { key: 'knee', label: 'Knee', hint: 'Bend lower leg', pin: { left: 33, right: 38 }, min: 0, max: 160, urdf: { left: 'l_knee_joint', right: 'r_knee_joint' } },
  { key: 'ankle', label: 'Ankle', hint: 'Tilt foot', pin: { left: 34, right: 39 }, urdf: { left: 'l_ankle_joint', right: 'r_ankle_joint' } },
  { key: 'foot', label: 'Foot roll', hint: 'Roll foot side-to-side', pin: { left: 35, right: 40 }, urdf: { left: 'l_foot_roll_joint', right: 'r_foot_roll_joint' } },
];

export const ARM_PRESETS = {
  rest: DEFAULT_ARM,
  wave: { shoulder: 60, lift: 120, rotate: 90, elbow: 45, wrist: 90 },
  point: { shoulder: 90, lift: 100, rotate: 90, elbow: 160, wrist: 90 },
  reach: { shoulder: 45, lift: 80, rotate: 90, elbow: 30, wrist: 90 },
} as const;

export const HAND_PRESETS = {
  open: { thumb: 10, index: 10, middle: 10, ring: 10, pinky: 10 },
  fist: { thumb: 160, index: 170, middle: 170, ring: 170, pinky: 170 },
  point: { thumb: 160, index: 10, middle: 170, ring: 170, pinky: 170 },
  peace: { thumb: 160, index: 10, middle: 10, ring: 170, pinky: 170 },
} as const;

export const LEG_PRESETS = {
  stand: DEFAULT_LEG,
  step: { hip: 75, thigh: 110, knee: 70, ankle: 80, foot: 90 },
  squat: { hip: 90, thigh: 130, knee: 130, ankle: 70, foot: 90 },
  kick: { hip: 60, thigh: 100, knee: 20, ankle: 100, foot: 90 },
  walk: { hip: 80, thigh: 105, knee: 55, ankle: 85, foot: 85 },
  lunge: { hip: 70, thigh: 120, knee: 95, ankle: 75, foot: 90 },
} as const;

/** Full-body gallery poses for 3D preview */
export const FULL_BODY_POSES = {
  neutral: {
    leftArm: DEFAULT_ARM,
    rightArm: DEFAULT_ARM,
    leftHand: DEFAULT_HAND,
    rightHand: DEFAULT_HAND,
    leftLeg: DEFAULT_LEG,
    rightLeg: DEFAULT_LEG,
  },
  tPose: {
    leftArm: { shoulder: 90, lift: 100, rotate: 90, elbow: 90, wrist: 90 },
    rightArm: { shoulder: 90, lift: 100, rotate: 90, elbow: 90, wrist: 90 },
    leftHand: DEFAULT_HAND,
    rightHand: DEFAULT_HAND,
    leftLeg: DEFAULT_LEG,
    rightLeg: DEFAULT_LEG,
  },
  wave: {
    leftArm: DEFAULT_ARM,
    rightArm: { shoulder: 60, lift: 120, rotate: 90, elbow: 45, wrist: 90 },
    leftHand: DEFAULT_HAND,
    rightHand: { thumb: 10, index: 10, middle: 10, ring: 10, pinky: 10 },
    leftLeg: DEFAULT_LEG,
    rightLeg: DEFAULT_LEG,
  },
  squat: {
    leftArm: { shoulder: 90, lift: 55, rotate: 90, elbow: 110, wrist: 90 },
    rightArm: { shoulder: 90, lift: 55, rotate: 90, elbow: 110, wrist: 90 },
    leftHand: DEFAULT_HAND,
    rightHand: DEFAULT_HAND,
    leftLeg: LEG_PRESETS.squat,
    rightLeg: LEG_PRESETS.squat,
  },
} as const;