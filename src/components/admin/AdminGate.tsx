"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, User, Mail, ShieldAlert } from "lucide-react";
import { AdminApp } from "./AdminApp";
import { useT } from "@/i18n/provider";
import { getSupabase, isSupabaseEnabled } from "@/lib/supabase/client";

/**
 * Admin gate.
 * - When Supabase is configured (env vars set) → real email/password auth,
 *   and access is restricted to emails present in the `admins` table (RLS-guarded).
 * - Otherwise → a client-side DEMO gate (admin / velour2026). NOT real security.
 */
export function AdminGate() {
  return isSupabaseEnabled ? <SupabaseGate /> : <DemoGate />;
}

/* ----------------------------- Login shell ----------------------------- */
function LoginShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-noir px-6 text-noir-ink grain">
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
        <h1 className="mt-5 font-display text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-noir-ink-soft">{t("admin.loginSub")}</p>
        {children}
        {footer}
      </motion.div>
    </div>
  );
}

const inputClass =
  "w-full border border-noir-line bg-transparent py-3 pl-10 pr-3 text-sm text-noir-ink placeholder:text-noir-ink-soft focus:border-gold focus:outline-none";
const submitClass =
  "sheen w-full bg-gold py-3 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-ink-on-gold transition-colors hover:bg-gold-bright disabled:opacity-60";

/* ----------------------------- Demo gate ----------------------------- */
const DEMO_USER = "admin";
const DEMO_PASS = "velour2026";
const DEMO_KEY = "velour-admin";

function DemoGate() {
  const t = useT();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setAuthed(sessionStorage.getItem(DEMO_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.trim() === DEMO_USER && pass === DEMO_PASS) {
      try {
        sessionStorage.setItem(DEMO_KEY, "1");
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
      sessionStorage.removeItem(DEMO_KEY);
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
    <LoginShell
      title={t("admin.loginTitle")}
      footer={
        <div className="mt-6 border-t border-noir-line pt-4 text-center text-xs text-noir-ink-soft">
          {t("admin.demoHint")}: <span className="text-gold">admin</span> / <span className="text-gold">velour2026</span>
        </div>
      }
    >
      <form onSubmit={submit} className="mt-7 space-y-3">
        <div className="relative">
          <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-noir-ink-soft" />
          <input value={user} onChange={(e) => setUser(e.target.value)} placeholder={t("admin.username")} autoComplete="username" className={inputClass} />
        </div>
        <div className="relative">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-noir-ink-soft" />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder={t("admin.password")} autoComplete="current-password" className={inputClass} />
        </div>
        {error && (
          <p className="flex items-center gap-2 text-xs text-red-400">
            <ShieldAlert size={14} /> {t("admin.wrongCreds")}
          </p>
        )}
        <button type="submit" className={submitClass}>{t("admin.signIn")}</button>
      </form>
    </LoginShell>
  );
}

/* --------------------------- Supabase gate --------------------------- */
function SupabaseGate() {
  const t = useT();
  const supabase = getSupabase();
  const [status, setStatus] = useState<"loading" | "out" | "in">("loading");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns true if the signed-in email is listed in the `admins` table.
  const isAdmin = useCallback(
    async (userEmail?: string | null): Promise<boolean> => {
      if (!supabase || !userEmail) return false;
      const { data, error: e } = await supabase
        .from("admins")
        .select("email")
        .eq("email", userEmail)
        .maybeSingle();
      if (e) return false;
      return Boolean(data);
    },
    [supabase],
  );

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const ok = await isAdmin(data.session?.user.email);
      if (active) setStatus(ok ? "in" : "out");
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const ok = await isAdmin(session?.user.email);
      if (active) setStatus(ok ? "in" : "out");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, isAdmin]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { data, error: signErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (signErr) {
      setError(t("admin.authError"));
      setBusy(false);
      return;
    }
    const ok = await isAdmin(data.user?.email);
    if (!ok) {
      await supabase.auth.signOut();
      setError(t("admin.notAuthorized"));
    }
    setBusy(false);
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    setStatus("out");
    setEmail("");
    setPass("");
  };

  if (status === "loading") return <div className="min-h-dvh bg-bg-sunken" />;
  if (status === "in") return <AdminApp onLogout={logout} />;

  return (
    <LoginShell title={t("admin.loginTitle")}>
      <form onSubmit={submit} className="mt-7 space-y-3">
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-noir-ink-soft" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("admin.email")} autoComplete="email" className={inputClass} />
        </div>
        <div className="relative">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-noir-ink-soft" />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder={t("admin.password")} autoComplete="current-password" className={inputClass} />
        </div>
        {error && (
          <p className="flex items-center gap-2 text-xs text-red-400">
            <ShieldAlert size={14} /> {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? t("admin.signingIn") : t("admin.signIn")}
        </button>
      </form>
    </LoginShell>
  );
}
