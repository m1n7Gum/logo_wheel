/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves the app under /<repo-name>/ – the deploy workflow sets BASE_PATH.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Glücksrad',
        short_name: 'Glücksrad',
        description: 'Auswahlrad für die Sprachtherapie',
        lang: 'de',
        display: 'standalone',
        orientation: 'any',
        background_color: '#1d2045',
        theme_color: '#eef0f8',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        // ~2,000 pictures would make the install so slow that Firefox and Samsung Internet abort
        // it. The app stores them itself in the background (src/lib/pictures/offlineCache.ts).
        globIgnores: ['**/pictograms/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/pictograms/'),
            handler: 'CacheFirst',
            // Must match PICTURE_CACHE in src/lib/pictures/offlineCache.ts.
            options: { cacheName: 'pictograms', cacheableResponse: { statuses: [200] } },
          },
        ],
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
