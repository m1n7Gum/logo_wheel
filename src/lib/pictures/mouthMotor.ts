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

/** The picker shows tongue and lip exercises apart, like the practice's two card sets. */
export type MotorGroup = 'tongue' | 'lips';

export const MOTOR_GROUPS: { id: MotorGroup; label: string }[] = [
  { id: 'tongue', label: 'Zunge' },
  { id: 'lips', label: 'Lippen' },
];

export interface MotorExercise {
  id: string;
  group: MotorGroup;
  /** Short, so it fits on the wheel next to the picture. */
  label: string;
  mouth: string;
  ownCheeks?: boolean;
}

const INK = '#4a3428';
const MOUTH = '#7a2433';
const TONGUE = '#f2899b';
const TONGUE_LINE = '#d0607a';
const LIPS = '#e07a8c';
const BLUSH = '#f59a9a';
const AIR = '#7fb6d8';
const WOOD = '#e9c88f';

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

/** Upper teeth seen through the wide open `TEETH_MOUTH`; draw inside its clip. */
const upperTeeth =
  `<path d="M 70 110 Q 100 117 130 110 L 130 120 Q 100 127 70 120 Z" fill="#fff"/>` +
  line('M 82 116 L 82 122 M 91 117.5 L 91 124 M 100 118 L 100 124.5 M 109 117.5 L 109 124 M 118 116 L 118 122', 1.5, '#c9bfb6');
/** Lower teeth seen through `TEETH_MOUTH`; draw inside its clip. */
const lowerTeeth =
  `<path d="M 72 127 Q 100 139 128 127 L 128 146 L 72 146 Z" fill="#fff"/>` +
  line('M 82 132 L 82 140 M 91 134.5 L 91 142 M 100 135 L 100 143 M 109 134.5 L 109 142 M 118 132 L 118 140', 1.5, '#c9bfb6');
/**
 * Open mouth; the tongue tip is up at the bump („Knubbel“) behind the upper teeth, so the teeth
 * hide it. `motion` is the class that moves the tongue, if it moves.
 */
const tongueToRidge = (clipId: string, motion = '') =>
  `<clipPath id="${clipId}"><path d="${TEETH_MOUTH}"/></clipPath>` +
  `<path d="${TEETH_MOUTH}" fill="${MOUTH}"/>` +
  `<g clip-path="url(#${clipId})">` +
  `<g class="${motion}">${tongue('M 85 148 C 85 132 93 116 100 116 C 107 116 115 132 115 148 Z')}${line('M 100 128 L 100 142', 2, TONGUE_LINE)}</g>` +
  upperTeeth +
  `</g>` +
  line(TEETH_MOUTH);
/** Four-pointed star, for clean teeth. */
const sparkle = (x: number, y: number, r: number, delay: number) =>
  `<path class="twinkle" style="animation-delay:${delay}s" d="M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z" fill="#ffe680" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
/** Speech bubble right of the mouth, for the sound an exercise makes. */
const speech = (text: string) =>
  `<path d="M 146 118 C 146 104 196 104 196 118 C 196 132 160 132 152 129 L 134 136 L 146 125 Q 146 122 146 118 Z" fill="#fff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
  `<text x="171" y="123" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="${INK}">${text}</text>`;
