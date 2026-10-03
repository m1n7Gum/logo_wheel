import type { KeyValueStorage } from './wheelRepository';

export interface Settings {
  themeId: string;
  muted: boolean;
  lastWheelId: string | null;
  /** Side bar collapsed behind the menu button, so children only see the wheel. */
  toolbarHidden: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  themeId: 'classic',
  muted: false,
  lastWheelId: null,
  toolbarHidden: false,
};

const STORAGE_KEY = 'gluecksrad.settings';

export function loadSettings(storage: KeyValueStorage = localStorage): Settings {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings, storage: KeyValueStorage = localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Asks the browser not to evict our data under storage pressure. */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (await navigator.storage?.persisted?.()) return true;
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}

/** True when running as an installed home-screen app (protects data from Safari's 7-day eviction). */
export function isInstalledApp(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Samsung Internet installs web apps as packages built for old Android versions,
 * which Android 14+ blocks ("unsichere App blockiert"). Chrome does not have this problem.
 */
export function isSamsungInternet(): boolean {
  return /SamsungBrowser/i.test(navigator.userAgent);
}
