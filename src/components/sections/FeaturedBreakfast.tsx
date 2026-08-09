"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, cn } from "@/lib/utils";
import type { MenuCategory, MenuItem } from "@/types";

const CATEGORY_ORDER: { id: MenuCategory; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "traditional", label: "Traditional" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "drinks", label: "Drinks" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "lunch", label: "Lunch" },
  { id: "desserts", label: "Desserts" },
];

function FavouriteCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex flex-col h-full">
      <div className="img-reveal relative aspect-[4/5] sm:aspect-[3/4] rounded-sm bg-vintage overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] tracking-[0.16em] uppercase bg-racing text-ivory px-2 py-1 sm:px-2.5 sm:py-1.5">
          Favourite
        </span>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-walnut leading-tight">
            {item.name}
          </h3>
          <p className="text-copper font-medium text-sm sm:text-base whitespace-nowrap pt-0.5">
            {formatPrice(item.price)}
          </p>
        </div>
        <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-2 sm:line-clamp-3">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export function FeaturedBreakfast() {
  const { content } = useContent();
  const favourites = useMemo(
    () => content.menuItems.filter((i) => i.favourite),
    [content.menuItems]
  );

  const tabs = useMemo(() => {
    const present = new Set(favourites.map((i) => i.category));
    return CATEGORY_ORDER.filter((c) => present.has(c.id));
  }, [favourites]);

  const [active, setActive] = useState<MenuCategory | null>(null);
  const category = active ?? tabs[0]?.id ?? "breakfast";

  const filtered = useMemo(
    () => favourites.filter((i) => i.category === category),
    [favourites, category]
  );

  if (favourites.length === 0) return null;

  return (
    <section id="breakfast" className="bg-cream py-20 sm:py-24 md:py-32">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Morning Favourites"
          title="Breakfast Worth Crossing London For"
          subtitle="Slow-cooked classics and house signatures. The plates that made Mike's a Notting Hill ritual."
        />

        {/* Category tabs */}
        <div
          className="mt-2 mb-8 sm:mb-10 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none"
          role="tablist"
          aria-label="Favourite categories"
        >
          {tabs.map((tab) => {
            const count = favourites.filter((i) => i.category === tab.id).length;
            const isOn = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isOn}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase rounded-sm border transition-all min-h-11",
                  isOn
                    ? "bg-racing text-ivory border-racing"
                    : "bg-ivory/60 text-walnut/70 border-walnut/12 hover:border-walnut/30"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "text-[10px] tabular-nums",
                    isOn ? "text-ivory/70" : "text-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:gap-x-6 md:gap-y-12"
          >
            {filtered.map((item) => (
              <FavouriteCard key={item.id} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-muted text-sm py-12">
            No favourites in this category yet.
          </p>
        )}

        <p className="mt-10 sm:mt-12 text-center">
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
