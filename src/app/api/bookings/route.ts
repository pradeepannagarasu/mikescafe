import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorized } from "@/lib/admin-auth";
import { listBookings, saveBooking } from "@/lib/server-bookings";
import type { Booking, FulfillmentType } from "@/types/booking";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) return unauthorized();
  const bookings = await listBookings();
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) return unauthorized();

  let body: Partial<Booking>;
  try {
    body = (await request.json()) as Partial<Booking>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fulfillment: FulfillmentType =
    body.fulfillment === "collect" ? "collect" : "dine-in";
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const date = String(body.date || "").trim();
  const time = String(body.time || "").trim();

  if (!name || !phone || !date || !time) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const booking: Booking = {
    id: body.id || `bk_manual_${Date.now().toString(36)}`,
    createdAt: body.createdAt || new Date().toISOString(),
    status: body.status || "confirmed",
    fulfillment,
    name,
    phone,
    guests: Math.min(12, Math.max(1, Number(body.guests) || 2)),
    date,
    time,
    notes: body.notes?.trim() || undefined,
    items: Array.isArray(body.items) ? body.items : [],
    total: Math.max(0, Number(body.total) || 0),
  };

  await saveBooking(booking);
  return NextResponse.json({ ok: true, booking });
}
