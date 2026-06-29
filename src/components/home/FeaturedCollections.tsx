"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProductArtwork } from "@/components/product/ProductArtwork";
import { getTopCategories } from "@/data";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";

const cats = getTopCategories();

export function FeaturedCollections() {
  const t = useT();
  const { lc } = useLocalize();
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={t("collections.eyebrow")}
            title={<>{t("collections.titleA")}<br /> {t("collections.titleB")}</>}
            description={t("collections.desc")}
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {cats.map((c, i) => (
            <StaggerItem key={c.slug} className={i === 0 ? "col-span-2 md:row-span-1" : ""}>
              <CollectionCard slug={c.slug} name={lc(c).name} monogram={c.name[0]} tagline={lc(c).tagline} palette={c.palette} wide={i === 0} />
            </StaggerItem>
          ))}
          <StaggerItem>
            <Link
              href="/shop"
              className="group flex h-64 flex-col items-center justify-center gap-3 border border-line bg-bg-sunken text-center transition-colors hover:border-gold md:h-80"
            >
              <span className="font-display text-2xl">{t("collections.viewAll")}</span>
              <span className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-ink-muted transition-colors group-hover:text-gold-deep">
                {t("collections.fullEdit")} <ArrowUpRight size={13} />
              </span>
            </Link>
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}

function CollectionCard({
  slug,
  name,
  monogram,
  tagline,
  palette,
  wide,
}: {
  slug: string;
  name: string;
  monogram: string;
  tagline: string;
  palette: [string, string];
  wide?: boolean;
}) {
  return (
    <Link href={`/shop?category=${slug}`} className="group relative block h-64 overflow-hidden md:h-80">
      <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-105">
        <ProductArtwork palette={palette} monogram={monogram} category={slug} name={name} variant={wide ? "hero" : "card"} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white md:p-6">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/70">{tagline}</p>
          <h3 className="mt-1 font-display text-2xl md:text-3xl">{name}</h3>
        </div>
        <span className="grid h-10 w-10 shrink-0 translate-y-2 place-items-center border border-white/30 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:border-gold group-hover:text-gold">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
