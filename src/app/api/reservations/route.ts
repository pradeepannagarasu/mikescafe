import { NextResponse } from "next/server";

type ReservationBody = {
  name?: string;
  phone?: string;
  guests?: string | number;
  date?: string;
  time?: string;
  notes?: string;
  website?: string;
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

  const payload = {
    name,
    phone,
    guests,
    date,
    time,
    notes: notes || undefined,
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.RESERVATION_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Reservation webhook failed", res.status);
        return NextResponse.json(
          { error: "Unable to submit reservation right now. Please call us." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("Reservation webhook error", err);
      return NextResponse.json(
        { error: "Unable to submit reservation right now. Please call us." },
        { status: 502 }
      );
    }
  } else {
    console.info("Reservation received", payload);
  }

  return NextResponse.json({
    ok: true,
    message: "Reservation request received. We'll confirm shortly.",
  });
}
