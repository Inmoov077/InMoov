/**
 * Named motion presets — all arm angles stay inside hardware walls
 * (omoplate/lift typically ≤60°, elbow ≤80/90°). animateKeyframes also
 * re-clamps via sanitizeArm.
 */
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

export type PresetCategory = 'builtin' | 'action' | MrlPresetCategory;

export interface PresetMetaEntry {
  id: string;
  name: string;
  desc: string;
  /** lucide icon name key used by Moves page */
  icon: string;
  category: PresetCategory;
  featured?: boolean;
}

/** Safe rest pose used between moves */
const REST = {
  hneck: 85,
  eye: 90,
  jaw: 8,
  rot: 60,
  tilt: 50,
  roll: 120,
} as const;

const OPEN_HAND: Partial<HandJoints> = {
  thumb: 10,
  index: 10,
  middle: 10,
  ring: 10,
  pinky: 10,
};
const FIST: Partial<HandJoints> = {
  thumb: 120,
  index: 120,
  middle: 120,
  ring: 120,
  pinky: 120,
};
const POINT_HAND: Partial<HandJoints> = {
  thumb: 120,
  index: 10,
  middle: 120,
  ring: 120,
  pinky: 120,
};

/** Safe arm helpers — lift ≤55, elbow ≤75 (under hard max) */
const R_DOWN: Partial<ArmJoints> = { shoulder: 35, lift: 12, rotate: 90, elbow: 10, wrist: 90 };
const L_DOWN: Partial<ArmJoints> = { shoulder: 35, lift: 12, rotate: 90, elbow: 10, wrist: 90 };

/**
 * Moves page list — only these ~14 clean actions (not 150+ MRL dumps).
 * Order = display order.
 */
export const SHOWCASE_PRESET_META: PresetMetaEntry[] = [
  {
    id: 'hand-up',
    name: 'Hand up',
    desc: 'Raise right hand up',
    icon: 'ArrowUp',
    category: 'action',
    featured: true,
  },
  {
    id: 'hand-down',
    name: 'Hand down',
    desc: 'Lower arm to rest',
    icon: 'ArrowDown',
    category: 'action',
    featured: true,
  },
  {
    id: 'wave-arm',
    name: 'Wave hello',
    desc: 'Friendly wave',
    icon: 'HandMetal',
    category: 'action',
    featured: true,
  },
  {
    id: 'wave-high',
    name: 'Wave way up',
    desc: 'High wave — big hello',
    icon: 'Hand',
    category: 'action',
    featured: true,
  },
  {
    id: 'shake-hand',
    name: 'Shake hand',
    desc: 'Offer a handshake',
    icon: 'Handshake',
    category: 'action',
    featured: true,
  },
  {
    id: 'baby-hand',
    name: 'Baby hand',
    desc: 'Cute small finger wiggle',
    icon: 'Sparkles',
    category: 'action',
    featured: true,
  },
  {
    id: 'open-hand',
    name: 'Open hand',
    desc: 'Open fingers wide',
    icon: 'Hand',
    category: 'action',
    featured: true,
  },
  {
    id: 'fist',
    name: 'Fist',
    desc: 'Close hand into a fist',
    icon: 'Circle',
    category: 'action',
    featured: true,
  },
  {
    id: 'point',
    name: 'Point',
    desc: 'Point with index finger',
    icon: 'MousePointer',
    category: 'action',
    featured: true,
  },
  {
    id: 'present',
    name: 'Hello arms',
    desc: 'Open both arms — welcome',
    icon: 'Sparkles',
    category: 'action',
    featured: true,
  },
  {
    id: 'salute',
    name: 'Salute',
    desc: 'Right hand salute',
    icon: 'Medal',
    category: 'action',
    featured: true,
  },
  {
    id: 'clap',
    name: 'Clap',
    desc: 'Clap hands',
    icon: 'Hand',
    category: 'action',
    featured: true,
  },
  {
    id: 'nod',
    name: 'Nod yes',
    desc: 'Head yes',
    icon: 'ThumbsUp',
    category: 'action',
    featured: true,
  },
  {
    id: 'shake',
    name: 'Shake no',
    desc: 'Head no',
    icon: 'ThumbsDown',
    category: 'action',
    featured: true,
  },
  {
    id: 'wake-up',
    name: 'Wake up',
    desc: 'Full friendly wake sequence',
    icon: 'Sparkles',
    category: 'action',
    featured: true,
  },
];

