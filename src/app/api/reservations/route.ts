import { NextResponse } from "next/server";
import type { Booking, BookingItem, FulfillmentType } from "@/types/booking";

type ReservationBody = {
  name?: string;
  phone?: string;
  guests?: string | number;
  date?: string;
  time?: string;
  notes?: string;
  website?: string;
  fulfillment?: FulfillmentType;
  items?: BookingItem[];
  total?: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function isValidPhone(phone: string) {
  return /^[+()\d\s-]{7,20}$/.test(phone.trim());
}

function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

function makeId() {
  return `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: ReservationBody;

  try {
    body = (await request.json()) as ReservationBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const date = body.date?.trim() ?? "";
  const time = body.time?.trim() ?? "";
  const notes = body.notes?.trim() ?? "";
  const guests = Number(body.guests);
  const fulfillment: FulfillmentType =
    body.fulfillment === "collect" ? "collect" : "dine-in";
  const items = Array.isArray(body.items)
    ? body.items
        .filter((i) => i && i.name && Number(i.qty) > 0)
        .map((i) => ({
          id: String(i.id || i.name),
          name: String(i.name).slice(0, 80),
          price: Math.max(0, Number(i.price) || 0),
          qty: Math.min(20, Math.max(1, Number(i.qty) || 1)),
        }))
    : [];
  const computedTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total =
    typeof body.total === "number" && Number.isFinite(body.total)
      ? body.total
      : computedTotal;

  if (!name || name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (!Number.isFinite(guests) || guests < 1 || guests > 12) {
    return NextResponse.json({ error: "Guests must be between 1 and 12." }, { status: 400 });
  }
  if (!isValidDate(date)) {
    return NextResponse.json({ error: "Please choose a valid future date." }, { status: 400 });
  }
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "Please choose a valid time." }, { status: 400 });
  }
  if (notes.length > 500) {
    return NextResponse.json({ error: "Notes are too long." }, { status: 400 });
  }
  if (fulfillment === "collect" && items.length === 0) {
    return NextResponse.json(
      { error: "Add dishes to your order bag before requesting collection." },
      { status: 400 }
    );
  }

  const booking: Booking = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    status: "new",
    fulfillment,
    name,
    phone,
    guests,
    date,
    time,
    notes: notes || undefined,
    items,
    total,
  };

  const webhook = process.env.RESERVATION_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!res.ok) {
        console.error("Reservation webhook failed", res.status);
        return NextResponse.json(
          { error: "Unable to submit booking right now. Please call us." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("Reservation webhook error", err);
      return NextResponse.json(
        { error: "Unable to submit booking right now. Please call us." },
        { status: 502 }
      );
    }
  } else {
    console.info("Booking received", booking);
  }

  return NextResponse.json({
    ok: true,
    booking,
    message:
      fulfillment === "collect"
        ? "Collect order received. We'll confirm shortly."
        : "Reservation request received. We'll confirm shortly.",
  });
}
