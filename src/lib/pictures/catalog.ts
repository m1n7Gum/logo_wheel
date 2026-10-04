import { pictogramUrl, type Pictogram } from './arasaac';

/** Shape of `arasaac-index.json`, written by `scripts/update-pictograms.mjs`. */
export interface CatalogData {
  updated: string;
  categories: { id: string; label: string }[];
  /** [pictogram id, [[keyword, ARASAAC keyword type]], category bit mask] */
  items: [number, [string, number][], number][];
}

export type SoundPosition = 'start' | 'middle' | 'end' | 'any';

/** ARASAAC keyword type for common nouns – the easiest words to picture. */
const NOUN = 2;

export class Catalog {
  constructor(private data: CatalogData) {}

  get categories() {
    return this.data.categories;
  }

  /** Pictograms whose keyword starts with or contains the query; all drawings of a word are kept. */
  searchWord(query: string): Pictogram[] {
    const q = normalize(query);
    if (!q) return [];
    const hits: { p: Pictogram; rank: number }[] = [];
    for (const [id, words] of this.data.items) {
      let best: { word: string; rank: number } | null = null;
      for (const [word] of words) {
        const w = normalize(word);
        const rank = w === q ? 0 : w.startsWith(q) ? 1 : w.includes(q) ? 2 : -1;
        if (rank >= 0 && (!best || rank < best.rank)) best = { word, rank };
      }
      if (best) hits.push({ p: toPictogram(id, best.word), rank: best.rank * 1000 + best.word.length });
    }
    return hits.sort((a, b) => a.rank - b.rank).map((h) => h.p);
  }

  /**
   * Single words that contain a sound (written as letters, e.g. „sch“) at the given position.
   * One picture per word, so the list reads like a word list for therapy.
   */
  searchSound(sound: string, position: SoundPosition, nounsOnly = false): Pictogram[] {
    const s = normalize(sound);
    if (!s) return [];
    const seen = new Set<string>();
    const hits: Pictogram[] = [];
    for (const [id, words] of this.data.items) {
      for (const [word, type] of words) {
        if (nounsOnly && type !== NOUN) continue;
        const w = normalize(word);
        if (w.includes(' ') || seen.has(w) || !hasSound(w, s, position)) continue;
        seen.add(w);
        hits.push(toPictogram(id, word));
      }
    }
    return hits.sort((a, b) => a.keyword.localeCompare(b.keyword, 'de'));
  }

  /** Pictograms of a category in ARASAAC's order, one per word. */
  inCategory(categoryId: string): Pictogram[] {
    const bit = this.data.categories.findIndex((c) => c.id === categoryId);
    if (bit === -1) return [];
    const seen = new Set<string>();
    const hits: Pictogram[] = [];
    for (const [id, words, mask] of this.data.items) {
      if (!(mask & (1 << bit))) continue;
      const word = words[0][0];
      if (seen.has(word)) continue;
      seen.add(word);
      hits.push(toPictogram(id, word));
    }
    return hits;
  }
}

/**
 * Letter-based, not phonetic, but „sch“ and „ch“ count as one sound each: a search must not
 * cut through them, so „ch“ does not find „Tisch“ and „s“ does not find „Schule“. Other
 * spellings still count by letters, e.g. „st“ in „Stern“ although it is spoken „scht“.
 */
export function hasSound(word: string, sound: string, position: SoundPosition): boolean {
  const units = letterUnits(word);
  const matchesAt = (i: number) => {
    if (!word.startsWith(sound, i)) return false;
    const end = i + sound.length;
    // Reject a match that starts or ends inside a unit (partly overlapping it).
    return !units.some(([from, to]) => from < end && i < to && (i > from || end < to));
  };
  const last = word.length - sound.length;
  switch (position) {
    case 'start':
      return matchesAt(0);
    case 'end':
      return last >= 0 && matchesAt(last);
    case 'middle':
      for (let i = 1; i < last; i++) if (matchesAt(i)) return true;
      return false;
    case 'any':
      for (let i = 0; i <= last; i++) if (matchesAt(i)) return true;
      return false;
  }
}

/** Spans of „sch“ and „ch“ in a word, each spoken as one sound. */
function letterUnits(word: string): [number, number][] {
  const units: [number, number][] = [];
  for (let i = 0; i < word.length; ) {
    const len = word.startsWith('sch', i) ? 3 : word.startsWith('ch', i) ? 2 : 0;
    if (len) units.push([i, i + len]);
    i += len || 1;
  }
  return units;
}

function normalize(text: string): string {
  return text.trim().toLocaleLowerCase('de');
}

function toPictogram(id: number, keyword: string): Pictogram {
  return { id, keyword, previewUrl: pictogramUrl(id) };
}

let loading: Promise<Catalog> | undefined;

/** The index is a separate chunk (~600 KB), loaded on first use and precached for offline use. */
export function loadCatalog(): Promise<Catalog> {
  loading ??= import('./arasaac-index.json').then((m) => new Catalog(m.default as unknown as CatalogData));
  return loading;
}
