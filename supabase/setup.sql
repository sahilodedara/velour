-- ============================================================================
-- VELOUR — ONE-SHOT SETUP. Paste ALL of this into Supabase → SQL Editor → Run.
-- Safe to run multiple times (idempotent). Does everything:
--   tables · brands+categories seed · admin write policies · media bucket.
-- After this: add your admin user (Authentication → Users), then:
--   insert into admins (email) values ('you@email.com');
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------- Catalog tables --------------------------------------------------
create table if not exists brands (
  slug text primary key, name text not null, monogram text not null,
  description text, est text, logo_url text, banner_url text,
  featured boolean not null default false, created_at timestamptz not null default now()
);

create table if not exists categories (
  slug text primary key, name text not null,
  parent_slug text references categories(slug) on delete set null,
  tagline text, image_url text, banner_url text, created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null,
  brand_slug text not null references brands(slug),
  category_slug text not null references categories(slug),
  subcategory_slug text references categories(slug),
  sku text unique not null, barcode text,
  price numeric(12,2) not null, original_price numeric(12,2),
  tax_rate numeric(5,4) default 0, currency text default 'USD',
  short_description text, description text, material text,
  weight_grams integer, dimensions text,
  stock integer not null default 0, low_stock_alert integer not null default 3,
  rating numeric(2,1) default 0, review_count integer default 0,
  tags text[] default '{}',
  featured boolean default false, trending boolean default false,
  best_seller boolean default false, new_arrival boolean default false,
  palette text[] default '{}', video_url text,
  seo_title text, seo_description text, meta_keywords text[],
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
-- ensure video_url exists even if products was created before
alter table products add column if not exists video_url text;

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null, is_thumb boolean default false, position integer default 0
);
create table if not exists product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null, hex text not null
);
create table if not exists product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null, stock integer default 0
);
create table if not exists product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null, value text not null, position integer default 0
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(), auth_uid uuid unique,
  name text, email text unique, phone text, created_at timestamptz not null default now()
);
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'pending',
  customer_name text, customer_phone text, customer_address text,
  subtotal numeric(12,2) not null, discount numeric(12,2) default 0,
  tax numeric(12,2) default 0, shipping numeric(12,2) default 0,
  grand_total numeric(12,2) not null, coupon_code text,
  channel text default 'whatsapp', created_at timestamptz not null default now()
);
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  name text, brand text, color text, size text, material text,
  unit_price numeric(12,2) not null, quantity integer not null
);
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  author text not null, rating integer not null check (rating between 1 and 5),
  title text, body text, verified boolean default false, created_at timestamptz not null default now()
);
create table if not exists coupons (
  code text primary key, type text not null check (type in ('percent','fixed')),
  value numeric(12,2) not null, min_purchase numeric(12,2) default 0,
  expires_at timestamptz, usage_limit integer, used_count integer default 0, active boolean default true
);
create table if not exists settings (key text primary key, value jsonb not null);

-- Admin allowlist (who may enter /admin)
create table if not exists admins (email text primary key, created_at timestamptz not null default now());

-- ---------- Helper: is current user an admin? ------------------------------
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = auth.jwt() ->> 'email');
$$;

-- ---------- Row Level Security ---------------------------------------------
alter table products       enable row level security;
alter table brands         enable row level security;
alter table categories     enable row level security;
alter table product_colors enable row level security;
alter table product_sizes  enable row level security;
alter table product_specs  enable row level security;
alter table product_images enable row level security;
alter table admins         enable row level security;

-- public READ on catalog
drop policy if exists "public read products"       on products;
create policy "public read products"       on products       for select using (true);
drop policy if exists "public read brands"         on brands;
create policy "public read brands"         on brands         for select using (true);
drop policy if exists "public read categories"     on categories;
create policy "public read categories"     on categories     for select using (true);
drop policy if exists "public read product_colors" on product_colors;
create policy "public read product_colors" on product_colors for select using (true);
drop policy if exists "public read product_sizes"  on product_sizes;
create policy "public read product_sizes"  on product_sizes  for select using (true);
drop policy if exists "public read product_specs"  on product_specs;
create policy "public read product_specs"  on product_specs  for select using (true);
drop policy if exists "public read product_images" on product_images;
create policy "public read product_images" on product_images for select using (true);

