"use client";

import Link from "next/link";
import { Instagram, Youtube, Music2, Bookmark, MessageCircle } from "lucide-react";
import { site } from "@/config/site";
import { getTopCategories, brands } from "@/data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";

const cats = getTopCategories();
const houses = brands.slice(0, 6);

export function Footer() {
  const t = useT();
  const { lcn } = useLocalize();
  const year = 2026;
  const concierge = buildWhatsAppUrl(`Hello ${site.name} — I'd like some assistance.`);

  const clientCare = [
    { label: t("footer.shipping"), href: "/info/shipping" },
    { label: t("footer.returns"), href: "/info/returns" },
    { label: t("footer.track"), href: "/account" },
    { label: t("footer.contact"), href: "/info/contact" },
    { label: t("footer.faq"), href: "/info/faq" },
  ];
  const company = [
    { label: t("footer.about"), href: "/info/about" },
    { label: t("footer.sustainability"), href: "/info/sustainability" },
    { label: t("footer.careers"), href: "/info/careers" },
    { label: t("footer.press"), href: "/info/press" },
  ];

  return (
    <footer className="relative overflow-hidden bg-noir text-noir-ink grain">
      {/* Concierge band */}
      <div className="border-b border-noir-line">
        <div className="container-luxe flex flex-col items-center gap-5 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="eyebrow !text-gold">{t("footer.conciergeEyebrow")}</p>
            <h3 className="mt-2 font-display text-2xl md:text-3xl">{t("footer.conciergeTitle")}</h3>
          </div>
          <a
            href={concierge}
            target="_blank"
            rel="noopener noreferrer"
            className="sheen inline-flex items-center gap-2 bg-gold px-7 py-4 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-ink-on-gold transition-colors hover:bg-gold-bright"
          >
            <MessageCircle size={16} /> {t("footer.conciergeCta")}
          </a>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-luxe grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl tracking-[0.18em]">
            {site.wordmark.lead}<span className="text-gold">{site.wordmark.trail}</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-noir-ink-soft">{site.tagline}.</p>
          <div className="mt-6 flex gap-4">
            <Social href={site.socials.instagram} label="Instagram"><Instagram size={18} /></Social>
            <Social href={site.socials.pinterest} label="Pinterest"><Bookmark size={18} /></Social>
            <Social href={site.socials.tiktok} label="TikTok"><Music2 size={18} /></Social>
            <Social href={site.socials.youtube} label="YouTube"><Youtube size={18} /></Social>
          </div>
        </div>

        <FooterCol title={t("footer.shop")} links={cats.map((c) => ({ label: lcn(c.slug, c.name), href: `/shop?category=${c.slug}` }))} />
        <FooterCol title={t("footer.houses")} links={houses.map((b) => ({ label: b.name, href: `/shop?brand=${b.slug}` }))} />
        <FooterCol title={t("footer.clientCare")} links={clientCare} />
        <FooterCol title={t("footer.company")} links={company} />
      </div>

      {/* Legal */}
      <div className="border-t border-noir-line">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 text-xs text-noir-ink-soft md:flex-row">
          <p>{t("footer.rights")}</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/info/privacy" className="hover:text-gold">{t("footer.privacy")}</Link>
            <Link href="/info/terms" className="hover:text-gold">{t("footer.terms")}</Link>
            <span className="text-noir-ink-soft/60">{t("footer.region", { cur: site.currency.code })}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow !text-noir-ink-soft mb-5">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-noir-ink-soft transition-colors hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center border border-noir-line text-noir-ink-soft transition-colors hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}
