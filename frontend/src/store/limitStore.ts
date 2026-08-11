import { create } from 'zustand';
import * as api from '@/lib/api';
import { SERVOS } from '@/lib/servoConfig';

export type Limits = { min: number; max: number; rest: number };

function defaultsFromConfig(): Record<string, Limits> {
  const map: Record<string, Limits> = {};
  for (const s of SERVOS) {
    map[s.key] = {
      min: Number(s.min) || 0,
      max: Number(s.max) || 180,
      rest: Number(s.rest) ?? 90,
    };
  }
  return map;
}

const DEFAULTS = defaultsFromConfig();

function sanitizeLimits(lim: Partial<Limits>, fallback?: Limits): Limits {
  const f = fallback ?? { min: 0, max: 180, rest: 90 };
  let min = Math.round(Number(lim.min ?? f.min));
  let max = Math.round(Number(lim.max ?? f.max));
  let rest = Math.round(Number(lim.rest ?? f.rest));
  if (!Number.isFinite(min)) min = f.min;
  if (!Number.isFinite(max)) max = f.max;
  if (!Number.isFinite(rest)) rest = f.rest;
  // Never allow negative angles — absolute PWM walls 0–180
  min = Math.max(0, Math.min(180, min));
  max = Math.max(0, Math.min(180, max));
  if (min > max) [min, max] = [max, min];
  // rest always inside [min, max] and never negative
  rest = Math.max(0, Math.min(180, rest));
  rest = Math.max(min, Math.min(max, rest));
  return { min, max, rest };
}

interface LimitState {
  limits: Record<string, Limits>;
  loaded: boolean;
  hydrate: () => Promise<void>;
  getLimits: (key: string) => Limits;
  /** Clamp angle to permanent working limits for this servo */
  clampAngle: (key: string, angle: number) => number;
  setLocal: (key: string, lim: Partial<Limits>) => void;
  /** Save one servo limits permanently (+ firmware if USB) */
  saveOne: (
    key: string,
    lim: Limits,
  ) => Promise<{ ok: boolean; min?: number; max?: number; rest?: number; serial_sent?: boolean; error?: string }>;
}

export const useLimitStore = create<LimitState>((set, get) => ({
  limits: { ...DEFAULTS },
  loaded: false,

  hydrate: async () => {
    set((s) => ({ limits: { ...DEFAULTS, ...s.limits } }));
    try {
      const [cfg, cal] = await Promise.all([
        api.getServoConfig().catch(() => ({ servos: [] })),
        api.getServoCalibration().catch(() => ({ calibration: {} })),
      ]);
      const next = { ...DEFAULTS };
      for (const s of cfg.servos ?? []) {
        if (!s?.key) continue;
        next[s.key] = sanitizeLimits(
          { min: s.min, max: s.max, rest: s.rest },
          DEFAULTS[s.key],
        );
      }
      const calMap = (cal.calibration ?? {}) as Record<string, Partial<Limits>>;
      for (const [k, v] of Object.entries(calMap)) {
        if (v && typeof v === 'object') {
          next[k] = sanitizeLimits(v, next[k] ?? DEFAULTS[k]);
        }
      }
      set({ limits: next, loaded: true });
    } catch {
      set({ limits: { ...DEFAULTS }, loaded: true });
    }
  },

  getLimits: (key) => {
    const L = get().limits[key] ?? DEFAULTS[key];
    return L ? sanitizeLimits(L) : { min: 0, max: 180, rest: 90 };
  },

  clampAngle: (key, angle) => {
    const L = get().getLimits(key);
    let n = Math.round(Number(angle));
    if (!Number.isFinite(n)) n = L.rest;
    // Map 360-style → 180 PWM, never negative
    if (n > 180) n = n <= 360 ? Math.round((n * 180) / 360) : 180;
    if (n < 0) n = 0;
    n = Math.max(0, Math.min(180, n));
    return Math.max(L.min, Math.min(L.max, n));
  },

  setLocal: (key, lim) => {
    set((s) => ({
      limits: {
        ...s.limits,
        [key]: sanitizeLimits(lim, s.limits[key] ?? DEFAULTS[key]),
      },
    }));
  },

  saveOne: async (key, lim) => {
    const clean = sanitizeLimits(lim, get().limits[key] ?? DEFAULTS[key]);
    set((s) => ({ limits: { ...s.limits, [key]: clean } }));
    const res = await api.setServoLimits(key, clean);
    if (res.ok) {
      const next = sanitizeLimits(
        {
          min: res.min ?? clean.min,
          max: res.max ?? clean.max,
          rest: res.rest ?? clean.rest,
        },
        clean,
      );
      set((s) => ({ limits: { ...s.limits, [key]: next } }));
      return { ...res, ...next };
    }
    return res;
  },
}));

export function clampServoAngle(key: string, angle: number): number {
  return useLimitStore.getState().clampAngle(key, angle);
}
