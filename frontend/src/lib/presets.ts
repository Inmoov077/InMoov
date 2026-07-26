/** Named motion presets. Prefer gentle nods after presence wake greets. */
import type { ArmJoints, HandJoints, LegJoints } from '@/lib/bodyConfig';
import { MRL_PRESETS, MRL_PRESET_META, type MrlPresetCategory } from '@/lib/mrlPresets';

export interface PresetKeyframe {
  hneck: number;
  eye: number;
  jaw: number;
  rot: number;
  tilt: number;
  roll: number;
  hold: number;
  rightArm?: Partial<ArmJoints>;
  leftArm?: Partial<ArmJoints>;
  rightHand?: Partial<HandJoints>;
  leftHand?: Partial<HandJoints>;
  rightLeg?: Partial<LegJoints>;
  leftLeg?: Partial<LegJoints>;
}

export type PresetCategory = 'builtin' | MrlPresetCategory;

export interface PresetMetaEntry {
  id: string;
  name: string;
  desc: string;
  icon: string;
  category: PresetCategory;
}

export const BUILTIN_PRESET_META: PresetMetaEntry[] = [
  { id: 'nod', name: 'Nod Yes', desc: 'Tilt up and down', icon: 'â†•', category: 'builtin' },
  { id: 'shake', name: 'Shake No', desc: 'Rotate left and right', icon: 'â†”', category: 'builtin' },
  { id: 'tilt-side', name: 'Think / Tilt', desc: 'Side roll motion', icon: 'â†©', category: 'builtin' },
  { id: 'look-around', name: 'Look Around', desc: 'Scan the environment', icon: 'â—Ž', category: 'builtin' },
  { id: 'bow', name: 'Bow', desc: 'Polite greeting bow', icon: 'âŒ„', category: 'builtin' },
  { id: 'wave-head', name: 'Robot Dance', desc: 'Multi-axis pattern', icon: 'âœ¦', category: 'builtin' },
  { id: 'happy-greet', name: 'Happy Greet', desc: 'Jaw + eye animation', icon: 'â˜º', category: 'builtin' },
  { id: 'scan-room', name: 'Scan Room', desc: 'Full pan sweep', icon: 'âŒ–', category: 'builtin' },
  { id: 'idle-breathe', name: 'Idle Breathe', desc: 'Subtle life motion', icon: 'âˆ¿', category: 'builtin' },
  { id: 'gallery-real', name: 'Gallery Pose', desc: 'Like real InMoov photo', icon: 'ðŸ“·', category: 'builtin' },
  { id: 'wave-arm', name: 'Wave Arm', desc: 'Right arm greeting wave', icon: 'ðŸ‘‹', category: 'builtin' },
  { id: 'handshake', name: 'Handshake', desc: 'Extend hand to greet', icon: 'ðŸ¤', category: 'builtin' },
  { id: 'leg-step', name: 'Leg Step', desc: 'Alternating walk motion', icon: 'ðŸ¦µ', category: 'builtin' },
  { id: 'circle-roll', name: 'Neck Circle', desc: 'Circular rolling motion', icon: 'ðŸŒ€', category: 'builtin' },
  { id: 'diagonal-look', name: 'Diagonal Look', desc: 'Corner scan pattern', icon: 'â¤„', category: 'builtin' },
  { id: 'curious-tilt', name: 'Curious Tilt', desc: 'Inquisitive head tilt', icon: 'ðŸ¤”', category: 'builtin' },
];

