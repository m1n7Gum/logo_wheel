# Glücksrad

Ein Auswahlrad für die Sprachtherapie. Therapeut:innen legen eigene Räder an (z.B. mit Lauten), das Kind dreht, und das Ergebnis erscheint groß und für beide Tischseiten lesbar.

Die App ist eine **PWA** (Web-App zum Installieren): Sie läuft auf iPad und Android-Tablets, funktioniert offline und kostet nichts.

## Benutzung auf dem Tablet

1. Die Seite einmal im Browser öffnen (Adresse siehe GitHub Pages).
2. **Als App installieren**. Das ist wichtig, damit die gespeicherten Räder nicht gelöscht werden.
   - **iPad:** In Safari auf *Teilen* tippen und dann *Zum Home-Bildschirm*.
   - **Android (Samsung):** In **Chrome** das Menü ⋮ öffnen und *App installieren* wählen. Bitte nicht *Samsung Internet* verwenden: Dessen installierte Web-Apps blockiert Android 14+ mit der Meldung „Unsichere App blockiert … ältere Android-Version“.
3. Die App danach immer über das Symbol auf dem Home-Bildschirm starten.

Gut zu wissen:
- Alle Räder werden automatisch **auf dem jeweiligen Tablet** gespeichert.
- Unter *Optionen → Sicherung* lässt sich eine Backup-Datei speichern und wieder laden, z.B. um Räder auf ein anderes Tablet zu übertragen.
- Updates kommen automatisch, sobald die App mit Internet gestartet wird.
- **Bilder für Kinder, die noch nicht lesen:** Im Editor neben einem Feld auf das Bild-Symbol tippen (oder unten auf *Bild*).
  - *Wort*: nach einem Wort suchen. Mit leerem Suchfeld erscheinen Kategorien (Tiere, Essen, Spielzeug …).
  - *Laut*: z.B. „sch“ eingeben und wählen, ob der Laut am Anfang, in der Mitte oder am Ende stehen soll. Gesucht wird nach Buchstaben, nicht nach Aussprache („st“ findet auch „Stern“).
  - Rund 2.000 ausgewählte Bilder sind in der App enthalten. Suche und Bilder funktionieren komplett ohne Internet, die App ruft keine fremden Server auf.

### Bildquelle

Die Bilder kommen aus der Piktogramm-Sammlung von [ARASAAC](https://arasaac.org): Autor Sergio Palao, Eigentum der Regierung von Aragón (Spanien), Lizenz [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de). Erlaubt ist damit nur nicht-kommerzielle Nutzung mit Quellenangabe. Die App nennt die Quelle in der Bildersuche und unter *Optionen → Bilder*.

Die Bilder liegen als WebP in `public/pictograms/` (ca. 19 MB), die Wortliste für die Suche in `src/lib/pictures/arasaac-index.json`. Beides erzeugt `npm run update-pictograms` aus dem ARASAAC-Katalog; danach die Änderungen committen.

Welche Bilder in die App kommen, steht in `scripts/pictogram-selection.json` (ca. 2.000 ARASAAC-IDs). Die Auswahl ist für Sprachtherapie mit Kindern von 3 bis 10 geprüft: alltagsnahe Nomen und gut darstellbare Verben, ohne Fachbegriffe, Medizin, Sexualität, Gewalt, Geld- und Verwaltungsthemen. Sie wurde einmalig mit KI vorsortiert und von Hand nachgearbeitet. Neue ARASAAC-Bilder kommen nur rein, wenn ihre ID dort ergänzt wird; `npm run update-pictograms -- --pictures <datei>` exportiert alle Kandidaten mit Wörtern zum Durchsehen. Zusätzlich filtert das Skript Bilder, die ARASAAC als sexuell oder gewalttätig markiert, und einzelne Wörter (`BLOCKED_WORDS`, `scripts/pictogram-exclusions.json`).

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
scripts/            update-pictograms.mjs: Bildauswahl von ARASAAC holen
public/pictograms/  Mitgelieferte Bilder (erzeugt, nicht von Hand ändern)
src/
  lib/model/        Datentypen (Wheel, Entry)
  lib/storage/      Speicherung (localStorage, Schema-Version, Backup), Einstellungen
  lib/pictures/     Mitgelieferte ARASAAC-Bilder: Suche nach Wort, Laut und Kategorie
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
