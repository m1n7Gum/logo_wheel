import { pictogramUrl } from './arasaac';
import { loadCatalog } from './catalog';

// The pictures are not part of the service worker install: Workbox fetches precache entries one
// after another, and ~2,000 of them took so long that Firefox and Samsung Internet aborted the
// install and kept the old app version. Instead the app copies them into their own cache in the
// background. Cache name must match the runtime caching rule in vite.config.ts.
export const PICTURE_CACHE = 'pictograms';
const PARALLEL_DOWNLOADS = 6;

let running = false;

/**
 * Stores every bundled picture for offline use. Already stored pictures are skipped, so an
 * interrupted run simply continues on the next app start. Never throws.
 */
export async function cacheAllPictures(): Promise<void> {
  if (running || typeof caches === 'undefined' || !navigator.onLine) return;
  running = true;
  try {
    const [catalog, cache] = await Promise.all([loadCatalog(), caches.open(PICTURE_CACHE)]);
    const stored = new Set((await cache.keys()).map((r) => r.url));
    const missing = catalog.ids
      .map((id) => new URL(pictogramUrl(id), location.href).href)
      .filter((url) => !stored.has(url));
    let next = 0;
    async function worker() {
      while (next < missing.length && navigator.onLine) {
        const url = missing[next++];
        try {
          const res = await fetch(url);
          if (res.ok) await cache.put(url, res);
        } catch {
          // Offline or a single failure: picked up again on the next start.
        }
      }
    }
    await Promise.all(Array.from({ length: PARALLEL_DOWNLOADS }, worker));
  } catch (err) {
    console.warn('Bilder konnten nicht offline gespeichert werden', err);
  } finally {
    running = false;
  }
}
