import type { Entry } from './wheel';

/** Entries that look the same on the wheel (same text and picture). */
function sameKey(entry: Entry): string {
  const image = entry.image ? (entry.image.arasaacId ?? entry.image.src) : '';
  return `${entry.label.trim().toLowerCase()}|${image}`;
}

/** Moves the entry at `from` to `to`, shifting the ones in between. */
export function moveEntry<T>(list: T[], from: number, to: number): T[] {
  const result = [...list];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

/**
 * How badly equal entries clump together on the (circular) wheel.
 * Every pair of neighbouring equal entries adds 1/distance², so evenly spread entries score lowest.
 */
function clumping(keys: string[]): number {
  const n = keys.length;
  const positions = new Map<string, number[]>();
  keys.forEach((key, i) => positions.set(key, [...(positions.get(key) ?? []), i]));
  let score = 0;
  for (const list of positions.values()) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      const next = i + 1 < list.length ? list[i + 1] : list[0] + n;
      const d = next - list[i];
      score += 1 / (d * d);
    }
  }
  return score;
}

/**
 * Shuffles the entries so that equal entries (e.g. several "Gewinn" fields) end up
 * as evenly spread around the wheel as possible: random restarts plus swaps that reduce clumping.
 */
export function shuffleSpread<T extends Entry>(entries: T[], random: () => number = Math.random): T[] {
  const n = entries.length;
  if (n < 3) return [...entries];
  const keys = entries.map(sameKey);
  let best: number[] = [];
  let bestScore = Infinity;

  for (let attempt = 0; attempt < 20; attempt++) {
    const order = entries.map((_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    let score = clumping(order.map((i) => keys[i]));
    for (let improved = true; improved; ) {
      improved = false;
      for (let a = 0; a < n; a++) {
        for (let b = a + 1; b < n; b++) {
          if (keys[order[a]] === keys[order[b]]) continue;
          [order[a], order[b]] = [order[b], order[a]];
          const swapped = clumping(order.map((i) => keys[i]));
          if (swapped < score - 1e-12) {
            score = swapped;
            improved = true;
          } else {
            [order[a], order[b]] = [order[b], order[a]];
          }
        }
      }
    }
    if (score < bestScore) {
      best = order;
      bestScore = score;
    }
  }
  return best.map((i) => entries[i]);
}
