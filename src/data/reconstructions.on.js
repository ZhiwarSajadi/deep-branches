// Properly attributed CC0 and CC BY / CC BY-SA licensed life & facial reconstruction images from Wikimedia Commons.
// Bundled locally via Vite import.meta.glob for zero-network, high performance loading.

const images = import.meta.glob("../assets/reconstructions/*.jpg", { eager: true, import: "default" });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([p, url]) => [p.split("/").pop().replace(/\.jpg$/, ""), url]),
);

export const RECON_METADATA = {
  "sahelanthropus": {
    "title": "Sahelanthropus tchadensis",
    "author": "Ghedoghedo",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ASahelanthropus%20tchadensis.jpg"
  },
  "orrorin": {
    "title": "Orrorin tugenensis",
    "author": "it:User:Lucius",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AOrrorin%20tugenensis.jpg"
  },
  "kadabba": {
    "title": "Ardipithecus kadabba fossils",
    "author": "it:User:Lucius",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AArdipithecus%20kadabba%20fossils.jpg"
  },
  "ramidus": {
    "title": "Ardipithecus ramidus Ardi IMG 5604 BMNH",
    "author": "Bjoertvedt",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AArdipithecus%20ramidus%20Ardi%20IMG%205604%20BMNH.jpg"
  },
  "anamensis": {
    "title": "Australopithecus anamensis",
    "author": "Unknown",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File%3AAustralopithecus%20anamensis.png"
  },
  "afarensis": {
    "title": "Lucy (Frankfurt am Main) cropped",
    "author": "Chiswick Chap",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ALucy%20(Frankfurt%20am%20Main)%20cropped.jpg"
  },
  "prometheus": {
    "title": "Litte Foot, Skull",
    "author": "Wits University",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ALitte%20Foot%2C%20Skull.JPG"
  },
  "bahrelghazali": {
    "title": "Abel australopithecus",
    "author": "Clumsystiggy",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AAbel%20australopithecus.png"
  },
  "kenyanthropus": {
    "title": "Kenyanthropus platyops, skull (model)",
    "author": "ing. Pavel Švejnar",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AKenyanthropus%20platyops%2C%20skull%20(model).JPG"
  },
  "deyiremeda": {
    "title": "Burtele foot",
    "author": "John Nygren",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ABurtele%20foot.png"
  },
  "africanus": {
    "title": "Taung child - Facial forensic reconstruction",
    "author": "Cicero Moraes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ATaung%20child%20-%20Facial%20forensic%20reconstruction.png"
  },
  "sediba": {
    "title": "Australopithecus sediba (Fundort Malapa)",
    "author": "Neanderthal-Museum, Mettmann",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AAustralopithecus%20sediba%20(Fundort%20Malapa).jpg"
  },
  "garhi": {
    "title": "Australopithecus garhi- white background",
    "author": "宜蘭第一公民",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AAustralopithecus%20garhi-%20white%20background.jpg"
  },
  "aethiopicus": {
    "title": "Paranthropus aethiopicus face (University of Zurich)",
    "author": "Guérin Nicolas (messages)",
    "license": "CC BY-SA 3.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AParanthropus%20aethiopicus%20face%20(University%20of%20Zurich).JPG"
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
    "title": "Australopithecus, scull, Anthropos Pavilon, Brno, 187933",
    "author": "Zde",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AAustralopithecus%2C%20scull%2C%20Anthropos%20Pavilon%2C%20Brno%2C%20187933.jpg"
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
    "title": "Homo antecessor reconstruccion",
    "author": "Xvazquez",
    "license": "Public domain",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20antecessor%20reconstruccion.jpg"
  },
  "heidelbergensis": {
    "title": "Homo heidelbergensis - forensic facial reconstruction",
    "author": "Cicero Moraes",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20heidelbergensis%20-%20forensic%20facial%20reconstruction.png"
  },
  "rhodesiensis": {
    "title": "Homo rhodesiensis Broken Hill 1 IMG 5654 BMNH",
    "author": "Bjoertvedt",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20rhodesiensis%20Broken%20Hill%201%20IMG%205654%20BMNH.jpg"
  },
  "neanderthalensis": {
    "title": "Neanderthal man reconstruction, Natural History Museum, London",
    "author": "Werner Ustorf",
    "license": "CC BY-SA 2.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ANeanderthal%20man%20reconstruction%2C%20Natural%20History%20Museum%2C%20London.jpg"
  },
  "nesherramla": {
    "title": "Nesher Ramla Homo fossils- reconstruction of their location in the head",
    "author": "ד\"ר יוסי זיידנר  -  Yossi Zaidner",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ANesher%20Ramla%20Homo%20fossils-%20reconstruction%20of%20their%20location%20in%20the%20head.png"
  },
  "longi": {
    "title": "Homo longi - forensic facial approximation",
    "author": "Cicero Moraes",
    "license": "CC BY 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20longi%20-%20forensic%20facial%20approximation.jpg"
  },
  "naledi": {
    "title": "Homo Naledi - Facial reconstruction",
    "author": "Smigel",
    "license": "CC BY-SA 4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AHomo%20Naledi%20-%20Facial%20reconstruction.jpg"
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
