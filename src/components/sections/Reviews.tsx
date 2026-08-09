"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { SITE } from "@/lib/data";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
        >
          <FaStar
            size={14}
            className={i < rating ? "text-gold" : "text-walnut/20"}
          />
        </motion.span>
      ))}
    </div>
  );
}

export function Reviews() {
  const { content } = useContent();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === "ArrowRight") emblaApi.scrollNext();
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <section id="reviews" className="bg-cream py-24 md:py-32 overflow-hidden">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Google Reviews"
          title="Loved by Locals & Visitors"
        >
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <span className="font-serif text-5xl text-walnut">{SITE.rating}</span>
              <div>
                <Stars rating={5} />
                <p className="text-sm text-muted mt-1">{SITE.reviewCount}+ reviews</p>
              </div>
            </div>
          </div>
        </SectionHeading>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {content.reviews.map((review) => (
              <article
                key={review.id}
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[45%] lg:basis-[32%] border border-walnut/8 bg-ivory p-7 md:p-8"
              >
                <Stars rating={review.rating} />
                <p className="mt-5 font-serif text-xl md:text-2xl leading-snug text-walnut">
                  “{review.text}”
                </p>
                <div className="mt-8 flex items-center gap-3">
                  {review.avatar && (
                    <div className="relative h-11 w-11 rounded-full overflow-hidden">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-walnut">{review.name}</p>
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
