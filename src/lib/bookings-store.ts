import type { Booking, BookingStatus } from "@/types/booking";

export const BOOKINGS_STORAGE_KEY = "mikes-cafe-bookings-v1";
export const BOOKINGS_EVENT = "mikes-cafe-bookings-change";

const EMPTY_BOOKINGS: Booking[] = [];

let cachedRaw: string | null | undefined;
let cachedBookings: Booking[] = EMPTY_BOOKINGS;

function parseBookings(raw: string | null): Booking[] {
  if (!raw) return EMPTY_BOOKINGS;
  try {
    const parsed = JSON.parse(raw) as Booking[];
    if (!Array.isArray(parsed) || parsed.length === 0) return EMPTY_BOOKINGS;
    return [...parsed].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return EMPTY_BOOKINGS;
  }
}

export function readBookings(): Booking[] {
  if (typeof window === "undefined") return EMPTY_BOOKINGS;
  const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (raw === cachedRaw) return cachedBookings;
  cachedRaw = raw;
  cachedBookings = parseBookings(raw);
  return cachedBookings;
}

export function writeBookings(bookings: Booking[]) {
  const sorted =
    bookings.length > 0
      ? [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      : EMPTY_BOOKINGS;
  cachedBookings = sorted;
  cachedRaw = JSON.stringify(sorted === EMPTY_BOOKINGS ? [] : sorted);
  localStorage.setItem(BOOKINGS_STORAGE_KEY, cachedRaw);
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
  const handler = () => {
    cachedRaw = undefined;
    onStoreChange();
  };
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
