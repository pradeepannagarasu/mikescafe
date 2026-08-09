"use client";

import { ContentProvider } from "@/context/ContentContext";
import { CartProvider } from "@/context/CartContext";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <CartProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </CartProvider>
    </ContentProvider>
  );
}
