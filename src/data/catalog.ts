import type { Brand, Category, Product, Review } from "./types";

/* All brands below are original and fictional — created for VELOUR. */
export const brands: Brand[] = [
  { slug: "solene", name: "Solène", monogram: "S", est: "1987", featured: true,
    description: "A Parisian leather house celebrated for sculptural top-handles and hand-finished calfskin." },
  { slug: "castellane", name: "Castellane", monogram: "C", est: "1962", featured: true,
    description: "Milanese tailoring at its purest — cashmere overcoats and impeccably cut blazers." },
  { slug: "orvieto", name: "Orvieto", monogram: "O", est: "1948", featured: true,
    description: "Independent Swiss-style watchmaking with in-house movements and quiet precision." },
  { slug: "lunaire", name: "Lunaire", monogram: "L", est: "2004", featured: true,
    description: "Modern niche perfumery composing rare absolutes into nocturnal, unforgettable trails." },
  { slug: "belmonte", name: "Belmonte", monogram: "B", est: "1979", featured: true,
    description: "Footwear handmade in small ateliers — Goodyear-welted leathers and feather-light soles." },
  { slug: "vesper", name: "Vesper & Co.", monogram: "V", est: "1991", featured: true,
    description: "Fine jewelry rendered in recycled gold and responsibly sourced stones." },
  { slug: "marchetti", name: "Marchetti", monogram: "M", est: "1985",
    description: "Accessories and eyewear with architectural acetate and polished hardware." },
  { slug: "saint-aubin", name: "Saint-Aubin", monogram: "SA", est: "1970",
    description: "Outerwear specialists — weatherproof leathers and travel-ready tailoring." },
];

export const categories: Category[] = [
  { slug: "bags", name: "Bags", tagline: "Sculptural leather goods", palette: ["#1c1b18", "#7a6a44"] },
  { slug: "clothing", name: "Clothing", tagline: "Ready-to-wear, refined", palette: ["#23211d", "#6a5a3a"] },
  { slug: "shoes", name: "Shoes", tagline: "Crafted to carry you", palette: ["#1a1714", "#5a4a35"] },
  { slug: "perfumes", name: "Perfumes", tagline: "Olfactory signatures", palette: ["#2a1620", "#7a3b54"] },
  { slug: "watches", name: "Watches", tagline: "Time, perfected", palette: ["#10131f", "#2f3c66"] },
  { slug: "jewelry", name: "Jewelry", tagline: "Light made wearable", palette: ["#241d12", "#9a7b3f"] },
  { slug: "accessories", name: "Accessories", tagline: "The finishing note", palette: ["#1d1d20", "#5f6168"] },

  { slug: "handbags", name: "Handbags", parent: "bags", palette: ["#1c1b18", "#7a6a44"] },
  { slug: "wallets", name: "Wallets", parent: "bags", palette: ["#15140f", "#4a4030"] },
  { slug: "backpacks", name: "Backpacks", parent: "bags", palette: ["#16181c", "#3c4450"] },
  { slug: "travel", name: "Travel Bags", parent: "bags", palette: ["#152018", "#3c5a45"] },
  { slug: "jackets", name: "Jackets", parent: "clothing", palette: ["#1a1916", "#534734"] },
  { slug: "shirts", name: "Shirts", parent: "clothing", palette: ["#22201b", "#6f6044"] },
  { slug: "tshirts", name: "T-Shirts", parent: "clothing", palette: ["#1f1e1b", "#5a5346"] },
  { slug: "sneakers", name: "Sneakers", parent: "shoes", palette: ["#18161a", "#4a4658"] },
  { slug: "belts", name: "Belts", parent: "accessories", palette: ["#1b1814", "#4f4232"] },
  { slug: "sunglasses", name: "Sunglasses", parent: "accessories", palette: ["#161616", "#43434a"] },
];

const RTW_SIZES = ["XS", "S", "M", "L", "XL"];
const SHOE_SIZES = ["39", "40", "41", "42", "43", "44", "45"];

