"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProductArtwork } from "@/components/product/ProductArtwork";
import {
  getCategory,
  getSubcategories,
  getBrand,
  brands,
  products,
} from "@/data";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";
import { formatPrice } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MegaMenu({ category, onNavigate }: { category: string; onNavigate: () => void }) {
  const t = useT();
  const { lcn, lp } = useLocalize();
  const cat = getCategory(category);
  const subs = getSubcategories(category);
  const featuredBrands = brands.filter((b) => b.featured).slice(0, 6);
  const feature =
    products.find((p) => p.category === category && p.featured) ??
    products.find((p) => p.category === category);

  const edit = [
    { label: t("mega.newArrivals"), href: `/shop?category=${category}&sort=newest` },
    { label: t("mega.bestSellers"), href: `/shop?category=${category}&sort=rating` },
    { label: t("mega.onSale"), href: `/shop?category=${category}&sale=1` },
    { label: t("mega.all", { name: lcn(category, cat?.name ?? "") }), href: `/shop?category=${category}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="glass border-b border-line shadow-card"
    >
      <div className="container-luxe grid grid-cols-12 gap-8 py-10 text-ink">
        {/* Categories */}
        <div className="col-span-3">
          <p className="eyebrow mb-5">{t("mega.categories")}</p>
          <ul className="space-y-3">
            {(subs.length ? subs : [cat!]).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/shop?category=${s.slug}`}
                  onClick={onNavigate}
                  className="link-underline text-sm text-ink-soft transition-colors hover:text-gold-deep"
                >
                  {lcn(s.slug, s.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Houses */}
        <div className="col-span-3">
          <p className="eyebrow mb-5">{t("mega.houses")}</p>
          <ul className="space-y-3">
            {featuredBrands.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/shop?brand=${b.slug}`}
                  onClick={onNavigate}
                  className="link-underline text-sm text-ink-soft transition-colors hover:text-gold-deep"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* The Edit */}
        <div className="col-span-2">
          <p className="eyebrow mb-5">{t("mega.edit")}</p>
          <ul className="space-y-3">
            {edit.map((e) => (
              <li key={e.label}>
                <Link
                  href={e.href}
                  onClick={onNavigate}
                  className="link-underline text-sm text-ink-soft transition-colors hover:text-gold-deep"
                >
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured product */}
        {feature && (
          <Link
            href={`/product/${feature.slug}`}
            onClick={onNavigate}
            className="group col-span-4"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-105">
                <ProductArtwork
                  palette={feature.palette}
                  monogram={getBrand(feature.brand)?.monogram ?? "V"}
                  category={feature.category}
                  name={feature.name}
                />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 to-transparent p-5">
                <div className="text-white">
                  <p className="eyebrow !text-white/70">{t("mega.featured")}</p>
                  <p className="mt-1 font-display text-lg leading-tight">{lp(feature).name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                    {formatPrice(feature.price)}
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
