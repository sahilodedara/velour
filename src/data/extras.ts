import type { Brand, Product } from "./types";

/**
 * Fills the thin PERFUMES and ACCESSORIES sections with recognisable house names.
 * Non-commercial demo — these use the generated house-artwork (no photos, no logos);
 * real product photos can be swapped in per-item via the admin image upload.
 * Prices are kept convenient (≤ $1099, charm-priced).
 */
export const extraBrands: Brand[] = [
  { slug: "tom-ford", name: "Tom Ford", monogram: "TF", description: "Featured on VELOUR — Tom Ford." },
  { slug: "saint-laurent", name: "Saint Laurent", monogram: "SL", description: "Featured on VELOUR — Saint Laurent." },
  { slug: "creed", name: "Creed", monogram: "C", description: "Featured on VELOUR — Creed." },
  { slug: "jo-malone", name: "Jo Malone London", monogram: "JM", description: "Featured on VELOUR — Jo Malone London." },
  { slug: "byredo", name: "Byredo", monogram: "B", description: "Featured on VELOUR — Byredo." },
  { slug: "hermes", name: "Hermès", monogram: "H", description: "Featured on VELOUR — Hermès." },
  { slug: "ray-ban", name: "Ray-Ban", monogram: "RB", description: "Featured on VELOUR — Ray-Ban." },
  { slug: "montblanc", name: "Montblanc", monogram: "M", description: "Featured on VELOUR — Montblanc." },
];

type Row = [name: string, price: number, flags: string];
type Def = {
  brand: string;
  category: string;
  palette: [string, string];
  colors: { name: string; hex: string }[];
  sizes?: string[];
  material: string;
  specs: { label: string; value: string }[];
  rows: Row[];
};

const P = { colors: [{ name: "100 ml", hex: "#2a1620" }], material: "Eau de Parfum, 100 ml" };
const pspecs = (made = "France") => [
  { label: "Concentration", value: "Eau de Parfum" },
  { label: "Volume", value: "100 ml" },
  { label: "Made in", value: made },
];

