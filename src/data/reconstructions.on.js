// Properly attributed CC0 and CC BY / CC BY-SA licensed life & facial reconstruction images from Wikimedia Commons.
// Bundled locally via Vite import.meta.glob for zero-network, high performance loading.

const images = import.meta.glob("../assets/reconstructions/*.jpg", { eager: true, import: "default" });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([p, url]) => [p.split("/").pop().replace(/\.jpg$/, ""), url]),
);

export const RECON_METADATA = {
  "sahelanthropus": {
    "title": "Sahelanthropus tchadensis life reconstruction",
    "author": "Sisyphos23 (based on Mateus Zica)",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:SahelanthropusCL.png"
  },
  "orrorin": {
    "title": "Orrorin tugenensis skull & skeleton exhibit (Natural History Museum, London)",
    "author": "Emőke Dénes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Em_-_Hominidae_sp._-_6.jpg"
  },
  "ramidus": {
    "title": "Ardipithecus ramidus (Ardi) anatomical reconstruction",
    "author": "Keith Chan",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ardi_and_Lucy_Reconstruction_Comparison.png"
  },
  "anamensis": {
    "title": "Australopithecus anamensis jaws and postcrania exhibit (Royal Belgian Institute of Natural Sciences)",
    "author": "Ghedoghedo",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Australopithecus_anamensis_5476.JPG"
  },
  "afarensis": {
    "title": "Lucy (Australopithecus afarensis) forensic facial approximation",
    "author": "Cicero Moraes",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Lucy_-_Australopithecus_afarensis_-_forensic_facial_approximation.jpg"
  },
  "prometheus": {
    "title": "Australopithecus from Sterkfontein (Little Foot) life reconstruction",
    "author": "Pflege24",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Homme_de_Sterkfontein.jpg"
  },
  "bahrelghazali": {
    "title": "Abel australopithecus",
    "author": "Clumsystiggy",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AAbel%20australopithecus.png"
  },
  "kenyanthropus": {
    "title": "Kenyanthropus platyops museum exhibit (Nairobi National Museum)",
    "author": "Mike Peel",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:At_Nairobi_National_Museum_2025_083.jpg"
  },
  "africanus": {
    "title": "Australopithecus africanus adult facial reconstruction (Museo della preistoria Luigi Donini)",
    "author": "Elena Tartaglione",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Museo_della_preistoria_di_San_Lazzaro_02.jpg"
  },
  "sediba": {
    "title": "Australopithecus sediba (Fundort Malapa)",
    "author": "Neanderthal-Museum, Mettmann",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AAustralopithecus%20sediba%20(Fundort%20Malapa).jpg"
  },
  "garhi": {
    "title": "Australopithecus garhi fossils (National Museum of Ethiopia)",
    "author": "Sailko",
    "license": "CC BY 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Resti_di_australopithecus_garhi,_da_bouri_in_afar,_2,5_milioni_di_anni_fa.jpg"
  },
  "aethiopicus": {
    "title": "Paranthropus aethiopicus model (Natural History Museum, London)",
    "author": "Nrkpan",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Paranthropus_aethiopicus.JPG"
  },
  "boisei": {
    "title": "Paranthropus boisei - forensic facial reconstruction",
    "author": "Draw made by Cicero Moraes and 3D scanning of the skull by Dr. Moacir Elias Santos.",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AParanthropus%20boisei%20-%20forensic%20facial%20reconstruction.png"
  },
  "robustus": {
    "title": "Paranthropus robustus female",
    "author": "Nikhil Iyengar",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AParanthropus%20robustus%20female.jpg"
  },
  "capensis": {
    "title": "Paranthropus facial reconstruction (Museo della preistoria Luigi Donini)",
    "author": "Elena Tartaglione",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Museo_della_preistoria_di_San_Lazzaro_02.jpg"
  },
  "habilis": {
    "title": "Homo habilis - forensic facial reconstruction",
    "author": "Cicero Moraes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20habilis%20-%20forensic%20facial%20reconstruction.png"
  },
  "rudolfensis": {
    "title": "Homo rudolfensis with skull",
    "author": "Mauricio Antón",
    "license": "CC BY 3.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20rudolfensis%20with%20skull.jpg"
  },
  "ergaster": {
    "title": "Homo-erectus Turkana-Boy (Ausschnitt) Fundort Nariokotome, Kenia, Rekonstruktion im Neanderthal Museum (cropped)",
    "author": "Neanderthal Museum",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo-erectus%20Turkana-Boy%20(Ausschnitt)%20Fundort%20Nariokotome%2C%20Kenia%2C%20Rekonstruktion%20im%20Neanderthal%20Museum%20(cropped).jpg"
  },
  "erectus": {
    "title": "Homo erectus pekinensis, forensic facial reconstruction",
    "author": "Cicero Moraes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20erectus%20pekinensis%2C%20forensic%20facial%20reconstruction.png"
  },
  "antecessor": {
    "title": "Homo antecessor child facial reconstruction model (Natural History Museum, London)",
    "author": "Emőke Dénes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Em_-_Homo_antecessor_child_model_-_2_(cropped).jpg"
  },
  "heidelbergensis": {
    "title": "Homo heidelbergensis - forensic facial reconstruction",
    "author": "Cicero Moraes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20heidelbergensis%20-%20forensic%20facial%20reconstruction.png"
  },
  "rhodesiensis": {
    "title": "Homo rhodesiensis forensic facial reconstruction bust",
    "author": "Andrey Laskov (LxAndrew)",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D1%8F%D1%80%D1%81%D0%BA%D0%B8%D0%B9_%D0%BA%D1%80%D0%B0%D0%B5%D0%B2%D0%B5%D0%B4%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%BC%D1%83%D0%B7%D0%B5%D0%B9_(02).JPG"
  },
  "neanderthalensis": {
    "title": "Neanderthal man reconstruction, Natural History Museum, London",
    "author": "Werner Ustorf",
    "license": "CC BY-SA 2.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ANeanderthal%20man%20reconstruction%2C%20Natural%20History%20Museum%2C%20London.jpg"
  },
  "nesherramla": {
    "title": "Nesher Ramla Homo 3D virtual skull reconstruction",
    "author": "Dr. Yossi Zaidner",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Video_showing_the_reconstructed_location_of_Nesher_Ramla_1_on_a_skull.webm"
  },
  "longi": {
    "title": "Homo longi - forensic facial approximation",
    "author": "Cicero Moraes",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20longi%20-%20forensic%20facial%20approximation.jpg"
  },
  "naledi": {
    "title": "Homo naledi forensic facial reconstruction",
    "author": "Cicero Moraes (Arc-Team) et al.",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Homo_naledi_facial_reconstruction.jpg"
  },
  "floresiensis": {
    "title": "Homo floresiensis - facial approximation - color 2",
    "author": "Cicero Moraes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20floresiensis%20-%20facial%20approximation%20-%20color%202.jpg"
  },
  "luzonensis": {
    "title": "HomoLuzonensisRestoration",
    "author": "Luzonensis",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomoLuzonensisRestoration.jpg"
  },
  "sapiens": {
    "title": "Homo sapiens sapiens (Fundort Jebel Irhoud Marokko)",
    "author": "Neanderthal-Museum, Mettmann",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20sapiens%20sapiens%20(Fundort%20Jebel%20Irhoud%20Marokko).jpg"
  },
  "pan": {
    "title": "Chimp portrait (5312048385)",
    "author": "Becker1999 from Grove City, OH",
    "license": "CC BY 2.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AChimp%20portrait%20(5312048385).jpg"
  }
};

export const reconFor = (id) => {
  const meta = RECON_METADATA[id];
  const url = imageMap[id];
  if (!url || !meta) return null;
  return {
    ...meta,
    url,
  };
};
