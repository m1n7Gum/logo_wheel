// German words as sounds, for the sound search („Laut“). Rules for the spelling plus lists of
// exceptions, tuned to the bundled word list: good enough to tell „s“ in „Sonne“ from the
// „sch“ in „Stein“, not a full pronunciation dictionary.

/**
 * One sound, written the usual German way: 'sch', 'ch', 'ng', 'z' (ts), 'ai' (ei/ai),
 * 'au', 'oi' (eu/äu); 'ä', 'ö', 'ü' and the other letters stand for themselves.
 */
export type Sound = string;

const VOWELS = 'aeiouäöüy';
const isVowel = (c: string | undefined) => c !== undefined && VOWELS.includes(c);
const isVowelSound = (s: Sound | undefined) => s !== undefined && isVowel(s[0]);

/**
 * Words and parts of words that are not spoken as written, mostly borrowed from English or
 * French, respelled the German way. „|“ marks where a new part of a word begins, so letters on
 * either side do not join into one sound („ping|guin“: ng and g).
 */
const RESPELLINGS: Record<string, string> = {
  // Borrowed words
  alien: 'ehli|en',
  aubergine: 'auberschine',
  baby: 'bebi',
  board: 'bord',
  body: 'bodi',
  brownie: 'brauni',
  bowling: 'bouling',
  buggy: 'bagi',
  burger: 'börger',
  cafe: 'kafe',
  camper: 'kemper',
  camping: 'kemping',
  cartoon: 'kartun',
  cello: 'tschello',
  champignon: 'schampinjon',
  chef: 'schef',
  chamäleon: 'kamäleon',
  chips: 'tschips',
  clown: 'klaun',
  cerealien: 'zereali|en',
  computer: 'kompjuter',
  controller: 'kontroler',
  cookies: 'kukis',
  cornflakes: 'kornflehks',
  couch: 'kautsch',
  cousin: 'kusän',
  cousine: 'kusine',
  cowboy: 'kauboi',
  cracker: 'kräker',
  croissant: 'kroassan',
  crepe: 'kräp',
  cupcake: 'kapkehk',
  custard: 'kastard',
  grapefruit: 'grehpfrut',
  handy: 'händi',
  hurricane: 'harikehn',
  ice: 'ais',
  ingenieur: 'inschenjör',
  jogging: 'dschoging',
  joghurt: 'jogurt',
  ketchup: 'ketschap',
  jongleur: 'schonglör',
  leggings: 'legings',
  longsleeve: 'longsliw',
  lunchbox: 'lantschbox',
  'make|up': 'mehkap',
  memory: 'memori',
  modedesign: 'mode|disain',
  notebook: 'noutbuk',
  milchshake: 'milch|schehk',
  orange: 'oransche',
  overall: 'oweral',
  pancakes: 'penkehks',
  party: 'parti',
  passagier: 'passaschier',
  playmobil: 'pleimobil',
  'plugin|hybrid': 'plagin|hübrit',
  pony: 'poni',
  pool: 'pul',
  popcorn: 'popkorn',
  power: 'pauer',
  pullbuoy: 'pulboi',
  pyjama: 'pü|dschama',
  rallye: 'rali',
  sandwich: 'sendwitsch',
  ranger: 'rein|dscher',
  restaurant: 'restoran',
  scooter: 'skuter',
  shampoo: 'schampu',
  shirt: 'schört',
  shop: 'schop',
  shorts: 'schorts',
  skate: 'skeht',
  skater: 'skehter',
  slush: 'slasch',
  slushy: 'slaschi',
  snow: 'snou',
  spaghetti: 'spagetti',
  surf: 'sörf',
  sweat: 'swet',
  tablet: 'teblet',
  teddy: 'tedi',
  timer: 'taimer',
  toast: 'tost',
  training: 'träning',
  trenchcoat: 'trentschkout',
  trolley: 'troli',
  volleyball: 'wolibal',
  watch: 'wotsch',
  white: 'wait',
  yacht: 'jacht',
  zucchini: 'zukini',
  // Letter names
  cd: 'zede',
  hdtv: 'hadetefau',
  lcd: 'elzede',
  lkw: 'elkawe',
  pc: 'peze',
  's|bahn': 'es|bahn',
  't|rex': 'te|rex',
  't|shirt': 'ti|schört',
  tv: 'tefau',
  wc: 'weze',
  // „th“ spoken t; elsewhere t and h belong to different parts („Rat|haus“)
  apotheke: 'apoteke',
  bibliothek: 'bibliotek',
  labyrinth: 'labürint',
  mathe: 'mate',
  panther: 'panter',
  theater: 'teater',
  themen: 'temen',
  thermometer: 'termometer',
  thron: 'tron',
  thunfisch: 'tunfisch',
  // „ng“ spoken ng-g
  bongo: 'bong|go',
  flamingo: 'flaming|go',
  känguru: 'käng|guru',
  mango: 'mang|go',
  pinguin: 'ping|guin',
  tangram: 'tang|gram',
  // „st“ and „sp“ inside a word part, not at its start: s-t, s-p
  flüstern: 'flüs|tern',
  oster: 'os|ter',
  transport: 'trans|port',
  western: 'wes|tern',
  // „ie“ spoken i-e
  familie: 'famili|e',
  ferien: 'feri|en',
  kanarien: 'kanari|en|',
  kastanie: 'kastani|e',
  knien: 'kni|en',
  linie: 'lini|e',
  marien: 'mari|en|',
  utensilien: 'utensili|en',
  // Other
  häuschen: 'häus|chen',
  radieschen: 'radies|chen',
  radiesschen: 'radies|chen',
  pfirsichsaft: 'pfirsich|saft',
  ruhig: 'ruig',
  // Where two parts meet: Erd|nuss spoken with t, Weg|laufen with k
  erdn: 'erd|n',
  handrühr: 'hand|rühr',
  weglauf: 'weg|lauf',
  windrad: 'wind|rad',
  veranda: 'weranda',
};

