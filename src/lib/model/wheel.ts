export interface Entry {
  id: string;
  label: string;
}

export interface Wheel {
  id: string;
  name: string;
  entries: Entry[];
  /** Picked entries disappear for the current run (never from the saved wheel). */
  removeAfterPick: boolean;
  updatedAt: number;
}

export function newId(): string {
  return crypto.randomUUID();
}

export function createEntry(label: string): Entry {
  return { id: newId(), label };
}

export function createWheel(name: string, labels: string[] = []): Wheel {
  return {
    id: newId(),
    name,
    entries: labels.map(createEntry),
    removeAfterPick: false,
    updatedAt: Date.now(),
  };
}

export function duplicateWheel(wheel: Wheel): Wheel {
  return {
    ...wheel,
    id: newId(),
    name: `${wheel.name} (Kopie)`,
    entries: wheel.entries.map((e) => createEntry(e.label)),
    updatedAt: Date.now(),
  };
}

export function exampleWheel(): Wheel {
  return createWheel('Beispiel: Laute', ['S', 'Sch', 'K', 'G', 'R', 'L', 'F', 'Ch']);
}
