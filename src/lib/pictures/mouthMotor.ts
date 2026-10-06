// Pictures for oral-motor exercises (Mundmotorik), drawn for this app: one face per animal and
// one mouth per exercise, after the usual myofunctional exercises. All animals have their mouth
// at the same spot (100, 122 in a 200 × 200 picture), so every exercise fits every animal. The pictures move (CSS inside the
// SVG, also when shown as <img>), except with reduced motion.

export interface MotorAnimal {
  id: string;
  label: string;
  /** Head and body without mouth. */
  face: string;
  /** Rosy cheeks, left out where the exercise draws its own. */
  blush: string;
}

export interface MotorExercise {
  id: string;
  /** Short, so it fits on the wheel next to the picture. */
  label: string;
  mouth: string;
  ownCheeks?: boolean;
}

const INK = '#4a3428';
const MOUTH = '#7a2433';
const TONGUE = '#f2899b';
const TONGUE_LINE = '#d0607a';
const BLUSH = '#f59a9a';

const eye = (x: number, y: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="10" ry="11.5" fill="#fff" stroke="${INK}" stroke-width="2.5"/>` +
  `<ellipse cx="${x + 1}" cy="${y + 1.5}" rx="6.5" ry="7.5" fill="#2b1d14"/>` +
  `<circle cx="${x + 3.5}" cy="${y - 2}" r="2.6" fill="#fff"/>`;
const eyes = (y: number) => eye(78, y) + eye(122, y);
/** Dark shiny eye without white, for dark eye patches. */
const buttonEye = (x: number, y: number, r = 8) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#2b1d14"/>` +
  `<circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.38}" fill="#fff"/><circle cx="${x - r * 0.33}" cy="${y + r * 0.35}" r="${r * 0.17}" fill="#fff"/>`;
const blush = (y = 114) =>
  `<ellipse cx="62" cy="${y}" rx="9" ry="6" fill="${BLUSH}" opacity=".7"/>` +
  `<ellipse cx="138" cy="${y}" rx="9" ry="6" fill="${BLUSH}" opacity=".7"/>`;
/** Outlined shapes in the cosy style of the app's animals. */
const outlined = (shapes: string) =>
  `<g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${shapes}</g>`;

const DINO_GREEN = '#8ccf6a';
const dino: MotorAnimal = {
  id: 'dino',
  label: 'Dino',
  face:
    outlined(
      `<path d="M 128 180 C 152 184 170 172 178 148 C 168 158 150 162 132 158 Z" fill="${DINO_GREEN}"/>` +
        `<ellipse cx="100" cy="170" rx="40" ry="30" fill="${DINO_GREEN}"/>` +
        `<ellipse cx="100" cy="175" rx="24" ry="20" fill="#f6e6a6"/>` +
        `<ellipse cx="80" cy="195" rx="13" ry="5.5" fill="${DINO_GREEN}"/>` +
        `<ellipse cx="120" cy="195" rx="13" ry="5.5" fill="${DINO_GREEN}"/>` +
        `<ellipse cx="64" cy="166" rx="7.5" ry="12" fill="${DINO_GREEN}" transform="rotate(25 64 166)"/>` +
        `<ellipse cx="136" cy="166" rx="7.5" ry="12" fill="${DINO_GREEN}" transform="rotate(-25 136 166)"/>` +
        `<path d="M 80 48 L 88 26 L 97 42 L 104 20 L 112 40 L 122 28 L 124 50 Z" fill="#5fae4c"/>` +
        `<ellipse cx="100" cy="94" rx="64" ry="54" fill="${DINO_GREEN}"/>`,
    ) +
    `<ellipse cx="100" cy="120" rx="40" ry="24" fill="#a9de8a"/>` +
    `<g fill="#6cb653"><circle cx="70" cy="60" r="5"/><circle cx="82" cy="52" r="3.5"/><circle cx="130" cy="58" r="4.5"/><circle cx="142" cy="72" r="3"/><circle cx="58" cy="76" r="3"/></g>` +
    `<path d="M 86 186 l 28 0 M 82 178 l 36 0 M 84 168 l 32 0" stroke="#e3cf84" stroke-width="2" stroke-linecap="round"/>` +
    `<ellipse cx="92" cy="101" rx="2.2" ry="1.6" fill="${INK}"/><ellipse cx="108" cy="101" rx="2.2" ry="1.6" fill="${INK}"/>` +
    eyes(82),
  blush: blush(),
};

const WOOL = '#fff7ec';
const alpaca: MotorAnimal = {
  id: 'alpaca',
  label: 'Alpaka',
  face:
    outlined(
      `<path d="M 78 140 L 76 172 L 124 172 L 122 140 Z" fill="${WOOL}"/>` +
      `<path d="M 54 196 C 46 186 50 170 62 168 C 62 156 78 152 86 158 C 92 150 108 150 114 158 C 122 152 138 156 138 168 C 150 170 154 186 146 196 Z" fill="${WOOL}"/>` +
        `<path d="M 58 56 C 46 40 44 20 50 12 C 60 18 66 34 68 52 Z" fill="#f3e2c8"/>` +
        `<path d="M 142 56 C 154 40 156 20 150 12 C 140 18 134 34 132 52 Z" fill="#f3e2c8"/>` +
        `<ellipse cx="100" cy="98" rx="52" ry="50" fill="${WOOL}"/>` +
        `<path d="M 62 66 C 56 52 66 42 76 46 C 80 34 98 32 102 44 C 110 34 128 38 128 50 C 140 52 142 66 136 70 C 126 62 114 66 100 62 C 86 66 74 62 62 70 Z" fill="#fffdf8"/>` +
        `<ellipse cx="100" cy="122" rx="32" ry="25" fill="#f3e2c8"/>`,
    ) +
    `<path d="M 58.5 48 C 51 37 50 25 52 20 C 58 25 61 36 62 47 Z" fill="#f7b9b9"/>` +
    `<path d="M 141.5 48 C 149 37 150 25 148 20 C 142 25 139 36 138 47 Z" fill="#f7b9b9"/>` +
    `<path d="M 72 182 q 4 -4 8 0 M 118 180 q 4 -4 8 0 M 96 190 q 4 -4 8 0" fill="none" stroke="#e6d3b5" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M 94 104 Q 100 108 106 104 M 100 107.5 L 100 110" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>` +
    eyes(86) +
    `<path d="M 66 82 l -4 -3 M 134 82 l 4 -3" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  blush: blush(110),
};

const FUR = '#c8743f';
const cow: MotorAnimal = {
  id: 'cow',
  label: 'Kuh',
  face:
    outlined(
      `<ellipse cx="100" cy="184" rx="48" ry="36" fill="${FUR}"/>` +
        `<path d="M 60 66 C 40 64 28 52 26 34 C 36 46 48 50 64 52 Z" fill="#f6ead2"/>` +
        `<path d="M 140 66 C 160 64 172 52 174 34 C 164 46 152 50 136 52 Z" fill="#f6ead2"/>` +
        `<ellipse cx="44" cy="86" rx="15" ry="8" fill="${FUR}" transform="rotate(-20 44 86)"/>` +
        `<ellipse cx="156" cy="86" rx="15" ry="8" fill="${FUR}" transform="rotate(20 156 86)"/>` +
        `<ellipse cx="100" cy="98" rx="50" ry="52" fill="${FUR}"/>`,
    ) +
    eyes(92) +
    outlined(
      `<path d="M 54 82 C 56 60 72 46 100 44 C 128 46 144 60 146 82 C 140 76 136 84 130 78 C 124 88 118 78 112 84 C 106 76 100 86 94 80 C 88 88 82 78 76 84 C 70 76 64 86 54 82 Z" fill="#b3612f"/>` +
        `<ellipse cx="100" cy="122" rx="38" ry="27" fill="#f2b8a8"/>`,
    ) +
    `<path d="M 72 190 q 4 -4 8 0 M 120 188 q 4 -4 8 0" fill="none" stroke="#a65a2c" stroke-width="2" stroke-linecap="round"/>` +
    `<ellipse cx="86" cy="106" rx="4" ry="3" fill="#a8584a"/><ellipse cx="114" cy="106" rx="4" ry="3" fill="#a8584a"/>`,
  blush: blush(112),
};

const PENGUIN = '#3d5266';
const penguin: MotorAnimal = {
  id: 'penguin',
  label: 'Pinguin',
  face:
    outlined(
      `<ellipse cx="80" cy="196" rx="12" ry="5" fill="#f4a63a"/><ellipse cx="120" cy="196" rx="12" ry="5" fill="#f4a63a"/>` +
        `<ellipse cx="56" cy="166" rx="9" ry="20" fill="${PENGUIN}" transform="rotate(20 56 166)"/>` +
        `<ellipse cx="144" cy="166" rx="9" ry="20" fill="${PENGUIN}" transform="rotate(-20 144 166)"/>` +
        `<ellipse cx="100" cy="170" rx="44" ry="28" fill="${PENGUIN}"/>` +
        `<ellipse cx="100" cy="174" rx="30" ry="22" fill="#fff"/>` +
        `<ellipse cx="100" cy="96" rx="58" ry="54" fill="${PENGUIN}"/>` +
        `<path d="M 100 70 C 88 52 52 56 50 90 C 48 124 74 146 100 146 C 126 146 152 124 150 90 C 148 56 112 52 100 70 Z" fill="#fff" stroke-width="2"/>`,
    ) +
    eyes(88) +
    // A small beak like a nose, so the mouth below works as for the other animals.
    `<path d="M 90 101 Q 100 96 110 101 Q 104 112 100 112 Q 96 112 90 101 Z" fill="#f4a63a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
  blush: blush(112),
};

/** Ellipse with a shaggy edge: `bumps` little arcs bulging outwards. */
function fluffy(cx: number, cy: number, rx: number, ry: number, bumps: number, depth: number): string {
  const at = (a: number, grow: number) =>
    `${(cx + (rx + grow) * Math.cos(a)).toFixed(1)} ${(cy + (ry + grow) * Math.sin(a)).toFixed(1)}`;
  let d = `M ${at(0, 0)}`;
  for (let i = 0; i < bumps; i++) {
    const a = (2 * Math.PI * i) / bumps;
    const b = (2 * Math.PI * (i + 1)) / bumps;
    d += ` Q ${at((a + b) / 2, depth * 2)} ${at(b, 0)}`;
  }
  return `${d} Z`;
}

/** Long curved claw, cream with an outline. */
const claw = (d: string) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/>` +
  `<path d="${d}" fill="none" stroke="#f3e8d2" stroke-width="2.6" stroke-linecap="round"/>`;

// Three-toed sloth: shaggy grey-brown fur, a wide pale face and long dark stripes that run
// from the eyes out to the sides and droop – that, and the claws, tell it from a monkey.
const SLOTH = '#a8977f';
const sloth: MotorAnimal = {
  id: 'sloth',
  label: 'Faultier',
  face:
    outlined(
      `<path d="${fluffy(100, 184, 48, 34, 16, 2.5)}" fill="${SLOTH}"/>` +
        `<path d="M 90 50 Q 90 34 102 34 Q 96 40 104 44 Q 110 38 114 48 Z" fill="${SLOTH}"/>` +
        `<path d="${fluffy(100, 98, 56, 52, 22, 2.8)}" fill="${SLOTH}"/>`,
    ) +
    `<path d="M 100 64 C 132 62 152 82 152 106 C 152 132 128 147 100 147 C 72 147 48 132 48 106 C 48 82 68 62 100 64 Z" fill="#f4ead8"/>` +
    `<path d="M 78 52 q 4 6 10 4 M 112 56 q 6 2 10 -4 M 96 50 q 4 4 8 0" fill="none" stroke="#8c7b64" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M 93 89 C 91 79 76 78 66 84 C 56 90 49 99 48 107 C 48 112 53 112 57 108 C 63 102 70 101 80 101 C 90 101 95 96 93 89 Z" fill="#74563f"/>` +
    `<path d="M 107 89 C 109 79 124 78 134 84 C 144 90 151 99 152 107 C 152 112 147 112 143 108 C 137 102 130 101 120 101 C 110 101 105 96 107 89 Z" fill="#74563f"/>` +
    // Long arms hanging at the sides, three long claws each.
    outlined(
      `<path d="M 60 154 C 50 164 48 178 54 188 C 60 192 68 190 70 184 C 70 174 72 166 76 160 Z" fill="#978670"/>` +
        `<path d="M 140 154 C 150 164 152 178 146 188 C 140 192 132 190 130 184 C 130 174 128 166 124 160 Z" fill="#978670"/>`,
    ) +
    claw('M 56 186 q -2 8 4 12') +
    claw('M 62 188 q 0 7 6 10') +
    claw('M 68 186 q 2 6 8 7') +
    claw('M 144 186 q 2 8 -4 12') +
    claw('M 138 188 q 0 7 -6 10') +
    claw('M 132 186 q -2 6 -8 7') +
    buttonEye(80, 91, 10) +
    buttonEye(120, 91, 10) +
    `<path d="M 94 105 Q 100 102.5 106 105 Q 104 110.5 100 110.5 Q 96 110.5 94 105 Z" fill="#3b2a20"/>` +
    `<ellipse cx="98.5" cy="105" rx="2" ry="1" fill="#fff" opacity=".5"/>`,
  blush: blush(116),
};

