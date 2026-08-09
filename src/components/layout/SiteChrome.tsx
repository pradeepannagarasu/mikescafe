"use client";

import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <CursorGlow />
      <ScrollProgress />
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
