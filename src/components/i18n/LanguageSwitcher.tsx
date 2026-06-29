"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLang } from "@/i18n/provider";
import { LANGS } from "@/i18n/dict";
import { cn } from "@/lib/utils";

/** Compact globe dropdown to switch EN / 简体中文. */
export function LanguageSwitcher({ tone = "auto" }: { tone?: "auto" | "noir" }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label="Language"
        className="flex items-center gap-1 transition-colors hover:text-gold-deep"
      >
        <Globe size={18} />
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.12em]">{current.short}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 top-full z-50 mt-3 w-36 border py-1.5 shadow-luxe",
              tone === "noir" ? "border-noir-line bg-noir text-noir-ink" : "border-line bg-bg-elevated text-ink",
            )}
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  onMouseDown={() => { setLang(l.code); setOpen(false); }}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:text-gold-deep"
                >
                  {l.label}
                  {l.code === lang && <Check size={14} className="text-gold-deep" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
