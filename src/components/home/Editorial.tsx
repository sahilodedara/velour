"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ProductArtwork } from "@/components/product/ProductArtwork";
import { useT } from "@/i18n/provider";

const seasonal = [
  { nameKey: "editorial.s1", tagKey: "editorial.s1t", mono: "A", palette: ["#1c1b18", "#7a6a44"] as [string, string], cat: "clothing", href: "/shop?category=jackets" },
  { nameKey: "editorial.s2", tagKey: "editorial.s2t", mono: "A", palette: ["#2a1620", "#7a3b54"] as [string, string], cat: "perfumes", href: "/shop?category=perfumes" },
  { nameKey: "editorial.s3", tagKey: "editorial.s3t", mono: "G", palette: ["#241d12", "#9a7b3f"] as [string, string], cat: "jewelry", href: "/shop?category=jewelry" },
];

export function Editorial() {
  const t = useT();
  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Hero editorial split */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <ProductArtwork palette={["#16140f", "#8a6f3c"]} monogram="V" category="clothing" name="Autumn Atelier" variant="hero" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute left-6 top-6 glass-noir px-4 py-2 text-xs uppercase tracking-[0.2em] text-white">
                {t("editorial.tag")}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-lg">
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gold" /> {t("editorial.eyebrow")}
              </p>
              <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">
                {t("editorial.titleA")}<br />
                <span className="italic text-gold-gradient">{t("editorial.titleB")}</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">
                {t("editorial.body")}
              </p>
              <blockquote className="mt-7 border-l-2 border-gold pl-5 font-display text-xl italic text-ink">
                {t("editorial.quote")}
              </blockquote>
              <div className="mt-9">
                <Button href="/shop?sort=newest" variant="primary" size="lg">{t("editorial.cta")}</Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Seasonal trio */}
        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {seasonal.map((s, i) => (
            <Reveal key={s.nameKey} delay={i * 0.1}>
              <Link href={s.href} className="group relative block aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-105">
                  <ProductArtwork palette={s.palette} monogram={s.mono} category={s.cat} name={t(s.nameKey)} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/70">{t(s.tagKey)}</p>
                  <p className="mt-1 flex items-center gap-1 font-display text-2xl">
                    {t(s.nameKey)}
                    <ArrowUpRight size={18} className="text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
