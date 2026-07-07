import { useServoStore } from '@/store/servoStore';

export type RobotMood = 'happy' | 'surprised' | 'thinking' | 'sad' | 'normal' | string;

/** Map AI / MRL mood tokens → head & neck servo angles (from legacy dashboard). */
export function playMoodExpression(mood: RobotMood): void {
  const { setHead, setNeck } = useServoStore.getState();
  const m = (mood || 'normal').toLowerCase();

  switch (m) {
    case 'happy':
    case 'smile':
    case 'excited':
      setHead('hneck', 75, false);
      setTimeout(() => setHead('hneck', 105, false), 350);
      setTimeout(() => setHead('hneck', 90, true), 700);
      setHead('eye', 90, true);
      break;
    case 'surprised':
    case 'shock':
      setHead('hneck', 70, true);
      setHead('eye', 90, true);
      break;
    case 'thinking':
    case 'curious':
      setHead('hneck', 110, true);
      setHead('eye', 130, true);
      setNeck('tilt', 120, true);
      break;
    case 'sad':
    case 'unhappy':
      setHead('hneck', 120, true);
      setHead('eye', 50, true);
      setNeck('tilt', 65, true);
      break;
    default:
      setHead('hneck', 85, true);
      setHead('eye', 90, true);
      setNeck('tilt', 50, true);
  }
}