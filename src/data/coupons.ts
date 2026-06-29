export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minPurchase?: number;
  label: string;
}

export const coupons: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, label: "10% off your first order" },
  { code: "GOLD15", type: "percent", value: 15, minPurchase: 1000, label: "15% off orders over $1,000" },
  { code: "VELOUR50", type: "fixed", value: 50, minPurchase: 500, label: "$50 off orders over $500" },
];

export interface CouponResult {
  ok: boolean;
  discount: number;
  message: string;
  code?: string;
}

export function resolveCoupon(rawCode: string, subtotal: number): CouponResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, discount: 0, message: "Enter a code" };
  const coupon = coupons.find((c) => c.code === code);
  if (!coupon) return { ok: false, discount: 0, message: "Invalid code" };
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return {
      ok: false,
      discount: 0,
      message: `Spend $${coupon.minPurchase.toLocaleString()} to use ${code}`,
    };
  }
  const discount =
    coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  return { ok: true, discount, message: coupon.label, code };
}
