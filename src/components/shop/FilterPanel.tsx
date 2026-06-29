"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getTopCategories,
  getSubcategories,
  brands,
  allColors,
  allSizes,
} from "@/data";
import type { FilterState } from "@/data";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";
import { localizeTerm } from "@/data/i18n";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { labelKey: "filter.under500", min: 0, max: 499 },
  { labelKey: "filter.r1", min: 500, max: 1500 },
  { labelKey: "filter.r2", min: 1500, max: 3000 },
  { labelKey: "filter.over3000", min: 3000, max: undefined },
];

const top = getTopCategories();
const colors = allColors();
const sizes = allSizes();

export function FilterPanel({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}) {
  const t = useT();
  const { lang, lcn } = useLocalize();
  const toggleArr = (key: "categories" | "brands" | "colors" | "sizes", value: string) => {
    const arr = filters[key];
    setFilters({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  return (
    <div className="space-y-1 divide-y divide-line">
      <Section title={t("filter.category")} defaultOpen>
        <div className="space-y-3">
          {top.map((c) => {
            const subs = getSubcategories(c.slug);
            return (
              <div key={c.slug}>
                <Check
                  label={lcn(c.slug, c.name)}
                  checked={filters.categories.includes(c.slug)}
                  onChange={() => toggleArr("categories", c.slug)}
                  bold
                />
                {subs.length > 0 && (
                  <div className="ml-5 mt-2 space-y-2">
                    {subs.map((s) => (
                      <Check
                        key={s.slug}
                        label={lcn(s.slug, s.name)}
                        checked={filters.categories.includes(s.slug)}
                        onChange={() => toggleArr("categories", s.slug)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={t("filter.houses")} defaultOpen>
        <div className="space-y-2.5">
          {brands.map((b) => (
            <Check
              key={b.slug}
              label={b.name}
              checked={filters.brands.includes(b.slug)}
              onChange={() => toggleArr("brands", b.slug)}
            />
          ))}
        </div>
      </Section>

      <Section title={t("filter.price")}>
        <div className="space-y-2.5">
          {PRICE_RANGES.map((r) => {
            const active = filters.minPrice === r.min && filters.maxPrice === r.max;
            return (
              <button
                key={r.labelKey}
                onClick={() =>
                  setFilters({
                    ...filters,
                    minPrice: active ? undefined : r.min,
                    maxPrice: active ? undefined : r.max,
                  })
                }
                className={cn(
                  "block text-sm transition-colors",
                  active ? "text-gold-deep" : "text-ink-soft hover:text-ink",
                )}
              >
                <span className={cn("mr-2 inline-block h-3 w-3 border align-middle", active ? "border-gold bg-gold" : "border-line-strong")} />
                {t(r.labelKey)}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t("filter.color")}>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => toggleArr("colors", c)}
              className={cn(
                "border px-3 py-1.5 text-xs transition-colors",
                filters.colors.includes(c) ? "border-gold bg-gold text-ink-on-gold" : "border-line text-ink-soft hover:border-gold-deep",
              )}
            >
              {localizeTerm(c, lang)}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t("filter.size")}>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => toggleArr("sizes", s)}
              className={cn(
                "min-w-10 border px-2.5 py-1.5 text-xs transition-colors",
                filters.sizes.includes(s) ? "border-gold bg-gold text-ink-on-gold" : "border-line text-ink-soft hover:border-gold-deep",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t("filter.ratingAvail")}>
        <div className="space-y-2.5">
          <Check
            label={t("filter.rating4")}
            checked={filters.minRating === 4}
            onChange={() => setFilters({ ...filters, minRating: filters.minRating === 4 ? undefined : 4 })}
          />
          <Check
            label={t("filter.onSale")}
            checked={!!filters.onSaleOnly}
            onChange={() => setFilters({ ...filters, onSaleOnly: !filters.onSaleOnly })}
          />
          <Check
            label={t("filter.inStock")}
            checked={!!filters.inStockOnly}
            onChange={() => setFilters({ ...filters, inStockOnly: !filters.inStockOnly })}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="py-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em]">{title}</span>
        <ChevronDown size={15} className={cn("text-ink-muted transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
  bold,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  bold?: boolean;
}) {
  return (
    <button onClick={onChange} className="flex items-center gap-2.5 text-left">
      <span className={cn("grid h-4 w-4 shrink-0 place-items-center border transition-colors", checked ? "border-gold bg-gold" : "border-line-strong")}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" className="text-ink-on-gold">
            <path d="M2 6l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={cn("text-sm transition-colors", checked ? "text-ink" : "text-ink-soft", bold && "font-medium")}>
        {label}
      </span>
    </button>
  );
}
