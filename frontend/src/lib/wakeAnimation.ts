/**
 * Sync full-body wake-up animation to the 3D preview / UI stores.
 * Server also drives real servos over USB when connected.
 */
import { PRESETS } from '@/lib/presets';
import { animateKeyframes } from '@/lib/animateKeyframes';
import { isPlaybackLocked } from '@/lib/robotLiveController';

let lastPlayedId = 0;
let bootstrapped = false;
let playing = false;
let abort: AbortController | null = null;

export function isWakeAnimationPlaying() {
  return playing;
}

/** Play the wake-up keyframe sequence (safe limits, full body). */
export async function playWakeUpClient(signal?: AbortSignal): Promise<void> {
  // Never interrupt an active Moves page playback
  if (isPlaybackLocked()) return;
  const kf = PRESETS['wake-up'];
  if (!kf?.length) return;
  if (playing) {
    abort?.abort();
  }
  const controller = new AbortController();
  abort = controller;
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  playing = true;
  try {
    await animateKeyframes(kf, {
      signal: controller.signal,
      transitionMs: 320,
    });
  } finally {
    if (abort === controller) {
      playing = false;
      abort = null;
    }
  }
}

/**
 * If server reports a new wake animation id, play client-side for 3D sync.
 * Call from a poller (e.g. AppLayout / Camera).
 */
export async function maybePlayWakeFromServer(wakeId: number | undefined | null): Promise<boolean> {
  const id = Number(wakeId || 0);
  if (!id) return false;
  // First poll: remember current id so we don't replay an old wake on page load
  if (!bootstrapped) {
    bootstrapped = true;
    lastPlayedId = id;
    return false;
  }
  if (id <= lastPlayedId) return false;
  lastPlayedId = id;
  void playWakeUpClient();
  return true;
}

export function markWakeIdSeen(wakeId: number) {
  if (wakeId > lastPlayedId) lastPlayedId = wakeId;
}
