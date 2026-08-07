"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { defaultContent } from "@/lib/data";
import {
  clearStoredContent,
  readStoredContent,
  subscribeContent,
  writeStoredContent,
} from "@/lib/content-store";
import type { SiteContent } from "@/types";

type ContentContextValue = {
  content: SiteContent;
  updateContent: (partial: Partial<SiteContent>) => void;
  resetContent: () => void;
  hydrated: boolean;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function getServerSnapshot() {
  return defaultContent;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const content = useSyncExternalStore(
    subscribeContent,
    readStoredContent,
    getServerSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribeContent,
    () => true,
    () => false
  );

  const updateContent = useCallback((partial: Partial<SiteContent>) => {
    const current = readStoredContent();
    writeStoredContent({ ...current, ...partial });
  }, []);

  const resetContent = useCallback(() => {
    clearStoredContent();
  }, []);

  const value = useMemo(
    () => ({ content, updateContent, resetContent, hydrated }),
    [content, updateContent, resetContent, hydrated]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
