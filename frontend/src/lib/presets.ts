export interface PresetKeyframe {
  hneck: number;
  eye: number;
  jaw: number;
  rot: number;
  tilt: number;
  roll: number;
  hold: number;
}

export const PRESETS: Record<string, PresetKeyframe[]> = {
  nod: [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 80, roll: 120, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 20, roll: 120, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
  ],
  shake: [
    { hneck: 90, eye: 60, jaw: 0, rot: 10, tilt: 50, roll: 170, hold: 1500 },
    { hneck: 90, eye: 120, jaw: 0, rot: 110, tilt: 50, roll: 70, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
  ],
  'tilt-side': [
    { hneck: 90, eye: 90, jaw: 0, rot: 10, tilt: 50, roll: 170, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 110, tilt: 50, roll: 70, hold: 1500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'look-around': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 90, eye: 60, jaw: 0, rot: 20, tilt: 70, roll: 160, hold: 2000 },
    { hneck: 90, eye: 120, jaw: 0, rot: 100, tilt: 70, roll: 80, hold: 2000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  bow: [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 90, eye: 90, jaw: 10, rot: 60, tilt: 15, roll: 120, hold: 2500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'wave-head': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
    { hneck: 80, eye: 60, jaw: 20, rot: 20, tilt: 70, roll: 160, hold: 2000 },
    { hneck: 100, eye: 120, jaw: 20, rot: 100, tilt: 30, roll: 80, hold: 2000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'happy-greet': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 500 },
    { hneck: 80, eye: 90, jaw: 40, rot: 60, tilt: 70, roll: 120, hold: 600 },
    { hneck: 90, eye: 90, jaw: 5, rot: 60, tilt: 50, roll: 120, hold: 400 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1000 },
  ],
  'scan-room': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 70, roll: 120, hold: 1000 },
    { hneck: 90, eye: 60, jaw: 0, rot: 10, tilt: 70, roll: 170, hold: 2500 },
    { hneck: 90, eye: 120, jaw: 0, rot: 110, tilt: 70, roll: 70, hold: 2500 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 1500 },
  ],
  'idle-breathe': [
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 2000 },
    { hneck: 88, eye: 88, jaw: 0, rot: 60, tilt: 55, roll: 120, hold: 3000 },
    { hneck: 90, eye: 90, jaw: 0, rot: 60, tilt: 50, roll: 120, hold: 2000 },
  ],
};

export const PRESET_META: { id: string; name: string; desc: string; icon: string }[] = [
  { id: 'nod', name: 'Nod Yes', desc: 'Tilt up and down', icon: '↕' },
  { id: 'shake', name: 'Shake No', desc: 'Rotate left and right', icon: '↔' },
  { id: 'tilt-side', name: 'Think / Tilt', desc: 'Side roll motion', icon: '↩' },
  { id: 'look-around', name: 'Look Around', desc: 'Scan the environment', icon: '◎' },
  { id: 'bow', name: 'Bow', desc: 'Polite greeting bow', icon: '⌄' },
  { id: 'wave-head', name: 'Robot Dance', desc: 'Multi-axis pattern', icon: '✦' },
  { id: 'happy-greet', name: 'Happy Greet', desc: 'Jaw + eye animation', icon: '☺' },
  { id: 'scan-room', name: 'Scan Room', desc: 'Full pan sweep', icon: '⌖' },
  { id: 'idle-breathe', name: 'Idle Breathe', desc: 'Subtle life motion', icon: '∿' },
];