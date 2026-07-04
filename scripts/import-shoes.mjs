// Build src/data/shoes.ts from images in public/collection/shoes/.
// FOR NON-COMMERCIAL / COLLEGE DEMO USE. Original names, no brand labels.
import { readdirSync, writeFileSync } from "node:fs";

const files = readdirSync("public/collection/shoes")
  .filter((f) => /^shoe-\d+\.jpg$/i.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

const TYPES = ["Runner", "Derby", "Loafer", "Chelsea Boot", "Low Sneaker", "Oxford", "Monk Strap", "Trainer", "High-Top", "Brogue", "Slip-On", "Chukka Boot"];
const MATS = ["Calf suede", "Box calf leather", "Waxed suede", "Nappa leather", "Grained calfskin", "Nubuck"];
const MAT_WORD = ["Suede", "Calfskin", "Waxed", "Nappa", "Grained", "Nubuck"];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

const products = files.map((file, i) => {
  const type = TYPES[i % TYPES.length];
  const m = i % MATS.length;
  const name = `${MAT_WORD[m]} ${type}`;
  const rnd = seeded(file);
  const price = Math.round((180 + rnd * 520) / 10) * 10;
  return {
    id: `shoe-${i + 1}`,
    slug: `belmonte-${slugify(type)}-${i + 1}`,
    name,
    brand: "belmonte",
    category: "shoes",
    sku: `SHO-${String(i + 1).padStart(3, "0")}`,
    price,
    originalPrice: rnd > 0.7 ? Math.round((price * 1.25) / 10) * 10 : undefined,
    shortDescription: `A ${type.toLowerCase()} in ${MATS[m].toLowerCase()}, handmade in a small atelier.`,
    description: `The ${name} — a ${type.toLowerCase()} crafted from ${MATS[m].toLowerCase()} and set on a leather sole. Made to be worn for years.`,
    colors: [{ name: "As shown", hex: "#3a2a1d" }],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    material: MATS[m],
    stock: Math.floor(rnd * 12) + 3,
    rating: Number((4.4 + rnd * 0.6).toFixed(1)),
    reviewCount: Math.floor(rnd * 140) + 10,
    tags: ["shoe", "handmade"],
    featured: i < 3,
    trending: rnd > 0.75,
    bestSeller: rnd > 0.65,
    newArrival: rnd > 0.5,
    palette: ["#1a1714", "#5a4a35"],
    specs: [{ label: "Upper", value: MATS[m] }, { label: "Sole", value: "Leather" }, { label: "Made in", value: "Italy" }],
    images: [`/collection/shoes/${file}`],
    custom: false,
  };
});

writeFileSync("src/data/shoes.ts", `// AUTO-GENERATED shoe collection (non-commercial demo, images provided locally).
import type { Product } from "./types";

export const shoeProducts: Product[] = ${JSON.stringify(products, null, 2)};
`);

console.log(`shoe products: ${products.length}`);
