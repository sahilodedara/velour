"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Variant = "primary" | "gold" | "outline" | "ghost" | "noir";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-wide " +
  "transition-colors duration-300 ease-[var(--ease-luxe)] cursor-pointer select-none " +
  "disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 overflow-hidden";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bg hover:bg-ink/90",
  gold: "bg-gold text-ink-on-gold hover:bg-gold-bright shadow-gold",
  outline: "border border-ink/30 text-ink hover:border-gold hover:text-gold-deep",
  ghost: "text-ink hover:text-gold-deep",
  noir: "bg-noir text-noir-ink hover:bg-noir-soft border border-noir-line",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.72rem] uppercase tracking-[0.18em]",
  md: "h-12 px-7 text-[0.78rem] uppercase tracking-[0.2em]",
  lg: "h-14 px-9 text-[0.82rem] uppercase tracking-[0.22em]",
};

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
}

type ButtonProps = CommonProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  magnetic = true,
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: MouseEvent) => {
    if (!magnetic || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(base, variants[variant], sizes[size], "sheen", className);
  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>;
  const motionProps = {
    ref: ref as never,
    style: { x: sx, y: sy },
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onClick,
    className: classes,
  };

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <motion.a href={href} target="_blank" rel="noopener noreferrer" {...motionProps}>
          {inner}
        </motion.a>
      );
    }
    return (
      <MotionLink href={href} {...motionProps}>
        {inner}
      </MotionLink>
    );
  }

  return (
    <motion.button type={type} disabled={disabled} {...motionProps}>
      {inner}
    </motion.button>
  );
}
