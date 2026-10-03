# Glücksrad

Ein Auswahlrad für die Sprachtherapie. Therapeut:innen legen eigene Räder an (z.B. mit Lauten), das Kind dreht, und das Ergebnis erscheint groß und für beide Tischseiten lesbar.

Die App ist eine **PWA** (Web-App zum Installieren): Sie läuft auf iPad und Android-Tablets, funktioniert offline und kostet nichts.

## Benutzung auf dem Tablet

1. Die Seite einmal im Browser öffnen (Adresse siehe GitHub Pages).
2. **Als App installieren**. Das ist wichtig, damit die gespeicherten Räder nicht gelöscht werden.
   - **iPad:** In Safari auf *Teilen* tippen und dann *Zum Home-Bildschirm*.
   - **Android (Samsung):** In Chrome das Menü ⋮ öffnen und *App installieren* bzw. *Zum Startbildschirm hinzufügen* wählen.
3. Die App danach immer über das Symbol auf dem Home-Bildschirm starten.

Gut zu wissen:
- Alle Räder werden automatisch **auf dem jeweiligen Tablet** gespeichert.
- Unter *Optionen → Sicherung* lässt sich eine Backup-Datei speichern und wieder laden, z.B. um Räder auf ein anderes Tablet zu übertragen.
- Updates kommen automatisch, sobald die App mit Internet gestartet wird.

## Entwicklung

```bash
npm install
npm run dev -- --host   # erreichbar im WLAN, z.B. direkt auf dem Tablet testen
npm test                # Logik-Tests (Vitest)
npm run build           # Typecheck + Produktions-Build nach dist/
```

Stack: Vite, Svelte 5, TypeScript, vite-plugin-pwa.

## Deployment (GitHub Pages, kostenlos)

1. Ein Repository auf GitHub anlegen und den Code auf `main` pushen.
2. Im Repository unter *Settings → Pages → Source* **GitHub Actions** auswählen.
3. Jeder Push auf `main` baut und veröffentlicht die App dann automatisch (`.github/workflows/deploy.yml`). Sie ist erreichbar unter `https://<user>.github.io/<repo>/`.

## Projektstruktur

```
src/
  lib/model/        Datentypen (Wheel, Entry)
  lib/storage/      Speicherung (localStorage, Schema-Version, Backup), Einstellungen
  lib/spin/         Dreh-Logik (rein, getestet) und aktuelle Runde (verschwundene Felder)
  lib/audio/        Synthetisches Rattern (Web Audio, keine Audiodateien)
  lib/state/        Zentraler App-Zustand; alle Änderungen laufen hier durch und werden gespeichert
  components/       UI (Rad, Toolbar, Ergebnis, Editor, Liste, Optionen)
  themes/           Ein Ordner pro Theme
```

## Neues Theme hinzufügen

Alles, was ein Theme ausmacht, liegt in seinem eigenen Ordner. Der Rest der App muss dafür nicht angepasst werden.

1. Den Ordner `src/themes/<id>/` anlegen, z.B. als Kopie von `classic/`.
2. In `index.ts` ein `Theme`-Objekt exportieren (siehe `src/themes/types.ts`):
   - `tokens`: Farben, Schrift und Rundungen. Sie werden als CSS-Variablen gesetzt.
   - `segmentColors` / `segmentTextColors`: Farben der Felder.
   - `pointerSpace` + `Pointer`: der Zeiger als SVG-Komponente (`<svelte:options namespace="svg" />`). Er wird auf eine Bühne von `100 × (100 + pointerSpace)` gezeichnet, die Oberkante des Rads liegt bei `y = pointerSpace`.
   - optional `Decorations`: Hintergrund-Deko hinter dem Rad, z.B. die Tiere in `cozy/`.
   - optional `tick`: Klang des Ratterns.
3. Fertig: Das Theme taucht automatisch unter *Optionen → Aussehen* auf.
