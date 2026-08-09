"use client";

import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineTruck } from "react-icons/hi";
import { MdOutlineDirectionsSubway } from "react-icons/md";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function VisitUs() {
  const { content } = useContent();
  const { address, openingHours, phone } = content;

  return (
    <section id="visit" className="bg-ivory py-24 md:py-32">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Find Us"
          title="Visit Mike's Cafe"
          subtitle="12 Blenheim Crescent, in the heart of Notting Hill - mornings smell like coffee and toast."
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-7 min-h-[360px] md:min-h-[480px] rounded-sm overflow-hidden border border-walnut/10">
            <iframe
              title="Mike's Cafe location map"
              src="https://maps.google.com/maps?q=12%20Blenheim%20Crescent%20Notting%20Hill%20London%20W11&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="h-full w-full min-h-[360px] md:min-h-[480px] grayscale-[20%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="lg:col-span-5 space-y-10">
            <div>
              <div className="flex items-center gap-2 text-copper mb-3">
                <HiOutlineLocationMarker size={18} />
                <span className="text-[11px] tracking-[0.22em] uppercase">Address</span>
              </div>
              <address className="not-italic text-walnut leading-relaxed">
                <p className="font-serif text-2xl">{address.line1}</p>
                <p className="mt-1 text-muted">
                  {address.line2}, {address.city} {address.postcode}
                </p>
                <p className="text-muted">{address.country}</p>
              </address>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-block mt-4 text-racing hover:text-racing-light transition-colors"
              >
                {phone}
              </a>
            </div>

            <div>
              <div className="flex items-center gap-2 text-copper mb-4">
                <HiOutlineClock size={18} />
                <span className="text-[11px] tracking-[0.22em] uppercase">Opening Hours</span>
              </div>
              <ul className="space-y-2.5">
                {openingHours.map((h) => (
                  <li
                    key={h.day}
                    className="flex justify-between gap-4 text-sm border-b border-walnut/8 pb-2.5"
                  >
                    <span className="text-walnut">{h.day}</span>
                    <span className={h.closed ? "text-muted/60" : "text-muted"}>{h.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">Closed Monday & Tuesday.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-copper mb-2">
                  <MdOutlineDirectionsSubway size={18} />
                  <span className="text-[11px] tracking-[0.18em] uppercase">Underground</span>
                </div>
                <p className="text-sm text-walnut">Ladbroke Grove · 6 min walk</p>
                <p className="text-sm text-muted">Notting Hill Gate · 10 min walk</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-copper mb-2">
                  <HiOutlineTruck size={18} />
                  <span className="text-[11px] tracking-[0.18em] uppercase">Parking</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  Limited street parking nearby. Best arrived on foot or by Tube.
                </p>
              </div>
            </div>

            <Button
              href="https://maps.google.com/?q=12+Blenheim+Crescent+Notting+Hill+London+W11"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
