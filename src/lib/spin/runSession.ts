import type { Entry, Wheel } from '../model/wheel';

/**
 * State of the current run of a wheel. It only remembers which entries were removed,
 * so the saved wheel itself is never modified.
 */
export interface RunSession {
  wheelId: string;
  removedIds: readonly string[];
}

export function startRun(wheel: Wheel): RunSession {
  return { wheelId: wheel.id, removedIds: [] };
}

export function remainingEntries(wheel: Wheel, run: RunSession): Entry[] {
  if (run.wheelId !== wheel.id) return wheel.entries;
  return wheel.entries.filter((e) => !run.removedIds.includes(e.id));
}

export function removeFromRun(run: RunSession, entryId: string): RunSession {
  if (run.removedIds.includes(entryId)) return run;
  return { ...run, removedIds: [...run.removedIds, entryId] };
}

export function resetRun(run: RunSession): RunSession {
  return { ...run, removedIds: [] };
}
