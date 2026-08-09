"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { useCart } from "@/context/CartContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

const SPEED_PX_PER_SEC = 42;

export function FeaturedBreakfast() {
  const { content } = useContent();
  const { addItem } = useCart();
  const [activeId, setActiveId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  const favourites = useMemo(
    () =>
      content.menuItems.filter(
        (i) => i.favourite && i.group === "order" && Boolean(i.image)
      ),
    [content.menuItems]
  );

  // Duplicate for a seamless loop
  const loopItems = useMemo(
    () => [...favourites, ...favourites, ...favourites],
    [favourites]
  );

  const selected = activeId
    ? favourites.find((i) => i.id === activeId) ?? null
    : null;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || favourites.length === 0) return;

    let raf = 0;
    let last = performance.now();
    let started = false;

    const tick = (now: number) => {
      const loopWidth = track.scrollWidth / 3;
      if (loopWidth > 0 && !started) {
        // Start on the middle copy so LTR travel is seamless
        offsetRef.current = -loopWidth;
        started = true;
      }

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Content drifts left → right
      offsetRef.current += SPEED_PX_PER_SEC * dt;

      if (loopWidth > 0 && offsetRef.current >= 0) {
        offsetRef.current -= loopWidth;
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [favourites.length]);

  if (favourites.length === 0) return null;

  return (
    <section id="favourites" className="bg-cream py-20 sm:py-24 md:py-32 overflow-hidden">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Favourites"
          title="Italian Classics Worth Coming Back For"
          subtitle="House favourites scroll continuously. Tap any plate to preview and add it to your order."
        />
      </div>

      <div className="relative marquee-mask mt-2 overflow-hidden">
        <div
          ref={trackRef}
          className="favourites-marquee flex w-max gap-4 sm:gap-6 pl-4 will-change-transform"
          aria-label="Scrolling favourite dishes"
        >
          {loopItems.map((item, idx) => (
            <FavouriteScrollCard
              key={`${item.id}-${idx}`}
              item={item}
              real={idx < favourites.length}
              selected={activeId === item.id}
              onSelect={() => setActiveId(item.id)}
            />
          ))}
        </div>
      </div>

      <div className="section-pad mx-auto max-w-[1400px] mt-8 sm:mt-10">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid sm:grid-cols-[140px_1fr_auto] gap-4 sm:gap-6 items-center bg-ivory border border-walnut/10 rounded-sm p-4 sm:p-5"
            >
              <div className="relative aspect-square sm:aspect-[4/5] rounded-sm overflow-hidden bg-vintage max-w-[140px]">
                {selected.image ? (
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    quality={92}
                    className="object-cover"
                    sizes="140px"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-copper mb-1">
                  Selected
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-walnut">
                  {selected.name}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed max-w-xl">
                  {selected.description}
                </p>
                <p className="mt-3 text-copper font-medium">
                  {formatPrice(selected.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => addItem(selected)}
                className="w-full sm:w-auto min-h-12 px-6 py-3 bg-copper text-ivory text-[12px] tracking-[0.14em] uppercase rounded-sm hover:bg-[#a34f4f] transition-colors"
              >
                Add to order
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted"
            >
              Tap a dish to preview and add it to your order.
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center">
          <a
            href="#menu"
            className="text-[11px] tracking-[0.2em] uppercase text-copper hover:text-racing transition-colors"
          >
            View full menu
          </a>
        </p>
      </div>
    </section>
  );
}

function FavouriteScrollCard({
  item,
  real,
  selected,
  onSelect,
}: {
  item: MenuItem;
  real: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-hidden={!real}
      tabIndex={real ? 0 : -1}
      className={cn(
        "w-[200px] sm:w-[240px] md:w-[280px] shrink-0 text-left group",
        selected && "ring-2 ring-copper ring-offset-2 ring-offset-cream rounded-sm"
      )}
    >
      <div className="img-reveal relative aspect-[4/5] rounded-sm bg-vintage overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={real ? item.name : ""}
            fill
            quality={92}
            className="object-cover"
            sizes="280px"
          />
        ) : null}
        <span className="absolute top-2.5 left-2.5 text-[9px] tracking-[0.14em] uppercase bg-copper text-ivory px-2 py-1">
          Favourite
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="font-serif text-lg sm:text-xl text-walnut leading-tight">
          {item.name}
        </h3>
        <p className="text-copper text-sm whitespace-nowrap">
          {formatPrice(item.price)}
        </p>
      </div>
    </button>
  );
}
