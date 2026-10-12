# Changelog

Record every content correction and release here (the date is also shown in the About dialog via `SITE.lastUpdated`).

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
