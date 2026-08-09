"use client";

import { HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";
import { SITE } from "@/lib/data";
import { useContent } from "@/context/ContentContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const MAP_QUERY = encodeURIComponent("20 Stratford Rd, London W8 6QD");
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

export function VisitUs() {
  const { content } = useContent();
  const { address, openingHours, phone } = content;
  const locality = [address.line2, address.city, address.postcode]
    .filter(Boolean)
    .join(", ");

  return (
    <section id="visit" className="bg-ivory py-24 md:py-32">
      <div className="section-pad mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Find Us"
          title={`Visit ${SITE.name}`}
          subtitle="On Stratford Road in Kensington, open seven days for eat-in or collect."
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-7 min-h-[360px] md:min-h-[480px] rounded-sm overflow-hidden border border-walnut/10 bg-vintage">
            <iframe
              title="La Piccola Deli on Google Maps"
              src={MAP_EMBED}
              className="h-full w-full min-h-[360px] md:min-h-[480px] border-0"
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
                <p className="mt-1 text-muted">{locality}</p>
                <p className="text-muted">{address.country}</p>
              </address>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-sm text-racing hover:text-racing-light transition-colors"
              >
                Open in Google Maps
              </a>
              {phone && phone !== "0000 000 0000" ? (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="block mt-3 text-racing hover:text-racing-light transition-colors"
                >
                  {phone}
                </a>
              ) : null}
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
            </div>

            <Button href="#reserve" variant="primary" className="w-full sm:w-auto">
              Order / Collect
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
