import { describe, expect, it } from 'vitest';
import { indexAtPointer, planSpin, randomInt, spinKeyframes } from './spinEngine';

describe('spinEngine', () => {
  it('lands exactly on the planned segment', () => {
    for (const count of [1, 2, 3, 7, 12, 40]) {
      let rotation = 0;
      for (let i = 0; i < 200; i++) {
        const plan = planSpin(rotation, count);
        expect(indexAtPointer(plan.endRotation, count)).toBe(plan.targetIndex);
        expect(plan.endRotation - rotation).toBeGreaterThanOrEqual(5 * 360);
        rotation = plan.endRotation;
      }
    }
  });

  it('maps pointer positions to segments', () => {
    // No rotation: segment 0 starts at 12 o'clock and extends clockwise.
    expect(indexAtPointer(-1, 4)).toBe(0);
    expect(indexAtPointer(-91, 4)).toBe(1);
    expect(indexAtPointer(1, 4)).toBe(3);
  });

  it('picks indices fairly', () => {
    const counts = new Array(6).fill(0);
    const n = 60000;
    for (let i = 0; i < n; i++) counts[randomInt(6)]++;
    for (const c of counts) expect(Math.abs(c - n / 6)).toBeLessThan(n / 6 * 0.05);
  });

  it('samples keyframes from start to end, always moving forward', () => {
    const frames = spinKeyframes(30, 2000, 50);
    expect(frames[0]).toEqual({ offset: 0, rotation: 30 });
    expect(frames[frames.length - 1]).toEqual({ offset: 1, rotation: 2000 });
    for (let i = 1; i < frames.length; i++) {
      expect(frames[i].rotation).toBeGreaterThanOrEqual(frames[i - 1].rotation);
    }
  });
});
