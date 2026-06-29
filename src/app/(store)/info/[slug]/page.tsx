import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoContent } from "@/components/info/InfoContent";
import { infoSlugs, docTitle } from "@/components/info/docs";

export function generateStaticParams() {
  return infoSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: infoSlugs.includes(slug) ? docTitle(slug) : "Information" };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!infoSlugs.includes(slug)) notFound();
  return <InfoContent slug={slug} />;
}
