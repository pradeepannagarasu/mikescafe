"use client";

import { FaInstagram } from "react-icons/fa";
import { SITE, navLinks } from "@/lib/data";
import { useContent } from "@/context/ContentContext";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { content } = useContent();
  const { address, phone, openingHours } = content;

  return (
    <footer className="bg-walnut text-ivory">
      <div className="section-pad mx-auto max-w-[1400px] py-20 md:py-28">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <a href="#home" className="inline-block" aria-label="La Piccola Deli home">
              <Logo size="footer" variant="light" />
            </a>
            <p className="mt-5 text-[11px] tracking-[0.28em] uppercase text-gold">
              Italian Deli
            </p>
            <p className="mt-6 text-ivory/65 leading-relaxed max-w-xs">
              Panini, piadina, lasagna and Italian mains, made fresh for eat-in or collect.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] tracking-[0.24em] uppercase text-gold mb-5">
              Visit
            </h3>
            <address className="not-italic text-ivory/75 leading-relaxed space-y-1">
              <p>{address.line1}</p>
              <p>{[address.line2, address.city].filter(Boolean).join(", ")}</p>
              <p>{address.postcode}</p>
              {phone && phone !== "0000 000 0000" ? (
                <p className="pt-3">
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold transition-colors">
                    {phone}
                  </a>
                </p>
              ) : null}
            </address>
          </div>

          <div>
            <h3 className="text-[11px] tracking-[0.24em] uppercase text-gold mb-5">
              Hours
            </h3>
            <ul className="space-y-2 text-sm text-ivory/75">
              {openingHours.map((h) => (
                <li key={h.day} className="flex justify-between gap-6 max-w-[220px]">
                  <span>{h.day}</span>
                  <span className={h.closed ? "text-ivory/40" : ""}>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] tracking-[0.24em] uppercase text-gold mb-5">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-ivory/75">
              {navLinks.slice(0, 6).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/admin" className="hover:text-gold transition-colors">
                  Admin
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-8">
              {[
                { Icon: FaInstagram, href: SITE.instagram, label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center border border-ivory/20 rounded-sm hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-ivory/45 tracking-wide">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-ivory/80">Privacy</a>
            <a href="/terms" className="hover:text-ivory/80">Terms</a>
            <a href="#visit" className="hover:text-ivory/80">
              Find us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
