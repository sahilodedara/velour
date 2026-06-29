"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, FolderTree, Tag, Image as ImageIcon,
  Ticket, Settings, Search, Bell, Menu, X, TrendingUp, TrendingDown, ArrowUpRight,
  Store, Sun, Moon, AlertTriangle,
} from "lucide-react";
import { products, brands, getBrandName, getTopCategories } from "@/data";
import { useUI } from "@/store/ui";
import { formatPrice, cn } from "@/lib/utils";

type Section = "dashboard" | "products" | "orders" | "customers" | "categories" | "brands" | "banners" | "coupons" | "settings";

const NAV: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { key: "products", label: "Products", icon: <Package size={18} /> },
  { key: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { key: "customers", label: "Customers", icon: <Users size={18} /> },
  { key: "categories", label: "Categories", icon: <FolderTree size={18} /> },
  { key: "brands", label: "Brands", icon: <Tag size={18} /> },
  { key: "banners", label: "Banners", icon: <ImageIcon size={18} /> },
  { key: "coupons", label: "Coupons", icon: <Ticket size={18} /> },
  { key: "settings", label: "Settings", icon: <Settings size={18} /> },
];

const REVENUE = [38, 42, 51, 47, 63, 72, 68, 81, 77, 92, 88, 104]; // mock monthly ($k)
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const ORDERS = [
  { id: "VL-10428", customer: "Eleanor Vance", total: 2450, status: "Confirmed", date: "Jun 29" },
  { id: "VL-10427", customer: "Marco Tassi", total: 5220, status: "Shipped", date: "Jun 29" },
  { id: "VL-10426", customer: "Aisha Khan", total: 320, status: "Pending", date: "Jun 28" },
  { id: "VL-10425", customer: "Daniel Roche", total: 1980, status: "Delivered", date: "Jun 28" },
  { id: "VL-10424", customer: "Sofia Marin", total: 890, status: "Confirmed", date: "Jun 27" },
  { id: "VL-10423", customer: "Liam O'Connor", total: 6800, status: "Shipped", date: "Jun 27" },
  { id: "VL-10422", customer: "Priya Mehta", total: 240, status: "Delivered", date: "Jun 26" },
];

const STATUS_TONE: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-600",
  Confirmed: "bg-blue-500/15 text-blue-600",
  Shipped: "bg-violet-500/15 text-violet-600",
  Delivered: "bg-emerald-500/15 text-emerald-600",
  Cancelled: "bg-red-500/15 text-red-600",
};

