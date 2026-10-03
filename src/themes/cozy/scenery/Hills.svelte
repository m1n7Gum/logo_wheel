<script lang="ts" module>
  type Pt = [number, number];

  // Hill outlines as cubic Bézier segments (start, control 1, control 2, end).
  const BACK: Pt[][] = [
    [[0, 20], [30, 8], [60, 10], [90, 18]],
    [[90, 18], [120, 26], [150, 6], [190, 10]],
    [[190, 10], [215, 13], [230, 18], [240, 22]],
  ];
  const FRONT: Pt[][] = [
    [[0, 28], [40, 18], [80, 22], [120, 26]],
    [[120, 26], [160, 30], [200, 16], [240, 26]],
  ];

  const toPath = (segs: Pt[][]) =>
    `M 0 40 L ${segs[0][0].join(' ')} ` + segs.map(([, a, b, c]) => `C ${a} ${b} ${c}`).join(' ') + ' L 240 40 Z';

  /** Height of an outline at x, sampled from its Bézier segments. */
  function topAt(segs: Pt[][], x: number): number {
    const pts: Pt[] = segs.flatMap(([p0, p1, p2, p3]) =>
      Array.from({ length: 40 }, (_, i): Pt => {
        const t = i / 39, u = 1 - t;
        const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
        return [k[0] * p0[0] + k[1] * p1[0] + k[2] * p2[0] + k[3] * p3[0], k[0] * p0[1] + k[1] * p1[1] + k[2] * p2[1] + k[3] * p3[1]];
      }),
    );
    let best = pts[0];
    for (const p of pts) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
    return best[1];
  }

  // Deterministic "random" scatter so the meadow looks the same on every render.
  function scatter(count: number, seed: number) {
    let s = seed;
    const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: count }, () => {
      const x = 2 + next() * 236;
      const top = Math.min(topAt(BACK, x), topAt(FRONT, x)) + 1.6;
      return { x, y: top + next() * (39.5 - top), dir: next() < 0.5 ? -1 : 1 };
    });
  }

  const backPath = toPath(BACK);
  const frontPath = toPath(FRONT);
  const blades = scatter(110, 7);
  const daisies = scatter(18, 31);
</script>

<svg viewBox="0 0 240 40" aria-hidden="true">
  <path d={backPath} fill="#dcefc9" />
  <path d={frontPath} fill="#c6e3ad" />
  <g stroke="#a6d08f" stroke-width="0.45" stroke-linecap="round" fill="none">
    {#each blades as b}
      <path d="M {b.x} {b.y} q {b.dir * 0.2} -1.1 {b.dir * 0.8} -1.7" />
    {/each}
  </g>
  {#each daisies as d}
    <circle cx={d.x} cy={d.y} r="0.75" fill="#fff" />
    <circle cx={d.x} cy={d.y} r="0.3" fill="#ffcf4a" />
  {/each}
</svg>
