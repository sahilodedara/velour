import type { Brand, Product } from "./types";

/**
 * Auto-generated demo catalogue — ~200 products across every category under
 * recognisable house names, using the logo-free generated artwork (no photos).
 * Non-commercial college demo. Tune the `count` fields below to add more/fewer.
 * Prices are normalised to charm values (≤ $1099) by index.ts.
 */
type Cat = {
  category: string;
  count: number;
  brands: string[];
  types: string[];
  lines: string[];
  materials: string[];
  colorways: string[];
  colors: { name: string; hex: string }[];
  sizes?: string[];
  palettes: [string, string][];
  price: [number, number];
  madeIn: string;
};

const LEATHER: [string, string][] = [["#1a1512", "#6a4a2e"], ["#141210", "#4a3a2a"], ["#1c1410", "#7a5230"], ["#131110", "#3a2c22"]];
const JEWEL: [string, string][] = [["#241d12", "#9a7b3f"], ["#1a1418", "#8a6a74"], ["#14110c", "#b08d57"], ["#181414", "#7a6a4a"]];
const STEEL: [string, string][] = [["#10131f", "#2f3c66"], ["#141618", "#4a5560"], ["#12130f", "#4a4636"], ["#101418", "#3f5a6a"]];
const FABRIC: [string, string][] = [["#16140f", "#585044"], ["#141414", "#4a4a4a"], ["#1a150f", "#8a6238"], ["#14120f", "#6a5a2a"]];

const CATS: Cat[] = [
  {
    category: "bags", count: 40, madeIn: "Italy", price: [299, 1099], palettes: LEATHER,
    brands: ["Chanel", "Dior", "Gucci", "Prada", "Fendi", "Bottega Veneta", "Saint Laurent", "Celine", "Loewe", "Balenciaga", "Valentino", "Givenchy"],
    types: ["Tote", "Shoulder Bag", "Crossbody", "Clutch", "Hobo", "Bucket Bag", "Top-Handle", "Mini Bag"],
    lines: ["Ophidia", "Marmont", "Intrecciato", "Cassandre", "Puzzle", "Baguette", "Dionysus", "Sylvie"],
    materials: ["Calfskin", "Lambskin", "Grained leather", "Suede", "Intrecciato weave", "Canvas"],
    colorways: ["Black", "Cognac", "Ivory", "Navy", "Burgundy", "Taupe"],
    colors: [{ name: "Black", hex: "#15140f" }, { name: "Cognac", hex: "#8a5a2b" }, { name: "Ivory", hex: "#e6ddc9" }],
  },
  {
    category: "jewelry", count: 38, madeIn: "France", price: [399, 1099], palettes: JEWEL,
    brands: ["Cartier", "Tiffany & Co", "Van Cleef & Arpels", "Bvlgari", "Chopard", "Boucheron", "Graff", "Harry Winston"],
    types: ["Necklace", "Ring", "Bracelet", "Earrings", "Pendant", "Cuff", "Tennis Bracelet"],
    lines: ["Love", "Panthère", "Alhambra", "Serpenti", "Juste un Clou", "Happy Diamonds", "Aria"],
    materials: ["18k yellow gold", "18k white gold", "Rose gold & diamond", "Platinum"],
    colorways: ["Yellow Gold", "White Gold", "Rose Gold"],
    colors: [{ name: "Yellow Gold", hex: "#c8a464" }, { name: "White Gold", hex: "#d7dade" }, { name: "Rose Gold", hex: "#c88f6a" }],
  },
  {
    category: "watches", count: 34, madeIn: "Switzerland", price: [499, 1099], palettes: STEEL,
    brands: ["Rolex", "Omega", "Cartier", "Patek Philippe", "Audemars Piguet", "Jaeger-LeCoultre", "IWC", "TAG Heuer", "Breitling", "Panerai", "Tudor", "Longines"],
    types: ["Automatic", "Chronograph", "GMT", "Diver", "Dress Watch", "Skeleton"],
    lines: ["Datejust", "Seamaster", "Santos", "Nautilus", "Royal Oak", "Reverso", "Portugieser", "Carrera", "Navitimer", "Luminor"],
    materials: ["Stainless steel", "Two-tone gold", "Titanium", "Rose gold"],
    colorways: ["Steel", "Gold", "Black PVD"],
    colors: [{ name: "Steel", hex: "#c4c7cd" }, { name: "Gold", hex: "#c8a464" }, { name: "Noir", hex: "#15140f" }],
  },
  {
    category: "clothing", count: 44, madeIn: "Italy", price: [199, 1099], palettes: FABRIC,
    brands: ["Gucci", "Prada", "Saint Laurent", "Balenciaga", "Versace", "Burberry", "Loro Piana", "Brunello Cucinelli", "Dolce & Gabbana", "Valentino", "Givenchy", "Fendi"],
    types: ["Blazer", "Knit Sweater", "Silk Shirt", "Trench Coat", "Cashmere Coat", "Trousers", "Pleated Skirt", "Wool Cardigan", "Bomber Jacket"],
    lines: ["Tailored", "Signature", "Heritage", "Runway", "Icon", "Essential"],
    materials: ["Virgin wool", "Cashmere", "Silk", "Cotton poplin", "Wool-blend"],
    colorways: ["Black", "Camel", "Ivory", "Navy", "Charcoal"],
    colors: [{ name: "Black", hex: "#15140f" }, { name: "Camel", hex: "#b28f5f" }, { name: "Ivory", hex: "#e6ddc9" }, { name: "Navy", hex: "#1f2740" }],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    category: "shoes", count: 22, madeIn: "Italy", price: [199, 899], palettes: LEATHER,
    brands: ["Christian Louboutin", "Manolo Blahnik", "Jimmy Choo", "Gucci", "Prada", "Saint Laurent", "Salvatore Ferragamo", "Valentino"],
    types: ["Pump", "Sandal", "Loafer", "Sneaker", "Ankle Boot", "Ballet Flat", "Mule"],
    lines: ["Signature", "Icon", "Classic", "Runway"],
    materials: ["Patent calf", "Suede", "Napa leather", "Grosgrain"],
    colorways: ["Black", "Nude", "Red", "Ivory"],
    colors: [{ name: "Black", hex: "#15140f" }, { name: "Nude", hex: "#d8b89a" }, { name: "Red", hex: "#7a1f2b" }],
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
  },
  {
    category: "accessories", count: 22, madeIn: "Italy", price: [99, 699], palettes: FABRIC,
    brands: ["Ray-Ban", "Persol", "Oliver Peoples", "Tom Ford", "Gucci", "Prada", "Saint Laurent", "Hermès", "Montblanc"],
    types: ["Sunglasses", "Belt", "Silk Scarf", "Cardholder", "Leather Gloves", "Wallet"],
    lines: ["Classic", "Signature", "Heritage", "Icon"],
    materials: ["Acetate", "Calfskin", "Silk twill", "Grained leather"],
    colorways: ["Black", "Havana", "Tan", "Gold"],
    colors: [{ name: "Black", hex: "#15140f" }, { name: "Havana", hex: "#6a4a2e" }, { name: "Gold", hex: "#c8a464" }],
  },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }
