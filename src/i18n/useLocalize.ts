"use client";

import { useLang } from "./provider";
import {
  localizeProduct,
  localizeCategory,
  localizeCategoryName,
  localizeBrandDesc,
  type LocalizedProduct,
} from "@/data/i18n";
import type { Brand, Category, Product } from "@/data/types";

/** Localization helpers bound to the current language. */
export function useLocalize() {
  const { lang } = useLang();
  return {
    lang,
    lp: (p: Product): LocalizedProduct => localizeProduct(p, lang),
    lc: (c: Category) => localizeCategory(c, lang),
    lcn: (slug: string, fallback: string) => localizeCategoryName(slug, fallback, lang),
    lbd: (b: Brand) => localizeBrandDesc(b.slug, b.description, lang),
  };
}
