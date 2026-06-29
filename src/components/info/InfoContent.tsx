"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { useLang } from "@/i18n/provider";
import { getDoc } from "./docs";

export function InfoContent({ slug }: { slug: string }) {
  const { lang } = useLang();
  const doc = getDoc(slug, lang);
  if (!doc) return null;

  return (
    <div className="pt-28 md:pt-36">
      <Container className="max-w-3xl pb-28">
        <Reveal>
          <p className="eyebrow mb-4">VELOUR</p>
          <h1 className="font-display text-4xl md:text-6xl">{doc.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{doc.intro}</p>
        </Reveal>
        <div className="mt-12 space-y-10">
          {doc.sections.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.05}>
              <div className="border-t border-line pt-8">
                <h2 className="font-display text-2xl">{s.h}</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
