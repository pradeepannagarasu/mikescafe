"use client";

import { useContent } from "@/context/ContentContext";

export function AnnouncementBar() {
  const { content } = useContent();
  const active = content.announcements.find((a) => a.active);
  if (!active) return null;

  const copies = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="inline-flex items-center gap-8 shrink-0 px-4">
      <span className="text-gold/90">{active.text}</span>
      <span className="text-copper/50" aria-hidden>
        ·
      </span>
    </span>
  ));

  return (
    <div className="fixed top-0 inset-x-0 z-[55] bg-black text-ivory border-b border-copper/30 overflow-hidden">
      <div
        className="announce-track py-2.5 text-[11px] tracking-[0.14em] uppercase whitespace-nowrap"
        aria-label={active.text}
      >
        {copies}
        {copies}
      </div>
    </div>
  );
}
