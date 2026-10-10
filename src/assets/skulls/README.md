# Skull illustrations (OFF by default)

These 14 PNGs were embedded in the original single-file HTML. Their author/source/licence is **not documented**,
so they are excluded from git (see `.gitignore`) and from the build (`SHOW_SKULL_ILLUSTRATIONS = false` in `src/config.js`).

Before enabling them:
1. Work out where they came from (drawn by you? generated? copied from somewhere?).
2. Make sure you are allowed to publish them. If they came from a third party, get permission or replace them.
3. Fill in `SITE.skullCredit` in `src/site.js`, remove the `*.png` line for this folder from `.gitignore`,
   and set `SHOW_SKULL_ILLUSTRATIONS = true` in `src/config.js`.

Files are matched by species id: `afarensis.png`, `sapiens.png`, ...
