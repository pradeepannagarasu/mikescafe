"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";

const styles: Record<Variant, string> = {
  primary:
    "bg-racing text-ivory hover:bg-racing-light shadow-[0_8px_30px_rgba(196,74,34,0.35)]",
  secondary:
    "bg-transparent text-ivory border border-ivory/40 hover:bg-ivory/10",
  ghost:
    "bg-transparent text-walnut border border-walnut/20 hover:border-walnut/50 hover:bg-walnut/[0.03]",
  gold: "bg-copper text-ivory hover:brightness-110 shadow-[0_8px_24px_rgba(212,137,60,0.35)]",
};

interface ButtonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function Button({
  variant = "primary",
  children,
  className,
  href,
  type = "button",
  onClick,
  disabled,
  target,
  rel,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] tracking-[0.14em] uppercase font-medium transition-all duration-300 rounded-sm min-h-12",
    styles[variant],
    disabled && "opacity-60 pointer-events-none",
    className
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        target={target ?? (external ? "_blank" : undefined)}
        rel={rel ?? (external ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