/** Built-in + MyRobotLab 1.1.1610 official gestures */
export const PRESETS: Record<string, PresetKeyframe[]> = {
  nod: [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 80, roll: 120, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 20, roll: 120, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
  ],
  shake: [
    { hneck: 90, eye: 60, jaw: 0, rot: 10, tilt: 50, roll: 170, hold: 1500 },
    { hneck: 90, eye: 120, jaw: 0, rot: 110, tilt: 50, roll: 70, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
  ],
  'tilt-side': [
    { hneck: 90, eye: 90, jaw: 0, rot: 10, tilt: 50, roll: 170, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 110, tilt: 50, roll: 70, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'look-around': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 90, eye: 60, jaw: 0, rot: 20, tilt: 70, roll: 160, hold: 2000 },
    { hneck: 90, eye: 120, jaw: 0, rot: 100, tilt: 70, roll: 80, hold: 2000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  bow: [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 90, eye: 90, jaw: 10, rot: 60, tilt: 15, roll: 120, hold: 2500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'wave-head': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 80, eye: 60, jaw: 20, rot: 20, tilt: 70, roll: 160, hold: 2000 },
    { hneck: 100, eye: 120, jaw: 20, rot: 100, tilt: 30, roll: 80, hold: 2000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'happy-greet': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 500 },
    { hneck: 80, eye: 90, jaw: 40, rot: 60, tilt: 70, roll: 120, hold: 600 },
    { hneck: 90, eye: 90, jaw: 5, rot: 60, tilt: 50, roll: 120, hold: 400 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
  ],
  'scan-room': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 70, roll: 120, hold: 1000 },
    { hneck: 90, eye: 60, jaw: 0, rot: 10, tilt: 70, roll: 170, hold: 2500 },
    { hneck: 90, eye: 120, jaw: 0, rot: 110, tilt: 70, roll: 70, hold: 2500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'idle-breathe': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 2000 },
    { hneck: 88, eye: 88, jaw: 0, rot: 60, tilt: 55, roll: 120, hold: 3000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 2000 },
  ],
  'wave-arm': [
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, rightArm: { shoulder: 90, lift: 45, rotate: 90, elbow: 90, wrist: 90 }, hold: 800 },
    { hneck: 85, eye: 90, jaw: 15, rot: 60, tilt: 50, roll: 120, rightArm: { shoulder: 60, lift: 130, rotate: 90, elbow: 40, wrist: 90 }, hold: 1200 },
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, rightArm: { shoulder: 120, lift: 130, rotate: 90, elbow: 40, wrist: 90 }, hold: 1200 },
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, rightArm: { shoulder: 90, lift: 45, rotate: 90, elbow: 90, wrist: 90 }, hold: 1000 },
  ],
  handshake: [
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, rightArm: { shoulder: 90, lift: 45, elbow: 90 }, hold: 600 },
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, rightArm: { shoulder: 45, lift: 100, elbow: 120, wrist: 90 }, rightHand: { thumb: 120, index: 10, middle: 170, ring: 170, pinky: 170 }, hold: 2000 },
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, rightArm: { shoulder: 90, lift: 45, elbow: 90 }, rightHand: { thumb: 10, index: 10, middle: 10, ring: 10, pinky: 10 }, hold: 1000 },
  ],
  'gallery-real': [
    { hneck: 82, eye: 88, jaw: 8, rot: 58, tilt: 48, roll: 118, leftArm: { shoulder: 55, lift: 95, rotate: 88, elbow: 35, wrist: 92 }, rightArm: { shoulder: 125, lift: 95, rotate: 92, elbow: 35, wrist: 88 }, leftHand: { thumb: 15, index: 12, middle: 12, ring: 12, pinky: 12 }, rightHand: { thumb: 15, index: 12, middle: 12, ring: 12, pinky: 12 }, hold: 3000 },
  ],
  'leg-step': [
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, leftLeg: { hip: 90, thigh: 90, knee: 10, ankle: 90, foot: 90 }, rightLeg: { hip: 90, thigh: 90, knee: 10, ankle: 90, foot: 90 }, hold: 800 },
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, leftLeg: { hip: 75, thigh: 110, knee: 70, ankle: 80 }, hold: 1200 },
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, leftLeg: { hip: 90, thigh: 90, knee: 10, ankle: 90 }, rightLeg: { hip: 105, thigh: 110, knee: 70, ankle: 80 }, hold: 1200 },
    { hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, leftLeg: { hip: 90, thigh: 90, knee: 10, ankle: 90, foot: 90 }, rightLeg: { hip: 90, thigh: 90, knee: 10, ankle: 90, foot: 90 }, hold: 1000 },
  ],
  'circle-roll': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 75, roll: 120, hold: 1500 },
    { hneck: 90, eye: 75, jaw: 0, rot: 35, tilt: 65, roll: 145, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 20, tilt: 50, roll: 160, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 35, tilt: 25, roll: 145, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 25, roll: 120, hold: 1500 },
    { hneck: 90, eye: 105, jaw: 0, rot: 85, tilt: 25, roll: 95, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 100, tilt: 50, roll: 80, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'diagonal-look': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 90, eye: 60, jaw: 0, rot: 20, tilt: 70, roll: 160, hold: 2000 },
    { hneck: 90, eye: 120, jaw: 0, rot: 100, tilt: 30, roll: 80, hold: 2000 },
    { hneck: 90, eye: 120, jaw: 0, rot: 100, tilt: 70, roll: 80, hold: 2000 },
    { hneck: 90, eye: 60, jaw: 0, rot: 20, tilt: 30, roll: 160, hold: 2000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'curious-tilt': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 80, eye: 120, jaw: 0, rot: 90, tilt: 75, roll: 90, hold: 2500 },
    { hneck: 80, eye: 60, jaw: 0, rot: 30, tilt: 75, roll: 150, hold: 2500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  ...MRL_PRESETS,
};

export const PRESET_META: PresetMetaEntry[] = [
  ...BUILTIN_PRESET_META,
  ...MRL_PRESET_META.map((m) => ({
    id: m.id,
    name: m.name,
    desc: m.desc,
    icon: m.icon,
    category: m.category as PresetCategory,
  })),
];
