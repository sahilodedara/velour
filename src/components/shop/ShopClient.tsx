"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Check as CheckIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { FilterPanel } from "./FilterPanel";
import { queryProducts, getCategory, getBrandName, products } from "@/data";
import type { FilterState, SortKey } from "@/data";
import { useCustomProducts } from "@/store/useCustomProducts";
import { useHasMounted } from "@/lib/useHasMounted";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";
import { cn } from "@/lib/utils";

const EMPTY: FilterState = { categories: [], brands: [], colors: [], sizes: [] };
const SORTS: { key: SortKey; labelKey: string }[] = [
  { key: "featured", labelKey: "shop.sortFeatured" },
  { key: "newest", labelKey: "shop.sortNewest" },
  { key: "price-asc", labelKey: "shop.sortPriceAsc" },
  { key: "price-desc", labelKey: "shop.sortPriceDesc" },
  { key: "rating", labelKey: "shop.sortRating" },
  { key: "discount", labelKey: "shop.sortDiscount" },
];

export function ShopClient() {
  const sp = useSearchParams();
  const mounted = useHasMounted();
  const t = useT();
  const { lcn } = useLocalize();
  const { items: custom } = useCustomProducts();
  const [filters, setFilters] = useState<FilterState>(EMPTY);
  const [sort, setSort] = useState<SortKey>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync from URL (mega-menu / nav links) on mount and when params change.
  const spKey = sp.toString();
  useEffect(() => {
    setFilters({
      categories: sp.get("category") ? [sp.get("category")!] : [],
      brands: sp.get("brand") ? [sp.get("brand")!] : [],
      colors: [],
      sizes: [],
      onSaleOnly: sp.get("sale") === "1" || undefined,
      search: sp.get("q") ?? undefined,
    });
    setSort((sp.get("sort") as SortKey) ?? "featured");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spKey]);

  const results = useMemo(
    () => queryProducts(filters, sort, [...custom, ...products]),
    [filters, sort, custom],
  );

  const activeCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.minPrice != null ? 1 : 0) +
    (filters.minRating != null ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  // Heading reflects the active context.
  const heading = filters.search
    ? t("shop.resultsFor", { q: filters.search })
    : filters.categories.length === 1
      ? lcn(filters.categories[0], getCategory(filters.categories[0])?.name ?? t("shop.edit"))
      : filters.brands.length === 1
        ? getBrandName(filters.brands[0])
        : t("shop.edit");

  return (
    <div className="pt-28 md:pt-36">
      {/* Title band */}
      <Container className="pb-8">
        <p className="eyebrow mb-3">{t("shop.crumb")}</p>
        <h1 className="font-display text-4xl md:text-6xl">{heading}</h1>
        <p className="mt-3 text-sm text-ink-muted">
          {results.length === 1 ? t("shop.piece", { n: results.length }) : t("shop.pieces", { n: results.length })}
        </p>
      </Container>

      <Container className="pb-28">
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em]">{t("shop.filters")}</span>
                {activeCount > 0 && (
                  <button onClick={() => setFilters(EMPTY)} className="text-xs text-ink-muted underline hover:text-gold-deep">
                    {t("shop.clearAll")}
                  </button>
                )}
              </div>
              <FilterPanel filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 text-sm lg:hidden"
              >
                <SlidersHorizontal size={16} /> {t("shop.filters")}
                {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-[0.6rem] text-ink-on-gold">{activeCount}</span>}
              </button>
              <span className="hidden text-sm text-ink-muted lg:block">
                {activeCount > 0 ? (activeCount === 1 ? t("shop.appliedOne") : t("shop.applied", { n: activeCount })) : t("shop.showingAll")}
              </span>
              <SortDropdown sort={sort} setSort={setSort} />
            </div>

            {/* Grid */}
            {!mounted ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <EmptyResults onReset={() => setFilters(EMPTY)} />
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3"
              >
                {results.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[75] lg:hidden">
            <motion.div className="absolute inset-0 glass-noir" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} />
            <motion.div
              className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-bg-elevated shadow-luxe"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <span className="font-display text-xl">{t("shop.filters")}</span>
                <button aria-label="Close filters" onClick={() => setDrawerOpen(false)}><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">
                <FilterPanel filters={filters} setFilters={setFilters} />
              </div>
              <div className="flex gap-3 border-t border-line px-6 py-4">
                <button onClick={() => setFilters(EMPTY)} className="flex-1 border border-line py-3 text-xs uppercase tracking-[0.18em]">{t("shop.clear")}</button>
                <button onClick={() => setDrawerOpen(false)} className="flex-1 bg-ink py-3 text-xs uppercase tracking-[0.18em] text-bg">{t("shop.show", { n: results.length })}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortDropdown({ sort, setSort }: { sort: SortKey; setSort: (s: SortKey) => void }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const current = SORTS.find((s) => s.key === sort)!;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 text-sm"
      >
        <span className="text-ink-muted">{t("shop.sort")}</span>
        <span className="font-medium">{t(current.labelKey)}</span>
        <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-20 mt-2 w-56 border border-line bg-bg-elevated py-2 shadow-luxe"
          >
            {SORTS.map((s) => (
              <li key={s.key}>
                <button
                  onMouseDown={() => { setSort(s.key); setOpen(false); }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-bg-sunken"
                >
                  {t(s.labelKey)}
                  {s.key === sort && <CheckIcon size={14} className="text-gold-deep" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyResults({ onReset }: { onReset: () => void }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h3 className="font-display text-2xl">{t("shop.emptyTitle")}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        {t("shop.emptyDesc")}
      </p>
      <button onClick={onReset} className="mt-6 border border-ink/30 px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-deep">
        {t("shop.clearFilters")}
      </button>
    </div>
  );
}
