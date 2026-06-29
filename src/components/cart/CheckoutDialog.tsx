"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShieldCheck, ChevronLeft } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { buildOrderMessage, buildWhatsAppUrl, type OrderTotals } from "@/lib/whatsapp";
import { useCart, type CartLine } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useT, useLang } from "@/i18n/provider";
import { site } from "@/config/site";

export function CheckoutDialog({
  open,
  onClose,
  lines,
  totals,
  couponCode,
}: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  totals: OrderTotals;
  couponCode?: string | null;
}) {
  const clear = useCart((s) => s.clear);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const t = useT();
  const { lang } = useLang();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const message = buildOrderMessage(form, lines, totals, couponCode ?? undefined, lang);

  const validate = () => {
    const e = {
      name: form.name.trim().length < 2,
      phone: form.phone.trim().length < 6,
      address: form.address.trim().length < 8,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const goConfirm = () => {
    if (validate()) setStep("confirm");
  };

  const sendToWhatsApp = () => {
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    clear();
    onClose();
    setCartOpen(false);
    setStep("form");
    setForm({ name: "", phone: "", address: "" });
  };

  const close = () => {
    onClose();
    setStep("form");
  };

  return (
    <Modal open={open} onClose={close} title={t("checkout.title")} maxWidth="max-w-xl">
      <p className="mb-6 text-sm text-ink-soft">{t("checkout.intro")}</p>

      {step === "form" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <Field label={t("checkout.name")} required error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              className="luxe-input"
              placeholder={t("checkout.namePh")}
            />
          </Field>
          <Field label={t("checkout.phone")} required error={errors.phone}>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              inputMode="tel"
              autoComplete="tel"
              className="luxe-input"
              placeholder={t("checkout.phonePh")}
            />
          </Field>
          <Field label={t("checkout.address")} required error={errors.address}>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              autoComplete="street-address"
              className="luxe-input resize-none"
              placeholder={t("checkout.addressPh")}
            />
          </Field>

          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <ShieldCheck size={15} className="text-success" />
            {t("checkout.privacyNote")}
          </div>

          <Button onClick={goConfirm} variant="gold" size="lg" className="w-full">
            <MessageCircle size={17} /> {t("checkout.review")}
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <button onClick={() => setStep("form")} className="flex items-center gap-1 text-xs text-ink-muted hover:text-gold-deep">
            <ChevronLeft size={14} /> {t("checkout.editDetails")}
          </button>
          <div>
            <p className="eyebrow mb-2">{t("checkout.preview")}</p>
            <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap bg-bg-sunken p-4 font-sans text-[0.78rem] leading-relaxed text-ink-soft">
              {message}
            </pre>
          </div>
          <p className="text-xs text-ink-muted">
            {t("checkout.sendingTo", { name: site.name, phone: site.contact.phoneDisplay })}
          </p>
          <Button onClick={sendToWhatsApp} variant="gold" size="lg" className="w-full">
            <MessageCircle size={17} /> {t("checkout.confirm")}
          </Button>
        </motion.div>
      )}
    </Modal>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-soft">
        {label} {required && <span className="text-gold-deep">*</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-danger">{t("checkout.required")}</span>}
    </label>
  );
}
