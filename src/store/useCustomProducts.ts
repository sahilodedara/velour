"use client";

import { useEffect } from "react";
import { isSupabaseEnabled } from "@/lib/supabase/client";
import { useProducts } from "./products";
import { useDbProducts } from "./dbProducts";
import type { Product } from "@/data/types";

export interface CustomProductsApi {
  items: Product[];
  /** Persist a product. Returns ok/error (DB) or always-ok (local). */
  add: (p: Product) => Promise<{ ok: boolean; error?: string }>;
  remove: (id: string) => Promise<void>;
  /** True when products live in Supabase (global), false when local-only. */
  global: boolean;
}

/**
 * Single source for admin-created products.
 * Supabase-backed (visible to all customers) when configured; otherwise the
 * local, per-browser store. Hooks are always called (no conditional hooks).
 */
export function useCustomProducts(): CustomProductsApi {
  const localItems = useProducts((s) => s.items);
  const localAdd = useProducts((s) => s.add);
  const localRemove = useProducts((s) => s.remove);

  const dbItems = useDbProducts((s) => s.items);
  const dbLoaded = useDbProducts((s) => s.loaded);
  const dbLoad = useDbProducts((s) => s.load);
  const dbAdd = useDbProducts((s) => s.add);
  const dbRemove = useDbProducts((s) => s.remove);

  useEffect(() => {
    if (isSupabaseEnabled && !dbLoaded) dbLoad();
  }, [dbLoaded, dbLoad]);

  if (isSupabaseEnabled) {
    return { items: dbItems, add: dbAdd, remove: dbRemove, global: true };
  }
  return {
    items: localItems,
    add: async (p) => {
      localAdd(p);
      return { ok: true };
    },
    remove: async (id) => {
      localRemove(id);
    },
    global: false,
  };
}