export const MOTOR_ANIMALS: MotorAnimal[] = [dino, alpaca, cow, penguin, sloth];

const openMouth = (w: number, top: number, bottom: number) =>
  `<path d="M ${100 - w} ${top} Q 100 ${top - 4} ${100 + w} ${top} Q ${100 + w + 2} ${bottom - 6} 100 ${bottom} Q ${100 - w - 2} ${bottom - 6} ${100 - w} ${top} Z" fill="${MOUTH}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
/** The edge of `openMouth` again, drawn over what sticks out at the inside. */
const TEETH_MOUTH = 'M 72 112 Q 100 118 128 112 Q 125 141 100 142 Q 75 141 72 112 Z';
const outlineMouth = (w: number, top: number, bottom: number) =>
  `<path d="M ${100 - w} ${top} Q 100 ${top - 4} ${100 + w} ${top} Q ${100 + w + 2} ${bottom - 6} 100 ${bottom} Q ${100 - w - 2} ${bottom - 6} ${100 - w} ${top} Z" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
const tongue = (d: string) =>
  `<path d="${d}" fill="${TONGUE}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
/** A dark line with a white edge, readable on any fur or body. */
const haloLine = (d: string) =>
  `<path d="${d}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
const line = (d: string, width = 3, color = INK) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

