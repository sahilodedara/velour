import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug, getBrandName, products } from "@/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.name} — ${getBrandName(product.brand)}`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return (
    <div className="relative pb-28">
      {/* Gradient background using suggested palette */}
      <div 
        className="fixed inset-0 -z-10" 
        style={{
          background: "linear-gradient(135deg, #FFDBBB 0%, #C0BEB1 35%, #997E67 70%, #664930 100%)"
        }}
      />
      <ProductDetail product={product} />
    </div>
  );
}
