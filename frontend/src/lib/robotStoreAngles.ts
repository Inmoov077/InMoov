import { DEFAULT_ANGLE_STATE, type AngleState } from '@/lib/robotViewerCore';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';

/** Read all slider values from Zustand stores → 3D angle state. */
export function readStoreAngles(): AngleState {
  const s = useServoStore.getState();
  const b = useBodyStore.getState();
  return {
    ...DEFAULT_ANGLE_STATE,
    headPan: s.hneck,
    eye: s.eye,
    jaw: s.jaw,
    neckRot: s.rot,
    neckTilt: s.tilt,
    neckRoll: s.roll,
    leftArm: { ...b.leftArm },
    rightArm: { ...b.rightArm },
    leftHand: { ...b.leftHand },
    rightHand: { ...b.rightHand },
    leftLeg: { ...b.leftLeg },
    rightLeg: { ...b.rightLeg },
  };
}