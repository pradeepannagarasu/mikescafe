import type { Booking, BookingStatus } from "@/types/booking";

export const BOOKINGS_STORAGE_KEY = "mikes-cafe-bookings-v1";
export const BOOKINGS_EVENT = "mikes-cafe-bookings-change";

export function readBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Booking[];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      : [];
  } catch {
    return [];
  }
}

export function writeBookings(bookings: Booking[]) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new Event(BOOKINGS_EVENT));
}

export function addBooking(booking: Booking) {
  const next = [booking, ...readBookings().filter((b) => b.id !== booking.id)];
  writeBookings(next);
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const next = readBookings().map((b) => (b.id === id ? { ...b, status } : b));
  writeBookings(next);
}

export function removeBooking(id: string) {
  writeBookings(readBookings().filter((b) => b.id !== id));
}

export function subscribeBookings(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener(BOOKINGS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(BOOKINGS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};
