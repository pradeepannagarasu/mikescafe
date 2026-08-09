"use client";

import { useMemo, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/context/ContentContext";

export function Reservation() {
  const { content } = useContent();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

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
        }),
      });

      const json = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again or call us.");
        return;
      }

      setStatus("success");
      setMessage(json.message ?? "Thank you - we'll confirm shortly.");
      form.reset();
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
          backgroundImage:
            "url(/images/gallery/dining-room.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-espresso/90 to-black/85" aria-hidden />

      <div className="section-pad mx-auto max-w-3xl relative">
        <SectionHeading
          light
          eyebrow="Reservations"
          title="Reserve Your Table"
          subtitle="Weekend mornings fill quickly. Tell us when you'd like to join us."
        />

        <form
          onSubmit={onSubmit}
          className="glass-dark border border-ivory/10 rounded-sm p-6 md:p-10 space-y-5"
          noValidate={false}
        >
          {/* Honeypot */}
          <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden>
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

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
              label="Guests"
              name="guests"
              type="number"
              required
              min={1}
              max={12}
              defaultValue={2}
            />
            <Field label="Date" name="date" type="date" required min={minDate} />
            <Field label="Time" name="time" type="time" required min="08:00" max="15:30" />
          </div>
          <div>
            <label htmlFor="notes" className="block text-[11px] tracking-[0.2em] uppercase text-gold mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={500}
              placeholder="Allergies, occasion, preferred booth…"
              className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              type="submit"
              variant="gold"
              className="flex-1 sm:flex-none"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending…" : "Request Reservation"}
            </Button>
            <AnimatePresence mode="wait">
              {message && (
                <motion.p
                  key={message}
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-sm ${status === "error" ? "text-red-300" : "text-gold"}`}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs text-ivory/45 pt-2">
            Prefer to call?{" "}
            <a href={`tel:${content.phone.replace(/\s/g, "")}`} className="underline hover:text-gold">
              {content.phone}
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = props.id ?? props.name;
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] tracking-[0.2em] uppercase text-gold mb-2">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 outline-none min-h-12"
      />
    </div>
  );
}
