import { Hero } from "@/components/home/Hero";
import { BrandsStrip } from "@/components/home/BrandsStrip";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { ProductRail } from "@/components/home/ProductRail";
import { Editorial } from "@/components/home/Editorial";
import { Reviews } from "@/components/home/Reviews";
import { Newsletter } from "@/components/home/Newsletter";
import { InstagramGallery } from "@/components/home/InstagramGallery";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsStrip />
      <FeaturedCollections />
      <ProductRail />
      <Editorial />
      <Reviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
