"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { builderItems, PLATES } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { ORDER_SUBMITTED_EVENT } from "@/lib/cart-store";
import type { BuilderItem, MenuItem } from "@/types";

const BASE_PRICE = 4.5;
const BUILDER_CART_ID = "custom-breakfast";

const categories = [
  { id: "eggs", label: "Eggs" },
  { id: "meat", label: "Meats" },
  { id: "sides", label: "Sides" },
  { id: "veg", label: "Vegetables" },
] as const;

const SLOT: Record<
  BuilderItem["category"],
  { x: number; y: number; size: number; rotate: number }[]
> = {
  eggs: [
    { x: 38, y: 42, size: 34, rotate: -8 },
    { x: 48, y: 36, size: 32, rotate: 6 },
    { x: 42, y: 50, size: 30, rotate: -4 },
  ],
  meat: [
    { x: 62, y: 40, size: 30, rotate: 10 },
    { x: 68, y: 52, size: 28, rotate: -12 },
    { x: 58, y: 58, size: 26, rotate: 8 },
  ],
  sides: [
    { x: 32, y: 66, size: 28, rotate: -14 },
    { x: 48, y: 70, size: 26, rotate: 4 },
    { x: 64, y: 68, size: 27, rotate: 12 },
  ],
  veg: [
    { x: 28, y: 34, size: 26, rotate: -6 },
    { x: 72, y: 34, size: 25, rotate: 14 },
    { x: 50, y: 28, size: 24, rotate: -2 },
  ],
};

function slotFor(item: BuilderItem, indexInCategory: number) {
  const options = SLOT[item.category];
  return options[indexInCategory % options.length];
}

