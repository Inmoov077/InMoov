import { applyAngles, type AngleState, type RobotModel, type ViewerScene } from '@/lib/robotViewerCore';
import { readStoreAngles } from '@/lib/robotStoreAngles';

let liveRobot: RobotModel | null = null;
let liveViewer: ViewerScene | null = null;
let liveGeneration = 0;
let onStatusChange: ((ready: boolean) => void) | null = null;

export function nextLiveGeneration(): number {
  return ++liveGeneration;
}

function paintFrame(): void {
  if (!liveViewer || !liveRobot) return;
  liveRobot.root.updateMatrixWorld(true);
  liveViewer.controls.update();
  liveViewer.renderer.render(liveViewer.scene, liveViewer.camera);
}

export function setLiveRobot(robot: RobotModel | null, generation: number, viewer?: ViewerScene): void {
  if (generation !== liveGeneration) return;
  liveRobot = robot;
  if (viewer) liveViewer = viewer;
  onStatusChange?.(robot != null);
  if (robot) {
    applyAngles(robot, readStoreAngles());
    paintFrame();
  }
}

export function clearLiveRobot(generation: number): void {
  if (generation !== liveGeneration) return;
  liveRobot = null;
  liveViewer = null;
  onStatusChange?.(false);
}

export function setLiveRobotStatusListener(fn: ((ready: boolean) => void) | null): void {
  onStatusChange = fn;
}

/** Push slider store values to the loaded URDF model immediately. */
export function syncLiveRobot(angles?: AngleState): void {
  if (!liveRobot) return;
  applyAngles(liveRobot, angles ?? readStoreAngles());
  paintFrame();
}

export function isLiveRobotReady(): boolean {
  return liveRobot != null;
}