/**
 * Hard arm limits + anti-overlap coupling for real-time InMoov control.
 * Never allows angles outside hardware-safe min/max from servo config.
 * Soft coupling reduces effective range so parts do not bind or collide.
 */
import { servoByKey } from '@/lib/servoConfig';
import type { ArmJoints, BodySide } from '@/lib/bodyConfig';
import { clamp } from '@/lib/utils';

export type JointRange = { min: number; max: number };

export type ArmJointRanges = {
  shoulder: JointRange;
  lift: JointRange;
  rotate: JointRange;
  elbow: JointRange;
  wrist: JointRange;
};

function cfgRange(key: string, fallbackMin: number, fallbackMax: number): JointRange {
  const s = servoByKey(key);
  const min = s?.min ?? fallbackMin;
  const max = s?.max ?? fallbackMax;
  return { min, max: Math.max(min, max) };
}

/** Absolute walls from shared/servo_config — never exceeded. */
export function getArmHardLimits(side: BodySide): ArmJointRanges {
  const p = side === 'left' ? 'l' : 'r';
  return {
    shoulder: cfgRange(`${p}_shoulder`, 30, 180),
    lift: cfgRange(`${p}_lift`, side === 'left' ? 15 : 10, side === 'left' ? 65 : 70),
    rotate: cfgRange(`${p}_rotate`, 40, 180),
    elbow: cfgRange(`${p}_elbow`, side === 'left' ? 0 : 10, side === 'left' ? 52 : 80),
    wrist: cfgRange(`${p}_wrist`, 10, 160),
  };
}

function hardClamp(n: number, range: JointRange): number {
  if (!Number.isFinite(n)) return range.min;
  return clamp(Math.round(n), range.min, range.max);
}

/**
 * Effective per-joint range given the current pose.
 * Couples joints so omoplate/bicep/rotate/shoulder cannot stack into a bind.
 */
export function getArmEffectiveLimits(side: BodySide, arm: Partial<ArmJoints>): ArmJointRanges {
  const hard = getArmHardLimits(side);
  const shoulder = hardClamp(Number(arm.shoulder ?? hard.shoulder.min), hard.shoulder);
  const lift = hardClamp(Number(arm.lift ?? hard.lift.min), hard.lift);
  const rotate = hardClamp(Number(arm.rotate ?? 90), hard.rotate);
  const elbow = hardClamp(Number(arm.elbow ?? hard.elbow.min), hard.elbow);

  let liftMax = hard.lift.max;
  let elbowMax = hard.elbow.max;
  let rotateMin = hard.rotate.min;
  let rotateMax = hard.rotate.max;
  let shoulderMax = hard.shoulder.max;

  // High elbow flex → cut omoplate (forearm folds into torso / shoulder cover)
  // Softer than before so salute / temple-reach poses keep silhouette
  const elbowOver = Math.max(0, elbow - 42);
  liftMax = Math.max(hard.lift.min + 4, liftMax - Math.round(elbowOver * 0.28));

  // High omoplate raise → cut elbow flex (bicep/shoulder housing bind)
  // Allow higher elbow when arm is raised for military salute / hand-to-head
  const liftOver = Math.max(0, lift - 38);
  elbowMax = Math.max(hard.elbow.min + 4, elbowMax - Math.round(liftOver * 0.45));

  // High shoulder (arm forward/up) → leave head/ear clearance via lower omoplate max
  if (shoulder > 135) {
    liftMax = Math.max(hard.lift.min + 4, liftMax - Math.round((shoulder - 135) * 0.2));
  }

  // High omoplate → slightly reduce shoulder max (less reach over the head assembly)
  if (lift > 52) {
    shoulderMax = Math.max(hard.shoulder.min + 20, shoulderMax - Math.round((lift - 52) * 1.0));
  }

  // Bent elbow → keep rotate nearer neutral so hand does not clip torso/hip
  if (elbow > 35) {
    const shrink = Math.round((elbow - 35) * 0.55);
    rotateMin = Math.min(rotateMax - 12, rotateMin + shrink);
    rotateMax = Math.max(rotateMin + 12, rotateMax - shrink);
  }

  // Arm low at side → avoid extreme inward rotate into hip/torso
  if (shoulder < 55) {
    const shrink = Math.round((55 - shoulder) * 0.45);
    rotateMin = Math.min(95, rotateMin + shrink);
  }

  // Raised + forward arm → keep rotate out of head/neck zone
  if (lift > 42 && shoulder > 100) {
    rotateMin = Math.max(rotateMin, 55);
    rotateMax = Math.min(rotateMax, 155);
  }

  // High rotate extremes slightly limit elbow to avoid wrist/torso scrape
  const rotateEdge = Math.max(Math.abs(rotate - 90) - 40, 0);
  if (rotateEdge > 0) {
    elbowMax = Math.max(hard.elbow.min + 4, elbowMax - Math.round(rotateEdge * 0.25));
  }

  return {
    shoulder: { min: hard.shoulder.min, max: Math.max(hard.shoulder.min, shoulderMax) },
    lift: { min: hard.lift.min, max: Math.max(hard.lift.min, liftMax) },
    rotate: {
      min: Math.min(rotateMin, rotateMax),
      max: Math.max(rotateMin, rotateMax),
    },
    elbow: { min: hard.elbow.min, max: Math.max(hard.elbow.min, elbowMax) },
    wrist: { ...hard.wrist },
  };
}

