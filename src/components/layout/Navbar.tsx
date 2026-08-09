"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { CartButton } from "@/components/cart/CartDrawer";
import { useContent } from "@/context/ContentContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { content } = useContent();
  const hasAnnouncement = content.announcements.some((a) => a.active);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 z-50 transition-all duration-500",
          hasAnnouncement ? "top-9" : "top-0",
          scrolled || open ? "glass border-b border-walnut/8 py-3" : "bg-transparent py-5"
        )}
      >
        <div className="section-pad mx-auto max-w-[1400px] flex items-center justify-between gap-6">
          <a href="#home" className="group relative z-10 inline-flex items-center gap-3" aria-label="Mike's Cafe home">
            <Logo size="nav" priority />
            <span className="hidden sm:flex flex-col leading-tight">
              <span
                className={cn(
                  "font-serif text-lg md:text-xl tracking-tight transition-colors",
                  scrolled || open ? "text-walnut" : "text-ivory"
                )}
              >
                Mike&apos;s Cafe
              </span>
              <span
                className={cn(
                  "text-[9px] tracking-[0.28em] uppercase transition-colors",
                  scrolled || open ? "text-copper" : "text-gold"
                )}
              >
                Good vibes only
              </span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[12px] tracking-[0.12em] uppercase transition-opacity hover:opacity-70",
                  scrolled ? "text-walnut/80" : "text-ivory/85"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={cn(
                scrolled || open ? "text-walnut" : "text-ivory"
              )}
            >
              <CartButton />
            </div>
            <Button
              href="#reserve"
              variant="gold"
              className="hidden sm:inline-flex !py-2.5 !px-5 !text-[11px] !min-h-10"
            >
              Reserve
            </Button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "lg:hidden relative z-10 flex h-11 w-11 items-center justify-center rounded-sm",
                scrolled || open ? "text-walnut" : "text-ivory"
              )}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <HiX size={24} /> : <HiMenuAlt4 size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
            "fixed inset-0 z-40 bg-cream section-pad lg:hidden",
            hasAnnouncement ? "pt-36" : "pt-28"
          )}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-4xl text-walnut py-2 border-b border-walnut/10"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-10">
              <Button href="#reserve" onClick={() => setOpen(false)} className="w-full">
                Reserve a Table
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
