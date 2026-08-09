"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/utils";

export function FeaturedBreakfast() {
  const { content } = useContent();
  const favourites = content.menuItems.filter((i) => i.favourite);
  const items = [...favourites, ...favourites];
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const offset = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const speed = 0.35; // px per frame-ish

    const tick = () => {
      if (!paused.current && track) {
        offset.current -= speed;
        const half = track.scrollWidth / 2;
        if (Math.abs(offset.current) >= half) offset.current = 0;
        track.style.transform = `translate3d(${offset.current}px,0,0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    // Prefer CSS when available; JS drives as reliable fallback
    track.classList.add("marquee-js");
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="breakfast" className="bg-cream py-24 md:py-32 overflow-hidden">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Morning Favourites"
          title="Breakfast Worth Crossing London For"
          subtitle="Slow-cooked classics and house signatures — the plates that made Mike's a Notting Hill ritual."
        />
      </div>

      <div
        className="relative"
        onMouseEnter={() => {
          paused.current = true;
        }}
        onMouseLeave={() => {
          paused.current = false;
        }}
        onTouchStart={() => {
          paused.current = true;
        }}
        onTouchEnd={() => {
          paused.current = false;
        }}
      >
        <div ref={trackRef} className="marquee-track gap-6 md:gap-8 pl-4 will-change-transform">
          {items.map((item, idx) => (
            <article
              key={`${item.id}-${idx}`}
              className="w-[280px] md:w-[360px] shrink-0 group"
            >
              <div className="img-reveal relative aspect-[4/5] rounded-sm bg-vintage">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="360px"
                />
                {item.favourite && (
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase bg-racing text-ivory px-3 py-1.5">
                    Favourite
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-walnut">{item.name}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <p className="text-copper font-medium whitespace-nowrap pt-1">
                  {formatPrice(item.price)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
