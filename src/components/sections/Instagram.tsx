"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { instagramPosts } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
            <motion.a
              key={src}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="img-reveal relative aspect-square rounded-sm overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6 }}
            >
              <Image src={src} alt={`Instagram post ${i + 1}`} fill className="object-cover" sizes="33vw" />
              <div className="absolute inset-0 bg-walnut/0 group-hover:bg-walnut/45 transition-colors duration-400 flex items-center justify-center">
                <FaInstagram
                  size={28}
                  className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
