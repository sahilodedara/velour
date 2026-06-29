import type { Metadata } from "next";
import { WishlistClient } from "@/components/shop/WishlistClient";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return <WishlistClient />;
}
