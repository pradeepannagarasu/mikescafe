"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";
import { formatPrice, cn } from "@/lib/utils";
import type { MenuItem, OpeningHours, Review, GalleryImage, Announcement } from "@/types";
import { BookingsPanel } from "@/components/admin/BookingsPanel";
import { Logo } from "@/components/ui/Logo";

const AUTH_KEY = "piccola-admin";

function subscribeAuth(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("piccola-admin-auth", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("piccola-admin-auth", cb);
  };
}

function getAuthSnapshot() {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

function getAuthServerSnapshot() {
  return false;
}

type Tab =
  | "bookings"
  | "menu"
  | "hours"
  | "gallery"
  | "special"
  | "featured"
  | "reviews"
  | "announcements";

const tabs: { id: Tab; label: string }[] = [
  { id: "bookings", label: "Bookings" },
  { id: "menu", label: "Menu" },
  { id: "hours", label: "Hours" },
  { id: "gallery", label: "Gallery" },
  { id: "special", label: "Special" },
  { id: "featured", label: "Featured" },
  { id: "reviews", label: "Reviews" },
  { id: "announcements", label: "Announcements" },
];

export default function AdminPage() {
  const { content, updateContent, resetContent, hydrated } = useContent();
  const [tab, setTab] = useState<Tab>("bookings");
  const [saved, setSaved] = useState(false);
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState("");

  const authed = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);

  const expectedPin = useMemo(
    () => process.env.NEXT_PUBLIC_ADMIN_PIN || "1962",
    []
  );

  const flash = useCallback(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === expectedPin) {
      sessionStorage.setItem(AUTH_KEY, "1");
      window.dispatchEvent(new Event("piccola-admin-auth"));
      setAuthError("");
      setPin("");
    } else {
      setAuthError("Incorrect PIN");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event("piccola-admin-auth"));
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-muted">
        Loading…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center section-pad">
        <form
          onSubmit={login}
          className="w-full max-w-sm bg-ivory border border-walnut/10 p-8 rounded-sm"
        >
          <p className="font-serif text-3xl text-walnut mb-2">Admin</p>
          <p className="text-sm text-muted mb-6">
            Enter your admin PIN to manage site content.
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border border-walnut/15 bg-cream px-4 py-3 rounded-sm mb-3 outline-none focus:border-copper"
            placeholder="PIN"
            autoFocus
            autoComplete="current-password"
            aria-invalid={!!authError}
            aria-describedby={authError ? "auth-error" : undefined}
          />
          {authError && (
            <p id="auth-error" className="text-sm text-red-700 mb-3" role="alert">
              {authError}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-racing text-ivory py-3 text-[12px] tracking-[0.16em] uppercase rounded-sm"
          >
            Enter
          </button>
          <Link href="/" className="block text-center text-sm text-muted mt-5 hover:text-walnut">
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-walnut/10 bg-ivory sticky top-0 z-20">
        <div className="section-pad mx-auto max-w-6xl py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="admin" className="text-walnut" />
            <div>
              <p className="font-serif text-2xl text-walnut">La Piccola Admin</p>
              <p className="text-xs text-muted">Bookings sync live · content saves in this browser</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-racing" role="status">
                Saved
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset all content to defaults?")) {
                  resetContent();
                  flash();
                }
              }}
              className="text-xs tracking-wide uppercase text-muted hover:text-walnut border border-walnut/15 px-3 py-2 rounded-sm"
            >
              Reset defaults
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-xs tracking-wide uppercase text-muted hover:text-walnut border border-walnut/15 px-3 py-2 rounded-sm"
            >
              Log out
            </button>
            <Link
              href="/"
              className="text-xs tracking-wide uppercase bg-racing text-ivory px-4 py-2 rounded-sm"
            >
              View site
            </Link>
          </div>
        </div>
        <div className="section-pad mx-auto max-w-6xl flex gap-1 overflow-x-auto pb-3" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 px-4 py-2 text-[11px] tracking-[0.14em] uppercase rounded-sm border",
                tab === t.id
                  ? "bg-walnut text-ivory border-walnut"
                  : "border-transparent text-muted hover:text-walnut"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="section-pad mx-auto max-w-6xl py-10">
        {tab === "bookings" && <BookingsPanel />}

        {tab === "menu" && (
          <MenuEditor
            items={content.menuItems}
            onChange={(menuItems) => {
              updateContent({ menuItems });
              flash();
            }}
          />
        )}
        {tab === "hours" && (
          <HoursEditor
            hours={content.openingHours}
            onChange={(openingHours) => {
              updateContent({ openingHours });
              flash();
            }}
          />
        )}
        {tab === "gallery" && (
          <GalleryEditor
            gallery={content.gallery}
            onChange={(gallery) => {
              updateContent({ gallery });
              flash();
            }}
          />
        )}
        {tab === "special" && (
          <SpecialEditor
            special={content.specialOfTheDay}
            onChange={(specialOfTheDay) => {
              updateContent({ specialOfTheDay });
              flash();
            }}
          />
        )}
        {tab === "featured" && (
          <FeaturedEditor
            items={content.menuItems}
            featuredIds={content.featuredDishIds}
            onChange={(featuredDishIds) => {
              updateContent({ featuredDishIds });
              flash();
            }}
          />
        )}
        {tab === "reviews" && (
          <ReviewsEditor
            reviews={content.reviews}
            onChange={(reviews) => {
              updateContent({ reviews });
              flash();
            }}
          />
        )}
        {tab === "announcements" && (
          <AnnouncementsEditor
            items={content.announcements}
            onChange={(announcements) => {
              updateContent({ announcements });
              flash();
            }}
          />
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm">
      <span className="text-muted text-xs uppercase tracking-wider">{label}</span>
      <input
        {...props}
        className="mt-1 w-full border border-walnut/15 bg-ivory px-3 py-2.5 rounded-sm outline-none focus:border-copper"
      />
    </label>
  );
}

