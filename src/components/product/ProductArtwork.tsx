import { cn } from "@/lib/utils";

/**
 * Fully original, dependency-free product imagery.
 * Renders a layered-gradient editorial "plate" with a stylized category motif,
 * a faint brand monogram and film grain — deterministic per product, no external assets.
 */

type Motif = "bag" | "garment" | "shoe" | "perfume" | "watch" | "jewelry" | "eyewear";

const CATEGORY_MOTIF: Record<string, Motif> = {
  bags: "bag", handbags: "bag", wallets: "bag", backpacks: "bag", travel: "bag",
  clothing: "garment", jackets: "garment", shirts: "garment", tshirts: "garment",
  shoes: "shoe", sneakers: "shoe",
  perfumes: "perfume",
  watches: "watch",
  jewelry: "jewelry",
  accessories: "eyewear", sunglasses: "eyewear", belts: "eyewear",
};

function MotifPath({ motif }: { motif: Motif }) {
  switch (motif) {
    case "bag":
      return (
        <g>
          <path d="M150 215 q50 -46 100 0 v118 q0 14 -14 14 h-72 q-14 0 -14 -14 z" />
          <path d="M168 215 q32 -64 64 0" fill="none" />
          <path d="M186 262 h28" />
        </g>
      );
    case "garment":
      return (
        <g>
          <path d="M158 196 l24 -14 q18 18 36 0 l24 14 l16 26 l-22 16 l-4 -10 v94 h-64 v-94 l-4 10 l-22 -16 z" />
        </g>
      );
    case "shoe":
      return (
        <g>
          <path d="M146 286 q4 -34 30 -44 q12 -4 22 6 q14 14 44 18 q26 4 30 22 q2 12 -10 14 h-108 q-10 0 -8 -16 z" />
          <path d="M150 300 h104" fill="none" />
        </g>
      );
    case "perfume":
      return (
        <g>
          <rect x="186" y="186" width="28" height="18" rx="2" />
          <path d="M178 214 q22 -10 44 0 v104 q0 12 -12 12 h-20 q-12 0 -12 -12 z" />
          <path d="M193 232 h14" fill="none" />
        </g>
      );
    case "watch":
      return (
        <g>
          <rect x="188" y="188" width="24" height="30" rx="6" />
          <rect x="188" y="296" width="24" height="30" rx="6" />
          <circle cx="200" cy="257" r="40" fill="none" />
          <circle cx="200" cy="257" r="2.5" />
          <path d="M200 257 v-22 M200 257 l16 8" fill="none" />
        </g>
      );
    case "jewelry":
      return (
        <g>
          <circle cx="200" cy="276" r="42" fill="none" />
          <path d="M178 224 h44 l14 18 l-36 26 l-36 -26 z" fill="none" />
          <path d="M178 224 l18 18 m26 -18 l-18 18 m-8 26 v-26 M164 242 h72" fill="none" />
        </g>
      );
    case "eyewear":
      return (
        <g>
          <circle cx="166" cy="252" r="30" fill="none" />
          <circle cx="234" cy="252" r="30" fill="none" />
          <path d="M196 250 q4 -8 8 0" fill="none" />
          <path d="M136 240 l-12 -8 M264 240 l12 -8" fill="none" />
        </g>
      );
  }
}

export function ProductArtwork({
  palette,
  monogram,
  category,
  name,
  className,
  variant = "card",
}: {
  palette: [string, string];
  monogram: string;
  category: string;
  name?: string;
  className?: string;
  variant?: "card" | "hero";
}) {
  const motif = CATEGORY_MOTIF[category] ?? "bag";
  const uid = `${monogram}-${category}-${palette[0]}`.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label={name ? `${name} — illustrative` : "Product illustration"}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="34%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
        <linearGradient id={`gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#efdcad" />
          <stop offset="50%" stopColor="#c8a464" />
          <stop offset="100%" stopColor="#9a7b3f" />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#bg-${uid})`} />
      <rect width="400" height="500" fill={`url(#glow-${uid})`} />

      {/* faint brand monogram watermark - hidden in admin */}
      {variant === "hero" && (
        <text
          x="200" y="300" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="300" fontWeight="500"
          fill="#ffffff" opacity="0.05"
        >
          {monogram}
        </text>
      )}

      {/* category motif in gold line */}
      <g
        stroke={`url(#gold-${uid})`}
        strokeWidth={variant === "hero" ? 2 : 2.4}
        fill={`url(#gold-${uid})`}
        fillOpacity="0.14"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.95"
      >
        <MotifPath motif={motif} />
      </g>

      {/* thin frame */}
      <rect x="16" y="16" width="368" height="468" fill="none" stroke="#ffffff" strokeOpacity="0.12" />
    </svg>
  );
}