const DEFS: Def[] = [
  // ── Perfumes ───────────────────────────────────────────────
  { brand: "chanel", category: "perfumes", palette: ["#1a1418", "#8a6a74"], ...P, specs: pspecs(), rows: [
    ["Chanel N°5 Eau de Parfum", 199, "featured best"], ["Coco Mademoiselle", 189, "best"],
    ["Bleu de Chanel", 159, "trend"], ["Chance Eau Tendre", 179, "new"],
  ] },
  { brand: "dior", category: "perfumes", palette: ["#171a20", "#5a6a86"], ...P, specs: pspecs(), rows: [
    ["Dior Sauvage Eau de Parfum", 159, "featured best"], ["J'adore Infinissime", 189, "best"], ["Miss Dior Blooming Bouquet", 169, "new"],
  ] },
  { brand: "tom-ford", category: "perfumes", palette: ["#1c1510", "#7a5230"], ...P, specs: pspecs("USA"), rows: [
    ["Tom Ford Oud Wood", 399, "featured"], ["Black Orchid", 349, "best"], ["Tobacco Vanille", 399, "trend"], ["Lost Cherry", 399, "new"],
  ] },
  { brand: "saint-laurent", category: "perfumes", palette: ["#14100f", "#4a3428"], ...P, specs: pspecs(), rows: [
    ["YSL Black Opium", 149, "best"], ["Libre Eau de Parfum", 159, "trend"], ["Y Eau de Parfum", 139, "new"],
  ] },
  { brand: "creed", category: "perfumes", palette: ["#101418", "#3f5a6a"], ...P, specs: pspecs("UK"), rows: [
    ["Creed Aventus", 399, "featured best"], ["Silver Mountain Water", 349, "trend"],
  ] },
  { brand: "jo-malone", category: "perfumes", palette: ["#181712", "#6a6248"], ...P, specs: pspecs("UK"), rows: [
    ["Wood Sage & Sea Salt Cologne", 159, "best"], ["Lime Basil & Mandarin", 159, "trend"], ["English Pear & Freesia", 159, "new"],
  ] },
  { brand: "byredo", category: "perfumes", palette: ["#141414", "#4a4a4a"], ...P, specs: pspecs("Sweden"), rows: [
    ["Byredo Gypsy Water", 299, "featured"], ["Mojave Ghost", 299, "trend"], ["Bal d'Afrique", 289, "new"],
  ] },

  // ── Accessories ────────────────────────────────────────────
  { brand: "hermes", category: "accessories", palette: ["#1c1510", "#a5622e"],
    colors: [{ name: "Orange", hex: "#d1622d" }, { name: "Noir", hex: "#15140f" }], material: "Silk twill / calfskin",
    specs: [{ label: "Material", value: "Silk twill / calfskin" }, { label: "Made in", value: "France" }], rows: [
    ["Hermès Carré Silk Scarf 90", 449, "featured best"], ["Clic H Enamel Bracelet", 699, "trend"], ["Constance Leather Belt", 899, "best"],
  ] },
  { brand: "gucci", category: "accessories", palette: ["#14120f", "#6a5a2a"],
    colors: [{ name: "Black", hex: "#15140f" }, { name: "Beige/Ebony", hex: "#7a6a4a" }], material: "Calfskin leather",
    specs: [{ label: "Material", value: "Calfskin leather" }, { label: "Made in", value: "Italy" }], rows: [
    ["Gucci GG Marmont Belt", 499, "featured"], ["Leather Card Holder", 349, "best"], ["Ophidia Zip Pouch", 699, "new"],
  ] },
  { brand: "prada", category: "accessories", palette: ["#101214", "#3a4650"],
    colors: [{ name: "Black", hex: "#15140f" }], material: "Saffiano leather / acetate",
    specs: [{ label: "Material", value: "Saffiano leather / acetate" }, { label: "Made in", value: "Italy" }], rows: [
    ["Prada Symbole Sunglasses", 399, "featured best"], ["Saffiano Bi-Fold Wallet", 599, "best"], ["Re-Nylon Belt Bag", 699, "trend"],
  ] },
  { brand: "saint-laurent", category: "accessories", palette: ["#14100f", "#4a3428"],
    colors: [{ name: "Black", hex: "#15140f" }], material: "Grained calfskin",
    specs: [{ label: "Material", value: "Grained calfskin" }, { label: "Made in", value: "Italy" }], rows: [
    ["Cassandre Card Case", 349, "best"], ["Monogram Leather Belt", 499, "new"],
  ] },
  { brand: "ray-ban", category: "accessories", palette: ["#12130f", "#4a4636"],
    colors: [{ name: "Black", hex: "#15140f" }, { name: "Gold", hex: "#c8a464" }], material: "Acetate, G-15 lenses",
    specs: [{ label: "Lenses", value: "G-15 / polarised" }, { label: "Made in", value: "Italy" }], rows: [
    ["Ray-Ban Aviator Classic", 199, "featured best"], ["Wayfarer Classic", 179, "best"], ["Clubmaster", 189, "trend"],
  ] },
  { brand: "montblanc", category: "accessories", palette: ["#101010", "#333029"],
    colors: [{ name: "Black", hex: "#15140f" }], material: "Precious resin / leather",
    specs: [{ label: "Material", value: "Precious resin / leather" }, { label: "Made in", value: "Germany" }], rows: [
    ["Montblanc Meisterstück Rollerball", 599, "featured"], ["Extreme 3.0 Wallet", 399, "best"], ["Leather Card Holder", 279, "new"],
  ] },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

export const extraProducts: Product[] = DEFS.flatMap((d, di) =>
  d.rows.map(([name, price, flags], ri) => {
    const rnd = seeded(name);
    return {
      id: `ext-${di}-${ri}`,
      slug: slugify(`${d.brand}-${name}`),
      name,
      brand: d.brand,
      category: d.category,
      sku: `EXT-${di}${ri}-${Math.floor(rnd * 900 + 100)}`,
      price,
      shortDescription: `${name} — ${d.material.toLowerCase()}.`,
      description: `${name}. A signature ${d.category === "perfumes" ? "fragrance" : "accessory"} presented on VELOUR, crafted in ${d.material.toLowerCase()} and finished by hand.`,
      colors: d.colors,
      sizes: d.sizes,
      material: d.material,
      stock: Math.floor(rnd * 20) + 6,
      rating: Number((4.5 + rnd * 0.5).toFixed(1)),
      reviewCount: Math.floor(rnd * 160) + 20,
      tags: [d.category, "icon"],
      featured: flags.includes("featured"),
      trending: flags.includes("trend"),
      bestSeller: flags.includes("best"),
      newArrival: flags.includes("new"),
      palette: d.palette,
      specs: d.specs,
      custom: false,
    } as Product;
  }),
);
