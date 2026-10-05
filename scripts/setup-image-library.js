const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const library = path.join(root, "public", "urun-gorselleri");
const assets = [
  ["pop-art/kopek-mc", "products/catalog/kopek-mc.jpg"],
  ["pop-art/motorcu-kuru-kafa", "products/catalog/motorcu-kuru-kafa.jpg"],
  ["pop-art/kopek-patron", "products/catalog/kopek-patron.jpg"],
  ["pop-art/tropikal-kuru-kafa", "products/catalog/tropikal-kuru-kafa.jpg"],
  ["pop-art/ouch", "products/catalog/comic-ouch.jpg"],
  ["pop-art/dolar-kesesi", "products/catalog/dolar-kesesi.jpg"],
  ["pop-art/kopek-kafa", "products/catalog/kopek-kafa.jpg"],
  ["pop-art/kuru-kafa-papatya", "products/catalog/kuru-kafa-papatya.jpg"],
  ["takimlar/fenerbahce", "products/catalog/fenerbahce.png"],
  ["takimlar/trabzonspor", "products/catalog/trabzonspor.png"],
  ["takimlar/besiktas", "products/catalog/besiktas-logo.jpg", "products/catalog/besiktas-hover.png"],
  ["takimlar/galatasaray", "products/catalog/galatasaray.png"],
  ["kafe-restoran/dondurma", "products/catalog/eriyen-dondurma.jpg"],
  ["kafe-restoran/hamburger", "products/burger/burger-feature-1.jfif"],
  ["kafe-restoran/pizza", "products/catalog/pizza-neon.jpg"],
  ["kafe-restoran/acik", "products/texts/acik-feature-1.jfif"],
  ["kafe-restoran/kapali", "products/texts/kapali-feature-2.jfif"],
  ["astronot/cilekli", "products/catalog/cilekli-astronot.jpg"],
  ["astronot/savasci", "products/catalog/astronot-savasci.png"],
  ["astronot/ay", "products/catalog/astronot-ay.jpg"],
  ["astronot/smac", "products/catalog/smac-astronot.jpg"],
  ["gamer/gamer-el", "products/catalog/gamer-el.jpg"],
  ["gamer/oyun-kolu", "products/catalog/gamer-oyun-kolu.jpg"],
];

async function writeImage(source, destination) {
  try {
    await fs.access(destination);
  } catch {
    await sharp(path.join(root, "public", source)).rotate().jpeg({ quality: 92 }).toFile(destination);
  }
}

async function main() {
  for (const [folder, mainSource, hoverSource] of assets) {
    const destination = path.join(library, folder);
    await fs.mkdir(destination, { recursive: true });
    await writeImage(mainSource, path.join(destination, "ana.jpg"));
    await writeImage(hoverSource || mainSource, path.join(destination, "hover.jpg"));
  }
  console.log(`Görsel kütüphanesi hazır: ${library}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
