// Central place for site-wide text and the few values you must fill in before launch.
// Pure JS (no browser APIs) so that vite.config.js and the scripts in /scripts can import it too.
import { SPECIES } from "./data/species.js";

// The chimpanzee line ("pan") is shown for comparison and is not a hominin.
export const HOMININ_COUNT = SPECIES.filter((s) => s.id !== "pan").length;

export const SITE = {
  brand: "Deep Branches",
  tagline: "Hominin Tree 3D: the human family tree",
  author: "Zhiwar Sajadi",
  authorUrl: "https://github.com/ZhiwarSajadi",
  get title() {
    return `${this.brand} — ${this.tagline}`;
  },
  get description() {
    return (
      `${HOMININ_COUNT} hominin lineages across more than seven million years, each with its sources. ` +
      `An interactive 3D timeline of the human family tree. Free, non-commercial and educational.`
    );
  },

  version: "1.0.1",
  lastUpdated: "2026-10-12",

  // ---- Fill these in before launch. Empty values are simply hidden. ----
  siteUrl: "https://zhiwarsajadi.github.io/deep-branches/",
  repoUrl: "https://github.com/ZhiwarSajadi/deep-branches",
  contactEmail: "", // for corrections and takedown requests
  reviewedBy: "", // optional, e.g. "Reviewed by Dr. Jane Doe, Department of Anthropology". Leave empty if not reviewed.
  skullCredit: "Photographs and life or facial reconstructions via Wikimedia Commons (public domain, CC0, CC BY 2.0/3.0/4.0, CC BY-SA 2.0/2.5/3.0/4.0 by Cicero Moraes, Didier Descouens / Muséum de Toulouse, Neanderthal Museum, Senckenberg Naturmuseum, Ryan Schwark, Tim Evanson / Smithsonian NMNH, Bjoertvedt, Nikhil Iyengar, Rama, José-Manuel Benito, Gunnar Creutz, Dale Omori, Brett Eloff, Tobias Fluegel, Jonathan Chen, Chartep, Dr. Yossi Zaidner, Rept0n1x, Bruno Souza, Ji-Elle, Paul Hudson, Pastorius, and others). See individual cards for direct Wikimedia Commons links.",
};
