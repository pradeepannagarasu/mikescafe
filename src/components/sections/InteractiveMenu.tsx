"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";
import { useContent } from "@/context/ContentContext";
import { useCart } from "@/context/CartContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, cn } from "@/lib/utils";
import type { MenuCategory } from "@/types";

const categories: { id: MenuCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "traditional", label: "Traditional" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "lunch", label: "Lunch" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

export function InteractiveMenu() {
  const { content } = useContent();
  const { addItem } = useCart();
  const [category, setCategory] = useState<MenuCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const filtered = useMemo(() => {
    return content.menuItems.filter((item) => {
      const matchCat = category === "all" || item.category === category;
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchFav = !favouritesOnly || item.favourite;
      return matchCat && matchQuery && matchFav;
    });
  }, [content.menuItems, category, query, favouritesOnly]);

  return (
    <section id="menu" className="bg-ivory py-24 md:py-32">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="The Menu"
          title="Whatever Morning Calls For"
          subtitle="From the Full English to fresh juices - browse, search, and find your plate."
        />

        {content.specialOfTheDay && (
          <div className="mb-12 md:mb-16 border border-racing/20 bg-racing/[0.04] px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.28em] uppercase text-racing mb-2">
                Special of the Day
              </p>
              <p className="font-serif text-2xl md:text-3xl text-walnut">
                {content.specialOfTheDay.name}
              </p>
              <p className="mt-2 text-sm text-muted max-w-xl">
                {content.specialOfTheDay.description}
              </p>
            </div>
            <p className="font-serif text-3xl text-copper">
              {formatPrice(content.specialOfTheDay.price)}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6 mb-10">
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="search"
              placeholder="Search the menu…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-cream border border-walnut/10 rounded-sm pl-11 pr-4 py-3.5 text-sm placeholder:text-muted/70 focus:border-copper/50 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "shrink-0 px-4 py-2.5 text-[11px] tracking-[0.16em] uppercase rounded-sm border transition-all min-h-11",
                  category === c.id
                    ? "bg-racing text-ivory border-racing"
                    : "bg-transparent text-walnut/70 border-walnut/15 hover:border-walnut/35"
                )}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFavouritesOnly((v) => !v)}
              className={cn(
                "shrink-0 px-4 py-2.5 text-[11px] tracking-[0.16em] uppercase rounded-sm border transition-all min-h-11",
                favouritesOnly
                  ? "bg-copper text-ivory border-copper"
                  : "bg-transparent text-walnut/70 border-walnut/15"
              )}
            >
              Favourites
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-8 md:gap-x-6 md:gap-y-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="group flex flex-col h-full"
              >
                <div className="img-reveal relative aspect-[4/5] sm:aspect-[5/4] rounded-sm bg-vintage">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-3 sm:mt-4 flex flex-col gap-1.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-base sm:text-xl md:text-2xl text-walnut leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-copper text-sm whitespace-nowrap pt-0.5">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(item)}
                  className="mt-3 sm:mt-4 w-full min-h-10 sm:min-h-11 text-[10px] sm:text-[11px] tracking-[0.12em] uppercase border border-walnut/15 hover:border-racing hover:bg-racing hover:text-ivory transition-colors rounded-sm"
                >
                  Add to order
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted py-16">No dishes match your search.</p>
        )}
      </div>
    </section>
  );
}
