"use client";

import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stars } from "@/components/ui/Stars";
import { Quote } from "lucide-react";
import { useT } from "@/i18n/provider";

const testimonials = [
  { name: "Eleanor V.", locKey: "reviews.l1", bodyKey: "reviews.t1", rating: 5 },
  { name: "Marco T.", locKey: "reviews.l2", bodyKey: "reviews.t2", rating: 5 },
  { name: "Aisha K.", locKey: "reviews.l3", bodyKey: "reviews.t3", rating: 5 },
];

export function Reviews() {
  const t = useT();
  return (
    <section className="bg-bg-sunken py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("reviews.eyebrow")}
            title={t("reviews.title")}
            description={t("reviews.desc")}
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <StaggerItem key={item.name}>
              <figure className="relative flex h-full flex-col bg-bg-elevated p-8 shadow-card">
                <Quote size={28} className="text-gold" />
                <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed text-ink">
                  {t(item.bodyKey)}
                </blockquote>
                <figcaption className="mt-7 flex items-center justify-between border-t border-line pt-5">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-ink-muted">{t(item.locKey)}</p>
                  </div>
                  <Stars rating={item.rating} size={13} />
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
