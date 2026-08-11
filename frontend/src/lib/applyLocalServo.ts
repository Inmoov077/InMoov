/**
 * Apply a single servo angle to UI stores + 3D preview.
 * send=true only when USB is connected (real motors).
 */
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';
import { clampServoAngle } from '@/store/limitStore';
import type { ArmJoints, HandJoints, LegJoints } from '@/lib/bodyConfig';

const HEAD_MAP: Record<string, 'hneck' | 'eye' | 'jaw'> = {
  head_neck: 'hneck',
  head_eye: 'eye',
  head_jaw: 'jaw',
};

const NECK_MAP: Record<string, 'rot' | 'tilt' | 'roll'> = {
  neck_rot: 'rot',
  neck_tilt: 'tilt',
  neck_roll: 'roll',
};

const ARM_JOINTS = new Set(['shoulder', 'lift', 'rotate', 'elbow', 'wrist']);
const HAND_JOINTS = new Set(['thumb', 'index', 'middle', 'ring', 'pinky']);
const LEG_JOINTS = new Set(['hip', 'thigh', 'knee', 'ankle', 'foot']);

/**
 * Update preview always. Send to hardware only if USB connected and send=true.
 * Returns the clamped angle that was applied.
 */
export function applyLocalServoAngle(
  key: string,
  angle: number,
  options?: { send?: boolean },
): number {
  const clamped = clampServoAngle(key, angle);
  const connected = useServoStore.getState().connected;
  // Preview always updates; serial only when connected and requested
  const send = Boolean(options?.send && connected);

  const head = HEAD_MAP[key];
  if (head) {
    useServoStore.getState().setHead(head, clamped, send);
    return clamped;
  }

  const neck = NECK_MAP[key];
  if (neck) {
    useServoStore.getState().setNeck(neck, clamped, send);
    return clamped;
  }

  // l_shoulder / r_elbow / l_thumb / r_hip …
  const m = /^(l|r)_(.+)$/.exec(key);
  if (m) {
    const side = m[1] === 'l' ? 'left' : 'right';
    const joint = m[2];
    const body = useBodyStore.getState();

    if (ARM_JOINTS.has(joint)) {
      body.setArmJoint(side, joint as keyof ArmJoints, clamped, send);
      return clamped;
    }
    if (HAND_JOINTS.has(joint)) {
      body.setHandJoint(side, joint as keyof HandJoints, clamped, send);
      return clamped;
    }
    if (LEG_JOINTS.has(joint)) {
      body.setLegJoint(side, joint as keyof LegJoints, clamped, send);
      return clamped;
    }
  }

  // Unknown key — still try API move if USB on
  if (send) {
    void import('@/lib/api').then(({ moveServoByKey }) => moveServoByKey(key, clamped));
  }
  return clamped;
}
