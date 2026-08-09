"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/data";

export const LOGO_SRC = "/mikeslogo.png";

type LogoProps = {
  className?: string;
  /** Visual size preset */
  size?: "nav" | "footer" | "hero" | "boot" | "admin";
  priority?: boolean;
  /** Show accessible text beside / for screen readers */
  withWordmark?: boolean;
};

const sizes = {
  nav: { width: 148, height: 148, className: "h-11 w-11 md:h-12 md:w-12" },
  footer: { width: 180, height: 180, className: "h-24 w-24 md:h-28 md:w-28" },
  hero: { width: 520, height: 520, className: "h-[min(42vw,280px)] w-[min(42vw,280px)] md:h-[340px] md:w-[340px]" },
  boot: { width: 280, height: 280, className: "h-40 w-40 md:h-52 md:w-52" },
  admin: { width: 64, height: 64, className: "h-10 w-10" },
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
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-sm bg-black shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-copper/25",
          s.className
        )}
      >
        <Image
          src={LOGO_SRC}
          alt={SITE.name}
          width={s.width}
          height={s.height}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="font-serif text-xl tracking-tight">{SITE.name}</span>
          <span className="text-[9px] tracking-[0.28em] uppercase text-copper">
            Since {SITE.established}
          </span>
        </span>
      )}
    </span>
  );
}
