// Build src/data/collection.ts from the extracted bag images + Watches.csv sample.
// FOR NON-COMMERCIAL / COLLEGE DEMO USE.
import { readFileSync, writeFileSync } from "node:fs";

/* ---------- bag products (from public/collection images) ---------- */
const BAGS = {
  bottega_veneta_mini_jodie: { name: "Mini Jodie", brand: "Bottega Veneta", price: 2900, cat: "bags" },
  chanel_255: { name: "2.55 Flap Bag", brand: "Chanel", price: 8800, cat: "bags" },
  fendi_baguette: { name: "Baguette", brand: "Fendi", price: 3400, cat: "bags" },
  gucci_jackie_hobo: { name: "Jackie 1961", brand: "Gucci", price: 3200, cat: "bags" },
  lady_dior: { name: "Lady Dior", brand: "Dior", price: 6000, cat: "bags" },
  prado_cleo: { name: "Cleo", brand: "Prada", price: 3500, cat: "bags" },
};

const baglist = readFileSync(".importtmp/baglist.txt", "utf8").trim().split("\n");
const byFolder = {};
for (const line of baglist) {
  const [folder, file] = line.split("/");
  (byFolder[folder] ||= []).push(`/collection/${file}`);
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const products = [];
const brands = new Map();

for (const folder in BAGS) {
  const cfg = BAGS[folder];
  const images = byFolder[folder];
  if (!images || !images.length) continue;
  const bslug = slugify(cfg.brand);
  brands.set(bslug, cfg.brand);
  products.push({
    id: `col-${folder}`, slug: slugify(`${cfg.brand}-${cfg.name}`), name: cfg.name,
    brand: bslug, category: cfg.cat, sku: `COL-${folder.slice(0, 8).toUpperCase()}`,
    price: cfg.price, shortDescription: `The ${cfg.brand} ${cfg.name} — an icon of modern luxury.`,
    description: `The ${cfg.brand} ${cfg.name}, presented here for demonstration. A defining silhouette in fine leather, finished with signature hardware.`,
    colors: [{ name: "As shown", hex: "#15140f" }], material: "Fine leather",
    stock: 5, rating: 4.9, reviewCount: 120,
    tags: ["icon", "bag"], featured: true, bestSeller: true, newArrival: false, trending: true,
    palette: ["#1c1b18", "#7a6a44"], specs: [{ label: "House", value: cfg.brand }, { label: "Line", value: cfg.name }],
    images, custom: false,
  });
}

/* ---------- watch products (from Watches.csv sample) ---------- */
function parseCSV(text, maxRows) {
  const rows = []; let row = [], field = "", i = 0, q = false;
  while (i < text.length && rows.length < maxRows) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c; }
    else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c !== "\r") field += c;
    }
    i++;
  }
  return rows;
}
const wtext = readFileSync(".importtmp/Watches.csv", "utf8").slice(0, 4_000_000);
const wrows = parseCSV(wtext, 6000);
const wh = wrows[0];
const wi = (n) => wh.indexOf(n);
const C = { name: wi("name"), price: wi("price"), brand: wi("brand"), model: wi("model"), ref: wi("ref"), mvmt: wi("mvmt"), casem: wi("casem"), size: wi("size"), yop: wi("yop") };

const WATCH_PALETTE = ["#10131f", "#2f3c66"];
const seenW = new Set();
let wcount = 0;
for (let r = 1; r < wrows.length && wcount < 36; r++) {
  const row = wrows[r];
  const brand = (row[C.brand] || "").trim();
  const model = (row[C.model] || "").trim();
  const priceRaw = (row[C.price] || "").replace(/[$,\s]/g, "");
  const price = parseInt(priceRaw);
  if (!brand || !price || price < 400 || price > 300000) continue;
  const key = `${brand}|${model}`;
  if (seenW.has(key)) continue; seenW.add(key);
  const bslug = slugify(brand);
  brands.set(bslug, brand);
  const name = `${brand} ${model}`.trim().slice(0, 70);
  const specs = [];
  if (row[C.mvmt]) specs.push({ label: "Movement", value: row[C.mvmt].trim() });
  if (row[C.casem]) specs.push({ label: "Case", value: row[C.casem].trim() });
  if (row[C.size]) specs.push({ label: "Size", value: row[C.size].trim() });
  if (row[C.ref]) specs.push({ label: "Reference", value: row[C.ref].trim() });
  if (row[C.yop] && /\d{4}/.test(row[C.yop])) specs.push({ label: "Year", value: row[C.yop].trim() });
  products.push({
    id: `colw-${r}`, slug: slugify(name) + "-" + r, name, brand: bslug, category: "watches",
    sku: `COLW-${r}`, price, shortDescription: `${name} — a coveted timepiece, shown for demonstration.`,
    description: `${name}. ${specs.map((s) => `${s.label}: ${s.value}`).join(" · ")}.`,
    colors: [{ name: "Steel", hex: "#c4c7cd" }], material: (row[C.casem] || "Stainless steel").trim(),
    stock: 3, rating: 4.8, reviewCount: 30 + (r % 90),
    tags: ["watch", "timepiece"], featured: wcount < 3, bestSeller: wcount % 3 === 0, newArrival: wcount % 4 === 0, trending: wcount % 2 === 0,
    palette: WATCH_PALETTE, specs, custom: false,
  });
  wcount++;
}

const brandsArr = [...brands].map(([slug, name]) => ({
  slug, name, monogram: (name[0] || "V").toUpperCase(), description: `Featured on VELOUR — ${name}.`,
}));

writeFileSync("src/data/collection.ts", `// AUTO-GENERATED for a non-commercial college demo (brand datasets provided locally).
import type { Brand, Product } from "./types";

export const collectionBrands: Brand[] = ${JSON.stringify(brandsArr, null, 2)};

export const collectionProducts: Product[] = ${JSON.stringify(products, null, 2)};
`);

console.log(`bags: ${Object.keys(byFolder).length}, watches: ${wcount}, total products: ${products.length}, brands: ${brandsArr.length}`);
console.log("bag brands:", [...brands].slice(0, 8).map(([, n]) => n).join(", "));
