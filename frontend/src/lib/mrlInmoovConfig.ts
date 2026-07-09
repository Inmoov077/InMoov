/** InMoove Studio body map + panel definitions (assets from InMoove Core). */

export const MRL_ASSET = (path: string) => `/api/core/assets/${path}`;

export interface InMoovButton {
  name: string;
  type: 'circular' | 'absolute';
  x?: number;
  y?: number;
  translate?: string;
}

const CENTER_X = 238;
const CENTER_Y = 226;
const RADIUS = 215;
const START_ANGLE = 234.5 * (Math.PI / 180);
const CIRCULAR_NAMES = ['brain', 'mouth', 'head', 'torso', 'extra', 'leg', 'sensor', 'arm', 'hand', 'ear'] as const;

export function buildInMoovButtons(): InMoovButton[] {
  const buttons: InMoovButton[] = CIRCULAR_NAMES.map((name) => ({ name, type: 'circular' }));
  buttons.push({ name: 'InMoov', type: 'absolute', x: 157, y: 150 });
  const dangle = (360 / CIRCULAR_NAMES.length) * (Math.PI / 180);
  let angle = START_ANGLE;
  let ci = 0;
  for (const b of buttons) {
    if (b.type === 'circular') {
      angle += dangle;
      const x = Math.round(CENTER_X + RADIUS * Math.cos(angle));
      const y = Math.round(CENTER_Y + RADIUS * Math.sin(angle));
      b.translate = `${x}px,${y}px`;
      ci++;
    } else {
      b.translate = `${b.x}px,${b.y}px`;
    }
  }
  return buttons;
}

export const INMOOV_BUTTONS = buildInMoovButtons();

export const HEAD_SERVOS = [
  { key: 'rothead', service: 'i01.head.rothead', label: 'rothead' },
  { key: 'neck', service: 'i01.head.neck', label: 'neck' },
  { key: 'rollNeck', service: 'i01.head.rollNeck', label: 'rollNeck' },
  { key: 'eyeX', service: 'i01.head.eyeX', label: 'eyeX' },
  { key: 'eyeY', service: 'i01.head.eyeY', label: 'eyeY' },
  { key: 'jaw', service: 'i01.head.jaw', label: 'jaw' },
  { key: 'eyelidLeft', service: 'i01.head.eyelidLeft', label: 'eyelidLeft' },
  { key: 'eyelidRight', service: 'i01.head.eyelidRight', label: 'eyelidRight' },
] as const;

export const ARM_SERVOS = {
  left: [
    { key: 'shoulder', service: 'i01.leftArm.shoulder', label: 'shoulder' },
    { key: 'omoplate', service: 'i01.leftArm.omoplate', label: 'omoplate' },
    { key: 'rotate', service: 'i01.leftArm.rotate', label: 'rotate' },
    { key: 'bicep', service: 'i01.leftArm.bicep', label: 'bicep' },
  ],
  right: [
    { key: 'shoulder', service: 'i01.rightArm.shoulder', label: 'shoulder' },
    { key: 'omoplate', service: 'i01.rightArm.omoplate', label: 'omoplate' },
    { key: 'rotate', service: 'i01.rightArm.rotate', label: 'rotate' },
    { key: 'bicep', service: 'i01.rightArm.bicep', label: 'bicep' },
  ],
} as const;

export const TORSO_SERVOS = [
  { key: 'topStom', service: 'i01.torso.topStom', label: 'topStom' },
  { key: 'midStom', service: 'i01.torso.midStom', label: 'midStom' },
  { key: 'lowStom', service: 'i01.torso.lowStom', label: 'lowStom' },
] as const;

export const I01_PEERS: Record<string, { label: string; icon: string; peerKey: string }> = {
  brain: { label: 'Chat Bot / Brain', icon: MRL_ASSET('Brain.png'), peerKey: 'chatBot' },
  mouth: { label: 'Mouth / Speech', icon: MRL_ASSET('img/InMoov2/mouth_Activ.png'), peerKey: 'mouth' },
  head: { label: 'Head', icon: MRL_ASSET('InMoov2Head.png'), peerKey: 'head' },
  torso: { label: 'Torso', icon: MRL_ASSET('InMoov2Torso.png'), peerKey: 'torso' },
  arm: { label: 'Arms', icon: MRL_ASSET('InMoov2Arm.png'), peerKey: 'leftArm' },
  hand: { label: 'Hands', icon: MRL_ASSET('img/InMoov2/hand_Activ.png'), peerKey: 'leftHand' },
  ear: { label: 'Ear / Voice', icon: MRL_ASSET('InMoov2Ear.png'), peerKey: 'ear' },
  leg: { label: 'Legs', icon: MRL_ASSET('img/InMoov2/legL_Activ.png'), peerKey: 'leftLeg' },
  sensor: { label: 'Sensors', icon: MRL_ASSET('img/InMoov2/sensor_Activ.png'), peerKey: 'opencv' },
  extra: { label: 'Extra', icon: MRL_ASSET('img/InMoov2/extra_Activ.png'), peerKey: 'leap' },
  opencv: { label: 'OpenCV Vision', icon: MRL_ASSET('OpenCV.png'), peerKey: 'opencv' },
};

export type InMoovPanel =
  | 'InMoov'
  | 'brain'
  | 'mouth'
  | 'head'
  | 'torso'
  | 'extra'
  | 'leg'
  | 'sensor'
  | 'arm'
  | 'hand'
  | 'ear'
  | 'settings'
  | 'gestures'
  | 'runtime';