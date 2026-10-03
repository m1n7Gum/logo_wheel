/**
 * Pure wheel geometry. Conventions:
 * - Segment i covers [i * seg, (i + 1) * seg) degrees, measured clockwise from 12 o'clock.
 * - `rotation` is the clockwise rotation of the wheel in degrees.
 * - The pointer sits at 12 o'clock.
 */

export function segmentAngle(count: number): number {
  return 360 / count;
}

export function mod(value: number, m: number): number {
  return ((value % m) + m) % m;
}

/** Index of the segment currently under the pointer. */
export function indexAtPointer(rotation: number, count: number): number {
  const wheelAngle = mod(-rotation, 360);
  return Math.min(count - 1, Math.floor(wheelAngle / segmentAngle(count)));
}

/** Uniform random integer in [0, max) using crypto (no modulo bias). */
export function randomInt(max: number, random: () => number = cryptoRandom): number {
  return Math.min(max - 1, Math.floor(random() * max));
}

export function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}

export interface SpinPlan {
  targetIndex: number;
  /** Absolute rotation the wheel ends at. */
  endRotation: number;
  durationMs: number;
}

export interface SpinOptions {
  minTurns?: number;
  maxTurns?: number;
  durationMs?: number;
  random?: () => number;
}

/** Picks the winner up front and computes where the wheel has to stop. */
export function planSpin(currentRotation: number, count: number, opts: SpinOptions = {}): SpinPlan {
  const { minTurns = 5, maxTurns = 8, durationMs = 5200, random = cryptoRandom } = opts;
  const seg = segmentAngle(count);
  const targetIndex = randomInt(count, random);
  // Stop somewhere inside the segment, but not right on the edge.
  const offsetInSegment = (0.15 + random() * 0.7) * seg;
  const targetWheelAngle = targetIndex * seg + offsetInSegment;
  const turns = minTurns + randomInt(maxTurns - minTurns + 1, random);
  const delta = turns * 360 + mod(-targetWheelAngle - currentRotation, 360);
  return { targetIndex, endRotation: currentRotation + delta, durationMs };
}

/** Strong ease-out: fast start, long gentle slowdown like a real wheel. */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}
