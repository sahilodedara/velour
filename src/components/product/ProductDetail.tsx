"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronDown,
  Plus, Minus, Maximize2, Check, MessageCircle,
} from "lucide-react";
import { ProductArtwork } from "./ProductArtwork";
import { ProductCard } from "./ProductCard";
import { Stars } from "@/components/ui/Stars";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Product } from "@/data/types";
import { getBrand, getBrandName, getCategory, getRelated, getReviews, getProductBySlug } from "@/data";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { useHasMounted } from "@/lib/useHasMounted";
import { toCartLine } from "@/lib/cart-helpers";
import { cn, formatPrice, discountPercent, formatDate } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductDetail({ product }: { product: Product }) {
  const brand = getBrand(product.brand);
  const brandName = getBrandName(product.brand);
  const category = getCategory(product.category);
  const disc = discountPercent(product.price, product.originalPrice);
  const reviews = getReviews(product.id);
  const related = getRelated(product, 4);

  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const mounted = useHasMounted();

  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [recent, setRecent] = useState<Product[]>([]);

  // Record + read "recently viewed".
  useEffect(() => {
    try {
      const prev: string[] = JSON.parse(localStorage.getItem("velour-viewed") ?? "[]");
      setRecent(prev.filter((s) => s !== product.slug).map(getProductBySlug).filter(Boolean) as Product[]);
      const next = [product.slug, ...prev.filter((s) => s !== product.slug)].slice(0, 8);
      localStorage.setItem("velour-viewed", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [product.slug]);

  const handleAdd = () => {
    add(toCartLine(product, { color, size }), qty);
    setCartOpen(true);
  };

  return (
    <div className="pt-28 md:pt-36">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-gold-deep">Home</Link><span>/</span>
          <Link href="/shop" className="hover:text-gold-deep">Shop</Link><span>/</span>
          {category && <><Link href={`/shop?category=${category.slug}`} className="hover:text-gold-deep">{category.name}</Link><span>/</span></>}
          <span className="text-ink-soft">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Gallery product={product} />

          {/* Info */}
          <div className="lg:py-2">
            <div className="flex items-center gap-3">
              <Link href={`/shop?brand=${product.brand}`} className="eyebrow hover:text-gold-deep">{brandName}</Link>
              {product.bestSeller && <Badge tone="gold">Bestseller</Badge>}
            </div>
            <h1 className="mt-3 font-display text-3xl leading-tight md:text-5xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-4">
              <Stars rating={product.rating} showValue />
              <a href="#reviews" className="text-sm text-ink-muted underline-offset-4 hover:text-gold-deep hover:underline">
                {product.reviewCount} reviews
              </a>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-ink-muted line-through">{formatPrice(product.originalPrice)}</span>
                  <Badge tone="sale">−{disc}%</Badge>
                </>
              )}
            </div>

            <p className="mt-6 max-w-prose leading-relaxed text-ink-soft">{product.shortDescription}</p>

            {/* Colors */}
            <div className="mt-8">
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.18em] text-ink-soft">
                Color — <span className="text-ink">{color}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    title={c.name}
                    className={cn(
                      "h-9 w-9 rounded-full border transition-transform",
                      color === c.name ? "scale-110 border-gold ring-2 ring-gold/40" : "border-line hover:scale-105",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            {product.sizes && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ink-soft">Size</p>
                  <span className="text-xs text-ink-muted">True to size</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "min-w-12 border px-4 py-3 text-sm transition-colors",
                        size === s ? "border-gold bg-gold text-ink-on-gold" : "border-line hover:border-gold-deep",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + actions */}
            <div className="mt-8 flex items-stretch gap-3">
              <div className="flex items-center border border-line">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" className="grid h-full w-12 place-items-center text-ink-soft hover:text-gold-deep">
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center tabular-nums">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} aria-label="Increase" className="grid h-full w-12 place-items-center text-ink-soft hover:text-gold-deep disabled:opacity-30" disabled={qty >= product.stock}>
                  <Plus size={15} />
                </button>
              </div>
              <Button onClick={handleAdd} variant="gold" size="lg" className="flex-1">
                <ShoppingBag size={17} /> Add to Bag
              </Button>
              <button
                onClick={() => toggleWish(product.id)}
                aria-label="Add to wishlist"
                className={cn(
                  "grid w-14 place-items-center border transition-colors",
                  mounted && wished ? "border-gold text-gold" : "border-line hover:border-gold-deep",
                )}
              >
                <Heart size={18} className={cn(mounted && wished && "fill-gold")} />
              </button>
            </div>

            <Button onClick={handleAdd} variant="outline" size="lg" className="mt-3 w-full">
              <MessageCircle size={16} /> Add &amp; Order on WhatsApp
            </Button>

            {/* Stock + SKU */}
            <div className="mt-5 flex items-center justify-between text-xs text-ink-muted">
              <span className="flex items-center gap-1.5 text-success">
                <Check size={14} /> {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
              </span>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Trust */}
            <div className="mt-7 grid grid-cols-3 gap-3 border-y border-line py-5 text-center">
              <Trust icon={<Truck size={18} />} label="Complimentary shipping" />
              <Trust icon={<RotateCcw size={18} />} label="30-day returns" />
              <Trust icon={<ShieldCheck size={18} />} label="Guaranteed authentic" />
            </div>

            {/* Accordions */}
            <div className="mt-2 divide-y divide-line">
              <Accordion title="Description" defaultOpen>
                <p className="leading-relaxed text-ink-soft">{product.description}</p>
              </Accordion>
              <Accordion title="Specifications">
                <dl className="divide-y divide-line">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between gap-6 py-2.5 text-sm">
                      <dt className="text-ink-muted">{s.label}</dt>
                      <dd className="text-right text-ink">{s.value}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-6 py-2.5 text-sm">
                    <dt className="text-ink-muted">Material</dt>
                    <dd className="text-right text-ink">{product.material}</dd>
                  </div>
                </dl>
              </Accordion>
              <Accordion title="Shipping & Delivery">
                <p className="leading-relaxed text-ink-soft">
                  Complimentary insured shipping worldwide. Orders are dispatched within 1–2 business days and
                  presented in signature VELOUR packaging. Express options are offered at checkout via concierge.
                </p>
              </Accordion>
              <Accordion title="Returns & Exchanges">
                <p className="leading-relaxed text-ink-soft">
                  Enjoy 30 days to return unworn pieces in their original condition and packaging for a full refund
                  or exchange. Fine jewelry and fragrance are subject to hygiene restrictions.
                </p>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Frequently bought together */}
        {related.length >= 2 && <FrequentlyBought product={product} related={related.slice(0, 2)} />}

        {/* Reviews */}
        <section id="reviews" className="mt-24 border-t border-line pt-16">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-[280px_1fr]">
              <div>
                <p className="eyebrow mb-4">Customer Reviews</p>
                <div className="flex items-end gap-3">
                  <span className="font-display text-6xl leading-none">{product.rating.toFixed(1)}</span>
                  <div className="pb-1">
                    <Stars rating={product.rating} />
                    <p className="mt-1 text-xs text-ink-muted">{product.reviewCount} reviews</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-line pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                      <Stars rating={r.rating} size={13} />
                      <span className="text-xs text-ink-muted">{formatDate(new Date(r.date))}</span>
                    </div>
                    <h4 className="mt-3 font-display text-lg">{r.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                    <p className="mt-3 text-xs text-ink-muted">
                      {r.author} {r.verified && <span className="text-success">· Verified purchase</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <Section title="You may also like" items={related} />
        )}
        {recent.length > 0 && (
          <Section title="Recently viewed" items={recent.slice(0, 4)} />
        )}
      </Container>
    </div>
  );
}

/* ----------------------------- Gallery ----------------------------- */
function Gallery({ product }: { product: Product }) {
  const monogram = getBrand(product.brand)?.monogram ?? "V";
  const views: [string, string][] = [
    product.palette,
    [product.palette[1], product.palette[0]],
    ["#15140f", product.palette[1]],
    [product.palette[0], "#3a3a3d"],
  ];
  const [sel, setSel] = useState(0);
  const [full, setFull] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="flex gap-4">
        {/* thumbnails */}
        <div className="hidden flex-col gap-3 sm:flex">
          {views.map((v, i) => (
            <button
              key={i}
              onClick={() => setSel(i)}
              className={cn("h-20 w-16 overflow-hidden border transition-colors", sel === i ? "border-gold" : "border-line hover:border-gold-deep")}
            >
              <ProductArtwork palette={v} monogram={monogram} category={product.category} />
            </button>
          ))}
        </div>

        {/* main */}
        <div
          className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-bg-sunken"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          }}
          onClick={() => setFull(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={sel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full transition-transform duration-300 ease-out"
              style={{ transformOrigin: origin, transform: zoom ? "scale(1.7)" : "scale(1)" }}
            >
              <ProductArtwork palette={views[sel]} monogram={monogram} category={product.category} name={product.name} variant="hero" />
            </motion.div>
          </AnimatePresence>
          <button
            onClick={(e) => { e.stopPropagation(); setFull(true); }}
            aria-label="View fullscreen"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center bg-bg-elevated/80 text-ink backdrop-blur transition-colors hover:text-gold-deep"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* mobile thumbnails */}
      <div className="mt-4 flex gap-3 sm:hidden">
        {views.map((v, i) => (
          <button key={i} onClick={() => setSel(i)} className={cn("h-16 w-14 overflow-hidden border", sel === i ? "border-gold" : "border-line")}>
            <ProductArtwork palette={v} monogram={monogram} category={product.category} />
          </button>
        ))}
      </div>

      <Modal open={full} onClose={() => setFull(false)} maxWidth="max-w-3xl">
        <div className="aspect-[4/5] w-full overflow-hidden">
          <ProductArtwork palette={views[sel]} monogram={monogram} category={product.category} name={product.name} variant="hero" />
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------- Frequently bought ----------------------- */
function FrequentlyBought({ product, related }: { product: Product; related: Product[] }) {
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const bundle = [product, ...related];
  const total = bundle.reduce((s, p) => s + p.price, 0);

  const addAll = () => {
    bundle.forEach((p) => add(toCartLine(p, { color: p.colors[0]?.name, size: p.sizes?.[0] })));
    setCartOpen(true);
  };

  return (
    <section className="mt-24 border-t border-line pt-16">
      <Reveal>
        <p className="eyebrow mb-6">Frequently bought together</p>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8">
          <div className="flex flex-1 items-center gap-3">
            {bundle.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <Link href={`/product/${p.slug}`} className="block w-28 shrink-0">
                  <div className="aspect-[4/5] overflow-hidden border border-line">
                    <ProductArtwork palette={p.palette} monogram={getBrand(p.brand)?.monogram ?? "V"} category={p.category} name={p.name} />
                  </div>
                </Link>
                {i < bundle.length - 1 && <Plus size={18} className="text-ink-muted" />}
              </div>
            ))}
          </div>
          <div className="text-center lg:text-right">
            <p className="text-sm text-ink-muted">Bundle total</p>
            <p className="font-display text-3xl">{formatPrice(total)}</p>
            <Button onClick={addAll} variant="primary" size="md" className="mt-4">Add all three to bag</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Section({ title, items }: { title: string; items: Product[] }) {
  return (
    <section className="mt-24">
      <Reveal>
        <h2 className="mb-10 font-display text-3xl md:text-4xl">{title}</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-ink-soft">
      <span className="text-gold-deep">{icon}</span>
      <span className="text-[0.68rem] uppercase tracking-[0.12em]">{label}</span>
    </div>
  );
}

function Accordion({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="py-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-[0.12em]">{title}</span>
        <ChevronDown size={16} className={cn("text-ink-muted transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
