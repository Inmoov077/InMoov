/**
 * Local event bus for InMoove Core.
 * No external MyRobotLab WebSocket (port 8888) — vision frames come from browser Camera.
 */

type Handler = (data: unknown) => void;

const handlers = new Set<Handler>();
const opencvHandlers = new Set<(frame: string | null) => void>();
let latestFrame: string | null = null;

export function getMrlWsUrl(): string {
  return 'local://inmoove-core';
}

export function connectMrlWebSocket(): void {
  // no-op: InMoove Core is always local; no remote bus required
}

export function disconnectMrlWebSocket(): void {
  // no-op
}

export function onMrlWsEvent(handler: Handler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function onOpencvFrame(handler: (frame: string | null) => void): () => void {
  opencvHandlers.add(handler);
  handler(latestFrame);
  return () => opencvHandlers.delete(handler);
}

export function getLatestOpencvFrame(): string | null {
  return latestFrame;
}

/** Optional helper if browser camera publishes a preview frame later. */
export function publishLocalOpencvFrame(frame: string | null): void {
  latestFrame = frame;
  for (const h of opencvHandlers) h(frame);
}
