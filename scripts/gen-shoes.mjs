// Generates src/data/shoes.ts as Belmonte house-ARTWORK shoes (no photos, no logos).
// Public-safe: ProductArtwork renders an SVG from `palette` + brand monogram when a
// product has no `images`. Prices $280–$380. Run: node scripts/gen-shoes.mjs
import { writeFileSync } from "node:fs";

// [name, subcategory, price(280–380), flags, palette]
const MODELS = [
  ["Aldous Suede Runner", "sneakers", 320, "featured best", ["#1a1512", "#6a4a2e"]],
  ["Bramley Leather Derby", "dress", 360, "featured", ["#141210", "#4a3a2a"]],
  ["Calloway Penny Loafer", "loafers", 335, "best", ["#1c1410", "#7a5230"]],
  ["Dorset Chelsea Boot", "boots", 380, "trend", ["#131110", "#3a2c22"]],
  ["Emerson Low Court Sneaker", "sneakers", 300, "new", ["#16140f", "#5a5040"]],
  ["Fairfax Cap-Toe Oxford", "dress", 370, "featured", ["#121010", "#403026"]],
  ["Grantham Monk Strap", "dress", 355, "best", ["#1a1310", "#6a3f28"]],
  ["Hensley Court Trainer", "sneakers", 295, "trend", ["#15130f", "#54463a"]],
  ["Ivory Suede Chukka", "boots", 340, "new", ["#1b140f", "#7a5636"]],
  ["Jephson Wingtip Brogue", "dress", 365, "best", ["#131110", "#463424"]],
  ["Kingsford Slip-On Mocassin", "loafers", 285, "new", ["#181410", "#6e4e30"]],
  ["Lockwood Desert Boot", "boots", 330, "trend", ["#1a150f", "#8a6238"]],
  ["Marden Retro Runner", "sneakers", 315, "best", ["#14130f", "#5c4c3a"]],
  ["Northcote Venetian Loafer", "loafers", 345, "featured", ["#1c1510", "#734a2c"]],
  ["Oakley Plain-Toe Blucher", "dress", 350, "trend", ["#121010", "#3c2e22"]],
  ["Prentice Hi-Top Sneaker", "sneakers", 325, "new", ["#15140f", "#504334"]],
  ["Quill Jodhpur Boot", "boots", 375, "featured", ["#131110", "#42301f"]],
  ["Rowley Tassel Loafer", "loafers", 340, "best", ["#1a1410", "#6a4526"]],
  ["Selby Knit Runner", "sneakers", 305, "trend", ["#16150f", "#585044"]],
  ["Tarleton Longwing Derby", "dress", 360, "new", ["#131110", "#4a382a"]],
  ["Underwood Suede Sneaker", "sneakers", 310, "best", ["#181410", "#7a583a"]],
  ["Vandeleur Chukka Noir", "boots", 350, "featured", ["#101010", "#333029"]],
  ["Wexford Horsebit Loafer", "loafers", 355, "trend", ["#1c1510", "#7a4e2c"]],
  ["Yardley City Trainer", "sneakers", 300, "new", ["#15130f", "#4e463c"]],
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

const MAT = "Full-grain calf leather";
const products = MODELS.map(([name, subcategory, price, flags, palette], i) => {
  const rnd = seeded(name);
  return {
    id: `shoe-${i + 1}`, slug: slugify(name), name,
    brand: "belmonte", category: "shoes", subcategory, sku: `BLM-${String(i + 1).padStart(3, "0")}`,
    price,
    shortDescription: `${name} — handmade in ${MAT.toLowerCase()}, on a leather sole.`,
    description: `${name} is built the old way: ${MAT.toLowerCase()}, hand-lasted, and finished on a leather sole. Made to be resoled and worn for years.`,
    colors: [{ name: "Espresso", hex: "#3a2a1d" }, { name: "Black", hex: "#15140f" }, { name: "Tan", hex: "#8a5a2b" }],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    material: MAT, stock: Math.floor(rnd * 12) + 4,
    rating: Number((4.5 + rnd * 0.5).toFixed(1)), reviewCount: Math.floor(rnd * 130) + 14,
    tags: ["shoe", "handmade", "belmonte"],
    featured: flags.includes("featured"), trending: flags.includes("trend"),
    bestSeller: flags.includes("best"), newArrival: flags.includes("new"),
    palette,
    specs: [{ label: "Upper", value: MAT }, { label: "Construction", value: "Blake stitched" }, { label: "Sole", value: "Leather" }, { label: "Made in", value: "Italy" }],
    custom: false,
  };
});

writeFileSync("src/data/shoes.ts", `// AUTO-GENERATED Belmonte shoe collection — house artwork only (no external media).
// Regenerate: node scripts/gen-shoes.mjs
import type { Product } from "./types";

export const shoeProducts: Product[] = ${JSON.stringify(products, null, 2)};
`);

console.log(`generated ${products.length} artwork shoes, prices ${Math.min(...products.map((p) => p.price))}–${Math.max(...products.map((p) => p.price))}`);
