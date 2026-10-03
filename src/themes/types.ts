import type { Component } from 'svelte';
import type { TickSound } from '../lib/audio/ticker';

/**
 * Everything that makes up a theme. To add a theme, create `src/themes/<id>/index.ts`
 * that default-exports a `Theme` – it is picked up automatically by the registry.
 */
export interface Theme {
  id: string;
  name: string;
  /** Sort position in the theme picker. */
  order: number;
  tokens: ThemeTokens;
  /** Segment fill colors, used in rotation. */
  segmentColors: string[];
  /** Label color per segment fill; falls back to `tokens.text`. */
  segmentTextColors?: string[];
  /**
   * Room above the wheel (in stage units, wheel diameter = 100) for the pointer.
   * The pointer is drawn into a stage of size 100 × (100 + pointerSpace).
   */
  pointerSpace: number;
  /** SVG component (namespace="svg") drawn on top of the wheel in stage coordinates. */
  Pointer: Component;
  /** Optional HTML component for background decoration (rendered behind the wheel). */
  Decorations?: Component;
  tick?: TickSound;
}

/** Design tokens, applied as CSS variables (`fontFamily` → `--font-family`). */
export interface ThemeTokens {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  border: string;
  fontFamily: string;
  radius: string;
  wheelRim: string;
  segmentStroke: string;
  highlight: string;
  centerBg: string;
  centerText: string;
  centerRing: string;
  backdrop: string;
  resultBg: string;
  resultText: string;
}
