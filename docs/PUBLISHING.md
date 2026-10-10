# Publishing checklist

Everything below is about *you*: facts, names and accounts the project cannot invent for you.

## 1. Before you publish

**Fill in `src/site.js`**
- [ ] `siteUrl` — final address, e.g. `https://yourname.github.io/deep-branches/` (needed for canonical + social preview).
- [ ] `contactEmail` and/or `repoUrl` — visitors need a way to report errors and send takedown requests. Use an address you are happy to make public (a dedicated one is better than your personal one).
- [ ] `reviewedBy` — only if a qualified person really reviewed the content. Otherwise leave empty.
- [ ] `lastUpdated` / `version` — update whenever you change content.

**Check the content (most important)**
- [ ] Open every source link: `npm run check:links` (needs internet). For the ones reported "blocked", open them in a browser.
- [ ] Read each species note next to its sources. The text was drafted with AI help, so verify dates, claims and names. Pay special attention to the 2025–2026 papers: confirm they exist and say what the note says.
- [ ] Make sure no note copies sentences from a source. Paraphrase in your own words.
- [ ] Ideally ask a student/teacher/researcher in anthropology to skim it, then set `reviewedBy`.

**Decide about the skull illustrations**
- They are **off** because nobody knows where the 14 images came from. If you made them yourself (drew or generated them), say so in `SITE.skullCredit`, remove the `src/assets/skulls/*.png` line from `.gitignore`, and set `SHOW_SKULL_ILLUSTRATIONS = true` in `src/config.js`. If you did not, leave them off or replace them with CC0/CC BY images from Wikimedia Commons (and credit them).

**Names and accounts**
- [ ] Search the web and trademark databases for "Deep Branches" to make sure you are not stepping on someone's brand. It is a common phrase, so also check the domain/handle you want.
- [ ] Decide the licence for text/data (default CC BY 4.0, see `LICENSE-CONTENT.md`) and code (MIT).
- [ ] Optionally add your name to `LICENSE`, `CITATION.cff` (keeping "Deep Branches contributors" is also fine).

**Technical**
- [ ] `npm install && npm run build && npm run check:release` — fix anything marked ERROR.
- [ ] `npm run preview` and test on a phone, in Safari and Firefox.

## 2. While publishing

Easiest free route: **GitHub Pages**
1. Create a public repository, push this project to the `main` branch.
2. Repo → Settings → Pages → Source: **GitHub Actions**. The included workflow builds and deploys on every push.
3. Wait for the green check, open the URL, put it into `siteUrl`, push again.
4. Optional: add a custom domain in Settings → Pages (HTTPS is automatic).

Alternatives: Cloudflare Pages or Netlify (build command `npm run build`, output `dist`). They also apply `public/_headers` (security headers + CSP). GitHub Pages cannot set headers; the site still works. If your visitors are in a country with sanctions-related restrictions, test that the host is reachable there before choosing.

After it is live:
- [ ] Load the live URL; check the console for errors; check the About dialog and the licences file (`/THIRD_PARTY_LICENSES.txt`).
- [ ] Paste the URL into a social-card preview tool to see the preview image.
- [ ] Run Lighthouse (accessibility + performance).
- [ ] Add a `sitemap.xml` and its line in `public/robots.txt` if you want (one page only, so optional).

## 3. After publishing

- [ ] Answer corrections quickly and log them in `CHANGELOG.md`.
- [ ] Re-check links every few months (`npm run check:links`) and scan new discoveries; update `lastUpdated`.
- [ ] `npm audit` and dependency updates a few times a year.
- [ ] Archive a release on Zenodo (GitHub integration) to get a citable DOI; save the page in the Wayback Machine.
- [ ] If you ever add analytics, ads, or accounts, update the Privacy and "non-commercial" text in `src/components/AboutContent.jsx` first.
- [ ] Renew the domain (calendar reminder) and keep a backup of the repository.
