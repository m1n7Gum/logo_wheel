export interface Entry {
  id: string;
  /** May be empty when the entry has a picture. */
  label: string;
  image?: EntryImage;
}

/** Stored inline as a data URL, so pictures work offline and travel with backups. */
export interface EntryImage {
  src: string;
  /** Pictogram id at ARASAAC, where the picture came from. */
  arasaacId?: number;
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

export function createEntry(label: string, image?: EntryImage): Entry {
  return image ? { id: newId(), label, image } : { id: newId(), label };
}

/** Readable name of an entry, also for picture-only entries. */
export function entryName(entry: Entry): string {
  return entry.label || (entry.image ? 'Bild' : '');
}

export function createWheel(name: string, labels: string[] = []): Wheel {
  return {
    id: newId(),
    name,
    entries: labels.map((label) => createEntry(label)),
    removeAfterPick: false,
    updatedAt: Date.now(),
  };
}

export function duplicateWheel(wheel: Wheel): Wheel {
  return {
    ...wheel,
    id: newId(),
    name: `${wheel.name} (Kopie)`,
    entries: wheel.entries.map((e) => createEntry(e.label, e.image)),
    updatedAt: Date.now(),
  };
}

export function exampleWheel(): Wheel {
  return createWheel('Beispiel: Laute', ['S', 'Sch', 'K', 'G', 'R', 'L', 'F', 'Ch']);
}
