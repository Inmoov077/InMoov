/**
 * Snap UI stores + 3D mesh to perfect default (open hands, arms at side).
 */
import { getNeutralAngleState, getRestArm, getRestHand, getRestLeg, REST_HEAD } from '@/lib/restPose';
import { driveLiveRobot } from '@/lib/robotLiveController';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';

export function applyNeutralPose(options?: { send?: boolean }): void {
  const send = options?.send ?? false;
  const neutral = getNeutralAngleState();
  const hand = getRestHand();

  useServoStore.setState({
    hneck: REST_HEAD.hneck,
    eye: REST_HEAD.eye,
    jaw: REST_HEAD.jaw,
    rot: REST_HEAD.rot,
    tilt: REST_HEAD.tilt,
    roll: REST_HEAD.roll,
  });

  useBodyStore.setState({
    leftArm: getRestArm('left'),
    rightArm: getRestArm('right'),
    leftHand: { ...hand },
    rightHand: { ...hand },
    leftLeg: getRestLeg('left'),
    rightLeg: getRestLeg('right'),
  });

  driveLiveRobot(neutral);

  if (send && useServoStore.getState().connected) {
    void useBodyStore.getState().sendFullBody();
    void useServoStore.getState().sendCombined();
  }
}
