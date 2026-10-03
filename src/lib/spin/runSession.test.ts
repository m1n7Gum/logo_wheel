import { describe, expect, it } from 'vitest';
import { createWheel } from '../model/wheel';
import { remainingEntries, removeFromRun, resetRun, startRun } from './runSession';

describe('runSession', () => {
  it('removes entries only from the run, never from the wheel', () => {
    const wheel = createWheel('Test', ['A', 'B', 'C']);
    const snapshot = structuredClone(wheel);
    let run = startRun(wheel);
    run = removeFromRun(run, wheel.entries[1].id);
    expect(remainingEntries(wheel, run).map((e) => e.label)).toEqual(['A', 'C']);
    expect(wheel).toEqual(snapshot);
    run = resetRun(run);
    expect(remainingEntries(wheel, run)).toHaveLength(3);
  });

  it('ignores a run that belongs to another wheel', () => {
    const a = createWheel('A', ['1', '2']);
    const b = createWheel('B', ['x']);
    const run = removeFromRun(startRun(a), a.entries[0].id);
    expect(remainingEntries(b, run)).toHaveLength(1);
  });
});