export function AdminApp() {
  const [section, setSection] = useState<Section>("dashboard");
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useUI();
  const current = NAV.find((n) => n.key === section)!;

  return (
    <div className="min-h-dvh bg-bg-sunken text-ink">
      {/* Sidebar */}
      <AdminSidebar section={section} setSection={(s) => { setSection(s); setOpen(false); }} open={open} setOpen={setOpen} />

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg-elevated/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(true)}><Menu size={20} /></button>
            <div>
              <h1 className="font-display text-xl leading-none">{current.label}</h1>
              <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted">VELOUR Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden items-center gap-2 border border-line px-3 py-2 md:flex">
              <Search size={15} className="text-ink-muted" />
              <input placeholder="Search…" className="w-40 bg-transparent text-sm focus:outline-none" />
            </div>
            <button onClick={toggleTheme} aria-label="Toggle theme" className="text-ink-soft hover:text-gold-deep">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative text-ink-soft hover:text-gold-deep" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold" />
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-sm text-bg">A</div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {section === "dashboard" && <Dashboard />}
              {section === "products" && <ProductsTable />}
              {section === "orders" && <OrdersTable />}
              {!["dashboard", "products", "orders"].includes(section) && (
                <ModulePlaceholder section={section} icon={current.icon} label={current.label} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({
  section, setSection, open, setOpen,
}: {
  section: Section; setSection: (s: Section) => void; open: boolean; setOpen: (v: boolean) => void;
}) {
  const inner = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-noir-line px-6">
        <span className="font-display text-2xl tracking-[0.18em] text-noir-ink">VEL<span className="text-gold">OUR</span></span>
        <button className="text-noir-ink-soft lg:hidden" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => setSection(n.key)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
              section === n.key ? "bg-gold/15 text-gold" : "text-noir-ink-soft hover:bg-white/5 hover:text-noir-ink",
            )}
          >
            {n.icon} {n.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-noir-line p-4">
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-noir-ink-soft transition-colors hover:text-gold">
          <Store size={18} /> View store
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-noir lg:block">{inner}</aside>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="absolute inset-y-0 left-0 w-64 bg-noir" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              {inner}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dashboard() {
  const lowStock = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  const maxRev = Math.max(...REVENUE);

  const stats = [
    { label: "Revenue", value: "$284,920", delta: "+12.4%", up: true },
    { label: "Orders", value: "1,284", delta: "+8.1%", up: true },
    { label: "Products", value: String(products.length), delta: "+3", up: true },
    { label: "Customers", value: "3,460", delta: "−1.2%", up: false },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-line bg-bg-elevated p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">{s.label}</p>
            <p className="mt-2 font-display text-3xl">{s.value}</p>
            <p className={cn("mt-2 flex items-center gap-1 text-xs", s.up ? "text-emerald-600" : "text-red-500")}>
              {s.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {s.delta}
              <span className="text-ink-muted">vs last month</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="border border-line bg-bg-elevated p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl">Revenue</h2>
            <span className="text-xs text-ink-muted">Last 12 months ($k)</span>
          </div>
          <div className="flex h-52 items-stretch gap-2">
            {REVENUE.map((v, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full bg-gradient-to-t from-gold-deep to-gold transition-all duration-500 group-hover:from-gold group-hover:to-gold-bright"
                    style={{ height: `${(v / maxRev) * 100}%` }}
                    title={`$${v}k`}
                  />
                </div>
                <span className="text-[0.6rem] text-ink-muted">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="border border-line bg-bg-elevated p-6">
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="font-display text-xl">Low stock</h2>
          </div>
          <ul className="space-y-4">
            {lowStock.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.name}</p>
                  <p className="text-xs text-ink-muted">{getBrandName(p.brand)}</p>
                </div>
                <span className={cn("shrink-0 px-2 py-0.5 text-xs", p.stock <= 3 ? "bg-red-500/15 text-red-600" : "bg-amber-500/15 text-amber-600")}>
                  {p.stock} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="border border-line bg-bg-elevated p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl">Recent orders</h2>
            <span className="flex items-center gap-1 text-xs text-gold-deep">View all <ArrowUpRight size={12} /></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ORDERS.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 font-medium">{o.id}</td>
                    <td className="py-3 text-ink-soft">{o.customer}</td>
                    <td className="py-3 tabular-nums">{formatPrice(o.total)}</td>
                    <td className="py-3"><span className={cn("px-2 py-0.5 text-xs", STATUS_TONE[o.status])}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="border border-line bg-bg-elevated p-6">
          <h2 className="mb-5 font-display text-xl">Top products</h2>
          <ol className="space-y-4">
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="font-display text-lg text-ink-muted">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{p.name}</p>
                  <p className="text-xs text-ink-muted">{p.reviewCount} reviews · ★ {p.rating}</p>
                </div>
                <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function ProductsTable() {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => products.filter((p) => `${p.name} ${getBrandName(p.brand)} ${p.sku}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div className="border border-line bg-bg-elevated">
      <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 border border-line px-3 py-2">
          <Search size={15} className="text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full bg-transparent text-sm focus:outline-none sm:w-64" />
        </div>
        <button className="bg-gold px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-ink-on-gold">+ Add product</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-bg-sunken">
                <td className="p-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-ink-muted">{getBrandName(p.brand)}</p>
                </td>
                <td className="p-4 text-ink-muted">{p.sku}</td>
                <td className="p-4 capitalize text-ink-soft">{p.category}</td>
                <td className="p-4 tabular-nums">{formatPrice(p.price)}</td>
                <td className="p-4">
                  <span className={cn("px-2 py-0.5 text-xs", p.stock <= 5 ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600")}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {p.featured && <Pill>Featured</Pill>}
                    {p.bestSeller && <Pill>Bestseller</Pill>}
                    {p.newArrival && <Pill>New</Pill>}
                    {p.trending && <Pill>Trending</Pill>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTable() {
  return (
    <div className="border border-line bg-bg-elevated">
      <div className="border-b border-line p-5">
        <h2 className="font-display text-lg">All orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ORDERS.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-bg-sunken">
                <td className="p-4 font-medium">{o.id}</td>
                <td className="p-4 text-ink-soft">{o.customer}</td>
                <td className="p-4 text-ink-muted">{o.date}</td>
                <td className="p-4 tabular-nums">{formatPrice(o.total)}</td>
                <td className="p-4"><span className={cn("px-2 py-0.5 text-xs", STATUS_TONE[o.status])}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModulePlaceholder({ section, icon, label }: { section: string; icon: React.ReactNode; label: string }) {
  const counts: Record<string, string> = {
    customers: "3,460 customers",
    categories: `${getTopCategories().length} top-level · 10 sub`,
    brands: `${brands.length} houses`,
    banners: "Homepage & category banners",
    coupons: "3 active codes",
    settings: "Store, tax, shipping, WhatsApp, socials",
  };
  return (
    <div className="grid min-h-[60vh] place-items-center border border-dashed border-line bg-bg-elevated text-center">
      <div className="max-w-md px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-bg-sunken text-gold-deep">{icon}</div>
        <h2 className="mt-6 font-display text-2xl">{label}</h2>
        <p className="mt-2 text-sm text-ink-soft">
          The {label} module is scaffolded in the data layer ({counts[section] ?? ""}) with full CRUD planned —
          backed by the tables in <code className="text-gold-deep">supabase/schema.sql</code>.
        </p>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="border border-line px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-ink-muted">{children}</span>;
}
