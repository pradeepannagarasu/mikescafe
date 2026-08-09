"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  BOOKING_STATUS_LABEL,
  readBookings,
  removeBooking,
  subscribeBookings,
  updateBookingStatus,
} from "@/lib/bookings-store";
import { formatPrice, cn } from "@/lib/utils";
import type { BookingStatus } from "@/types/booking";

const STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export function BookingsPanel() {
  const bookings = useSyncExternalStore(subscribeBookings, readBookings, () => []);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const shown = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: bookings.length };
    for (const s of STATUSES) map[s] = bookings.filter((b) => b.status === s).length;
    return map;
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-copper/30 bg-copper/5 px-4 py-3 text-sm text-walnut/80">
        Bookings from this browser are tracked here end to end: New → Confirmed → Preparing → Ready →
        Completed. Confirm by phone, then update status as the kitchen progresses.
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterChip
          label="All"
          count={counts.all}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={BOOKING_STATUS_LABEL[s]}
            count={counts[s] ?? 0}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="text-sm text-muted py-10 text-center border border-dashed border-walnut/15 rounded-sm">
          No bookings yet. When guests reserve or collect from the site, they appear here.
        </p>
      )}

      <div className="space-y-4">
        {shown.map((b) => (
          <article
            key={b.id}
            className="border border-walnut/10 rounded-sm bg-ivory p-4 md:p-5 space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-copper">
                  {b.fulfillment === "collect" ? "Collect order" : "Table reservation"}
                </p>
                <h3 className="font-serif text-2xl text-walnut mt-1">{b.name}</h3>
                <p className="text-sm text-muted mt-1">
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-racing">
                    {b.phone}
                  </a>
                  {" · "}
                  {b.guests} {b.fulfillment === "collect" ? "portions" : "guests"}
                  {" · "}
                  {b.date} at {b.time}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl text-copper">{formatPrice(b.total)}</p>
                <p className="text-[10px] tracking-wide uppercase text-muted mt-1">{b.id}</p>
              </div>
            </div>

            {b.items.length > 0 && (
              <ul className="text-sm space-y-1 border-t border-walnut/8 pt-3">
                {b.items.map((item) => (
                  <li key={`${b.id}-${item.id}`} className="flex justify-between gap-3">
                    <span>
                      {item.qty}× {item.name}
                    </span>
                    <span className="text-muted">{formatPrice(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
            )}

            {b.notes && (
              <p className="text-sm text-muted border-t border-walnut/8 pt-3">
                <span className="uppercase text-[10px] tracking-wider text-copper">Notes </span>
                {b.notes}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-walnut/8 pt-3">
              <label className="text-[10px] tracking-[0.16em] uppercase text-muted">Status</label>
              <select
                value={b.status}
                onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-cream"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {BOOKING_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this booking?")) removeBooking(b.id);
                }}
                className="ml-auto text-[11px] tracking-wide uppercase text-muted hover:text-racing"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 px-3 py-2 text-[11px] tracking-[0.12em] uppercase rounded-sm border",
        active ? "bg-racing text-ivory border-racing" : "border-walnut/15 text-walnut/70"
      )}
    >
      {label} ({count})
    </button>
  );
}
