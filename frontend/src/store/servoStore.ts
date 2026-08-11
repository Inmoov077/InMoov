import { create } from 'zustand';
import * as api from '@/lib/api';
import { notifyRobotPreview } from '@/lib/robotPreviewBridge';
import { servoByKey } from '@/lib/servoConfig';
import { clamp } from '@/lib/utils';

const NECK_ROT = servoByKey('neck_rot');
const NECK_TILT = servoByKey('neck_tilt');
const NECK_ROLL = servoByKey('neck_roll');
const HEAD_JAW = servoByKey('head_jaw');

export type Axis = 'rot' | 'tilt' | 'roll';
export type HeadJoint = 'hneck' | 'eye' | 'jaw';

export interface Limits {
  min: number;
  max: number;
}

export interface LogEntry {
  id: string;
  ts: string;
  type: 'info' | 'send' | 'recv' | 'error' | 'system';
  msg: string;
}

interface ServoState {
  hneck: number;
  eye: number;
  jaw: number;
  rot: number;
  tilt: number;
  roll: number;
  connected: boolean;
  port: string | null;
  reconnecting: boolean;
  lastSerialError: string | null;
  limits: Record<Axis, Limits>;
  outputInversions: Record<Axis, boolean>;
  linked: boolean;
  logs: LogEntry[];

  setHead: (joint: HeadJoint, value: number, send?: boolean) => void;
  setNeck: (axis: Axis, value: number, send?: boolean) => void;
  setMaster: (value: number) => void;
  setConnected: (online: boolean, port?: string | null) => void;
  centerHead: () => void;
  centerNeck: () => void;
  centerAll: () => void;
  log: (type: LogEntry['type'], msg: string) => void;
  clearLogs: () => void;
  refreshConnection: () => Promise<void>;
  startConnectionWatchdog: () => void;
  stopConnectionWatchdog: () => void;
  connect: (port: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  autoDetect: () => Promise<string | null>;
  emergencyStop: () => Promise<void>;
  sendCombined: () => Promise<void>;
}

let connectionWatchdog: ReturnType<typeof setInterval> | null = null;

let throttleTimer: ReturnType<typeof setTimeout> | null = null;
let lastSend = 0;
const THROTTLE_MS = 100;

function nowTs() {
  return new Date().toTimeString().split(' ')[0];
}

function applyInversions(state: ServoState) {
  const rot = state.outputInversions.rot ? 180 - state.rot : state.rot;
  const tilt = state.outputInversions.tilt ? 180 - state.tilt : state.tilt;
  const roll = state.outputInversions.roll ? 180 - state.roll : state.roll;
  return { rot, tilt, roll };
}

export const useServoStore = create<ServoState>((set, get) => ({
  hneck: 85,
  eye: 90,
  jaw: 8,
  rot: 60,
  tilt: 50,
  roll: 120,
  connected: false,
  port: null,
  reconnecting: false,
  lastSerialError: null,
  limits: {
    rot: { min: NECK_ROT?.min ?? 0, max: NECK_ROT?.max ?? 180 },
    tilt: { min: NECK_TILT?.min ?? 0, max: NECK_TILT?.max ?? 180 },
    roll: { min: NECK_ROLL?.min ?? 60, max: NECK_ROLL?.max ?? 130 },
  },
  outputInversions: { rot: true, tilt: false, roll: true },
  linked: false,
  logs: [],

  log: (type, msg) =>
    set((s) => ({
      logs: [...s.logs.slice(-199), { id: crypto.randomUUID(), ts: nowTs(), type, msg }],
    })),

  clearLogs: () => set({ logs: [] }),

  setConnected: (online, port = null) =>
    set({
      connected: online,
      port: online ? port : port ?? null,
      reconnecting: online ? false : get().reconnecting,
      lastSerialError: online ? null : get().lastSerialError,
    }),

  refreshConnection: async () => {
    try {
      const data = await api.getSerialStatus().catch(async () => {
        const ports = await api.getPorts();
        return {
          connected: !!ports.connected || !!ports.current,
          port: ports.current ?? null,
          last_error: ports.last_error ?? null,
          reconnecting: !!ports.reconnecting,
        };
      });
      const online = !!data.connected;
      const was = get().connected;
      set({
        connected: online,
        port: online ? (data.port ?? get().port) : data.port ?? null,
        reconnecting: !!data.reconnecting,
        lastSerialError: data.last_error ?? null,
      });
      if (online && !was) {
        get().log('system', `USB reconnected · ${data.port ?? 'port'}`);
      } else if (!online && was && !data.reconnecting) {
        get().log('error', data.last_error || 'USB dropped — auto-reconnect running if enabled');
      }
    } catch {
      /* offline UI */
    }
  },

  startConnectionWatchdog: () => {
    if (connectionWatchdog) return;
    // Keep UI in sync with server auto-reconnect / drop (5s — lighter on dashboard)
    void get().refreshConnection();
    connectionWatchdog = setInterval(() => {
      void get().refreshConnection();
    }, 5000);
  },

  stopConnectionWatchdog: () => {
    if (connectionWatchdog) {
      clearInterval(connectionWatchdog);
      connectionWatchdog = null;
    }
  },

  connect: async (port) => {
    // Do NOT force-release before every connect — that closes a healthy link
    // and reboots the Mega. Force free is only for Access-denied recovery.
    const res = await api.connectPort(port, true);
    if (res.ok) {
      set({ connected: true, port, reconnecting: false, lastSerialError: null });
      const nPins = res.firmware_sync?.pins?.length ?? 0;
      const nLim = res.firmware_sync?.limits?.length ?? 0;
      get().log(
        'system',
        `Connected to ${port}` +
          (nPins || nLim ? ` · synced ${nPins} pins / ${nLim} limits` : ''),
      );
      // Double-ensure board has latest pin map
      try {
        const sync = await api.syncFirmwareConfig();
        if (sync.ok) {
          get().log('system', `Firmware sync OK (${sync.pins?.length ?? 0} pins)`);
        }
      } catch {
        /* optional */
      }
      get().startConnectionWatchdog();
      return true;
    }

    // Sticky Access denied: one Force free + retry (only on failure)
    const errText = String(res.error || '').toLowerCase();
    if (errText.includes('denied') || errText.includes('access') || errText.includes('busy')) {
      get().log('system', 'Port busy — Force free + retry…');
      try {
        await api.forceReleasePort(port);
        await new Promise((r) => setTimeout(r, 900));
        const retry = await api.connectPort(port, true);
        if (retry.ok) {
          set({ connected: true, port, reconnecting: false, lastSerialError: null });
          get().log('system', `Connected to ${port} after Force free`);
          try {
            await api.syncFirmwareConfig();
          } catch {
            /* optional */
          }
          get().startConnectionWatchdog();
          return true;
        }
        set({
          connected: false,
          port: null,
          lastSerialError: retry.error || res.error || 'Connection failed',
        });
        get().log('error', retry.error || res.error || 'Connection failed');
        return false;
      } catch {
        /* fall through */
      }
    }

    set({
      connected: false,
      port: null,
      lastSerialError: res.error || 'Connection failed',
    });
    get().log('error', res.error || 'Connection failed');
    return false;
  },

  disconnect: async () => {
    await api.disconnectPort();
    set({ connected: false, port: null, reconnecting: false, lastSerialError: null });
    get().log('system', 'Disconnected');
  },

  autoDetect: async () => {
    const res = await api.autoDetectPort();
    if (res.ok && res.port) {
      set({ connected: true, port: res.port, reconnecting: false, lastSerialError: null });
      get().log('system', `Auto-detected ${res.port}`);
      get().startConnectionWatchdog();
      return res.port as string;
    }
    get().log('error', res.error || 'Auto-detect failed');
    return null;
  },

  emergencyStop: async () => {
    // E-stop should rest motors — do NOT mark USB disconnected
    await api.emergencyStop();
    get().log('error', 'EMERGENCY STOP');
    void get().refreshConnection();
  },

  setHead: (joint, value, send = true) => {
    const jawMax = HEAD_JAW?.max ?? 40;
    const v = joint === 'jaw' ? clamp(Number(value), 0, jawMax) : clamp(Number(value), 0, 180);
    set({ [joint]: v } as Partial<ServoState>);
    notifyRobotPreview();
    if (send && get().connected) {
      const s = get();
      const hneck = joint === 'hneck' ? v : s.hneck;
      const eye = joint === 'eye' ? v : s.eye;
      const jaw = joint === 'jaw' ? v : s.jaw;
      api.sendHead(hneck, eye, jaw).then((d) => {
        if (d.ok) get().log('send', `H,${hneck},${eye},${jaw}`);
      });
      get().sendCombined();
    }
  },

  setNeck: (axis, value, send = true) => {
    let v = clamp(Number(value), get().limits[axis].min, get().limits[axis].max);
    const updates: Partial<ServoState> = { [axis]: v };

    if (axis === 'rot') {
      updates.roll = 180 - v;
    } else if (axis === 'roll') {
      updates.rot = 180 - v;
    }

    set(updates as Partial<ServoState>);
    notifyRobotPreview();

    if (!send || !get().connected) return;

    const run = () => {
      lastSend = Date.now();
      const s = get();
      const out = applyInversions(s);
      api.sendNeck(out.rot, out.tilt, out.roll).then((d) => {
        if (d.ok) get().log('send', `N,${out.rot},${out.tilt},${out.roll}`);
      });
      get().sendCombined();
    };

    const elapsed = Date.now() - lastSend;
    if (elapsed >= THROTTLE_MS) {
      if (throttleTimer) clearTimeout(throttleTimer);
      run();
    } else if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        run();
      }, THROTTLE_MS - elapsed);
    }
  },

