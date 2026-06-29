"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/Reveal";
import { ProductArtwork } from "@/components/product/ProductArtwork";
import { getFeatured } from "@/data";
import { getBrand } from "@/data";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";

const EASE = [0.22, 1, 0.36, 1] as const;
const floats = getFeatured().slice(0, 3);

export function Hero() {
  const t = useT();
  const { lp } = useLocalize();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yArt = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-dvh overflow-hidden bg-noir text-noir-ink grain">
      {/* layered cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(200,164,100,0.16),transparent_60%)] blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(120,130,180,0.12),transparent_60%)] blur-3xl" />
      </div>

      {/* oversized watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="font-display text-[28vw] leading-none text-white/[0.03] select-none">VELOUR</span>
      </div>

      <div className="container-luxe relative grid min-h-dvh grid-cols-1 items-center gap-12 pt-32 pb-20 lg:grid-cols-2">
        {/* Copy */}
        <motion.div style={{ y: yText, opacity }} className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="eyebrow !text-gold mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold" /> {t("hero.eyebrow")}
          </motion.p>

          <h1 className="font-display text-[clamp(2.6rem,7vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.02em]">
            <TextReveal text={t("hero.h1a")} className="block" />
            <span className="block">
              <span className="italic text-gold-gradient"><TextReveal text={t("hero.h1b")} delay={0.15} /></span>
            </span>
            <TextReveal text={t("hero.h1c")} className="block" delay={0.3} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-7 max-w-md text-base leading-relaxed text-noir-ink-soft"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button href="/shop" variant="gold" size="lg">{t("hero.cta1")}</Button>
            <Button href="/shop?sort=newest" variant="noir" size="lg">{t("hero.cta2")}</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-12 flex items-center gap-8 text-xs text-noir-ink-soft"
          >
            <Stat value="200+" label={t("hero.statMaisons")} />
            <span className="h-8 w-px bg-noir-line" />
            <Stat value="40k+" label={t("hero.statPieces")} />
            <span className="h-8 w-px bg-noir-line" />
            <Stat value="98%" label={t("hero.statReturn")} />
          </motion.div>
        </motion.div>

        {/* Floating artwork */}
        <motion.div style={{ y: yArt }} className="relative hidden h-full min-h-[30rem] lg:block">
          {floats.map((p, i) => {
            const positions = [
              "left-[6%] top-[10%] w-56 rotate-[-5deg]",
              "right-[4%] top-[26%] w-64 rotate-[4deg] z-10",
              "left-[22%] bottom-[6%] w-52 rotate-[2deg]",
            ];
            return (
              <motion.div
                key={p.id}
                className={`absolute ${positions[i]} animate-float`}
                style={{ animationDelay: `${i * 1.1}s` }}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.18, duration: 1, ease: EASE }}
              >
                <Link href={`/product/${p.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden shadow-luxe ring-1 ring-white/10">
                    <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                      <ProductArtwork palette={p.palette} monogram={getBrand(p.brand)?.monogram ?? "V"} category={p.category} name={lp(p).name} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-2 text-noir-ink-soft"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
        <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ArrowDown size={16} className="text-gold" />
        </motion.span>
      </motion.div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl text-noir-ink">{value}</p>
      <p className="mt-1 uppercase tracking-[0.18em]">{label}</p>
    </div>
  );
}
