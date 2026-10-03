import '@fontsource-variable/nunito';
import type { Theme } from '../types';
import SlothPointer from './SlothPointer.svelte';
import Decorations from './Decorations.svelte';

const theme: Theme = {
  id: 'cozy',
  name: 'Tierfreunde',
  order: 1,
  tokens: {
    bg: '#fff5ea',
    surface: '#fffdf9',
    text: '#4a3b36',
    textMuted: '#8a7a72',
    accent: '#c9805f',
    accentText: '#ffffff',
    border: '#efdccb',
    fontFamily: "'Nunito Variable', ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
    radius: '22px',
    wheelRim: '#9c6b4a',
    segmentStroke: '#fffaf3',
    highlight: '#ffcf5c',
    centerBg: '#c9805f',
    centerText: '#ffffff',
    centerRing: '#fffaf3',
    backdrop: 'rgba(90, 60, 45, 0.45)',
    resultBg: '#fffdf9',
    resultText: '#4a3b36',
  },
  segmentColors: ['#f7c5cc', '#bde0c6', '#ffe0a3', '#c3d7f2', '#e2cdf2', '#ffd1b3'],
  segmentTextColors: ['#4a3b36', '#4a3b36', '#4a3b36', '#4a3b36', '#4a3b36', '#4a3b36'],
  pointerSpace: 26,
  Pointer: SlothPointer,
  Decorations,
  tick: { frequency: 1100, waveform: 'triangle', volume: 0.2 },
};

export default theme;
