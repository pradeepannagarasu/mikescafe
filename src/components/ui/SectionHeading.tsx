"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
  children,
}: SectionHeadingProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "mb-12 md:mb-16 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-4 text-[11px] tracking-[0.28em] uppercase",
            light ? "text-gold" : "text-copper"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05] tracking-tight text-balance",
          light ? "text-ivory" : "text-walnut"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base md:text-lg leading-relaxed max-w-xl",
            align === "center" && "mx-auto",
            light ? "text-ivory/70" : "text-muted"
          )}
        >
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  );
}
