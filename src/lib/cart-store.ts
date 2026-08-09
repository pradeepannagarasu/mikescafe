import type { CartLine } from "@/types/booking";

export const CART_STORAGE_KEY = "piccola-deli-cart-v1";
export const CART_EVENT = "piccola-deli-cart-change";
export const ORDER_SUBMITTED_EVENT = "piccola-deli-order-submitted";

const EMPTY_CART: CartLine[] = [];

let cachedRaw: string | null | undefined;
let cachedCart: CartLine[] = EMPTY_CART;

function parseCart(raw: string | null): CartLine[] {
  if (!raw) return EMPTY_CART;
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return EMPTY_CART;
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (raw === cachedRaw) return cachedCart;
  cachedRaw = raw;
  cachedCart = parseCart(raw);
  return cachedCart;
}

export function writeCart(items: CartLine[]) {
  cachedCart = items.length > 0 ? items : EMPTY_CART;
  cachedRaw = JSON.stringify(cachedCart === EMPTY_CART ? [] : cachedCart);
  localStorage.setItem(CART_STORAGE_KEY, cachedRaw);
  window.dispatchEvent(new Event(CART_EVENT));
}

export function clearCart() {
  writeCart([]);
}

/** Clear bag after a successful reserve/collect and notify UI (builder, drawer). */
export function clearCartAfterOrder() {
  writeCart([]);
  window.dispatchEvent(new Event(ORDER_SUBMITTED_EVENT));
}

export function subscribeCart(onStoreChange: () => void) {
  const handler = () => {
    // Invalidate cache so the next read picks up fresh storage (e.g. other tabs)
    cachedRaw = undefined;
    onStoreChange();
  };
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
