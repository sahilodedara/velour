-- ============================================================================
-- VELOUR — Supabase / PostgreSQL schema
-- Drop-in replacement for the local seed catalog in src/data.
-- Run in the Supabase SQL editor, then point a thin data adapter at these tables.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------- Catalog -------------------------------------------------------
create table if not exists brands (
  slug          text primary key,
  name          text not null,
  monogram      text not null,
  description   text,
  est           text,
  logo_url      text,
  banner_url    text,
  featured      boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists categories (
  slug          text primary key,
  name          text not null,
  parent_slug   text references categories(slug) on delete set null,
  tagline       text,
  image_url     text,
  banner_url    text,
  created_at    timestamptz not null default now()
);

create table if not exists products (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  brand_slug        text not null references brands(slug),
  category_slug     text not null references categories(slug),
  subcategory_slug  text references categories(slug),
  sku               text unique not null,
  barcode           text,
  price             numeric(12,2) not null,
  original_price    numeric(12,2),
  tax_rate          numeric(5,4) default 0,
  currency          text default 'USD',
  short_description text,
  description       text,
  material          text,
  weight_grams      integer,
  dimensions        text,
  stock             integer not null default 0,
  low_stock_alert   integer not null default 3,
  rating            numeric(2,1) default 0,
  review_count      integer default 0,
  tags              text[] default '{}',
  featured          boolean default false,
  trending          boolean default false,
  best_seller       boolean default false,
  new_arrival       boolean default false,
  palette           text[] default '{}',
  seo_title         text,
  seo_description   text,
  meta_keywords     text[],
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  is_thumb    boolean default false,
  position    integer default 0
);

create table if not exists product_colors (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  name        text not null,
  hex         text not null
);

create table if not exists product_sizes (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,
  stock       integer default 0
);

create table if not exists product_specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,
  value       text not null,
  position    integer default 0
);

-- ---------- Customers, orders, reviews ------------------------------------
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  auth_uid    uuid unique,
  name        text,
  email       text unique,
  phone       text,
  created_at  timestamptz not null default now()
);

create table if not exists addresses (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  label       text,
  line1       text, line2 text, city text, region text, postal_code text, country text,
  is_default  boolean default false
);

create table if not exists coupons (
  code            text primary key,
  type            text not null check (type in ('percent','fixed')),
  value           numeric(12,2) not null,
  min_purchase    numeric(12,2) default 0,
  expires_at      timestamptz,
  usage_limit     integer,
  used_count      integer default 0,
  active          boolean default true
);

create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references customers(id) on delete set null,
  status        text not null default 'pending'
                 check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  customer_name text, customer_phone text, customer_address text,
  subtotal      numeric(12,2) not null,
  discount      numeric(12,2) default 0,
  tax           numeric(12,2) default 0,
  shipping      numeric(12,2) default 0,
  grand_total   numeric(12,2) not null,
  coupon_code   text references coupons(code),
  channel       text default 'whatsapp',
  created_at    timestamptz not null default now()
);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id),
  name        text, brand text, color text, size text, material text,
  unit_price  numeric(12,2) not null,
  quantity    integer not null
);

create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  author      text not null,
  rating      integer not null check (rating between 1 and 5),
  title       text,
  body        text,
  verified    boolean default false,
  created_at  timestamptz not null default now()
);

create table if not exists wishlist (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  unique (customer_id, product_id)
);

-- ---------- Store config & content ----------------------------------------
create table if not exists banners (
  id          uuid primary key default gen_random_uuid(),
  title       text, subtitle text, image_url text, link text,
  placement   text default 'home',
  starts_at   timestamptz, ends_at timestamptz,
  position    integer default 0, active boolean default true
);

create table if not exists settings (
  key         text primary key,
  value       jsonb not null
);

create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  kind        text, message text, read boolean default false,
  created_at  timestamptz not null default now()
);

-- ---------- Admin allowlist (controls who may enter /admin) ----------------
create table if not exists admins (
  email       text primary key,
  created_at  timestamptz not null default now()
);
alter table admins enable row level security;
-- A signed-in user may read ONLY their own admin row. The admin gate queries this
-- to confirm access; rows are added by you (service role) — never self-serve.
create policy "read own admin row" on admins
  for select using (email = auth.jwt() ->> 'email');
-- After creating your admin user in Authentication, allowlist them:
--   insert into admins (email) values ('you@example.com');

create index if not exists idx_products_category on products(category_slug);
create index if not exists idx_products_brand on products(brand_slug);
create index if not exists idx_order_items_order on order_items(order_id);

-- ---------- Row Level Security (sketch) -----------------------------------
-- Catalog is publicly readable; writes restricted to the service role / admins.
alter table products   enable row level security;
alter table brands     enable row level security;
alter table categories enable row level security;
create policy "public read products"   on products   for select using (true);
create policy "public read brands"      on brands     for select using (true);
create policy "public read categories"  on categories for select using (true);
-- Admin writes are expected via the service-role key from the admin dashboard.