export function BreakfastBuilder() {
  const { addItem, setOpen, removeItem } = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const selectedItems = useMemo(
    () =>
      selected
        .map((id) => builderItems.find((i) => i.id === id))
        .filter(Boolean) as BuilderItem[],
    [selected]
  );

  const total = useMemo(
    () => BASE_PRICE + selectedItems.reduce((sum, i) => sum + i.price, 0),
    [selectedItems]
  );

  const hasEggs = selectedItems.some((i) => i.category === "eggs");
  const hasMeat = selectedItems.some((i) => i.category === "meat");
  const hasVeg = selectedItems.some((i) => i.category === "veg");
  const hasSides = selectedItems.some((i) => i.category === "sides");
  const isComplete =
    selectedItems.length >= 4 && hasEggs && hasSides && (hasMeat || hasVeg);

  const finishedPlate = hasMeat ? PLATES.english : PLATES.veggie;
  const finishedLabel = hasMeat
    ? "Your Full English plate"
    : "Your vegetarian plate";

  const categoryCounts = useMemo(() => {
    const indexes: Record<string, number> = {};
    const map = new Map<string, number>();
    for (const item of selectedItems) {
      const idx = indexes[item.category] ?? 0;
      map.set(item.id, idx);
      indexes[item.category] = idx + 1;
    }
    return map;
  }, [selectedItems]);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(null), 1800);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  useEffect(() => {
    const resetPlate = () => {
      setSelected([]);
      setJustAdded(null);
    };
    window.addEventListener(ORDER_SUBMITTED_EVENT, resetPlate);
    return () => window.removeEventListener(ORDER_SUBMITTED_EVENT, resetPlate);
  }, []);

  const add = (id: string) => {
    const item = builderItems.find((i) => i.id === id);
    if (!item) return;
    setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setJustAdded(item.name);
  };

  const remove = (id: string) => {
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const toggle = (id: string) => {
    if (selected.includes(id)) remove(id);
    else add(id);
  };

  const addPlateToOrder = () => {
    if (selectedItems.length === 0) return;
    const names = selectedItems.map((i) => i.name).join(", ");
    const menuItem: MenuItem = {
      id: BUILDER_CART_ID,
      name: "Custom Breakfast",
      description: names,
      price: total,
      category: "breakfast",
      image: isComplete ? finishedPlate : selectedItems[0]?.image ?? PLATES.english,
    };
    removeItem(BUILDER_CART_ID);
    addItem(menuItem, 1);
    setOpen(true);
  };

  return (
    <section
      id="build"
      className="bg-walnut text-ivory py-24 md:py-32 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #f0b84a 0%, transparent 40%), radial-gradient(circle at 80% 80%, #d4893c 0%, transparent 35%)",
        }}
      />

      <div className="section-pad mx-auto max-w-[1400px] relative">
        <SectionHeading
          light
          eyebrow="Build Your Own"
          title="Create Your Own Breakfast"
          subtitle="Add one item at a time. Your plate updates live as you scroll through eggs, meats, sides and veg."
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Sticky plate + running list */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-5">
            <PlateStage
              selectedItems={selectedItems}
              categoryCounts={categoryCounts}
              isComplete={isComplete}
              finishedPlate={finishedPlate}
              finishedLabel={finishedLabel}
              empty={selected.length === 0}
            />

            {/* Live “what you’ve added” list */}
            <div className="glass-dark border border-ivory/10 rounded-sm p-4 md:p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] tracking-[0.24em] uppercase text-gold">
                    Your plate so far
                  </p>
                  <p className="font-serif text-xl mt-1">
                    {selectedItems.length === 0
                      ? "Nothing yet"
                      : `${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"}`}
                  </p>
                </div>
                <motion.p
                  key={total}
                  initial={{ scale: 0.92, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-serif text-2xl text-copper"
                >
                  {formatPrice(total)}
                </motion.p>
              </div>

              <AnimatePresence mode="popLayout">
                {justAdded && (
                  <motion.p
                    key={justAdded}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-3 text-[11px] tracking-[0.14em] uppercase text-gold"
                  >
                    Just added · {justAdded}
                  </motion.p>
                )}
              </AnimatePresence>

              {selectedItems.length === 0 ? (
                <p className="text-sm text-ivory/50">
                  Scroll the list on the right and tap Add. Each choice lands here and on the plate.
                </p>
              ) : (
                <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {selectedItems.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -12, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 12, height: 0 }}
                        className="flex items-center gap-3 rounded-sm bg-black/25 border border-ivory/10 px-2.5 py-2"
                      >
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                            style={{ objectPosition: item.focus ?? "50% 50%" }}
                            sizes="40px"
                          />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm truncate">{item.name}</span>
                          <span className="text-xs text-gold">+{formatPrice(item.price)}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="text-[10px] tracking-wider uppercase text-ivory/45 hover:text-ivory"
                        >
                          Remove
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="gold"
                  className="flex-1 !min-h-11"
                  disabled={selectedItems.length === 0}
                  onClick={addPlateToOrder}
                >
                  Add plate to order
                </Button>
                <Button href="#reserve" variant="secondary" className="flex-1 !min-h-11">
                  Reserve / Collect
                </Button>
              </div>
              {selectedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="mt-3 w-full text-center text-xs text-ivory/45 hover:text-ivory"
                >
                  Clear plate
                </button>
              )}
            </div>
          </div>

          {/* Scrollable ingredient categories */}
          <div className="lg:col-span-7 space-y-10 pb-28 lg:pb-0">
            <p className="text-sm text-ivory/55 lg:hidden">
              Keep scrolling to add more. Your plate summary stays above.
            </p>

            {categories.map((cat) => (
              <div key={cat.id} id={`build-${cat.id}`}>
                <div className="flex items-end justify-between gap-3 mb-4">
                  <h3 className="text-[11px] tracking-[0.24em] uppercase text-gold">
                    {cat.label}
                  </h3>
                  <span className="text-[10px] tracking-wide uppercase text-ivory/40">
                    {
                      selectedItems.filter((i) => i.category === cat.id).length
                    }{" "}
                    added
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {builderItems
                    .filter((i) => i.category === cat.id)
                    .map((item) => {
                      const active = selected.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggle(item.id)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-sm border text-left transition-all min-h-14",
                            active
                              ? "border-copper/60 bg-copper/15 text-ivory"
                              : "border-ivory/15 text-ivory/70 hover:border-ivory/35"
                          )}
                        >
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-ivory/20">
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              className="object-cover"
                              style={{ objectPosition: item.focus ?? "50% 50%" }}
                              sizes="48px"
                            />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm">{item.name}</span>
                            <span
                              className={cn(
                                "text-xs",
                                active ? "text-gold" : "text-ivory/45"
                              )}
                            >
                              +{formatPrice(item.price)}
                            </span>
                          </span>
                          <span
                            className={cn(
                              "text-[10px] tracking-wider uppercase shrink-0 min-w-[4.5rem] text-right",
                              active ? "text-gold" : "text-ivory/30"
                            )}
                          >
                            {active ? "Added ✓" : "+ Add"}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

            <p className="text-sm text-ivory/45">
              Base {formatPrice(BASE_PRICE)} includes plate & condiments.
              {isComplete ? ` ${finishedLabel} is ready.` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile sticky tray while scrolling ingredients */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-ivory/10 bg-walnut/95 backdrop-blur-md px-4 py-3"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
          >
            <div className="mx-auto max-w-[1400px] flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                {selectedItems.slice(-4).map((item) => (
                  <span
                    key={item.id}
                    className="relative h-9 w-9 rounded-full overflow-hidden border border-ivory/30"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      style={{ objectPosition: item.focus ?? "50% 50%" }}
                      sizes="36px"
                    />
                  </span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.16em] uppercase text-gold truncate">
                  {justAdded ? `Added ${justAdded}` : `${selectedItems.length} on your plate`}
                </p>
                <p className="font-serif text-lg leading-none mt-0.5">{formatPrice(total)}</p>
              </div>
              <button
                type="button"
                onClick={addPlateToOrder}
                className="shrink-0 px-4 py-2.5 bg-copper text-ivory text-[11px] tracking-[0.12em] uppercase rounded-sm"
              >
                To order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PlateStage({
  selectedItems,
  categoryCounts,
  isComplete,
  finishedPlate,
  finishedLabel,
  empty,
}: {
  selectedItems: BuilderItem[];
  categoryCounts: Map<string, number>;
  isComplete: boolean;
  finishedPlate: string;
  finishedLabel: string;
  empty: boolean;
}) {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      <div className="absolute inset-[4%] rounded-full border border-ivory/10" />
      <div className="absolute inset-[10%] rounded-full border border-copper/25" />
      <div
        className="absolute inset-[14%] rounded-full shadow-[inset_0_8px_40px_rgba(0,0,0,0.45),0_20px_50px_rgba(0,0,0,0.35)]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #f6efe6 0%, #e8dcc8 42%, #c4b09a 78%, #9a8774 100%)",
        }}
      />
      <div className="absolute inset-[22%] rounded-full bg-gradient-to-br from-ivory/40 via-transparent to-walnut/10 pointer-events-none" />

      <div className="absolute inset-[18%] rounded-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          {!isComplete &&
            selectedItems.map((item, i) => {
              const slot = slotFor(item, categoryCounts.get(item.id) ?? 0);
              return (
                <motion.div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    width: `${slot.size}%`,
                    aspectRatio: "1",
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.2,
                    x: "-50%",
                    y: "-140%",
                    rotate: slot.rotate - 35,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: "-50%",
                    y: "-50%",
                    rotate: slot.rotate,
                  }}
                  exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 18,
                    delay: Math.min(i * 0.03, 0.2),
                  }}
                >
                  <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-ivory/70 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: item.focus ?? "50% 50%" }}
                      sizes="140px"
                    />
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        <AnimatePresence>
          {empty && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-walnut/55 text-sm text-center px-10 font-serif"
            >
              Your plate is waiting
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              key="finished"
              className="absolute inset-[6%] rounded-full overflow-hidden border-[3px] border-ivory/80 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, scale: 0.55, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
            >
              <Image
                src={finishedPlate}
                alt={finishedLabel}
                fill
                className="object-cover"
                sizes="360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-walnut/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-0 text-center px-4">
                <p className="text-[10px] tracking-[0.28em] uppercase text-gold">Plate ready</p>
                <p className="font-serif text-lg text-ivory mt-1">{finishedLabel}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
