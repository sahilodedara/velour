"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { ProductArtwork } from "./ProductArtwork";
import { QuickView } from "./QuickView";
import { Badge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/Stars";
import type { Product } from "@/data/types";
import { getBrand, getBrandName } from "@/data";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useHasMounted } from "@/lib/useHasMounted";
import { toCartLine } from "@/lib/cart-helpers";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";
import { cn, formatPrice, discountPercent } from "@/lib/utils";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const mounted = useHasMounted();
  const t = useT();
  const { lp } = useLocalize();

  const brand = getBrandName(product.brand);
  const name = lp(product).name;
  const monogram = getBrand(product.brand)?.monogram ?? "V";
  const disc = discountPercent(product.price, product.originalPrice);
  const needsChoice = (product.sizes?.length ?? 0) > 0;

  const quickAdd = () => {
    if (needsChoice) {
      setQuickOpen(true);
      return;
    }
    add(toCartLine(product, { color: product.colors[0]?.name }));
    setCartOpen(true);
  };

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-sunken">
        <Link href={`/product/${product.slug}`} aria-label={name} className="block h-full w-full">
          {/* primary */}
          <div className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-luxe)] group-hover:opacity-0">
            <ProductArtwork palette={product.palette} monogram={monogram} category={product.category} name={name} />
          </div>
          {/* alternate "shot" revealed on hover */}
          <div className="absolute inset-0 scale-105 opacity-0 transition-all duration-700 ease-[var(--ease-luxe)] group-hover:scale-110 group-hover:opacity-100">
            <ProductArtwork palette={[product.palette[1], product.palette[0]]} monogram={monogram} category={product.category} />
          </div>
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-2">
          {disc > 0 && <Badge tone="sale">−{disc}%</Badge>}
          {product.newArrival && <Badge tone="ink">{t("card.new")}</Badge>}
          {product.bestSeller && !product.newArrival && <Badge tone="gold">{t("card.bestseller")}</Badge>}
        </div>

        {/* wishlist */}
        <button
          onClick={() => toggleWish(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-bg-elevated/80 text-ink backdrop-blur transition-colors hover:text-gold-deep"
        >
          <Heart size={16} className={cn(mounted && wished && "fill-gold text-gold")} />
        </button>

        {/* hover actions */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-px bg-line opacity-0 transition-all duration-500 ease-[var(--ease-luxe)] group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => setQuickOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 bg-bg-elevated py-3 text-[0.66rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-bg"
          >
            <Eye size={14} /> {t("card.quickView")}
          </button>
          <button
            onClick={quickAdd}
            className="flex flex-1 items-center justify-center gap-2 bg-gold py-3 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-ink-on-gold transition-colors hover:bg-gold-bright"
          >
            <ShoppingBag size={14} /> {needsChoice ? t("card.select") : t("card.add")}
          </button>
        </div>
      </div>

      {/* meta */}
      <Link href={`/product/${product.slug}`} className="mt-4 block">
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-muted">{brand}</p>
        <h3 className="mt-1 text-sm leading-snug transition-colors group-hover:text-gold-deep">{name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-ink-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <Stars rating={product.rating} size={12} />
        </div>
      </Link>

      <QuickView product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </article>
  );
}
