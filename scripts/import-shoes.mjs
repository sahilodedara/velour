// Build src/data/shoes.ts by visually de-duplicating WeChat catalog images.
// Uses an 8x8 average-hash (aHash); images within HAMMING of an existing shoe are
// treated as the SAME shoe (kept once). One image per distinct shoe. Prices $280–$380.
// Usage: node scripts/import-shoes.mjs [hammingThreshold]  (default 10)
import { readdirSync, readFileSync, copyFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import jpeg from "jpeg-js";

const SRC = ".shoetmp";
const OUT = "public/collection/shoes";
const T = Number(process.argv[2] || 10);

const files = readdirSync(SRC)
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort((a, b) => {
    const na = (a.match(/_(\d+)_\d+\.jpe?g$/i) || [])[1] || a;
    const nb = (b.match(/_(\d+)_\d+\.jpe?g$/i) || [])[1] || b;
    return parseInt(na) - parseInt(nb) || a.localeCompare(b);
  });

function aHash(path) {
  const raw = jpeg.decode(readFileSync(`${SRC}/${path}`), { useTArray: true, maxMemoryUsageInMB: 1024 });
  const { width: W, height: H, data } = raw;
  const N = 8;
  const sum = new Float64Array(N * N), cnt = new Uint32Array(N * N);
  for (let y = 0; y < H; y++) {
    const gy = Math.min(N - 1, (y * N / H) | 0);
    for (let x = 0; x < W; x++) {
      const gx = Math.min(N - 1, (x * N / W) | 0);
      const idx = (y * W + x) * 4;
      const g = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      sum[gy * N + gx] += g; cnt[gy * N + gx]++;
    }
  }
  const gray = Array.from(sum, (s, i) => s / (cnt[i] || 1));
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  return gray.map((g) => (g > avg ? 1 : 0));
}
const hamming = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; };

// Greedy cluster: first occurrence of each visually-distinct shoe becomes a rep.
const reps = [];
for (const f of files) {
  let hash;
  try { hash = aHash(f); } catch { continue; }
  if (reps.some((r) => hamming(r.hash, hash) <= T)) continue;
  reps.push({ file: f, hash });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const TYPES = ["Runner", "Derby", "Loafer", "Chelsea Boot", "Low Sneaker", "Oxford", "Monk Strap", "Trainer", "High-Top", "Brogue", "Slip-On", "Chukka Boot"];
const MATS = ["Calf suede", "Box calf leather", "Waxed suede", "Nappa leather", "Grained calfskin", "Nubuck"];
const MAT_WORD = ["Suede", "Calfskin", "Waxed", "Nappa", "Grained", "Nubuck"];
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

const products = reps.map((r, i) => {
  const dest = `shoe-${i + 1}.jpg`;
  copyFileSync(`${SRC}/${r.file}`, `${OUT}/${dest}`);
  const type = TYPES[i % TYPES.length];
  const m = i % MATS.length;
  const name = `${MAT_WORD[m]} ${type}`;
  const rnd = seeded(dest + name);
  const price = Math.round((280 + rnd * 100) / 5) * 5; // 280–380
  return {
    id: `shoe-${i + 1}`, slug: `belmonte-${slugify(type)}-${i + 1}`, name,
    brand: "belmonte", category: "shoes", sku: `SHO-${String(i + 1).padStart(3, "0")}`,
    price,
    shortDescription: `A ${type.toLowerCase()} in ${MATS[m].toLowerCase()}, handmade in a small atelier.`,
    description: `The ${name} — a ${type.toLowerCase()} crafted from ${MATS[m].toLowerCase()} and set on a leather sole. Made to be worn for years.`,
    colors: [{ name: "As shown", hex: "#3a2a1d" }],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    material: MATS[m], stock: Math.floor(rnd * 12) + 3,
    rating: Number((4.4 + rnd * 0.6).toFixed(1)), reviewCount: Math.floor(rnd * 140) + 10,
    tags: ["shoe", "handmade"],
    featured: i < 3, trending: rnd > 0.75, bestSeller: rnd > 0.6, newArrival: rnd > 0.5,
    palette: ["#1a1714", "#5a4a35"],
    specs: [{ label: "Upper", value: MATS[m] }, { label: "Sole", value: "Leather" }, { label: "Made in", value: "Italy" }],
    images: [`/collection/shoes/${dest}`], custom: false,
  };
});

writeFileSync("src/data/shoes.ts", `// AUTO-GENERATED shoe collection (non-commercial demo, images provided locally).
import type { Product } from "./types";

export const shoeProducts: Product[] = ${JSON.stringify(products, null, 2)};
`);

console.log(`threshold ${T} → distinct shoes: ${reps.length} (from ${files.length} images)`);
console.log(`prices: ${Math.min(...products.map((p) => p.price))}–${Math.max(...products.map((p) => p.price))}`);
