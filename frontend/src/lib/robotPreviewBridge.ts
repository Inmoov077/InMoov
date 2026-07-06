import { syncLiveRobot } from '@/lib/robotLiveController';

/** Called from every store setter — updates 3D preview immediately. */
export function notifyRobotPreview(): void {
  syncLiveRobot();
}