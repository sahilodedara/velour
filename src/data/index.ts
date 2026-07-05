import { brands as seedBrands, categories, products as seedProducts, reviews, genericReviews } from "./catalog";
import { importedBrands, importedProducts } from "./imported";
import { signatureProducts } from "./signature";
import { collectionBrands, collectionProducts } from "./collection";
import { shoeProducts } from "./shoes";
import { extraBrands, extraProducts } from "./extras";
import type { Brand, Category, Product, Review, SortKey } from "./types";
import { discountPercent } from "@/lib/utils";

/** Convenient "charm" pricing: every price ≤ $1099 and ends in 99 (e.g. $499, $699),
 *  so nothing feels out of reach. High-end pieces compress into a $699–$1099 band. */
function seededUnit(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 1000) / 1000;
}
function charm(price: number, seed: string): number {
  if (price <= 1099) return Math.min(1099, Math.max(99, Math.round((price - 99) / 100) * 100 + 99));
  const bands = price >= 6000 ? [999, 1099] : price >= 3000 ? [899, 999] : price >= 2000 ? [799, 899] : [699, 799];
  return bands[Math.floor(seededUnit(seed) * bands.length)];
}
function normPrice(p: Product): Product {
  const price = charm(p.price, p.id);
  let originalPrice = p.originalPrice ? charm(p.originalPrice, `${p.id}o`) : undefined;
  if (originalPrice != null && originalPrice <= price) originalPrice = undefined;
  return { ...p, price, originalPrice };
}

/** Seed catalog + signature + imports + demo collection + shoes + extras (perfumes/accessories). */
const allBrands: Brand[] = [...seedBrands, ...importedBrands, ...collectionBrands, ...extraBrands];
export const brands: Brand[] = allBrands.filter((b, i) => allBrands.findIndex((x) => x.slug === b.slug) === i);
export const products: Product[] = [
  ...collectionProducts, ...shoeProducts, ...seedProducts, ...signatureProducts, ...importedProducts, ...extraProducts,
].map(normPrice);
export { categories };
export type { Brand, Category, Product, Review, SortKey };

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getBrandName(slug: string): string {
  return getBrand(slug)?.name ?? slug;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getTopCategories(): Category[] {
  return categories.filter((c) => !c.parent);
}

export function getSubcategories(parent: string): Category[] {
  return categories.filter((c) => c.parent === parent);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}
export function getTrending(): Product[] {
  return products.filter((p) => p.trending);
}
export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}
export function getNewArrivals(): Product[] {
  return products.filter((p) => p.newArrival);
}
export function getOnSale(): Product[] {
  return products.filter((p) => p.originalPrice && p.originalPrice > p.price);
}

export function getReviews(productId: string): Review[] {
  return reviews[productId] ?? genericReviews;
}

export function getRelated(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, limit);
}

export interface FilterState {
  categories: string[]; // matches category OR subcategory slug
  brands: string[];
  colors: string[];
  sizes: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onSaleOnly?: boolean;
  inStockOnly?: boolean;
  search?: string;
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating,
  newest: (a, b) => Number(!!b.newArrival) - Number(!!a.newArrival),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  discount: (a, b) => discountPercent(b.price, b.originalPrice) - discountPercent(a.price, a.originalPrice),
};

export function queryProducts(
  filters: Partial<FilterState> = {},
  sort: SortKey = "featured",
  source: Product[] = products,
): Product[] {
  const q = filters.search?.trim().toLowerCase();
  const result = source.filter((p) => {
    if (filters.categories?.length) {
      if (!filters.categories.includes(p.category) && !(p.subcategory && filters.categories.includes(p.subcategory)))
        return false;
    }
    if (filters.brands?.length && !filters.brands.includes(p.brand)) return false;
    if (filters.colors?.length && !p.colors.some((c) => filters.colors!.includes(c.name))) return false;
    if (filters.sizes?.length && !(p.sizes ?? []).some((s) => filters.sizes!.includes(s))) return false;
    if (filters.minPrice != null && p.price < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
    if (filters.minRating != null && p.rating < filters.minRating) return false;
    if (filters.onSaleOnly && !(p.originalPrice && p.originalPrice > p.price)) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    if (q) {
      const hay = `${p.name} ${getBrandName(p.brand)} ${p.category} ${p.tags.join(" ")} ${p.material}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return result.sort(sorters[sort]);
}

export function searchProducts(query: string, limit = 6): Product[] {
  return queryProducts({ search: query }, "rating").slice(0, limit);
}

/** Distinct color names across the catalog, for filter facets. */
export function allColors(): string[] {
  return Array.from(new Set(products.flatMap((p) => p.colors.map((c) => c.name)))).sort();
}
export function allSizes(): string[] {
  return Array.from(new Set(products.flatMap((p) => p.sizes ?? []))).sort();
}
export function priceBounds(): [number, number] {
  const prices = products.map((p) => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}
