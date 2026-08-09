"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

gsap.registerPlugin(ScrollTrigger);

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: 8 },
          {
            yPercent: -14,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      const items = section.querySelectorAll(".timeline-item");
      const list = section.querySelector(".timeline-list");
      if (items.length && list) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -28 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.12,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: list,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, section);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section id="story" ref={sectionRef} className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Our Story"
          title="Italian Deli Favourites, Made Fresh"
          subtitle="La Piccola Deli is a neighbourhood counter for panini, piadina, lasagna and Italian mains — cooked simply, served generously."
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5 relative" y={32}>
            <div className="overflow-hidden rounded-sm aspect-[4/5] md:aspect-[5/6] relative bg-vintage">
              <div ref={imageRef} className="absolute inset-[-8%] will-change-transform">
                <Image
                  src="/images/menu/parma-panini.jpg"
                  alt="Parma panini at La Piccola Deli"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
            <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-muted">
              Fresh fillings · Grilled breads · Ready to collect
            </p>
          </Reveal>

          <div className="lg:col-span-7 timeline-list space-y-0">
            {timeline.map((item, i) => (
              <div
                key={item.year}
                className="timeline-item grid grid-cols-[88px_1fr] md:grid-cols-[120px_1fr] gap-6 md:gap-10 border-t border-walnut/10 py-8 md:py-10"
              >
                <span className="font-serif text-3xl md:text-4xl text-racing leading-none">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl text-walnut mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted leading-relaxed max-w-xl">{item.text}</p>
                </div>
                {i === timeline.length - 1 && (
                  <div className="col-span-2 mt-4 h-px w-full bg-gradient-to-r from-copper/60 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
