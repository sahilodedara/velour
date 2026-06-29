/**
 * Central brand + store configuration.
 * Rename the marketplace, change the WhatsApp number, currency, or socials here —
 * everything across the app reads from this single source of truth.
 */

export const site = {
  name: "VELOUR",
  /** Used in the wordmark when a subtle accent split is desired: VEL·OUR */
  wordmark: { lead: "VEL", trail: "OUR" },
  tagline: "Where Modern Luxury Is Curated",
  description:
    "VELOUR is a premium luxury fashion marketplace — an exclusive edit of bags, ready-to-wear, footwear, fragrance, watches and fine jewelry from the world's most coveted houses.",
  url: "https://velour.example.com",

  /** International format, digits only (used to build wa.me links). Edit in Store Settings later. */
  whatsappNumber: "910000000000",

  currency: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
  },

  /** Default tax rate applied at checkout (0.00–1.00). Set to 0 to disable. */
  taxRate: 0,

  /** Flat shipping estimate shown in the cart; complimentary above the threshold. */
  shipping: {
    flat: 0,
    freeAbove: 0,
  },

  contact: {
    email: "concierge@velour.example.com",
    phoneDisplay: "+91 00000 00000",
  },

  socials: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
  },
} as const;

export type SiteConfig = typeof site;
