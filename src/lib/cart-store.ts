import type { CartLine } from "@/types/booking";

export const CART_STORAGE_KEY = "mikes-cafe-cart-v1";
export const CART_EVENT = "mikes-cafe-cart-change";

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartLine[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function clearCart() {
  writeCart([]);
}

export function subscribeCart(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener(CART_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function cartCount(items: CartLine[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartTotal(items: CartLine[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
