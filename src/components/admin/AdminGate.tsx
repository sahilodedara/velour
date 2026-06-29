"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User, ShieldAlert } from "lucide-react";
import { AdminApp } from "./AdminApp";
import { useT } from "@/i18n/provider";

/**
 * Demo admin gate. NOTE: this is a client-side check for demonstration only —
 * it is NOT real security. Replace with Supabase Auth + server-side role checks
 * before any real deployment (see supabase/schema.sql).
 */
const ADMIN_USER = "admin";
const ADMIN_PASS = "velour2026";
const KEY = "velour-admin";

export function AdminGate() {
  const t = useT();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setAuthed(sessionStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setUser("");
    setPass("");
  };

  if (!ready) return <div className="min-h-dvh bg-bg-sunken" />;
  if (authed) return <AdminApp onLogout={logout} />;

  return (
    <div className="grid min-h-dvh place-items-center bg-noir px-6 text-noir-ink grain">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,100,0.16),transparent_60%)] blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm border border-noir-line bg-noir-soft/60 p-8 backdrop-blur"
      >
        <p className="font-display text-3xl tracking-[0.18em]">
          VEL<span className="text-gold">OUR</span>
        </p>
        <h1 className="mt-5 font-display text-2xl">{t("admin.loginTitle")}</h1>
        <p className="mt-1 text-sm text-noir-ink-soft">{t("admin.loginSub")}</p>

        <form onSubmit={submit} className="mt-7 space-y-3">
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-noir-ink-soft" />
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder={t("admin.username")}
              autoComplete="username"
              className="w-full border border-noir-line bg-transparent py-3 pl-10 pr-3 text-sm text-noir-ink placeholder:text-noir-ink-soft focus:border-gold focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-noir-ink-soft" />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder={t("admin.password")}
              autoComplete="current-password"
              className="w-full border border-noir-line bg-transparent py-3 pl-10 pr-3 text-sm text-noir-ink placeholder:text-noir-ink-soft focus:border-gold focus:outline-none"
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-xs text-red-400">
              <ShieldAlert size={14} /> {t("admin.wrongCreds")}
            </p>
          )}

          <button
            type="submit"
            className="sheen w-full bg-gold py-3 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-ink-on-gold transition-colors hover:bg-gold-bright"
          >
            {t("admin.signIn")}
          </button>
        </form>

        <div className="mt-6 border-t border-noir-line pt-4 text-center text-xs text-noir-ink-soft">
          {t("admin.demoHint")}: <span className="text-gold">admin</span> / <span className="text-gold">velour2026</span>
        </div>
      </motion.div>
    </div>
  );
}
