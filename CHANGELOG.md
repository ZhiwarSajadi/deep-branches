# Changelog

Record every content correction and release here (the date is also shown in the About dialog via `SITE.lastUpdated`).

## Unreleased

Review fixes:

- **Accessibility & Controls**: species media cards no longer nest a link inside a button, and their links meet the 24 px target size. Autoplay and 3D rotation start on load/refresh and cleanly pause when the timeline reaches the present.
- **Images**: removed the *P. troglodytes* "life reconstruction" (a photograph of a living chimpanzee) and the *A. garhi* "reconstruction" (a photograph of a fossil skull cast). Bundled photographs were downscaled and re-encoded to cut download size; licences and credits are unchanged.
- **Citations**: the *H. antecessor* "Pink" face now cites Huguet et al. 2025 (*Nature*). The *H. habilis* 2.8 Ma jaw cites Villmoare et al. 2015 instead of a news article. The Rendu et al. 2014 link now uses the DOI.
- **Content**: "31 fossil relatives" is now "31 hominin lineages", because the count includes *H. sapiens* (living) and an informal group that is not a formally named species.
- **Site**: the Content-Security-Policy is also written as a `<meta>` tag in builds, so it applies on GitHub Pages. Added `sitemap.xml`.
- **Maintenance**: version 1.0.1 in `package.json`, the site config and `CITATION.cff`. The skull feature flag now controls reconstructions too. The release check detects JPEG images. The reconstruction download script refuses to run without `--force`, and the unused stub was removed. Build-time HTML substitution no longer misreads `$` characters.

## 1.0.1 — 2026-10-12

Scientific review updates and data accuracy refinements based on literature audit:

- **CR-01 (*H. rhodesiensis*)**: Corrected *Homo bodoensis* proposal year to 2022 (Roksandic et al. 2022).
- **CR-02 (*A. africanus*)**: Disentangled Taung Child from Sterkfontein Member 4 cosmogenic dating (~3.4–3.6 Ma, Granger et al. 2022).
- **CR-04 (*H. antecessor*)**: Added note on Sima del Elefante TE7 "Pink" face provisionally assigned to *Homo affinis erectus*.
- **CR-05 (*H. heidelbergensis*)**: Attributed >1.3 Ma lineage split estimates to 2025 Yunxian 2 cranium reconstruction (Feng et al. 2025, *Science*).
- **CR-06 & CR-07 (*H. longi*)**: Clarified ~1 Ma Yunxian 2 skull placement without species assignment, and added Penghu 1 protein variant critique caveat (Taylor & Albert 2025).
- **CR-08 (No-JS fallback)**: Added per-entry source links into the static `<noscript>` HTML fallback list.
- **CR-10 (*P. capensis*)**: Clarified tentative assignment of SK 15 and noted 2026 Clarke & Pickering rebuttal.
- **CR-11 (Metadata & copy)**: Updated timeline span phrasing from "eight million years" to "more than seven million years" to accurately match 0–7.3 Ma fossil records.
- **CR-12 (*A. deyiremeda*)**: Attributed tree-climbing interpretation of the Burtele foot to researchers.

## 1.0.0 — 2026-10-10

First public release, converted from a single-file artifact into a Vite + React project.

- Branded as **Deep Branches** — *Hominin Tree 3D: the human family tree*.
- New About & credits dialog: non-commercial statement, accuracy and AI-assistance disclosure, privacy, licences.
- Fonts are now self-hosted (no requests to Google); strict Content-Security-Policy supported.
- Added: loading screen, no-JavaScript list, no-WebGL fallback page, screen-reader species list,
  visible keyboard focus, reduced-motion start state, social-preview tags, favicon and icons.
- Fixed: Space key no longer double-toggles playback when a button has keyboard focus.
- Skull illustrations are off by default because their source/licence is undocumented.
- Removed all traces of the original upload location and artifact build metadata.
