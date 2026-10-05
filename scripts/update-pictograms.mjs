// Builds the picture collection that ships with the app: picks child-friendly ARASAAC
// pictograms, stores them as WebP in public/pictograms/ and writes the search index.
// The app then needs no external requests. Run `npm run update-pictograms`, then commit
// public/pictograms/ and src/lib/pictures/arasaac-index.json.
//
// `npm run update-pictograms -- --candidates <file>` only writes all words that would be
// kept (one per line, „word<TAB>noun|verb“) for reviewing them into pictogram-exclusions.json.
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'https://api.arasaac.org/v1/pictograms/all/de';
const IMAGE = (id) => `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
/** How often words are used in spoken German: OpenSubtitles 2018, via hermitdave/FrequencyWords (CC BY-SA 4.0). */
const FREQUENCIES = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_full.txt';
const PICTURE_DIR = new URL('../public/pictograms/', import.meta.url);
const INDEX = new URL('../src/lib/pictures/arasaac-index.json', import.meta.url);
const EXCLUSIONS = new URL('./pictogram-exclusions.json', import.meta.url);
const SELECTION = new URL('./pictogram-selection.json', import.meta.url);
const SIZE = 256;
const PARALLEL_DOWNLOADS = 6;

// ---- Selection (adjust here) ----

/** ARASAAC keyword types to keep: 2 = common noun, 3 = verb. Add 4 for adjectives. */
const KEYWORD_TYPES = new Set([2, 3]);
/** Single words only – phrases like „Eis essen“ are hard to use on a wheel. */
const SINGLE_WORDS_ONLY = true;
/** Drawings per word. ARASAAC often has several (e.g. three dogs); the first is kept. */
const MAX_PER_WORD = 1;
/**
 * Topics that rarely fit therapy with children. Keep these narrow: broad ARASAAC tags like
 * 'core vocabulary', 'work' or 'event' also cover basics such as Kuh, Nase or Schnee.
 */
const EXCLUDED_TAGS = new Set([
  'medical procedure', 'medical equipment', 'religion', 'christianity', 'political geography',
  'country', 'flag', 'alphabet', 'mathematics', 'signaling system', 'disruptive behavior',
]);
/** Words kept although ARASAAC lists them with another type (e.g. „Mond“ as a proper name). */
const EXTRA_WORDS = new Set(['mond']);
// Vulgar words ARASAAC does not flag.
const BLOCKED_WORDS = new Set(['arsch', 'kacke', 'kacken', 'scheißen', 'scheißhaufen']);
/**
 * Words too rare or specialised for children (e.g. „Kabinettsleiter“), reviewed once and
 * editable by hand. Only the word is dropped; a picture stays if it has other words left.
 */
const EXCLUDED_WORDS = new Set(
  JSON.parse(await readFile(EXCLUSIONS, 'utf8').catch(() => '{"words":[]}')).words.map((w) =>
    w.toLocaleLowerCase('de'),
  ),
);

/**
 * Reviewed list of pictures that fit therapy with children (ARASAAC ids). When present, only
 * these pictures ship – new ARASAAC pictures stay out until someone adds them here.
 * `--pictures <file>` exports all candidates for such a review.
 */
const SELECTION_IDS = await readFile(SELECTION, 'utf8').then(
  (text) => new Set(JSON.parse(text).ids),
  () => null,
);
const reviewing = process.argv.includes('--pictures') || process.argv.includes('--candidates');

// Category buttons in the picker (shown for an empty search), matched against ARASAAC tags.
const CATEGORIES = [
  { id: 'animals', label: 'Tiere', tags: ['animal'], exclude: ['food'] },
  { id: 'food', label: 'Essen', tags: ['food', 'fruit', 'vegetable'] },
  { id: 'toys', label: 'Spielzeug', tags: ['toy', 'game'] },
  { id: 'vehicles', label: 'Fahrzeuge', tags: ['mode of transport'] },
  { id: 'clothes', label: 'Kleidung', tags: ['clothes'] },
  { id: 'body', label: 'Körper', tags: ['human body'] },
  { id: 'home', label: 'Zuhause', tags: ['household', 'furniture'] },
  { id: 'music', label: 'Musik', tags: ['musical instrument'] },
  { id: 'plants', label: 'Pflanzen', tags: ['plant'] },
  { id: 'sport', label: 'Sport', tags: ['sport'] },
  { id: 'actions', label: 'Tätigkeiten', tags: ['verb'] },
];

// ---- Pick pictograms ----

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`ARASAAC antwortet mit ${res.status}`);
const all = await res.json();

const perWord = new Map();
const items = [];
for (const p of all) {
  // Children use the app: leave out pictograms ARASAAC marks as sexual or violent.
  if (p.sex || p.violence) continue;
  if (SELECTION_IDS && !reviewing && !SELECTION_IDS.has(p._id)) continue;
  const tags = new Set(p.tags ?? []);
  if ([...tags].some((t) => EXCLUDED_TAGS.has(t))) continue;
  const words = (p.keywords ?? [])
    .map((k) => [typeof k.keyword === 'string' ? k.keyword.trim() : '', k.type ?? 0])
    .filter(([w, type]) => w && (KEYWORD_TYPES.has(type) || EXTRA_WORDS.has(w.toLocaleLowerCase('de'))))
    .filter(([w]) => !(SINGLE_WORDS_ONLY && w.includes(' ')))
    .filter(([w]) => !BLOCKED_WORDS.has(w.toLocaleLowerCase('de')))
    .filter(([w]) => !EXCLUDED_WORDS.has(w.toLocaleLowerCase('de')));
  if (words.length === 0) continue;
  const main = words[0][0].toLocaleLowerCase('de');
  if ((perWord.get(main) ?? 0) >= MAX_PER_WORD) continue;
  perWord.set(main, (perWord.get(main) ?? 0) + 1);
  let mask = 0;
  CATEGORIES.forEach((c, i) => {
    if (c.tags.some((t) => tags.has(t)) && !c.exclude?.some((t) => tags.has(t))) mask |= 1 << i;
  });
  items.push([p._id, words, mask]);
}

const picturesArg = process.argv.indexOf('--pictures');
if (picturesArg !== -1) {
  const tagsById = new Map(all.map((p) => [p._id, (p.tags ?? []).slice(0, 4).join('/')]));
  const lines = items.map(([id, words]) => `${id}\t${words.map(([w]) => w).join(', ')}\t${tagsById.get(id)}`);
  await writeFile(process.argv[picturesArg + 1], lines.join('\n'));
  console.log(`${lines.length} Bilder geschrieben.`);
  process.exit(0);
}

const candidatesArg = process.argv.indexOf('--candidates');
if (candidatesArg !== -1) {
  const lines = new Map();
  for (const [, words] of items) for (const [w, type] of words) lines.set(w, `${w}\t${type === 3 ? 'verb' : 'noun'}`);
  await writeFile(process.argv[candidatesArg + 1], [...lines.values()].sort((a, b) => a.localeCompare(b, 'de')).join('\n'));
  console.log(`${lines.size} Wörter aus ${items.length} Bildern geschrieben.`);
  process.exit(0);
}

// ---- Download and convert (pictures already present are kept) ----

await mkdir(PICTURE_DIR, { recursive: true });
const present = new Set(await readdir(PICTURE_DIR));
const wanted = new Set(items.map(([id]) => `${id}.webp`));
for (const file of present) if (!wanted.has(file)) await rm(new URL(file, PICTURE_DIR));

const missing = items.map(([id]) => id).filter((id) => !present.has(`${id}.webp`));
const failed = new Set();
let next = 0;
let done = 0;
async function worker() {
  while (next < missing.length) {
    const id = missing[next++];
    try {
      const img = await fetch(IMAGE(id));
      if (!img.ok) throw new Error(String(img.status));
      const webp = await sharp(Buffer.from(await img.arrayBuffer()))
        .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 80, alphaQuality: 90 })
        .toBuffer();
      await writeFile(new URL(`${id}.webp`, PICTURE_DIR), webp);
    } catch (err) {
      failed.add(id);
      console.warn(`Bild ${id} fehlt: ${err.message}`);
    }
    if (++done % 250 === 0) console.log(`${done} / ${missing.length} Bilder geladen`);
  }
}
await Promise.all(Array.from({ length: PARALLEL_DOWNLOADS }, worker));

// ---- Word frequency, so common words come first in the picker ----

const freqRes = await fetch(FREQUENCIES);
if (!freqRes.ok) throw new Error(`Worthäufigkeiten: Antwort ${freqRes.status}`);
const counts = new Map();
let total = 0;
for (const line of (await freqRes.text()).split('\n')) {
  const [word, count] = line.split(' ');
  if (!word || !count) continue;
  total += +count;
  // Counted without case, so „essen“ and „Essen“ count together.
  const key = word.toLocaleLowerCase('de');
  counts.set(key, (counts.get(key) ?? 0) + +count);
}
/** Zipf scale × 10 (log10 of uses per billion words): about 70 for „Hund“, 0 if unknown. */
const frequency = (word) => {
  const count = counts.get(word.toLocaleLowerCase('de'));
  return count ? Math.max(1, Math.round(Math.log10((count / total) * 1e9) * 10)) : 0;
};
for (const item of items) item[1] = item[1].map(([w, type]) => [w, type, frequency(w)]);

// ---- Search index (only pictures that are really there) ----

const index = {
  updated: new Date().toISOString().slice(0, 10),
  categories: CATEGORIES.map(({ id, label }) => ({ id, label })),
  // [pictogram id, [[keyword, ARASAAC keyword type, frequency]], category bit mask]
  items: items.filter(([id]) => !failed.has(id)),
};
await writeFile(INDEX, JSON.stringify(index));
console.log(`${index.items.length} Bilder in public/pictograms/, ${failed.size} fehlgeschlagen.`);
