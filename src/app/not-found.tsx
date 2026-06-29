"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/provider";

export default function NotFound() {
  const t = useT();
  return (
    <div className="grid min-h-dvh place-items-center pt-28">
      <Container className="text-center">
        <p className="eyebrow mb-6">{t("err404.code")}</p>
        <h1 className="font-display text-[clamp(4rem,18vw,12rem)] leading-none text-gold-gradient">404</h1>
        <h2 className="mt-4 font-display text-2xl md:text-3xl">{t("err404.title")}</h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          {t("err404.desc")}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary" size="lg">{t("err404.home")}</Button>
          <Button href="/shop" variant="outline" size="lg">{t("err404.explore")}</Button>
        </div>
      </Container>
    </div>
  );
}
