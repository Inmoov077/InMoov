import { SERVOS, servoByKey } from '@/lib/servoConfig';

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

function restFor(key: string): number {
  return servoByKey(key)?.rest ?? 90;
}

function pinFor(key: string): number {
  return servoByKey(key)?.pin ?? 0;
}

function limitsFor(key: string): { min: number; max: number } {
  const s = servoByKey(key);
  return { min: s?.min ?? 0, max: s?.max ?? 180 };
}

export const DEFAULT_ARM: ArmJoints = {
  shoulder: restFor('l_shoulder'),
  lift: restFor('l_lift'),
  rotate: restFor('l_rotate'),
  elbow: restFor('l_elbow'),
  wrist: restFor('l_wrist'),
};

export const DEFAULT_HAND: HandJoints = {
  thumb: restFor('l_thumb'),
  index: restFor('l_index'),
  middle: restFor('l_middle'),
  ring: restFor('l_ring'),
  pinky: restFor('l_pinky'),
};

export const DEFAULT_LEG: LegJoints = {
  hip: restFor('l_hip'),
  thigh: restFor('l_thigh'),
  knee: restFor('l_knee'),
  ankle: restFor('l_ankle'),
  foot: restFor('l_foot'),
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
    pin: { left: pinFor('l_shoulder'), right: pinFor('r_shoulder') },
    ...limitsFor('l_shoulder'),
    urdf: { left: 'l_shoulder_out_joint', right: 'r_shoulder_out_joint' },
  },
  {
    key: 'lift',
    label: 'Shoulder lift',
    hint: 'Raise / lower arm',
    pin: { left: pinFor('l_lift'), right: pinFor('r_lift') },
    ...limitsFor('l_lift'),
    urdf: { left: 'l_shoulder_lift_joint', right: 'r_shoulder_lift_joint' },
  },
  {
    key: 'rotate',
    label: 'Upper arm roll',
    hint: 'Rotate bicep',
    pin: { left: pinFor('l_rotate'), right: pinFor('r_rotate') },
    ...limitsFor('l_rotate'),
    urdf: { left: 'l_upper_arm_roll_joint', right: 'r_upper_arm_roll_joint' },
  },
  {
    key: 'elbow',
    label: 'Elbow',
    hint: 'Bend forearm',
    pin: { left: pinFor('l_elbow'), right: pinFor('r_elbow') },
    ...limitsFor('l_elbow'),
    urdf: { left: 'l_elbow_flex_joint', right: 'r_elbow_flex_joint' },
  },
  {
    key: 'wrist',
    label: 'Wrist roll',
    hint: 'Rotate hand',
    pin: { left: pinFor('l_wrist'), right: pinFor('r_wrist') },
    ...limitsFor('l_wrist'),
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
  { key: 'thumb', label: 'Thumb', hint: 'Opposable grip', pin: { left: pinFor('l_thumb'), right: pinFor('r_thumb') }, ...limitsFor('l_thumb'), urdf: { left: 'l_thumb_joint', right: 'r_thumb_joint' } },
  { key: 'index', label: 'Index', hint: 'Point finger', pin: { left: pinFor('l_index'), right: pinFor('r_index') }, ...limitsFor('l_index'), urdf: { left: 'l_index_joint', right: 'r_index_joint' } },
  { key: 'middle', label: 'Middle', hint: 'Center finger', pin: { left: pinFor('l_middle'), right: pinFor('r_middle') }, ...limitsFor('l_middle'), urdf: { left: 'l_middle_joint', right: 'r_middle_joint' } },
  { key: 'ring', label: 'Ring', hint: 'Ring finger', pin: { left: pinFor('l_ring'), right: pinFor('r_ring') }, ...limitsFor('l_ring'), urdf: { left: 'l_ring_joint', right: 'r_ring_joint' } },
  { key: 'pinky', label: 'Pinky', hint: 'Little finger', pin: { left: pinFor('l_pinky'), right: pinFor('r_pinky') }, ...limitsFor('l_pinky'), urdf: { left: 'l_pinky_joint', right: 'r_pinky_joint' } },
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
  { key: 'hip', label: 'Hip pan', hint: 'Swing leg sideways', pin: { left: pinFor('l_hip'), right: pinFor('r_hip') }, ...limitsFor('l_hip'), urdf: { left: 'l_hip_pan_joint', right: 'r_hip_pan_joint' } },
  { key: 'thigh', label: 'Hip lift', hint: 'Raise / lower thigh', pin: { left: pinFor('l_thigh'), right: pinFor('r_thigh') }, ...limitsFor('l_thigh'), urdf: { left: 'l_hip_lift_joint', right: 'r_hip_lift_joint' } },
  { key: 'knee', label: 'Knee', hint: 'Bend lower leg', pin: { left: pinFor('l_knee'), right: pinFor('r_knee') }, ...limitsFor('l_knee'), urdf: { left: 'l_knee_joint', right: 'r_knee_joint' } },
  { key: 'ankle', label: 'Ankle', hint: 'Tilt foot', pin: { left: pinFor('l_ankle'), right: pinFor('r_ankle') }, ...limitsFor('l_ankle'), urdf: { left: 'l_ankle_joint', right: 'r_ankle_joint' } },
  { key: 'foot', label: 'Foot roll', hint: 'Roll foot side-to-side', pin: { left: pinFor('l_foot'), right: pinFor('r_foot') }, ...limitsFor('l_foot'), urdf: { left: 'l_foot_roll_joint', right: 'r_foot_roll_joint' } },
];

export const ARM_PRESETS = {
  rest: DEFAULT_ARM,
  wave: { shoulder: 60, lift: 120, rotate: 90, elbow: 45, wrist: 90 },
  point: { shoulder: 90, lift: 100, rotate: 90, elbow: 160, wrist: 90 },
  reach: { shoulder: 45, lift: 80, rotate: 90, elbow: 30, wrist: 90 },
} as const;

export const HAND_PRESETS = {
  open: DEFAULT_HAND,
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
    rightHand: DEFAULT_HAND,
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

/** All 36 servos from canonical MRL-derived map */
export { SERVOS };