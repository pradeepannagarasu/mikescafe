import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Mike's Cafe",
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#c44a22",
    lang: "en-GB",
    icons: [
      {
        src: "/mikeslogo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
