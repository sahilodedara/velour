import type { Product } from "./types";

/**
 * Signature pieces to fill the thinner categories (watches, perfumes, bags)
 * with premium products. These use the generated gold house-artwork (no external
 * media). Swap in real photos anytime via the admin image/video upload.
 */

type Row = [name: string, price: number, original: number | 0, flags: string];
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

const DEFS: Def[] = [
  {
    brand: "orvieto", category: "watches", palette: ["#10131f", "#2f3c66"],
    colors: [{ name: "Steel", hex: "#c4c7cd" }, { name: "Rose Gold", hex: "#c8a464" }, { name: "Noir PVD", hex: "#15140f" }],
    material: "Stainless steel, sapphire crystal",
    specs: [{ label: "Movement", value: "Automatic, in-house" }, { label: "Power reserve", value: "72 h" }, { label: "Water resistance", value: "100 m" }, { label: "Made in", value: "Switzerland" }],
    rows: [
      ["Orvieto Grande Complication", 12900, 0, "featured best"],
      ["Orvieto Tourbillon Noir", 18500, 0, "trend"],
      ["Orvieto Perpetual Calendar", 9800, 11200, "best"],
      ["Orvieto Diver Professional", 5400, 0, "new"],
      ["Orvieto GMT Voyager", 6200, 0, "trend"],
      ["Orvieto Skeleton Openwork", 8900, 0, "featured"],
      ["Orvieto Lady Nacre 32", 4100, 0, "new"],
      ["Orvieto Chronograph Panda", 5900, 6800, "best"],
    ],
  },
  {
    brand: "lunaire", category: "perfumes", palette: ["#2a1620", "#7a3b54"],
    colors: [{ name: "100 ml", hex: "#2a1620" }],
    material: "Eau de Parfum, 100 ml",
    specs: [{ label: "Concentration", value: "Eau de Parfum" }, { label: "Volume", value: "100 ml" }, { label: "Made in", value: "France" }],
    rows: [
      ["Lunaire Rose Nuit Extrait", 310, 0, "featured"],
      ["Lunaire Cuir Vétiver", 265, 0, "trend"],
      ["Lunaire Ambre Solaire", 240, 0, "best"],
      ["Lunaire Iris Poudré", 290, 0, "new"],
      ["Lunaire Santal Minuit", 275, 320, "trend"],
      ["Lunaire Néroli Blanc", 220, 0, "new"],
      ["Lunaire Tabac Or", 340, 0, "featured"],
      ["Lunaire Musc Immortel", 260, 0, "best"],
    ],
  },
  {
    brand: "solene", category: "bags", palette: ["#1c1b18", "#7a6a44"],
    colors: [{ name: "Noir", hex: "#15140f" }, { name: "Cognac", hex: "#8a5a2b" }, { name: "Bone", hex: "#e6ddc9" }],
    material: "Alligator / full-grain calfskin",
    specs: [{ label: "Hardware", value: "Gold-tone brass" }, { label: "Lining", value: "Goatskin suede" }, { label: "Made in", value: "France" }],
    rows: [
      ["Solène Aurora Alligator Clutch", 4200, 0, "featured best"],
      ["Solène Demi-Lune Shoulder Bag", 2650, 0, "trend"],
      ["Solène Grand Tote Cabas", 2980, 3400, "best"],
      ["Solène Mini Trapèze", 1890, 0, "new"],
    ],
  },
  {
    brand: "vesper", category: "jewelry", palette: ["#241d12", "#9a7b3f"],
    colors: [{ name: "Yellow Gold", hex: "#c8a464" }, { name: "White Gold", hex: "#d7dade" }],
    material: "Recycled 18k gold",
    specs: [{ label: "Metal", value: "Recycled 18k gold" }, { label: "Stones", value: "GVS, lab-grown" }, { label: "Made in", value: "Italy" }],
    rows: [
      ["Vesper Éclat Diamond Necklace", 3800, 0, "featured"],
      ["Vesper Halo Cocktail Ring", 2100, 0, "trend"],
      ["Vesper Cascade Drop Earrings", 2650, 0, "best"],
      ["Vesper Serpent Cuff", 1950, 2300, "new"],
    ],
  },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function seeded(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}

export const signatureProducts: Product[] = DEFS.flatMap((d, di) =>
  d.rows.map(([name, price, original, flags], ri) => {
    const rnd = seeded(name);
    return {
      id: `sig-${di}-${ri}`,
      slug: slugify(name),
      name,
      brand: d.brand,
      category: d.category,
      sku: `SIG-${di}${ri}-${Math.floor(rnd * 900 + 100)}`,
      price,
      originalPrice: original || undefined,
      shortDescription: `${name} — a signature piece, crafted in ${d.material.toLowerCase()}.`,
      description: `${name} embodies the house's pursuit of quiet excellence. Crafted in ${d.material.toLowerCase()} and finished by hand, it is designed to be lived with for a lifetime.`,
      colors: d.colors,
      sizes: d.sizes,
      material: d.material,
      stock: Math.floor(rnd * 8) + 3,
      rating: Number((4.7 + rnd * 0.3).toFixed(1)),
      reviewCount: Math.floor(rnd * 90) + 12,
      tags: ["signature", "icon"],
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
