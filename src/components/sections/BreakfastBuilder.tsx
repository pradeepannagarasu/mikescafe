"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { builderItems } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const BASE_PRICE = 4.5;

const categories = [
  { id: "eggs", label: "Eggs" },
  { id: "meat", label: "Meats" },
  { id: "sides", label: "Sides" },
  { id: "veg", label: "Vegetables" },
] as const;

export function BreakfastBuilder() {
  const [selected, setSelected] = useState<string[]>(["eggs-fried", "toast", "bacon"]);

  const total = useMemo(() => {
    const extras = builderItems
      .filter((i) => selected.includes(i.id))
      .reduce((sum, i) => sum + i.price, 0);
    return BASE_PRICE + extras;
  }, [selected]);

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
            "radial-gradient(circle at 20% 20%, #c4a35a 0%, transparent 40%), radial-gradient(circle at 80% 80%, #b87333 0%, transparent 35%)",
        }}
      />

      <div className="section-pad mx-auto max-w-[1400px] relative">
        <SectionHeading
          light
          eyebrow="Build Your Own"
          title="Create Your Own Breakfast"
          subtitle="Compose a plate the Mike's way — every addition updates your total live."
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-[8%] rounded-full border border-ivory/15 bg-espresso/60 shadow-[inset_0_0_60px_rgba(0,0,0,0.35)]" />
              <div className="absolute inset-[18%] rounded-full border border-gold/25 bg-gradient-to-br from-espresso to-walnut" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[55%] h-[55%]">
                  <AnimatePresence>
                    {selected.map((id, i) => {
                      const item = builderItems.find((b) => b.id === id);
                      if (!item) return null;
                      const angle = (i / Math.max(selected.length, 1)) * Math.PI * 2;
                      const r = 28 + (i % 3) * 8;
                      const x = Math.cos(angle) * r;
                      const y = Math.sin(angle) * r;
                      return (
                        <motion.div
                          key={id}
                          className="absolute left-1/2 top-1/2 plate-item"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: `calc(-50% + ${x}px)`,
                            y: `calc(-50% + ${y}px)`,
                          }}
                          exit={{ opacity: 0, scale: 0.4 }}
                          transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        >
                          <span className="block rounded-full bg-gold/90 text-walnut text-[10px] tracking-wide px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                            {item.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {selected.length === 0 && (
                    <p className="absolute inset-0 flex items-center justify-center text-ivory/40 text-sm text-center px-6">
                      Add items to fill your plate
                    </p>
                  )}
                </div>
              </div>
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass-dark px-6 py-3 rounded-sm border border-ivory/10"
                key={total}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <p className="text-[10px] tracking-[0.24em] uppercase text-gold text-center">
                  Live Total
                </p>
                <p className="font-serif text-3xl text-center mt-1">{formatPrice(total)}</p>
              </motion.div>
            </div>
          </div>

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
                            "flex items-center justify-between gap-3 px-4 py-4 rounded-sm border text-left transition-all min-h-14",
                            active
                              ? "border-gold/50 bg-gold/10 text-ivory"
                              : "border-ivory/15 text-ivory/70 hover:border-ivory/35"
                          )}
                        >
                          <span className="text-sm">{item.name}</span>
                          <span className={cn("text-sm", active ? "text-gold" : "text-ivory/45")}>
                            +{formatPrice(item.price)}
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
              <p className="text-sm text-ivory/50">
                Base plate {formatPrice(BASE_PRICE)} includes crockery & condiments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
