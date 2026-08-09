"use client";

import Image from "next/image";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/utils";

export function SignatureDishes() {
  const { content } = useContent();
  const dishes = content.menuItems.filter(
    (i) => content.featuredDishIds.includes(i.id) && i.story && i.image
  );

  return (
    <section className="bg-cream py-24 md:py-36">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Signatures"
          title="Dishes With a Story"
          subtitle="Editorial favourites — the recipes, the ingredients, and our notes from the counter."
        />

        <div className="space-y-28 md:space-y-40">
          {dishes.map((dish, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={dish.id}
                className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                <Reveal
                  className={`lg:col-span-7 relative aspect-[4/3] md:aspect-[16/11] overflow-hidden rounded-sm ${
                    reverse ? "lg:order-2" : ""
                  }`}
                  y={36}
                  delay={i * 40}
                >
                  <div className="img-reveal absolute inset-0">
                    <Image
                      src={dish.image!}
                      alt={dish.name}
                      fill
                      quality={92}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                </Reveal>

                <Reveal
                  className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}
                  y={28}
                  delay={80 + i * 40}
                >
                  <p className="text-[11px] tracking-[0.28em] uppercase text-copper mb-4">
                    Signature · {formatPrice(dish.price)}
                  </p>
                  <h3 className="font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05] text-walnut">
                    {dish.name}
                  </h3>
                  <p className="mt-5 text-muted leading-relaxed">{dish.story}</p>

                  {dish.ingredients && (
                    <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
                      {dish.ingredients.map((ing) => (
                        <li
                          key={ing}
                          className="text-[12px] tracking-[0.08em] text-walnut/60 border-b border-walnut/15 pb-0.5"
                        >
                          {ing}
                        </li>
                      ))}
                    </ul>
                  )}

                  {dish.chefNote && (
                    <blockquote className="mt-8 border-l-2 border-racing pl-5">
                      <p className="text-[10px] tracking-[0.24em] uppercase text-racing mb-2">
                        Chef recommends
                      </p>
                      <p className="font-serif text-xl text-walnut italic leading-snug">
                        {dish.chefNote}
                      </p>
                    </blockquote>
                  )}
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
