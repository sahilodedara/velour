-- ============================================================================
-- VELOUR seed — brands + categories.
-- Run AFTER schema.sql. Needed so admin-created products have valid
-- brand_slug / category_slug foreign keys. (The 25 starter products stay in
-- the app as the static catalog; only admin-added products live in the DB.)
-- ============================================================================

insert into brands (slug, name, monogram, est, featured, description) values
  ('solene','Solène','S','1987',true,'A Parisian leather house celebrated for sculptural top-handles and hand-finished calfskin.'),
  ('castellane','Castellane','C','1962',true,'Milanese tailoring at its purest — cashmere overcoats and impeccably cut blazers.'),
  ('orvieto','Orvieto','O','1948',true,'Independent Swiss-style watchmaking with in-house movements and quiet precision.'),
  ('lunaire','Lunaire','L','2004',true,'Modern niche perfumery composing rare absolutes into nocturnal, unforgettable trails.'),
  ('belmonte','Belmonte','B','1979',true,'Footwear handmade in small ateliers — Goodyear-welted leathers and feather-light soles.'),
  ('vesper','Vesper & Co.','V','1991',true,'Fine jewelry rendered in recycled gold and responsibly sourced stones.'),
  ('marchetti','Marchetti','M','1985',false,'Accessories and eyewear with architectural acetate and polished hardware.'),
  ('saint-aubin','Saint-Aubin','SA','1970',false,'Outerwear specialists — weatherproof leathers and travel-ready tailoring.')
on conflict (slug) do nothing;

-- Top-level categories first (subs reference them).
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
  ('handbags','Handbags','bags'),
  ('wallets','Wallets','bags'),
  ('backpacks','Backpacks','bags'),
  ('travel','Travel Bags','bags'),
  ('jackets','Jackets','clothing'),
  ('shirts','Shirts','clothing'),
  ('tshirts','T-Shirts','clothing'),
  ('sneakers','Sneakers','shoes'),
  ('belts','Belts','accessories'),
  ('sunglasses','Sunglasses','accessories')
on conflict (slug) do nothing;
