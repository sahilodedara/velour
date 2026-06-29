import { cn } from "@/lib/utils";

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.55l-5.9 3.1 1.12-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

export function Stars({
  rating,
  count,
  size = 14,
  className,
  showValue = false,
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex" aria-label={`${rating} out of 5 stars`}>
        <span className="flex gap-0.5 text-line-strong">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold"
          style={{ width: `${pct}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} />
          ))}
        </span>
      </span>
      {showValue && <span className="text-xs font-medium text-ink-soft">{rating.toFixed(1)}</span>}
      {count != null && <span className="text-xs text-ink-muted">({count})</span>}
    </span>
  );
}