-- admin WRITE on products + sub-tables
drop policy if exists "admin write products"        on products;
create policy "admin write products"        on products        for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write product_colors"  on product_colors;
create policy "admin write product_colors"  on product_colors  for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write product_sizes"   on product_sizes;
create policy "admin write product_sizes"   on product_sizes   for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write product_specs"   on product_specs;
create policy "admin write product_specs"   on product_specs   for all using (is_admin()) with check (is_admin());
drop policy if exists "admin write product_images"  on product_images;
create policy "admin write product_images"  on product_images  for all using (is_admin()) with check (is_admin());

-- a signed-in user may read only their own admin row (gate uses this)
drop policy if exists "read own admin row" on admins;
create policy "read own admin row" on admins for select using (email = auth.jwt() ->> 'email');

-- ---------- Seed: brands + categories --------------------------------------
insert into brands (slug, name, monogram, est, featured, description) values
  ('solene','Solène','S','1987',true,'A Parisian leather house celebrated for sculptural top-handles.'),
  ('castellane','Castellane','C','1962',true,'Milanese tailoring — cashmere overcoats and impeccable blazers.'),
  ('orvieto','Orvieto','O','1948',true,'Independent Swiss-style watchmaking with in-house movements.'),
  ('lunaire','Lunaire','L','2004',true,'Modern niche perfumery composing rare absolutes.'),
  ('belmonte','Belmonte','B','1979',true,'Footwear handmade in small ateliers.'),
  ('vesper','Vesper & Co.','V','1991',true,'Fine jewelry in recycled gold and responsibly sourced stones.'),
  ('marchetti','Marchetti','M','1985',false,'Accessories and eyewear with architectural acetate.'),
  ('saint-aubin','Saint-Aubin','SA','1970',false,'Outerwear specialists — weatherproof leathers.')
on conflict (slug) do nothing;

insert into categories (slug, name, tagline) values
  ('bags','Bags','Sculptural leather goods'),
  ('clothing','Clothing','Ready-to-wear, refined'),
  ('shoes','Shoes','Crafted to carry you'),
  ('perfumes','Perfumes','Olfactory signatures'),
  ('watches','Watches','Time, perfected'),
  ('jewelry','Jewelry','Light made wearable'),
  ('accessories','Accessories','The finishing note')
on conflict (slug) do nothing;

insert into categories (slug, name, parent_slug) values
  ('handbags','Handbags','bags'), ('wallets','Wallets','bags'),
  ('backpacks','Backpacks','bags'), ('travel','Travel Bags','bags'),
  ('jackets','Jackets','clothing'), ('shirts','Shirts','clothing'),
  ('tshirts','T-Shirts','clothing'), ('sneakers','Sneakers','shoes'),
  ('belts','Belts','accessories'), ('sunglasses','Sunglasses','accessories')
on conflict (slug) do nothing;

-- ---------- Storage: product media bucket ----------------------------------
insert into storage.buckets (id, name, public)
values ('product-media','product-media', true)
on conflict (id) do nothing;

drop policy if exists "public read product media" on storage.objects;
create policy "public read product media" on storage.objects
  for select using (bucket_id = 'product-media');
drop policy if exists "admin upload product media" on storage.objects;
create policy "admin upload product media" on storage.objects
  for insert with check (bucket_id = 'product-media' and is_admin());
drop policy if exists "admin update product media" on storage.objects;
create policy "admin update product media" on storage.objects
  for update using (bucket_id = 'product-media' and is_admin());
drop policy if exists "admin delete product media" on storage.objects;
create policy "admin delete product media" on storage.objects
  for delete using (bucket_id = 'product-media' and is_admin());

-- DONE. Next: Authentication → Users → Add user (auto-confirm), then run:
--   insert into admins (email) values ('you@email.com');
