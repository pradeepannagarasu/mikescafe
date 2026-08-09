"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SITE } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const POSTER =
  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1600&q=80";
const VIDEO_SRC =
  "https://videos.pexels.com/video-files/4259119/4259119-hd_1920_1080_25fps.mp4";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [loadVideo, setLoadVideo] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "22%"]);

  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const saveData = Boolean(connection?.saveData);
    const slow = Boolean(connection?.effectiveType?.includes("2g"));
    const allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!allowMotion || saveData || slow) return;

    const t = window.setTimeout(() => setLoadVideo(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-walnut"
      aria-label="Mike's Cafe hero"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />
        {loadVideo && (
          <video
            className="absolute inset-0 h-full w-full object-cover scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={POSTER}
            aria-hidden
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-walnut/55 via-walnut/35 to-walnut/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(44,33,24,0.45)_100%)]" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center section-pad text-center text-ivory">
        <motion.p
          className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-gold mb-5"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          Since {SITE.established}
        </motion.p>

        <motion.div
          className="flex flex-col items-center"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="sr-only">{SITE.name}</h1>
          <Logo size="hero" priority />
        </motion.div>

        <motion.p
          className="mt-7 max-w-md text-base md:text-lg text-ivory/75 leading-relaxed"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.65 }}
        >
          <Button href="#reserve" variant="gold">
            Reserve Table
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
