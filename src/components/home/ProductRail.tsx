"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { getTrending, getNewArrivals, getBestSellers } from "@/data";
import { useT } from "@/i18n/provider";
import type { Product } from "@/data/types";

const TABS: { key: string; labelKey: string; get: () => Product[] }[] = [
  { key: "trending", labelKey: "rail.trending", get: getTrending },
  { key: "new", labelKey: "rail.newArrivals", get: getNewArrivals },
  { key: "best", labelKey: "rail.bestSellers", get: getBestSellers },
];

export function ProductRail() {
  const t = useT();
  const [tab, setTab] = useState("trending");
  const active = TABS.find((t) => t.key === tab)!;
  const items = active.get().slice(0, 8);

  return (
    <section className="bg-bg-sunken py-24 md:py-32">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-gold" /> {t("rail.eyebrow")}
              </p>
              <h2 className="font-display text-3xl leading-tight md:text-[2.7rem]">
                {t("rail.title")}
              </h2>
            </div>

            {/* tabs */}
            <div className="flex flex-wrap gap-1 border-b border-line">
              {TABS.map((tb) => (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className="relative px-4 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors hover:text-gold-deep"
                >
                  <span className={tab === tb.key ? "text-ink" : "text-ink-muted"}>{t(tb.labelKey)}</span>
                  {tab === tb.key && (
                    <motion.span layoutId="rail-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal className="mt-14 flex justify-center">
          <Link
            href="/shop"
            className="link-underline inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-ink"
          >
            {t("rail.viewAll")} <ArrowRight size={16} className="text-gold-deep" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
