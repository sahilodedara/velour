"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Check as CheckIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { FilterPanel } from "./FilterPanel";
import { queryProducts, getCategory, getBrandName } from "@/data";
import type { FilterState, SortKey } from "@/data";
import { useHasMounted } from "@/lib/useHasMounted";
import { cn } from "@/lib/utils";

const EMPTY: FilterState = { categories: [], brands: [], colors: [], sizes: [] };
const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
  { key: "discount", label: "Biggest Discount" },
];

export function ShopClient() {
  const sp = useSearchParams();
  const mounted = useHasMounted();
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

  const results = useMemo(() => queryProducts(filters, sort), [filters, sort]);

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
    ? `Results for “${filters.search}”`
    : filters.categories.length === 1
      ? getCategory(filters.categories[0])?.name ?? "The Edit"
      : filters.brands.length === 1
        ? getBrandName(filters.brands[0])
        : "The Edit";

  return (
    <div className="pt-28 md:pt-36">
      {/* Title band */}
      <Container className="pb-8">
        <p className="eyebrow mb-3">VELOUR · Shop</p>
        <h1 className="font-display text-4xl md:text-6xl">{heading}</h1>
        <p className="mt-3 text-sm text-ink-muted">
          {results.length} piece{results.length === 1 ? "" : "s"}
        </p>
      </Container>

      <Container className="pb-28">
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em]">Filters</span>
                {activeCount > 0 && (
                  <button onClick={() => setFilters(EMPTY)} className="text-xs text-ink-muted underline hover:text-gold-deep">
                    Clear all
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
                <SlidersHorizontal size={16} /> Filters
                {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-[0.6rem] text-ink-on-gold">{activeCount}</span>}
              </button>
              <span className="hidden text-sm text-ink-muted lg:block">
                {activeCount > 0 ? `${activeCount} filter${activeCount === 1 ? "" : "s"} applied` : "Showing the full edit"}
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
                <span className="font-display text-xl">Filters</span>
                <button aria-label="Close filters" onClick={() => setDrawerOpen(false)}><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">
                <FilterPanel filters={filters} setFilters={setFilters} />
              </div>
              <div className="flex gap-3 border-t border-line px-6 py-4">
                <button onClick={() => setFilters(EMPTY)} className="flex-1 border border-line py-3 text-xs uppercase tracking-[0.18em]">Clear</button>
                <button onClick={() => setDrawerOpen(false)} className="flex-1 bg-ink py-3 text-xs uppercase tracking-[0.18em] text-bg">Show {results.length}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortDropdown({ sort, setSort }: { sort: SortKey; setSort: (s: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const current = SORTS.find((s) => s.key === sort)!;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 text-sm"
      >
        <span className="text-ink-muted">Sort:</span>
        <span className="font-medium">{current.label}</span>
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
                  {s.label}
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
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h3 className="font-display text-2xl">Nothing matches just yet</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        Try relaxing a filter or two — the perfect piece may be a tweak away.
      </p>
      <button onClick={onReset} className="mt-6 border border-ink/30 px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-deep">
        Clear all filters
      </button>
    </div>
  );
}
