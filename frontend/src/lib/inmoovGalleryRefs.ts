/** Reference photos — user uploads + InMoov.fr gallery (Gael Langevin, CC BY-NC). */
export interface GalleryRef {
  id: string;
  label: string;
  src: string;
  credit: string;
}

export const LOCAL_REFS: GalleryRef[] = [
  {
    id: 'real-1',
    label: 'Built InMoov — arms forward',
    src: '/assets/inmoov-ref/real-robot-1.jpg',
    credit: 'InMoov Photo · Gael Langevin',
  },
  {
    id: 'real-2',
    label: 'Built InMoov — portrait',
    src: '/assets/inmoov-ref/real-robot-2.jpg',
    credit: 'InMoov Photo · Gael Langevin',
  },
];

export const GALLERY_REFS: GalleryRef[] = [
  ...LOCAL_REFS,
  {
    id: 'gallery-hands',
    label: 'Hand detail',
    src: 'https://inmoov.fr/wp-content/uploads/2015/07/inmoov_robot_hand_3d_print1.jpg',
    credit: 'inmoov.fr/gallery-v2',
  },
  {
    id: 'gallery-arm',
    label: 'Arm assembly',
    src: 'https://inmoov.fr/wp-content/uploads/2015/07/inmoov_robot_arm_3d_print291.jpg',
    credit: 'inmoov.fr/gallery-v2',
  },
  {
    id: 'gallery-head',
    label: 'Head build',
    src: 'https://inmoov.fr/wp-content/uploads/2015/07/inmoov-robot-head-3d-print462.jpg',
    credit: 'inmoov.fr/gallery-v2',
  },
];

import type { AngleState } from '@/lib/robotViewerCore';

/** Pose matching the reference photo — arms resting forward, hands open. */
export const GALLERY_POSE: AngleState = {
  headPan: 82,
  eye: 88,
  jaw: 8,
  neckRot: 58,
  neckTilt: 48,
  neckRoll: 118,
  leftArm: { shoulder: 55, lift: 95, rotate: 88, elbow: 35, wrist: 92 },
  rightArm: { shoulder: 125, lift: 95, rotate: 92, elbow: 35, wrist: 88 },
  leftHand: { thumb: 15, index: 12, middle: 12, ring: 12, pinky: 12 },
  rightHand: { thumb: 15, index: 12, middle: 12, ring: 12, pinky: 12 },
  leftLeg: { hip: 90, thigh: 88, knee: 12, ankle: 92, foot: 90 },
  rightLeg: { hip: 90, thigh: 88, knee: 12, ankle: 92, foot: 90 },
};