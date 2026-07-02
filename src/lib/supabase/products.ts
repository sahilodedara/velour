import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/data/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapRow(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand_slug,
    category: r.category_slug,
    subcategory: r.subcategory_slug ?? undefined,
    sku: r.sku,
    price: Number(r.price),
    originalPrice: r.original_price != null ? Number(r.original_price) : undefined,
    shortDescription: r.short_description ?? "",
    description: r.description ?? "",
    colors: (r.product_colors ?? []).map((c: any) => ({ name: c.name, hex: c.hex })),
    sizes: (r.product_sizes ?? []).length ? (r.product_sizes as any[]).map((s) => s.label) : undefined,
    material: r.material ?? "—",
    stock: r.stock ?? 0,
    rating: Number(r.rating ?? 5),
    reviewCount: r.review_count ?? 0,
    tags: r.tags ?? [],
    featured: r.featured ?? false,
    trending: r.trending ?? false,
    bestSeller: r.best_seller ?? false,
    newArrival: r.new_arrival ?? false,
    palette: Array.isArray(r.palette) && r.palette.length === 2 ? [r.palette[0], r.palette[1]] : ["#1c1b18", "#7a6a44"],
    specs: (r.product_specs ?? []).map((s: any) => ({ label: s.label, value: s.value })),
    images: (r.product_images ?? [])
      .slice()
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((i: any) => i.url),
    video: r.video_url ?? undefined,
    custom: true,
  };
}

/** Read all admin-created products (public, anon-readable). */
export async function fetchDbProducts(sb: SupabaseClient): Promise<Product[]> {
  const { data, error } = await sb
    .from("products")
    .select("*, product_colors(*), product_sizes(*), product_specs(*), product_images(*)")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[velour] fetchDbProducts:", error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

/** Insert a product + its colors/sizes/specs (requires a signed-in admin session). */
export async function insertDbProduct(
  sb: SupabaseClient,
  p: Product,
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await sb
    .from("products")
    .insert({
      slug: p.slug,
      name: p.name,
      brand_slug: p.brand,
      category_slug: p.category,
      subcategory_slug: p.subcategory ?? null,
      sku: p.sku,
      price: p.price,
      original_price: p.originalPrice ?? null,
      short_description: p.shortDescription,
      description: p.description,
      material: p.material,
      stock: p.stock,
      rating: p.rating,
      review_count: p.reviewCount,
      tags: p.tags,
      featured: p.featured ?? false,
      trending: p.trending ?? false,
      best_seller: p.bestSeller ?? false,
      new_arrival: p.newArrival ?? false,
      palette: p.palette,
      video_url: p.video ?? null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  const id = data.id as string;

  if (p.images?.length) {
    await sb.from("product_images").insert(
      p.images.map((url, i) => ({ product_id: id, url, position: i, is_thumb: i === 0 })),
    );
  }

  if (p.colors.length) {
    await sb.from("product_colors").insert(p.colors.map((c) => ({ product_id: id, name: c.name, hex: c.hex })));
  }
  if (p.sizes?.length) {
    await sb.from("product_sizes").insert(p.sizes.map((s) => ({ product_id: id, label: s })));
  }
  if (p.specs.length) {
    await sb.from("product_specs").insert(p.specs.map((s) => ({ product_id: id, label: s.label, value: s.value })));
  }
  return { ok: true };
}

/** Update a product + replace its colors/sizes/specs/images (requires admin session). */
export async function updateDbProduct(
  sb: SupabaseClient,
  p: Product,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await sb
    .from("products")
    .update({
      name: p.name, brand_slug: p.brand, category_slug: p.category, subcategory_slug: p.subcategory ?? null,
      sku: p.sku, price: p.price, original_price: p.originalPrice ?? null,
      short_description: p.shortDescription, description: p.description, material: p.material,
      stock: p.stock, rating: p.rating, review_count: p.reviewCount, tags: p.tags,
      featured: p.featured ?? false, trending: p.trending ?? false, best_seller: p.bestSeller ?? false,
      new_arrival: p.newArrival ?? false, palette: p.palette, video_url: p.video ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", p.id);
  if (error) return { ok: false, error: error.message };

  // Replace related rows.
  await Promise.all([
    sb.from("product_colors").delete().eq("product_id", p.id),
    sb.from("product_sizes").delete().eq("product_id", p.id),
    sb.from("product_specs").delete().eq("product_id", p.id),
    sb.from("product_images").delete().eq("product_id", p.id),
  ]);
  if (p.colors.length) await sb.from("product_colors").insert(p.colors.map((c) => ({ product_id: p.id, name: c.name, hex: c.hex })));
  if (p.sizes?.length) await sb.from("product_sizes").insert(p.sizes.map((s) => ({ product_id: p.id, label: s })));
  if (p.specs.length) await sb.from("product_specs").insert(p.specs.map((s) => ({ product_id: p.id, label: s.label, value: s.value })));
  if (p.images?.length) await sb.from("product_images").insert(p.images.map((url, i) => ({ product_id: p.id, url, position: i, is_thumb: i === 0 })));
  return { ok: true };
}

/** Delete a product (sub-tables cascade via FK). */
export async function deleteDbProduct(sb: SupabaseClient, id: string): Promise<void> {
  await sb.from("products").delete().eq("id", id);
}
