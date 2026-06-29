"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, Heart, ShoppingBag, MessageCircle, Tag } from "lucide-react";
import { ProductArtwork } from "@/components/product/ProductArtwork";
import { Button } from "@/components/ui/Button";
import { CheckoutDialog } from "./CheckoutDialog";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { resolveCoupon } from "@/data/coupons";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { lines, setQty, remove, couponCode, setCoupon } = useCart();
  const toggleWish = useWishlist((s) => s.toggle);

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const coupon = couponCode ? resolveCoupon(couponCode, subtotal) : null;
  const discount = coupon?.ok ? coupon.discount : 0;
  const taxableBase = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableBase * site.taxRate);
  const shipping =
    site.shipping.freeAbove > 0 && subtotal >= site.shipping.freeAbove ? 0 : site.shipping.flat;
  const grandTotal = taxableBase + tax + shipping;
  const totals = { subtotal, discount, tax, shipping, grandTotal };

  const applyCoupon = () => {
    const res = resolveCoupon(couponInput, subtotal);
    setCouponMsg({ ok: res.ok, text: res.message });
    if (res.ok && res.code) {
      setCoupon(res.code);
      setCouponInput("");
    }
  };

  const moveToWishlist = (productId: string, key: string) => {
    toggleWish(productId);
    remove(key);
  };

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[75]">
            <motion.div
              className="absolute inset-0 glass-noir"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bg-elevated shadow-luxe"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-display text-xl">Shopping Bag</h2>
                  <span className="text-sm text-ink-muted">
                    {lines.reduce((n, l) => n + l.quantity, 0)} item
                    {lines.reduce((n, l) => n + l.quantity, 0) === 1 ? "" : "s"}
                  </span>
                </div>
                <button aria-label="Close bag" onClick={() => setCartOpen(false)} className="text-ink-muted hover:text-gold-deep">
                  <X size={22} />
                </button>
              </div>

              {lines.length === 0 ? (
                <EmptyState onClose={() => setCartOpen(false)} />
              ) : (
                <>
                  {/* Lines */}
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    <ul className="space-y-6">
                      <AnimatePresence initial={false}>
                        {lines.map((l) => (
                          <motion.li
                            key={l.key}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="flex gap-4"
                          >
                            <Link
                              href={`/product/${l.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="h-28 w-22 shrink-0 overflow-hidden"
                              style={{ width: "5.5rem" }}
                            >
                              <ProductArtwork palette={l.palette} monogram={l.monogram} category={l.category} name={l.name} />
                            </Link>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-muted">{l.brand}</p>
                                  <p className="truncate text-sm">{l.name}</p>
                                  {(l.color || l.size || l.material) && (
                                    <p className="mt-0.5 text-xs text-ink-muted">
                                      {[l.color, l.size].filter(Boolean).join(" · ")}
                                    </p>
                                  )}
                                </div>
                                <p className="whitespace-nowrap text-sm">{formatPrice(l.price * l.quantity)}</p>
                              </div>

                              <div className="mt-auto flex items-center justify-between pt-3">
                                <div className="flex items-center border border-line">
                                  <button onClick={() => setQty(l.key, l.quantity - 1)} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center text-ink-soft hover:text-gold-deep">
                                    <Minus size={13} />
                                  </button>
                                  <span className="w-8 text-center text-sm tabular-nums">{l.quantity}</span>
                                  <button onClick={() => setQty(l.key, l.quantity + 1)} disabled={l.quantity >= l.maxStock} aria-label="Increase quantity" className="grid h-8 w-8 place-items-center text-ink-soft hover:text-gold-deep disabled:opacity-30">
                                    <Plus size={13} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-3 text-ink-muted">
                                  <button onClick={() => moveToWishlist(l.productId, l.key)} aria-label="Move to wishlist" className="transition-colors hover:text-gold-deep">
                                    <Heart size={15} />
                                  </button>
                                  <button onClick={() => remove(l.key)} aria-label="Remove item" className="transition-colors hover:text-danger">
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-line px-6 py-5">
                    {/* Coupon */}
                    <div className="mb-4">
                      {coupon?.ok ? (
                        <div className="flex items-center justify-between bg-bg-sunken px-3 py-2 text-xs">
                          <span className="flex items-center gap-2 text-success">
                            <Tag size={13} /> {couponCode} applied — {coupon.message}
                          </span>
                          <button onClick={() => { setCoupon(null); setCouponMsg(null); }} className="text-ink-muted hover:text-danger">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex gap-2">
                            <input
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              placeholder="Promo code"
                              className="luxe-input flex-1 !py-2 text-sm uppercase tracking-wider"
                            />
                            <button onClick={applyCoupon} className="border border-ink/30 px-4 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold-deep">
                              Apply
                            </button>
                          </div>
                          {couponMsg && !couponMsg.ok && (
                            <p className="mt-1.5 text-xs text-danger">{couponMsg.text}</p>
                          )}
                          <p className="mt-1.5 text-[0.65rem] text-ink-muted">Try WELCOME10 · GOLD15 · VELOUR50</p>
                        </div>
                      )}
                    </div>

                    {/* Totals */}
                    <dl className="space-y-1.5 text-sm">
                      <Row label="Subtotal" value={formatPrice(subtotal)} />
                      {discount > 0 && <Row label="Discount" value={`−${formatPrice(discount)}`} accent />}
                      {tax > 0 && <Row label="Tax" value={formatPrice(tax)} />}
                      <Row label="Shipping" value={shipping > 0 ? formatPrice(shipping) : "Complimentary"} />
                      <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
                        <dt className="font-display text-lg">Total</dt>
                        <dd className="font-display text-lg">{formatPrice(grandTotal)}</dd>
                      </div>
                    </dl>

                    <Button onClick={() => setCheckoutOpen(true)} variant="gold" size="lg" className="mt-4 w-full">
                      <MessageCircle size={17} /> Order on WhatsApp
                    </Button>
                    <button onClick={() => setCartOpen(false)} className="mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-ink-muted hover:text-gold-deep">
                      Continue shopping
                    </button>
                  </div>
                </>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        lines={lines}
        totals={totals}
        couponCode={coupon?.ok ? couponCode : null}
      />
    </>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={accent ? "text-success" : "text-ink-soft"}>{value}</dd>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-bg-sunken text-ink-muted">
        <ShoppingBag size={28} strokeWidth={1.2} />
      </div>
      <h3 className="mt-6 font-display text-2xl">Your bag is empty</h3>
      <p className="mt-2 max-w-xs text-sm text-ink-soft">
        Discover our latest arrivals and curated edits from the world&apos;s most coveted houses.
      </p>
      <Button href="/shop" variant="primary" size="md" className="mt-7" onClick={onClose}>
        Explore the edit
      </Button>
    </div>
  );
}
