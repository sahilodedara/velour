import { site } from "@/config/site";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";
import { dict, type Lang } from "@/i18n/dict";
import type { CartLine } from "@/store/cart";

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
}

/**
 * Build a professional, well-formatted WhatsApp order message from the cart.
 * Uses plain text + light markdown that WhatsApp renders (*bold*).
 */
export function buildOrderMessage(
  customer: CustomerDetails,
  lines: CartLine[],
  totals: OrderTotals,
  couponCode?: string,
  lang: Lang = "en",
): string {
  const o = dict[lang].order as Record<string, string>;
  const now = new Date();
  const L: string[] = [];

  L.push(`*${site.name} — ${o.newOrder}*`);
  L.push("────────────────────");
  const fullAddress = [customer.address, customer.city, customer.state, customer.postalCode, customer.country]
    .filter((s) => s && s.trim())
    .join(", ");
  L.push(`*${o.name}:* ${customer.name}`);
  L.push(`*${o.email}:* ${customer.email}`);
  L.push(`*${o.phone}:* ${customer.phone}`);
  L.push(`*${o.address}:* ${fullAddress}`);
  L.push(`*${o.date}:* ${formatDate(now)}`);
  L.push(`*${o.time}:* ${formatTime(now)}`);
  L.push("────────────────────");
  L.push(`*${o.details}*`);
  L.push("");

  lines.forEach((line, i) => {
    const opts = [line.color, line.size, line.material].filter(Boolean).join(" · ");
    L.push(`*${i + 1}. ${line.brand} — ${line.name}*`);
    if (opts) L.push(`   ${o.variant}: ${opts}`);
    L.push(`   ${o.qty}: ${line.quantity}  ×  ${formatPrice(line.price)}`);
    L.push(`   ${o.lineTotal}: ${formatPrice(line.price * line.quantity)}`);
    L.push("");
  });

  L.push("────────────────────");
  L.push(`${o.subtotal}: ${formatPrice(totals.subtotal)}`);
  if (totals.discount > 0) {
    L.push(`${o.discount}${couponCode ? ` (${couponCode})` : ""}: −${formatPrice(totals.discount)}`);
  }
  if (totals.tax > 0) L.push(`${o.tax}: ${formatPrice(totals.tax)}`);
  L.push(`${o.shipping}: ${totals.shipping > 0 ? formatPrice(totals.shipping) : o.complimentary}`);
  L.push(`*${o.grandTotal}: ${formatPrice(totals.grandTotal)}*`);
  L.push("────────────────────");
  L.push("");
  L.push(o.thanks);

  return L.join("\n");
}

/** Build a wa.me deep link that works on mobile app and WhatsApp Web. */
export function buildWhatsAppUrl(message: string, phone: string = site.whatsappNumber): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
