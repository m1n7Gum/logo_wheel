<script lang="ts">
  import { onMount } from 'svelte';

  /** Confetti shot up from both bottom corners, once; drawn on a canvas so it stays smooth on tablets. */
  const COLORS = ['#ef476f', '#3a86ff', '#ffc43d', '#8338ec', '#06d6a0', '#ff7b00', '#00b4d8'];
  const PIECES = 160;
  const DURATION_MS = 4500;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = innerWidth;
    const h = innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Speeds scale with the screen, so the burst reaches about the same height on phone and tablet.
    const unit = Math.min(w, h) / 600;
    const pieces = Array.from({ length: PIECES }, (_, i) => {
      const fromLeft = i % 2 === 0;
      const angle = ((fromLeft ? -60 : -120) + (Math.random() - 0.5) * 40) * (Math.PI / 180);
      const speed = (14 + Math.random() * 10) * unit * (h / Math.min(w, h)) ** 0.5;
      return {
        x: fromLeft ? 0 : w,
        y: h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: (8 + Math.random() * 8) * Math.max(0.8, unit),
        color: COLORS[i % COLORS.length],
        spin: Math.random() * Math.PI,
        spinSpeed: (Math.random() - 0.5) * 0.3,
        flip: Math.random() * Math.PI,
        delay: Math.random() * 400,
      };
    });

    const start = performance.now();
    let last = start;
    let frame = requestAnimationFrame(function draw(now) {
      const elapsed = now - start;
      // Frame-rate independent: one step is one 60 Hz frame.
      const step = Math.min(3, (now - last) / (1000 / 60));
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = Math.min(1, (DURATION_MS - elapsed) / 800);
      for (const p of pieces) {
        if (elapsed < p.delay) continue;
        p.vy += 0.35 * unit * step;
        p.vx *= 0.99 ** step;
        p.vy *= 0.99 ** step;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.spin += p.spinSpeed * step;
        p.flip += 0.12 * step;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.scale(1, Math.cos(p.flip));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (elapsed < DURATION_MS) frame = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, w, h);
    });
    return () => cancelAnimationFrame(frame);
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
  canvas {
    position: fixed;
    inset: 0;
    z-index: 55;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
