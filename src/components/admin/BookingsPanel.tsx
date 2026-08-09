"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { BOOKING_STATUS_LABEL } from "@/lib/bookings-store";
import { playNewBookingAlert } from "@/lib/booking-alert";
import { printBookingTicket } from "@/lib/print-booking";
import { formatPrice, cn } from "@/lib/utils";
import type { Booking, BookingStatus, FulfillmentType } from "@/types/booking";

const STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

const POLL_MS = 4000;

function adminHeaders(): HeadersInit {
  const pin = process.env.NEXT_PUBLIC_ADMIN_PIN || "1962";
  return {
    "Content-Type": "application/json",
    "x-admin-pin": pin,
  };
}

export function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [showManual, setShowManual] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const knownIds = useRef<Set<string> | null>(null);
  const primed = useRef(false);

  const fetchBookings = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      const res = await fetch("/api/bookings", {
        headers: adminHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? "Admin PIN rejected." : "Failed to load bookings.");
      }
      const json = (await res.json()) as { bookings: Booking[] };
      const next = Array.isArray(json.bookings) ? json.bookings : [];

      if (knownIds.current === null) {
        knownIds.current = new Set(next.map((b) => b.id));
      } else {
        const fresh = next.filter((b) => !knownIds.current!.has(b.id) && b.status === "new");
        if (fresh.length > 0 && soundOn && primed.current) {
          playNewBookingAlert();
        }
        knownIds.current = new Set(next.map((b) => b.id));
      }

      setBookings(next);
      setError("");
    } catch (err) {
      if (!opts?.silent) {
        setError(err instanceof Error ? err.message : "Unable to load bookings.");
      }
    } finally {
      setLoading(false);
      primed.current = true;
    }
  }, [soundOn]);

  useEffect(() => {
    void fetchBookings();
    const id = window.setInterval(() => void fetchBookings({ silent: true }), POLL_MS);
    return () => window.clearInterval(id);
  }, [fetchBookings]);

  // Unlock AudioContext on first tap (browsers block autoplay until gesture)
  useEffect(() => {
    const softUnlock = () => {
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        void ctx.resume().then(() => ctx.close());
      } catch {
        /* ignore */
      }
      window.removeEventListener("pointerdown", softUnlock);
    };
    window.addEventListener("pointerdown", softUnlock);
    return () => window.removeEventListener("pointerdown", softUnlock);
  }, []);

  const shown = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: bookings.length };
    for (const s of STATUSES) map[s] = bookings.filter((b) => b.status === s).length;
    return map;
  }, [bookings]);

  const newCount = counts.new ?? 0;

  const onManual = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fulfillment = (fd.get("fulfillment") as FulfillmentType) || "dine-in";
    const payload = {
      fulfillment,
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      guests: Number(fd.get("guests") || 2),
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      notes: String(fd.get("notes") || "").trim() || undefined,
      items: [] as Booking["items"],
      total: Number(fd.get("total") || 0),
      status: "confirmed" as BookingStatus,
    };
    if (!payload.name || !payload.phone || !payload.date || !payload.time) return;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError("Could not save manual booking.");
      return;
    }
    e.currentTarget.reset();
    setShowManual(false);
    await fetchBookings({ silent: true });
  };

  const setStatus = async (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError("Could not update status.");
      await fetchBookings({ silent: true });
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    setBookings((prev) => prev.filter((b) => b.id !== id));
    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    if (!res.ok) {
      setError("Could not delete booking.");
      await fetchBookings({ silent: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="rounded-sm border border-copper/30 bg-copper/5 px-4 py-3 text-sm text-walnut/80 flex-1">
          Live bookings from the website appear here within seconds.
          {newCount > 0 && (
            <span className="ml-2 font-medium text-racing">
              {newCount} new, print or update status.
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSoundOn((v) => !v);
              if (!soundOn) playNewBookingAlert();
            }}
            className={cn(
              "px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase border rounded-sm",
              soundOn
                ? "border-racing bg-racing text-ivory"
                : "border-walnut/20 hover:border-walnut/40"
            )}
          >
            {soundOn ? "Sound on" : "Sound off"}
          </button>
          <button
            type="button"
            onClick={() => void fetchBookings()}
            className="px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase border border-walnut/20 rounded-sm hover:border-walnut/40"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(bookings, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `piccola-bookings-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase border border-walnut/20 rounded-sm hover:border-walnut/40"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => setShowManual((v) => !v)}
            className="px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase bg-racing text-ivory rounded-sm"
          >
            {showManual ? "Close form" : "Add booking"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-700 border border-red-200 bg-red-50 px-4 py-3 rounded-sm">
          {error}
        </p>
      )}

      {showManual && (
        <form
          onSubmit={onManual}
          className="border border-walnut/10 rounded-sm p-4 grid sm:grid-cols-2 gap-3 bg-cream/50"
        >
          <select
            name="fulfillment"
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory sm:col-span-2"
          >
            <option value="dine-in">Eat in</option>
            <option value="collect">Collect</option>
          </select>
          <input
            name="name"
            required
            placeholder="Guest name"
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory"
          />
          <input
            name="phone"
            required
            placeholder="Phone"
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory"
          />
          <input
            name="guests"
            type="number"
            min={1}
            max={12}
            defaultValue={2}
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory"
          />
          <input
            name="total"
            type="number"
            min={0}
            step={0.5}
            defaultValue={0}
            placeholder="Total £"
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory"
          />
          <input
            name="date"
            type="date"
            required
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory"
          />
          <input
            name="time"
            type="time"
            required
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory"
          />
          <input
            name="notes"
            placeholder="Notes / order details"
            className="border border-walnut/15 rounded-sm px-3 py-2 text-sm bg-ivory sm:col-span-2"
          />
          <button
            type="submit"
            className="sm:col-span-2 min-h-11 bg-racing text-ivory text-[11px] tracking-[0.14em] uppercase rounded-sm"
          >
            Save booking
          </button>
        </form>
      )}

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

      {loading && (
        <p className="text-sm text-muted py-10 text-center">Loading live bookings…</p>
      )}

      {!loading && shown.length === 0 && (
        <p className="text-sm text-muted py-10 text-center border border-dashed border-walnut/15 rounded-sm">
          No bookings yet. Keep this tab open, new reserve/collect requests appear here with an
          alert sound.
        </p>
      )}

      <div className="space-y-4">
        {shown.map((b) => (
          <article
            key={b.id}
            className={cn(
              "border rounded-sm bg-ivory p-4 md:p-5 space-y-3",
              b.status === "new" ? "border-racing/50 shadow-[0_0_0_1px_rgba(120, 40, 30, 0.15)]" : "border-walnut/10"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-copper">
                  {b.fulfillment === "collect" ? "Collect order" : "Table reservation"}
                  {b.status === "new" && (
                    <span className="ml-2 text-racing">· New</span>
                  )}
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
                onChange={(e) => void setStatus(b.id, e.target.value as BookingStatus)}
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
                onClick={() => printBookingTicket(b)}
                className="px-3 py-2 text-[11px] tracking-[0.14em] uppercase bg-racing text-ivory rounded-sm"
              >
                Print
              </button>
              <button
                type="button"
                onClick={() => void onDelete(b.id)}
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
