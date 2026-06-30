"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { brands, getTopCategories, getCategory } from "@/data";
import { useCustomProducts } from "@/store/useCustomProducts";
import { useT } from "@/i18n/provider";
import { slugify } from "@/lib/utils";
import type { Product } from "@/data/types";

const cats = getTopCategories();

export function AddProductModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const t = useT();
  const { add, global } = useCustomProducts();
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState(brands[0].slug);
  const [category, setCategory] = useState(cats[0].slug);
  const [price, setPrice] = useState("");
  const [original, setOriginal] = useState("");
  const [stock, setStock] = useState("10");
  const [material, setMaterial] = useState("");
  const [short, setShort] = useState("");
  const [desc, setDesc] = useState("");
  const [sizes, setSizes] = useState("");
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [colors, setColors] = useState([
    { name: "Black", hex: "#15140f" },
    { name: "", hex: "#b08d57" },
  ]);
  const [err, setErr] = useState(false);

  const reset = () => {
    setName(""); setPrice(""); setOriginal(""); setStock("10");
    setMaterial(""); setShort(""); setDesc(""); setSizes("");
    setFeatured(false); setNewArrival(true);
    setColors([{ name: "Black", hex: "#15140f" }, { name: "", hex: "#b08d57" }]);
    setErr(false);
  };

  const save = async () => {
    const priceN = parseFloat(price);
    if (name.trim().length < 2 || !priceN || priceN <= 0) {
      setErr(true);
      return;
    }
    setBusy(true);
    setErrMsg(null);
    const ts = Date.now();
    const cat = getCategory(category);
    const product: Product = {
      id: `custom-${ts}`,
      slug: `${slugify(name)}-${ts.toString().slice(-4)}`,
      name: name.trim(),
      brand,
      category,
      sku: `CUST-${ts.toString().slice(-6)}`,
      price: priceN,
      originalPrice: original ? parseFloat(original) || undefined : undefined,
      shortDescription: short.trim() || name.trim(),
      description: desc.trim() || short.trim() || name.trim(),
      colors: colors.filter((c) => c.name.trim()).map((c) => ({ name: c.name.trim(), hex: c.hex })),
      sizes: sizes.trim() ? sizes.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      material: material.trim() || "—",
      stock: parseInt(stock) || 0,
      rating: 5,
      reviewCount: 0,
      tags: ["new"],
      featured,
      newArrival,
      palette: cat?.palette ?? ["#1c1b18", "#7a6a44"],
      specs: material.trim() ? [{ label: "Material", value: material.trim() }] : [],
      custom: true,
    };
    if (product.colors.length === 0) product.colors = [{ name: "Black", hex: "#15140f" }];
    const res = await add(product);
    setBusy(false);
    if (!res.ok) {
      setErrMsg(res.error ?? "Failed to save");
      return;
    }
    reset();
    onAdded();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t("admin.addTitle")} maxWidth="max-w-2xl">
      <div className="space-y-4">
        <Field label={t("admin.fName")} required>
          <input value={name} onChange={(e) => setName(e.target.value)} className="luxe-input" placeholder="The Solène Top-Handle Bag" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("admin.fBrand")}>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="luxe-input">
              {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </select>
          </Field>
          <Field label={t("admin.fCategory")}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="luxe-input">
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t("admin.fPrice")} required>
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className="luxe-input" placeholder="2450" />
          </Field>
          <Field label={t("admin.fOriginal")}>
            <input value={original} onChange={(e) => setOriginal(e.target.value)} inputMode="decimal" className="luxe-input" placeholder="2900" />
          </Field>
          <Field label={t("admin.fStock")}>
            <input value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" className="luxe-input" />
          </Field>
        </div>

        <Field label={t("admin.fMaterial")}>
          <input value={material} onChange={(e) => setMaterial(e.target.value)} className="luxe-input" placeholder="Full-grain calfskin" />
        </Field>
        <Field label={t("admin.fShort")}>
          <input value={short} onChange={(e) => setShort(e.target.value)} className="luxe-input" placeholder="A sculptural top-handle in hand-finished calfskin." />
        </Field>
        <Field label={t("admin.fDesc")}>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="luxe-input resize-none" />
        </Field>

        {/* Colors */}
        <div>
          <p className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-soft">{t("admin.fColors")}</p>
          <div className="space-y-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" value={c.hex} onChange={(e) => setColors(colors.map((x, j) => j === i ? { ...x, hex: e.target.value } : x))} className="h-10 w-12 cursor-pointer border border-line bg-transparent" />
                <input value={c.name} onChange={(e) => setColors(colors.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className="luxe-input flex-1 !py-2" placeholder="Color name (e.g. Cognac)" />
                {colors.length > 1 && (
                  <button onClick={() => setColors(colors.filter((_, j) => j !== i))} className="text-ink-muted hover:text-danger"><Trash2 size={15} /></button>
                )}
              </div>
            ))}
            <button onClick={() => setColors([...colors, { name: "", hex: "#888888" }])} className="flex items-center gap-1 text-xs text-gold-deep">
              <Plus size={13} /> {t("admin.fColors")}
            </button>
          </div>
        </div>

        <Field label={t("admin.fSizes")}>
          <input value={sizes} onChange={(e) => setSizes(e.target.value)} className="luxe-input" placeholder="S, M, L  /  39, 40, 41" />
        </Field>

        <div className="flex flex-wrap gap-5 pt-1">
          <Toggle label={t("admin.fFeatured")} checked={featured} onChange={() => setFeatured(!featured)} />
          <Toggle label={t("admin.fNew")} checked={newArrival} onChange={() => setNewArrival(!newArrival)} />
        </div>

        {err && <p className="text-xs text-danger">{t("checkout.required")} — {t("admin.fName")} + {t("admin.fPrice")}</p>}
        {errMsg && <p className="text-xs text-danger">{errMsg}</p>}

        {!global && <p className="text-xs text-ink-muted">{t("admin.localNote")}</p>}

        <div className="flex gap-3 pt-2">
          <Button onClick={save} variant="gold" size="md" className="flex-1" disabled={busy}>{t("admin.save")}</Button>
          <button onClick={onClose} className="border border-line px-6 text-xs uppercase tracking-[0.18em] hover:border-gold-deep">{t("admin.cancel")}</button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-soft">
        {label} {required && <span className="text-gold-deep">*</span>}
      </span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center gap-2 text-sm">
      <span className={`grid h-5 w-5 place-items-center border transition-colors ${checked ? "border-gold bg-gold" : "border-line-strong"}`}>
        {checked && <svg width="11" height="11" viewBox="0 0 12 12" className="text-ink-on-gold"><path d="M2 6l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      {label}
    </button>
  );
}
