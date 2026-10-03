import type { Theme } from './types';

const modules = import.meta.glob<{ default: Theme }>('./*/index.ts', { eager: true });

export const themes: Theme[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order);

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) ?? themes[0];
}

export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  for (const [key, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(`--${toKebab(key)}`, value);
  }
  root.dataset.theme = theme.id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.tokens.bg);
}

function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}
