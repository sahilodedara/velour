import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { site } from "@/config/site";

/** Merge Tailwind classes with conditional logic, de-duplicating conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as the store's currency (no trailing cents when whole-ish for luxury feel kept simple). */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(site.currency.locale, {
    style: "currency",
    currency: site.currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Percentage discount between an original and selling price. Returns 0 when not discounted. */
export function discountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** Deterministic pseudo-random in [0,1) from a string seed — used for stable generated artwork. */
export function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // xorshift mix
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return ((h >>> 0) % 100000) / 100000;
}

/** Format a Date as a readable, locale-aware string. */
export function formatDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat(site.currency.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/** Format a Date as HH:MM (24h with am/pm) for order timestamps. */
export function formatTime(d: Date = new Date()): string {
  return new Intl.DateTimeFormat(site.currency.locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
