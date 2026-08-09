import { NextResponse } from "next/server";
import { isAuthorizedAdmin, unauthorized } from "@/lib/admin-auth";
import { deleteBooking, patchBookingStatus } from "@/lib/server-bookings";
import type { BookingStatus } from "@/types/booking";

const STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!isAuthorizedAdmin(request)) return unauthorized();
  const { id } = await params;

  let body: { status?: BookingStatus };
  try {
    body = (await request.json()) as { status?: BookingStatus };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const booking = await patchBookingStatus(id, body.status);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, booking });
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAuthorizedAdmin(request)) return unauthorized();
  const { id } = await params;
  const ok = await deleteBooking(id);
  if (!ok) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
