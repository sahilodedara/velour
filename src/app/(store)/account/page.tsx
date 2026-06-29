"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { useT } from "@/i18n/provider";

type Tab = "signin" | "register" | "forgot";

export default function AccountPage() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("signin");
  const [notice, setNotice] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(true);
  };

  return (
    <div className="pt-24 md:pt-28">
      <div className="grid min-h-[80vh] lg:grid-cols-2">
        {/* Editorial panel */}
        <div className="relative hidden overflow-hidden bg-noir p-16 text-noir-ink grain lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(200,164,100,0.18),transparent_60%)] blur-3xl" />
          <p className="font-display text-3xl tracking-[0.18em]">VEL<span className="text-gold">OUR</span></p>
          <div>
            <h2 className="font-display text-4xl leading-tight">{t("account.brandTitle")}</h2>
            <p className="mt-4 max-w-sm text-noir-ink-soft">
              {t("account.brandDesc")}
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-noir-ink-soft">{site.tagline}</p>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center px-6 py-16">
          <Container className="max-w-md !px-0">
            <div className="mb-8 flex gap-6 border-b border-line">
              {(["signin", "register", "forgot"] as Tab[]).map((tb) => (
                <button
                  key={tb}
                  onClick={() => { setTab(tb); setNotice(false); }}
                  className="relative pb-3 text-sm font-medium"
                >
                  <span className={tab === tb ? "text-ink" : "text-ink-muted"}>
                    {tb === "signin" ? t("account.signin") : tb === "register" ? t("account.register") : t("account.reset")}
                  </span>
                  {tab === tb && <motion.span layoutId="acct-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                onSubmit={submit}
                className="space-y-4"
              >
                <h1 className="font-display text-3xl">
                  {tab === "signin" ? t("account.welcome") : tab === "register" ? t("account.join") : t("account.resetTitle")}
                </h1>

                {tab === "register" && (
                  <IconField icon={<User size={16} />}><input className="luxe-input pl-10" placeholder={t("account.name")} autoComplete="name" /></IconField>
                )}
                <IconField icon={<Mail size={16} />}><input type="email" required className="luxe-input pl-10" placeholder={t("account.email")} autoComplete="email" /></IconField>
                {tab !== "forgot" && (
                  <IconField icon={<Lock size={16} />}><input type="password" required className="luxe-input pl-10" placeholder={t("account.password")} autoComplete={tab === "signin" ? "current-password" : "new-password"} /></IconField>
                )}

                {tab === "signin" && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setTab("forgot")} className="text-xs text-ink-muted hover:text-gold-deep">{t("account.forgot")}</button>
                  </div>
                )}

                <Button type="submit" variant="gold" size="lg" className="w-full" magnetic={false}>
                  {tab === "signin" ? t("account.signinBtn") : tab === "register" ? t("account.registerBtn") : t("account.resetBtn")}
                </Button>

                {tab !== "forgot" && (
                  <>
                    <div className="flex items-center gap-4 py-1 text-xs text-ink-muted">
                      <span className="h-px flex-1 bg-line" /> {t("account.or")} <span className="h-px flex-1 bg-line" />
                    </div>
                    <button type="button" onClick={submit} className="flex w-full items-center justify-center gap-3 border border-line py-3 text-sm transition-colors hover:border-gold-deep">
                      <GoogleIcon /> {t("account.google")}
                    </button>
                  </>
                )}

                <AnimatePresence>
                  {notice && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 bg-bg-sunken p-3 text-xs text-ink-soft"
                    >
                      <Info size={14} className="mt-0.5 shrink-0 text-gold-deep" />
                      {t("account.notice")}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            </AnimatePresence>
          </Container>
        </div>
      </div>
    </div>
  );
}

function IconField({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">{icon}</span>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.1 0 24 0 14.6 0 6.4 5.4 2.6 13.2l7.9 6.2C12.3 13.5 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 7l7.2 5.6c4.2-3.9 6.6-9.6 6.6-17.1z" />
      <path fill="#FBBC05" d="M10.5 28.4c-.5-1.4-.8-3-.8-4.4s.3-3 .7-4.4l-7.9-6.2C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.6l7.9-6.2z" />
      <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.2-5.6c-2 1.4-4.6 2.2-7.8 2.2-6.4 0-11.7-4-13.5-9.7l-7.9 6.2C6.4 42.6 14.6 48 24 48z" />
    </svg>
  );
}
