import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop the Edit",
  description: "Explore the full VELOUR edit — filter by house, category, price and more.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <ShopClient />
    </Suspense>
  );
}
