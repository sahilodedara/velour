// ⚠️ LOCAL-ONLY — DO NOT COMMIT ITS OUTPUT OR PUSH THE IMAGES.
// The source photos are counterfeit branded goods; the public site uses
// scripts/gen-shoes.mjs (house artwork) instead. This script exists only to
// rebuild the photo version on YOUR machine for an in-person demo:
//   node scripts/import-shoes.mjs 10 5      (writes photo shoes.ts + public/collection/shoes/*)
// Both outputs are gitignored / untracked — leave them uncommitted.
// To restore the public art version afterwards: node scripts/gen-shoes.mjs
//
// Clusters images by perceptual hash (same shoe = near-identical photos), keeps
// each distinct shoe ONCE, and uses up to N of its clustered photos as a gallery.
// Usage: node scripts/import-shoes.mjs [hammingThreshold] [galleryMax]
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import jpeg from "jpeg-js";

const SRC = ".shoetmp";
const OUT = "public/collection/shoes";
const T = Number(process.argv[2] || 6);
const GMAX = Number(process.argv[3] || 3);
const MAXW = 900;

const files = readdirSync(SRC)
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort((a, b) => {
    const na = (a.match(/_(\d+)_\d+\.jpe?g$/i) || [])[1] || a;
    const nb = (b.match(/_(\d+)_\d+\.jpe?g$/i) || [])[1] || b;
    return parseInt(na) - parseInt(nb) || a.localeCompare(b);
  });

const decode = (f) => jpeg.decode(readFileSync(`${SRC}/${f}`), { useTArray: true, maxMemoryUsageInMB: 1024 });

function aHash(raw) {
  const { width: W, height: H, data } = raw, N = 8;
  const sum = new Float64Array(N * N), cnt = new Uint32Array(N * N);
  for (let y = 0; y < H; y++) {
    const gy = Math.min(N - 1, (y * N / H) | 0);
    for (let x = 0; x < W; x++) {
      const gx = Math.min(N - 1, (x * N / W) | 0), idx = (y * W + x) * 4;
      sum[gy * N + gx] += data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      cnt[gy * N + gx]++;
    }
  }
  const gray = Array.from(sum, (s, i) => s / (cnt[i] || 1));
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  return gray.map((g) => (g > avg ? 1 : 0));
}
const hamming = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; };

function resizeEncode(raw) {
  const { width: W, height: H, data } = raw;
  const TW = Math.min(MAXW, W), scale = TW / W, TH = Math.round(H * scale);
  const out = Buffer.alloc(TW * TH * 4);
  for (let y = 0; y < TH; y++) {
    const sy = Math.min(H - 1, (y / scale) | 0);
    for (let x = 0; x < TW; x++) {
      const sx = Math.min(W - 1, (x / scale) | 0), si = (sy * W + sx) * 4, di = (y * TW + x) * 4;
      out[di] = data[si]; out[di + 1] = data[si + 1]; out[di + 2] = data[si + 2]; out[di + 3] = 255;
    }
  }
  return jpeg.encode({ data: out, width: TW, height: TH }, 78).data;
}

// Cluster: first occurrence starts a shoe; near-identical photos join as extra angles.
const clusters = [];
for (const f of files) {
  let raw;
  try { raw = decode(f); } catch { continue; }
  const h = aHash(raw);
  const hit = clusters.find((c) => hamming(c.hash, h) <= T);
  if (hit) { if (hit.members.length < GMAX) hit.members.push(f); }
  else clusters.push({ hash: h, members: [f] });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const TYPES = ["Runner", "Derby", "Loafer", "Chelsea Boot", "Low Sneaker", "Oxford", "Monk Strap", "Trainer", "High-Top", "Brogue", "Slip-On", "Chukka Boot"];
const MATS = ["Calf suede", "Box calf leather", "Waxed suede", "Nappa leather", "Grained calfskin", "Nubuck"];
const MAT_WORD = ["Suede", "Calfskin", "Waxed", "Nappa", "Grained", "Nubuck"];
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function seeded(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

let imgCount = 0;
const products = clusters.map((c, i) => {
  const images = c.members.map((src, k) => {
    const dest = `shoe-${i + 1}-${k + 1}.jpg`;
    writeFileSync(`${OUT}/${dest}`, resizeEncode(decode(src)));
    imgCount++;
    return `/collection/shoes/${dest}`;
  });
  const type = TYPES[i % TYPES.length], m = i % MATS.length, name = `${MAT_WORD[m]} ${type}`;
  const rnd = seeded(`${i}${name}`);
  const price = Math.round((280 + rnd * 100) / 5) * 5;
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
    images, custom: false,
  };
});

writeFileSync("src/data/shoes.ts", `// AUTO-GENERATED shoe collection (non-commercial demo, images provided locally).
import type { Product } from "./types";

export const shoeProducts: Product[] = ${JSON.stringify(products, null, 2)};
`);

console.log(`distinct shoes: ${clusters.length}, total images: ${imgCount} (gallery ≤${GMAX})`);
console.log(`gallery sizes: ${clusters.map((c) => c.members.length).join(",")}`);
console.log(`prices: ${Math.min(...products.map((p) => p.price))}–${Math.max(...products.map((p) => p.price))}`);
