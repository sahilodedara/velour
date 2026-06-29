import type { Product } from "@/data/types";
import { getBrand, getBrandName } from "@/data";
import type { CartLine } from "@/store/cart";

/** Build the cart-line payload (sans key/quantity) for a product + chosen options. */
export function toCartLine(
  p: Product,
  opts: { color?: string; size?: string } = {},
): Omit<CartLine, "key" | "quantity"> {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    brand: getBrandName(p.brand),
    price: p.price,
    originalPrice: p.originalPrice,
    palette: p.palette,
    category: p.category,
    monogram: getBrand(p.brand)?.monogram ?? "V",
    color: opts.color,
    size: opts.size,
    material: p.material,
    maxStock: p.stock,
  };
}
