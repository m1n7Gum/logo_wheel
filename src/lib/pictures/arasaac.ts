import type { EntryImage } from '../model/wheel';

// ARASAAC (arasaac.org): free pictograms for augmentative communication.
// Licence CC BY-NC-SA – the app must name the source wherever pictures can be picked.
// A selection ships with the app (scripts/update-pictograms.mjs), so no external requests.

export const ARASAAC_CREDIT =
  'Piktogramme: Sergio Palao, Eigentum der Regierung von Aragón, Herkunft ARASAAC (arasaac.org), Lizenz CC BY-NC-SA.';

export interface Pictogram {
  id: number;
  /** German word for the picture, e.g. „Maus“. */
  keyword: string;
  previewUrl: string;
}

export function pictogramUrl(id: number): string {
  return `${import.meta.env.BASE_URL}pictograms/${id}.webp`;
}

/** Turns a bundled picture into an inline image, so the wheel and its backups carry it along. */
export async function fetchPictogram(id: number): Promise<EntryImage> {
  const res = await fetch(pictogramUrl(id));
  if (!res.ok) throw new Error(`Bild ${id} konnte nicht geladen werden`);
  return { src: await blobToDataUrl(await res.blob()), arasaacId: id };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
