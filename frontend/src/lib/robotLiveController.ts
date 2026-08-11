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
let easeFactor = 0.55;
const DEFAULT_EASE = 0.55;
const SNAP = 0.2;

/** Global move playback flag — wake animation / other callers should not fight Moves */
let playbackLocked = false;

export function nextLiveGeneration(): number {
  return ++liveGeneration;
}

export function isPlaybackLocked(): boolean {
  return playbackLocked;
}

export function setPlaybackLocked(locked: boolean): void {
  playbackLocked = locked;
}

/** Deep copy so nested arm/hand/leg objects never share refs (prevents frozen poses). */
export function cloneAngles(a: AngleState): AngleState {
  return {
    headPan: a.headPan,
    eye: a.eye,
    jaw: a.jaw,
    neckRot: a.neckRot,
    neckTilt: a.neckTilt,
    neckRoll: a.neckRoll,
    leftArm: { ...a.leftArm },
    rightArm: { ...a.rightArm },
    leftHand: { ...a.leftHand },
    rightHand: { ...a.rightHand },
    leftLeg: { ...a.leftLeg },
    rightLeg: { ...a.rightLeg },
  };
}

function paintFrame(): void {
  if (!liveViewer || !liveRobot) return;
  try {
    if (current) applyAngles(liveRobot, current);
    liveRobot.root.updateMatrixWorld(true);
    liveViewer.controls.update();
    liveViewer.renderer.render(liveViewer.scene, liveViewer.camera);
  } catch (err) {
    console.warn('[liveRobot] paint failed', err);
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpObj<T extends Record<string, number>>(a: T, b: T, t: number): T {
  const out = { ...a } as T;
  for (const k of Object.keys(b) as (keyof T)[]) {
    const av = Number(a[k] ?? b[k] ?? 0);
    const bv = Number(b[k] ?? av);
    (out as Record<string, number>)[k as string] = lerp(av, bv, t);
  }
  return out;
}

function lerpAngles(a: AngleState, b: AngleState, t: number): AngleState {
  return {
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
    m = Math.max(m, Math.abs(Number(x) - Number(y)));
  };
  check(a.headPan, b.headPan);
  check(a.eye, b.eye);
  check(a.jaw, b.jaw);
  check(a.neckRot, b.neckRot);
  check(a.neckTilt, b.neckTilt);
  check(a.neckRoll, b.neckRoll);
  for (const k of Object.keys(b.leftArm) as (keyof typeof b.leftArm)[]) {
    check(a.leftArm?.[k] ?? 0, b.leftArm[k]);
    check(a.rightArm?.[k] ?? 0, b.rightArm[k]);
  }
  for (const k of Object.keys(b.leftHand) as (keyof typeof b.leftHand)[]) {
    check(a.leftHand?.[k] ?? 0, b.leftHand[k]);
    check(a.rightHand?.[k] ?? 0, b.rightHand[k]);
  }
  for (const k of Object.keys(b.leftLeg) as (keyof typeof b.leftLeg)[]) {
    check(a.leftLeg?.[k] ?? 0, b.leftLeg[k]);
    check(a.rightLeg?.[k] ?? 0, b.rightLeg[k]);
  }
  return m;
}

function tickSmooth(): void {
  rafId = null;
  if (!liveRobot || !target) return;
  if (!current) current = cloneAngles(target);

  const delta = maxDelta(current, target);
  const t =
    delta > 30 ? Math.max(easeFactor, 0.75) : delta > 12 ? Math.max(easeFactor, 0.6) : easeFactor;

  current = lerpAngles(current, target, t);
  applyAngles(liveRobot, current);
  paintFrame();

  if (maxDelta(current, target) > SNAP) {
    rafId = requestAnimationFrame(tickSmooth);
  } else {
    current = cloneAngles(target);
    applyAngles(liveRobot, current);
    paintFrame();
    easeFactor = DEFAULT_EASE;
  }
}

export function setLiveRobot(robot: RobotModel | null, generation: number, viewer?: ViewerScene): void {
  if (generation !== liveGeneration) return;
  liveRobot = robot;
  if (viewer) liveViewer = viewer;
  onStatusChange?.(robot != null);
  if (robot) {
    // If a gesture is mid-play, re-bind to last pose (remount-safe)
    const a = current ? cloneAngles(current) : cloneAngles(readStoreAngles());
    current = a;
    target = cloneAngles(a);
    applyAngles(robot, a);
    paintFrame();
  }
}

export function clearLiveRobot(generation: number): void {
  if (generation !== liveGeneration) return;
  // During active gesture playback, keep angle state so a remount can resume the pose
  liveRobot = null;
  liveViewer = null;
  if (!playbackLocked) {
    current = null;
    target = null;
  }
  if (rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  onStatusChange?.(false);
}

export function setLiveRobotStatusListener(fn: ((ready: boolean) => void) | null): void {
  onStatusChange = fn;
}

export type SyncLiveOptions = {
  /** Jump 3D pose immediately (no ease) — use during Moves playback */
  snap?: boolean;
  /** Temporary ease override for this sync (0–1) */
  ease?: number;
};

/**
 * Push pose to the live 3D robot.
 * Always deep-clones. Snap mode guarantees the mesh updates this frame.
 */
export function syncLiveRobot(angles?: AngleState, options?: SyncLiveOptions): void {
  if (!liveRobot) {
    // Keep target even if robot not ready (applied on setLiveRobot)
    if (angles) {
      target = cloneAngles(angles);
      current = cloneAngles(angles);
    }
    return;
  }
  const next = cloneAngles(angles ?? readStoreAngles());
  target = next;
  if (!current) current = cloneAngles(next);

  if (options?.ease != null) {
    easeFactor = Math.min(1, Math.max(0.05, options.ease));
  }

  const doSnap = options?.snap === true || (playbackLocked && options?.snap !== false);
  if (doSnap) {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    current = cloneAngles(next);
    applyAngles(liveRobot, current);
    paintFrame();
    easeFactor = DEFAULT_EASE;
    return;
  }

  if (rafId == null) rafId = requestAnimationFrame(tickSmooth);
}

/**
 * Force a pose onto the 3D robot immediately (Moves / keyframe driver).
 * Safe to call every animation frame. Keeps pose even if robot briefly null.
 */
export function driveLiveRobot(angles: AngleState): void {
  const next = cloneAngles(angles);
  target = next;
  current = cloneAngles(next);
  if (rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (!liveRobot) return;
  applyAngles(liveRobot, current);
  paintFrame();
}

/** Last pose the 3D robot is showing (for per-frame re-apply). */
export function getLiveDisplayAngles(): AngleState | null {
  return current ? cloneAngles(current) : null;
}

export function isLiveRobotReady(): boolean {
  return liveRobot != null;
}

/** Re-apply current pose onto robot (call from the viewer render loop). */
export function reapplyLiveAngles(): void {
  if (!liveRobot || !current) return;
  try {
    applyAngles(liveRobot, current);
  } catch {
    /* ignore single-frame glitches */
  }
}
