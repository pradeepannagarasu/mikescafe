import type { SiteContent } from "@/types";
import { defaultContent } from "@/lib/data";

export const CONTENT_STORAGE_KEY = "piccola-deli-content-v11";
export const CONTENT_EVENT = "piccola-deli-content-change";

let cachedRaw: string | null | undefined;
let cachedContent: SiteContent = defaultContent;

function mergeContent(parsed: Partial<SiteContent>): SiteContent {
  return {
    ...defaultContent,
    ...parsed,
    address: defaultContent.address,
    specialOfTheDay: {
      ...defaultContent.specialOfTheDay,
      ...parsed.specialOfTheDay,
    },
    openingHours: defaultContent.openingHours,
    menuItems: parsed.menuItems ?? defaultContent.menuItems,
    reviews: parsed.reviews ?? defaultContent.reviews,
    gallery: parsed.gallery ?? defaultContent.gallery,
    featuredDishIds: parsed.featuredDishIds ?? defaultContent.featuredDishIds,
    announcements: parsed.announcements ?? defaultContent.announcements,
  };
}

export function readStoredContent(): SiteContent {
  if (typeof window === "undefined") return defaultContent;
  const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
  if (raw === cachedRaw) return cachedContent;
  cachedRaw = raw;
  if (!raw) {
    cachedContent = defaultContent;
    return cachedContent;
  }
  try {
    cachedContent = mergeContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    cachedContent = defaultContent;
  }
  return cachedContent;
}

export function writeStoredContent(content: SiteContent) {
  cachedContent = content;
  cachedRaw = JSON.stringify(content);
  localStorage.setItem(CONTENT_STORAGE_KEY, cachedRaw);
  window.dispatchEvent(new Event(CONTENT_EVENT));
}

export function clearStoredContent() {
  cachedRaw = null;
  cachedContent = defaultContent;
  localStorage.removeItem(CONTENT_STORAGE_KEY);
  window.dispatchEvent(new Event(CONTENT_EVENT));
}

export function subscribeContent(onStoreChange: () => void) {
  const handler = () => {
    cachedRaw = undefined;
    onStoreChange();
  };
  window.addEventListener(CONTENT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CONTENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
