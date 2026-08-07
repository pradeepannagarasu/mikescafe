import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Mike's Cafe",
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e8",
    theme_color: "#1b3a2f",
    lang: "en-GB",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
