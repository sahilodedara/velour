import { site } from "@/config/site";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";
import type { CartLine } from "@/store/cart";

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
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
): string {
  const now = new Date();
  const L: string[] = [];

  L.push(`*${site.name} — NEW ORDER*`);
  L.push("────────────────────");
  L.push(`*Name:* ${customer.name}`);
  L.push(`*Phone:* ${customer.phone}`);
  L.push(`*Address:* ${customer.address}`);
  L.push(`*Date:* ${formatDate(now)}`);
  L.push(`*Time:* ${formatTime(now)}`);
  L.push("────────────────────");
  L.push("*ORDER DETAILS*");
  L.push("");

  lines.forEach((line, i) => {
    const opts = [line.color, line.size, line.material].filter(Boolean).join(" · ");
    L.push(`*${i + 1}. ${line.brand} — ${line.name}*`);
    if (opts) L.push(`   Variant: ${opts}`);
    L.push(`   Qty: ${line.quantity}  ×  ${formatPrice(line.price)}`);
    L.push(`   Line total: ${formatPrice(line.price * line.quantity)}`);
    L.push("");
  });

  L.push("────────────────────");
  L.push(`Subtotal: ${formatPrice(totals.subtotal)}`);
  if (totals.discount > 0) {
    L.push(`Discount${couponCode ? ` (${couponCode})` : ""}: −${formatPrice(totals.discount)}`);
  }
  if (totals.tax > 0) L.push(`Tax: ${formatPrice(totals.tax)}`);
  L.push(`Shipping: ${totals.shipping > 0 ? formatPrice(totals.shipping) : "Complimentary"}`);
  L.push(`*GRAND TOTAL: ${formatPrice(totals.grandTotal)}*`);
  L.push("────────────────────");
  L.push("");
  L.push(`Thank you for shopping with ${site.name}. Please confirm availability and delivery.`);

  return L.join("\n");
}

/** Build a wa.me deep link that works on mobile app and WhatsApp Web. */
export function buildWhatsAppUrl(message: string, phone: string = site.whatsappNumber): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
