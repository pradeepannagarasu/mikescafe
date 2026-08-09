"use client";

import { useMemo, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/context/ContentContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import type { FulfillmentType } from "@/types/booking";

export function Reservation() {
  const { content } = useContent();
  const { items, total, clearAfterOrder } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("dine-in");
  const [lastFulfillment, setLastFulfillment] = useState<FulfillmentType>("dine-in");
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payloadItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
    }));
    const payloadTotal = total;

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          guests: data.get("guests"),
          date: data.get("date"),
          time: data.get("time"),
          notes: data.get("notes"),
          website: data.get("website"),
          fulfillment,
          items: payloadItems,
          total: payloadTotal,
        }),
      });

      const json = (await res.json()) as {
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again or call us.");
        return;
      }

      // Empty bag + builder before swapping to thank-you UI
      clearAfterOrder();
      form.reset();
      setLastFulfillment(fulfillment);
      setMessage(
        json.message ??
          (fulfillment === "collect"
            ? "Thanks for your collect order — we'll start preparing it for you."
            : "Thanks for booking to eat in — we'll get your table ready for you.")
      );
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage(`Unable to send. Please call ${content.phone}.`);
    }
  };

  return (
    <section id="reserve" className="relative bg-espresso text-ivory py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(/images/menu/beef-lasagna.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-espresso/90 to-black/85" aria-hidden />

      <div className="section-pad mx-auto max-w-3xl relative">
        <SectionHeading
          light
          eyebrow="Bookings"
          title="Reserve or Collect"
          subtitle="Book a table to eat in, or place a collect order from your bag. We'll confirm by phone."
        />

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-dark border border-copper/40 rounded-sm p-8 md:p-12 text-center space-y-4"
              role="status"
            >
              <p className="text-[11px] tracking-[0.22em] uppercase text-gold">
                {lastFulfillment === "collect" ? "Collect order received" : "Table booked"}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-ivory">
                {lastFulfillment === "collect"
                  ? "Thanks — we're on it"
                  : "Thanks — see you soon"}
              </h3>
              <p className="text-ivory/75 max-w-md mx-auto leading-relaxed">
                {lastFulfillment === "collect"
                  ? "We've got your collect order. The kitchen will prepare it for your chosen time — we'll call if we need anything."
                  : "We've got your eat-in booking. We'll make sure your table is ready — we'll call to confirm if needed."}
              </p>
              <p className="text-sm text-gold/90">{message}</p>
              <Button
                type="button"
                variant="gold"
                className="mt-2"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
              >
                Book another
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={onSubmit}
              className="glass-dark border border-ivory/10 rounded-sm p-6 md:p-10 space-y-5 relative"
            >
              <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden>
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { id: "dine-in", label: "Eat in", hint: "Reserve a table" },
                    { id: "collect", label: "Collect", hint: "Takeaway order" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFulfillment(opt.id)}
                    className={cn(
                      "rounded-sm border px-4 py-3 text-left transition-colors",
                      fulfillment === opt.id
                        ? "border-copper bg-copper/15"
                        : "border-ivory/15 hover:border-ivory/35"
                    )}
                  >
                    <span className="block text-[12px] tracking-[0.14em] uppercase">{opt.label}</span>
                    <span className="block text-xs text-ivory/55 mt-1">{opt.hint}</span>
                  </button>
                ))}
              </div>

              {items.length > 0 && (
                <div className="rounded-sm border border-ivory/10 bg-black/20 px-4 py-3 space-y-2">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold">Your order</p>
                  {items.map((line) => (
                    <div key={line.id} className="flex justify-between gap-3 text-sm">
                      <span className="text-ivory/80">
                        {line.qty}× {line.name}
                      </span>
                      <span className="text-copper">{formatPrice(line.price * line.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-ivory/10 pt-2 font-serif text-xl">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              )}

              {items.length === 0 && (
                <p className="text-sm text-ivory/55">
                  No dishes in your bag yet. You can still book a table, or{" "}
                  <a href="#favourites" className="text-gold underline-offset-2 hover:underline">
                    add favourites
                  </a>{" "}
                  first.
                </p>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name" name="name" required autoComplete="name" placeholder="Your name" />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+44…"
                  inputMode="tel"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                <Field
                  label={fulfillment === "collect" ? "Portions" : "Guests"}
                  name="guests"
                  type="number"
                  required
                  min={1}
                  max={12}
                  defaultValue={2}
                />
                <Field label="Date" name="date" type="date" required min={minDate} />
                <Field label="Time" name="time" type="time" required min="08:30" max="15:00" />
              </div>
              <div>
                <label htmlFor="notes" className="block text-[11px] tracking-[0.2em] uppercase text-gold mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full bg-black/25 border border-ivory/15 rounded-sm px-4 py-3 text-sm placeholder:text-ivory/35 focus:border-copper/50 outline-none"
                  placeholder="Allergies, occasion, preferred booth…"
                />
              </div>

              <Button type="submit" variant="gold" className="w-full" disabled={status === "loading"}>
                {status === "loading"
                  ? "Sending…"
                  : fulfillment === "collect"
                    ? "Request collect order"
                    : "Request table reservation"}
              </Button>

              {message && status === "error" && (
                <p className="text-sm text-center text-red-300" role="status">
                  {message}
                </p>
              )}

              <p className="text-center text-sm text-ivory/50">
                Prefer to call?{" "}
                <a href={`tel:${content.phone.replace(/\s/g, "")}`} className="text-gold">
                  {content.phone}
                </a>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-[11px] tracking-[0.2em] uppercase text-gold mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full bg-black/25 border border-ivory/15 rounded-sm px-4 py-3 text-sm placeholder:text-ivory/35 focus:border-copper/50 outline-none"
        {...props}
      />
    </div>
  );
}
