"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ImagePlus, Film, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { brands, getTopCategories, getCategory } from "@/data";
import { useCustomProducts } from "@/store/useCustomProducts";
import { getSupabase } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/supabase/media";
import { useT } from "@/i18n/provider";
import { slugify } from "@/lib/utils";
import type { Product } from "@/data/types";

/** Downscale an image file to a compact JPEG data URL (for local, no-backend mode). */
function resizeToDataUrl(file: File, maxW = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d")?.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const cats = getTopCategories();

export function AddProductModal({
  open,
  onClose,
  onAdded,
  editProduct,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
  editProduct?: Product | null;
}) {
  const t = useT();
  const { add, update, global } = useCustomProducts();
  const isEdit = !!editProduct;
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [err, setErr] = useState(false);

  const blank = () => {
    setName(""); setBrand(brands[0].slug); setCategory(cats[0].slug);
    setPrice(""); setOriginal(""); setStock("10");
    setMaterial(""); setShort(""); setDesc(""); setSizes("");
    setFeatured(false); setNewArrival(true);
    setColors([{ name: "Black", hex: "#15140f" }, { name: "", hex: "#b08d57" }]);
    setExistingImages([]); setExistingVideo(undefined);
    setImageFiles([]); setVideoFile(null);
    setErr(false); setErrMsg(null);
  };
  const reset = blank;

  // Prefill fields when opening in edit mode.
  useEffect(() => {
    if (!open) return;
    if (editProduct) {
      setName(editProduct.name);
      setBrand(editProduct.brand);
      setCategory(editProduct.category);
      setPrice(String(editProduct.price));
      setOriginal(editProduct.originalPrice ? String(editProduct.originalPrice) : "");
      setStock(String(editProduct.stock));
      setMaterial(editProduct.material === "—" ? "" : editProduct.material);
      setShort(editProduct.shortDescription);
      setDesc(editProduct.description);
      setSizes((editProduct.sizes ?? []).join(", "));
      setFeatured(!!editProduct.featured);
      setNewArrival(!!editProduct.newArrival);
      setColors(editProduct.colors.length ? editProduct.colors.map((c) => ({ ...c })) : [{ name: "Black", hex: "#15140f" }]);
      setExistingImages(editProduct.images ?? []);
      setExistingVideo(editProduct.video);
      setImageFiles([]); setVideoFile(null);
      setErr(false); setErrMsg(null);
    } else {
      blank();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editProduct]);

  const save = async () => {
    const priceN = parseFloat(price);
    if (name.trim().length < 2 || !priceN || priceN <= 0) {
      setErr(true);
      return;
    }
    setBusy(true);
    setErrMsg(null);

    // Upload / encode media first.
    let imageUrls: string[] = [];
    let videoUrl: string | undefined;
    try {
      if (global) {
        const sb = getSupabase();
        if (sb) {
          for (const f of imageFiles) {
            const r = await uploadMedia(sb, f);
            if (r.url) imageUrls.push(r.url);
            else throw new Error(r.error || "Image upload failed");
          }
          if (videoFile) {
            const r = await uploadMedia(sb, videoFile);
            if (r.url) videoUrl = r.url;
            else throw new Error(r.error || "Video upload failed");
          }
        }
      } else {
        imageUrls = await Promise.all(imageFiles.map((f) => resizeToDataUrl(f)));
        // Video isn't stored in local mode (too large for the browser store).
      }
    } catch (e) {
      setErrMsg((e as Error).message || "Upload failed");
      setBusy(false);
      return;
    }

    const ts = Date.now();
    const cat = getCategory(category);
    const base = editProduct;
    const finalImages = [...existingImages, ...imageUrls];
    const finalVideo = videoUrl ?? existingVideo;
    const product: Product = {
      id: base?.id ?? `custom-${ts}`,
      slug: base?.slug ?? `${slugify(name)}-${ts.toString().slice(-4)}`,
      name: name.trim(),
      brand,
      category,
      subcategory: base?.subcategory,
      sku: base?.sku ?? `CUST-${ts.toString().slice(-6)}`,
      price: priceN,
      originalPrice: original ? parseFloat(original) || undefined : undefined,
      shortDescription: short.trim() || name.trim(),
      description: desc.trim() || short.trim() || name.trim(),
      colors: colors.filter((c) => c.name.trim()).map((c) => ({ name: c.name.trim(), hex: c.hex })),
      sizes: sizes.trim() ? sizes.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      material: material.trim() || "—",
      stock: parseInt(stock) || 0,
      rating: base?.rating ?? 5,
      reviewCount: base?.reviewCount ?? 0,
      tags: base?.tags ?? ["new"],
      featured,
      newArrival,
      trending: base?.trending,
      bestSeller: base?.bestSeller,
      palette: base?.palette ?? cat?.palette ?? ["#1c1b18", "#7a6a44"],
      specs: material.trim() ? [{ label: "Material", value: material.trim() }] : (base?.specs ?? []),
      images: finalImages.length ? finalImages : undefined,
      video: finalVideo,
      custom: true,
    };
    if (product.colors.length === 0) product.colors = [{ name: "Black", hex: "#15140f" }];
    const res = editProduct ? await update(product) : await add(product);
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
    <Modal open={open} onClose={onClose} title={isEdit ? t("admin.editTitle") : t("admin.addTitle")} maxWidth="max-w-2xl">
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

        {/* Images */}
        <div>
          <p className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-soft">{t("admin.fImages")}</p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((url, i) => (
              <div key={`ex-${i}`} className="relative h-20 w-20 overflow-hidden border border-gold/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))} className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-black/60 text-white">
                  <X size={12} />
                </button>
              </div>
            ))}
            {imageFiles.map((f, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, j) => j !== i))} className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-black/60 text-white">
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="grid h-20 w-20 cursor-pointer place-items-center border border-dashed border-line-strong text-ink-muted transition-colors hover:border-gold-deep hover:text-gold-deep">
              <ImagePlus size={20} />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { setImageFiles([...imageFiles, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }}
              />
            </label>
          </div>
        </div>

        {/* Video */}
        <div>
          <p className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-soft">{t("admin.fVideo")}</p>
          {videoFile ? (
            <div className="flex items-center gap-2 text-sm">
              <Film size={15} className="text-gold-deep" />
              <span className="max-w-[16rem] truncate">{videoFile.name}</span>
              <button type="button" onClick={() => setVideoFile(null)} className="text-ink-muted hover:text-danger"><X size={14} /></button>
            </div>
          ) : existingVideo ? (
            <div className="flex items-center gap-2 text-sm">
              <Film size={15} className="text-gold-deep" />
              <span className="max-w-[16rem] truncate">Current video</span>
              <button type="button" onClick={() => setExistingVideo(undefined)} className="text-ink-muted hover:text-danger"><X size={14} /></button>
            </div>
          ) : (
            <label className="inline-flex cursor-pointer items-center gap-2 border border-dashed border-line-strong px-4 py-2.5 text-sm text-ink-muted transition-colors hover:border-gold-deep hover:text-gold-deep">
              <Film size={16} /> {t("admin.fVideo")}
              <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
            </label>
          )}
          {!global && <p className="mt-1.5 text-xs text-ink-muted">{t("admin.videoLocalNote")}</p>}
        </div>

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
