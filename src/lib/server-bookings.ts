import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Booking, BookingStatus } from "@/types/booking";

const LIST_KEY = "bookings:list";
const MAX_BOOKINGS = 200;

type BookingsKv = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

declare global {
  // eslint-disable-next-line no-var
  var __mikesBookingsMemory: Booking[] | undefined;
}

async function getKv(): Promise<BookingsKv | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as { MIKES_BOOKINGS?: BookingsKv }).MIKES_BOOKINGS;
    return kv ?? null;
  } catch {
    return null;
  }
}

function readMemory(): Booking[] {
  return globalThis.__mikesBookingsMemory ?? [];
}

function writeMemory(bookings: Booking[]) {
  globalThis.__mikesBookingsMemory = bookings;
}

function sortBookings(bookings: Booking[]) {
  return [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listBookings(): Promise<Booking[]> {
  const kv = await getKv();
  if (!kv) return sortBookings(readMemory());
  const raw = await kv.get(LIST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Booking[];
    return Array.isArray(parsed) ? sortBookings(parsed) : [];
  } catch {
    return [];
  }
}

async function saveAll(bookings: Booking[]) {
  const trimmed = sortBookings(bookings).slice(0, MAX_BOOKINGS);
  const kv = await getKv();
  if (kv) {
    await kv.put(LIST_KEY, JSON.stringify(trimmed));
  } else {
    writeMemory(trimmed);
  }
  return trimmed;
}

export async function saveBooking(booking: Booking): Promise<Booking> {
  const current = await listBookings();
  const next = [booking, ...current.filter((b) => b.id !== booking.id)];
  await saveAll(next);
  return booking;
}

export async function patchBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | null> {
  const current = await listBookings();
  let updated: Booking | null = null;
  const next = current.map((b) => {
    if (b.id !== id) return b;
    updated = { ...b, status };
    return updated;
  });
  if (!updated) return null;
  await saveAll(next);
  return updated;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const current = await listBookings();
  const next = current.filter((b) => b.id !== id);
  if (next.length === current.length) return false;
  await saveAll(next);
  return true;
}
