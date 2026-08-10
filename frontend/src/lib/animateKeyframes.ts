import type { PresetKeyframe } from '@/lib/presets';
import type { ArmJoints } from '@/lib/bodyConfig';
import { sanitizeArm } from '@/lib/armSafety';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';
import { clamp } from '@/lib/utils';

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function lerpArm(
  side: 'left' | 'right',
  from: Partial<ArmJoints> | undefined,
  to: Partial<ArmJoints> | undefined,
  t: number,
): ArmJoints | undefined {
  if (!from && !to) return undefined;
  const a = sanitizeArm(side, from ?? to ?? {});
  const b = sanitizeArm(side, to ?? from ?? {});
  return sanitizeArm(side, {
    shoulder: lerp(a.shoulder, b.shoulder, t),
    lift: lerp(a.lift, b.lift, t),
    rotate: lerp(a.rotate, b.rotate, t),
    elbow: lerp(a.elbow, b.elbow, t),
    wrist: lerp(a.wrist, b.wrist, t),
  });
}

function lerpAngles(from: PresetKeyframe, to: PresetKeyframe, t: number): PresetKeyframe {
  const keys = ['hneck', 'eye', 'jaw', 'rot', 'tilt', 'roll'] as const;
  const result: PresetKeyframe = { ...to, hold: to.hold };
  for (const key of keys) {
    const a = Number(from[key] ?? to[key] ?? 90);
    const b = Number(to[key] ?? from[key] ?? 90);
    result[key] = lerp(a, b, t);
  }
  const la = lerpArm('left', from.leftArm, to.leftArm, t);
  const ra = lerpArm('right', from.rightArm, to.rightArm, t);
  if (la) result.leftArm = la;
  if (ra) result.rightArm = ra;
  if (from.leftHand || to.leftHand) {
    result.leftHand = { ...(from.leftHand ?? {}), ...(to.leftHand ?? {}) } as PresetKeyframe['leftHand'];
  }
  if (from.rightHand || to.rightHand) {
    result.rightHand = { ...(from.rightHand ?? {}), ...(to.rightHand ?? {}) } as PresetKeyframe['rightHand'];
  }
  return result;
}

function applyKeyframe(kf: PresetKeyframe, send: boolean) {
  const store = useServoStore.getState();
  const body = useBodyStore.getState();
  store.setHead('hneck', kf.hneck, send);
  store.setHead('eye', kf.eye, send);
  store.setHead('jaw', kf.jaw, send);
  store.setNeck('rot', kf.rot, send);
  store.setNeck('tilt', kf.tilt, send);
  store.setNeck('roll', kf.roll, send);
  // Always sanitize arms so gestures/waves never exceed hard walls or overlap
  if (kf.leftArm) body.setArm('left', sanitizeArm('left', kf.leftArm), send);
  if (kf.rightArm) body.setArm('right', sanitizeArm('right', kf.rightArm), send);
  if (kf.leftHand) body.setHand('left', kf.leftHand, send);
  if (kf.rightHand) body.setHand('right', kf.rightHand, send);
  if (kf.leftLeg) body.setLeg('left', kf.leftLeg, send);
  if (kf.rightLeg) body.setLeg('right', kf.rightLeg, send);
}

export async function animateKeyframes(
  keyframes: PresetKeyframe[],
  options?: { send?: boolean; signal?: AbortSignal; transitionMs?: number },
): Promise<void> {
  const send = options?.send ?? true;
  const transitionMs = options?.transitionMs ?? 400;
  const signal = options?.signal;

  if (!keyframes.length) return;

  // Pre-sanitize arm poses in every frame
  const safeFrames = keyframes.map((kf) => ({
    ...kf,
    leftArm: kf.leftArm ? sanitizeArm('left', kf.leftArm) : kf.leftArm,
    rightArm: kf.rightArm ? sanitizeArm('right', kf.rightArm) : kf.rightArm,
    hold: Math.max(50, Number(kf.hold) || 300),
  }));

  let prev = safeFrames[0];
  applyKeyframe(prev, send);

  for (let i = 1; i < safeFrames.length; i++) {
    if (signal?.aborted) return;
    const next = safeFrames[i];
    const steps = Math.max(1, Math.round(transitionMs / 40));
    for (let s = 1; s <= steps; s++) {
      if (signal?.aborted) return;
      const t = clamp(s / steps, 0, 1);
      applyKeyframe(lerpAngles(prev, next, t), send);
      await new Promise((r) => setTimeout(r, transitionMs / steps));
    }
    prev = next;
    await new Promise((r) => setTimeout(r, next.hold));
  }
}
