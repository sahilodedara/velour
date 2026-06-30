"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { dict, LANGS, type Lang } from "./dict";

type Vars = Record<string, string | number>;

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Vars) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function lookup(obj: Record<string, unknown>, path: string): string | undefined {
  const v = path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj);
  return typeof v === "string" ? v : undefined;
}

function interpolate(s: string, vars?: Vars): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default 'en' so SSR and first client render match (no hydration mismatch);
  // saved preference is applied after mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("velour-lang") as Lang | null;
      if (saved && LANGS.some((l) => l.code === saved)) {
        setLangState(saved);
        document.documentElement.lang = saved === "zh" ? "zh-CN" : saved;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("velour-lang", l);
      document.cookie = `velour-lang=${l};path=/;max-age=31536000`;
      document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Vars) => {
      const s = lookup(dict[lang], key) ?? lookup(dict.en, key) ?? key;
      return interpolate(s, vars);
    },
    [lang],
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/** Convenience: returns the translate function directly. */
export function useT() {
  return useI18n().t;
}

export function useLang() {
  const { lang, setLang } = useI18n();
  return { lang, setLang };
}
