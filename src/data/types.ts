/** Domain models for the VELOUR catalog. Mirrors the Supabase schema in /supabase/schema.sql. */

export interface Category {
  slug: string;
  name: string;
  /** Parent category slug, for nested navigation. */
  parent?: string;
  tagline?: string;
  /** Two-stop gradient used for the generated category artwork. */
  palette: [string, string];
}

export interface Brand {
  slug: string;
  name: string;
  /** 1–2 letters used to render the original generated logo mark. */
  monogram: string;
  description: string;
  featured?: boolean;
  est?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified?: boolean;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Brand slug. */
  brand: string;
  /** Category slug. */
  category: string;
  subcategory?: string;
  sku: string;

  price: number;
  originalPrice?: number;

  shortDescription: string;
  description: string;

  colors: ColorOption[];
  sizes?: string[];
  material: string;

  stock: number;
  rating: number;
  reviewCount: number;

  tags: string[];
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;

  /** Two-stop gradient seed for the generated product artwork. */
  palette: [string, string];
  specs: { label: string; value: string }[];
}

export type SortKey =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount";
