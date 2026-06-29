# VELOUR — Luxury Fashion Marketplace

An original, production-grade luxury fashion marketplace. Cinematic, editorial, and motion-rich — built with **Next.js 15 (App Router) · TypeScript · Tailwind v4 · Framer Motion**. 100% original branding, layout and assets (all product imagery is generated SVG — no third-party/copyrighted media).

> **VELOUR** is a fictional house created for this build. Rename everything from one file: `src/config/site.ts`.

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000  (preview config uses 3200)
npm run build && npm run start
```

## Configure before launch

Everything brand-specific lives in **`src/config/site.ts`**:

- `name`, `wordmark`, `tagline`, `description`, `url`
- **`whatsappNumber`** — currently a placeholder (`910000000000`). Replace with your real number in international format (digits only).
- `currency`, `taxRate`, `shipping`, `contact`, `socials`

## Architecture

```
src/
  app/
    (store)/            # storefront route group (Navbar + Footer chrome)
      page.tsx          # cinematic homepage
      shop/             # listing + filters + sort
      product/[slug]/   # product detail (gallery, variants, reviews, FBT, recently viewed)
      wishlist/  account/  info/[slug]/
    admin/              # enterprise dashboard (own chrome, no storefront nav)
    layout.tsx          # slim root (fonts, theme, custom cursor)
    globals.css         # design tokens + luxury utilities
  components/  (ui, motion, layout, product, cart, shop, admin, home)
  data/                 # typed catalog (brands, categories, 25 products), queries, coupons
  store/                # zustand: cart, wishlist, ui (persisted)
  lib/                  # utils, whatsapp message builder, cart helpers
supabase/schema.sql     # drop-in Postgres schema for going live
```

## Key features

- **WhatsApp checkout** — generates a formatted order (customer, date/time, line items with brand/variant/qty/price, subtotal/discount/tax/shipping/total) and opens a `wa.me` deep link (mobile app + Web), with a confirmation/preview step.
- **Motion** — page transitions, scroll reveals, staggered grids, magnetic buttons, custom cursor, image-reveal, hover zoom, animated mega menu, slide-out cart, marquee — all GPU-friendly and `prefers-reduced-motion`-aware.
- **Storefront** — sticky transparent→blur nav, mega menu, instant search overlay, filters (category/brand/price/color/size/rating/sale/stock) + sort, quick view, wishlist, coupons (`WELCOME10`, `GOLD15`, `VELOUR50`).
- **Admin** — dashboard (stats, revenue chart, low-stock, top products, recent orders), products table, orders view; remaining modules scaffolded against the schema.
- **Theming** — light "porcelain" default + deep matte-black dark mode (no-flash, persisted).

## Going live (next phase)

Wire the data layer to Supabase using `supabase/schema.sql`, swap the local catalog imports in `src/data` for Supabase queries, and enable Supabase Auth (the `/account` UI is ready). Admin CRUD/import-export then writes through the service role.
