import type { PresetKeyframe } from '@/lib/presets';
import { useServoStore } from '@/store/servoStore';

function lerpAngles(from: PresetKeyframe, to: PresetKeyframe, t: number): PresetKeyframe {
  const keys: (keyof PresetKeyframe)[] = ['hneck', 'eye', 'jaw', 'rot', 'tilt', 'roll'];
  const result = { ...to, hold: to.hold };
  for (const key of keys) {
    if (key === 'hold') continue;
    result[key] = Math.round(from[key] + (to[key] - from[key]) * t);
  }
  return result;
}

function applyKeyframe(kf: PresetKeyframe, send: boolean) {
  const store = useServoStore.getState();
  store.setHead('hneck', kf.hneck, send);
  store.setHead('eye', kf.eye, send);
  store.setHead('jaw', kf.jaw, send);
  store.setNeck('rot', kf.rot, send);
  store.setNeck('tilt', kf.tilt, send);
  store.setNeck('roll', kf.roll, send);
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