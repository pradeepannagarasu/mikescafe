"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiMinus, HiPlus, HiShoppingBag, HiX } from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-sm text-current"
      aria-label={`Order bag${count ? `, ${count} items` : ""}`}
    >
      <HiShoppingBag size={22} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-racing text-ivory text-[10px] flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const { items, total, open, setOpen, setQty, removeItem, clear } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close order bag"
            className="fixed inset-0 z-[70] bg-walnut/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[71] h-full w-full max-w-md bg-ivory text-walnut shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            role="dialog"
            aria-modal
            aria-label="Your order"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
              <div>
                <p className="text-[10px] tracking-[0.24em] uppercase text-copper">Your order</p>
                <h2 className="font-serif text-2xl">Order bag</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-sm hover:bg-walnut/5"
                aria-label="Close"
              >
                <HiX size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-muted py-10 text-center">
                  Your bag is empty. Add favourites from the menu, then reserve a table or collect.
                </p>
              )}
              {items.map((line) => (
                <div key={line.id} className="flex gap-3 border-b border-walnut/8 pb-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-vintage">
                    <Image src={line.image} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-lg leading-tight">{line.name}</p>
                      <p className="text-copper text-sm whitespace-nowrap">
                        {formatPrice(line.price * line.qty)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 border border-walnut/15 rounded-sm inline-flex items-center justify-center"
                        onClick={() => setQty(line.id, line.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <HiMinus size={14} />
                      </button>
                      <span className="text-sm w-6 text-center">{line.qty}</span>
                      <button
                        type="button"
                        className="h-8 w-8 border border-walnut/15 rounded-sm inline-flex items-center justify-center"
                        onClick={() => setQty(line.id, line.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <HiPlus size={14} />
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-[11px] tracking-wide uppercase text-muted hover:text-racing"
                        onClick={() => removeItem(line.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-walnut/10 px-5 py-5 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] tracking-[0.2em] uppercase text-muted">Total</span>
                <span className="font-serif text-3xl">{formatPrice(total)}</span>
              </div>
              <Button
                href="#reserve"
                variant="gold"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Reserve / Collect order
              </Button>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="w-full text-center text-xs text-muted hover:text-walnut py-2"
                >
                  Clear bag
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
