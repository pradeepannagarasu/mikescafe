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

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.from(".timeline-item", {
        opacity: 0,
        x: -32,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: ".timeline-list",
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Our Heritage"
          title="Serving London's Breakfast Since 1962"
          subtitle="From a humble Notting Hill morning spot to a beloved London institution — Mike's Cafe has welcomed locals, dreamers and travellers for over sixty years."
        />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5 relative" y={32}>
            <div className="overflow-hidden rounded-sm aspect-[4/5] relative">
              <div ref={imageRef} className="absolute inset-[-12%] will-change-transform">
                <Image
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80"
                  alt="Vintage cafe atmosphere"
                  fill
                  className="object-cover grayscale-[30%] contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
            <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-muted">
              Blenheim Crescent · Notting Hill
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
