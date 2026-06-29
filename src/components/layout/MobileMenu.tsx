"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useUI } from "@/store/ui";
import { getTopCategories, getSubcategories } from "@/data";
import { useT } from "@/i18n/provider";
import { useLocalize } from "@/i18n/useLocalize";

const EASE = [0.22, 1, 0.36, 1] as const;
const top = getTopCategories();

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUI();
  const [expanded, setExpanded] = useState<string | null>(null);
  const close = () => setMenuOpen(false);
  const t = useT();
  const { lcn } = useLocalize();

  return (
    <AnimatePresence>
      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.div
            className="absolute inset-0 glass-noir"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-bg-elevated shadow-luxe"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <Logo onClick={close} />
              <button aria-label="Close menu" onClick={close} className="text-ink-muted hover:text-gold-deep">
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="divide-y divide-line">
                {top.map((c) => {
                  const subs = getSubcategories(c.slug);
                  const open = expanded === c.slug;
                  return (
                    <li key={c.slug} className="py-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/shop?category=${c.slug}`}
                          onClick={close}
                          className="py-3 font-display text-xl"
                        >
                          {lcn(c.slug, c.name)}
                        </Link>
                        {subs.length > 0 && (
                          <button
                            aria-label={open ? "Collapse" : "Expand"}
                            onClick={() => setExpanded(open ? null : c.slug)}
                            className="p-2 text-ink-muted"
                          >
                            {open ? <Minus size={16} /> : <Plus size={16} />}
                          </button>
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {open && subs.length > 0 && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="overflow-hidden pb-2 pl-3"
                          >
                            {subs.map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={`/shop?category=${s.slug}`}
                                  onClick={close}
                                  className="block py-2 text-sm text-ink-soft hover:text-gold-deep"
                                >
                                  {lcn(s.slug, s.name)}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-1 border-t border-line px-6 py-5 text-sm">
              <Link href="/account" onClick={close} className="block py-2 text-ink-soft hover:text-gold-deep">{t("nav.myAccount")}</Link>
              <Link href="/wishlist" onClick={close} className="block py-2 text-ink-soft hover:text-gold-deep">{t("nav.wishlist")}</Link>
              <Link href="/admin" onClick={close} className="block py-2 text-ink-soft hover:text-gold-deep">{t("nav.admin")}</Link>
              <div className="pt-2"><LanguageSwitcher /></div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
