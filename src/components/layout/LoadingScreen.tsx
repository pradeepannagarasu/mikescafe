"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/Logo";

export function LoadingScreen() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(
      () => document.documentElement.classList.remove("app-booting"),
      reduce ? 0 : 1800
    );
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove("app-booting");
    };
  }, []);

  return (
    <div
      className="boot-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-ivory pointer-events-none"
      aria-hidden
    >
      <p className="text-[11px] tracking-[0.35em] uppercase text-gold mb-8">Italian Deli</p>
      <Logo size="boot" variant="light" priority />
      <div className="mt-10 h-px w-24 bg-copper boot-line" />
    </div>
  );
}
