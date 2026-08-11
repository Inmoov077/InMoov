/**
 * MRL-style gesture player for InMoov.
 * - Builds a continuous time timeline (transition + hold per keyframe)
 * - Drives the 3D mesh every animation frame via requestAnimationFrame
 * - Always fills full body (both arms, hands, head, legs) so preview never freezes mid-limb
 * - Hardware send is throttled and never blocks the preview
 */
import type { PresetKeyframe } from '@/lib/presets';
import type { ArmJoints, HandJoints, LegJoints } from '@/lib/bodyConfig';
import { DEFAULT_HAND, DEFAULT_LEG } from '@/lib/bodyConfig';
import { getArmHardLimits, getSafeArmRest, sanitizeArm } from '@/lib/armSafety';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';
import { clamp } from '@/lib/utils';
import type { AngleState } from '@/lib/robotViewerCore';
import {
  driveLiveRobot,
  isLiveRobotReady,
  setPlaybackLocked,
} from '@/lib/robotLiveController';
import * as api from '@/lib/api';

export interface FullPose {
  hneck: number;
  eye: number;
  jaw: number;
  rot: number;
  tilt: number;
  roll: number;
  hold: number;
  leftArm: ArmJoints;
  rightArm: ArmJoints;
  leftHand: HandJoints;
  rightHand: HandJoints;
  leftLeg: LegJoints;
  rightLeg: LegJoints;
}

