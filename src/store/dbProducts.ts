"use client";

import { create } from "zustand";
import { getSupabase } from "@/lib/supabase/client";
import { fetchDbProducts, insertDbProduct, updateDbProduct, deleteDbProduct } from "@/lib/supabase/products";
import type { Product } from "@/data/types";

interface DbProductsState {
  items: Product[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (p: Product) => Promise<{ ok: boolean; error?: string }>;
  update: (p: Product) => Promise<{ ok: boolean; error?: string }>;
  remove: (id: string) => Promise<void>;
}

/** Admin products stored in Supabase (visible to everyone). */
export const useDbProducts = create<DbProductsState>((set, get) => ({
  items: [],
  loaded: false,
  load: async () => {
    const sb = getSupabase();
    if (!sb) return;
    const items = await fetchDbProducts(sb);
    set({ items, loaded: true });
  },
  add: async (p) => {
    const sb = getSupabase();
    if (!sb) return { ok: false, error: "Supabase not configured" };
    const res = await insertDbProduct(sb, p);
    if (res.ok) set((s) => ({ items: [{ ...p, id: res.id ?? p.id }, ...s.items] }));
    return res;
  },
  update: async (p) => {
    const sb = getSupabase();
    if (!sb) return { ok: false, error: "Supabase not configured" };
    // Editing a catalog product (no DB row yet) → insert an override instead.
    if (!get().items.some((i) => i.id === p.id)) {
      const res = await insertDbProduct(sb, p);
      if (res.ok) set((s) => ({ items: [{ ...p, id: res.id ?? p.id }, ...s.items] }));
      return res;
    }
    const res = await updateDbProduct(sb, p);
    if (res.ok) set((s) => ({ items: s.items.map((i) => (i.id === p.id ? p : i)) }));
    return res;
  },
  remove: async (id) => {
    const sb = getSupabase();
    if (!sb) return;
    await deleteDbProduct(sb, id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },
}));
