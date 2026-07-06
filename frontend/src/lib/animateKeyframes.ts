import type { PresetKeyframe } from '@/lib/presets';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';

function lerpAngles(from: PresetKeyframe, to: PresetKeyframe, t: number): PresetKeyframe {
  const keys = ['hneck', 'eye', 'jaw', 'rot', 'tilt', 'roll'] as const;
  const result: PresetKeyframe = { ...to, hold: to.hold };
  for (const key of keys) {
    result[key] = Math.round(from[key] + (to[key] - from[key]) * t);
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
  if (kf.leftArm) body.setArm('left', kf.leftArm, send);
  if (kf.rightArm) body.setArm('right', kf.rightArm, send);
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

  let prev = keyframes[0];
  applyKeyframe(prev, send);

  for (let i = 1; i < keyframes.length; i++) {
    if (signal?.aborted) return;
    const next = keyframes[i];
    const steps = Math.max(1, Math.round(transitionMs / 40));
    for (let s = 1; s <= steps; s++) {
      if (signal?.aborted) return;
      const t = s / steps;
      applyKeyframe(lerpAngles(prev, next, t), send);
      await new Promise((r) => setTimeout(r, transitionMs / steps));
    }
    prev = next;
    await new Promise((r) => setTimeout(r, next.hold));
  }
}