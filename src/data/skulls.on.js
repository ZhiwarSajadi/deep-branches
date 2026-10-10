// Properly attributed CC0 and CC BY / CC BY-SA licensed specimen photographs from Wikimedia Commons.
// Bundled locally via Vite import.meta.glob for zero-network, high performance loading.

const images = import.meta.glob("../assets/skulls/*.jpg", { eager: true, import: "default" });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([p, url]) => [p.split("/").pop().replace(/\.jpg$/, ""), url]),
);

export const SKULL_METADATA = {
  sahelanthropus: {
    specimen: "TM 266-01-060-1 (Toumaï)",
    author: "Didier Descouens",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg",
  },
  orrorin: {
    specimen: "BAR 1000'00 femur",
    author: "Jonathan Chen",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Orrorin_NMNH.jpg",
  },
  kadabba: {
    specimen: "AME-VP-1/1 mandible & teeth",
    author: "Chartep",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Ardipithecus_kadabba_specimens.jpg",
  },
  ramidus: {
    specimen: "ARA-VP-6/500 (Ardi)",
    author: "Rama",
    license: "CC BY-SA 3.0 fr",
    source: "https://commons.wikimedia.org/wiki/File:Ardipithecus_Ramidus-MGL_96730-P5030040-black.jpg",
  },
  anamensis: {
    specimen: "MRD-VP-1/1 cranium",
    author: "Dale Omori",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Australopithecus_anamensis_skull.png",
  },
  afarensis: {
    specimen: "AL 444-2 cranium cast",
    author: "Rama",
    license: "CC BY-SA 3.0 fr",
    source: "https://commons.wikimedia.org/wiki/File:Australopithecus_afarensis-MGL_95215-P5030041-black.jpg",
  },
  prometheus: {
    specimen: "StW 573 (Little Foot)",
    author: "Tobias Fluegel",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Little_Foot_01.jpg",
  },
  bahrelghazali: {
    specimen: "KT 12/H1 (Abel) mandible",
    author: "Bruno Souza pesquisador",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Australopithecos_bahrelghazali.jpg",
  },
  kenyanthropus: {
    specimen: "KNM-WT 40000 cranium",
    author: "Rama",
    license: "CC BY-SA 3.0 fr",
    source: "https://commons.wikimedia.org/wiki/File:Kenyanthropus_platyops_IMG_2945-black.jpg",
  },
  deyiremeda: {
    specimen: "BRT-VP-3/1 maxilla",
    author: "A. C. Tatarinov",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Australopithecus_deyiremeda.png",
  },
  africanus: {
    specimen: "Sts 5 (Mrs. Ples) cast",
    author: "Rept0n1x",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Australopithecus_africanus_skull_cast,_World_Museum_Liverpool.JPG",
  },
  sediba: {
    specimen: "MH1 (Karabo) cranium",
    author: "Brett Eloff / Lee Berger",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Australopithecus_sediba.JPG",
  },
  garhi: {
    specimen: "BOU-VP-12/130 cranium",
    author: "Ji-Elle",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Mus%C3%A9e_national_d%27Ethiopie-Australopithecus_garhi_(2).jpg",
  },
  aethiopicus: {
    specimen: "KNM-WT 17000 (Black Skull)",
    author: "Paul Hudson",
    license: "CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Paranthropus_aethiopicus_at_the_Natural_History_Museum_cropped.jpg",
  },
  boisei: {
    specimen: "OH 5 (Zinjanthropus)",
    author: "RegentsPark",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Nutcracker_Man.jpg",
  },
  robustus: {
    specimen: "SK 48 cranium",
    author: "Ditsong Museum of Natural History",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Original_of_Paranthropus_robustus_Face.jpg",
  },
  capensis: {
    specimen: "Paranthropus cranium cast",
    author: "Gunnar Creutz",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Paranthropus_robustus_(cast)_at_G%C3%B6teborgs_Naturhistoriska_Museum_8787.jpg",
  },
  habilis: {
    specimen: "KNM-ER 1813 cranium",
    author: "José-Manuel Benito Álvarez",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Homo_habilis-KNM_ER_1813.jpg",
  },
  rudolfensis: {
    specimen: "KNM-ER 1470 cranium",
    author: "José-Manuel Benito Álvarez",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Homo_rudolfensis-KNM_ER_1470.jpg",
  },
  ergaster: {
    specimen: "KNM-ER 3733 cranium cast",
    author: "Gunnar Creutz",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Homo_ergaster_(KNM-ER_3733_cast)_at_G%C3%B6teborgs_Naturhistoriska_Museum_8592.jpg",
  },
  erectus: {
    specimen: "Trinil 2 (Java Man)",
    author: "Eduard Pop et al.",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Java_Man_holotype.jpg",
  },
  antecessor: {
    specimen: "ATD6-69 Gran Dolina child cast",
    author: "Velatrix",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Homo_antecessor_child_cast_Natural_History_Museum_London.jpg",
  },
  heidelbergensis: {
    specimen: "Atapuerca Cranium 5 (Miguelón)",
    author: "José-Manuel Benito",
    license: "CC BY-SA 2.5",
    source: "https://commons.wikimedia.org/wiki/File:Homo_heidelbergensis-Cranium_-5.jpg",
  },
  rhodesiensis: {
    specimen: "Kabwe 1 (Broken Hill) cast",
    author: "Gunnar Creutz",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Homo_heidelbergensis_(Kabwe_1_cast)_at_G%C3%B6teborgs_Naturhistoriska_Museum_8556.jpg",
  },
  neanderthalensis: {
    specimen: "AMNH Specimen",
    author: "Ryan Schwark",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Neanderthal_at_AMNH.jpg",
  },
  nesherramla: {
    specimen: "Nesher Ramla fossils",
    author: "Dr. Yossi Zaidner",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Nesher_Ramla_Homo_fossils-_a_skull_fragment_and_a_lower_jaw.jpg",
  },
  longi: {
    specimen: "Harbin cranium (Dragon Man)",
    author: "Clumsystiggy",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Harbin_cranium_profile.png",
  },
  naledi: {
    specimen: "DH1 cranium holotype",
    author: "Lee Berger research team",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Homo_naledi_holotype_specimen_(DH1).jpg",
  },
  floresiensis: {
    specimen: "LB 1 (The Hobbit)",
    author: "Rama",
    license: "CC BY-SA 3.0 fr",
    source: "https://commons.wikimedia.org/wiki/File:Homo_Florensiensis-MGL_95216-P4150647-black.jpg",
  },
  luzonensis: {
    specimen: "CCH6 teeth & bones",
    author: "Homo schollensis",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Homo_luzonensis_teeth_and_foot_bones_diagram.jpg",
  },
  sapiens: {
    specimen: "Cro-Magnon 1 cranium",
    author: "Muséum national d'histoire naturelle",
    license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Cro-Magnon-male-skull.png",
  },
  pan: {
    specimen: "Pan troglodytes skull",
    author: "Pastorius",
    license: "CC BY 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Chimpanzee_skull.jpg",
  },
};

export const skullFor = (id) => {
  const meta = SKULL_METADATA[id];
  const url = imageMap[id];
  if (!url || !meta) return null;
  return {
    ...meta,
    url,
  };
};
