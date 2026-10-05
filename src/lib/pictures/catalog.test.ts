import { describe, expect, it } from 'vitest';
import { Catalog, hasSound, type CatalogData } from './catalog';

const data: CatalogData = {
  updated: '2026-10-04',
  categories: [
    { id: 'animals', label: 'Tiere' },
    { id: 'food', label: 'Essen' },
  ],
  items: [
    [1, [['Schaf', 2]], 1],
    [2, [['Tisch', 2]], 0],
    [3, [['Flasche', 2]], 0],
    [4, [['schlafen', 3]], 0],
    [5, [['Sonne', 2]], 0],
    [6, [['Schaf', 2]], 1],
    [7, [['Käse', 2], ['Schafskäse', 2]], 2],
    [8, [['Eis essen', 6]], 2],
  ],
};
const catalog = new Catalog(data);
const words = (list: { keyword: string }[]) => list.map((p) => p.keyword);

describe('hasSound', () => {
  it('finds a sound at the start, middle or end', () => {
    expect(hasSound('schaf', 'sch', 'start')).toBe(true);
    expect(hasSound('flasche', 'sch', 'middle')).toBe(true);
    expect(hasSound('tisch', 'sch', 'end')).toBe(true);
    expect(hasSound('tisch', 'sch', 'start')).toBe(false);
    // Start and end are not "middle".
    expect(hasSound('schaf', 'sch', 'middle')).toBe(false);
    expect(hasSound('tisch', 'sch', 'middle')).toBe(false);
  });

  it('does not find „sch“ when searching „ch“, „c“ or „h“', () => {
    expect(hasSound('tisch', 'ch', 'end')).toBe(false);
    expect(hasSound('schaf', 'ch', 'any')).toBe(false);
    expect(hasSound('buch', 'ch', 'end')).toBe(true);
    expect(hasSound('milch', 'ch', 'end')).toBe(true);
    expect(hasSound('kuchen', 'ch', 'middle')).toBe(true);
    expect(hasSound('buch', 'h', 'end')).toBe(false);
    expect(hasSound('flasche', 'sch', 'middle')).toBe(true);
    expect(hasSound('fischschwanz', 'ch', 'any')).toBe(false);
  });

  it('does not count the s of „sch“ as an s', () => {
    expect(hasSound('schaf', 's', 'start')).toBe(false);
    expect(hasSound('sonne', 's', 'start')).toBe(true);
    expect(hasSound('käse', 's', 'middle')).toBe(true);
  });
});

describe('Catalog', () => {
  it('can leave out verbs', () => {
    expect(words(catalog.searchSound('sch', 'start', true))).toEqual(['Schaf', 'Schafskäse']);
  });

  it('lists each single word once for a sound, sorted', () => {
    expect(words(catalog.searchSound('Sch', 'start'))).toEqual(['Schaf', 'Schafskäse', 'schlafen']);
    expect(words(catalog.searchSound('sch', 'any'))).toEqual(['Flasche', 'Schaf', 'Schafskäse', 'schlafen', 'Tisch']);
    expect(words(catalog.searchSound('ess', 'any'))).toEqual([]);
  });

  it('ranks exact and prefix matches first and keeps all drawings', () => {
    expect(catalog.searchWord('schaf').map((p) => p.id)).toEqual([1, 6, 7]);
    expect(catalog.searchWord('  ')).toEqual([]);
  });

  it('lists a category', () => {
    expect(words(catalog.inCategory('animals'))).toEqual(['Schaf']);
    expect(words(catalog.inCategory('food'))).toEqual(['Eis essen', 'Käse']);
    expect(catalog.inCategory('nope')).toEqual([]);
  });

  it('puts common words first', () => {
    const common = new Catalog({
      ...data,
      items: [
        [1, [['Schaf', 2, 45]], 1],
        [2, [['Schule', 2, 54]], 0],
        [3, [['Schal', 2, 0]], 1],
        [4, [['Schuh', 2, 45]], 1],
        [5, [['Schulbus', 2, 30]], 0],
      ],
    });
    expect(words(common.searchSound('sch', 'start'))).toEqual(['Schule', 'Schaf', 'Schuh', 'Schulbus', 'Schal']);
    expect(words(common.inCategory('animals'))).toEqual(['Schaf', 'Schuh', 'Schal']);
    expect(words(common.searchWord('schu'))).toEqual(['Schule', 'Schuh', 'Schulbus']);
  });
});
