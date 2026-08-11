import { applyAngles, type AngleState, type RobotModel, type ViewerScene } from '@/lib/robotViewerCore';
import { readStoreAngles } from '@/lib/robotStoreAngles';

let liveRobot: RobotModel | null = null;
let liveViewer: ViewerScene | null = null;
let liveGeneration = 0;
let onStatusChange: ((ready: boolean) => void) | null = null;

/** Smooth motor-like preview: current pose lerps toward target */
let current: AngleState | null = null;
let target: AngleState | null = null;
let rafId: number | null = null;
const EASE = 0.14; // lower = smoother / slower (servo-like)
const SNAP = 0.35; // degrees — stop when close enough

export function nextLiveGeneration(): number {
  return ++liveGeneration;
}

function paintFrame(): void {
  if (!liveViewer || !liveRobot) return;
  liveRobot.root.updateMatrixWorld(true);
  liveViewer.controls.update();
  liveViewer.renderer.render(liveViewer.scene, liveViewer.camera);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpObj<T extends Record<string, number>>(a: T, b: T, t: number): T {
  const out = { ...a };
  for (const k of Object.keys(b) as (keyof T)[]) {
    const av = Number(a[k] ?? b[k] ?? 0);
    const bv = Number(b[k] ?? av);
    out[k] = lerp(av, bv, t) as T[keyof T];
  }
  return out;
}

function lerpAngles(a: AngleState, b: AngleState, t: number): AngleState {
  return {
    ...a,
    headPan: lerp(a.headPan, b.headPan, t),
    eye: lerp(a.eye, b.eye, t),
    jaw: lerp(a.jaw, b.jaw, t),
    neckRot: lerp(a.neckRot, b.neckRot, t),
    neckTilt: lerp(a.neckTilt, b.neckTilt, t),
    neckRoll: lerp(a.neckRoll, b.neckRoll, t),
    leftArm: lerpObj(a.leftArm, b.leftArm, t),
    rightArm: lerpObj(a.rightArm, b.rightArm, t),
    leftHand: lerpObj(a.leftHand, b.leftHand, t),
    rightHand: lerpObj(a.rightHand, b.rightHand, t),
    leftLeg: lerpObj(a.leftLeg, b.leftLeg, t),
    rightLeg: lerpObj(a.rightLeg, b.rightLeg, t),
  };
}

function maxDelta(a: AngleState, b: AngleState): number {
  let m = 0;
  const check = (x: number, y: number) => {
    m = Math.max(m, Math.abs(x - y));
  };
  check(a.headPan, b.headPan);
  check(a.eye, b.eye);
  check(a.jaw, b.jaw);
  check(a.neckRot, b.neckRot);
  check(a.neckTilt, b.neckTilt);
  check(a.neckRoll, b.neckRoll);
  for (const k of Object.keys(b.leftArm) as (keyof typeof b.leftArm)[]) {
    check(a.leftArm[k], b.leftArm[k]);
    check(a.rightArm[k], b.rightArm[k]);
  }
  for (const k of Object.keys(b.leftHand) as (keyof typeof b.leftHand)[]) {
    check(a.leftHand[k], b.leftHand[k]);
    check(a.rightHand[k], b.rightHand[k]);
  }
  for (const k of Object.keys(b.leftLeg) as (keyof typeof b.leftLeg)[]) {
    check(a.leftLeg[k], b.leftLeg[k]);
    check(a.rightLeg[k], b.rightLeg[k]);
  }
  return m;
}

function tickSmooth(): void {
  rafId = null;
  if (!liveRobot || !target) return;
  if (!current) current = { ...target };

  current = lerpAngles(current, target, EASE);
  applyAngles(liveRobot, current);
  paintFrame();

  if (maxDelta(current, target) > SNAP) {
    rafId = requestAnimationFrame(tickSmooth);
  } else {
    current = { ...target };
    applyAngles(liveRobot, current);
    paintFrame();
  }
}

export function setLiveRobot(robot: RobotModel | null, generation: number, viewer?: ViewerScene): void {
  if (generation !== liveGeneration) return;
  liveRobot = robot;
  if (viewer) liveViewer = viewer;
  onStatusChange?.(robot != null);
  if (robot) {
    const a = readStoreAngles();
    current = a;
    target = a;
    applyAngles(robot, a);
    paintFrame();
  }
}

export function clearLiveRobot(generation: number): void {
  if (generation !== liveGeneration) return;
  liveRobot = null;
  liveViewer = null;
  current = null;
  target = null;
  if (rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  onStatusChange?.(false);
}

export function setLiveRobotStatusListener(fn: ((ready: boolean) => void) | null): void {
  onStatusChange = fn;
}

/** Push slider store values — 3D eases smoothly like a servo (not instant snap). */
export function syncLiveRobot(angles?: AngleState): void {
  if (!liveRobot) return;
  target = angles ?? readStoreAngles();
  if (!current) current = { ...target };
  if (rafId == null) rafId = requestAnimationFrame(tickSmooth);
}

export function isLiveRobotReady(): boolean {
  return liveRobot != null;
}