/**
 * Clamp + resolve joint coupling so the pose never exceeds limits
 * and cannot stack into a self-collision / mechanical bind.
 */
export function sanitizeArm(side: BodySide, arm: Partial<ArmJoints>, base?: Partial<ArmJoints>): ArmJoints {
  const hard = getArmHardLimits(side);
  let result: ArmJoints = {
    shoulder: hardClamp(Number(arm.shoulder ?? base?.shoulder ?? hard.shoulder.min), hard.shoulder),
    lift: hardClamp(Number(arm.lift ?? base?.lift ?? hard.lift.min), hard.lift),
    rotate: hardClamp(Number(arm.rotate ?? base?.rotate ?? 90), hard.rotate),
    elbow: hardClamp(Number(arm.elbow ?? base?.elbow ?? hard.elbow.min), hard.elbow),
    wrist: hardClamp(Number(arm.wrist ?? base?.wrist ?? 90), hard.wrist),
  };

  // Iterate so coupled reductions settle (no joint left outside effective range)
  for (let i = 0; i < 4; i++) {
    const lim = getArmEffectiveLimits(side, result);
    const next: ArmJoints = {
      shoulder: hardClamp(result.shoulder, lim.shoulder),
      lift: hardClamp(result.lift, lim.lift),
      rotate: hardClamp(result.rotate, lim.rotate),
      elbow: hardClamp(result.elbow, lim.elbow),
      wrist: hardClamp(result.wrist, lim.wrist),
    };
    if (
      next.shoulder === result.shoulder &&
      next.lift === result.lift &&
      next.rotate === result.rotate &&
      next.elbow === result.elbow &&
      next.wrist === result.wrist
    ) {
      return next;
    }
    result = next;
  }
  return result;
}

/** Rest pose always inside hard limits and free of overlap. */
export function getSafeArmRest(side: BodySide): ArmJoints {
  const hard = getArmHardLimits(side);
  const p = side === 'left' ? 'l' : 'r';
  const restOf = (key: string, range: JointRange, fallback: number) => {
    const s = servoByKey(key);
    return hardClamp(s?.rest ?? fallback, range);
  };
  return sanitizeArm(side, {
    shoulder: restOf(`${p}_shoulder`, hard.shoulder, hard.shoulder.min),
    lift: restOf(`${p}_lift`, hard.lift, hard.lift.min),
    rotate: restOf(`${p}_rotate`, hard.rotate, 90),
    elbow: restOf(`${p}_elbow`, hard.elbow, hard.elbow.min),
    wrist: restOf(`${p}_wrist`, hard.wrist, 90),
  });
}

export function clampArmJoint(
  side: BodySide,
  joint: keyof ArmJoints,
  value: number,
  current: Partial<ArmJoints>,
): number {
  const next = sanitizeArm(side, { ...current, [joint]: value }, current);
  return next[joint];
}
