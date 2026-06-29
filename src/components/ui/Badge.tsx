import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "gold" | "ink" | "sale" | "muted";

const tones: Record<Tone, string> = {
  gold: "bg-gold text-ink-on-gold",
  ink: "bg-ink text-bg",
  sale: "bg-danger text-white",
  muted: "border border-ink/20 text-ink-soft bg-bg-elevated/60 backdrop-blur",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
