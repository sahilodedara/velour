// Parse Shopify product CSV(s) → VELOUR product + brand data file.
// Usage: node scripts/import-shopify.mjs [maxTotal] <csv1> <csv2> ...
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const MAX = Number(args.find((a) => /^\d+$/.test(a)) || 180);
const FILES = args.filter((a) => a.endsWith(".csv"));
if (!FILES.length) { console.error("no csv files given"); process.exit(1); }

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

const stripHtml = (s) => (s || "")
  .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
const slugify = (s) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

const CAT_PALETTE = {
  bags: ["#1c1b18", "#7a6a44"], clothing: ["#23211d", "#6a5a3a"], shoes: ["#1a1714", "#5a4a35"],
  perfumes: ["#2a1620", "#7a3b54"], watches: ["#10131f", "#2f3c66"], jewelry: ["#241d12", "#9a7b3f"],
  accessories: ["#1d1d20", "#5f6168"],
};
function categoryOf(text) {
  const t = text.toLowerCase();
  if (/\b(ring|necklace|earring|bracelet|jewel|pendant|brooch|choker|cufflink)\b/.test(t)) return "jewelry";
  if (/\b(bag|handbag|tote|clutch|backpack|purse|satchel)\b/.test(t)) return "bags";
  if (/\b(shoe|heel|boot|sneaker|sandal|loafer|pump)\b/.test(t)) return "shoes";
  if (/\bwatch\b/.test(t)) return "watches";
  if (/\b(perfume|fragrance|cologne|parfum)\b/.test(t)) return "perfumes";
  if (/\b(belt|sunglass|scarf|hat|glove|wallet|tie)\b/.test(t)) return "accessories";
  return "clothing";
}
const COLOR_HEX = {
  black: "#15140f", white: "#f4f1ea", ivory: "#efe9dd", cream: "#e8dfc9", navy: "#1f2535", blue: "#2f3c66",
  red: "#8a2b2b", burgundy: "#5a1f2a", green: "#3c5a45", olive: "#5a5a35", grey: "#6f7178", gray: "#6f7178",
  charcoal: "#2f2f31", brown: "#5a4a35", tan: "#b08d57", camel: "#b08d57", beige: "#cdbfa6", pink: "#caa79b",
  blush: "#caa79b", purple: "#4a2a5a", yellow: "#c8a464", gold: "#c8a464", silver: "#c4c7cd", orange: "#b5652a",
};
const colorHex = (name) => { const k = name.toLowerCase(); for (const key in COLOR_HEX) if (k.includes(key)) return COLOR_HEX[key]; return "#8a857c"; };

