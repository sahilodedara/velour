import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

/** VELOUR wordmark with a subtle champagne-gold accent on the trailing syllable. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${site.name} — home`}
      className={cn(
        "font-display text-2xl leading-none tracking-[0.18em] md:text-[1.7rem]",
        className,
      )}
    >
      <span>{site.wordmark.lead}</span>
      <span className="text-gold-deep">{site.wordmark.trail}</span>
    </Link>
  );
}
