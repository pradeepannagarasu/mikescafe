"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { GALLERY_SHOTS, SITE } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const HERO_IMAGE = GALLERY_SHOTS.hero;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "22%"]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-walnut"
      aria-label="La Piccola Deli hero"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="La Piccola Deli counter and interior"
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-[center_45%] scale-105 brightness-[1.08] contrast-[1.06] saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-walnut/45 via-walnut/28 to-walnut/72" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,32,24,0.35)_100%)]" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center section-pad text-center text-ivory">
        <h1 className="sr-only">{SITE.name}</h1>
        <motion.div
          className="mb-8"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.7 }}
        >
          <Logo size="hero" variant="light" priority />
        </motion.div>

        <motion.p
          className="mt-2 max-w-md text-base md:text-lg text-ivory/75 leading-relaxed"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.7 }}
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.65 }}
        >
          <Button href="#reserve" variant="gold">
            Order / Collect
          </Button>
          <Button href="#menu" variant="secondary">
            View Menu
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-ivory/60">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="h-10 w-px bg-ivory/30 overflow-hidden" aria-hidden>
          <div className="h-full w-full bg-ivory/80 scroll-line" />
        </div>
      </div>
    </section>
  );
}
