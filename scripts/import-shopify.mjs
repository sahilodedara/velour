// Parse a Shopify product CSV → VELOUR product + brand data files.
// Usage: node scripts/import-shopify.mjs <csv-path> [maxProducts]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const CSV = process.argv[2] || "/tmp/fashion.csv";
const MAX = Number(process.argv[3] || 120);

/* ---------- robust CSV parse (handles quotes, commas, newlines) ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", i = 0, q = false;
  while (i < text.length) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
    i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const raw = readFileSync(CSV, "utf8");
const rows = parseCSV(raw);
const header = rows[0];
const idx = (name) => header.indexOf(name);
const H = {
  handle: idx("Handle"), title: idx("Title"), body: idx("Body (HTML)"), vendor: idx("Vendor"),
  type: idx("Type"), tags: idx("Tags"), o1n: idx("Option1 Name"), o1v: idx("Option1 Value"),
  o2n: idx("Option2 Name"), o2v: idx("Option2 Value"), o3n: idx("Option3 Name"), o3v: idx("Option3 Value"),
  sku: idx("Variant SKU"), qty: idx("Variant Inventory Qty"), price: idx("Variant Price"),
  compare: idx("Variant Compare At Price"), img: idx("Image Src"),
};

const stripHtml = (s) => (s || "")
  .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
const slugify = (s) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/* group rows by handle */
const groups = new Map();
for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const h = row[H.handle];
  if (!h) continue;
  if (!groups.has(h)) groups.set(h, []);
  groups.get(h).push(row);
}

const CAT_PALETTE = {
  bags: ["#1c1b18", "#7a6a44"], clothing: ["#23211d", "#6a5a3a"], shoes: ["#1a1714", "#5a4a35"],
  perfumes: ["#2a1620", "#7a3b54"], watches: ["#10131f", "#2f3c66"], jewelry: ["#241d12", "#9a7b3f"],
  accessories: ["#1d1d20", "#5f6168"],
};
function categoryOf(text) {
  const t = text.toLowerCase();
  if (/\b(bag|handbag|tote|clutch|backpack|purse|satchel)\b/.test(t)) return "bags";
  if (/\b(shoe|heel|boot|sneaker|sandal|flat|loafer|pump)\b/.test(t)) return "shoes";
  if (/\bwatch\b/.test(t)) return "watches";
  if (/\b(ring|necklace|earring|bracelet|jewel|pendant)\b/.test(t)) return "jewelry";
  if (/\b(perfume|fragrance|cologne|parfum)\b/.test(t)) return "perfumes";
  if (/\b(belt|sunglass|scarf|hat|glove|wallet|tie)\b/.test(t)) return "accessories";
  return "clothing";
}
const COLOR_HEX = {
  black: "#15140f", white: "#f4f1ea", ivory: "#efe9dd", cream: "#e8dfc9", navy: "#1f2535", blue: "#2f3c66",
  red: "#8a2b2b", burgundy: "#5a1f2a", green: "#3c5a45", olive: "#5a5a35", grey: "#6f7178", gray: "#6f7178",
  charcoal: "#2f2f31", brown: "#5a4a35", tan: "#b08d57", camel: "#b08d57", beige: "#cdbfa6", pink: "#caa79b",
  blush: "#caa79b", purple: "#4a2a5a", yellow: "#c8a464", gold: "#c8a464", silver: "#c4c7cd", orange: "#b5652a",
  teal: "#2a6a6a", coral: "#c86a5a", mint: "#9fc4b0", mustard: "#b58a2a", rust: "#8a4a2a", nude: "#d8c4ac",
};
const colorHex = (name) => {
  const k = name.toLowerCase();
  for (const key in COLOR_HEX) if (k.includes(key)) return COLOR_HEX[key];
  return "#8a857c";
};