/** @deprecated use SHOWCASE_PRESET_META — kept for older imports */
export const BUILTIN_PRESET_META: PresetMetaEntry[] = SHOWCASE_PRESET_META;

export const PRESETS: Record<string, PresetKeyframe[]> = {
  /**
   * Full-body wake sequence (all angles inside hard walls):
   * 1) Rest  2) Head + face look  3) Finger check both hands
   * 4) Show both hands to person  5) Small wave  6) Rest
   */
  'wake-up': [
    // 1. Power rest
    {
      ...REST,
      leftArm: L_DOWN,
      rightArm: R_DOWN,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 600,
    },
    // 2. Face / head look left-right + jaw open-close
    {
      ...REST,
      rot: 35,
      roll: 145,
      eye: 70,
      jaw: 8,
      leftArm: L_DOWN,
      rightArm: R_DOWN,
      hold: 700,
    },
    {
      ...REST,
      rot: 90,
      roll: 95,
      eye: 110,
      jaw: 22,
      hold: 700,
    },
    {
      ...REST,
      jaw: 8,
      eye: 90,
      hold: 500,
    },
    // 3. Finger check — open → fist → wiggle index (both hands)
    {
      ...REST,
      leftArm: { shoulder: 55, lift: 28, rotate: 90, elbow: 20, wrist: 90 },
      rightArm: { shoulder: 55, lift: 28, rotate: 90, elbow: 20, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 700,
    },
    {
      ...REST,
      leftArm: { shoulder: 55, lift: 30, rotate: 90, elbow: 22, wrist: 90 },
      rightArm: { shoulder: 55, lift: 30, rotate: 90, elbow: 22, wrist: 90 },
      leftHand: FIST,
      rightHand: FIST,
      hold: 600,
    },
    {
      ...REST,
      leftArm: { shoulder: 58, lift: 32, rotate: 90, elbow: 24, wrist: 90 },
      rightArm: { shoulder: 58, lift: 32, rotate: 90, elbow: 24, wrist: 90 },
      leftHand: POINT_HAND,
      rightHand: POINT_HAND,
      hold: 700,
    },
    {
      ...REST,
      leftArm: { shoulder: 58, lift: 32, rotate: 90, elbow: 24, wrist: 90 },
      rightArm: { shoulder: 58, lift: 32, rotate: 90, elbow: 24, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 500,
    },
    // 4. Show both hands to the person (in front of face / chest)
    {
      ...REST,
      tilt: 48,
      jaw: 10,
      leftArm: { shoulder: 75, lift: 42, rotate: 88, elbow: 35, wrist: 90 },
      rightArm: { shoulder: 75, lift: 42, rotate: 92, elbow: 35, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 1200,
    },
    {
      ...REST,
      hneck: 80,
      jaw: 16,
      tilt: 52,
      leftArm: { shoulder: 85, lift: 48, rotate: 90, elbow: 30, wrist: 90 },
      rightArm: { shoulder: 85, lift: 48, rotate: 90, elbow: 30, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 1000,
    },
    // 5. Friendly dual wave (safe lift ≤52°)
    {
      ...REST,
      jaw: 12,
      leftArm: { shoulder: 60, lift: 50, rotate: 90, elbow: 20, wrist: 100 },
      rightArm: { shoulder: 90, lift: 50, rotate: 90, elbow: 20, wrist: 80 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 550,
    },
    {
      ...REST,
      leftArm: { shoulder: 90, lift: 50, rotate: 90, elbow: 20, wrist: 80 },
      rightArm: { shoulder: 60, lift: 50, rotate: 90, elbow: 20, wrist: 100 },
      hold: 550,
    },
    {
      ...REST,
      leftArm: { shoulder: 60, lift: 50, rotate: 90, elbow: 20, wrist: 100 },
      rightArm: { shoulder: 90, lift: 50, rotate: 90, elbow: 20, wrist: 80 },
      hold: 550,
    },
    // 6. Present / welcome
    {
      ...REST,
      jaw: 12,
      tilt: 52,
      leftArm: { shoulder: 80, lift: 32, rotate: 85, elbow: 14, wrist: 90 },
      rightArm: { shoulder: 80, lift: 32, rotate: 95, elbow: 14, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 1400,
    },
    // 7. Soft rest
    {
      ...REST,
      leftArm: L_DOWN,
      rightArm: R_DOWN,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 900,
    },
  ],

  // ── Featured actions (safe limits) ──────────────────────────
  salute: [
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 500 },
    {
      ...REST,
      tilt: 48,
      rightArm: { shoulder: 100, lift: 48, rotate: 95, elbow: 55, wrist: 90 },
      rightHand: FIST,
      hold: 700,
    },
    {
      ...REST,
      hneck: 88,
      tilt: 45,
      rightArm: { shoulder: 130, lift: 52, rotate: 100, elbow: 62, wrist: 100 },
      rightHand: FIST,
      hold: 1800,
    },
    {
      ...REST,
      rightArm: { shoulder: 100, lift: 48, rotate: 95, elbow: 55, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 600,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 800 },
  ],

  victory: [
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, hold: 400 },
    {
      ...REST,
      jaw: 12,
      tilt: 55,
      leftArm: { shoulder: 95, lift: 50, rotate: 90, elbow: 15, wrist: 90 },
      rightArm: { shoulder: 95, lift: 50, rotate: 90, elbow: 15, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 900,
    },
    {
      ...REST,
      jaw: 18,
      tilt: 58,
      leftArm: { shoulder: 110, lift: 55, rotate: 90, elbow: 12, wrist: 90 },
      rightArm: { shoulder: 110, lift: 55, rotate: 90, elbow: 12, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 1600,
    },
    {
      ...REST,
      leftArm: { shoulder: 95, lift: 45, rotate: 90, elbow: 20, wrist: 90 },
      rightArm: { shoulder: 95, lift: 45, rotate: 90, elbow: 20, wrist: 90 },
      hold: 600,
    },
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, hold: 700 },
  ],

  flex: [
    { ...REST, rightArm: R_DOWN, hold: 400 },
    {
      ...REST,
      rightArm: { shoulder: 50, lift: 40, rotate: 100, elbow: 25, wrist: 90 },
      rightHand: FIST,
      hold: 700,
    },
    {
      ...REST,
      tilt: 52,
      rightArm: { shoulder: 55, lift: 48, rotate: 110, elbow: 70, wrist: 90 },
      rightHand: FIST,
      hold: 1800,
    },
    {
      ...REST,
      rightArm: { shoulder: 50, lift: 40, rotate: 100, elbow: 30, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 600,
    },
    { ...REST, rightArm: R_DOWN, hold: 700 },
  ],

  present: [
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, hold: 400 },
    {
      ...REST,
      jaw: 10,
      leftArm: { shoulder: 70, lift: 28, rotate: 90, elbow: 12, wrist: 90 },
      rightArm: { shoulder: 70, lift: 28, rotate: 90, elbow: 12, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 1000,
    },
    {
      ...REST,
      jaw: 12,
      tilt: 52,
      leftArm: { shoulder: 85, lift: 35, rotate: 85, elbow: 15, wrist: 90 },
      rightArm: { shoulder: 85, lift: 35, rotate: 95, elbow: 15, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 2000,
    },
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, hold: 800 },
  ],

  clap: [
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, hold: 400 },
    {
      ...REST,
      leftArm: { shoulder: 70, lift: 32, rotate: 90, elbow: 32, wrist: 90 },
      rightArm: { shoulder: 70, lift: 32, rotate: 90, elbow: 32, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 600,
    },
    {
      ...REST,
      leftArm: { shoulder: 80, lift: 36, rotate: 90, elbow: 42, wrist: 90 },
      rightArm: { shoulder: 80, lift: 36, rotate: 90, elbow: 42, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 350,
    },
    {
      ...REST,
      leftArm: { shoulder: 85, lift: 38, rotate: 90, elbow: 48, wrist: 90 },
      rightArm: { shoulder: 85, lift: 38, rotate: 90, elbow: 48, wrist: 90 },
      leftHand: FIST,
      rightHand: FIST,
      hold: 300,
    },
    {
      ...REST,
      leftArm: { shoulder: 80, lift: 36, rotate: 90, elbow: 42, wrist: 90 },
      rightArm: { shoulder: 80, lift: 36, rotate: 90, elbow: 42, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 350,
    },
    {
      ...REST,
      leftArm: { shoulder: 85, lift: 38, rotate: 90, elbow: 48, wrist: 90 },
      rightArm: { shoulder: 85, lift: 38, rotate: 90, elbow: 48, wrist: 90 },
      leftHand: FIST,
      rightHand: FIST,
      hold: 300,
    },
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, leftHand: OPEN_HAND, rightHand: OPEN_HAND, hold: 700 },
  ],

  heart: [
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, hold: 400 },
    {
      ...REST,
      tilt: 48,
      leftArm: { shoulder: 75, lift: 30, rotate: 90, elbow: 45, wrist: 90 },
      rightArm: { shoulder: 75, lift: 30, rotate: 90, elbow: 45, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 700,
    },
    {
      ...REST,
      hneck: 88,
      tilt: 45,
      jaw: 10,
      leftArm: { shoulder: 95, lift: 42, rotate: 90, elbow: 58, wrist: 90 },
      rightArm: { shoulder: 95, lift: 42, rotate: 90, elbow: 58, wrist: 90 },
      leftHand: { thumb: 80, index: 40, middle: 40, ring: 40, pinky: 40 },
      rightHand: { thumb: 80, index: 40, middle: 40, ring: 40, pinky: 40 },
      hold: 2000,
    },
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, leftHand: OPEN_HAND, rightHand: OPEN_HAND, hold: 800 },
  ],

  // ── Classic head / body (safe) ──────────────────────────────
  nod: [
    { ...REST, tilt: 70, hold: 700 },
    { ...REST, tilt: 30, hold: 700 },
    { ...REST, tilt: 65, hold: 500 },
    { ...REST, tilt: 35, hold: 500 },
    { ...REST, hold: 600 },
  ],
  shake: [
    { ...REST, rot: 35, roll: 145, eye: 75, hold: 600 },
    { ...REST, rot: 90, roll: 90, eye: 105, hold: 600 },
    { ...REST, rot: 35, roll: 145, eye: 75, hold: 500 },
    { ...REST, hold: 700 },
  ],
  'tilt-side': [
    { ...REST, rot: 40, roll: 145, hold: 900 },
    { ...REST, rot: 85, roll: 95, hold: 900 },
    { ...REST, hold: 700 },
  ],
  'look-around': [
    { ...REST, hold: 500 },
    { ...REST, rot: 30, tilt: 58, roll: 145, eye: 70, hold: 1200 },
    { ...REST, rot: 95, tilt: 58, roll: 95, eye: 110, hold: 1200 },
    { ...REST, hold: 800 },
  ],
  bow: [
    { ...REST, hold: 500 },
    { ...REST, tilt: 22, jaw: 6, hold: 1800 },
    { ...REST, hold: 800 },
  ],
  'wave-head': [
    { ...REST, hold: 400 },
    { ...REST, hneck: 78, eye: 75, jaw: 12, rot: 40, tilt: 58, roll: 140, hold: 900 },
    { ...REST, hneck: 95, eye: 105, jaw: 12, rot: 85, tilt: 40, roll: 100, hold: 900 },
    { ...REST, hold: 700 },
  ],
  'happy-greet': [
    { ...REST, hold: 300 },
    { ...REST, hneck: 80, jaw: 28, tilt: 58, hold: 500 },
    { ...REST, jaw: 8, hold: 300 },
    { ...REST, jaw: 22, tilt: 55, hold: 400 },
    { ...REST, hold: 700 },
  ],
  'scan-room': [
    { ...REST, tilt: 55, hold: 500 },
    { ...REST, rot: 25, tilt: 55, roll: 150, eye: 70, hold: 1400 },
    { ...REST, rot: 100, tilt: 55, roll: 90, eye: 110, hold: 1400 },
    { ...REST, hold: 800 },
  ],
  'idle-breathe': [
    { ...REST, hold: 1200 },
    { ...REST, hneck: 87, eye: 88, tilt: 53, hold: 1800 },
    { ...REST, hold: 1200 },
  ],
  /** Wave — lift max 52° (under 60/65 wall) */
  'wave-arm': [
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 500 },
    {
      ...REST,
      jaw: 12,
      rightArm: { shoulder: 70, lift: 48, rotate: 90, elbow: 25, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 700,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 52, rotate: 90, elbow: 22, wrist: 100 },
      hold: 500,
    },
    {
      ...REST,
      rightArm: { shoulder: 90, lift: 52, rotate: 90, elbow: 22, wrist: 80 },
      hold: 500,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 52, rotate: 90, elbow: 22, wrist: 100 },
      hold: 500,
    },
    {
      ...REST,
      rightArm: { shoulder: 90, lift: 52, rotate: 90, elbow: 22, wrist: 80 },
      hold: 500,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 800 },
  ],
  handshake: [
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 400 },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 35, rotate: 90, elbow: 35, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 700,
    },
    {
      ...REST,
      rightArm: { shoulder: 50, lift: 40, rotate: 90, elbow: 45, wrist: 90 },
      rightHand: POINT_HAND,
      hold: 1600,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 800 },
  ],

  // ── Showcase hand / arm moves (safe walls) ─────────────────
  'hand-up': [
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 400 },
    {
      ...REST,
      jaw: 10,
      rightArm: { shoulder: 70, lift: 40, rotate: 90, elbow: 18, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 600,
    },
    {
      ...REST,
      rightArm: { shoulder: 95, lift: 52, rotate: 90, elbow: 14, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 1600,
    },
    {
      ...REST,
      rightArm: { shoulder: 95, lift: 52, rotate: 90, elbow: 14, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 500,
    },
  ],
  'hand-down': [
    {
      ...REST,
      rightArm: { shoulder: 90, lift: 48, rotate: 90, elbow: 16, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 500,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 28, rotate: 90, elbow: 14, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 700,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, leftArm: L_DOWN, hold: 900 },
  ],
  'wave-high': [
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 400 },
    {
      ...REST,
      jaw: 12,
      rightArm: { shoulder: 85, lift: 55, rotate: 90, elbow: 18, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 600,
    },
    {
      ...REST,
      rightArm: { shoulder: 70, lift: 55, rotate: 90, elbow: 18, wrist: 105 },
      hold: 450,
    },
    {
      ...REST,
      rightArm: { shoulder: 100, lift: 55, rotate: 90, elbow: 18, wrist: 75 },
      hold: 450,
    },
    {
      ...REST,
      rightArm: { shoulder: 70, lift: 55, rotate: 90, elbow: 18, wrist: 105 },
      hold: 450,
    },
    {
      ...REST,
      rightArm: { shoulder: 100, lift: 55, rotate: 90, elbow: 18, wrist: 75 },
      hold: 450,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 800 },
  ],
  'shake-hand': [
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 400 },
    {
      ...REST,
      tilt: 48,
      rightArm: { shoulder: 60, lift: 32, rotate: 90, elbow: 30, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 700,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 38, rotate: 90, elbow: 42, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 500,
    },
    // pump handshake
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 36, rotate: 90, elbow: 48, wrist: 90 },
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 40, rotate: 90, elbow: 36, wrist: 90 },
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 36, rotate: 90, elbow: 48, wrist: 90 },
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 40, rotate: 90, elbow: 36, wrist: 90 },
      hold: 400,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 800 },
  ],
  'baby-hand': [
    // Arm slightly forward, cute finger open/close
    {
      ...REST,
      jaw: 14,
      tilt: 55,
      rightArm: { shoulder: 55, lift: 30, rotate: 90, elbow: 28, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 600,
    },
    {
      ...REST,
      jaw: 18,
      rightArm: { shoulder: 55, lift: 32, rotate: 90, elbow: 30, wrist: 90 },
      rightHand: {
        thumb: 40,
        index: 35,
        middle: 40,
        ring: 45,
        pinky: 50,
      },
      hold: 450,
    },
    {
      ...REST,
      jaw: 12,
      rightArm: { shoulder: 55, lift: 32, rotate: 90, elbow: 30, wrist: 95 },
      rightHand: OPEN_HAND,
      hold: 400,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 32, rotate: 90, elbow: 30, wrist: 85 },
      rightHand: {
        thumb: 50,
        index: 50,
        middle: 55,
        ring: 60,
        pinky: 65,
      },
      hold: 400,
    },
    {
      ...REST,
      jaw: 16,
      rightArm: { shoulder: 55, lift: 32, rotate: 90, elbow: 30, wrist: 95 },
      rightHand: OPEN_HAND,
      hold: 500,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 32, rotate: 90, elbow: 30, wrist: 90 },
      rightHand: {
        thumb: 35,
        index: 30,
        middle: 35,
        ring: 40,
        pinky: 45,
      },
      hold: 500,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 700 },
  ],
  'open-hand': [
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 28, rotate: 90, elbow: 22, wrist: 90 },
      rightHand: FIST,
      hold: 500,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 30, rotate: 90, elbow: 24, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 1200,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 600 },
  ],
  fist: [
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 28, rotate: 90, elbow: 22, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 500,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 30, rotate: 90, elbow: 24, wrist: 90 },
      rightHand: FIST,
      hold: 1200,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 600 },
  ],
  point: [
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 28, rotate: 90, elbow: 22, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 400,
    },
    {
      ...REST,
      rightArm: { shoulder: 70, lift: 38, rotate: 90, elbow: 28, wrist: 90 },
      rightHand: POINT_HAND,
      hold: 1600,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 700 },
  ],
  'gallery-real': [
    {
      ...REST,
      hneck: 82,
      eye: 88,
      leftArm: { shoulder: 50, lift: 35, rotate: 88, elbow: 20, wrist: 92 },
      rightArm: { shoulder: 100, lift: 35, rotate: 92, elbow: 20, wrist: 88 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 2800,
    },
  ],
  'leg-step': [
    {
      ...REST,
      leftLeg: { hip: 90, thigh: 90, knee: 15, ankle: 90, foot: 90 },
      rightLeg: { hip: 90, thigh: 90, knee: 15, ankle: 90, foot: 90 },
      hold: 600,
    },
    {
      ...REST,
      leftLeg: { hip: 80, thigh: 105, knee: 55, ankle: 85, foot: 90 },
      rightLeg: { hip: 90, thigh: 90, knee: 15, ankle: 90, foot: 90 },
      hold: 900,
    },
    {
      ...REST,
      leftLeg: { hip: 90, thigh: 90, knee: 15, ankle: 90, foot: 90 },
      rightLeg: { hip: 100, thigh: 105, knee: 55, ankle: 85, foot: 90 },
      hold: 900,
    },
    {
      ...REST,
      leftLeg: { hip: 90, thigh: 90, knee: 15, ankle: 90, foot: 90 },
      rightLeg: { hip: 90, thigh: 90, knee: 15, ankle: 90, foot: 90 },
      hold: 700,
    },
  ],
  'circle-roll': [
    { ...REST, hold: 400 },
    { ...REST, tilt: 62, hold: 700 },
    { ...REST, rot: 40, tilt: 55, roll: 140, hold: 700 },
    { ...REST, rot: 40, tilt: 40, roll: 140, hold: 700 },
    { ...REST, rot: 80, tilt: 40, roll: 100, hold: 700 },
    { ...REST, rot: 80, tilt: 55, roll: 100, hold: 700 },
    { ...REST, hold: 700 },
  ],
  'diagonal-look': [
    { ...REST, hold: 400 },
    { ...REST, rot: 30, tilt: 60, roll: 145, eye: 70, hold: 1000 },
    { ...REST, rot: 95, tilt: 38, roll: 95, eye: 110, hold: 1000 },
    { ...REST, rot: 95, tilt: 60, roll: 95, eye: 110, hold: 1000 },
    { ...REST, rot: 30, tilt: 38, roll: 145, eye: 70, hold: 1000 },
    { ...REST, hold: 700 },
  ],
  'curious-tilt': [
    { ...REST, hold: 400 },
    { ...REST, hneck: 82, eye: 105, rot: 80, tilt: 62, roll: 100, hold: 1400 },
    { ...REST, hneck: 82, eye: 75, rot: 40, tilt: 62, roll: 140, hold: 1400 },
    { ...REST, hold: 700 },
  ],
  // Keep MRL library available for internal / future use — not listed on Moves page
  ...MRL_PRESETS,
};

/** Moves page — curated list only (10–15 actions). */
export const PRESET_META: PresetMetaEntry[] = SHOWCASE_PRESET_META;

/** Full library meta (MRL + showcase) if needed elsewhere */
export const FULL_PRESET_META: PresetMetaEntry[] = [
  ...SHOWCASE_PRESET_META,
  ...MRL_PRESET_META.map((m) => ({
    id: m.id,
    name: m.name,
    desc: m.desc,
    icon: m.icon || 'Sparkles',
    category: m.category as PresetCategory,
  })),
];
