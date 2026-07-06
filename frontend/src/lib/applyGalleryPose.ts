import { GALLERY_POSE } from '@/lib/inmoovGalleryRefs';
import { useBodyStore } from '@/store/bodyStore';
import { useServoStore } from '@/store/servoStore';

/** Apply the real InMoov gallery reference pose to all stores (3D + sliders). */
export function applyGalleryPose(send = false) {
  const servo = useServoStore.getState();
  const body = useBodyStore.getState();

  servo.setHead('hneck', GALLERY_POSE.headPan, send);
  servo.setHead('eye', GALLERY_POSE.eye, send);
  servo.setHead('jaw', GALLERY_POSE.jaw, send);
  servo.setNeck('rot', GALLERY_POSE.neckRot, send);
  servo.setNeck('tilt', GALLERY_POSE.neckTilt, send);
  servo.setNeck('roll', GALLERY_POSE.neckRoll, send);

  body.setArm('left', GALLERY_POSE.leftArm, send);
  body.setArm('right', GALLERY_POSE.rightArm, send);
  body.setHand('left', GALLERY_POSE.leftHand, send);
  body.setHand('right', GALLERY_POSE.rightHand, send);
  body.setLeg('left', GALLERY_POSE.leftLeg, send);
  body.setLeg('right', GALLERY_POSE.rightLeg, send);
}