export const products: Product[] = [
  // ---- BAGS ----
  {
    id: "p-001", slug: "solene-top-handle-bag", name: "The Solène Top-Handle Bag",
    brand: "solene", category: "bags", subcategory: "handbags", sku: "SLN-TH-001",
    price: 2450, originalPrice: 2900,
    shortDescription: "A sculptural top-handle in hand-finished calfskin with a gilded clasp.",
    description:
      "The house's defining silhouette, the Top-Handle Bag is cut from a single hide of full-grain calfskin and finished entirely by hand. A gently structured body holds its shape over years of use, while the signature gilded clasp closes with a reassuring, jewel-box click. Lined in suede and fitted with a detachable shoulder strap.",
    colors: [ { name: "Noir", hex: "#15140f" }, { name: "Cognac", hex: "#8a5a2b" }, { name: "Bone", hex: "#e6ddc9" } ],
    material: "Full-grain calfskin", stock: 7, rating: 4.9, reviewCount: 214,
    tags: ["icon", "leather", "gold-hardware"], featured: true, bestSeller: true,
    palette: ["#1c1b18", "#7a6a44"],
    specs: [
      { label: "Dimensions", value: "26 × 18 × 11 cm" }, { label: "Strap drop", value: "52 cm, detachable" },
      { label: "Hardware", value: "Gold-tone brass" }, { label: "Lining", value: "Goatskin suede" },
      { label: "Made in", value: "France" },
    ],
  },
  {
    id: "p-002", slug: "castellane-structured-tote", name: "Castellane Structured Tote",
    brand: "castellane", category: "bags", subcategory: "handbags", sku: "CST-TT-014",
    price: 1890,
    shortDescription: "An architectural day tote in saddle leather with magnetic closure.",
    description:
      "Designed for the considered commute, the Structured Tote balances generous capacity with a clean architectural line. Saddle leather is vegetable-tanned for a patina that deepens with wear; an interior zip pocket and laptop sleeve keep essentials in order.",
    colors: [ { name: "Camel", hex: "#b07b3e" }, { name: "Espresso", hex: "#3a2a1d" }, { name: "Slate", hex: "#3b3f44" } ],
    material: "Vegetable-tanned saddle leather", stock: 12, rating: 4.7, reviewCount: 88,
    tags: ["work", "leather"], newArrival: true,
    palette: ["#b08d57", "#6b4f2a"],
    specs: [
      { label: "Dimensions", value: "34 × 30 × 13 cm" }, { label: "Fits", value: "15\" laptop" },
      { label: "Hardware", value: "Brushed palladium" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-003", slug: "solene-quilted-shoulder-bag", name: "Solène Quilted Shoulder Bag",
    brand: "solene", category: "bags", subcategory: "handbags", sku: "SLN-QS-009",
    price: 1650, originalPrice: 1950,
    shortDescription: "Diamond-quilted lambskin on a slim chain-and-leather strap.",
    description:
      "An evening essential rendered in supple diamond-quilted lambskin. The interwoven chain-and-leather strap can be doubled for a shoulder carry or worn long across the body.",
    colors: [ { name: "Noir", hex: "#15140f" }, { name: "Burgundy", hex: "#5a1f2a" }, { name: "Ivory", hex: "#efe9dd" } ],
    material: "Quilted lambskin", stock: 9, rating: 4.8, reviewCount: 132,
    tags: ["evening", "leather", "chain"], trending: true,
    palette: ["#3a161b", "#7a3b44"],
    specs: [
      { label: "Dimensions", value: "23 × 15 × 7 cm" }, { label: "Strap drop", value: "30 / 60 cm" },
      { label: "Hardware", value: "Gold-tone" }, { label: "Made in", value: "France" },
    ],
  },
  {
    id: "p-004", slug: "marchetti-bifold-wallet", name: "Marchetti Bifold Wallet",
    brand: "marchetti", category: "bags", subcategory: "wallets", sku: "MRC-WL-021",
    price: 390,
    shortDescription: "A slim bifold in pebbled leather with eight card slots.",
    description:
      "Pared back and precise, the Bifold Wallet is cut from pebbled calfskin and edge-painted by hand. Eight card slots and a full-width note compartment keep the profile slim.",
    colors: [ { name: "Black", hex: "#15140f" }, { name: "Navy", hex: "#1f2535" } ],
    material: "Pebbled calfskin", stock: 40, rating: 4.6, reviewCount: 61,
    tags: ["leather", "gift"],
    palette: ["#0c0c0e", "#33333a"],
    specs: [
      { label: "Dimensions", value: "11 × 9 cm" }, { label: "Card slots", value: "8" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-005", slug: "saint-aubin-weekender", name: "Saint-Aubin Weekender",
    brand: "saint-aubin", category: "bags", subcategory: "travel", sku: "STA-WK-003",
    price: 1290,
    shortDescription: "A weatherproof leather holdall sized for the long weekend.",
    description:
      "Built for travel, the Weekender pairs waxed full-grain leather with a water-repellent canvas base. A wide mouth opens flat for easy packing; the removable shoulder strap is padded for transit.",
    colors: [ { name: "Forest", hex: "#27392c" }, { name: "Tobacco", hex: "#6b4524" }, { name: "Black", hex: "#15140f" } ],
    material: "Waxed full-grain leather", stock: 15, rating: 4.8, reviewCount: 47,
    tags: ["travel", "unisex"], bestSeller: true,
    palette: ["#152018", "#3c5a45"],
    specs: [
      { label: "Dimensions", value: "52 × 28 × 26 cm" }, { label: "Capacity", value: "38 L" },
      { label: "Base", value: "Water-repellent canvas" }, { label: "Made in", value: "Portugal" },
    ],
  },
  {
    id: "p-006", slug: "vesper-city-backpack", name: "Vesper City Backpack",
    brand: "vesper", category: "bags", subcategory: "backpacks", sku: "VSP-BP-006",
    price: 980,
    shortDescription: "A minimalist backpack in matte leather with a magnetic flap.",
    description:
      "Clean lines and a hidden magnetic flap define the City Backpack. Padded straps and a dedicated tech sleeve make it as practical as it is discreet.",
    colors: [ { name: "Graphite", hex: "#34363b" }, { name: "Black", hex: "#15140f" } ],
    material: "Matte calfskin", stock: 18, rating: 4.5, reviewCount: 39,
    tags: ["unisex", "tech"],
    palette: ["#2a2a2e", "#6f7178"],
    specs: [
      { label: "Dimensions", value: "40 × 29 × 12 cm" }, { label: "Fits", value: "16\" laptop" }, { label: "Made in", value: "Italy" },
    ],
  },

  // ---- CLOTHING ----
  {
    id: "p-007", slug: "castellane-cashmere-overcoat", name: "Castellane Cashmere Overcoat",
    brand: "castellane", category: "clothing", subcategory: "jackets", sku: "CST-OC-031",
    price: 2750,
    shortDescription: "A double-faced cashmere overcoat with a clean notch lapel.",
    description:
      "The house signature: a double-faced cashmere overcoat tailored to fall straight from the shoulder. Unlined and hand-finished, it drapes with a weightless ease that belies its warmth.",
    colors: [ { name: "Camel", hex: "#b08d57" }, { name: "Charcoal", hex: "#2f2f31" }, { name: "Navy", hex: "#1f2535" } ],
    sizes: RTW_SIZES, material: "100% double-faced cashmere", stock: 6, rating: 4.9, reviewCount: 73,
    tags: ["outerwear", "cashmere"], featured: true, bestSeller: true,
    palette: ["#1c1b18", "#7a6a44"],
    specs: [
      { label: "Fabric", value: "Double-faced cashmere" }, { label: "Fit", value: "Relaxed, straight" },
      { label: "Care", value: "Dry clean only" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-008", slug: "saint-aubin-leather-biker-jacket", name: "Saint-Aubin Leather Biker Jacket",
    brand: "saint-aubin", category: "clothing", subcategory: "jackets", sku: "STA-BJ-018",
    price: 1980, originalPrice: 2400,
    shortDescription: "An asymmetric biker in glove-soft lambskin.",
    description:
      "A modern take on the biker, cut close in glove-soft lambskin with an asymmetric zip and tonal hardware. Fully lined for a clean fall over knitwear.",
    colors: [ { name: "Black", hex: "#15140f" }, { name: "Oxblood", hex: "#4a1d22" } ],
    sizes: RTW_SIZES, material: "Lambskin leather", stock: 10, rating: 4.7, reviewCount: 54,
    tags: ["outerwear", "leather"], trending: true,
    palette: ["#0c0c0e", "#33333a"],
    specs: [
      { label: "Shell", value: "Lambskin" }, { label: "Lining", value: "Cupro" },
      { label: "Hardware", value: "Tonal matte" }, { label: "Made in", value: "Turkey" },
    ],
  },
  {
    id: "p-009", slug: "castellane-silk-shirt", name: "Castellane Silk Shirt",
    brand: "castellane", category: "clothing", subcategory: "shirts", sku: "CST-SH-022",
    price: 520,
    shortDescription: "A fluid sand-washed silk shirt with mother-of-pearl buttons.",
    description:
      "Sand-washed silk gives this shirt a matte, fluid hand. Cut for an easy drape with a relaxed collar and genuine mother-of-pearl buttons.",
    colors: [ { name: "Ivory", hex: "#efe9dd" }, { name: "Black", hex: "#15140f" }, { name: "Sage", hex: "#7e856e" } ],
    sizes: RTW_SIZES, material: "Sand-washed silk", stock: 22, rating: 4.6, reviewCount: 41,
    tags: ["silk"], newArrival: true,
    palette: ["#cdbfa6", "#9a8458"],
    specs: [
      { label: "Fabric", value: "100% silk" }, { label: "Fit", value: "Relaxed" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-010", slug: "solene-pima-cotton-tee", name: "Solène Pima Cotton Tee",
    brand: "solene", category: "clothing", subcategory: "tshirts", sku: "SLN-TS-044",
    price: 180,
    shortDescription: "An everyday luxury tee in heavyweight Pima cotton.",
    description:
      "Deceptively simple, this tee is knitted from long-staple Pima cotton for a dense, smooth hand and a crew that holds its shape wash after wash.",
    colors: [ { name: "White", hex: "#f4f1ea" }, { name: "Black", hex: "#15140f" }, { name: "Stone", hex: "#bcb4a3" } ],
    sizes: RTW_SIZES, material: "Pima cotton", stock: 60, rating: 4.5, reviewCount: 96,
    tags: ["essential", "cotton"], bestSeller: true,
    palette: ["#efe9dd", "#c8b78f"],
    specs: [
      { label: "Fabric", value: "Pima cotton, 220 gsm" }, { label: "Fit", value: "Regular" }, { label: "Made in", value: "Portugal" },
    ],
  },
  {
    id: "p-011", slug: "castellane-tailored-blazer", name: "Castellane Tailored Blazer",
    brand: "castellane", category: "clothing", subcategory: "jackets", sku: "CST-BZ-027",
    price: 1450,
    shortDescription: "A half-canvas blazer in wool with a soft Neapolitan shoulder.",
    description:
      "A half-canvas construction and soft Neapolitan shoulder give this wool blazer its easy, jacket-as-second-skin feel. Patch pockets keep it relaxed enough for denim.",
    colors: [ { name: "Charcoal", hex: "#2f2f31" }, { name: "Navy", hex: "#1f2535" }, { name: "Taupe", hex: "#8c8170" } ],
    sizes: RTW_SIZES, material: "Virgin wool", stock: 14, rating: 4.8, reviewCount: 35,
    tags: ["tailoring", "wool"], featured: true,
    palette: ["#23211d", "#6a5a3a"],
    specs: [
      { label: "Construction", value: "Half-canvas" }, { label: "Shoulder", value: "Neapolitan, soft" },
      { label: "Fabric", value: "Virgin wool" }, { label: "Made in", value: "Italy" },
    ],
  },

  // ---- SHOES ----
  {
    id: "p-012", slug: "belmonte-suede-runners", name: "Belmonte Suede Runners",
    brand: "belmonte", category: "shoes", subcategory: "sneakers", sku: "BLM-SN-052",
    price: 620, originalPrice: 750,
    shortDescription: "Hand-finished suede runners on a feather-light sole.",
    description:
      "A low-profile runner in buttery suede, hand-finished and set on a lightweight rubber sole with a leather-wrapped midsole. Quietly luxurious, endlessly wearable.",
    colors: [ { name: "Sand", hex: "#c8a87a" }, { name: "Graphite", hex: "#3a3a3d" }, { name: "White", hex: "#ece8df" } ],
    sizes: SHOE_SIZES, material: "Calf suede", stock: 25, rating: 4.7, reviewCount: 118,
    tags: ["sneaker", "suede"], trending: true, bestSeller: true,
    palette: ["#b08d57", "#6b4f2a"],
    specs: [
      { label: "Upper", value: "Calf suede" }, { label: "Sole", value: "Lightweight rubber" },
      { label: "Fit", value: "True to size" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-013", slug: "belmonte-leather-derby", name: "Belmonte Leather Derby",
    brand: "belmonte", category: "shoes", sku: "BLM-DB-040",
    price: 740,
    shortDescription: "A Goodyear-welted derby in box calf.",
    description:
      "A versatile derby in polished box calf, Goodyear-welted for longevity and resoling. The almond last keeps the line elegant under tailoring or denim.",
    colors: [ { name: "Black", hex: "#15140f" }, { name: "Dark Brown", hex: "#3a2519" } ],
    sizes: SHOE_SIZES, material: "Box calf leather", stock: 16, rating: 4.8, reviewCount: 44,
    tags: ["formal", "welted"], featured: true,
    palette: ["#1a1714", "#5a4a35"],
    specs: [
      { label: "Construction", value: "Goodyear-welted" }, { label: "Last", value: "Almond" }, { label: "Made in", value: "England" },
    ],
  },
  {
    id: "p-014", slug: "belmonte-chelsea-boot", name: "Belmonte Chelsea Boot",
    brand: "belmonte", category: "shoes", sku: "BLM-CH-061",
    price: 890,
    shortDescription: "A sleek Chelsea boot in waxed suede with elastic gores.",
    description:
      "Clean and close to the ankle, this Chelsea boot is cut from waxed suede with twin elastic gores and a leather pull tab. A stacked leather heel finishes the line.",
    colors: [ { name: "Chocolate", hex: "#3a2519" }, { name: "Black", hex: "#15140f" } ],
    sizes: SHOE_SIZES, material: "Waxed suede", stock: 11, rating: 4.7, reviewCount: 33,
    tags: ["boot", "suede"], newArrival: true,
    palette: ["#1a1714", "#4a3a2a"],
    specs: [
      { label: "Upper", value: "Waxed suede" }, { label: "Heel", value: "Stacked leather" }, { label: "Made in", value: "Italy" },
    ],
  },

  // ---- PERFUMES ----
  {
    id: "p-015", slug: "lunaire-noir-absolu-edp", name: "Lunaire Noir Absolu EDP",
    brand: "lunaire", category: "perfumes", sku: "LNR-NA-100",
    price: 240,
    shortDescription: "A nocturnal eau de parfum of leather, oud and black plum.",
    description:
      "Noir Absolu opens on black plum and saffron before settling into a base of leather, oud and vanilla absolute. A deep, lingering trail composed for the evening.",
    colors: [ { name: "100 ml", hex: "#2a1620" } ],
    material: "Eau de Parfum, 100 ml", stock: 30, rating: 4.9, reviewCount: 156,
    tags: ["unisex", "woody", "oud"], featured: true, bestSeller: true,
    palette: ["#2a1620", "#7a3b54"],
    specs: [
      { label: "Concentration", value: "Eau de Parfum" }, { label: "Volume", value: "100 ml" },
      { label: "Family", value: "Leather / Oud" }, { label: "Made in", value: "France" },
    ],
  },
  {
    id: "p-016", slug: "lunaire-oud-royale", name: "Lunaire Oud Royale",
    brand: "lunaire", category: "perfumes", sku: "LNR-OR-100",
    price: 320, originalPrice: 380,
    shortDescription: "Smoky oud wrapped in rose and amber.",
    description:
      "Oud Royale layers smoky agarwood over Damask rose and warm amber — opulent, resinous and impossible to ignore.",
    colors: [ { name: "100 ml", hex: "#3a2018" } ],
    material: "Eau de Parfum, 100 ml", stock: 20, rating: 4.8, reviewCount: 89,
    tags: ["oud", "amber"], trending: true,
    palette: ["#3a2018", "#7a4a2a"],
    specs: [
      { label: "Concentration", value: "Eau de Parfum" }, { label: "Volume", value: "100 ml" },
      { label: "Family", value: "Oud / Amber" }, { label: "Made in", value: "France" },
    ],
  },
  {
    id: "p-017", slug: "lunaire-fleur-blanche", name: "Lunaire Fleur Blanche",
    brand: "lunaire", category: "perfumes", sku: "LNR-FB-100",
    price: 210,
    shortDescription: "Luminous white florals over soft musk.",
    description:
      "Fleur Blanche is a luminous bouquet of tuberose, jasmine and orange blossom, grounded by a clean, second-skin musk.",
    colors: [ { name: "100 ml", hex: "#e8dfe6" } ],
    material: "Eau de Parfum, 100 ml", stock: 26, rating: 4.6, reviewCount: 52,
    tags: ["floral", "musk"], newArrival: true,
    palette: ["#caa79b", "#e8dfe6"],
    specs: [
      { label: "Concentration", value: "Eau de Parfum" }, { label: "Volume", value: "100 ml" },
      { label: "Family", value: "White Floral" }, { label: "Made in", value: "France" },
    ],
  },

  // ---- WATCHES ----
  {
    id: "p-018", slug: "orvieto-automatic-chronometer", name: "Orvieto Automatic Chronometer",
    brand: "orvieto", category: "watches", sku: "ORV-AC-390",
    price: 4900,
    shortDescription: "A 39 mm automatic with a silvered guilloché dial.",
    description:
      "The Automatic Chronometer houses an in-house movement beating at 28,800 vph behind a silvered guilloché dial. A 39 mm steel case and sapphire crystal keep it understated and exact.",
    colors: [ { name: "Silver / Steel", hex: "#c4c7cd" }, { name: "Slate / Steel", hex: "#3b3f44" } ],
    material: "Stainless steel, sapphire crystal", stock: 5, rating: 4.9, reviewCount: 28,
    tags: ["automatic", "in-house"], featured: true, bestSeller: true,
    palette: ["#10131f", "#2f3c66"],
    specs: [
      { label: "Case", value: "39 mm stainless steel" }, { label: "Movement", value: "Automatic, in-house" },
      { label: "Power reserve", value: "72 h" }, { label: "Water resistance", value: "50 m" }, { label: "Made in", value: "Switzerland" },
    ],
  },
  {
    id: "p-019", slug: "orvieto-moonphase-39", name: "Orvieto Moonphase 39",
    brand: "orvieto", category: "watches", sku: "ORV-MP-039",
    price: 6800,
    shortDescription: "A moonphase complication beneath a deep blue aventurine dial.",
    description:
      "An aventurine dial scattered with starlight frames a precise moonphase complication. The Moonphase 39 is a quiet statement of horological craft.",
    colors: [ { name: "Midnight / Steel", hex: "#10131f" } ],
    material: "Stainless steel, aventurine dial", stock: 3, rating: 5.0, reviewCount: 17,
    tags: ["moonphase", "complication"], trending: true,
    palette: ["#10131f", "#2f3c66"],
    specs: [
      { label: "Case", value: "39 mm stainless steel" }, { label: "Complication", value: "Moonphase" },
      { label: "Movement", value: "Automatic" }, { label: "Made in", value: "Switzerland" },
    ],
  },
  {
    id: "p-020", slug: "orvieto-heritage-slim", name: "Orvieto Heritage Slim",
    brand: "orvieto", category: "watches", sku: "ORV-HS-036",
    price: 3200, originalPrice: 3800,
    shortDescription: "An ultra-thin dress watch on an alligator strap.",
    description:
      "At just 7 mm thick, the Heritage Slim slips under any cuff. A lacquered opaline dial, leaf hands and hand-stitched alligator strap complete the dress-watch ideal.",
    colors: [ { name: "Opaline / Gold", hex: "#c8a464" }, { name: "Black / Steel", hex: "#15140f" } ],
    material: "Steel or gold-tone, alligator strap", stock: 6, rating: 4.7, reviewCount: 22,
    tags: ["dress", "slim"], newArrival: true,
    palette: ["#241d12", "#9a7b3f"],
    specs: [
      { label: "Case", value: "36 mm, 7 mm thin" }, { label: "Strap", value: "Alligator, hand-stitched" },
      { label: "Movement", value: "Automatic" }, { label: "Made in", value: "Switzerland" },
    ],
  },

  // ---- JEWELRY ----
  {
    id: "p-021", slug: "vesper-pave-tennis-bracelet", name: "Vesper Pavé Tennis Bracelet",
    brand: "vesper", category: "jewelry", sku: "VSP-TB-018",
    price: 2100,
    shortDescription: "A line of pavé-set stones in recycled 18k gold.",
    description:
      "A continuous line of brilliant-cut stones set in recycled 18k gold. The hidden box clasp keeps the bracelet seamless around the wrist.",
    colors: [ { name: "Yellow Gold", hex: "#c8a464" }, { name: "White Gold", hex: "#d7dade" } ],
    sizes: ["16 cm", "17 cm", "18 cm"], material: "Recycled 18k gold", stock: 8, rating: 4.9, reviewCount: 31,
    tags: ["gold", "pavé"], featured: true,
    palette: ["#241d12", "#9a7b3f"],
    specs: [
      { label: "Metal", value: "Recycled 18k gold" }, { label: "Stones", value: "Lab-grown, GVS" },
      { label: "Clasp", value: "Hidden box" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-022", slug: "vesper-signet-ring", name: "Vesper Signet Ring",
    brand: "vesper", category: "jewelry", sku: "VSP-SR-007",
    price: 680,
    shortDescription: "A classic signet in brushed recycled gold vermeil.",
    description:
      "A modern signet with a brushed oval face, ready to wear as-is or to engrave. Cast in recycled gold vermeil over sterling silver.",
    colors: [ { name: "Gold Vermeil", hex: "#c8a464" }, { name: "Silver", hex: "#c4c7cd" } ],
    sizes: ["50", "52", "54", "56", "58"], material: "Gold vermeil / sterling silver", stock: 19, rating: 4.6, reviewCount: 40,
    tags: ["signet", "unisex"], bestSeller: true,
    palette: ["#241d12", "#9a7b3f"],
    specs: [
      { label: "Metal", value: "Gold vermeil" }, { label: "Face", value: "Brushed oval" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-023", slug: "vesper-drop-earrings", name: "Vesper Drop Earrings",
    brand: "vesper", category: "jewelry", sku: "VSP-DE-012",
    price: 1150,
    shortDescription: "Faceted drops suspended from a gold huggie.",
    description:
      "Faceted stones catch the light from a slim gold huggie, moving softly with every gesture. Secured with a comfortable lever back.",
    colors: [ { name: "Yellow Gold", hex: "#c8a464" }, { name: "White Gold", hex: "#d7dade" } ],
    material: "Recycled 18k gold", stock: 10, rating: 4.8, reviewCount: 26,
    tags: ["gold", "evening"], trending: true, newArrival: true,
    palette: ["#241d12", "#9a7b3f"],
    specs: [
      { label: "Metal", value: "Recycled 18k gold" }, { label: "Closure", value: "Lever back" }, { label: "Made in", value: "Italy" },
    ],
  },

  // ---- ACCESSORIES ----
  {
    id: "p-024", slug: "marchetti-acetate-sunglasses", name: "Marchetti Acetate Sunglasses",
    brand: "marchetti", category: "accessories", subcategory: "sunglasses", sku: "MRC-SG-033",
    price: 310,
    shortDescription: "Sculpted acetate frames with gradient lenses.",
    description:
      "Hand-polished Italian acetate frames a pair of gradient lenses with full UV protection. A timeless silhouette that flatters most faces.",
    colors: [ { name: "Tortoise", hex: "#6b4524" }, { name: "Black", hex: "#15140f" }, { name: "Smoke", hex: "#3b3f44" } ],
    material: "Italian acetate", stock: 33, rating: 4.6, reviewCount: 58,
    tags: ["eyewear", "uv400"], trending: true, bestSeller: true,
    palette: ["#161616", "#43434a"],
    specs: [
      { label: "Frame", value: "Italian acetate" }, { label: "Lens", value: "Gradient, UV400" }, { label: "Made in", value: "Italy" },
    ],
  },
  {
    id: "p-025", slug: "marchetti-reversible-belt", name: "Marchetti Reversible Belt",
    brand: "marchetti", category: "accessories", subcategory: "belts", sku: "MRC-BL-029",
    price: 290,
    shortDescription: "A reversible leather belt with a brushed gold buckle.",
    description:
      "Two belts in one: smooth black on one side, cognac on the reverse, joined by a rotating brushed gold buckle.",
    colors: [ { name: "Black / Cognac", hex: "#15140f" } ],
    sizes: ["85", "90", "95", "100", "105"], material: "Calfskin leather", stock: 28, rating: 4.5, reviewCount: 30,
    tags: ["leather", "reversible"], newArrival: true,
    palette: ["#1b1814", "#4f4232"],
    specs: [
      { label: "Width", value: "3.5 cm" }, { label: "Buckle", value: "Brushed gold-tone" }, { label: "Made in", value: "Italy" },
    ],
  },
];

export const reviews: Record<string, Review[]> = {
  "p-001": [
    { id: "r1", author: "Eleanor V.", rating: 5, title: "Worth every cent", verified: true, date: "2026-05-12",
      body: "The leather is extraordinary and the clasp feels like jewelry. It has become my everyday bag." },
    { id: "r2", author: "Priya M.", rating: 5, title: "Timeless", verified: true, date: "2026-04-28",
      body: "Structured but not stiff. I sized down on worry about capacity but it holds more than expected." },
    { id: "r3", author: "Daniel R.", rating: 4, title: "Beautiful, slight wait", verified: true, date: "2026-03-19",
      body: "Bought for my wife. Shipping took a little longer but the packaging and product were impeccable." },
  ],
  "p-015": [
    { id: "r4", author: "Marco T.", rating: 5, title: "My signature now", verified: true, date: "2026-06-01",
      body: "Lasts all day and the trail is incredible. Compliments every single time." },
    { id: "r5", author: "Aisha K.", rating: 5, title: "Deep and warm", verified: true, date: "2026-05-22",
      body: "Unisex done right. The oud is smooth, never harsh." },
  ],
};

/** Generic fallback reviews for products without bespoke entries. */
export const genericReviews: Review[] = [
  { id: "g1", author: "Verified Buyer", rating: 5, title: "Exceptional quality", verified: true, date: "2026-05-30",
    body: "Exceeded expectations — the craftsmanship is evident the moment you unbox it." },
  { id: "g2", author: "Verified Buyer", rating: 4, title: "Beautiful piece", verified: true, date: "2026-05-08",
    body: "Looks even better in person. Would happily buy from this house again." },
];