function monogram(name: string) {
  const w = name.split(/[^A-Za-z]+/).filter(Boolean);
  return ((w[0]?.[0] ?? "V") + (w[1]?.[0] ?? "")).toUpperCase().slice(0, 2);
}

const brandMap = new Map<string, Brand>();
const products: Product[] = [];
let gi = 0;

for (const c of CATS) {
  for (let i = 0; i < c.count; i++) {
    const brandName = c.brands[i % c.brands.length];
    const bslug = slugify(brandName);
    if (!brandMap.has(bslug)) brandMap.set(bslug, { slug: bslug, name: brandName, monogram: monogram(brandName), description: `Featured on VELOUR — ${brandName}.` });

    const type = c.types[(i * 3) % c.types.length];
    const line = c.lines[(i * 5) % c.lines.length];
    const colorway = c.colorways[(i * 7) % c.colorways.length];
    const material = c.materials[(i * 2) % c.materials.length];
    const palette = c.palettes[i % c.palettes.length];
    const name = `${brandName} ${line} ${type} in ${colorway}`;
    const rnd = seeded(`${c.category}-${gi}-${name}`);
    const price = c.price[0] + Math.floor(rnd * (c.price[1] - c.price[0]));

    products.push({
      id: `gen-${gi}`,
      slug: slugify(`${name}-${gi}`),
      name,
      brand: bslug,
      category: c.category,
      sku: `GEN-${String(gi).padStart(4, "0")}`,
      price,
      shortDescription: `${name} — ${material.toLowerCase()}.`,
      description: `${name}. Presented on VELOUR and crafted in ${material.toLowerCase()}, hand-finished and made to be lived with for years.`,
      colors: c.colors,
      sizes: c.sizes,
      material,
      stock: Math.floor(rnd * 18) + 4,
      rating: Number((4.4 + rnd * 0.6).toFixed(1)),
      reviewCount: Math.floor(rnd * 180) + 15,
      tags: [c.category, "demo"],
      featured: rnd > 0.86,
      trending: rnd > 0.72,
      bestSeller: rnd > 0.6,
      newArrival: rnd > 0.5,
      palette,
      specs: [{ label: "Material", value: material }, { label: "Made in", value: c.madeIn }],
      custom: false,
    });
    gi++;
  }
}

export const generatedBrands: Brand[] = [...brandMap.values()];
export const generatedProducts: Product[] = products;
