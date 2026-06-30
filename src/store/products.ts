"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/types";

interface ProductsState {
  items: Product[];
  add: (p: Product) => void;
  update: (id: string, patch: Partial<Product>) => void;
  remove: (id: string) => void;
}

/** Admin-created products, persisted to this browser (localStorage). */
export const useProducts = create<ProductsState>()(
  persist(
    (set) => ({
      items: [],
      add: (p) => set((s) => ({ items: [p, ...s.items] })),
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: "velour-products" },
  ),
);
