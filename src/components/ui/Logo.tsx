"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/data";

type LogoProps = {
  className?: string;
  size?: "nav" | "footer" | "hero" | "boot" | "admin" | "login";
  priority?: boolean;
  /** light = ivory mark for dark backgrounds */
  variant?: "dark" | "light";
  withWordmark?: boolean;
};

const sizes = {
  nav: { width: 180, height: 72, className: "h-10 w-auto md:h-11" },
  footer: { width: 240, height: 96, className: "h-14 w-auto md:h-16" },
  hero: { width: 520, height: 208, className: "h-[min(22vw,140px)] w-auto md:h-40" },
  boot: { width: 400, height: 160, className: "h-24 w-auto md:h-28" },
  admin: { width: 140, height: 56, className: "h-9 w-auto" },
  login: { width: 220, height: 88, className: "h-14 w-auto mx-auto" },
} as const;

export function Logo({
  className,
  size = "nav",
  priority = false,
  variant = "dark",
  withWordmark = false,
}: LogoProps) {
  const s = sizes[size];
  const src = variant === "light" ? SITE.logoLight : SITE.logo;

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={src}
        alt={SITE.name}
        width={s.width}
        height={s.height}
        priority={priority}
        className={cn("object-contain", s.className)}
      />
      {withWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="font-serif text-xl tracking-tight">{SITE.name}</span>
          <span className="text-[9px] tracking-[0.28em] uppercase text-copper">
            Italian Deli
          </span>
        </span>
      )}
    </span>
  );
}
