import type { Wheel } from '../model/wheel';

/** Bump when the stored shape changes and add a step to `migrate`. */
export const SCHEMA_VERSION = 1;

interface StoredData {
  version: number;
  wheels: Wheel[];
}

export interface WheelRepository {
  loadAll(): Wheel[];
  saveAll(wheels: Wheel[]): void;
}

/** Minimal subset of the Web Storage API, so tests can pass an in-memory fake. */
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

const STORAGE_KEY = 'gluecksrad.wheels';

export function createLocalStorageRepository(
  storage: KeyValueStorage = localStorage,
): WheelRepository {
  return {
    loadAll() {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return [];
      try {
        return migrate(JSON.parse(raw)).wheels;
      } catch (err) {
        console.error('Gespeicherte Räder konnten nicht gelesen werden', err);
        return [];
      }
    },
    saveAll(wheels) {
      const data: StoredData = { version: SCHEMA_VERSION, wheels };
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
  };
}

/** Upgrades older stored data step by step to the current schema. */
export function migrate(data: unknown): StoredData {
  if (!isRecord(data) || typeof data.version !== 'number' || !Array.isArray(data.wheels)) {
    throw new Error('Unbekanntes Datenformat');
  }
  if (data.version > SCHEMA_VERSION) {
    throw new Error('Daten stammen aus einer neueren App-Version');
  }
  // Future migrations: if (data.version === 1) { ...; data.version = 2; }
  return { version: SCHEMA_VERSION, wheels: data.wheels.filter(isWheel) };
}

// ---- Backup file (export / import) ----

const BACKUP_KIND = 'gluecksrad-backup';

export function exportBackup(wheels: Wheel[]): string {
  return JSON.stringify({ kind: BACKUP_KIND, version: SCHEMA_VERSION, wheels }, null, 2);
}

export function parseBackup(json: string): Wheel[] {
  const data: unknown = JSON.parse(json);
  if (!isRecord(data) || data.kind !== BACKUP_KIND) {
    throw new Error('Das ist keine Glücksrad-Backup-Datei');
  }
  return migrate(data).wheels;
}

/** Imported wheels replace wheels with the same id, others are added. */
export function mergeWheels(existing: Wheel[], imported: Wheel[]): Wheel[] {
  const byId = new Map(existing.map((w) => [w.id, w]));
  for (const wheel of imported) byId.set(wheel.id, wheel);
  return [...byId.values()];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWheel(value: unknown): value is Wheel {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.entries) &&
    value.entries.every(
      (e) => isRecord(e) && typeof e.id === 'string' && typeof e.label === 'string',
    )
  );
}
