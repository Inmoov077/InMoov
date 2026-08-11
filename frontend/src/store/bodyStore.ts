import { create } from 'zustand';
import * as api from '@/lib/api';
import {
  DEFAULT_HAND,
  DEFAULT_LEG,
  HAND_JOINT_META,
  LEG_JOINT_META,
  type ArmJoints,
  type BodySide,
  type HandJoints,
  type LegJoints,
} from '@/lib/bodyConfig';
import { getSafeArmRest, sanitizeArm } from '@/lib/armSafety';
import { notifyRobotPreview } from '@/lib/robotPreviewBridge';
import { clamp } from '@/lib/utils';
import { clampServoAngle } from '@/store/limitStore';
import { useServoStore } from '@/store/servoStore';

interface BodyState {
  leftArm: ArmJoints;
  rightArm: ArmJoints;
  leftHand: HandJoints;
  rightHand: HandJoints;
  leftLeg: LegJoints;
  rightLeg: LegJoints;

  setArmJoint: (side: BodySide, joint: keyof ArmJoints, value: number, send?: boolean) => void;
  setHandJoint: (side: BodySide, joint: keyof HandJoints, value: number, send?: boolean) => void;
  setLegJoint: (side: BodySide, joint: keyof LegJoints, value: number, send?: boolean) => void;
  setArm: (side: BodySide, values: Partial<ArmJoints>, send?: boolean) => void;
  setHand: (side: BodySide, values: Partial<HandJoints>, send?: boolean) => void;
  setLeg: (side: BodySide, values: Partial<LegJoints>, send?: boolean) => void;
  centerArms: () => void;
  centerHands: () => void;
  centerLegs: () => void;
  centerBody: () => void;
  sendArm: (side: BodySide) => Promise<void>;
  sendHand: (side: BodySide) => Promise<void>;
  sendLeg: (side: BodySide) => Promise<void>;
  sendFullBody: () => Promise<void>;
}

let bodyThrottle: ReturnType<typeof setTimeout> | null = null;
/** Snappier real-time arm/hand/leg control while keeping serial traffic stable. */
const BODY_THROTTLE_MS = 45;

function scheduleBodySend(fn: () => void) {
  if (bodyThrottle) clearTimeout(bodyThrottle);
  bodyThrottle = setTimeout(() => {
    bodyThrottle = null;
    fn();
  }, BODY_THROTTLE_MS);
}

function logBody(type: 'send' | 'error', msg: string) {
  useServoStore.getState().log(type, msg);
}