const RESPELL = new RegExp(
  Object.keys(RESPELLINGS)
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[-|]/g, '\\$&'))
    .join('|'),
  'g',
);

/**
 * Word parts that begin with „st“ or „sp“, spoken „scht“, „schp“, when they come after another
 * part („Blei|stift“, „Ball|spiel“). At the start of a word „st“ and „sp“ are always spoken so.
 */
const SCH_PARTS = new RegExp(
  `^s(?:t(?:${[
    'ab', 'adt', 'all', 'and', 'ange', 'apel', 'apf', 'ation', 'äb', 'änder', 'eck', 'eh', 'eig', 'ein', 'ell',
    'elz', 'ern', 'ift', 'iefel', 'iel', 'ock', 'off', 'öck', 'öpsel', 'rahl', 'rand', 'raße', 'rauch', 'reif',
    'rumpf', 'uhl', 'umpf', 'unde', 'ück',
  ].join('|')})|p(?:${[
    'ange', 'end', 'enst', 'iegel', 'iel', 'inn', 'itz', 'ort', 'rech', 'ring', 'rosse', 'rung', 'ur', 'ül',
  ].join('|')}))`,
);

/**
 * Stems with „enk“ spoken „engk“; elsewhere e-n-k is usually the end of one part and the start
 * of the next („Rosen|kohl“).
 */
const ENK = /(?:(?:^|\|)(?:d|l|spr)?|nachd|sch|gel)enk$/;

/** Clean up a word or query: lower case, letters only, other marks as part borders. */
function clean(text: string): string {
  return text
    .trim()
    .toLocaleLowerCase('de')
    .replace(/[éèê]/g, 'e')
    .replace(/ñ/g, 'nj')
    .replace(/[^a-zäöüß| -]/g, '')
    .replace(/[ -]+/g, '|');
}

/** Spelling changes that depend on the whole word: borrowed words, „st“/„sp“ said „scht“/„schp“. */
function respell(word: string): string {
  // Ski is spoken „Schi“, but not in „skizzieren“.
  const w = word.replace(RESPELL, (m) => RESPELLINGS[m]).replace(/(^|\|)ski(?!z)/g, '$1schi');
  return w
    .split('|')
    .map((part) => {
      let out = '';
      for (let i = 0; i < part.length; i++) {
        const atStart = i === 0;
        if (part[i] === 's' && (part[i + 1] === 't' || part[i + 1] === 'p') && (atStart || SCH_PARTS.test(part.slice(i)))) {
          out += atStart ? 'sch' : '|sch';
        } else {
          out += part[i];
        }
      }
      return out;
    })
    .join('|');
}

/**
 * Sounds for each position; a query can mean more than one sound („v“: f or w), a word not.
 * An empty list is a silent letter.
 */
type Choices = Sound[][];

