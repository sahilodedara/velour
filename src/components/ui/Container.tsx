import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container-luxe", className)}>{children}</div>;
}

/** Section heading block: eyebrow + serif title + optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className={cn("eyebrow mb-4 flex items-center gap-3", align === "center" && "justify-center")}>
          <span className="h-px w-8 bg-gold" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl leading-[1.1] md:text-[2.7rem]">{title}</h2>
      {description && <p className="mt-4 text-ink-soft leading-relaxed">{description}</p>}
    </div>
  );
}
