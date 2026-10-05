import { describe, expect, it } from 'vitest';
import { createWheel } from '../model/wheel';
import {
  createLocalStorageRepository,
  exportBackup,
  mergeWheels,
  migrate,
  parseBackup,
  type KeyValueStorage,
} from './wheelRepository';

function memoryStorage(): KeyValueStorage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
  };
}

describe('wheelRepository', () => {
  it('saves and loads wheels', () => {
    const repo = createLocalStorageRepository(memoryStorage());
    expect(repo.loadAll()).toEqual([]);
    const wheels = [createWheel('A', ['1', '2']), createWheel('B')];
    repo.saveAll(wheels);
    expect(repo.loadAll()).toEqual(wheels);
  });

  it('survives corrupt data', () => {
    const storage = memoryStorage();
    storage.setItem('gluecksrad.wheels', '{nope');
    expect(createLocalStorageRepository(storage).loadAll()).toEqual([]);
  });

  it('keeps inline pictures and drops wheels with external picture URLs', () => {
    const withPicture = createWheel('Bilder');
    withPicture.entries.push({ id: 'a', label: '', image: { src: 'data:image/png;base64,AAAA', arasaacId: 1 } });
    const external = createWheel('Extern');
    external.entries.push({ id: 'b', label: 'x', image: { src: 'https://example.com/x.png' } });
    expect(migrate({ version: 1, wheels: [withPicture, external] }).wheels).toEqual([withPicture]);
  });

  it('keeps the drawn Mundmotorik pictures', () => {
    const motor = createWheel('Mundmotorik');
    motor.entries.push({ id: 'a', label: 'Pusten', image: { src: 'data:image/svg+xml,%3Csvg%3E%3C%2Fsvg%3E' } });
    expect(migrate({ version: 1, wheels: [motor] }).wheels).toEqual([motor]);
  });

  it('rejects data from a newer version and drops invalid wheels', () => {
    expect(() => migrate({ version: 999, wheels: [] })).toThrow();
    const valid = createWheel('ok', ['x']);
    expect(migrate({ version: 1, wheels: [valid, { foo: 1 }] }).wheels).toEqual([valid]);
  });

  it('round-trips backups and merges by id', () => {
    const a = createWheel('A', ['1']);
    const b = createWheel('B', ['2']);
    const imported = parseBackup(exportBackup([{ ...a, name: 'A neu' }, b]));
    const merged = mergeWheels([a], imported);
    expect(merged.map((w) => w.name)).toEqual(['A neu', 'B']);
    expect(() => parseBackup('{"wheels": []}')).toThrow();
  });
});
