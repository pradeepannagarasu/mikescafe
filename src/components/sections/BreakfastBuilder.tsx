"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { builderItems, PLATES } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { BuilderItem } from "@/types";

const BASE_PRICE = 4.5;

const categories = [
  { id: "eggs", label: "Eggs" },
  { id: "meat", label: "Meats" },
  { id: "sides", label: "Sides" },
  { id: "veg", label: "Vegetables" },
] as const;

/** Slot positions on the plate (percent of plate area) */
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
  const [selected, setSelected] = useState<string[]>([
    "eggs-scrambled",
    "bacon",
    "toast",
  ]);

  const selectedItems = useMemo(
    () => builderItems.filter((i) => selected.includes(i.id)),
    [selected]
  );

  const total = useMemo(
    () =>
      BASE_PRICE + selectedItems.reduce((sum, i) => sum + i.price, 0),
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

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-walnut text-ivory py-24 md:py-32 relative overflow-hidden">
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
          subtitle="Tap ingredients — watch them land on the plate, mix, then finish as a full Mike's breakfast."
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Plate stage */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative aspect-square">
                {/* Outer rings */}
                <div className="absolute inset-[4%] rounded-full border border-ivory/10" />
                <div className="absolute inset-[10%] rounded-full border border-copper/25" />

                {/* Ceramic plate */}
                <div
                  className="absolute inset-[14%] rounded-full shadow-[inset_0_8px_40px_rgba(0,0,0,0.45),0_20px_50px_rgba(0,0,0,0.35)]"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, #f6efe6 0%, #e8dcc8 42%, #c4b09a 78%, #9a8774 100%)",
                  }}
                />
                <div className="absolute inset-[22%] rounded-full bg-gradient-to-br from-ivory/40 via-transparent to-walnut/10 pointer-events-none" />

                {/* Mixing ingredients */}
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
                              y: "-120%",
                              rotate: slot.rotate - 40,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              x: "-50%",
                              y: "-50%",
                              rotate: slot.rotate,
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.4,
                              y: "-80%",
                              transition: { duration: 0.25 },
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 220,
                              damping: 18,
                              delay: i * 0.04,
                            }}
                          >
                            <motion.div
                              className="relative h-full w-full rounded-full overflow-hidden border-2 border-ivory/70 shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
                              animate={{
                                y: [0, -4, 0],
                                rotate: [slot.rotate, slot.rotate + 2, slot.rotate],
                              }}
                              transition={{
                                duration: 3.2 + (i % 3) * 0.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                style={{ objectPosition: item.focus ?? "50% 50%" }}
                                sizes="140px"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-walnut/50 via-transparent to-transparent" />
                            </motion.div>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-walnut/90 px-2 py-0.5 text-[9px] tracking-[0.12em] uppercase text-gold border border-gold/30">
                              {item.name}
                            </span>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>

                  {/* Empty state */}
                  <AnimatePresence>
                    {selected.length === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center text-walnut/55 text-sm text-center px-10 font-serif"
                      >
                        Start adding ingredients to your plate
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Finished plate reveal */}
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
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-walnut/70 via-transparent to-transparent" />
                        <motion.div
                          className="absolute bottom-4 inset-x-0 text-center px-4"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                        >
                          <p className="text-[10px] tracking-[0.28em] uppercase text-gold">
                            Plate ready
                          </p>
                          <p className="font-serif text-lg text-ivory mt-1">
                            {finishedLabel}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mixing sparkles when building */}
                {!isComplete && selected.length > 0 && (
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    {[0, 1, 2].map((n) => (
                      <motion.span
                        key={n}
                        className="absolute h-1.5 w-1.5 rounded-full bg-gold"
                        style={{
                          left: `${28 + n * 22}%`,
                          top: `${24 + (n % 2) * 48}%`,
                        }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: n * 0.45,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Status + total */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-[11px] tracking-[0.2em] uppercase text-ivory/50 text-center">
                  {isComplete
                    ? "Your breakfast is plated — reserve to enjoy it at Mike's"
                    : selected.length === 0
                      ? "Pick eggs, meats, sides & veg"
                      : `Mixing ${selectedItems.length} ingredient${selectedItems.length === 1 ? "" : "s"}… add a few more to finish`}
                </p>
                <motion.div
                  className="glass-dark px-7 py-3.5 rounded-sm border border-ivory/10 min-w-[160px]"
                  key={total}
                  initial={{ scale: 0.94, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <p className="text-[10px] tracking-[0.24em] uppercase text-gold text-center">
                    Live Total
                  </p>
                  <p className="font-serif text-3xl text-center mt-1">
                    {formatPrice(total)}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Ingredient picker */}
          <div className="lg:col-span-7 space-y-8">
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-[11px] tracking-[0.24em] uppercase text-gold mb-4">
                  {cat.label}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
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
                              "text-[10px] tracking-wider uppercase shrink-0",
                              active ? "text-gold" : "text-ivory/30"
                            )}
                          >
                            {active ? "On plate" : "Add"}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Button href="#reserve" variant="gold" className="flex-1 sm:flex-none">
                Reserve with this plate
              </Button>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="text-sm text-ivory/50 hover:text-ivory transition-colors underline-offset-4 hover:underline"
              >
                Clear plate
              </button>
              <p className="text-sm text-ivory/50 sm:ml-auto">
                Base {formatPrice(BASE_PRICE)} · plate & condiments included
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
