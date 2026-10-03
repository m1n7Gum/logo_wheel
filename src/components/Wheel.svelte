<script lang="ts">
  import type { Entry } from '../lib/model/wheel';
  import type { Theme } from '../themes/types';
  import { segmentAngle } from '../lib/spin/spinEngine';

  let {
    entries,
    rotation,
    highlightIndex = null,
    theme,
  }: { entries: Entry[]; rotation: number; highlightIndex?: number | null; theme: Theme } = $props();

  // Wheel geometry in a viewBox of -50..50; segment 0 starts at 12 o'clock, clockwise.
  const R = 47.5;

  const segments = $derived.by(() => {
    const n = entries.length;
    const seg = segmentAngle(n);
    const radial = useRadialLabels(entries, seg);
    return entries.map((entry, i) => ({
      entry,
      path: n === 1 ? null : sectorPath(i * seg, (i + 1) * seg),
      mid: (i + 0.5) * seg,
      fill: colorAt(theme.segmentColors, i, n),
      textColor: colorAt(theme.segmentTextColors ?? [theme.tokens.text], i, n),
      label: radial ? alongLayout(entry.label, seg) : acrossLayout(entry.label, seg),
    }));
  });

  /** Cycles through colors but avoids equal neighbours where the circle closes. */
  function colorAt(colors: string[], i: number, n: number): string {
    const k = colors.length;
    if (k > 2 && n > 1 && i === n - 1 && i % k === 0) return colors[1];
    return colors[i % k];
  }

  function point(angleDeg: number, r: number): string {
    const a = (angleDeg * Math.PI) / 180;
    return `${(r * Math.sin(a)).toFixed(3)} ${(-r * Math.cos(a)).toFixed(3)}`;
  }

  function sectorPath(start: number, end: number): string {
    const large = end - start > 180 ? 1 : 0;
    return `M 0 0 L ${point(start, R)} A ${R} ${R} 0 ${large} 1 ${point(end, R)} Z`;
  }

  // Label layouts. "Across" text sits upright when its segment is at the pointer;
  // "along" text runs along the radius and fits many segments / long labels better.
  const MAX_FONT = R * 0.22;
  const ACROSS_R = R * 0.68;
  const ALONG_INNER = R * 0.3;
  const ALONG_OUTER = R * 0.93;

  const glyphs = (label: string) => Math.max(1, [...label].length);
  const halfAngle = (seg: number) => (Math.min(seg, 120) * Math.PI) / 360;

  function acrossLayout(label: string, seg: number) {
    const width = 2 * ACROSS_R * Math.sin(halfAngle(seg)) * 0.82;
    return { radial: false, r: ACROSS_R, size: Math.min(MAX_FONT, width / (glyphs(label) * 0.62)) };
  }

  function alongLayout(label: string, seg: number) {
    const r = (ALONG_INNER + ALONG_OUTER) / 2;
    const thickness = 2 * r * Math.sin(halfAngle(seg)) * 0.7;
    const length = ALONG_OUTER - ALONG_INNER;
    return { radial: true, r, size: Math.min(MAX_FONT, thickness, length / (glyphs(label) * 0.6)) };
  }

  /** One orientation for the whole wheel, chosen by what fits the longest label better. */
  function useRadialLabels(list: Entry[], seg: number): boolean {
    if (seg >= 60) return false;
    const longest = list.reduce((a, e) => (glyphs(e.label) > glyphs(a) ? e.label : a), '');
    return alongLayout(longest, seg).size > acrossLayout(longest, seg).size * 1.15;
  }
</script>

<div class="wheel" style:transform="rotate({rotation}deg)">
  <svg viewBox="-50 -50 100 100" role="img" aria-label="Glücksrad">
    <circle r="50" fill="var(--wheel-rim)" />
    {#each segments as s, i (s.entry.id)}
      <g class:dimmed={highlightIndex !== null && highlightIndex !== i}>
        {#if s.path}
          <path d={s.path} fill={s.fill} stroke="var(--segment-stroke)" stroke-width="0.5" />
        {:else}
          <circle r={R} fill={s.fill} />
        {/if}
        <g transform="rotate({s.mid})">
          <text
            transform={s.label.radial ? 'rotate(-90)' : undefined}
            x={s.label.radial ? s.label.r : 0}
            y={s.label.radial ? 0 : -s.label.r}
            font-size={s.label.size}
            fill={s.textColor}
            text-anchor="middle"
            dominant-baseline="central">{s.entry.label}</text
          >
        </g>
      </g>
    {/each}
    {#if highlightIndex !== null && segments[highlightIndex]}
      {@const h = segments[highlightIndex]}
      {#if h.path}
        <path d={h.path} class="highlight" />
      {:else}
        <circle r={R - 1} class="highlight" />
      {/if}
    {/if}
  </svg>
</div>

<style>
  .wheel {
    width: 100%;
    height: 100%;
    will-change: transform;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
  text {
    font-family: var(--font-family);
    font-weight: 700;
  }
  g {
    transition: opacity 0.3s;
  }
  .dimmed {
    opacity: 0.45;
  }
  .highlight {
    fill: none;
    stroke: var(--highlight);
    stroke-width: 2;
    stroke-linejoin: round;
  }
</style>
