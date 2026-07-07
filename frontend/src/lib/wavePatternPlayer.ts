import type { PresetKeyframe } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';

export interface WavePattern {
  id: string;
  name: string;
  icon: string;
  hands: string;
  speed?: number;
  amplitude?: number;
  setup?: Partial<PresetKeyframe>;
  keyframes?: PresetKeyframe[];
}

const REST_HEAD: PresetKeyframe = {
  hneck: 85, eye: 90, jaw: 8, rot: 60, tilt: 50, roll: 120, hold: 400,
};

function oscillateKeyframes(
  pattern: WavePattern,
  cycles = 3,
): PresetKeyframe[] {
  const amp = (pattern.amplitude ?? 50) / 100;
  const base = { ...REST_HEAD, ...pattern.setup, hold: 300 };
  const shoulderKey = pattern.hands === 'left' ? 'leftArm' : 'rightArm';
  const baseShoulder = (base as PresetKeyframe)[shoulderKey as 'rightArm']?.shoulder ?? 80;
  const frames: PresetKeyframe[] = [{ ...base, hold: 500 }];

  for (let i = 0; i < cycles; i++) {
    const delta = Math.round(25 * amp);
    frames.push({
      ...base,
      [shoulderKey]: {
        ...(base as PresetKeyframe)[shoulderKey as 'rightArm'],
        shoulder: baseShoulder + delta,
      },
      hold: Math.max(200, 500 - (pattern.speed ?? 50) * 3),
    } as PresetKeyframe);
    frames.push({
      ...base,
      [shoulderKey]: {
        ...(base as PresetKeyframe)[shoulderKey as 'rightArm'],
        shoulder: baseShoulder - delta,
      },
      hold: Math.max(200, 500 - (pattern.speed ?? 50) * 3),
    } as PresetKeyframe);
  }
  frames.push({ ...base, hold: 600 });
  return frames;
}

export async function playWavePattern(
  pattern: WavePattern,
  signal?: AbortSignal,
): Promise<void> {
  const keyframes = pattern.keyframes?.length
    ? pattern.keyframes.map((kf) => ({ ...REST_HEAD, ...kf }))
    : oscillateKeyframes(pattern);
  await animateKeyframes(keyframes, { signal, transitionMs: 350 });
}