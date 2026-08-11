import { create } from 'zustand';
import * as api from '@/lib/api';
import { SERVOS } from '@/lib/servoConfig';

/** Factory pins from bundled servo_config (hardware fallback only — not shown in UI until saved). */
export function defaultPinsFromConfig(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of SERVOS) {
    const p = Number(s.pin);
    if (Number.isFinite(p) && p >= 2) map[s.key] = p;
  }
  return map;
}

const DEFAULTS = defaultPinsFromConfig();

interface PinState {
  /** Only user-saved / user-draft pins. Empty = blank input until Save. */
  pins: Record<string, number>;
  loaded: boolean;
  dirty: boolean;
  /** Load only saved overrides — never prefill factory into inputs. */
  hydrate: () => Promise<void>;
  setPinLocal: (key: string, pin: number) => void;
  /** Clear a pin from the draft map (empty input). */
  clearPinLocal: (key: string) => void;
  setPinsLocal: (pins: Record<string, number>) => void;
  /**
   * Pin for hardware / 3D moves: saved value, else factory.
   * Do NOT use this to fill pin input fields.
   */
  getPin: (key: string) => number;
  /** Saved/draft pin for UI, or undefined if empty. */
  getSavedPin: (key: string) => number | undefined;
  /** Persist currently set pins only (no factory fill). */
  saveAll: (applyToFirmware: boolean) => Promise<{
    ok: boolean;
    error?: string;
    firmware_applied?: string[];
    warning?: string | null;
  }>;
  /** Save one pin + optional board apply — then UI shows that value. */
  saveOne: (
    key: string,
    pin: number,
    applyToFirmware: boolean,
  ) => Promise<{ ok: boolean; serial_sent?: boolean; error?: string; warning?: string }>;
  /** Load factory numbers into draft (still needs Save to persist). */
  resetDefaults: () => void;
  markClean: () => void;
}

function clampPin(n: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 2;
  return Math.max(2, Math.min(53, v));
}

export const usePinStore = create<PinState>((set, get) => ({
  pins: {},
  loaded: false,
  dirty: false,

  hydrate: async () => {
    try {
      const pinRes = await api.getServoPins().catch(() => ({
        pins: {} as Record<string, number>,
        overrides: {} as Record<string, number>,
      }));
      // Prefer true user overrides only — never factory full map for UI
      const ov = (pinRes.overrides ?? {}) as Record<string, number>;
      const next: Record<string, number> = {};
      for (const [k, v] of Object.entries(ov)) {
        const p = clampPin(v);
        if (p >= 2 && p <= 53) next[k] = p;
      }
      // If API has no overrides field (older server), only keep pins that were explicitly saved
      // when overrides is missing but pins equals full map — still prefer empty when no overrides.
      if (Object.keys(next).length === 0 && pinRes.overrides == null && pinRes.pins) {
        // Without overrides key, do not prefill — leave empty until user saves.
      }
      set({ pins: next, loaded: true, dirty: false });
    } catch {
      set({ pins: {}, loaded: true, dirty: false });
    }
  },

  setPinLocal: (key, pin) => {
    set((s) => ({
      pins: { ...s.pins, [key]: clampPin(pin) },
      dirty: true,
    }));
  },

  clearPinLocal: (key) => {
    set((s) => {
      const next = { ...s.pins };
      delete next[key];
      return { pins: next, dirty: true };
    });
  },

  setPinsLocal: (pins) => {
    const next: Record<string, number> = {};
    for (const [k, v] of Object.entries(pins)) next[k] = clampPin(v);
    set({ pins: next, dirty: true });
  },

  getPin: (key) => {
    const p = get().pins[key];
    if (p != null && p >= 2) return p;
    return DEFAULTS[key] ?? 2;
  },

  getSavedPin: (key) => {
    const p = get().pins[key];
    if (p != null && p >= 2) return p;
    return undefined;
  },

  saveAll: async (applyToFirmware) => {
    // Only what the user set — never auto-fill factory into overrides file
    const pins = { ...get().pins };
    for (const k of Object.keys(pins)) pins[k] = clampPin(pins[k]);

    const res = await api.saveServoPins(pins, applyToFirmware, true);
    if (res.ok) {
      set({ pins: { ...(res.pins ?? pins) }, dirty: false });
    }
    return res;
  },

  saveOne: async (key, pin, applyToFirmware) => {
    const safe = clampPin(pin);
    if (applyToFirmware) {
      const res = await api.setServoPin(key, safe, true);
      if (res.ok) {
        set((s) => ({
          pins: { ...s.pins, [key]: safe },
          dirty: false,
        }));
      }
      return res;
    }
    // Disk-only: merge one pin into saved overrides (replace_all false)
    const full = { ...get().pins, [key]: safe };
    const res = await api.saveServoPins(full, false, false);
    if (res.ok) {
      set({
        pins: { ...(res.pins ?? full) },
        dirty: false,
      });
    }
    return { ok: !!res.ok, error: res.error, serial_sent: false };
  },

  resetDefaults: () => {
    // Put factory into draft only — still empty until user hits Save if they clear.
    // "Defaults" button intentionally loads numbers so user can review + Save.
    set({ pins: { ...DEFAULTS }, dirty: true });
  },

  markClean: () => set({ dirty: false }),
}));

/** Non-hook access for bodyConfig / one-off reads (factory fallback for moves). */
export function pinForKey(key: string): number {
  return usePinStore.getState().getPin(key);
}
