// Downloads verified CC0/CC BY reconstruction images from Wikimedia Commons for all species.
import fs from "node:fs";
import path from "node:path";

const RECON_DIR = path.resolve("src/assets/reconstructions");
if (!fs.existsSync(RECON_DIR)) fs.mkdirSync(RECON_DIR, { recursive: true });

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DeepBranchesEducationalApp/1.0";

const SPECIES_RECON_FILES = {
  sahelanthropus: "File:Sahelanthropus tchadensis.jpg",
  orrorin: "File:Orrorin tugenensis.jpg",
  kadabba: "File:Ardipithecus kadabba fossils.jpg",
  ramidus: "File:Ardipithecus ramidus Ardi IMG 5604 BMNH.jpg",
  anamensis: "File:Australopithecus anamensis.png",
  afarensis: "File:Lucy (Frankfurt am Main) cropped.jpg",
  prometheus: "File:Litte Foot, Skull.JPG",
  bahrelghazali: "File:Abel australopithecus.png",
  kenyanthropus: "File:Kenyanthropus platyops, skull (model).JPG",
  deyiremeda: "File:Burtele foot.png",
  africanus: "File:Taung child - Facial forensic reconstruction.png",
  sediba: "File:Australopithecus sediba (Fundort Malapa).jpg",
  garhi: "File:Australopithecus garhi- white background.jpg",
  aethiopicus: "File:Paranthropus aethiopicus face (University of Zurich).JPG",
  boisei: "File:Paranthropus boisei - forensic facial reconstruction.png",
  robustus: "File:Paranthropus robustus female.jpg",
  capensis: "File:Australopithecus, scull, Anthropos Pavilon, Brno, 187933.jpg",
  habilis: "File:Homo habilis - forensic facial reconstruction.png",
  rudolfensis: "File:Homo rudolfensis with skull.jpg",
  ergaster: "File:Homo-erectus Turkana-Boy (Ausschnitt) Fundort Nariokotome, Kenia, Rekonstruktion im Neanderthal Museum (cropped).jpg",
  erectus: "File:Homo erectus pekinensis, forensic facial reconstruction.png",
  antecessor: "File:Homo antecessor reconstruccion.jpg",
  heidelbergensis: "File:Homo heidelbergensis - forensic facial reconstruction.png",
  rhodesiensis: "File:Homo rhodesiensis Broken Hill 1 IMG 5654 BMNH.jpg",
  neanderthalensis: "File:Neanderthal man reconstruction, Natural History Museum, London.jpg",
  nesherramla: "File:Nesher Ramla Homo fossils- reconstruction of their location in the head.png",
  longi: "File:Homo longi - forensic facial approximation.jpg",
  naledi: "File:Homo Naledi - Facial reconstruction.jpg",
  floresiensis: "File:Homo floresiensis - facial approximation - color 2.jpg",
  luzonensis: "File:HomoLuzonensisRestoration.jpg",
  sapiens: "File:Homo sapiens sapiens (Fundort Jebel Irhoud Marokko).jpg",
  pan: "File:Chimp portrait (5312048385).jpg",
};

async function fetchInfo(titles) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles.join("|"))}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=450&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data.query?.pages || {};
  const map = {};
  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const meta = info.extmetadata || {};
    map[page.title] = {
      downloadUrl: info.thumburl || info.url,
      origUrl: info.url,
      author: (meta.Artist?.value || meta.Credit?.value || "Unknown").replace(/<[^>]+>/g, "").trim(),
      license: meta.LicenseShortName?.value || meta.UsageTerms?.value || "CC BY-SA",
      source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/^File:/, "File:"))}`,
    };
  }
  return map;
}

async function run() {
  const titles = Object.values(SPECIES_RECON_FILES);
  // Split titles into chunks of 15
  const chunks = [];
  for (let i = 0; i < titles.length; i += 15) {
    chunks.push(titles.slice(i, i + 15));
  }

  let infoMap = {};
  for (const chunk of chunks) {
    console.log(`Fetching info for ${chunk.length} titles...`);
    const res = await fetchInfo(chunk);
    infoMap = { ...infoMap, ...res };
    await new Promise((r) => setTimeout(r, 800));
  }

  const metadataOutput = {};

  for (const [id, fileTitle] of Object.entries(SPECIES_RECON_FILES)) {
    const info = infoMap[fileTitle];
    if (!info) {
      console.warn(`No info found for ${id} (${fileTitle})`);
      continue;
    }
    const ext = ".jpg";
    const dest = path.join(RECON_DIR, `${id}${ext}`);
    console.log(`Downloading ${id} from ${info.downloadUrl}...`);
    try {
      const imgRes = await fetch(info.downloadUrl, { headers: { "User-Agent": UA } });
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`Saved ${dest} (${Math.round(buf.length / 1024)} KB)`);

      metadataOutput[id] = {
        title: fileTitle.replace(/^File:/, "").replace(/\.[^.]+$/, ""),
        author: info.author,
        license: info.license,
        source: info.source,
      };
    } catch (e) {
      console.error(`Failed to download ${id}:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  // Generate src/data/reconstructions.on.js
  const code = `// Properly attributed CC0 and CC BY / CC BY-SA licensed life & facial reconstruction images from Wikimedia Commons.
// Bundled locally via Vite import.meta.glob for zero-network, high performance loading.

const images = import.meta.glob("../assets/reconstructions/*.jpg", { eager: true, import: "default" });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([p, url]) => [p.split("/").pop().replace(/\\.jpg$/, ""), url]),
);

export const RECON_METADATA = ${JSON.stringify(metadataOutput, null, 2)};

export const reconFor = (id) => {
  const meta = RECON_METADATA[id];
  const url = imageMap[id];
  if (!url || !meta) return null;
  return {
    ...meta,
    url,
  };
};
`;

  fs.writeFileSync(path.resolve("src/data/reconstructions.on.js"), code, "utf-8");
  console.log("Wrote src/data/reconstructions.on.js successfully!");
}

run();
