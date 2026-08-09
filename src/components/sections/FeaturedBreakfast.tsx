"use client";

import Image from "next/image";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/utils";

export function FeaturedBreakfast() {
  const { content } = useContent();
  const favourites = content.menuItems.filter((i) => i.favourite);
  // Triple the list so CSS -33.333% loop stays seamless with gaps
  const items = [...favourites, ...favourites, ...favourites];

  if (favourites.length === 0) return null;

  return (
    <section id="breakfast" className="bg-cream py-24 md:py-32 overflow-hidden">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Morning Favourites"
          title="Breakfast Worth Crossing London For"
          subtitle="Slow-cooked classics and house signatures — the plates that made Mike's a Notting Hill ritual."
        />
      </div>

      <div className="relative marquee-mask">
        <div className="marquee-track gap-6 md:gap-8 pl-4">
          {items.map((item, idx) => (
            <article
              key={`${item.id}-${idx}`}
              className="w-[280px] md:w-[360px] shrink-0 group"
              aria-hidden={idx >= favourites.length}
            >
              <div className="img-reveal relative aspect-[4/5] rounded-sm bg-vintage">
                <Image
                  src={item.image}
                  alt={idx < favourites.length ? item.name : ""}
                  fill
                  className="object-cover"
                  sizes="360px"
                />
                {item.favourite && (
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase bg-racing text-ivory px-3 py-1.5">
                    Favourite
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-walnut">{item.name}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <p className="text-copper font-medium whitespace-nowrap pt-1">
                  {formatPrice(item.price)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
