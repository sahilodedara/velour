import Link from "next/link";
import { brands } from "@/data";

/** Infinite, GPU-friendly marquee of featured houses. */
export function BrandsStrip() {
  const row = [...brands, ...brands];
  return (
    <section className="border-y border-line py-10 md:py-14">
      <p className="eyebrow mb-8 text-center">Maisons on VELOUR</p>
      <div className="group relative overflow-hidden" aria-label="Featured brands">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
        <div className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused] md:gap-24">
          {row.map((b, i) => (
            <Link
              key={`${b.slug}-${i}`}
              href={`/shop?brand=${b.slug}`}
              className="flex shrink-0 items-center gap-3 text-ink-muted transition-colors hover:text-gold-deep"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-line font-display text-sm">
                {b.monogram}
              </span>
              <span className="font-display text-2xl tracking-wide md:text-3xl">{b.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
