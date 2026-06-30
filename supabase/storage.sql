-- ============================================================================
-- VELOUR media storage — product images + short videos.
-- Run AFTER policies.sql (it uses the is_admin() function defined there).
-- Creates a public bucket; public can READ, only admins can UPLOAD/replace/delete.
-- ============================================================================

-- A short video URL on the product (images live in the product_images table).
alter table products add column if not exists video_url text;

-- Public storage bucket for product media.
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

-- Anyone can view files in this bucket (storefront needs to render them).
create policy "public read product media"
  on storage.objects for select
  using (bucket_id = 'product-media');

-- Only signed-in admins can upload / replace / remove.
create policy "admin upload product media"
  on storage.objects for insert
  with check (bucket_id = 'product-media' and is_admin());
create policy "admin update product media"
  on storage.objects for update
  using (bucket_id = 'product-media' and is_admin());
create policy "admin delete product media"
  on storage.objects for delete
  using (bucket_id = 'product-media' and is_admin());
