// Pre-launch checklist. Run after a build:  npm run build && npm run check:release
import fs from "node:fs";
import path from "node:path";
import { SITE } from "../src/site.js";
import { SHOW_SKULL_ILLUSTRATIONS } from "../src/config.js";

const errors = [];
const warnings = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

if (!fs.existsSync("dist/index.html")) {
  console.error("No dist/ folder. Run `npm run build` first.");
  process.exit(1);
}
const files = walk("dist");
const text = files.filter((f) => /\.(html|js|css|txt|json|webmanifest)$/.test(f)).map((f) => [f, fs.readFileSync(f, "utf8")]);

// Things you must fill in
if (!SITE.siteUrl) warnings.push("SITE.siteUrl is empty (src/site.js): canonical + social-preview tags are omitted.");
if (!SITE.contactEmail && !SITE.repoUrl) warnings.push("No contact email or repo URL (src/site.js): visitors have no way to report errors or takedown requests.");
if (!SITE.reviewedBy) warnings.push("SITE.reviewedBy is empty: fine, but an expert review would greatly improve credibility.");
if (SHOW_SKULL_ILLUSTRATIONS && !SITE.skullCredit) errors.push("Skull illustrations are ON but SITE.skullCredit is empty.");

// Things that must not ship
if (files.some((f) => f.endsWith(".map"))) errors.push("Source maps found in dist/.");
if (!SHOW_SKULL_ILLUSTRATIONS && files.some((f) => /assets\/.*\.png$/.test(f))) errors.push("PNG images found in dist/assets while skull illustrations are off.");
for (const [f, t] of text) {
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(t)) errors.push(`${f}: still references Google Fonts.`);
  if (/clickup|artifact-input|__artifactSourceMap/i.test(t)) errors.push(`${f}: contains traces of the original artifact/ClickUp file.`);
  if (/google-analytics|googletagmanager|plausible|umami/i.test(t) && !/THIRD_PARTY/.test(f)) warnings.push(`${f}: mentions an analytics service; update the Privacy text in AboutContent.jsx if you added one.`);
}
for (const needed of ["THIRD_PARTY_LICENSES.txt", "favicon.svg", "og-image.png", "apple-touch-icon.png", "robots.txt"]) {
  if (!fs.existsSync(path.join("dist", needed))) errors.push(`dist/${needed} is missing.`);
}
for (const f of ["LICENSE", "LICENSE-CONTENT.md", "README.md", "CITATION.cff"]) if (!fs.existsSync(f)) errors.push(`${f} is missing from the project root.`);

warnings.forEach((w) => console.warn("warning:", w));
errors.forEach((e) => console.error("ERROR:  ", e));
console.log(errors.length ? `\n${errors.length} error(s) — fix before publishing.` : "\nNo blocking problems found.");
process.exit(errors.length ? 1 : 0);
