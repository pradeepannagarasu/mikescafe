import type { SiteContent } from "@/types";
import { defaultContent } from "@/lib/data";

export const CONTENT_STORAGE_KEY = "mikes-cafe-content-v7";
export const CONTENT_EVENT = "mikes-cafe-content-change";

export function readStoredContent(): SiteContent {
  if (typeof window === "undefined") return defaultContent;
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...defaultContent,
      ...parsed,
      address: { ...defaultContent.address, ...parsed.address },
      specialOfTheDay: {
        ...defaultContent.specialOfTheDay,
        ...parsed.specialOfTheDay,
      },
      openingHours: parsed.openingHours ?? defaultContent.openingHours,
      menuItems: parsed.menuItems ?? defaultContent.menuItems,
      reviews: parsed.reviews ?? defaultContent.reviews,
      gallery: parsed.gallery ?? defaultContent.gallery,
      featuredDishIds: parsed.featuredDishIds ?? defaultContent.featuredDishIds,
      announcements: parsed.announcements ?? defaultContent.announcements,
    };
  } catch {
    return defaultContent;
  }
}

export function writeStoredContent(content: SiteContent) {
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(CONTENT_EVENT));
}

export function clearStoredContent() {
  localStorage.removeItem(CONTENT_STORAGE_KEY);
  window.dispatchEvent(new Event(CONTENT_EVENT));
}

export function subscribeContent(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener(CONTENT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CONTENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