function processFile(path) {
  const rows = parseCSV(readFileSync(path, "utf8"));
  const header = rows[0];
  const idx = (n) => header.indexOf(n);
  const H = {
    handle: idx("Handle"), title: idx("Title"), body: idx("Body (HTML)"), vendor: idx("Vendor"),
    type: idx("Type"), tags: idx("Tags"), o1n: idx("Option1 Name"), o1v: idx("Option1 Value"),
    o2n: idx("Option2 Name"), o2v: idx("Option2 Value"), o3n: idx("Option3 Name"), o3v: idx("Option3 Value"),
    sku: idx("Variant SKU"), qty: idx("Variant Inventory Qty"), price: idx("Variant Price"),
    compare: idx("Variant Compare At Price"), img: idx("Image Src"),
  };
  const groups = new Map();
  for (let r = 1; r < rows.length; r++) {
    const h = rows[r][H.handle]; if (!h) continue;
    if (!groups.has(h)) groups.set(h, []);
    groups.get(h).push(rows[r]);
  }
  const out = [], vendors = new Map();
  for (const [handle, rs] of groups) {
    const head = rs.find((r) => r[H.title]) || rs[0];
    const title = (head[H.title] || "").trim(); if (!title) continue;
    let price = 0, compare = 0;
    for (const r of rs) { const p = parseFloat(r[H.price]); if (p && !price) price = p; const c = parseFloat(r[H.compare]); if (c && !compare) compare = c; }
    if (!price) continue;
    const images = [];
    for (const r of rs) { const u = (r[H.img] || "").trim(); if (u && u.includes("cdn.shopify.com") && !images.includes(u)) images.push(u); }
    if (!images.length) continue;
    images.length = Math.min(images.length, 5);
    const sizes = new Set(), colors = new Map();
    for (const r of rs) for (const [n, v] of [[r[H.o1n], r[H.o1v]], [r[H.o2n], r[H.o2v]], [r[H.o3n], r[H.o3v]]]) {
      if (!n || !v) continue; const nn = n.toLowerCase();
      if (nn.includes("size")) sizes.add(v.trim());
      else if (nn.includes("color") || nn.includes("colour")) colors.set(v.trim(), colorHex(v.trim()));
    }
    const vendor = (head[H.vendor] || "Atelier").trim() || "Atelier";
    const vslug = slugify(vendor) || "atelier";
    if (!vendors.has(vslug)) vendors.set(vslug, vendor);
    const tagsStr = head[H.tags] || "";
    const category = categoryOf(`${title} ${head[H.type] || ""} ${tagsStr}`);
    const desc = stripHtml(head[H.body]) || title;
    const short = desc.length > 150 ? desc.slice(0, 147).replace(/\s+\S*$/, "") + "…" : desc;
    const rnd = seeded(handle);
    out.push({
      id: `imp-${handle}`.slice(0, 60), slug: slugify(handle) || slugify(title), name: title,
      brand: vslug, category, sku: (rs.find((r) => r[H.sku])?.[H.sku] || `IMP-${slugify(handle)}`).slice(0, 40),
      price: Math.round(price), originalPrice: compare > price ? Math.round(compare) : undefined,
      shortDescription: short, description: desc.slice(0, 900),
      colors: colors.size ? [...colors].map(([name, hex]) => ({ name, hex })) : [{ name: "Default", hex: "#15140f" }],
      sizes: sizes.size ? [...sizes] : undefined, material: "—",
      stock: Math.max(1, parseInt(rs.find((r) => r[H.qty])?.[H.qty]) || 12),
      rating: Number((4.4 + rnd * 0.6).toFixed(1)), reviewCount: Math.floor(rnd * 180) + 8,
      tags: tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6) : [],
      featured: false, trending: rnd > 0.8, bestSeller: rnd > 0.72, newArrival: rnd > 0.6,
      palette: CAT_PALETTE[category], specs: [{ label: "Vendor", value: vendor }, ...(head[H.type] ? [{ label: "Type", value: head[H.type] }] : [])],
      images, custom: false,
    });
  }
  return { out, vendors };
}

const allProducts = [], allVendors = new Map(), seenSlug = new Set();
for (const f of FILES) {
  const { out, vendors } = processFile(f);
  for (const [s, n] of vendors) if (!allVendors.has(s)) allVendors.set(s, n);
  for (const p of out) { if (seenSlug.has(p.slug)) continue; seenSlug.add(p.slug); allProducts.push(p); if (allProducts.length >= MAX) break; }
  if (allProducts.length >= MAX) break;
}

const usedBrandSlugs = new Set(allProducts.map((p) => p.brand));
const brandsArr = [...allVendors].filter(([s]) => usedBrandSlugs.has(s)).map(([slug, name]) => ({
  slug, name, monogram: (name[0] || "V").toUpperCase(), description: `An imported collection featured on VELOUR — ${name}.`,
}));

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/imported.ts", `// AUTO-GENERATED from Shopify sample CSVs. Do not edit by hand.
import type { Brand, Product } from "./types";

export const importedBrands: Brand[] = ${JSON.stringify(brandsArr, null, 2)};

export const importedProducts: Product[] = ${JSON.stringify(allProducts, null, 2)};
`);

console.log(`products: ${allProducts.length}, brands: ${brandsArr.length}`);
const byCat = {}; allProducts.forEach((p) => (byCat[p.category] = (byCat[p.category] || 0) + 1));
console.log("by category:", byCat);
