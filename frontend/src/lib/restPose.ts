/**
 * Single source of truth for the InMoov neutral / default pose values.
 * Stores, 3D preview, and move end-frames must use these so hands stay fully open at rest.
 */
import type { ArmJoints, HandJoints, LegJoints } from '@/lib/bodyConfig';
import type { AngleState } from '@/lib/robotViewerCore';
import { getSafeArmRest } from '@/lib/armSafety';
import { servoByKey } from '@/lib/servoConfig';

function restOf(key: string, fallback: number): number {
  const n = Number(servoByKey(key)?.rest);
  return Number.isFinite(n) ? n : fallback;
}

/** Head + neck defaults (matches servoStore + servo_config rest) */
export const REST_HEAD = {
  hneck: restOf('head_neck', 85),
  eye: restOf('head_eye', 90),
  jaw: restOf('head_jaw', 8),
  rot: restOf('neck_rot', 60),
  tilt: restOf('neck_tilt', 50),
  roll: restOf('neck_roll', 120),
} as const;

/** Open hand — all fingers fully open at rest */
export function getRestHand(): HandJoints {
  return {
    thumb: restOf('l_thumb', 10),
    index: restOf('l_index', 10),
    middle: restOf('l_middle', 10),
    ring: restOf('l_ring', 10),
    pinky: restOf('l_pinky', 10),
  };
}

export function getRestArm(side: 'left' | 'right'): ArmJoints {
  return getSafeArmRest(side);
}

export function getRestLeg(side: 'left' | 'right'): LegJoints {
  const p = side === 'left' ? 'l' : 'r';
  return {
    hip: restOf(`${p}_hip`, 90),
    thigh: restOf(`${p}_thigh`, 90),
    knee: restOf(`${p}_knee`, 15),
    ankle: restOf(`${p}_ankle`, 90),
    foot: restOf(`${p}_foot`, 90),
  };
}

/** Full neutral pose for 3D + UI */
export function getNeutralAngleState(): AngleState {
  return {
    headPan: REST_HEAD.hneck,
    eye: REST_HEAD.eye,
    jaw: REST_HEAD.jaw,
    neckRot: REST_HEAD.rot,
    neckTilt: REST_HEAD.tilt,
    neckRoll: REST_HEAD.roll,
    leftArm: getRestArm('left'),
    rightArm: getRestArm('right'),
    leftHand: getRestHand(),
    rightHand: getRestHand(),
    leftLeg: getRestLeg('left'),
    rightLeg: getRestLeg('right'),
  };
}
