-- ============================================================================
-- VELOUR admin write policies.
-- Run AFTER schema.sql. Lets a signed-in admin (email present in `admins`)
-- create / edit / delete products and their colors, sizes and specs.
-- The public still only READS products (existing "public read products" policy).
-- ============================================================================

-- Helper: is the current signed-in user an admin?
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from admins where email = auth.jwt() ->> 'email'
  );
$$;

-- Make sure RLS is on for the product sub-tables.
alter table product_colors enable row level security;
alter table product_sizes  enable row level security;
alter table product_specs  enable row level security;
alter table product_images enable row level security;

-- Public can read the sub-tables (needed to render products in the storefront).
create policy "public read product_colors" on product_colors for select using (true);
create policy "public read product_sizes"  on product_sizes  for select using (true);
create policy "public read product_specs"  on product_specs  for select using (true);
create policy "public read product_images" on product_images for select using (true);

-- Admins can write products + sub-tables.
create policy "admin write products"        on products        for all using (is_admin()) with check (is_admin());
create policy "admin write product_colors"  on product_colors  for all using (is_admin()) with check (is_admin());
create policy "admin write product_sizes"   on product_sizes   for all using (is_admin()) with check (is_admin());
create policy "admin write product_specs"   on product_specs   for all using (is_admin()) with check (is_admin());
create policy "admin write product_images"  on product_images  for all using (is_admin()) with check (is_admin());