export const MOTOR_EXERCISES: MotorExercise[] = [
  {
    id: 'tongue-chin',
    label: 'Zunge zum Kinn',
    mouth:
      openMouth(18, 110, 136) +
      `<g class="reach-down">${tongue('M 88 122 L 88 152 Q 88 165 100 165 Q 112 165 112 152 L 112 122 Z')}${line('M 100 130 L 100 152', 2, TONGUE_LINE)}</g>` +
      haloLine('M 128 144 L 128 168 M 128 168 l -7 -7 M 128 168 l 7 -7'),
  },
  {
    id: 'tongue-nose',
    label: 'Zunge zur Nase',
    mouth:
      openMouth(22, 108, 142) +
      `<g class="reach-up">${tongue('M 89 130 L 89 104 Q 89 91 100 91 Q 111 91 111 104 L 111 130 Z')}${line('M 100 100 L 100 122', 2, TONGUE_LINE)}</g>`,
  },
  {
    id: 'tongue-out',
    label: 'Zunge rausstrecken',
    // Straight out: the tongue comes out and goes back in. Short and pointed, unlike
    // „Zunge zum Kinn“, where it hangs down long and wide.
    mouth:
      openMouth(16, 113, 133) +
      `<g class="stick-out">${tongue('M 91 123 L 91 132 Q 91 141 100 147 Q 109 141 109 132 L 109 123 Z')}${line('M 100 128 L 100 138', 2, TONGUE_LINE)}</g>`,
  },
  {
    id: 'count-teeth',
    label: 'Zähne zählen',
    // A wide open smile; the tongue tip reaches up and taps the upper teeth one after the other.
    mouth:
      `<clipPath id="teeth-mouth"><path d="${TEETH_MOUTH}"/></clipPath>` +
      `<path d="${TEETH_MOUTH}" fill="${MOUTH}"/>` +
      `<g clip-path="url(#teeth-mouth)">` +
      `<path d="M 70 110 Q 100 117 130 110 L 130 120 Q 100 127 70 120 Z" fill="#fff"/>` +
      line('M 82 116 L 82 122 M 91 117.5 L 91 124 M 100 118 L 100 124.5 M 109 117.5 L 109 124 M 118 116 L 118 122', 1.5, '#c9bfb6') +
      `<g class="count">${tongue('M 78 146 C 78 134 84 123 90 123 C 96 123 102 134 102 146 Z')}${line('M 90 131 L 90 142', 2, TONGUE_LINE)}</g>` +
      `</g>` +
      line(TEETH_MOUTH),
  },
  {
    id: 'smile',
    label: 'Breit lachen',
    mouth:
      `<path d="M 70 111 Q 100 118 130 111 Q 126 140 100 141 Q 74 140 70 111 Z" fill="${MOUTH}"/>` +
      `<path d="M 86 135 Q 100 124 114 135 Q 100 143 86 135 Z" fill="${TONGUE}"/>` +
      line('M 70 111 Q 100 118 130 111 Q 126 140 100 141 Q 74 140 70 111 Z'),
  },
  {
    id: 'show-teeth',
    label: 'Zähne zeigen',
    mouth:
      `<path d="M 72 114 Q 100 119 128 114 Q 125 133 100 134 Q 75 133 72 114 Z" fill="#fff"/>` +
      line('M 74 123 Q 100 127 126 123', 2, '#c9bfb6') +
      line('M 84 117 L 84 131 M 92 117.5 L 92 132.5 M 100 118 L 100 133.5 M 108 117.5 L 108 132.5 M 116 117 L 116 131', 1.5, '#c9bfb6') +
      line('M 72 114 Q 100 119 128 114 Q 125 133 100 134 Q 75 133 72 114 Z'),
  },
  {
    id: 'nose-breathing',
    label: 'Nasenatmung',
    // Lips closed and smiling, the air goes through the nose.
    mouth:
      line('M 84 119 Q 100 131 116 119', 3.5) +
      line('M 81 117 q 2 3 5 3 M 119 117 q -2 3 -5 3', 2.5) +
      `<g class="air breathe">${line('M 116 103 q 10 -5 20 0 q 10 5 20 0', 2.5, '#7fb6d8')}${line('M 116 110 q 10 -5 20 0 q 10 5 20 0', 2.5, '#7fb6d8')}</g>`,
  },
  {
    id: 'puff-cheeks',
    label: 'Wangen aufblasen',
    ownCheeks: true,
    mouth:
      [60, 140]
        .map(
          (x) =>
            `<g class="puff" style="transform-origin:${x}px 116px">` +
            `<circle cx="${x}" cy="116" r="19" fill="${BLUSH}" stroke="${INK}" stroke-width="2.5"/>` +
            `<ellipse cx="${x + (x < 100 ? -6 : 6)}" cy="109" rx="5" ry="3.5" fill="#fff" opacity=".7"/></g>`,
        )
        .join('') + line('M 92 122 Q 100 125 108 122', 3.5),
  },
  {
    id: 'tongue-corners',
    label: 'Zunge links und rechts',
    mouth:
      `<path d="M 78 114 Q 100 118 122 114 Q 116 134 100 134 Q 84 134 78 114 Z" fill="${MOUTH}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      `<g class="side-to-side"><ellipse cx="80" cy="121" rx="10" ry="8" fill="${TONGUE}" stroke="${INK}" stroke-width="2.5"/></g>` +
      line('M 84 176 L 116 176 M 84 176 l 6 -5 M 84 176 l 6 5 M 116 176 l -6 -5 M 116 176 l -6 5'),
  },
  {
    id: 'tongue-cheek',
    label: 'Zunge in die Wange',
    mouth:
      line('M 88 121 Q 100 127 112 120') +
      [
        ['bulge-right', 'M 124 106 Q 152 121 124 136', 140],
        ['bulge-left', 'M 76 106 Q 48 121 76 136', 60],
      ]
        .map(
          ([cls, d, x]) =>
            `<g class="${cls}"><ellipse cx="${x}" cy="121" rx="11" ry="12" fill="${BLUSH}" opacity=".55"/>${line(d as string)}</g>`,
        )
        .join(''),
  },
  {
    id: 'suck',
    label: 'Ansaugen',
    // Mouth wide open, the tongue sucked flat against the palate: we see its underside.
    mouth:
      openMouth(20, 110, 146) +
      `<g class="suck">${tongue('M 81 111 Q 100 107 119 111 Q 117 129 100 131 Q 83 129 81 111 Z')}</g>` +
      line('M 100 129 L 100 141', 2.2, TONGUE_LINE) +
      outlineMouth(20, 110, 146),
  },
  {
    id: 'click',
    label: 'Schnalzen',
    // The tongue snaps down from the palate: „Klack!“
    mouth:
      openMouth(20, 110, 146) +
      `<g class="tongue-up">${tongue('M 81 111 Q 100 107 119 111 Q 117 129 100 131 Q 83 129 81 111 Z')}${line('M 100 129 L 100 141', 2.2, TONGUE_LINE)}</g>` +
      `<g class="tongue-down">${tongue('M 84 140 Q 100 124 116 140 Q 100 147 84 140 Z')}</g>` +
      outlineMouth(20, 110, 146) +
      `<g class="klack">` +
      `<path d="M 146 118 C 146 104 196 104 196 118 C 196 132 160 132 152 129 L 134 136 L 146 125 Q 146 122 146 118 Z" fill="#fff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
      `<text x="171" y="123" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="${INK}">Klack!</text></g>`,
  },
  {
    id: 'kiss',
    label: 'Kussmund',
    mouth:
      // Small pursed lips, a little round „o“.
      `<ellipse cx="100" cy="122" rx="6" ry="5.5" fill="#e07a8c" stroke="${INK}" stroke-width="2.5"/>` +
      `<ellipse cx="100" cy="122.5" rx="2" ry="2.2" fill="${MOUTH}"/>`,
  },
  {
    id: 'fish',
    label: 'Fischmund',
    ownCheeks: true,
    // Cheeks sucked in, the lips open and close like a fish's.
    mouth:
      line('M 80 108 Q 88 121 80 134 M 120 108 Q 112 121 120 134', 2.5) +
      `<ellipse cx="100" cy="122" rx="8" ry="10" fill="#e07a8c" stroke="${INK}" stroke-width="2.5"/>` +
      `<g class="gulp"><ellipse cx="100" cy="122" rx="3.5" ry="5.5" fill="${MOUTH}"/></g>` +
      `<g class="swim"><path d="M 168 124 C 174 114 188 114 192 124 C 188 134 174 134 168 124 Z M 168 124 L 160 117 L 160 131 Z" fill="#7fb6d8" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="185" cy="122" r="1.8" fill="${INK}"/></g>`,
  },
  {
    id: 'hide-lips',
    label: 'Opa-Mund',
    // The lips roll into the mouth: first we see them, then only a tight line with the rolled-in
    // lips bulging above and below. Without motion it stays at the line.
    mouth:
      `<g class="lips-out">` +
      `<path d="M 84 122 Q 92 114 100 117.5 Q 108 114 116 122 Q 100 125 84 122 Z" fill="#e07a8c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M 84 122 Q 100 125 116 122 Q 112 132 100 132 Q 88 132 84 122 Z" fill="#e07a8c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></g>` +
      `<g class="lips-in"><ellipse cx="100" cy="122.5" rx="19" ry="10" fill="${INK}" opacity=".12"/>` +
      line('M 87 115.5 Q 100 111 113 115.5 M 88 129 Q 100 133.5 112 129', 2.2, '#8a6a58') +
      line('M 82 122 Q 100 124 118 122', 4) +
      line('M 80 119 q -2 3 0 6 M 120 119 q 2 3 0 6', 2.5) +
      `</g>`,
  },
  {
    id: 'blow',
    label: 'Pusten',
    mouth:
      `<ellipse cx="100" cy="122" rx="6" ry="7" fill="${MOUTH}" stroke="${INK}" stroke-width="3"/>` +
      `<g class="air">${line('M 112 116 q 12 -6 24 0 q 12 6 24 0', 2.5, '#7fb6d8')}${line('M 112 124 q 14 -6 28 0 q 14 6 28 0', 2.5, '#7fb6d8')}${line('M 112 132 q 12 -6 24 0 q 12 6 24 0', 2.5, '#7fb6d8')}</g>`,
  },
  {
    id: 'lick-lips',
    label: 'Lippen ablecken',
    mouth:
      `<path d="M 84 116 Q 100 120 116 116 Q 113 131 100 131 Q 87 131 84 116 Z" fill="${MOUTH}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      // A squashed circle around the lips; the tongue turns with it and so points outwards.
      `<g transform="translate(0 122) scale(1 .6) translate(0 -122)"><g class="circle">` +
      `<ellipse cx="121" cy="122" rx="7" ry="9" fill="${TONGUE}" stroke="${INK}" stroke-width="2.5"/></g></g>` +
      line('M 109 176 A 9 9 0 1 1 103 167.5 M 103 167.5 l 1 -6 M 103 167.5 l 6 1', 2.6),
  },
];

const STYLE = `
.reach-down { transform-origin: 100px 122px; animation: reach-down 2.4s ease-in-out infinite; }
@keyframes reach-down { 50% { transform: scaleY(1.12); } }
.reach-up { transform-origin: 100px 130px; animation: reach-up 2.4s ease-in-out infinite; }
@keyframes reach-up { 50% { transform: scaleY(1.12); } }
.puff { animation: puff 2.4s ease-in-out infinite; }
@keyframes puff { 50% { transform: scale(1.14); } }
.side-to-side { animation: side 2.4s ease-in-out infinite; }
@keyframes side { 0%, 35%, 100% { transform: translateX(0); } 50%, 85% { transform: translateX(40px); } }
.bulge-left { opacity: 0; animation: bulge 2.4s ease-in-out infinite; }
.bulge-right { animation: bulge 2.4s ease-in-out -1.2s infinite; }
@keyframes bulge { 0%, 40% { opacity: 1; } 50%, 90% { opacity: 0; } 100% { opacity: 1; } }
.suck { transform-origin: 100px 110px; animation: suck 2s ease-in-out infinite; }
@keyframes suck { 50% { transform: scaleY(.9); } }
.stick-out { transform-origin: 100px 123px; animation: stick-out 2.8s ease-in-out infinite; }
@keyframes stick-out { 0%, 12%, 100% { transform: scaleY(.15); } 40%, 75% { transform: scaleY(1); } }
.count { animation: count 3s ease-in-out infinite; }
@keyframes count { 0%, 8% { transform: translateX(0); } 18%, 26% { transform: translateX(10px); } 36%, 44% { transform: translateX(20px); } 54%, 62% { transform: translateX(30px); } 100% { transform: translateX(0); } }
.breathe { animation: breathe 3.2s ease-in-out infinite; }
@keyframes breathe { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }
.tongue-down, .klack { opacity: 0; }
.tongue-up { animation: click-up 1.6s steps(1) infinite; }
.tongue-down, .klack { animation: click-down 1.6s steps(1) infinite; }
@keyframes click-up { 0% { opacity: 1; } 55% { opacity: 0; } }
@keyframes click-down { 0% { opacity: 0; } 55% { opacity: 1; } }
.gulp { transform-origin: 100px 122px; animation: gulp 1.4s ease-in-out infinite; }
@keyframes gulp { 50% { transform: scale(.25); } }
.swim { animation: swim 2.8s ease-in-out infinite; }
@keyframes swim { 50% { transform: translateY(-4px); } }
.lips-out { opacity: 0; transform-origin: 100px 122px; animation: lips-out 3s ease-in-out infinite; }
@keyframes lips-out { 0%, 30% { opacity: 1; transform: none; } 45%, 90% { opacity: 0; transform: scaleY(.2); } 100% { opacity: 1; transform: none; } }
.lips-in { animation: lips-in 3s ease-in-out infinite; }
@keyframes lips-in { 0%, 35% { opacity: 0; } 45%, 88% { opacity: 1; } 100% { opacity: 0; } }
.air path { stroke-dasharray: 10 8; animation: air 0.9s linear infinite; }
@keyframes air { to { stroke-dashoffset: -18; } }
.circle { transform-origin: 100px 122px; animation: circle 2.4s linear infinite; }
@keyframes circle { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
`.replace(/\s+/g, ' ');

export function motorSvg(animal: MotorAnimal, exercise: MotorExercise): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><style>${STYLE}</style>` +
    animal.face +
    (exercise.ownCheeks ? '' : animal.blush) +
    exercise.mouth +
    '</svg>'
  );
}

/** Inline picture, like the bundled pictograms, so it travels with the wheel and its backups. */
export function motorPictureUrl(animal: MotorAnimal, exercise: MotorExercise): string {
  return `data:image/svg+xml,${encodeURIComponent(motorSvg(animal, exercise))}`;
}
