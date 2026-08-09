"use client";

import { useContent } from "@/context/ContentContext";

export function AnnouncementBar() {
  const { content } = useContent();
  const active = content.announcements.find((a) => a.active);
  if (!active) return null;

  const segment = (
    <span className="announce-segment inline-flex items-center shrink-0">
      <span className="text-gold/90 px-6">{active.text}</span>
      <span className="text-copper/40 px-2" aria-hidden>
        ·
      </span>
      <span className="text-gold/90 px-6">{active.text}</span>
      <span className="text-copper/40 px-2" aria-hidden>
        ·
      </span>
      <span className="text-gold/90 px-6">{active.text}</span>
      <span className="text-copper/40 px-2" aria-hidden>
        ·
      </span>
      <span className="text-gold/90 px-6">{active.text}</span>
      <span className="text-copper/40 px-2" aria-hidden>
        ·
      </span>
    </span>
  );

  return (
    <div className="fixed top-0 inset-x-0 z-[55] bg-black text-ivory border-b border-copper/30 overflow-hidden">
      <div
        className="announce-track py-2.5 text-[11px] tracking-[0.14em] uppercase"
        aria-label={active.text}
      >
        <div className="announce-group">{segment}</div>
        <div className="announce-group" aria-hidden>
          {segment}
        </div>
      </div>
    </div>
  );
}
