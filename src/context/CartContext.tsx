"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types/booking";
import type { MenuItem } from "@/types";
import {
  cartCount,
  cartTotal,
  clearCart,
  readCart,
  subscribeCart,
  writeCart,
} from "@/lib/cart-store";
import { cartFromMenuItem } from "@/types/booking";

type CartContextValue = {
  items: CartLine[];
  count: number;
  total: number;
  addItem: (item: MenuItem, qty?: number, opts?: { open?: boolean }) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: CartLine[] = [];

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, readCart, () => EMPTY_CART);
  const [open, setOpen] = useState(false);

  const addItem = useCallback((item: MenuItem, qty = 1, opts?: { open?: boolean }) => {
    const current = readCart();
    const existing = current.find((l) => l.id === item.id);
    if (existing) {
      writeCart(
        current.map((l) =>
          l.id === item.id ? { ...l, qty: l.qty + qty } : l
        )
      );
    } else {
      writeCart([...current, cartFromMenuItem(item, qty)]);
    }
    if (opts?.open !== false) setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      writeCart(readCart().filter((l) => l.id !== id));
      return;
    }
    writeCart(readCart().map((l) => (l.id === id ? { ...l, qty } : l)));
  }, []);

  const removeItem = useCallback((id: string) => {
    writeCart(readCart().filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => clearCart(), []);

  const value = useMemo(
    () => ({
      items,
      count: cartCount(items),
      total: cartTotal(items),
      addItem,
      setQty,
      removeItem,
      clear,
      open,
      setOpen,
    }),
    [items, addItem, setQty, removeItem, clear, open]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