  setMaster: (value) => {
    const v = clamp(Number(value), 0, 180);
    set({ rot: v, tilt: v, roll: 180 - v });
    notifyRobotPreview();
    if (get().connected) {
      get().setNeck('rot', v, true);
    }
  },

  centerHead: () => {
    set({ hneck: 85, eye: 90, jaw: 8 });
    notifyRobotPreview();
    if (get().connected) api.sendHead(85, 90, 8);
    get().sendCombined();
  },

  centerNeck: () => {
    set({ rot: 60, tilt: 50, roll: 120 });
    notifyRobotPreview();
    if (get().connected) {
      const out = applyInversions(get());
      api.sendNeck(out.rot, out.tilt, out.roll);
    }
    get().sendCombined();
  },

  centerAll: () => {
    get().centerHead();
    get().centerNeck();
  },

  sendCombined: async () => {
    const s = get();
    const out = applyInversions(s);
    const res = await api.sendCombined6({
      headNeck: s.hneck,
      headEye: s.eye,
      headJaw: s.jaw,
      neckRot: out.rot,
      neckTilt: out.tilt,
      neckRoll: out.roll,
    });
    if (res.ok && s.connected) {
      get().log('send', `C,${s.hneck},${s.eye},${s.jaw},${out.rot},${out.tilt},${out.roll}`);
    }
  },
}));