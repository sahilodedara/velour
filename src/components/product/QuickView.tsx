"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { Badge } from "@/components/ui/Badge";
import { ProductArtwork } from "./ProductArtwork";
import type { Product } from "@/data/types";
import { getBrand, getBrandName } from "@/data";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { toCartLine } from "@/lib/cart-helpers";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";
import { formatPrice, discountPercent } from "@/lib/utils";

export function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const t = useT();
  const { lp } = useLocalize();
  const lz = lp(product);
  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState(product.sizes?.[0]);
  const disc = discountPercent(product.price, product.originalPrice);
  const colorLabel = lz.colors[product.colors.findIndex((c) => c.name === color)]?.name ?? color;

  const handleAdd = () => {
    add(toCartLine(product, { color, size }));
    onClose();
    setCartOpen(true);
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden">
          <ProductArtwork palette={product.palette} monogram={getBrand(product.brand)?.monogram ?? "V"} category={product.category} name={product.name} />
          {disc > 0 && <Badge tone="sale" className="absolute left-3 top-3">−{disc}%</Badge>}
        </div>

        <div className="flex flex-col">
          <p className="eyebrow">{getBrandName(product.brand)}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight">{lz.name}</h3>
          <div className="mt-3">
            <Stars rating={product.rating} count={product.reviewCount} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-ink-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{lz.shortDescription}</p>

          {product.colors.length > 1 && (
            <div className="mt-5">
              <p className="mb-2 text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">{t("quick.color")}: {colorLabel}</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={`h-7 w-7 rounded-full border transition-transform ${color === c.name ? "scale-110 border-gold ring-2 ring-gold/40" : "border-line"}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-5">
              <p className="mb-2 text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">{t("quick.size")}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-11 border px-3 py-2 text-sm transition-colors ${size === s ? "border-gold bg-gold text-ink-on-gold" : "border-line hover:border-gold-deep"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6">
            <Button onClick={handleAdd} variant="gold" size="lg" className="w-full">
              <ShoppingBag size={16} /> {t("quick.addToBag", { price: formatPrice(product.price) })}
            </Button>
            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="mt-3 flex items-center justify-center gap-1 text-xs uppercase tracking-[0.2em] text-ink-muted hover:text-gold-deep"
            >
              {t("quick.viewDetails")}
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
              <Check size={13} className="text-success" /> {t("quick.inStock", { n: product.stock })}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
