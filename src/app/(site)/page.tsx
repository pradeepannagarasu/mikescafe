import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { FeaturedBreakfast } from "@/components/sections/FeaturedBreakfast";
import { InteractiveMenu } from "@/components/sections/InteractiveMenu";
import { BreakfastBuilder } from "@/components/sections/BreakfastBuilder";
import { SignatureDishes } from "@/components/sections/SignatureDishes";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { VisitUs } from "@/components/sections/VisitUs";
import { Reservation } from "@/components/sections/Reservation";
import { Instagram } from "@/components/sections/Instagram";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <FeaturedBreakfast />
      <InteractiveMenu />
      <BreakfastBuilder />
      <SignatureDishes />
      <Gallery />
      <Reviews />
      <VisitUs />
      <Reservation />
      <Instagram />
    </>
  );
}
