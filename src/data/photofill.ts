import type { Product } from "./types";

/**
 * Photo-backed WATCHES and PERFUMES so those sections aren't artwork-only.
 * The free Shopify sample set has no watch/perfume images, so these hotlink real
 * category photos from LoremFlickr (stable per ?lock seed). Non-commercial demo;
 * swap in exact product photos anytime via the admin image upload.
 */
type Row = [name: string, price: number, flags: string];
type Def = { brand: string; category: string; tag: string; palette: [string, string]; colors: { name: string; hex: string }[]; material: string; specs: { label: string; value: string }[]; rows: Row[] };

const WATCH_SPECS = [
  { label: "Movement", value: "Automatic" },
  { label: "Case", value: "Stainless steel, sapphire crystal" },
  { label: "Water resistance", value: "100 m" },
  { label: "Made in", value: "Switzerland" },
];
const WCOL = [{ name: "Steel", hex: "#c4c7cd" }, { name: "Gold", hex: "#c8a464" }, { name: "Noir", hex: "#15140f" }];
const PSPEC = [{ label: "Concentration", value: "Eau de Parfum" }, { label: "Volume", value: "100 ml" }, { label: "Made in", value: "France" }];
const PCOL = [{ name: "100 ml", hex: "#2a1620" }];

const DEFS: Def[] = [
  // ── Watches ────────────────────────────────────────────────
  { brand: "rolex", category: "watches", tag: "wristwatch", palette: ["#10131f", "#2f3c66"], colors: WCOL, material: "Oystersteel", specs: WATCH_SPECS, rows: [
    ["Rolex Datejust 36", 999, "featured best"], ["Rolex Submariner Date", 1099, "best"], ["Rolex Oyster Perpetual 41", 899, "trend"], ["Rolex GMT-Master II", 1099, "new"] ] },
  { brand: "omega", category: "watches", tag: "watch", palette: ["#101418", "#3f5a6a"], colors: WCOL, material: "Stainless steel", specs: WATCH_SPECS, rows: [
    ["Omega Seamaster Diver 300M", 799, "featured"], ["Omega Speedmaster Moonwatch", 899, "best"], ["Omega Constellation", 699, "new"] ] },
  { brand: "cartier", category: "watches", tag: "luxury,watch", palette: ["#1a1418", "#8a6a74"], colors: WCOL, material: "Steel / gold", specs: WATCH_SPECS, rows: [
    ["Cartier Santos de Cartier", 999, "featured best"], ["Cartier Tank Must", 799, "trend"], ["Cartier Ballon Bleu", 899, "new"] ] },
  { brand: "tag-heuer", category: "watches", tag: "chronograph,watch", palette: ["#141618", "#4a5560"], colors: WCOL, material: "Steel", specs: WATCH_SPECS, rows: [
    ["TAG Heuer Carrera", 699, "best"], ["TAG Heuer Monaco", 899, "trend"], ["TAG Heuer Aquaracer", 599, "new"] ] },
  { brand: "breitling", category: "watches", tag: "pilot,watch", palette: ["#12130f", "#4a4636"], colors: WCOL, material: "Steel", specs: WATCH_SPECS, rows: [
    ["Breitling Navitimer", 899, "featured"], ["Breitling Superocean", 799, "new"] ] },
  { brand: "iwc", category: "watches", tag: "watch,timepiece", palette: ["#10131f", "#2f3c66"], colors: WCOL, material: "Steel", specs: WATCH_SPECS, rows: [
    ["IWC Portugieser Automatic", 1099, "best"], ["IWC Pilot's Watch Mark XX", 899, "trend"] ] },
  { brand: "longines", category: "watches", tag: "wristwatch,classic", palette: ["#141618", "#4a5560"], colors: WCOL, material: "Steel", specs: WATCH_SPECS, rows: [
    ["Longines Master Collection", 599, "new"], ["Longines HydroConquest", 499, "best"] ] },
  { brand: "tudor", category: "watches", tag: "diver,watch", palette: ["#101418", "#3f5a6a"], colors: WCOL, material: "Steel", specs: WATCH_SPECS, rows: [
    ["Tudor Black Bay 58", 699, "featured"], ["Tudor Pelagos", 899, "trend"] ] },

  // ── Perfumes ───────────────────────────────────────────────
  { brand: "chanel", category: "perfumes", tag: "perfume", palette: ["#1a1418", "#8a6a74"], colors: PCOL, material: "Eau de Parfum, 100 ml", specs: PSPEC, rows: [
    ["Chanel N°5 Eau de Parfum", 199, "featured best"], ["Coco Mademoiselle", 189, "best"], ["Bleu de Chanel", 159, "trend"], ["Chance Eau Tendre", 179, "new"] ] },
  { brand: "dior", category: "perfumes", tag: "perfume,bottle", palette: ["#171a20", "#5a6a86"], colors: PCOL, material: "Eau de Parfum, 100 ml", specs: PSPEC, rows: [
    ["Dior Sauvage Elixir", 179, "featured"], ["J'adore Infinissime", 189, "best"], ["Miss Dior Blooming Bouquet", 169, "new"] ] },
  { brand: "tom-ford", category: "perfumes", tag: "fragrance,bottle", palette: ["#1c1510", "#7a5230"], colors: PCOL, material: "Eau de Parfum, 100 ml", specs: [...PSPEC.slice(0, 2), { label: "Made in", value: "USA" }], rows: [
    ["Tom Ford Oud Wood", 399, "featured best"], ["Tom Ford Black Orchid", 349, "best"], ["Tom Ford Tobacco Vanille", 399, "trend"], ["Tom Ford Lost Cherry", 399, "new"] ] },
  { brand: "saint-laurent", category: "perfumes", tag: "perfume,luxury", palette: ["#14100f", "#4a3428"], colors: PCOL, material: "Eau de Parfum, 90 ml", specs: PSPEC, rows: [
    ["YSL Black Opium", 149, "best"], ["YSL Libre", 159, "trend"], ["YSL Y Eau de Parfum", 139, "new"] ] },
  { brand: "creed", category: "perfumes", tag: "cologne,bottle", palette: ["#101418", "#3f5a6a"], colors: PCOL, material: "Eau de Parfum, 100 ml", specs: [...PSPEC.slice(0, 2), { label: "Made in", value: "UK" }], rows: [
    ["Creed Aventus", 399, "featured best"], ["Creed Silver Mountain Water", 349, "trend"] ] },
  { brand: "byredo", category: "perfumes", tag: "perfume,minimal", palette: ["#141414", "#4a4a4a"], colors: PCOL, material: "Eau de Parfum, 100 ml", specs: [...PSPEC.slice(0, 2), { label: "Made in", value: "Sweden" }], rows: [
    ["Byredo Gypsy Water", 299, "featured"], ["Byredo Mojave Ghost", 299, "new"] ] },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

let lock = 100;
export const photofillProducts: Product[] = DEFS.flatMap((d, di) =>
  d.rows.map(([name, price, flags], ri) => {
    const rnd = seeded(name);
    const img = `https://loremflickr.com/600/800/${d.tag}?lock=${lock++}`;
    return {
      id: `pf-${di}-${ri}`,
      slug: `pf-${slugify(name)}`,
      name,
      brand: d.brand,
      category: d.category,
      sku: `PF-${di}${ri}-${Math.floor(rnd * 900 + 100)}`,
      price,
      shortDescription: `${name} — ${d.material.toLowerCase()}.`,
      description: `${name}. Presented on VELOUR — ${d.material.toLowerCase()}, a signature piece finished to last.`,
      colors: d.colors,
      material: d.material,
      stock: Math.floor(rnd * 15) + 5,
      rating: Number((4.6 + rnd * 0.4).toFixed(1)),
      reviewCount: Math.floor(rnd * 150) + 20,
      tags: [d.category, "icon"],
      featured: flags.includes("featured"),
      trending: flags.includes("trend"),
      bestSeller: flags.includes("best"),
      newArrival: flags.includes("new"),
      palette: d.palette,
      specs: d.specs,
      images: [img],
      custom: false,
    } as Product;
  }),
);
