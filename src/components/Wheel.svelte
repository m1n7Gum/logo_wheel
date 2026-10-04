<script lang="ts">
  import type { Entry } from '../lib/model/wheel';
  import type { Theme } from '../themes/types';
  import { segmentAngle, type RotationKeyframe } from '../lib/spin/spinEngine';

  let {
    entries,
    rotation,
    highlightIndex = null,
    theme,
  }: { entries: Entry[]; rotation: number; highlightIndex?: number | null; theme: Theme } = $props();

  let wheelEl: HTMLDivElement;

  /** Runs a spin on the compositor; resolves once the wheel has stopped. */
  export function animateRotation(frames: RotationKeyframe[], durationMs: number): Animation {
    return wheelEl.animate(
      frames.map((f) => ({ offset: f.offset, transform: `rotate(${f.rotation}deg)` })),
      { duration: durationMs, easing: 'linear', fill: 'forwards' },
    );
  }

  // Wheel geometry in a viewBox of -50..50; segment 0 starts at 12 o'clock, clockwise.
  const R = $derived(50 - theme.rimWidth);
  const pegRadius = $derived(50 - theme.rimWidth / 2);

  const segments = $derived.by(() => {
    const n = entries.length;
    const seg = segmentAngle(n);
    const radial = useRadialLabels(entries.filter((e) => !e.image), seg);
    return entries.map((entry, i) => ({
      entry,
      path: n === 1 ? null : sectorPath(i * seg, (i + 1) * seg),
      mid: (i + 0.5) * seg,
      fill: colorAt(theme.segmentColors, i, n),
      textColor: colorAt(theme.segmentTextColors ?? [theme.tokens.text], i, n),
      label: radial ? alongLayout(entry.label, seg) : acrossLayout(entry.label, seg),
      picture: entry.image ? pictureLayout(entry.label, seg) : null,
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
  const MAX_FONT = $derived(R * 0.22);
  const ACROSS_R = $derived(R * 0.68);
  const ALONG_INNER = $derived(R * 0.3);
  const ALONG_OUTER = $derived(R * 0.93);

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

  /**
   * Picture on a white disc (pictograms are dark line art and need a light ground on any
   * segment color), upright at the pointer. A label, if any, sits small below it.
   */
  function pictureLayout(label: string, seg: number) {
    const r = R * 0.66;
    const disc = Math.min(R * 0.27, r * Math.sin(halfAngle(seg)) * 0.9);
    const labelR = r - disc - R * 0.06;
    const labelWidth = 2 * labelR * Math.sin(halfAngle(seg)) * 0.8;
    const labelSize = Math.min(MAX_FONT * 0.55, labelWidth / (glyphs(label) * 0.62));
    return { r, disc, size: disc * 1.5, labelR, labelSize: label && labelSize >= R * 0.04 ? labelSize : 0 };
  }

  /** One orientation for the whole wheel, chosen by what fits the longest label better. */
  function useRadialLabels(list: Entry[], seg: number): boolean {
    if (seg >= 60) return false;
    const longest = list.reduce((a, e) => (glyphs(e.label) > glyphs(a) ? e.label : a), '');
    return alongLayout(longest, seg).size > acrossLayout(longest, seg).size * 1.15;
  }
</script>

<div class="shadow"></div>
<div class="wheel" bind:this={wheelEl} style:transform="rotate({rotation}deg)">
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
          {#if s.picture}
            {@const p = s.picture}
            <circle cy={-p.r} r={p.disc} fill="#fff" />
            <image href={s.entry.image?.src} x={-p.size / 2} y={-p.r - p.size / 2} width={p.size} height={p.size} />
            {#if p.labelSize}
              <text y={-p.labelR} font-size={p.labelSize} fill={s.textColor} text-anchor="middle" dominant-baseline="central"
                >{s.entry.label}</text
              >
            {/if}
          {:else}
          <text
            transform={s.label.radial ? 'rotate(-90)' : undefined}
            x={s.label.radial ? s.label.r : 0}
            y={s.label.radial ? 0 : -s.label.r}
            font-size={s.label.size}
            fill={s.textColor}
            text-anchor="middle"
            dominant-baseline="central">{s.entry.label}</text
          >
          {/if}
        </g>
      </g>
    {/each}
    {#if theme.pegs && segments.length > 1}
      {#each segments as s, i (s.entry.id)}
        {@const a = ((i * 360) / segments.length) * (Math.PI / 180)}
        <circle
          cx={pegRadius * Math.sin(a)}
          cy={-pegRadius * Math.cos(a)}
          r={Math.min(1.1, theme.rimWidth * 0.32)}
          fill="var(--peg-color)"
        />
      {/each}
    {/if}
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
    position: relative;
    width: 100%;
    height: 100%;
    will-change: transform;
  }
  /* Static shadow behind the rotating wheel: cheap, and the light doesn't spin along. */
  .shadow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: var(--wheel-shadow);
    pointer-events: none;
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
