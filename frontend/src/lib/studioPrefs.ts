/** Studio preferences (persisted). */

const LEGS_KEY = 'inmoov.studio.showLegs';

export function getShowLegs(): boolean {
  try {
    return localStorage.getItem(LEGS_KEY) === '1';
  } catch {
    return false;
  }
}

export function setShowLegs(on: boolean): void {
  try {
    localStorage.setItem(LEGS_KEY, on ? '1' : '0');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('inmoov-studio-prefs', { detail: { showLegs: on } }));
}
