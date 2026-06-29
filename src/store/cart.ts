"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  /** Unique per product + variant combination. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  /** Artwork seed data for rendering the generated thumbnail. */
  palette: [string, string];
  category: string;
  monogram: string;
  color?: string;
  size?: string;
  material?: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  lines: CartLine[];
  couponCode: string | null;
  add: (line: Omit<CartLine, "key" | "quantity">, quantity?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, quantity: number) => void;
  setCoupon: (code: string | null) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

function lineKey(l: { productId: string; color?: string; size?: string; material?: string }) {
  return [l.productId, l.color, l.size, l.material].filter(Boolean).join("::");
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: null,

      add: (line, quantity = 1) => {
        const key = lineKey(line);
        set((s) => {
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === key
                  ? { ...l, quantity: Math.min(l.maxStock, l.quantity + quantity) }
                  : l,
              ),
            };
          }
          return {
            lines: [...s.lines, { ...line, key, quantity: Math.min(line.maxStock, quantity) }],
          };
        });
      },

      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),

      setQty: (key, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) =>
              l.key === key ? { ...l, quantity: Math.max(0, Math.min(l.maxStock, quantity)) } : l,
            )
            .filter((l) => l.quantity > 0),
        })),

      setCoupon: (code) => set({ couponCode: code }),
      clear: () => set({ lines: [], couponCode: null }),

      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    }),
    { name: "velour-cart" },
  ),
);
