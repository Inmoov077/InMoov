/**
 * Named motion presets — all arm angles stay inside hardware walls
 * (omoplate/lift typically ≤60°, elbow ≤80/90°). animateKeyframes also
 * re-clamps via sanitizeArm.
 */
import type { ArmJoints, HandJoints, LegJoints } from '@/lib/bodyConfig';
import { MRL_PRESETS, MRL_PRESET_META, type MrlPresetCategory } from '@/lib/mrlPresets';
import { getRestArm, getRestHand, REST_HEAD } from '@/lib/restPose';

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

/** Safe rest pose used between moves — exact config rests */
const REST = { ...REST_HEAD } as const;

/** Fully open hand at config rest (not “almost open”) */
const OPEN_HAND: Partial<HandJoints> = { ...getRestHand() };

/**
 * Indian Army salute hand — palm open, fingers & thumb together (not a fist).
 * Servo °: open≈10 … closed≈120
 */
const SALUTE_HAND: Partial<HandJoints> = {
  thumb: 32,
  index: 12,
  middle: 12,
  ring: 14,
  pinky: 14,
};
/** Hand forming while arm is still rising */
const SALUTE_HAND_MID: Partial<HandJoints> = {
  thumb: 22,
  index: 12,
  middle: 14,
  ring: 16,
  pinky: 16,
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

/**
 * True arm rest (config rest via getSafeArmRest) — never “almost rest”.
 * Hard walls: r_shoulder 30–180 · r_lift 10–70 · r_elbow 10–80 …
 */
const R_DOWN: Partial<ArmJoints> = { ...getRestArm('right') };
const L_DOWN: Partial<ArmJoints> = { ...getRestArm('left') };

/** Raised right arm — clearly “hand up” in 3D */
const R_UP: Partial<ArmJoints> = { shoulder: 105, lift: 58, rotate: 95, elbow: 16, wrist: 90 };
/** Wave base (arm out, ready to twist) */
const R_WAVE_BASE: Partial<ArmJoints> = { shoulder: 80, lift: 55, rotate: 90, elbow: 28, wrist: 90 };
const R_WAVE_L: Partial<ArmJoints> = { shoulder: 80, lift: 55, rotate: 52, elbow: 28, wrist: 132 };
const R_WAVE_R: Partial<ArmJoints> = { shoulder: 80, lift: 55, rotate: 132, elbow: 28, wrist: 48 };
/** Handshake offer */
const R_SHAKE: Partial<ArmJoints> = { shoulder: 60, lift: 40, rotate: 95, elbow: 50, wrist: 90 };

/**
 * Indian Army salute — right hand to RIGHT TEMPLE (not face-center).
 *
 * Tuned for InMoov 3D (rest-relative map + real servo min/max):
 *   shoulder high  → arm raised forward
 *   lift moderate  → elbow out from torso (not T-pose)
 *   rotate inward  → hand path to temple
 *   elbow strong   → forearm up to head
 *   wrist rolled   → palm facing outward / slightly down
 *
 * Hard walls: r_shoulder 30–180, r_lift 10–70, r_rotate 40–180,
 *             r_elbow 10–80, r_wrist 10–160
 */
/** Phase 1 — raise upper arm (elbow still soft) */
const R_SALUTE_SHOULDER: Partial<ArmJoints> = {
  shoulder: 95,
  lift: 26,
  rotate: 100,
  elbow: 16,
  wrist: 85,
};
/** Phase 2 — bring arm forward + start elbow */
const R_SALUTE_ELBOW: Partial<ArmJoints> = {
  shoulder: 125,
  lift: 30,
  rotate: 112,
  elbow: 45,
  wrist: 70,
};
/** Phase 3 — hand approaching temple */
const R_SALUTE: Partial<ArmJoints> = {
  shoulder: 142,
  lift: 30,
  rotate: 122,
  elbow: 70,
  wrist: 50,
};
/** Phase 4 — hold: hand at temple, elbow out, palm open outward */
const R_SALUTE_HOLD: Partial<ArmJoints> = {
  shoulder: 148,
  lift: 28,
  rotate: 126,
  elbow: 76,
  wrist: 46,
};

/** Present / open arms */
const R_PRESENT: Partial<ArmJoints> = { shoulder: 90, lift: 40, rotate: 95, elbow: 16, wrist: 90 };
const L_PRESENT: Partial<ArmJoints> = { shoulder: 90, lift: 40, rotate: 85, elbow: 14, wrist: 90 };

/** Upright attention head (salute / formal moves) */
const ATTENTION_HEAD = {
  ...REST_HEAD,
  jaw: Math.min(REST_HEAD.jaw, 8),
  tilt: REST_HEAD.tilt,
} as const;

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
    desc: 'Indian Army salute · right hand to temple',
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
    // 5. Friendly dual wave — rotate + wrist (clear in 3D)
    {
      ...REST,
      jaw: 12,
      leftArm: { shoulder: 70, lift: 50, rotate: 55, elbow: 22, wrist: 125 },
      rightArm: { shoulder: 70, lift: 50, rotate: 125, elbow: 22, wrist: 55 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 450,
    },
    {
      ...REST,
      leftArm: { shoulder: 70, lift: 50, rotate: 125, elbow: 22, wrist: 55 },
      rightArm: { shoulder: 70, lift: 50, rotate: 55, elbow: 22, wrist: 125 },
      hold: 450,
    },
    {
      ...REST,
      leftArm: { shoulder: 70, lift: 50, rotate: 55, elbow: 22, wrist: 125 },
      rightArm: { shoulder: 70, lift: 50, rotate: 125, elbow: 22, wrist: 55 },
      hold: 450,
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

  // ── Featured actions (safe limits, strong 3D silhouette) ─────
  /**
   * Indian Army salute — full coordinated motion (MRL-style path).
   *
   * 1 Attention → 2 raise shoulder → 3 elbow in → 4 hand to temple
   * → 5 hold → 6 smart cut (hand open → elbow → arm down) → 7 rest
   *
   * Left arm always down. Head upright facing forward.
   * Right hand open palm at right temple (not face center).
   */
  salute: [
    // 1. Attention
    {
      ...REST,
      ...ATTENTION_HEAD,
      leftArm: L_DOWN,
      rightArm: R_DOWN,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 450,
    },
    // 2. Raise right upper arm (path starts)
    {
      ...REST,
      ...ATTENTION_HEAD,
      leftArm: L_DOWN,
      rightArm: R_SALUTE_SHOULDER,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 200,
    },
    // 3. Elbow bends, arm swings toward head
    {
      ...REST,
      ...ATTENTION_HEAD,
      hneck: 86,
      leftArm: L_DOWN,
      rightArm: R_SALUTE_ELBOW,
      leftHand: OPEN_HAND,
      rightHand: SALUTE_HAND_MID,
      hold: 220,
    },
    // 4. Hand reaches temple — palm forms
    {
      ...REST,
      ...ATTENTION_HEAD,
      hneck: 87,
      tilt: 47,
      leftArm: L_DOWN,
      rightArm: R_SALUTE,
      leftHand: OPEN_HAND,
      rightHand: SALUTE_HAND,
      hold: 250,
    },
    // 5. HOLD — crisp Indian salute silhouette
    {
      ...REST,
      ...ATTENTION_HEAD,
      hneck: 87,
      eye: 90,
      jaw: 6,
      tilt: 47,
      rot: 60,
      roll: 120,
      leftArm: L_DOWN,
      rightArm: R_SALUTE_HOLD,
      leftHand: OPEN_HAND,
      rightHand: SALUTE_HAND,
      hold: 1400,
    },
    // 6. Smart cut — open hand, start lowering
    {
      ...REST,
      ...ATTENTION_HEAD,
      leftArm: L_DOWN,
      rightArm: R_SALUTE_ELBOW,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 200,
    },
    // 7. Arm half-down
    {
      ...REST,
      ...ATTENTION_HEAD,
      leftArm: L_DOWN,
      rightArm: R_SALUTE_SHOULDER,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 220,
    },
    // 8. Rest
    {
      ...REST,
      ...ATTENTION_HEAD,
      leftArm: L_DOWN,
      rightArm: R_DOWN,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 700,
    },
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
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, leftHand: OPEN_HAND, rightHand: OPEN_HAND, hold: 300 },
    // both shoulders open first
    {
      ...REST,
      jaw: 10,
      leftArm: { shoulder: 65, lift: 28, rotate: 88, elbow: 12, wrist: 90 },
      rightArm: { shoulder: 65, lift: 28, rotate: 92, elbow: 12, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 350,
    },
    {
      ...REST,
      jaw: 12,
      leftArm: { shoulder: 80, lift: 34, rotate: 86, elbow: 14, wrist: 90 },
      rightArm: { shoulder: 80, lift: 34, rotate: 94, elbow: 14, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 400,
    },
    {
      ...REST,
      jaw: 14,
      tilt: 54,
      leftArm: L_PRESENT,
      rightArm: R_PRESENT,
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 1700,
    },
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, leftHand: OPEN_HAND, rightHand: OPEN_HAND, hold: 650 },
  ],

  clap: [
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, leftHand: OPEN_HAND, rightHand: OPEN_HAND, hold: 300 },
    // raise both arms
    {
      ...REST,
      leftArm: { shoulder: 68, lift: 32, rotate: 90, elbow: 24, wrist: 90 },
      rightArm: { shoulder: 68, lift: 32, rotate: 90, elbow: 24, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 320,
    },
    // elbows in for clap
    {
      ...REST,
      leftArm: { shoulder: 88, lift: 40, rotate: 90, elbow: 42, wrist: 90 },
      rightArm: { shoulder: 88, lift: 40, rotate: 90, elbow: 42, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 260,
    },
    {
      ...REST,
      leftArm: { shoulder: 100, lift: 44, rotate: 90, elbow: 55, wrist: 90 },
      rightArm: { shoulder: 100, lift: 44, rotate: 90, elbow: 55, wrist: 90 },
      leftHand: FIST,
      rightHand: FIST,
      hold: 240,
    },
    {
      ...REST,
      leftArm: { shoulder: 90, lift: 40, rotate: 90, elbow: 44, wrist: 90 },
      rightArm: { shoulder: 90, lift: 40, rotate: 90, elbow: 44, wrist: 90 },
      leftHand: OPEN_HAND,
      rightHand: OPEN_HAND,
      hold: 260,
    },
    {
      ...REST,
      leftArm: { shoulder: 100, lift: 44, rotate: 90, elbow: 55, wrist: 90 },
      rightArm: { shoulder: 100, lift: 44, rotate: 90, elbow: 55, wrist: 90 },
      leftHand: FIST,
      rightHand: FIST,
      hold: 240,
    },
    { ...REST, leftArm: L_DOWN, rightArm: R_DOWN, leftHand: OPEN_HAND, rightHand: OPEN_HAND, hold: 650 },
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

  // ── Classic head / body (safe, big 3D head motion) ──────────
  nod: [
    { ...REST, tilt: 78, hold: 550 },
    { ...REST, tilt: 22, hold: 550 },
    { ...REST, tilt: 72, hold: 450 },
    { ...REST, tilt: 28, hold: 450 },
    { ...REST, tilt: 50, hold: 500 },
  ],
  shake: [
    { ...REST, rot: 28, roll: 152, eye: 70, hold: 480 },
    { ...REST, rot: 100, roll: 80, eye: 110, hold: 480 },
    { ...REST, rot: 28, roll: 152, eye: 70, hold: 420 },
    { ...REST, rot: 100, roll: 80, eye: 110, hold: 420 },
    { ...REST, hold: 600 },
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
  /**
   * Wave hello — shoulder first, then rotate+wrist oscillation (clear 3D).
   */
  'wave-arm': [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 300 },
    // shoulders raise first
    {
      ...REST,
      jaw: 12,
      rightArm: { shoulder: 70, lift: 48, rotate: 90, elbow: 16, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 280,
    },
    {
      ...REST,
      jaw: 14,
      rightArm: R_WAVE_BASE,
      rightHand: OPEN_HAND,
      hold: 400,
    },
    { ...REST, rightArm: R_WAVE_L, rightHand: OPEN_HAND, hold: 340 },
    { ...REST, rightArm: R_WAVE_R, rightHand: OPEN_HAND, hold: 340 },
    { ...REST, rightArm: R_WAVE_L, rightHand: OPEN_HAND, hold: 340 },
    { ...REST, rightArm: R_WAVE_R, rightHand: OPEN_HAND, hold: 340 },
    { ...REST, rightArm: R_WAVE_BASE, rightHand: OPEN_HAND, hold: 280 },
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 650 },
  ],
  handshake: [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 300 },
    {
      ...REST,
      rightArm: { shoulder: 52, lift: 32, rotate: 92, elbow: 22, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 58, lift: 38, rotate: 94, elbow: 40, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 400,
    },
    {
      ...REST,
      rightArm: R_SHAKE,
      rightHand: OPEN_HAND,
      hold: 1300,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 650 },
  ],

  // ── Showcase hand / arm moves (phased · inside hard walls) ─
  'hand-up': [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 300 },
    // shoulder lift first
    {
      ...REST,
      jaw: 10,
      rightArm: { shoulder: 70, lift: 40, rotate: 92, elbow: 14, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 280,
    },
    {
      ...REST,
      rightArm: { shoulder: 90, lift: 52, rotate: 94, elbow: 15, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 320,
    },
    {
      ...REST,
      rightArm: R_UP,
      rightHand: OPEN_HAND,
      hold: 1400,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 650 },
  ],
  'hand-down': [
    {
      ...REST,
      rightArm: R_UP,
      rightHand: OPEN_HAND,
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 85, lift: 42, rotate: 92, elbow: 16, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 320,
    },
    {
      ...REST,
      rightArm: { shoulder: 55, lift: 28, rotate: 90, elbow: 14, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 350,
    },
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 700 },
  ],
  'wave-high': [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 300 },
    {
      ...REST,
      jaw: 12,
      rightArm: { shoulder: 85, lift: 52, rotate: 90, elbow: 14, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 280,
    },
    {
      ...REST,
      jaw: 14,
      rightArm: { shoulder: 98, lift: 60, rotate: 90, elbow: 16, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 400,
    },
    {
      ...REST,
      rightArm: { shoulder: 98, lift: 60, rotate: 48, elbow: 16, wrist: 138 },
      hold: 320,
    },
    {
      ...REST,
      rightArm: { shoulder: 98, lift: 60, rotate: 138, elbow: 16, wrist: 42 },
      hold: 320,
    },
    {
      ...REST,
      rightArm: { shoulder: 98, lift: 60, rotate: 48, elbow: 16, wrist: 138 },
      hold: 320,
    },
    {
      ...REST,
      rightArm: { shoulder: 98, lift: 60, rotate: 138, elbow: 16, wrist: 42 },
      hold: 320,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 650 },
  ],
  'shake-hand': [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 300 },
    // shoulder path
    {
      ...REST,
      tilt: 48,
      rightArm: { shoulder: 52, lift: 30, rotate: 92, elbow: 20, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 280,
    },
    // elbow into offer
    {
      ...REST,
      tilt: 48,
      rightArm: { shoulder: 58, lift: 36, rotate: 94, elbow: 40, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 320,
    },
    {
      ...REST,
      rightArm: R_SHAKE,
      rightHand: OPEN_HAND,
      hold: 350,
    },
    // pump handshake — elbow only
    {
      ...REST,
      rightArm: { shoulder: 60, lift: 40, rotate: 95, elbow: 58, wrist: 90 },
      hold: 280,
    },
    {
      ...REST,
      rightArm: { shoulder: 60, lift: 42, rotate: 95, elbow: 34, wrist: 90 },
      hold: 280,
    },
    {
      ...REST,
      rightArm: { shoulder: 60, lift: 40, rotate: 95, elbow: 58, wrist: 90 },
      hold: 280,
    },
    {
      ...REST,
      rightArm: { shoulder: 60, lift: 42, rotate: 95, elbow: 34, wrist: 90 },
      hold: 300,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 650 },
  ],
  'baby-hand': [
    {
      ...REST,
      jaw: 16,
      tilt: 56,
      rightArm: { shoulder: 62, lift: 36, rotate: 92, elbow: 32, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 500,
    },
    {
      ...REST,
      jaw: 20,
      rightArm: { shoulder: 62, lift: 36, rotate: 92, elbow: 32, wrist: 100 },
      rightHand: {
        thumb: 45,
        index: 40,
        middle: 48,
        ring: 55,
        pinky: 60,
      },
      hold: 380,
    },
    {
      ...REST,
      jaw: 12,
      rightArm: { shoulder: 62, lift: 36, rotate: 92, elbow: 32, wrist: 80 },
      rightHand: OPEN_HAND,
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 62, lift: 36, rotate: 92, elbow: 32, wrist: 105 },
      rightHand: {
        thumb: 70,
        index: 75,
        middle: 80,
        ring: 85,
        pinky: 90,
      },
      hold: 380,
    },
    {
      ...REST,
      jaw: 18,
      rightArm: { shoulder: 62, lift: 36, rotate: 92, elbow: 32, wrist: 85 },
      rightHand: OPEN_HAND,
      hold: 400,
    },
    {
      ...REST,
      rightArm: { shoulder: 62, lift: 36, rotate: 92, elbow: 32, wrist: 95 },
      rightHand: {
        thumb: 40,
        index: 35,
        middle: 42,
        ring: 48,
        pinky: 55,
      },
      hold: 400,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 650 },
  ],
  'open-hand': [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: FIST, hold: 280 },
    {
      ...REST,
      rightArm: { shoulder: 58, lift: 32, rotate: 92, elbow: 22, wrist: 90 },
      rightHand: FIST,
      hold: 300,
    },
    {
      ...REST,
      rightArm: { shoulder: 68, lift: 38, rotate: 92, elbow: 28, wrist: 90 },
      rightHand: FIST,
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 68, lift: 38, rotate: 92, elbow: 28, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 1200,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 600 },
  ],
  fist: [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 280 },
    {
      ...REST,
      rightArm: { shoulder: 58, lift: 32, rotate: 92, elbow: 22, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 300,
    },
    {
      ...REST,
      rightArm: { shoulder: 68, lift: 38, rotate: 92, elbow: 28, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 350,
    },
    {
      ...REST,
      rightArm: { shoulder: 68, lift: 38, rotate: 92, elbow: 28, wrist: 90 },
      rightHand: FIST,
      hold: 1200,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 600 },
  ],
  point: [
    { ...REST, rightArm: R_DOWN, leftArm: L_DOWN, rightHand: OPEN_HAND, hold: 280 },
    {
      ...REST,
      rightArm: { shoulder: 62, lift: 34, rotate: 92, elbow: 20, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 280,
    },
    {
      ...REST,
      rightArm: { shoulder: 82, lift: 42, rotate: 95, elbow: 28, wrist: 90 },
      rightHand: OPEN_HAND,
      hold: 300,
    },
    {
      ...REST,
      rightArm: { shoulder: 88, lift: 46, rotate: 96, elbow: 32, wrist: 90 },
      rightHand: POINT_HAND,
      hold: 1500,
    },
    { ...REST, rightArm: R_DOWN, rightHand: OPEN_HAND, hold: 600 },
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
