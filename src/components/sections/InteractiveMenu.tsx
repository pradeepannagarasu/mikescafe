"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { HiOutlineSearch } from "react-icons/hi";
import { useContent } from "@/context/ContentContext";
import { useCart } from "@/context/CartContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, cn } from "@/lib/utils";
import {
  DRINK_CATEGORIES,
  MENU_GROUPS,
  ORDER_CATEGORIES,
  menuCatalog,
} from "@/lib/menu-catalog";
import type { MenuCategory, MenuGroup, MenuItem } from "@/types";

function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  const textOnly = !item.image;
  return (
    <article
      className={cn(
        "group flex h-full",
        textOnly
          ? "col-span-2 md:col-span-3 flex-row items-center gap-4 border-b border-walnut/10 py-3"
          : "flex-col"
      )}
    >
      {!textOnly && (
        <div className="img-reveal relative aspect-[4/5] sm:aspect-[5/4] rounded-sm bg-vintage">
          <Image
            src={item.image!}
            alt={item.name}
            fill
            quality={92}
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-1.5 flex-1",
          textOnly ? "min-w-0" : "mt-3 sm:mt-4"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-serif text-walnut leading-tight",
              textOnly ? "text-lg sm:text-xl" : "text-base sm:text-xl md:text-2xl"
            )}
          >
            {item.name}
          </h3>
          <span className="text-copper text-sm whitespace-nowrap pt-0.5">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description ? (
          <p className="text-xs sm:text-sm text-muted line-clamp-2">{item.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onAdd(item)}
        className={cn(
          "text-[10px] sm:text-[11px] tracking-[0.12em] uppercase border border-walnut/15 hover:border-racing hover:bg-racing hover:text-ivory transition-colors rounded-sm",
          textOnly
            ? "shrink-0 px-4 min-h-10"
            : "mt-3 sm:mt-4 w-full min-h-10 sm:min-h-11"
        )}
      >
        {textOnly ? "Add" : "Add to order"}
      </button>
    </article>
  );
}

export function InteractiveMenu() {
  const { content } = useContent();
  const { addItem } = useCart();
  const [group, setGroup] = useState<MenuGroup>("order");
  const [category, setCategory] = useState<MenuCategory | "all">("all");
  const [query, setQuery] = useState("");

  const categoryTabs = useMemo(() => {
    if (group === "order") return ORDER_CATEGORIES;
    if (group === "drinks") return DRINK_CATEGORIES;
    return [];
  }, [group]);

  /** Always prefer the live catalog so categories stay complete after updates */
  const sourceItems = useMemo(() => {
    const byId = new Map(content.menuItems.map((i) => [i.id, i]));
    return menuCatalog.map((item) => {
      const edited = byId.get(item.id);
      if (!edited) return item;
      return {
        ...item,
        price: edited.price,
        description: edited.description || item.description,
        favourite: edited.favourite ?? item.favourite,
      };
    });
  }, [content.menuItems]);

  useEffect(() => {
    setCategory("all");
    setQuery("");
  }, [group]);

  const matchQuery = (item: MenuItem) =>
    !query ||
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase());

  const sections = useMemo(() => {
    const inGroup = sourceItems.filter((i) => i.group === group && matchQuery(i));

    if (categoryTabs.length === 0) {
      return inGroup.length
        ? [{ id: group as MenuCategory | MenuGroup, label: MENU_GROUPS.find((g) => g.id === group)?.label ?? "Items", items: inGroup }]
        : [];
    }

    const tabs =
      category === "all"
        ? categoryTabs
        : categoryTabs.filter((t) => t.id === category);

    return tabs
      .map((tab) => ({
        id: tab.id,
        label: tab.label,
        items: inGroup.filter((i) => i.category === tab.id),
      }))
      .filter((section) => section.items.length > 0);
  }, [sourceItems, group, category, query, categoryTabs]);

  const totalVisible = sections.reduce((n, s) => n + s.items.length, 0);
  const groupHint = MENU_GROUPS.find((g) => g.id === group)?.hint ?? "";

  const counts = useMemo(() => {
    const map = new Map<MenuCategory, number>();
    for (const item of sourceItems) {
      if (item.group !== group) continue;
      map.set(item.category, (map.get(item.category) ?? 0) + 1);
    }
    return map;
  }, [sourceItems, group]);

  return (
    <section id="menu" className="bg-ivory py-24 md:py-32">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="The Menu"
          title="Order Made Simple"
          subtitle="Browse by category — every item sits in its own section. Tap a category to focus, or All to scroll the full menu."
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {MENU_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={cn(
                "rounded-sm border px-4 py-3 text-left transition-colors min-h-14",
                group === g.id
                  ? "border-racing bg-racing text-ivory"
                  : "border-walnut/15 bg-cream/50 hover:border-walnut/35"
              )}
            >
              <span className="block text-[11px] tracking-[0.16em] uppercase">{g.label}</span>
              <span
                className={cn(
                  "block text-xs mt-1",
                  group === g.id ? "text-ivory/70" : "text-muted"
                )}
              >
                {g.hint}
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-6">{groupHint}</p>

        <div className="flex flex-col gap-6 mb-10">
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="search"
              placeholder={`Search ${group}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-cream border border-walnut/10 rounded-sm pl-11 pr-4 py-3.5 text-sm placeholder:text-muted/70 focus:border-copper/50 outline-none transition-colors"
            />
          </div>

          {categoryTabs.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={cn(
                  "w-full px-3 py-2.5 text-[10px] sm:text-[11px] tracking-[0.14em] uppercase rounded-sm border transition-all min-h-11 text-left",
                  category === "all"
                    ? "bg-racing text-ivory border-racing"
                    : "bg-transparent text-walnut/70 border-walnut/15 hover:border-walnut/35"
                )}
              >
                All sections
              </button>
              {categoryTabs.map((c) => {
                const count = counts.get(c.id) ?? 0;
                if (!count) return null;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "w-full px-3 py-2.5 text-[10px] sm:text-[11px] tracking-[0.14em] uppercase rounded-sm border transition-all min-h-11 text-left flex items-center justify-between gap-2",
                      category === c.id
                        ? "bg-racing text-ivory border-racing"
                        : "bg-transparent text-walnut/70 border-walnut/15 hover:border-walnut/35"
                    )}
                  >
                    <span className="truncate">{c.label}</span>
                    <span
                      className={cn(
                        "tabular-nums shrink-0",
                        category === c.id ? "text-ivory/70" : "text-muted"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-14 md:space-y-16">
          {sections.map((section) => (
            <div key={String(section.id)} id={`menu-${section.id}`}>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-walnut/10 pb-3">
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-walnut">
                  {section.label}
                </h3>
                <p className="text-[11px] tracking-[0.16em] uppercase text-muted shrink-0 pb-1">
                  {section.items.length}{" "}
                  {section.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-8 md:gap-x-6 md:gap-y-10">
                {section.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAdd={addItem} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {totalVisible === 0 && (
          <p className="text-center text-muted py-16">No items match your search.</p>
        )}
      </div>
    </section>
  );
}
