"use client";

import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { instagramPosts } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Instagram() {
  return (
    <section id="contact" className="bg-cream py-24 md:py-28">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Instagram"
          title="@mikescafenottinghill"
          subtitle="Follow the morning rush — plates, pours, and Notting Hill light."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {instagramPosts.map((src, i) => (
            <Reveal
              key={src}
              className="img-reveal relative aspect-square rounded-sm overflow-hidden group"
              y={20}
              delay={i * 50}
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 block"
              >
                <Image
                  src={src}
                  alt={`Instagram post ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-walnut/0 group-hover:bg-walnut/45 transition-colors duration-400 flex items-center justify-center">
                  <FaInstagram
                    size={28}
                    className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
