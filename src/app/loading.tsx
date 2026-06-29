"use client";

import { Container } from "@/components/ui/Container";
import { useT } from "@/i18n/provider";

export default function Loading() {
  const t = useT();
  return (
    <div className="grid min-h-dvh place-items-center">
      <Container className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border border-line" />
          <span className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-gold" />
        </div>
        <p className="font-display text-2xl tracking-[0.3em] text-ink-muted">
          VEL<span className="text-gold-deep">OUR</span>
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">{t("loading")}</p>
      </Container>
    </div>
  );
}
