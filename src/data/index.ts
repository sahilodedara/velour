import { brands as seedBrands, categories, products as seedProducts, reviews, genericReviews } from "./catalog";
import { importedBrands, importedProducts } from "./imported";
import { signatureProducts } from "./signature";
import type { Brand, Category, Product, Review, SortKey } from "./types";
import { discountPercent } from "@/lib/utils";

/** Seed catalog + signature pieces + products imported from Shopify sample CSVs. */
export const brands: Brand[] = [...seedBrands, ...importedBrands];
export const products: Product[] = [...seedProducts, ...signatureProducts, ...importedProducts];
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