export const useBodyStore = create<BodyState>((set, get) => ({
  leftArm: getSafeArmRest('left'),
  rightArm: getSafeArmRest('right'),
  leftHand: { ...DEFAULT_HAND },
  rightHand: { ...DEFAULT_HAND },
  leftLeg: { ...DEFAULT_LEG },
  rightLeg: { ...DEFAULT_LEG },

  setArmJoint: (side, joint, value, send = true) => {
    const key = side === 'left' ? 'leftArm' : 'rightArm';
    set((s) => {
      // Full-arm sanitize: hard walls + anti-overlap (may ease sibling joints)
      const next = sanitizeArm(side, { ...s[key], [joint]: value }, s[key]);
      return { [key]: next };
    });
    notifyRobotPreview();
    if (send && useServoStore.getState().connected) {
      scheduleBodySend(() => get().sendArm(side));
    }
  },

  setHandJoint: (side, joint, value, send = true) => {
    const key = side === 'left' ? 'leftHand' : 'rightHand';
    const meta = HAND_JOINT_META.find((m) => m.key === joint);
    const sk = `${side === 'left' ? 'l' : 'r'}_${joint}`;
    const base = clamp(Number(value), meta?.min ?? 0, meta?.max ?? 180);
    const v = clampServoAngle(sk, base);
    set((s) => ({ [key]: { ...s[key], [joint]: v } }));
    notifyRobotPreview();
    if (send && useServoStore.getState().connected) {
      scheduleBodySend(() => get().sendHand(side));
    }
  },

  setLegJoint: (side, joint, value, send = true) => {
    const key = side === 'left' ? 'leftLeg' : 'rightLeg';
    const meta = LEG_JOINT_META.find((m) => m.key === joint);
    const sk = `${side === 'left' ? 'l' : 'r'}_${joint}`;
    const base = clamp(Number(value), meta?.min ?? 0, meta?.max ?? 180);
    const v = clampServoAngle(sk, base);
    set((s) => ({ [key]: { ...s[key], [joint]: v } }));
    notifyRobotPreview();
    if (send && useServoStore.getState().connected) {
      scheduleBodySend(() => get().sendLeg(side));
    }
  },

  setArm: (side, values, send = true) => {
    const key = side === 'left' ? 'leftArm' : 'rightArm';
    set((s) => ({ [key]: sanitizeArm(side, { ...s[key], ...values }, s[key]) }));
    notifyRobotPreview();
    if (send && useServoStore.getState().connected) get().sendArm(side);
  },

  setHand: (side, values, send = true) => {
    const key = side === 'left' ? 'leftHand' : 'rightHand';
    set((s) => ({ [key]: { ...s[key], ...values } }));
    notifyRobotPreview();
    if (send && useServoStore.getState().connected) get().sendHand(side);
  },

  setLeg: (side, values, send = true) => {
    const key = side === 'left' ? 'leftLeg' : 'rightLeg';
    set((s) => ({ [key]: { ...s[key], ...values } }));
    notifyRobotPreview();
    if (send && useServoStore.getState().connected) get().sendLeg(side);
  },

  centerArms: () => {
    set({ leftArm: getSafeArmRest('left'), rightArm: getSafeArmRest('right') });
    notifyRobotPreview();
    if (useServoStore.getState().connected) {
      get().sendArm('left');
      get().sendArm('right');
    }
  },

  centerHands: () => {
    set({ leftHand: { ...DEFAULT_HAND }, rightHand: { ...DEFAULT_HAND } });
    notifyRobotPreview();
    if (useServoStore.getState().connected) {
      get().sendHand('left');
      get().sendHand('right');
    }
  },

  centerLegs: () => {
    set({ leftLeg: { ...DEFAULT_LEG }, rightLeg: { ...DEFAULT_LEG } });
    notifyRobotPreview();
    if (useServoStore.getState().connected) {
      get().sendLeg('left');
      get().sendLeg('right');
    }
  },

  centerBody: () => {
    get().centerArms();
    get().centerHands();
    get().centerLegs();
  },

  sendArm: async (side) => {
    // Final safety pass before serial — never send out-of-range or overlapping pose
    const arm = sanitizeArm(side, side === 'left' ? get().leftArm : get().rightArm);
    const storeKey = side === 'left' ? 'leftArm' : 'rightArm';
    set({ [storeKey]: arm });
    const res = await api.sendArm(side, arm);
    if (res.ok && useServoStore.getState().connected) {
      const prefix = side === 'left' ? 'LA' : 'RA';
      logBody('send', `${prefix},${arm.shoulder},${arm.lift},${arm.rotate},${arm.elbow},${arm.wrist}`);
    }
  },

  sendHand: async (side) => {
    const hand = side === 'left' ? get().leftHand : get().rightHand;
    const res = await api.sendHand(side, hand);
    if (res.ok && useServoStore.getState().connected) {
      const prefix = side === 'left' ? 'LH' : 'RH';
      logBody('send', `${prefix},${hand.thumb},${hand.index},${hand.middle},${hand.ring},${hand.pinky}`);
    }
  },

  sendLeg: async (side) => {
    const leg = side === 'left' ? get().leftLeg : get().rightLeg;
    const res = await api.sendLeg(side, leg);
    if (res.ok && useServoStore.getState().connected) {
      const prefix = side === 'left' ? 'LL' : 'RL';
      logBody('send', `${prefix},${leg.hip},${leg.thigh},${leg.knee},${leg.ankle},${leg.foot}`);
    }
  },

  sendFullBody: async () => {
    const s = get();
    const leftArm = sanitizeArm('left', s.leftArm);
    const rightArm = sanitizeArm('right', s.rightArm);
    set({ leftArm, rightArm });
    const res = await api.sendFullBody({
      leftArm,
      rightArm,
      leftHand: s.leftHand,
      rightHand: s.rightHand,
      leftLeg: s.leftLeg,
      rightLeg: s.rightLeg,
    });
    if (res.ok && useServoStore.getState().connected) {
      logBody('send', 'BODY full update');
    }
  },
}));