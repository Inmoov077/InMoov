/** MyRobotLab 1.1.1610 vision & tracking commands → local preset IDs */
export interface VisionCommand {
  id: string;
  label: string;
  desc: string;
  presetId: string;
  mrlPattern?: string;
}

export const VISION_COMMANDS: VisionCommand[] = [
  { id: 'look-left', label: 'Look left', desc: 'MRL lookleftside', presetId: 'mrl-lookleftside', mrlPattern: 'LOOK LEFT' },
  { id: 'look-right', label: 'Look right', desc: 'MRL lookrightside', presetId: 'mrl-lookrightside', mrlPattern: 'LOOK RIGHT' },
  { id: 'look-center', label: 'Look center', desc: 'MRL lookinmiddle', presetId: 'mrl-lookinmiddle', mrlPattern: 'LOOK IN MIDDLE' },
  { id: 'look-up', label: 'Look up', desc: 'MRL lookup', presetId: 'mrl-lookup', mrlPattern: 'LOOK UP' },
  { id: 'look-down', label: 'Look down', desc: 'MRL lookdown', presetId: 'mrl-lookdown', mrlPattern: 'LOOK DOWN' },
  { id: 'yes', label: 'Nod yes', desc: 'MRL Yes gesture', presetId: 'mrl-Yes', mrlPattern: 'YES' },
  { id: 'no', label: 'Shake no', desc: 'MRL No gesture', presetId: 'mrl-No', mrlPattern: 'NO' },
  { id: 'agree', label: 'Agree', desc: 'MRL tiltHeadAgree', presetId: 'mrl-tiltHeadAgree' },
  { id: 'wave', label: 'Wave arm', desc: 'Raise right arm', presetId: 'mrl-raiserightarm', mrlPattern: 'RAISE RIGHT ARM' },
  { id: 'shake-hand', label: 'Shake hand', desc: 'MRL handshake', presetId: 'mrl-shakehand', mrlPattern: 'SHAKE HAND' },
  { id: 'victory', label: 'Victory', desc: 'Peace sign pose', presetId: 'mrl-victory', mrlPattern: 'VICTORY' },
  { id: 'relax', label: 'Relax', desc: 'Return to rest', presetId: 'mrl-relax', mrlPattern: 'REST' },
  { id: 'scan', label: 'Scan room', desc: 'Full pan sweep', presetId: 'scan-room' },
  { id: 'happy', label: 'Happy greet', desc: 'Open-hand greeting', presetId: 'happy-greet' },
];