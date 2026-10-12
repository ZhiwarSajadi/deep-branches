import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import license from "rollup-plugin-license";
import { SITE } from "./src/site.js";
import { SPECIES, CLADES } from "./src/data/species.js";
import { SHOW_SKULL_ILLUSTRATIONS } from "./src/config.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

// Some packages ship without a LICENSE file; keep the official text here (scripts/license-fallbacks/).
const fallbackLicense = (name) => {
  try {
    return fs.readFileSync(`scripts/license-fallbacks/${name.replace("/", "__")}.txt`, "utf8");
  } catch {
    return "";
  }
};

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmt = (s) => {
  const f = (t) => (t === 0 ? "present" : t < 1 ? `${Math.round(t * 1e3)} ka` : `${t} Ma`);
  return s.end === 0 ? `${f(s.start)} to present` : `${f(s.start)} to ${f(s.end)}`;
};

/** Fills the placeholders in index.html (title, social tags, no-JS species list, JSON-LD). */
function htmlPlugin() {
  return {
    name: "deep-branches-html",
    transformIndexHtml(html) {
      const url = SITE.siteUrl ? SITE.siteUrl.replace(/\/?$/, "/") : "";
      const urlTags = url
        ? [
            `<link rel="canonical" href="${esc(url)}" />`,
            `<meta property="og:url" content="${esc(url)}" />`,
            `<meta property="og:image" content="${esc(url)}og-image.png" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta property="og:image:alt" content="A 3D view of the hominin family tree, with coloured branches rising through layers of sediment." />`,
            `<meta name="twitter:image" content="${esc(url)}og-image.png" />`,
          ].join("\n    ")
        : "<!-- Set SITE.siteUrl in src/site.js to add canonical + social-preview image tags -->";

      const list =
        "<ol>" +
        SPECIES.slice()
          .sort((a, b) => b.start - a.start)
          .map(
            (s) =>
              `<li><strong><i>${esc(s.genus)} ${esc(s.sp)}</i></strong> (${esc(CLADES[s.clade].label)}, ${esc(fmt(s))}, ${esc(s.place)}): ${esc(s.note)}` +
              (s.src && s.src.length > 0
                ? ` [Sources: ${s.src.map(([label, href]) => `<a href="${esc(href)}">${esc(label)}</a>`).join(", ")}]`
                : "") +
              `</li>`,
          )
          .join("") +
        "</ol>";

      const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: SITE.title,
        description: SITE.description,
        inLanguage: "en",
        isAccessibleForFree: true,
        learningResourceType: "interactive visualisation",
        educationalLevel: "general audience",
        license: "https://creativecommons.org/licenses/by/4.0/",
        ...(url ? { url } : {}),
      }).replace(/</g, "\\u003c");

      return html
        .replaceAll("__TITLE__", esc(SITE.title))
        .replaceAll("__BRAND__", esc(SITE.brand))
        .replaceAll("__DESCRIPTION__", esc(SITE.description))
        .replace("__SEO_URL_TAGS__", urlTags)
        .replace("__JSON_LD__", jsonLd)
        .replace("__NOSCRIPT_LIST__", list);
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      // Swap the skull module at build time so the PNGs are not bundled at all when the flag is off.
      "@skulls": fileURLToPath(
        new URL(SHOW_SKULL_ILLUSTRATIONS ? "./src/data/skulls.on.js" : "./src/data/skulls.off.js", import.meta.url),
      ),
    },
  },
  base: "./", // relative URLs: works on GitHub Pages sub-paths, custom domains, and any static host
  plugins: [
    react(),
    htmlPlugin(),
    license({
      thirdParty: {
        includePrivate: false,
        output: {
          file: "dist/THIRD_PARTY_LICENSES.txt",
          template(deps) {
            const head =
              `Third-party software and fonts bundled into ${SITE.brand}\n` +
              `=======================================================\n\n` +
              `The licence notices below are generated at build time for the packages that end up in the bundle.\n\n`;
            const fonts = ["playfair-display", "fira-sans"]
              .map((f) => {
                const pkg = JSON.parse(fs.readFileSync(`node_modules/@fontsource/${f}/package.json`, "utf8"));
                const text = fs.readFileSync(`node_modules/@fontsource/${f}/LICENSE`, "utf8").trim();
                return `Font: ${pkg.name.replace("@fontsource/", "")} (via ${pkg.name} ${pkg.version})\nLicense: ${pkg.license}\n\n${text}`;
              })
              .join("\n\n-------------------------------------------------------------------------------\n\n");
            return (
              head +
              deps
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((d) => {
                  const author = d.author?.name || d.maintainers?.[0] || "";
                  return [
                    `${d.name} ${d.version}`,
                    `License: ${d.license || "see below"}`,
                    d.repository?.url ? `Repository: ${d.repository.url}` : "",
                    author ? `Author: ${author}` : "",
                    "",
                    (d.licenseText || fallbackLicense(d.name) || "(no licence text file shipped with this package; see the licence named above)").trim(),
                  ]
                    .filter((l, i) => l !== "" || i > 3)
                    .join("\n");
                })
                .join("\n\n-------------------------------------------------------------------------------\n\n") +
              "\n\n-------------------------------------------------------------------------------\n\n" +
              fonts +
              "\n"
            );
          },
        },
      },
    }),
  ],
  build: {
    target: "es2020",
    sourcemap: false, // don't publish readable source maps
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/@react-three")) return "r3f";
        },
      },
    },
  },
});
