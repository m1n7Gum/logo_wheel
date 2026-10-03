import type { Theme } from '../types';
import Pointer from './Pointer.svelte';

const theme: Theme = {
  id: 'classic',
  name: 'Klassisch',
  order: 0,
  tokens: {
    bg: '#f4f1ea',
    surface: '#ffffff',
    text: '#2d3436',
    textMuted: '#6b7376',
    accent: '#3f5f7a',
    accentText: '#ffffff',
    border: '#d9d3c7',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    radius: '14px',
    wheelRim: '#3a4750',
    segmentStroke: '#f4f1ea',
    highlight: '#f2c14e',
    centerBg: '#3a4750',
    centerText: '#ffffff',
    centerRing: '#f4f1ea',
    backdrop: 'rgba(30, 36, 40, 0.55)',
    resultBg: '#ffffff',
    resultText: '#2d3436',
  },
  segmentColors: ['#5b7c99', '#e8dcc4', '#8fa98a', '#c98b6b', '#a7b8c7', '#4e6e6a', '#e6c9a8', '#b5838d'],
  segmentTextColors: ['#ffffff', '#2d3436', '#1f2a1d', '#ffffff', '#1f2a33', '#ffffff', '#2d3436', '#ffffff'],
  pointerSpace: 8,
  Pointer,
  tick: { frequency: 1500, waveform: 'square', volume: 0.1 },
};

export default theme;