/**
 * Turns letters into sounds. For a word (`exact`), the spelling rules that depend on what comes
 * around are applied: final b/d/g spoken p/t/k („Hund“), silent h after a vowel („Kuh“), „-ig“
 * spoken „-ich“, n before k spoken ng („Bank“). For a query, letters that can mean several sounds
 * give all of them.
 */
function tokenize(w: string, exact: boolean): Choices[] {
  const out: Choices[] = [];
  let partStart = true;
  /** The last sound so far. */
  const last = (): Sound | undefined => {
    const sounds = out[out.length - 1]?.[0];
    return sounds?.[sounds.length - 1];
  };
  /** Sounds for one or more letters; a word has one choice only. */
  const push = (...sounds: Sound[]) => out.push([sounds]);
  /** The next letter after `i`, skipping part borders. */
  const after = (i: number) => w.slice(i).replace(/\|/g, '')[0];
  /** True at the end of a word part or before a consonant: where b, d, g are spoken p, t, k. */
  const voicelessAt = (i: number) => {
    if (!exact) return false;
    const next = w[i];
    if (next === undefined || next === '|') return true;
    // Before l, r, n only after „ab-“ (ab|lecken) and in „-ling“ (Säug|ling); voiced in Adler, Zebra.
    if ('lrn'.includes(next)) return (i === 2 && w.startsWith('ab')) || w.startsWith('ling', i);
    return !isVowel(next);
  };

  for (let i = 0; i < w.length; ) {
    const c = w[i];
    const rest = w.slice(i);
    const prev = last();
    const start = partStart;
    partStart = false;

    if (c === '|') {
      partStart = true;
      i++;
      continue;
    }

    // Vowels
    if (/^(ei|ai|ey|ay)/.test(rest)) { push('ai'); i += 2; continue; }
    if (rest.startsWith('au')) { push('au'); i += 2; continue; }
    if (/^(eu|äu|oi)/.test(rest)) { push('oi'); i += 2; continue; }
    if (rest.startsWith('ie')) { push('i'); i += 2; continue; }
    if (/^(aa|ee|oo)/.test(rest)) { push(c); i += 2; continue; }
    if (c === 'y') {
      // Yoga, but Pyramide, Hyäne
      if (exact) push(start && isVowel(w[i + 1]) ? 'j' : 'ü');
      else out.push([['i'], ['ü'], ['j']]);
      i++;
      continue;
    }
    if (isVowel(c)) {
      // „-ig“ at the end of a part is spoken „-ich“: König, Honig|biene.
      if (exact && c === 'i' && w[i + 1] === 'g' && w[i + 2] !== 'g' && prev && !isVowelSound(prev) && voicelessAt(i + 2)) {
        push('i', 'ch');
        i += 2;
        continue;
      }
      push(c);
      i++;
      continue;
    }

    // Consonants made of several letters
    if (rest.startsWith('sch')) { push('sch'); i += 3; continue; }
    if (start && rest.startsWith('dsch')) { push('d', 'sch'); i += 4; continue; } // Dschungel
    if (rest.startsWith('chs')) {
      if (exact) push('k', 's');
      else out.push([['k', 's'], ['ch', 's']]);
      i += 3;
      continue;
    }
    if (rest.startsWith('ch')) {
      // Christ|stern: „chr“, „chl“ at the start are spoken k.
      push(start && (w[i + 2] === 'r' || w[i + 2] === 'l') ? 'k' : 'ch');
      i += 2;
      continue;
    }
    if (rest.startsWith('ck')) { push('k'); i += 2; continue; }
    if (rest.startsWith('ng')) {
      // After ei, au, eu (Ein|gang) the n ends the part before, also in „-en|ge…“ (Küchen|geschirr,
      // but Menge).
      const afterDiphthong = prev !== undefined && prev.length === 2 && isVowelSound(prev);
      const afterEn = prev === 'e' && i > 1 && w[i - 2] !== '|' && rest.startsWith('nge') && rest.length > 4;
      if (exact && (afterDiphthong || afterEn)) {
        push('n');
        i++;
      } else {
        push('ng');
        i += 2;
      }
      continue;
    }
    if (c === 'n' && w[i + 1] === 'k') {
      if (!exact) out.push([['n'], ['ng']]);
      else push(nkIsNg(w, i, prev) ? 'ng' : 'n');
      i++;
      continue;
    }
    if (rest.startsWith('qu')) { push('k', 'w'); i += 2; continue; }
    if (rest.startsWith('ph')) { push('f'); i += 2; continue; }
    if (rest.startsWith('dt')) { push('t'); i += 2; continue; }
    if (rest.startsWith('tz')) { push('z'); i += 2; continue; }
    if (rest.startsWith('tion')) { push('z'); i++; continue; } // Station

    // A doubled consonant is one sound: Kuss, Bett. But Glas|scheibe: s and sch.
    if (w[i + 1] === c && !rest.startsWith('ssch')) {
      push(single(c, voicelessAt(i + 2)));
      i += 2;
      continue;
    }

    switch (c) {
      case 'ß':
        push('s');
        break;
      case 'x':
        push('k', 's');
        break;
      case 'c':
        if (exact) push('eiäy'.includes(w[i + 1]) ? 'z' : 'k');
        else out.push([['k'], ['z']]);
        break;
      case 'v':
        if (exact) push(vIsF(w, i, start) ? 'f' : 'w');
        else out.push([['f'], ['w']]);
        break;
      case 's':
        // In a query, „st“ and „sp“ may mean s-t or sch-t: „st“ finds Fenster and Stern.
        if (!exact && (w[i + 1] === 't' || w[i + 1] === 'p')) out.push([['s'], ['sch']]);
        else push('s');
        break;
      case 'h': {
        // Silent after a vowel within a part (Kuh, Zahn, gehen, Erziehung), spoken before a, o, u …
        // (Uhu, See|hund).
        const next = after(i + 1);
        const silent = !isVowel(next) || next === 'e' || w.startsWith('ung', i + 1);
        push(...(exact && isVowelSound(prev) && !start && silent ? [] : ['h']));
        break;
      }
      default:
        push(single(c, voicelessAt(i + 1)));
    }
    i++;
  }
  return out;
}

