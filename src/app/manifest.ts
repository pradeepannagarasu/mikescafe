import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Piccola",
    description: SITE.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#1a2018",
    theme_color: "#5c6b3a",
    lang: "en-GB",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
