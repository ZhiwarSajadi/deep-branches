// Script to discover, download and verify CC0/CC BY reconstruction images from Wikimedia Commons
import fs from "node:fs";
import path from "node:path";

const RECON_DIR = path.resolve("src/assets/reconstructions");
if (!fs.existsSync(RECON_DIR)) fs.mkdirSync(RECON_DIR, { recursive: true });

const UA = "DeepBranchesHomininTree/1.0 (educational non-commercial 3D timeline; contact: github.com/ZhiwarSajadi)";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function api(params) {
  const qs = new URLSearchParams({ ...params, format: "json" }).toString();
  const url = `https://commons.wikimedia.org/w/api.php?${qs}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function searchFiles(query) {
  const data = await api({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "6",
    srlimit: "6",
  });
  return (data.query?.search || []).map((s) => s.title);
}

export async function getFileMetadata(fileTitle) {
  const data = await api({
    action: "query",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: "600",
  });
  const page = Object.values(data.query.pages)[0];
  if (!page || !page.imageinfo?.[0]) return null;
  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  return {
    title: fileTitle,
    url: info.thumburl || info.url,
    origUrl: info.url,
    mime: info.mime,
    width: info.width,
    height: info.height,
    author: (meta.Artist?.value || meta.Credit?.value || "Unknown").replace(/<[^>]+>/g, "").trim(),
    license: meta.LicenseShortName?.value || meta.UsageTerms?.value || "CC BY-SA",
    licenseUrl: meta.LicenseUrl?.value || "",
    source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(fileTitle.replace(/^File:/, "File:"))}`,
    description: (meta.ObjectName?.value || meta.ImageDescription?.value || "").replace(/<[^>]+>/g, "").trim().slice(0, 100),
  };
}

console.log("Ready to search and fetch.");