function seeded(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

const products = [];
const vendors = new Map();

for (const [handle, rs] of groups) {
  const head = rs.find((r) => r[H.title]) || rs[0];
  const title = (head[H.title] || "").trim();
  if (!title) continue;

  // price: first non-empty variant price
  let price = 0, compare = 0;
  for (const r of rs) { const p = parseFloat(r[H.price]); if (p && !price) price = p; const c = parseFloat(r[H.compare]); if (c && !compare) compare = c; }
  if (!price) continue;

  // images: cdn.shopify.com only (guaranteed to load), dedup, cap 5
  const images = [];
  for (const r of rs) { const u = (r[H.img] || "").trim(); if (u && u.includes("cdn.shopify.com") && !images.includes(u)) images.push(u); }
  if (!images.length) continue;
  images.length = Math.min(images.length, 5);

  // options → sizes / colors
  const sizes = new Set(), colors = new Map();
  for (const r of rs) {
    for (const [n, v] of [[r[H.o1n], r[H.o1v]], [r[H.o2n], r[H.o2v]], [r[H.o3n], r[H.o3v]]]) {
      if (!n || !v) continue;
      const nn = n.toLowerCase();
      if (nn.includes("size")) sizes.add(v.trim());
      else if (nn.includes("color") || nn.includes("colour")) colors.set(v.trim(), colorHex(v.trim()));
    }
  }

  const vendor = (head[H.vendor] || "Atelier").trim() || "Atelier";
  const vslug = slugify(vendor) || "atelier";
  if (!vendors.has(vslug)) vendors.set(vslug, vendor);

  const tagsStr = head[H.tags] || "";
  const category = categoryOf(`${title} ${head[H.type] || ""} ${tagsStr}`);
  const desc = stripHtml(head[H.body]) || title;
  const short = desc.length > 150 ? desc.slice(0, 147).replace(/\s+\S*$/, "") + "…" : desc;
  const rnd = seeded(handle);

  products.push({
    id: `imp-${handle}`.slice(0, 60),
    slug: slugify(handle) || slugify(title),
    name: title,
    brand: vslug,
    category,
    sku: (rs.find((r) => r[H.sku])?.[H.sku] || `IMP-${slugify(handle)}`).slice(0, 40),
    price: Math.round(price),
    originalPrice: compare > price ? Math.round(compare) : undefined,
    shortDescription: short,
    description: desc.slice(0, 900),
    colors: colors.size ? [...colors].map(([name, hex]) => ({ name, hex })) : [{ name: "Default", hex: "#15140f" }],
    sizes: sizes.size ? [...sizes] : undefined,
    material: "—",
    stock: Math.max(1, parseInt(rs.find((r) => r[H.qty])?.[H.qty]) || 12),
    rating: Number((4.4 + rnd * 0.6).toFixed(1)),
    reviewCount: Math.floor(rnd * 180) + 8,
    tags: tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6) : [],
    featured: false, trending: rnd > 0.8, bestSeller: rnd > 0.72, newArrival: rnd > 0.6,
    palette: CAT_PALETTE[category],
    specs: [{ label: "Vendor", value: vendor }, ...(head[H.type] ? [{ label: "Type", value: head[H.type] }] : [])],
    images,
    custom: false,
  });
  if (products.length >= MAX) break;
}

const brandsArr = [...vendors].map(([slug, name]) => ({
  slug, name, monogram: (name[0] || "V").toUpperCase(),
  description: `An imported collection featured on VELOUR — ${name}.`,
}));

mkdirSync("src/data", { recursive: true });
const ts = `// AUTO-GENERATED from a Shopify sample CSV. Do not edit by hand.
import type { Brand, Product } from "./types";

export const importedBrands: Brand[] = ${JSON.stringify(brandsArr, null, 2)};

export const importedProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;
writeFileSync("src/data/imported.ts", ts);

console.log(`products: ${products.length}`);
console.log(`brands: ${brandsArr.length} →`, brandsArr.map((b) => b.name).slice(0, 10).join(", "));
const byCat = {};
products.forEach((p) => (byCat[p.category] = (byCat[p.category] || 0) + 1));
console.log("by category:", byCat);
console.log("sample:", JSON.stringify({ name: products[0].name, brand: products[0].brand, price: products[0].price, cat: products[0].category, imgs: products[0].images.length, sizes: products[0].sizes }, null, 0));
