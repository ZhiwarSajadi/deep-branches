// Sanity-checks the species data. Runs automatically before every build (npm run build).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { SPECIES, CLADES } from "../src/data/species.js";
import { SOURCES } from "../src/data/sources.js";
import { PRONUNCIATIONS } from "../src/data/pronunciations.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

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

const byId = Object.fromEntries(SPECIES.map((s) => [s.id, s]));
for (const s of SPECIES) {
  if (s.parent && s.parent !== "root") {
    if (!ids.has(s.parent)) errors.push(`species "${s.id}": unknown parent "${s.parent}"`);
    else if (s.start > byId[s.parent].start) {
      warnings.push(`species "${s.id}": starts at ${s.start} Ma, before parent "${s.parent}" (${byId[s.parent].start} Ma)`);
    }
  }
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

// Pronunciations
for (const s of SPECIES) {
  if (!PRONUNCIATIONS[s.id]) warnings.push(`pronunciations: missing entry for "${s.id}"`);
}
for (const [id, val] of Object.entries(PRONUNCIATIONS)) {
  if (id !== "root" && !ids.has(id)) errors.push(`pronunciations: "${id}" does not match any species`);
  if (!val.ipa || !val.guide) errors.push(`pronunciations "${id}": missing ipa or guide`);
}

// Skulls metadata & asset files
try {
  const skullPath = path.join(rootDir, "src/data/skulls.on.js");
  const skullJs = fs
    .readFileSync(skullPath, "utf8")
    .replace(/const images =[\s\S]*?imageMap =[^;]+;/, "const imageMap = {};")
    .replace(/export const/g, "const");
  const sCtx = {};
  vm.runInNewContext(skullJs + "\n;Object.assign(this, { SKULL_METADATA });", sCtx);
  const skullDir = path.join(rootDir, "src/assets/skulls");
  const skullFiles = new Set(
    fs
      .readdirSync(skullDir)
      .filter((f) => f.endsWith(".jpg"))
      .map((f) => f.replace(".jpg", "")),
  );

  for (const [id, meta] of Object.entries(sCtx.SKULL_METADATA)) {
    if (id !== "root" && !ids.has(id)) errors.push(`skulls metadata: "${id}" does not match any species`);
    for (const k of ["author", "license", "source"]) if (!meta[k]) errors.push(`skulls "${id}": missing ${k}`);
    if (!skullFiles.has(id)) errors.push(`skulls "${id}": missing image file src/assets/skulls/${id}.jpg`);
  }
} catch (err) {
  errors.push(`skulls validation failed: ${err.message}`);
}

// Reconstructions metadata & asset files
try {
  const reconPath = path.join(rootDir, "src/data/reconstructions.on.js");
  const reconJs = fs
    .readFileSync(reconPath, "utf8")
    .replace(/const images =[\s\S]*?imageMap =[^;]+;/, "const imageMap = {};")
    .replace(/export const/g, "const");
  const rCtx = {};
  vm.runInNewContext(reconJs + "\n;Object.assign(this, { RECON_METADATA });", rCtx);
  const reconDir = path.join(rootDir, "src/assets/reconstructions");
  const reconFiles = new Set(
    fs
      .readdirSync(reconDir)
      .filter((f) => f.endsWith(".jpg"))
      .map((f) => f.replace(".jpg", "")),
  );

  for (const [id, meta] of Object.entries(rCtx.RECON_METADATA)) {
    if (id !== "root" && !ids.has(id)) errors.push(`reconstructions metadata: "${id}" does not match any species`);
    for (const k of ["title", "author", "license", "source"]) if (!meta[k]) errors.push(`reconstructions "${id}": missing ${k}`);
    if (!reconFiles.has(id)) errors.push(`reconstructions "${id}": missing image file src/assets/reconstructions/${id}.jpg`);
  }
} catch (err) {
  errors.push(`reconstructions validation failed: ${err.message}`);
}

warnings.forEach((w) => console.warn("warning:", w));
if (errors.length) {
  errors.forEach((e) => console.error("ERROR:", e));
  process.exit(1);
}
const urls = new Set(Object.values(SOURCES).flat().map((e) => e[1]));
console.log(`Data OK: ${SPECIES.length} species, ${urls.size} unique source links, all pronunciations, skulls & reconstructions verified.`);
