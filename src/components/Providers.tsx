"use client";

import { ContentProvider } from "@/context/ContentContext";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </ContentProvider>
  );
}
