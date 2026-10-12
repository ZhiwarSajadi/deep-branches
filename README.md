# Deep Branches
### Hominin Tree 3D: the human family tree

A free, **non-commercial, educational** interactive 3D timeline of the human family tree. Explore 31 fossil hominin
species (some still debated) across more than seven million years, step inside any species' time bar in first-person view, and follow the
sources (peer-reviewed papers and museum pages) linked on every species card.

> **Accuracy note.** The species summaries were drafted with the help of an AI assistant (Claude, by Anthropic)
> and curated by the project's author. They have not been peer reviewed unless stated in the app's About dialog.
> Paleoanthropology changes quickly and many relationships shown are debated. Check the linked sources.

## Quick start

Requires Node.js 20+ (`.nvmrc` pins 22).

```bash
npm install
npm run dev        # local dev server
npm run build      # validates the data, then builds to dist/
npm run preview    # serve the production build locally
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run validate` | Checks species data (unique ids, valid parents, dates, source URL format). Runs before every build. |
| `npm run check:links` | Checks every source link over the internet (needs a connection). Some publishers answer bots with 403; those are reported as "blocked" and need a manual look. |
| `npm run check:release` | Pre-launch checklist on `dist/` (no source maps, no Google Fonts, licences present, empty config warnings). |

## Project layout

```
src/
  data/species.js     species, dates, layout coordinates, clade colours   <- edit to add/fix species
  data/sources.js     citations per species id                             <- edit to add/fix sources
  site.js             brand text, version, URLs, contact
  config.js           feature flags (skull illustrations)
  scene/              3D scene (react-three-fiber): branches, columns, camera rig
  components/         first-person HUD, About dialog, no-WebGL fallback, species list
  lib/                time scale, lineage helpers, motion preference
  styles.css          all styling
public/               favicon, icons, social image, robots.txt, _headers (CSP)
scripts/              validate-data, check-links, check-release
```

## Adding or correcting a species

1. Add an entry to `SPECIES` in `src/data/species.js`:
   `id`, `genus`, `sp`, `clade` (`pan|basal|austr|paran|homo`), `start`/`end` (Ma, `end: 0` = survives to the present),
   `x`/`z` (layout position), `parent` (id of the ancestor shown), `note` (1–3 plain sentences), `place`.
   Optional: `dashed: true` (ancestry debated), `side: "l"` (label on the left), `labelAt` (Ma, label height).
2. Add citations under the same id in `src/data/sources.js` as `[label, https-url]` pairs (prefer DOI links).
3. `npm run validate`, then `npm run dev` to check the layout (labels can overlap; nudge `x`/`z`/`labelAt`).
4. Note the change in `CHANGELOG.md` and bump `SITE.lastUpdated` in `src/site.js`.

## Licences

- Code: MIT (`LICENSE`).
- Text and data: CC BY 4.0 (`LICENSE-CONTENT.md`).
- Third-party libraries and fonts: generated into `THIRD_PARTY_LICENSES.txt` at build time.
- Skull photographs and reconstructions: CC-licensed via Wikimedia Commons (see `src/data/skulls.on.js` and `src/data/reconstructions.on.js`).

## Known notes

- The console shows `THREE.Clock: This module has been deprecated` — it comes from react-three-fiber v8 with a
  recent three.js and is harmless. It goes away when you upgrade to React 19 + react-three-fiber v9.
- Versions are pinned to what the original page ran (React 18.3.1, three r185, react-three-fiber 8, drei 9).
  Run `npm audit` periodically.
