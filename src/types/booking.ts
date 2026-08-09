import type { MenuItem } from "@/types";

export type FulfillmentType = "dine-in" | "collect";

export type BookingStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface CartLine {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface BookingItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  fulfillment: FulfillmentType;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  notes?: string;
  items: BookingItem[];
  total: number;
}

export function cartFromMenuItem(item: MenuItem, qty = 1): CartLine {
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    qty,
  };
}
