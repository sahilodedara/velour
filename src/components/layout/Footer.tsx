import Link from "next/link";
import { Instagram, Youtube, Music2, Bookmark, MessageCircle } from "lucide-react";
import { site } from "@/config/site";
import { getTopCategories, brands } from "@/data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const cats = getTopCategories();
const houses = brands.slice(0, 6);

const clientCare = [
  { label: "Shipping & Delivery", href: "/info/shipping" },
  { label: "Returns & Exchanges", href: "/info/returns" },
  { label: "Track Your Order", href: "/account" },
  { label: "Contact Concierge", href: "/info/contact" },
  { label: "FAQ", href: "/info/faq" },
];
const company = [
  { label: "About VELOUR", href: "/info/about" },
  { label: "Sustainability", href: "/info/sustainability" },
  { label: "Careers", href: "/info/careers" },
  { label: "Press", href: "/info/press" },
];

export function Footer() {
  const year = 2026;
  const concierge = buildWhatsAppUrl(`Hello ${site.name} — I'd like some assistance.`);

  return (
    <footer className="relative overflow-hidden bg-noir text-noir-ink grain">
      {/* Concierge band */}
      <div className="border-b border-noir-line">
        <div className="container-luxe flex flex-col items-center gap-5 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="eyebrow !text-gold">Personal Concierge</p>
            <h3 className="mt-2 font-display text-2xl md:text-3xl">A private styling service, a message away</h3>
          </div>
          <a
            href={concierge}
            target="_blank"
            rel="noopener noreferrer"
            className="sheen inline-flex items-center gap-2 bg-gold px-7 py-4 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-ink-on-gold transition-colors hover:bg-gold-bright"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
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

        <FooterCol title="Shop" links={cats.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` }))} />
        <FooterCol title="Houses" links={houses.map((b) => ({ label: b.name, href: `/shop?brand=${b.slug}` }))} />
        <FooterCol title="Client Care" links={clientCare} />
        <FooterCol title="Company" links={company} />
      </div>

      {/* Legal */}
      <div className="border-t border-noir-line">
        <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 text-xs text-noir-ink-soft md:flex-row">
          <p>© {year} {site.name}. An original concept marketplace. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/info/privacy" className="hover:text-gold">Privacy Policy</Link>
            <Link href="/info/terms" className="hover:text-gold">Terms of Service</Link>
            <span className="text-noir-ink-soft/60">{site.currency.code} · International</span>
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