/** A consonant letter as a sound; b, d, g at the end of a part spoken p, t, k. */
function single(c: string, voiceless: boolean): Sound {
  if (voiceless) return { b: 'p', d: 't', g: 'k' }[c] ?? c;
  return c;
}

/** Bank, trinken, Onkel: n before k is spoken ng, except where the n ends a part (Klein|kind, an|kleiden). */
function nkIsNg(w: string, i: number, prev: Sound | undefined): boolean {
  if (!prev || prev.length !== 1 || !isVowelSound(prev)) return false;
  // The vowel must be a single letter: not „ee“ (Halloween|kürbis).
  if (w[i - 1] !== prev || w[i - 2] === prev) return false;
  if (prev === 'e') return ENK.test(w.slice(0, i + 2));
  // an|kleiden, an|knipsen, but Anker
  const partStart = w.lastIndexOf('|', i) + 1;
  if (i - partStart === 1 && 'au'.includes(w[partStart]) && !w.startsWith('anker', partStart)) return false;
  return true;
}

/** v spoken f in German words (Vater, Vogel, ver-, vor-), w in borrowed ones (Vase, Klavier). */
function vIsF(w: string, i: number, start: boolean): boolean {
  const rest = w.slice(i);
  if (i === w.length - 1 || w[i + 1] === '|') return true; // Detektiv
  if (start) return /^(vater|vogel|vög|vier|viel|vieh|voll|vor|ver|vetter|völk)/.test(rest);
  // Inside a word only after a consonant: Groß|vater, Eis|verkäufer, but Pullover.
  return !isVowel(w[i - 1]) && /^(vater|vogel|vög|ver)/.test(rest);
}

const cache = new Map<string, Sound[]>();

/** The sounds of a word, as they are spoken: „Stein“ → sch t ai n, „Hund“ → h u n t. */
export function wordSounds(word: string): Sound[] {
  const w = clean(word);
  let sounds = cache.get(w);
  if (!sounds) {
    sounds = tokenize(respell(w), true).flatMap((choices) => choices[0]);
    cache.set(w, sounds);
  }
  return sounds;
}

/**
 * What a typed sound can mean, as lists of sounds: „sch“ → [sch], „st“ → [s t] or [sch t],
 * „x“ → [k s].
 */
export function querySounds(query: string): Sound[][] {
  let options: Sound[][] = [[]];
  for (const choices of tokenize(clean(query).replace(/\|/g, ''), false)) {
    options = options.flatMap((o) => choices.map((c) => [...o, ...c]));
  }
  const seen = new Set<string>();
  return options.filter((o) => o.length > 0 && !seen.has(o.join(' ')) && seen.add(o.join(' ')));
}
