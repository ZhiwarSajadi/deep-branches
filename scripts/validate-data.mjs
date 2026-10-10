// Sanity-checks the species data. Runs automatically before every build (npm run build).
import { SPECIES, CLADES } from "../src/data/species.js";
import { SOURCES } from "../src/data/sources.js";

const errors = [];
const warnings = [];
const ids = new Set();

for (const s of SPECIES) {
  const where = `species "${s.id}"`;
  if (ids.has(s.id)) errors.push(`${where}: duplicate id`);
  ids.add(s.id);
  if (!CLADES[s.clade]) errors.push(`${where}: unknown clade "${s.clade}"`);
  for (const k of ["genus", "sp", "note", "place"]) if (!s[k]) errors.push(`${where}: missing ${k}`);
  for (const k of ["start", "end", "x", "z"]) if (typeof s[k] !== "number" || Number.isNaN(s[k])) errors.push(`${where}: ${k} is not a number`);
  if (s.start < s.end) errors.push(`${where}: start (${s.start} Ma) is younger than end (${s.end} Ma)`);
  if (s.end < 0 || s.start > 8) errors.push(`${where}: dates outside the 0–8 Ma timeline`);
  if (!s.src || s.src.length === 0) warnings.push(`${where}: has no sources listed`);
}
for (const s of SPECIES) {
  if (s.parent && s.parent !== "root" && !ids.has(s.parent)) errors.push(`species "${s.id}": unknown parent "${s.parent}"`);
}
for (const [id, list] of Object.entries(SOURCES)) {
  if (!ids.has(id)) errors.push(`sources: "${id}" does not match any species`);
  const seen = new Set();
  for (const entry of list) {
    const [label, url] = entry;
    if (!label || !url) errors.push(`sources "${id}": entry needs [label, url]`);
    else if (!/^https:\/\//.test(url)) errors.push(`sources "${id}": not an https URL: ${url}`);
    else if (url.includes("doi.org") && !/^https:\/\/doi\.org\/10\.\d{4,9}\/\S+$/.test(url)) errors.push(`sources "${id}": malformed DOI URL: ${url}`);
    if (seen.has(url)) warnings.push(`sources "${id}": duplicate URL ${url}`);
    seen.add(url);
  }
}

warnings.forEach((w) => console.warn("warning:", w));
if (errors.length) {
  errors.forEach((e) => console.error("ERROR:", e));
  process.exit(1);
}
const urls = new Set(Object.values(SOURCES).flat().map((e) => e[1]));
console.log(`Data OK: ${SPECIES.length} species, ${urls.size} unique source links.`);