function MenuEditor({
  items,
  onChange,
}: {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
}) {
  const update = (id: string, patch: Partial<MenuItem>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl mb-6">Menu items</h1>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid md:grid-cols-[1fr_1fr_100px_auto] gap-3 bg-ivory border border-walnut/8 p-4 rounded-sm"
        >
          <Field
            label="Name"
            value={item.name}
            onChange={(e) => update(item.id, { name: e.target.value })}
          />
          <Field
            label="Description"
            value={item.description}
            onChange={(e) => update(item.id, { description: e.target.value })}
          />
          <Field
            label="Price"
            type="number"
            step="0.1"
            value={item.price}
            onChange={(e) => update(item.id, { price: Number(e.target.value) })}
          />
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={!!item.favourite}
              onChange={(e) => update(item.id, { favourite: e.target.checked })}
            />
            Favourite
          </label>
        </div>
      ))}
    </div>
  );
}

function HoursEditor({
  hours,
  onChange,
}: {
  hours: OpeningHours[];
  onChange: (h: OpeningHours[]) => void;
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Opening hours</h1>
      <div className="space-y-3 max-w-lg">
        {hours.map((h, i) => (
          <div key={h.day} className="flex gap-3 items-center">
            <span className="w-28 text-sm">{h.day}</span>
            <input
              value={h.hours}
              onChange={(e) => {
                const next = [...hours];
                next[i] = {
                  ...h,
                  hours: e.target.value,
                  closed: e.target.value.toLowerCase() === "closed",
                };
                onChange(next);
              }}
              className="flex-1 border border-walnut/15 bg-ivory px-3 py-2 rounded-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryEditor({
  gallery,
  onChange,
}: {
  gallery: GalleryImage[];
  onChange: (g: GalleryImage[]) => void;
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Gallery</h1>
      <div className="space-y-3">
        {gallery.map((g, i) => (
          <div key={g.id} className="grid md:grid-cols-2 gap-3 bg-ivory p-4 border border-walnut/8 rounded-sm">
            <Field
              label="Image URL"
              value={g.src}
              onChange={(e) => {
                const next = [...gallery];
                next[i] = { ...g, src: e.target.value };
                onChange(next);
              }}
            />
            <Field
              label="Alt text"
              value={g.alt}
              onChange={(e) => {
                const next = [...gallery];
                next[i] = { ...g, alt: e.target.value };
                onChange(next);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecialEditor({
  special,
  onChange,
}: {
  special: { name: string; description: string; price: number };
  onChange: (s: { name: string; description: string; price: number }) => void;
}) {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="font-serif text-3xl mb-6">Special of the day</h1>
      <Field label="Name" value={special.name} onChange={(e) => onChange({ ...special, name: e.target.value })} />
      <Field
        label="Description"
        value={special.description}
        onChange={(e) => onChange({ ...special, description: e.target.value })}
      />
      <Field
        label="Price"
        type="number"
        step="0.1"
        value={special.price}
        onChange={(e) => onChange({ ...special, price: Number(e.target.value) })}
      />
      <p className="text-copper font-serif text-2xl pt-2">{formatPrice(special.price)}</p>
    </div>
  );
}

function FeaturedEditor({
  items,
  featuredIds,
  onChange,
}: {
  items: MenuItem[];
  featuredIds: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Homepage featured dishes</h1>
      <p className="text-sm text-muted mb-6">Select dishes shown in Signature Stories.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const on = featuredIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onChange(
                  on ? featuredIds.filter((id) => id !== item.id) : [...featuredIds, item.id]
                )
              }
              className={cn(
                "text-left px-4 py-3 border rounded-sm",
                on ? "border-racing bg-racing/5" : "border-walnut/10 bg-ivory"
              )}
            >
              <span className="font-medium">{item.name}</span>
              <span className="block text-xs text-muted mt-1">{formatPrice(item.price)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewsEditor({
  reviews,
  onChange,
}: {
  reviews: Review[];
  onChange: (r: Review[]) => void;
}) {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Reviews</h1>
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={r.id} className="bg-ivory border border-walnut/8 p-4 rounded-sm space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <Field
                label="Name"
                value={r.name}
                onChange={(e) => {
                  const next = [...reviews];
                  next[i] = { ...r, name: e.target.value };
                  onChange(next);
                }}
              />
              <Field
                label="Rating"
                type="number"
                min={1}
                max={5}
                value={r.rating}
                onChange={(e) => {
                  const next = [...reviews];
                  next[i] = { ...r, rating: Number(e.target.value) };
                  onChange(next);
                }}
              />
              <Field
                label="Date label"
                value={r.date}
                onChange={(e) => {
                  const next = [...reviews];
                  next[i] = { ...r, date: e.target.value };
                  onChange(next);
                }}
              />
            </div>
            <label className="block text-sm">
              <span className="text-muted text-xs uppercase tracking-wider">Review text</span>
              <textarea
                value={r.text}
                onChange={(e) => {
                  const next = [...reviews];
                  next[i] = { ...r, text: e.target.value };
                  onChange(next);
                }}
                rows={3}
                className="mt-1 w-full border border-walnut/15 bg-cream px-3 py-2.5 rounded-sm outline-none focus:border-copper"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsEditor({
  items,
  onChange,
}: {
  items: Announcement[];
  onChange: (a: Announcement[]) => void;
}) {
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl mb-6">Announcements</h1>
      {items.map((a, i) => (
        <div key={a.id} className="space-y-3 bg-ivory border border-walnut/8 p-4 rounded-sm">
          <Field
            label="Banner text"
            value={a.text}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...a, text: e.target.value };
              onChange(next);
            }}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={a.active}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...a, active: e.target.checked };
                onChange(next);
              }}
            />
            Show on site
          </label>
        </div>
      ))}
    </div>
  );
}
