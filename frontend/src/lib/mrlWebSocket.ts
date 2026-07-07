/**
 * Native MyRobotLab WebSocket client — receives onWebDisplay frames for OpenCV etc.
 * Mirrors mrl.js transport to localhost:8888/api/messages
 */

type MrlWsHandler = (method: string, data: unknown) => void;

let socket: WebSocket | null = null;
let handlers: MrlWsHandler[] = [];
let opencvFrame: string | null = null;
let frameListeners: ((src: string | null) => void)[] = [];

function parseMessage(raw: string) {
  try {
    const msg = JSON.parse(raw);
    const method = msg?.method ?? msg?.msg?.method;
    const data = msg?.data?.[0] ?? msg?.msg?.data?.[0] ?? msg?.data;
    if (method === 'onWebDisplay' && data && typeof data === 'object') {
      const frame = (data as { data?: string }).data;
      if (frame) {
        opencvFrame = frame.startsWith('data:') ? frame : `data:image/jpeg;base64,${frame}`;
        frameListeners.forEach((fn) => fn(opencvFrame));
      }
    }
    handlers.forEach((h) => h(method, data));
  } catch {
    /* ignore malformed */
  }
}

export function getMrlWsUrl(): string {
  const host = window.location.hostname || 'localhost';
  const id = `inmoov-ui-${Date.now()}`;
  return `ws://${host}:8888/api/messages?user=root&pwd=pwd&session_id=inmoov&id=${id}`;
}

export function connectMrlWebSocket(onConnect?: () => void) {
  if (socket?.readyState === WebSocket.OPEN) return;
  try {
    socket = new WebSocket(getMrlWsUrl());
    socket.onopen = () => onConnect?.();
    socket.onmessage = (ev) => parseMessage(typeof ev.data === 'string' ? ev.data : '');
    socket.onclose = () => {
      socket = null;
      setTimeout(() => connectMrlWebSocket(), 3000);
    };
  } catch {
    /* MRL offline */
  }
}

export function disconnectMrlWebSocket() {
  socket?.close();
  socket = null;
}

export function onMrlWsEvent(handler: MrlWsHandler) {
  handlers.push(handler);
  return () => {
    handlers = handlers.filter((h) => h !== handler);
  };
}

export function onOpencvFrame(listener: (src: string | null) => void) {
  frameListeners.push(listener);
  if (opencvFrame) listener(opencvFrame);
  return () => {
    frameListeners = frameListeners.filter((l) => l !== listener);
  };
}

export function getLatestOpencvFrame() {
  return opencvFrame;
}