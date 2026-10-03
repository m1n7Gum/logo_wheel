import '@fontsource-variable/lexend';
import type { Theme } from '../types';
import Pointer from './Pointer.svelte';

const NAVY = '#1d2045';

const theme: Theme = {
  id: 'classic',
  name: 'Klassisch',
  order: 0,
  tokens: {
    bg: '#eef0f8',
    surface: '#ffffff',
    text: NAVY,
    textMuted: '#646888',
    accent: '#3a5bff',
    accentText: '#ffffff',
    border: '#dcdff0',
    // Lexend was designed for reading fluency – a good fit for speech therapy.
    fontFamily: "'Lexend Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    radius: '16px',
    wheelRim: NAVY,
    wheelShadow: '0 18px 40px rgba(29, 32, 69, 0.28), 0 4px 10px rgba(29, 32, 69, 0.18)',
    pegColor: '#ffffff',
    segmentStroke: '#ffffff',
    highlight: '#ffd60a',
    centerBg: `radial-gradient(circle at 35% 30%, #3b4080, ${NAVY} 70%)`,
    centerText: '#ffffff',
    centerRing: '#ffffff',
    backdrop: 'rgba(20, 22, 50, 0.6)',
    resultBg: '#ffffff',
    resultText: NAVY,
  },
  // Alternating warm / cool so neighbours always contrast.
  segmentColors: ['#ef476f', '#3a86ff', '#ffc43d', '#8338ec', '#06d6a0', '#ff7b00', '#00b4d8', '#d6336c'],
  segmentTextColors: ['#ffffff', '#ffffff', NAVY, '#ffffff', NAVY, NAVY, NAVY, '#ffffff'],
  pointerSpace: 9,
  rimWidth: 3.2,
  pegs: true,
  Pointer,
  tick: { frequency: 1500, waveform: 'square', volume: 0.1 },
};

export default theme;
