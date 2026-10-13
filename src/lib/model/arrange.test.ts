import { describe, expect, it } from 'vitest';
import { createWheel } from './wheel';
import { moveEntry, shuffleSpread } from './arrange';

/** Smallest circular distance between two equal labels. */
function minGap(labels: string[], label: string): number {
  const at = labels.flatMap((l, i) => (l === label ? [i] : []));
  return Math.min(...at.map((p, i) => (at[(i + 1) % at.length] - p + labels.length) % labels.length || labels.length));
}

describe('moveEntry', () => {
  it('moves forward and backward', () => {
    expect(moveEntry(['A', 'B', 'C', 'D'], 0, 2)).toEqual(['B', 'C', 'A', 'D']);
    expect(moveEntry(['A', 'B', 'C', 'D'], 3, 1)).toEqual(['A', 'D', 'B', 'C']);
  });
});

describe('shuffleSpread', () => {
  it('keeps every entry exactly once', () => {
    const wheel = createWheel('T', ['A', 'B', 'C', 'Gewinn', 'Gewinn', 'D']);
    const result = shuffleSpread(wheel.entries);
    expect(result.map((e) => e.id).sort()).toEqual(wheel.entries.map((e) => e.id).sort());
  });

  it('spreads equal entries evenly around the wheel', () => {
    const wheel = createWheel('T', ['Gewinn', 'Gewinn', 'Gewinn', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
    for (let run = 0; run < 10; run++) {
      const labels = shuffleSpread(wheel.entries).map((e) => e.label);
      expect(minGap(labels, 'Gewinn')).toBe(4);
    }
  });

  it('spreads several groups at once', () => {
    const wheel = createWheel('T', ['Gewinn', 'Gewinn', 'Niete', 'Niete', 'A', 'B', 'C', 'D']);
    for (let run = 0; run < 10; run++) {
      const labels = shuffleSpread(wheel.entries).map((e) => e.label);
      expect(minGap(labels, 'Gewinn')).toBe(4);
      expect(minGap(labels, 'Niete')).toBe(4);
    }
  });

  it('treats different spelling of the same word as equal', () => {
    const wheel = createWheel('T', ['gewinn', 'Gewinn ', 'A', 'B']);
    const labels = shuffleSpread(wheel.entries).map((e) => e.label.trim().toLowerCase());
    expect(minGap(labels, 'gewinn')).toBe(2);
  });
});
