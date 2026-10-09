import { describe, expect, it } from 'vitest';
import { hasSound } from './catalog';
import { querySounds, wordSounds } from './sounds';

const sounds = (word: string) => wordSounds(word).join(' ');

describe('wordSounds', () => {
  it('speaks „st“ and „sp“ as „scht“, „schp“ where a word part begins', () => {
    expect(sounds('Stein')).toBe('sch t ai n');
    expect(sounds('Spitze')).toBe('sch p i z e');
    expect(sounds('Bleistift')).toBe('b l ai sch t i f t');
    expect(sounds('Zahnspange')).toBe('z a n sch p a ng e');
    expect(sounds('Gespenst')).toBe('g e sch p e n s t');
    expect(sounds('Eisstiel')).toBe('ai s sch t i l');
  });

  it('keeps s-t and s-p elsewhere', () => {
    expect(sounds('Skat')).toBe('s k a t');
    expect(sounds('Fenster')).toBe('f e n s t e r');
    expect(sounds('Wespe')).toBe('w e s p e');
    expect(sounds('Osterhase')).toBe('o s t e r h a s e');
    expect(sounds('Haustier')).toBe('h au s t i r');
    expect(sounds('Western')).toBe('w e s t e r n');
  });

  it('reads sounds written with several letters as one', () => {
    expect(sounds('Kuss')).toBe('k u s');
    expect(sounds('Fuß')).toBe('f u s');
    expect(sounds('Jacke')).toBe('j a k e');
    expect(sounds('Katze')).toBe('k a z e');
    expect(sounds('Ring')).toBe('r i ng');
    expect(sounds('Bank')).toBe('b a ng k');
    expect(sounds('Eis')).toBe('ai s');
    expect(sounds('Feuer')).toBe('f oi e r');
    expect(sounds('Biene')).toBe('b i n e');
  });

  it('follows common spelling rules', () => {
    expect(sounds('Hund')).toBe('h u n t');
    expect(sounds('Zug')).toBe('z u k');
    expect(sounds('König')).toBe('k ö n i ch');
    expect(sounds('Kuh')).toBe('k u');
    expect(sounds('Seehund')).toBe('s e h u n t');
    expect(sounds('Fuchs')).toBe('f u k s');
    expect(sounds('Hexe')).toBe('h e k s e');
    expect(sounds('Qualle')).toBe('k w a l e');
    expect(sounds('Vogel')).toBe('f o g e l');
    expect(sounds('Vase')).toBe('w a s e');
    expect(sounds('Clown')).toBe('k l au n');
  });

  it('knows where word parts meet', () => {
    expect(sounds('Pinguin')).toBe('p i ng g u i n');
    expect(sounds('eingießen')).toBe('ai n g i s e n');
    expect(sounds('Kleinkind')).toBe('k l ai n k i n t');
    expect(sounds('Rosenkohl')).toBe('r o s e n k o l');
    expect(sounds('Geschenk')).toBe('g e sch e ng k');
  });
});

describe('querySounds', () => {
  it('gives every sound the letters can stand for', () => {
    expect(querySounds('sch')).toEqual([['sch']]);
    expect(querySounds('St')).toEqual([['s', 't'], ['sch', 't']]);
    expect(querySounds('ß')).toEqual([['s']]);
    expect(querySounds('ck')).toEqual([['k']]);
    expect(querySounds('v')).toEqual([['f'], ['w']]);
    expect(querySounds('  ')).toEqual([]);
  });
});

describe('hasSound', () => {
  it('does not find the „sch“ of „st“, „sp“ when searching „s“', () => {
    expect(hasSound('stein', 's', 'start')).toBe(false);
    expect(hasSound('spitze', 's', 'any')).toBe(false);
    expect(hasSound('bleistift', 's', 'any')).toBe(false);
    expect(hasSound('skat', 's', 'start')).toBe(true);
    expect(hasSound('fenster', 's', 'middle')).toBe(true);
    expect(hasSound('stein', 'sch', 'start')).toBe(true);
    expect(hasSound('bleistift', 'sch', 'middle')).toBe(true);
  });

  it('finds „st“ both ways', () => {
    expect(hasSound('stern', 'st', 'start')).toBe(true);
    expect(hasSound('fenster', 'st', 'middle')).toBe(true);
  });

  it('places a sound by how it is heard', () => {
    // „Kuss“ ends with s, the doubled letter is no s in the middle.
    expect(hasSound('kuss', 's', 'end')).toBe(true);
    expect(hasSound('kuss', 's', 'middle')).toBe(false);
    expect(hasSound('fuß', 's', 'end')).toBe(true);
    expect(hasSound('hund', 't', 'end')).toBe(true);
    expect(hasSound('hund', 'd', 'any')).toBe(false);
    expect(hasSound('kuh', 'h', 'any')).toBe(false);
    expect(hasSound('ring', 'g', 'any')).toBe(false);
    expect(hasSound('ring', 'n', 'any')).toBe(false);
    expect(hasSound('eis', 'e', 'start')).toBe(false);
    expect(hasSound('eis', 'ei', 'start')).toBe(true);
    expect(hasSound('fuchs', 'ch', 'any')).toBe(false);
  });
});
