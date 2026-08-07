"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function Gallery() {
  const { content } = useContent();
  const [visible, setVisible] = useState(8);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const images = content.gallery;
  const shown = useMemo(() => images.slice(0, visible), [images, visible]);

  const openAt = (id: string) => {
    const idx = images.findIndex((g) => g.id === id);
    setLightbox(idx >= 0 ? idx : 0);
  };

  const next = () =>
    setLightbox((i) => (i === null ? 0 : (i + 1) % images.length));
  const prev = () =>
    setLightbox((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));

  return (
    <section id="gallery" className="bg-ivory py-24 md:py-32">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Atmosphere"
          title="Moments From Blenheim Crescent"
          subtitle="Steam, sunlight, and red booths — a Pinterest-style look at mornings at Mike's."
        />

        <div className="columns-2 md:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5">
          {shown.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openAt(img.id)}
              className={cn(
                "img-reveal relative w-full break-inside-avoid rounded-sm overflow-hidden block text-left",
                img.span === "tall" ? "aspect-[3/4]" : img.span === "wide" ? "aspect-[16/10]" : "aspect-square"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>

        {visible < images.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + 4)}
              className="px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase border border-walnut/20 hover:border-walnut/50 transition-colors min-h-12"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[60] bg-walnut/92 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute top-5 right-5 text-ivory p-2"
              onClick={() => setLightbox(null)}
            >
              <HiX size={28} />
            </button>
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-3 md:left-8 text-ivory p-2"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <HiChevronLeft size={36} />
            </button>
            <motion.div
              key={lightbox}
              className="relative w-full max-w-4xl aspect-[4/3]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                const t = e.touches[0];
                (e.currentTarget as HTMLElement).dataset.x = String(t.clientX);
              }}
              onTouchEnd={(e) => {
                const start = Number((e.currentTarget as HTMLElement).dataset.x || 0);
                const end = e.changedTouches[0].clientX;
                if (end - start > 50) prev();
                if (start - end > 50) next();
              }}
            >
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
            <button
              type="button"
              aria-label="Next"
              className="absolute right-3 md:right-8 text-ivory p-2"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <HiChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