interface TimelineSegment {
  from: FullPose;
  to: FullPose;
  /** ms spent blending from → to */
  transitionMs: number;
  /** ms spent holding `to` after blend */
  holdMs: number;
  /** absolute start time on the timeline (ms) */
  startMs: number;
  /** absolute end of transition */
  transitionEndMs: number;
  /** absolute end of hold (= end of segment) */
  endMs: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRound(a: number, b: number, t: number): number {
  return Math.round(lerp(a, b, t));
}

function easeInOut(t: number): number {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function lerpGroup<T extends object>(from: T, to: T, t: number): T {
  const out = { ...from } as T;
  const src = from as Record<string, number>;
  const dst = to as Record<string, number>;
  const result = out as Record<string, number>;
  for (const key of Object.keys({ ...src, ...dst })) {
    const a = Number(src[key] ?? dst[key] ?? 0);
    const b = Number(dst[key] ?? a);
    result[key] = lerpRound(a, b, t);
  }
  return out;
}

/** Hard walls only — no coupling crush (preview motion stays visible). */
function hardClampArm(side: 'left' | 'right', arm: Partial<ArmJoints>, base: ArmJoints): ArmJoints {
  const hard = getArmHardLimits(side);
  const pick = (k: keyof ArmJoints) => {
    const n = Number(arm[k] ?? base[k]);
    if (!Number.isFinite(n)) return base[k];
    return clamp(Math.round(n), hard[k].min, hard[k].max);
  };
  return {
    shoulder: pick('shoulder'),
    lift: pick('lift'),
    rotate: pick('rotate'),
    elbow: pick('elbow'),
    wrist: pick('wrist'),
  };
}

/** Hardware path — full safety + coupling. */
function safeArmHardware(side: 'left' | 'right', arm: ArmJoints): ArmJoints {
  try {
    return sanitizeArm(side, arm, arm);
  } catch {
    return arm;
  }
}

function readCurrentPose(): FullPose {
  const s = useServoStore.getState();
  const b = useBodyStore.getState();
  const leftRest = getSafeArmRest('left');
  const rightRest = getSafeArmRest('right');
  return {
    hneck: Number.isFinite(s.hneck) ? s.hneck : 85,
    eye: Number.isFinite(s.eye) ? s.eye : 90,
    jaw: Number.isFinite(s.jaw) ? s.jaw : 8,
    rot: Number.isFinite(s.rot) ? s.rot : 60,
    tilt: Number.isFinite(s.tilt) ? s.tilt : 50,
    roll: Number.isFinite(s.roll) ? s.roll : 120,
    hold: 300,
    leftArm: b.leftArm?.shoulder != null ? { ...b.leftArm } : leftRest,
    rightArm: b.rightArm?.shoulder != null ? { ...b.rightArm } : rightRest,
    leftHand: { ...(b.leftHand ?? DEFAULT_HAND) },
    rightHand: { ...(b.rightHand ?? DEFAULT_HAND) },
    leftLeg: { ...(b.leftLeg ?? DEFAULT_LEG) },
    rightLeg: { ...(b.rightLeg ?? DEFAULT_LEG) },
  };
}

/**
 * Resolve keyframe onto a FULL body pose.
 * Missing limbs keep previous values so partial keyframes never drop a limb.
 */
function resolveKeyframe(base: FullPose, kf: PresetKeyframe): FullPose {
  return {
    hneck: Number(kf.hneck ?? base.hneck),
    eye: Number(kf.eye ?? base.eye),
    jaw: Number(kf.jaw ?? base.jaw),
    rot: Number(kf.rot ?? base.rot),
    tilt: Number(kf.tilt ?? base.tilt),
    roll: Number(kf.roll ?? base.roll),
    hold: Math.max(80, Number(kf.hold) || 300),
    leftArm: kf.leftArm
      ? hardClampArm('left', { ...base.leftArm, ...kf.leftArm }, base.leftArm)
      : { ...base.leftArm },
    rightArm: kf.rightArm
      ? hardClampArm('right', { ...base.rightArm, ...kf.rightArm }, base.rightArm)
      : { ...base.rightArm },
    leftHand: kf.leftHand ? { ...base.leftHand, ...kf.leftHand } : { ...base.leftHand },
    rightHand: kf.rightHand ? { ...base.rightHand, ...kf.rightHand } : { ...base.rightHand },
    leftLeg: kf.leftLeg ? { ...base.leftLeg, ...kf.leftLeg } : { ...base.leftLeg },
    rightLeg: kf.rightLeg ? { ...base.rightLeg, ...kf.rightLeg } : { ...base.rightLeg },
  };
}

function lerpPose(from: FullPose, to: FullPose, t: number): FullPose {
  const e = easeInOut(t);
  return {
    hneck: lerpRound(from.hneck, to.hneck, e),
    eye: lerpRound(from.eye, to.eye, e),
    jaw: lerpRound(from.jaw, to.jaw, e),
    rot: lerpRound(from.rot, to.rot, e),
    tilt: lerpRound(from.tilt, to.tilt, e),
    roll: lerpRound(from.roll, to.roll, e),
    hold: to.hold,
    leftArm: hardClampArm('left', lerpGroup(from.leftArm, to.leftArm, e), from.leftArm),
    rightArm: hardClampArm('right', lerpGroup(from.rightArm, to.rightArm, e), from.rightArm),
    leftHand: lerpGroup(from.leftHand, to.leftHand, e),
    rightHand: lerpGroup(from.rightHand, to.rightHand, e),
    leftLeg: lerpGroup(from.leftLeg, to.leftLeg, e),
    rightLeg: lerpGroup(from.rightLeg, to.rightLeg, e),
  };
}

function poseToAngles(pose: FullPose): AngleState {
  return {
    headPan: pose.hneck,
    eye: pose.eye,
    jaw: pose.jaw,
    neckRot: pose.rot,
    neckTilt: pose.tilt,
    neckRoll: pose.roll,
    leftArm: { ...pose.leftArm },
    rightArm: { ...pose.rightArm },
    leftHand: { ...pose.leftHand },
    rightHand: { ...pose.rightHand },
    leftLeg: { ...pose.leftLeg },
    rightLeg: { ...pose.rightLeg },
  };
}

let lastHwSend = 0;
const HW_MIN_MS = 90;

function applyPose(pose: FullPose, options: { send: boolean; forceHw?: boolean }): void {
  // 1) 3D mesh — always first
  driveLiveRobot(poseToAngles(pose));

  // 2) UI stores
  try {
    useServoStore.setState({
      hneck: pose.hneck,
      eye: pose.eye,
      jaw: pose.jaw,
      rot: pose.rot,
      tilt: pose.tilt,
      roll: pose.roll,
    });
    useBodyStore.setState({
      leftArm: { ...pose.leftArm },
      rightArm: { ...pose.rightArm },
      leftHand: { ...pose.leftHand },
      rightHand: { ...pose.rightHand },
      leftLeg: { ...pose.leftLeg },
      rightLeg: { ...pose.rightLeg },
    });
  } catch (err) {
    console.warn('[gesture] store update failed', err);
  }

  // 3) Hardware (throttled)
  if (!options.send) return;
  const servo = useServoStore.getState();
  if (!servo.connected) return;
  const now = performance.now();
  if (!options.forceHw && now - lastHwSend < HW_MIN_MS) return;
  lastHwSend = now;

  try {
    const left = safeArmHardware('left', pose.leftArm);
    const right = safeArmHardware('right', pose.rightArm);
    const rot = servo.outputInversions.rot ? 180 - pose.rot : pose.rot;
    const tilt = servo.outputInversions.tilt ? 180 - pose.tilt : pose.tilt;
    const roll = servo.outputInversions.roll ? 180 - pose.roll : pose.roll;
    void api.sendHead(pose.hneck, pose.eye, pose.jaw).catch(() => undefined);
    void api.sendNeck(rot, tilt, roll).catch(() => undefined);
    void api.sendArm('left', left).catch(() => undefined);
    void api.sendArm('right', right).catch(() => undefined);
    void api.sendHand('left', pose.leftHand).catch(() => undefined);
    void api.sendHand('right', pose.rightHand).catch(() => undefined);
  } catch (err) {
    console.warn('[gesture] hardware send failed', err);
  }
}

function sampleTimeline(segments: TimelineSegment[], tMs: number): FullPose {
  if (!segments.length) return readCurrentPose();
  if (tMs <= 0) return segments[0].from;
  const last = segments[segments.length - 1];
  if (tMs >= last.endMs) return last.to;

  for (const seg of segments) {
    if (tMs > seg.endMs) continue;
    if (tMs <= seg.transitionEndMs) {
      const u =
        seg.transitionMs <= 1 ? 1 : (tMs - seg.startMs) / seg.transitionMs;
      return lerpPose(seg.from, seg.to, u);
    }
    // hold phase
    return seg.to;
  }
  return last.to;
}

/**
 * Play keyframes as one continuous full-body gesture (MyRobotLab style).
 * Runs to completion unless aborted — never “stops after one joint”.
 */
export async function animateKeyframes(
  keyframes: PresetKeyframe[],
  options?: { send?: boolean; signal?: AbortSignal; transitionMs?: number },
): Promise<void> {
  const send = options?.send ?? true;
  const transitionMs = Math.max(120, options?.transitionMs ?? 420);
  const signal = options?.signal;

  if (!keyframes.length) return;

  setPlaybackLocked(true);

  try {
    // Start from rest-safe current body so every limb is defined
    let carry = readCurrentPose();
    // If arms look uninitialized, snap to safe rest first
    if (!Number.isFinite(carry.leftArm.shoulder) || !Number.isFinite(carry.rightArm.shoulder)) {
      carry = {
        ...carry,
        leftArm: getSafeArmRest('left'),
        rightArm: getSafeArmRest('right'),
        leftHand: { ...DEFAULT_HAND },
        rightHand: { ...DEFAULT_HAND },
      };
    }

    const poses: FullPose[] = keyframes.map((kf) => {
      const resolved = resolveKeyframe(carry, kf);
      carry = resolved;
      return resolved;
    });

    // Build continuous timeline: current → pose0 (short) → pose1 … → poseN
    const segments: TimelineSegment[] = [];
    let cursor = 0;
    let prev = readCurrentPose();

    // Intro blend from live pose into first keyframe (so motion always starts)
    {
      const to = poses[0];
      const introMs = Math.min(transitionMs, 280);
      segments.push({
        from: prev,
        to,
        transitionMs: introMs,
        holdMs: Math.min(to.hold, 200),
        startMs: cursor,
        transitionEndMs: cursor + introMs,
        endMs: cursor + introMs + Math.min(to.hold, 200),
      });
      cursor = segments[segments.length - 1].endMs;
      prev = to;
    }

    for (let i = 1; i < poses.length; i++) {
      const to = poses[i];
      // Longer transitions for big arm deltas so motion is readable
      const armDelta = Math.max(
        Math.abs(to.rightArm.shoulder - prev.rightArm.shoulder),
        Math.abs(to.rightArm.lift - prev.rightArm.lift),
        Math.abs(to.rightArm.elbow - prev.rightArm.elbow),
        Math.abs(to.leftArm.shoulder - prev.leftArm.shoulder),
        Math.abs(to.leftArm.lift - prev.leftArm.lift),
      );
      const segTransition = armDelta > 40 ? transitionMs + 120 : transitionMs;
      const holdMs = to.hold;
      segments.push({
        from: prev,
        to,
        transitionMs: segTransition,
        holdMs,
        startMs: cursor,
        transitionEndMs: cursor + segTransition,
        endMs: cursor + segTransition + holdMs,
      });
      cursor = segments[segments.length - 1].endMs;
      prev = to;
    }

    const totalMs = cursor;
    if (totalMs <= 0) {
      applyPose(poses[poses.length - 1], { send, forceHw: true });
      return;
    }

    // Seed first frame immediately
    applyPose(sampleTimeline(segments, 0), { send: false });

    await new Promise<void>((resolve) => {
      const t0 = performance.now();
      let raf = 0;
      let lastStoreUi = 0;

      const tick = (now: number) => {
        if (signal?.aborted) {
          resolve();
          return;
        }

        const elapsed = now - t0;
        const pose = sampleTimeline(segments, elapsed);

        // 3D every frame
        driveLiveRobot(poseToAngles(pose));

        // UI stores ~20Hz (enough for sliders, keeps main thread free)
        if (now - lastStoreUi > 50) {
          lastStoreUi = now;
          applyPose(pose, {
            send,
            forceHw: elapsed >= totalMs - 16,
          });
        } else if (isLiveRobotReady()) {
          // still drive mesh if applyPose skipped
          driveLiveRobot(poseToAngles(pose));
        }

        if (elapsed >= totalMs) {
          // Final snap + hardware
          applyPose(poses[poses.length - 1], { send, forceHw: true });
          resolve();
          return;
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);

      const onAbort = () => {
        cancelAnimationFrame(raf);
        resolve();
      };
      signal?.addEventListener('abort', onAbort, { once: true });
    });
  } catch (err) {
    console.error('[gesture] playback error', err);
  } finally {
    setPlaybackLocked(false);
  }
}
