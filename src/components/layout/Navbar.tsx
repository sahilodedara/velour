"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { MegaMenu } from "./MegaMenu";
import { useUI } from "@/store/ui";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useHasMounted } from "@/lib/useHasMounted";
import { getTopCategories } from "@/data";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { cn } from "@/lib/utils";

const topCategories = getTopCategories();

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  const { setCartOpen, setSearchOpen, setMenuOpen, theme, toggleTheme } = useUI();
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const mounted = useHasMounted();
  const t = useT();
  const { lcn } = useLocalize();

  const transparent = isHome && !scrolled && active === null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-[var(--ease-luxe)]",
        transparent ? "text-noir-ink" : "text-ink",
      )}
      onMouseLeave={() => setActive(null)}
    >
      <AnnouncementBar dark={transparent} />

      <div
        className={cn(
          "border-b transition-all duration-500 ease-[var(--ease-luxe)]",
          transparent ? "border-transparent bg-transparent" : "glass border-line",
        )}
      >
        <nav className="container-luxe flex h-16 items-center justify-between md:h-20">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              aria-label={t("nav.menu")}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <Logo />
          </div>

          {/* Center — desktop nav */}
          <ul className="hidden items-center gap-7 lg:flex">
            {topCategories.map((c) => (
              <li key={c.slug} onMouseEnter={() => setActive(c.slug)}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  className={cn(
                    "link-underline py-2 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-colors",
                    active === c.slug ? "text-gold-deep" : "hover:text-gold-deep",
                  )}
                >
                  {lcn(c.slug, c.name)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-4 md:gap-5">
            <button aria-label={t("nav.search")} onClick={() => setSearchOpen(true)} className="transition-colors hover:text-gold-deep">
              <Search size={19} />
            </button>
            <LanguageSwitcher />
            <button
              aria-label={theme === "dark" ? t("nav.light") : t("nav.dark")}
              onClick={toggleTheme}
              className="transition-colors hover:text-gold-deep"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Link href="/account" aria-label={t("nav.account")} className="hidden transition-colors hover:text-gold-deep sm:block">
              <User size={19} />
            </Link>
            <Link href="/wishlist" aria-label={t("nav.wishlist")} className="relative transition-colors hover:text-gold-deep">
              <Heart size={19} />
              {mounted && wishCount > 0 && <Count n={wishCount} />}
            </Link>
            <button aria-label={t("nav.cart")} onClick={() => setCartOpen(true)} className="relative transition-colors hover:text-gold-deep">
              <ShoppingBag size={19} />
              {mounted && cartCount > 0 && <Count n={cartCount} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {active && <MegaMenu category={active} onNavigate={() => setActive(null)} />}
      </AnimatePresence>
    </header>
  );
}

function Count({ n }: { n: number }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.55rem] font-semibold text-ink-on-gold"
    >
      {n}
    </motion.span>
  );
}

const MESSAGE_KEYS = ["announce.shipping", "announce.styling", "announce.newArrivals"];

function AnnouncementBar({ dark }: { dark: boolean }) {
  const t = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % MESSAGE_KEYS.length), 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className={cn(
        "overflow-hidden text-center transition-colors duration-500",
        dark ? "bg-transparent text-noir-ink-soft" : "bg-noir text-noir-ink-soft",
      )}
    >
      <div className="container-luxe flex h-8 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-[0.62rem] font-medium uppercase tracking-[0.28em]"
          >
            {t(MESSAGE_KEYS[i])}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
