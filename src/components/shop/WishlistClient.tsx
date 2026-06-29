"use client";

import { Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { products } from "@/data";
import { useWishlist } from "@/store/wishlist";
import { useHasMounted } from "@/lib/useHasMounted";
import { useT } from "@/i18n/provider";

export function WishlistClient() {
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const mounted = useHasMounted();
  const t = useT();
  const items = mounted ? products.filter((p) => ids.includes(p.id)) : [];

  return (
    <div className="pt-28 md:pt-36">
      <Container className="pb-28">
        <div className="flex items-end justify-between border-b border-line pb-8">
          <div>
            <p className="eyebrow mb-3">{t("wishlist.eyebrow")}</p>
            <h1 className="font-display text-4xl md:text-6xl">{t("wishlist.title")}</h1>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="text-xs uppercase tracking-[0.18em] text-ink-muted hover:text-danger">
              {t("wishlist.clearAll")}
            </button>
          )}
        </div>

        {!mounted ? (
          <div className="py-24" />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-bg-sunken text-ink-muted">
              <Heart size={28} strokeWidth={1.2} />
            </div>
            <h2 className="mt-6 font-display text-2xl">{t("wishlist.emptyTitle")}</h2>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">
              {t("wishlist.emptyDesc")}
            </p>
            <Button href="/shop" variant="primary" size="md" className="mt-7">{t("wishlist.browse")}</Button>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </Container>
    </div>
  );
}
