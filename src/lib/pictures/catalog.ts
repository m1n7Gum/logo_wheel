import { pictogramUrl, type Pictogram } from './arasaac';
import { querySounds, wordSounds, type Sound } from './sounds';

/** Shape of `arasaac-index.json`, written by `scripts/update-pictograms.mjs`. */
export interface CatalogData {
  updated: string;
  categories: { id: string; label: string }[];
  /**
   * [pictogram id, [[keyword, ARASAAC keyword type, frequency]], category bit mask].
   * Frequency: how common the word is in spoken German (Zipf scale × 10), 0 if unknown.
   */
  items: [number, [string, number, number?][], number][];
}

export type SoundPosition = 'start' | 'middle' | 'end' | 'any';

/** ARASAAC keyword type for common nouns – the easiest words to picture. */
const NOUN = 2;

export class Catalog {
  constructor(private data: CatalogData) {}

  get categories() {
    return this.data.categories;
  }

  /** Every bundled picture, for storing them all offline. */
  get ids(): number[] {
    return this.data.items.map(([id]) => id);
  }

  /**
   * Pictograms whose keyword starts with or contains the query, common words first within
   * each kind of match; all drawings of a word are kept.
   */
  searchWord(query: string): Pictogram[] {
    const q = normalize(query);
    if (!q) return [];
    const hits: { p: Pictogram; freq: number; rank: number }[] = [];
    for (const [id, words] of this.data.items) {
      let best: { word: string; freq: number; rank: number } | null = null;
      for (const [word, , freq = 0] of words) {
        const w = normalize(word);
        const rank = w === q ? 0 : w.startsWith(q) ? 1 : w.includes(q) ? 2 : -1;
        if (rank >= 0 && (!best || rank < best.rank || (rank === best.rank && freq > best.freq))) {
          best = { word, freq, rank };
        }
      }
      if (best) hits.push({ p: toPictogram(id, best.word), freq: best.freq, rank: best.rank });
    }
    return hits
      .sort((a, b) => a.rank - b.rank || b.freq - a.freq || a.p.keyword.length - b.p.keyword.length)
      .map((h) => h.p);
  }

  /**
   * Single words that contain a sound (typed as letters, e.g. „sch“) at the given position.
   * One picture per word, so the list reads like a word list for therapy; common words first.
   */
  searchSound(sound: string, position: SoundPosition, nounsOnly = false): Pictogram[] {
    const options = querySounds(sound);
    if (!options.length) return [];
    const seen = new Set<string>();
    const hits: { p: Pictogram; freq: number }[] = [];
    for (const [id, words] of this.data.items) {
      for (const [word, type, freq = 0] of words) {
        if (nounsOnly && type !== NOUN) continue;
        const w = normalize(word);
        if (w.includes(' ') || seen.has(w) || !matchSounds(wordSounds(w), options, position)) continue;
        seen.add(w);
        hits.push({ p: toPictogram(id, word), freq });
      }
    }
    return byFrequency(hits);
  }

  /** Pictograms of a category, one per word, common words first. */
  inCategory(categoryId: string): Pictogram[] {
    const bit = this.data.categories.findIndex((c) => c.id === categoryId);
    if (bit === -1) return [];
    const seen = new Set<string>();
    const hits: { p: Pictogram; freq: number }[] = [];
    for (const [id, words, mask] of this.data.items) {
      if (!(mask & (1 << bit))) continue;
      const [word, , freq = 0] = words[0];
      if (seen.has(word)) continue;
      seen.add(word);
      hits.push({ p: toPictogram(id, word), freq });
    }
    return byFrequency(hits);
  }
}

/**
 * Whether a word has a sound at the given position, by how the word is spoken, not spelled:
 * „s“ finds „Sonne“ and „Fuß“ but not „Stein“ (spoken „scht“) or „Schule“; „sch“ finds „Stein“
 * too; „t“ at the end finds „Hund“. Letters that can stand for several sounds find all of them:
 * „st“ finds „Stern“ and „Fenster“, „v“ finds „Vogel“ and „Vase“.
 */
export function hasSound(word: string, sound: string, position: SoundPosition): boolean {
  return matchSounds(wordSounds(word), querySounds(sound), position);
}

function matchSounds(word: Sound[], options: Sound[][], position: SoundPosition): boolean {
  return options.some((q) => {
    const matchesAt = (i: number) => q.every((s, j) => word[i + j] === s);
    const last = word.length - q.length;
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
  });
}

/** Common words first, words of equal frequency alphabetically. */
function byFrequency(hits: { p: Pictogram; freq: number }[]): Pictogram[] {
  return hits.sort((a, b) => b.freq - a.freq || a.p.keyword.localeCompare(b.p.keyword, 'de')).map((h) => h.p);
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
