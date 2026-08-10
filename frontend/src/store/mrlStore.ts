import { create } from 'zustand';
import * as mrl from '@/lib/mrlClient';
import type { MrlGesture, MrlI01Servo, MrlServoState, MrlStatus } from '@/lib/mrlClient';

interface MrlState {
  status: MrlStatus | null;
  services: string[];
  grouped: Record<string, string[]>;
  i01Servos: MrlI01Servo[];
  gestures: MrlGesture[];
  selectedService: string | null;
  servoCache: Record<string, MrlServoState>;
  loading: boolean;
  lastRefresh: number | null;
  pollTimer: ReturnType<typeof setInterval> | null;

  refresh: () => Promise<void>;
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
  selectService: (name: string | null) => void;
  refreshServo: (service: string) => Promise<MrlServoState | null>;
  execGesture: (name: string) => Promise<boolean>;
  moveServo: (service: string, angle: number, opts?: { refresh?: boolean }) => Promise<boolean>;
}

export const useMrlStore = create<MrlState>((set, get) => ({
  status: null,
  services: [],
  grouped: {},
  i01Servos: [],
  gestures: [],
  selectedService: null,
  servoCache: {},
  loading: false,
  lastRefresh: null,
  pollTimer: null,

  refresh: async () => {
    set({ loading: true });
    try {
      const [status, svcRes, i01Res, gestureRes] = await Promise.all([
        mrl.getMrlStatus(),
        mrl.getMrlServices().catch(() => ({ ok: false, services: [], grouped: {}, count: 0 })),
        mrl.getMrlI01Servos().catch(() => ({ ok: false, servos: [] })),
        mrl.getMrlGestures().catch(() => ({ ok: false, gestures: [], count: 0 })),
      ]);
      set({
        status,
        services: svcRes.services ?? [],
        grouped: svcRes.grouped ?? {},
        i01Servos: i01Res.servos ?? [],
        gestures: gestureRes.gestures ?? [],
        lastRefresh: Date.now(),
      });
    } finally {
      set({ loading: false });
    }
  },

  startPolling: (intervalMs = 8000) => {
    const { pollTimer, refresh } = get();
    if (pollTimer) clearInterval(pollTimer);
    void refresh();
    const timer = setInterval(() => void refresh(), intervalMs);
    set({ pollTimer: timer });
  },

  stopPolling: () => {
    const { pollTimer } = get();
    if (pollTimer) clearInterval(pollTimer);
    set({ pollTimer: null });
  },

  selectService: (name) => set({ selectedService: name }),

  refreshServo: async (service) => {
    try {
      const state = await mrl.getMrlServoState(service);
      set((s) => ({ servoCache: { ...s.servoCache, [service]: state } }));
      return state;
    } catch {
      return null;
    }
  },

  execGesture: async (name) => {
    // Native core plays on serial; client also animates 3D if preset keyframes exist
    try {
      const { PRESETS } = await import('@/lib/presets');
      const { animateKeyframes } = await import('@/lib/animateKeyframes');
      const ids = [name, `mrl-${name}`, name.replace(/^mrl-/, '')];
      const kf = ids.map((id) => PRESETS[id]).find(Boolean);
      if (kf) void animateKeyframes(kf);
    } catch {
      /* optional client animation */
    }
    const res = await mrl.mrlExec(name);
    return res.ok;
  },

  moveServo: async (service, angle, opts?: { refresh?: boolean }) => {
    const res = await mrl.mrlMoveTo(service, angle);
    if (res.ok) {
      // Optimistic cache update for smooth drag; full refresh only when requested
      set((s) => ({
        servoCache: {
          ...s.servoCache,
          [service]: { ...(s.servoCache[service] ?? { service }), getPosition: angle, ok: true },
        },
      }));
      if (opts?.refresh) await get().refreshServo(service);
    }
    return res.ok;
  },
}));