const lip = (d: string) => `<path d="${d}" fill="${LIPS}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
/** Relaxed closed lips, as at the start of „Opa-Mund“. */
const UPPER_LIP = 'M 84 122 Q 92 114 100 117.5 Q 108 114 116 122 Q 100 125 84 122 Z';
const LOWER_LIP = 'M 84 122 Q 100 125 116 122 Q 112 132 100 132 Q 88 132 84 122 Z';
/** Lips pressed together and pulled wide with a little smile, teeth hidden. */
const wideLips = lip('M 71 117 Q 86 115 100 118 Q 114 115 129 117 Q 115 127.5 100 127.5 Q 85 127.5 71 117 Z') + line('M 73 117.5 Q 100 125 127 117.5', 2);
/** The rolled-in lip shows only as a soft bulge. */
const tucked = (d: string) => `<g class="lips-in">${line(d, 2, '#8a6a58')}</g>`;
/** Lips pushed forward into a round, pointed mouth. */
const pointedLips =
  `<ellipse cx="100" cy="122" rx="10" ry="8.5" fill="${LIPS}" stroke="${INK}" stroke-width="2.5"/>` +
  `<ellipse cx="100" cy="122.5" rx="2.5" ry="2.2" fill="${MOUTH}"/>` +
  line('M 93 116 l 2 2.5 M 107 116 l -2 2.5 M 93 128 l 2 -2.5 M 107 128 l -2 -2.5', 1.6, '#a84a5c');
/** One cheek blown up, as in „Wangen aufblasen“. */
const puff = (x: number) =>
  `<circle cx="${x}" cy="116" r="19" fill="${BLUSH}" stroke="${INK}" stroke-width="2.5"/>` +
  `<ellipse cx="${x + (x < 100 ? -6 : 6)}" cy="109" rx="5" ry="3.5" fill="#fff" opacity=".7"/>`;
/** The tongue sucked flat against the palate, seen from below, and dropped back down. */
const TONGUE_AT_PALATE = 'M 81 111 Q 100 107 119 111 Q 117 129 100 131 Q 83 129 81 111 Z';
const TONGUE_DOWN = 'M 84 140 Q 100 124 116 140 Q 100 147 84 140 Z';

// Each exercise belongs to `group` 'tongue' (Zunge) or 'lips' (Lippen). The picker shows them in
// this order.
export const MOTOR_EXERCISES: MotorExercise[] = [
  // Zunge
  {
    id: 'tongue-rest',
    group: 'tongue',
    label: 'Zungenschlafplatz',
    // The tongue tip rests at the bump behind the upper teeth, asleep.
    mouth:
      tongueToRidge('rest-mouth') +
      `<g class="zzz" font-family="sans-serif" font-weight="700" fill="${INK}" stroke="#fff" stroke-width="3" paint-order="stroke">` +
      `<text x="140" y="110" font-size="11">z</text><text x="149" y="100" font-size="14">z</text><text x="159" y="88" font-size="18">Z</text></g>`,
  },
  {
    id: 'tongue-rest-3',
    group: 'tongue',
    label: 'Zungenschlafplatz 3 mal',
    // Up to the bump and down again, three times; a dot fills for every time.
    mouth:
      tongueToRidge('rest3-mouth', 'rest3') +
      [88, 100, 112]
        .map(
          (x, i) =>
            `<circle cx="${x}" cy="174" r="4.5" fill="#fff" stroke="${INK}" stroke-width="2"/>` +
            `<circle class="dot${i + 1}" cx="${x}" cy="174" r="4.5" fill="${TONGUE}" stroke="${INK}" stroke-width="2"/>`,
        )
        .join(''),
  },
  {
    id: 'tongue-out',
    group: 'tongue',
    label: 'Zunge rausstrecken',
    // Straight out: the tongue comes out and goes back in. Short and pointed, unlike
    // „Zunge zum Kinn“, where it hangs down long and wide.
    mouth:
      openMouth(16, 113, 133) +
      `<g class="stick-out">${tongue('M 91 123 L 91 132 Q 91 141 100 147 Q 109 141 109 132 L 109 123 Z')}${line('M 100 128 L 100 138', 2, TONGUE_LINE)}</g>`,
  },
  {
    id: 'tongue-chin',
    group: 'tongue',
    label: 'Zunge zum Kinn',
    mouth:
      openMouth(18, 110, 136) +
      `<g class="reach-down">${tongue('M 88 122 L 88 152 Q 88 165 100 165 Q 112 165 112 152 L 112 122 Z')}${line('M 100 130 L 100 152', 2, TONGUE_LINE)}</g>` +
      haloLine('M 128 144 L 128 168 M 128 168 l -7 -7 M 128 168 l 7 -7'),
  },
  {
    id: 'tongue-nose',
    group: 'tongue',
    label: 'Zunge zur Nase',
    mouth:
      openMouth(22, 108, 142) +
      `<g class="reach-up">${tongue('M 89 130 L 89 104 Q 89 91 100 91 Q 111 91 111 104 L 111 130 Z')}${line('M 100 100 L 100 122', 2, TONGUE_LINE)}</g>`,
  },
  {
    id: 'tongue-corners',
    group: 'tongue',
    label: 'Zunge links und rechts',
    mouth:
      `<path d="M 78 114 Q 100 118 122 114 Q 116 134 100 134 Q 84 134 78 114 Z" fill="${MOUTH}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      `<g class="side-to-side"><ellipse cx="80" cy="121" rx="10" ry="8" fill="${TONGUE}" stroke="${INK}" stroke-width="2.5"/></g>` +
      line('M 84 176 L 116 176 M 84 176 l 6 -5 M 84 176 l 6 5 M 116 176 l -6 -5 M 116 176 l -6 5'),
  },
  {
    id: 'tongue-cheek',
    group: 'tongue',
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
    id: 'tongue-pointed-wide',
    group: 'tongue',
    label: 'Zunge spitz und breit',
    mouth:
      openMouth(20, 112, 136) +
      `<g class="first">${tongue('M 92 124 L 92 134 Q 93 146 100 158 Q 107 146 108 134 L 108 124 Z')}${line('M 100 129 L 100 146', 2, TONGUE_LINE)}</g>` +
      `<g class="second">${tongue('M 82 124 L 82 136 Q 82 150 100 151 Q 118 150 118 136 L 118 124 Z')}${line('M 100 129 L 100 143', 2, TONGUE_LINE)}</g>`,
  },
  {
    id: 'count-teeth',
    group: 'tongue',
    label: 'Zähne zählen',
    // A wide open smile; the tongue tip reaches up and taps the upper teeth one after the other.
    mouth:
      `<clipPath id="teeth-mouth"><path d="${TEETH_MOUTH}"/></clipPath>` +
      `<path d="${TEETH_MOUTH}" fill="${MOUTH}"/>` +
      `<g clip-path="url(#teeth-mouth)">` +
      upperTeeth +
      `<g class="count">${tongue('M 78 146 C 78 134 84 123 90 123 C 96 123 102 134 102 146 Z')}${line('M 90 131 L 90 142', 2, TONGUE_LINE)}</g>` +
      `</g>` +
      line(TEETH_MOUTH),
  },
  {
    id: 'brush-teeth',
    group: 'tongue',
    label: 'Zähne putzen',
    // Upper and lower teeth; the tongue tip rubs over the front of the upper ones, back and forth,
    // then over the lower ones, until they sparkle.
    mouth:
      `<clipPath id="brush-mouth"><path d="${TEETH_MOUTH}"/></clipPath>` +
      `<path d="${TEETH_MOUTH}" fill="${MOUTH}"/>` +
      `<g clip-path="url(#brush-mouth)">` +
      upperTeeth +
      lowerTeeth +
      `<g class="brush">` +
      // Upper teeth: the tongue comes out over the lower teeth, its tip in front of the upper ones.
      `<g class="brush-upper">${tongue('M 89 148 L 89 123 Q 89 115 100 115 Q 111 115 111 123 L 111 148 Z')}${line('M 100 121 L 100 131', 2, TONGUE_LINE)}</g>` +
      // Lower teeth: the tongue comes out under the upper teeth, its tip in front of the lower ones.
      `<g class="brush-lower">${tongue('M 89 116 L 89 130 Q 89 139 100 139 Q 111 139 111 130 L 111 116 Z')}${line('M 100 124 L 100 133', 2, TONGUE_LINE)}</g>` +
      `</g>` +
      `<g class="brush-upper">${lowerTeeth}</g>` +
      `<g class="brush-lower">${upperTeeth}</g>` +
      `</g>` +
      line(TEETH_MOUTH) +
      sparkle(143, 101, 7, 0) +
      sparkle(57, 103, 5, -0.6) +
      sparkle(148, 132, 4.5, -0.3),
  },
  {
    id: 'lick-lips',
    group: 'tongue',
    label: 'Lippen ablecken',
    mouth:
      `<path d="M 84 116 Q 100 120 116 116 Q 113 131 100 131 Q 87 131 84 116 Z" fill="${MOUTH}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      // A squashed circle around the lips; the tongue turns with it and so points outwards.
      `<g transform="translate(0 122) scale(1 .6) translate(0 -122)"><g class="circle">` +
      `<ellipse cx="121" cy="122" rx="7" ry="9" fill="${TONGUE}" stroke="${INK}" stroke-width="2.5"/></g></g>` +
      line('M 109 176 A 9 9 0 1 1 103 167.5 M 103 167.5 l 1 -6 M 103 167.5 l 6 1', 2.6),
  },
  {
    id: 'suck',
    group: 'tongue',
    label: 'Ansaugen',
    // Mouth wide open, the tongue sucked flat against the palate: we see its underside.
    mouth:
      openMouth(20, 110, 146) +
      `<g class="suck">${tongue(TONGUE_AT_PALATE)}</g>` +
      line('M 100 129 L 100 141', 2.2, TONGUE_LINE) +
      outlineMouth(20, 110, 146),
  },
  {
    id: 'rock',
    group: 'tongue',
    label: 'Zunge schaukeln',
    // Like „Schnalzen“ without the sound: suck up, let go, again and again, rocking gently.
    mouth:
      openMouth(20, 110, 146) +
      `<g class="first">${tongue(TONGUE_AT_PALATE)}${line('M 100 129 L 100 141', 2.2, TONGUE_LINE)}</g>` +
      `<g class="second">${tongue(TONGUE_DOWN)}</g>` +
      outlineMouth(20, 110, 146) +
      haloLine('M 146 107 Q 158 122 146 137 M 146 107 l 0 8 M 146 107 l 7.5 2.6 M 146 137 l 7.5 -2.6 M 146 137 l 0 -8'),
  },
  {
    id: 'click',
    group: 'tongue',
    label: 'Schnalzen',
    // The tongue snaps down from the palate: „Klack!“
    mouth:
      openMouth(20, 110, 146) +
      `<g class="tongue-up">${tongue(TONGUE_AT_PALATE)}${line('M 100 129 L 100 141', 2.2, TONGUE_LINE)}</g>` +
      `<g class="tongue-down">${tongue(TONGUE_DOWN)}</g>` +
      outlineMouth(20, 110, 146) +
      `<g class="klack">${speech('Klack!')}</g>`,
  },
  {
    id: 'spatula-fight',
    group: 'tongue',
    label: 'Zungenkampf',
    // A wooden spatula pushes against the tongue tip, the tongue pushes back.
    mouth:
      openMouth(18, 112, 134) +
      `<g class="fight">${tongue('M 89 122 L 89 134 Q 89 146 100 152 Q 111 146 111 134 L 111 122 Z')}${line('M 100 128 L 100 143', 2, TONGUE_LINE)}</g>` +
      `<g class="fight-stick"><g transform="translate(98 152) rotate(38)">` +
      `<rect x="0" y="-6" width="72" height="12" rx="6" fill="${WOOD}" stroke="${INK}" stroke-width="2.5"/>` +
      line('M 14 -1 L 40 -1 M 30 2 L 58 2', 1.2, '#c9a066') +
      `</g></g>` +
      haloLine('M 86 152 l -8 1 M 88 159 l -6 5 M 94 163 l -2 7'),
  },
  // Lippen
  {
    id: 'smile',
    group: 'lips',
    label: 'Breit lachen',
    mouth:
      `<path d="M 70 111 Q 100 118 130 111 Q 126 140 100 141 Q 74 140 70 111 Z" fill="${MOUTH}"/>` +
      `<path d="M 86 135 Q 100 124 114 135 Q 100 143 86 135 Z" fill="${TONGUE}"/>` +
      line('M 70 111 Q 100 118 130 111 Q 126 140 100 141 Q 74 140 70 111 Z'),
  },
  {
    id: 'show-teeth',
    group: 'lips',
    label: 'Zähne zeigen',
    mouth:
      `<path d="M 72 114 Q 100 119 128 114 Q 125 133 100 134 Q 75 133 72 114 Z" fill="#fff"/>` +
      line('M 74 123 Q 100 127 126 123', 2, '#c9bfb6') +
      line('M 84 117 L 84 131 M 92 117.5 L 92 132.5 M 100 118 L 100 133.5 M 108 117.5 L 108 132.5 M 116 117 L 116 131', 1.5, '#c9bfb6') +
      line('M 72 114 Q 100 119 128 114 Q 125 133 100 134 Q 75 133 72 114 Z'),
  },
  {
    id: 'wide-lips',
    group: 'lips',
    label: 'Lippen breit',
    // Lips closed and pulled wide, so the teeth stay hidden.
    mouth: `<g class="widen">${wideLips}</g>` + line('M 67 112.5 q -2.5 4 0 8 M 133 112.5 q 2.5 4 0 8', 2.5),
  },
  {
    id: 'kiss',
    group: 'lips',
    label: 'Kussmund',
    mouth:
      // Small pursed lips, a little round „o“.
      `<ellipse cx="100" cy="122" rx="6" ry="5.5" fill="${LIPS}" stroke="${INK}" stroke-width="2.5"/>` +
      `<ellipse cx="100" cy="122.5" rx="2" ry="2.2" fill="${MOUTH}"/>`,
  },
  {
    id: 'pointed-wide-lips',
    group: 'lips',
    label: 'Lippen spitz und breit',
    mouth: `<g class="first">${pointedLips}</g><g class="second">${wideLips}</g>`,
  },
  {
    id: 'fish',
    group: 'lips',
    label: 'Fischmund',
    ownCheeks: true,
    // Cheeks sucked in, the lips open and close like a fish's.
    mouth:
      line('M 80 108 Q 88 121 80 134 M 120 108 Q 112 121 120 134', 2.5) +
      `<ellipse cx="100" cy="122" rx="8" ry="10" fill="${LIPS}" stroke="${INK}" stroke-width="2.5"/>` +
      `<g class="gulp"><ellipse cx="100" cy="122" rx="3.5" ry="5.5" fill="${MOUTH}"/></g>` +
      `<g class="swim"><path d="M 168 124 C 174 114 188 114 192 124 C 188 134 174 134 168 124 Z M 168 124 L 160 117 L 160 131 Z" fill="${AIR}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="185" cy="122" r="1.8" fill="${INK}"/></g>`,
  },
  {
    id: 'hide-lips',
    group: 'lips',
    label: 'Opa-Mund',
    // The lips roll into the mouth: first we see them, then only a tight line with the rolled-in
    // lips bulging above and below. Without motion it stays at the line.
    mouth:
      `<g class="lips-out">${lip(UPPER_LIP)}${lip(LOWER_LIP)}</g>` +
      `<g class="lips-in"><ellipse cx="100" cy="122.5" rx="19" ry="10" fill="${INK}" opacity=".12"/>` +
      line('M 87 115.5 Q 100 111 113 115.5 M 88 129 Q 100 133.5 112 129', 2.2, '#8a6a58') +
      line('M 82 122 Q 100 124 118 122', 4) +
      line('M 80 119 q -2 3 0 6 M 120 119 q 2 3 0 6', 2.5) +
      `</g>`,
  },
  {
    id: 'upper-over-lower',
    group: 'lips',
    label: 'Oberlippe drüber',
    // The lower lip rolls in, the upper lip (with its little bow) slides down over it.
    // Without motion only the upper lip is seen.
    mouth:
      `<g class="lips-out">${lip(LOWER_LIP)}</g>` +
      tucked('M 90 131.5 Q 100 135 110 131.5') +
      `<g class="slide-down">${lip('M 84 125 Q 92 117 100 120.5 Q 108 117 116 125 Q 100 129 84 125 Z')}</g>`,
  },
  {
    id: 'lower-over-upper',
    group: 'lips',
    label: 'Unterlippe drüber',
    // The upper lip rolls in, the round lower lip pushes up over it.
    // Without motion only the lower lip is seen.
    mouth:
      `<g class="lips-out">${lip(UPPER_LIP)}</g>` +
      tucked('M 91 115 Q 100 112.5 109 115') +
      `<g class="slide-up">${lip('M 85 120 Q 92 117.5 100 117.5 Q 108 117.5 115 120 Q 111 128 100 128 Q 89 128 85 120 Z')}` +
      `<ellipse cx="96" cy="123.5" rx="3" ry="1.3" fill="#fff" opacity=".45"/></g>`,
  },
  {
    id: 'hold-spatula',
    group: 'lips',
    label: 'Spatel halten',
    // A wooden spatula held between the lips only, without the teeth.
    mouth:
      `<g class="wobble">` +
      `<rect x="48" y="118" width="104" height="9" rx="4.5" fill="${WOOD}" stroke="${INK}" stroke-width="2.5"/>` +
      line('M 56 122 L 76 122 M 124 121 L 146 121', 1.2, '#c9a066') +
      lip('M 85 120.5 Q 92 111 100 114.5 Q 108 111 115 120.5 Z') +
      lip('M 85 124.5 L 115 124.5 Q 110 134 100 134 Q 90 134 85 124.5 Z') +
      `</g>`,
  },
  {
    id: 'blubber',
    group: 'lips',
    label: 'Lippen blubbern',
    // Loose lips, pushed a little forward, flutter in the breath: „Brrr!“
    mouth:
      `<g class="flap-down">${lip('M 86 121.5 Q 100 124 114 121.5 Q 112 134 100 134 Q 88 134 86 121.5 Z')}` +
      `<ellipse cx="96" cy="129" rx="3.5" ry="1.6" fill="#fff" opacity=".45"/></g>` +
      `<g class="flap-up">${lip('M 86 121.5 Q 92 112 100 115.5 Q 108 112 114 121.5 Q 100 124 86 121.5 Z')}</g>` +
      speech('Brrr!'),
  },
  {
    id: 'slurp',
    group: 'lips',
    label: 'Schlürfen',
    // Round lips suck the air in, the other way round from „Pusten“.
    mouth:
      `<ellipse cx="100" cy="122" rx="9" ry="8" fill="${LIPS}" stroke="${INK}" stroke-width="2.5"/>` +
      `<ellipse cx="100" cy="122.5" rx="4.5" ry="4" fill="${MOUTH}"/>` +
      `<g class="air">${line('M 38 112 q 13 -6 26 0 q 12 6 24 6', 2.5, AIR)}${line('M 32 122 q 14 -6 28 0 q 14 6 28 0', 2.5, AIR)}${line('M 38 132 q 13 -6 26 0 q 12 6 24 -6', 2.5, AIR)}</g>` +
      line('M 88 122 l -6 -4 M 88 122 l -6 4', 2.5, AIR),
  },
  {
    id: 'blow',
    group: 'lips',
    label: 'Pusten',
    mouth:
      `<ellipse cx="100" cy="122" rx="6" ry="7" fill="${MOUTH}" stroke="${INK}" stroke-width="3"/>` +
      `<g class="air">${line('M 112 116 q 12 -6 24 0 q 12 6 24 0', 2.5, AIR)}${line('M 112 124 q 14 -6 28 0 q 14 6 28 0', 2.5, AIR)}${line('M 112 132 q 12 -6 24 0 q 12 6 24 0', 2.5, AIR)}</g>`,
  },
  {
    id: 'puff-cheeks',
    group: 'lips',
    label: 'Wangen aufblasen',
    ownCheeks: true,
    mouth:
      [60, 140].map((x) => `<g class="puff" style="transform-origin:${x}px 116px">${puff(x)}</g>`).join('') +
      line('M 92 122 Q 100 125 108 122', 3.5),
  },
  {
    id: 'shift-air',
    group: 'lips',
    label: 'Luft hin und her',
    ownCheeks: true,
    // One cheek blown up, then the air moves over to the other one.
    mouth: `<g class="first">${puff(60)}</g><g class="second">${puff(140)}</g>` + line('M 93 122 Q 100 124.5 107 122', 3.5),
  },
  {
    id: 'nose-breathing',
    group: 'lips',
    label: 'Nasenatmung',
    // Lips closed and smiling, the air goes through the nose.
    mouth:
      line('M 84 119 Q 100 131 116 119', 3.5) +
      line('M 81 117 q 2 3 5 3 M 119 117 q -2 3 -5 3', 2.5) +
      `<g class="air breathe">${line('M 116 103 q 10 -5 20 0 q 10 5 20 0', 2.5, AIR)}${line('M 116 110 q 10 -5 20 0 q 10 5 20 0', 2.5, AIR)}</g>`,
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
.first { animation: bulge 2.8s ease-in-out infinite; }
.second { opacity: 0; animation: bulge 2.8s ease-in-out -1.4s infinite; }
.suck { transform-origin: 100px 110px; animation: suck 2s ease-in-out infinite; }
@keyframes suck { 50% { transform: scaleY(.9); } }
.stick-out { transform-origin: 100px 123px; animation: stick-out 2.8s ease-in-out infinite; }
@keyframes stick-out { 0%, 12%, 100% { transform: scaleY(.15); } 40%, 75% { transform: scaleY(1); } }
.count { animation: count 3s ease-in-out infinite; }
@keyframes count { 0%, 8% { transform: translateX(0); } 18%, 26% { transform: translateX(10px); } 36%, 44% { transform: translateX(20px); } 54%, 62% { transform: translateX(30px); } 100% { transform: translateX(0); } }
.rest3 { transform-origin: 100px 148px; animation: rest3 4.8s ease-in-out infinite; }
@keyframes rest3 { 0%, 4%, 22%, 40%, 58%, 100% { transform: scaleY(.6); } 12%, 16%, 30%, 34%, 48%, 52% { transform: none; } }
.dot1 { animation: dot1 4.8s infinite; }
.dot2 { animation: dot2 4.8s infinite; }
.dot3 { animation: dot3 4.8s infinite; }
@keyframes dot1 { 0%, 11% { opacity: 0; } 12%, 96% { opacity: 1; } 100% { opacity: 0; } }
@keyframes dot2 { 0%, 29% { opacity: 0; } 30%, 96% { opacity: 1; } 100% { opacity: 0; } }
@keyframes dot3 { 0%, 47% { opacity: 0; } 48%, 96% { opacity: 1; } 100% { opacity: 0; } }
.zzz { animation: breathe 3.2s ease-in-out infinite; }
.brush { animation: brush .7s ease-in-out infinite alternate; }
.brush-upper { animation: bulge 5.6s ease-in-out infinite; }
.brush-lower { opacity: 0; animation: bulge 5.6s ease-in-out -2.8s infinite; }
@keyframes brush { from { transform: translateX(-12px); } to { transform: translateX(12px); } }
.twinkle { transform-box: fill-box; transform-origin: center; animation: twinkle 1.2s ease-in-out infinite; }
@keyframes twinkle { 50% { opacity: .3; transform: scale(.6); } }
.fight { transform-origin: 100px 122px; animation: fight 1.6s ease-in-out infinite; }
@keyframes fight { 50% { transform: scaleY(.88); } }
.fight-stick { animation: fight-stick 1.6s ease-in-out infinite; }
@keyframes fight-stick { 50% { transform: translateY(-3.6px); } }
.widen { transform-origin: 100px 122px; animation: widen 2.4s ease-in-out infinite; }
@keyframes widen { 0%, 12%, 100% { transform: scaleX(.65); } 40%, 80% { transform: none; } }
.wobble { transform-origin: 100px 122px; animation: wobble 3s ease-in-out infinite; }
@keyframes wobble { 25% { transform: rotate(-3deg); } 75% { transform: rotate(3deg); } }
.flap-up { animation: flap-up .14s linear infinite alternate; }
@keyframes flap-up { to { transform: translateY(-1.2px); } }
.flap-down { animation: flap-down .14s linear infinite alternate; }
@keyframes flap-down { to { transform: translateY(1.5px); } }
.slide-down { animation: slide-down 3s ease-in-out infinite; }
@keyframes slide-down { 0%, 30%, 100% { transform: translateY(-3px); } 45%, 88% { transform: none; } }
.slide-up { animation: slide-up 3s ease-in-out infinite; }
@keyframes slide-up { 0%, 30%, 100% { transform: translateY(3px); } 45%, 88% { transform: none; } }
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
