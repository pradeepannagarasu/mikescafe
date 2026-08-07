"use client";

import { useContent } from "@/context/ContentContext";

export function AnnouncementBar() {
  const { content } = useContent();
  const active = content.announcements.find((a) => a.active);
  if (!active) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[55] bg-racing text-ivory text-center text-[11px] tracking-[0.14em] uppercase py-2.5 px-4">
      {active.text}
    </div>
  );
}
