"use client";

import { useEffect } from "react";

export function LoadingScreen() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(
      () => document.documentElement.classList.remove("app-booting"),
      reduce ? 0 : 1600
    );
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove("app-booting");
    };
  }, []);

  return (
    <div
      className="boot-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-walnut text-ivory pointer-events-none"
      aria-hidden
    >
      <p className="text-[11px] tracking-[0.35em] uppercase text-gold mb-6">Est. 1962</p>
      <p className="font-serif text-5xl md:text-7xl tracking-tight">Mike&apos;s Cafe</p>
      <div className="mt-10 h-px w-24 bg-copper boot-line" />
    </div>
  );
}
