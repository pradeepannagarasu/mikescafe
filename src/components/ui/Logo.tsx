"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/data";

type LogoProps = {
  className?: string;
  size?: "nav" | "footer" | "hero" | "boot" | "admin";
  priority?: boolean;
  withWordmark?: boolean;
};

const sizes = {
  nav: { width: 160, height: 80, className: "h-10 w-auto md:h-11" },
  footer: { width: 220, height: 110, className: "h-16 w-auto md:h-20" },
  hero: { width: 360, height: 180, className: "h-24 w-auto md:h-28" },
  boot: { width: 320, height: 160, className: "h-20 w-auto md:h-24" },
  admin: { width: 120, height: 60, className: "h-9 w-auto" },
} as const;

export function Logo({
  className,
  size = "nav",
  priority = false,
  withWordmark = false,
}: LogoProps) {
  const s = sizes[size];

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={SITE.logo}
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
