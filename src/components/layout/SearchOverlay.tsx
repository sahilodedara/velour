"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowUpRight } from "lucide-react";
import { ProductArtwork } from "@/components/product/ProductArtwork";
import { searchProducts, getBrand, getBrandName } from "@/data";
import { useUI } from "@/store/ui";
import { formatPrice } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const POPULAR = ["Top-Handle Bag", "Cashmere", "Oud", "Sneakers", "Moonphase", "Gold"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("velour-recent") ?? "[]"));
    } catch {
      /* ignore */
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => (q.trim().length > 1 ? searchProducts(q, 6) : []), [q]);

  const commit = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem("velour-recent", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setSearchOpen(false);
    setQ("");
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 glass-noir"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          />
          <motion.div
            className="absolute inset-x-0 top-0 bg-bg-elevated shadow-luxe"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="container-luxe py-8">
              <div className="flex items-center gap-4 border-b border-line pb-4">
                <Search size={22} className="text-gold-deep" />
                <form
                  className="flex-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (q.trim()) commit(q.trim());
                  }}
                >
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search for pieces, houses or categories…"
                    className="w-full bg-transparent font-display text-2xl placeholder:text-ink-muted focus:outline-none md:text-3xl"
                  />
                </form>
                <button aria-label="Close search" onClick={() => setSearchOpen(false)} className="text-ink-muted hover:text-gold-deep">
                  <X size={24} />
                </button>
              </div>

              <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.4fr]">
                {/* Suggestions */}
                <div className="space-y-8">
                  {recent.length > 0 && (
                    <div>
                      <p className="eyebrow mb-4">Recent</p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button key={r} onClick={() => commit(r)} className="hairline px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-gold hover:text-gold-deep">
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="eyebrow mb-4">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((p) => (
                        <button key={p} onClick={() => commit(p)} className="hairline px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-gold hover:text-gold-deep">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live results */}
                <div className="min-h-[120px]">
                  <p className="eyebrow mb-4">{results.length ? "Results" : "Start typing"}</p>
                  <div className="space-y-1">
                    {results.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex items-center gap-4 rounded-[var(--radius-luxe)] p-2 transition-colors hover:bg-bg-sunken"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden">
                            <ProductArtwork palette={p.palette} monogram={getBrand(p.brand)?.monogram ?? "V"} category={p.category} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ink-muted">{getBrandName(p.brand)}</p>
                            <p className="truncate text-sm">{p.name}</p>
                          </div>
                          <span className="text-sm text-ink-soft">{formatPrice(p.price)}</span>
                          <ArrowUpRight size={15} className="text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
