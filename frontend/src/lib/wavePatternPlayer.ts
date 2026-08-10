import type { PresetKeyframe } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { getArmHardLimits, sanitizeArm } from '@/lib/armSafety';
import type { ArmJoints } from '@/lib/bodyConfig';

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

function safeArm(side: 'left' | 'right', arm?: Partial<ArmJoints>): ArmJoints {
  return sanitizeArm(side, arm ?? {});
}

function oscillateKeyframes(
  pattern: WavePattern,
  cycles = 3,
): PresetKeyframe[] {
  const amp = (pattern.amplitude ?? 50) / 100;
  const side: 'left' | 'right' = pattern.hands === 'left' ? 'left' : 'right';
  const shoulderKey = side === 'left' ? 'leftArm' : 'rightArm';
  const hard = getArmHardLimits(side);
  const setupBlock = (pattern.setup as PresetKeyframe | undefined)?.[shoulderKey] as
    | Partial<ArmJoints>
    | undefined;
  const setupArm = safeArm(side, setupBlock);
  const base: PresetKeyframe = {
    ...REST_HEAD,
    ...pattern.setup,
    [shoulderKey]: setupArm,
    hold: 300,
  };
  const baseShoulder = setupArm.shoulder;
  const frames: PresetKeyframe[] = [{ ...base, hold: 500 }];

  for (let i = 0; i < cycles; i++) {
    // Keep oscillation inside hard shoulder walls so wave never overshoots limits
    const delta = Math.round(20 * amp);
    const up = Math.min(hard.shoulder.max, baseShoulder + delta);
    const down = Math.max(hard.shoulder.min, baseShoulder - delta);
    const hold = Math.max(200, 500 - (pattern.speed ?? 50) * 3);
    frames.push({
      ...base,
      [shoulderKey]: safeArm(side, { ...setupArm, shoulder: up }),
      hold,
    } as PresetKeyframe);
    frames.push({
      ...base,
      [shoulderKey]: safeArm(side, { ...setupArm, shoulder: down }),
      hold,
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