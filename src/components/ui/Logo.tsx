"use client";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/data";

type LogoProps = {
  className?: string;
  size?: "nav" | "footer" | "hero" | "boot" | "admin";
  priority?: boolean;
  withWordmark?: boolean;
};

const sizes = {
  nav: "text-lg md:text-xl",
  footer: "text-2xl md:text-3xl",
  hero: "text-4xl md:text-5xl",
  boot: "text-3xl md:text-4xl",
  admin: "text-base",
} as const;

export function Logo({
  className,
  size = "nav",
  withWordmark = false,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-serif tracking-tight text-current",
            sizes[size]
          )}
        >
          {SITE.name}
        </span>
        {(withWordmark || size === "footer" || size === "boot") && (
          <span className="text-[9px] tracking-[0.28em] uppercase text-copper mt-1">
            Italian Deli
          </span>
        )}
      </span>
    </span>
  );
}
