import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SITE } from "@/lib/data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const title = `${SITE.name} | Breakfast Notting Hill | Since ${SITE.established}`;
const description =
  "Mike's Cafe — London's beloved breakfast destination since 1962. Full English, eggs Benedict & more at 12 Blenheim Crescent, Notting Hill. ★ 4.6 from 1000+ reviews.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description,
  keywords: [
    "Mike's Cafe",
    "Breakfast Notting Hill",
    "English Breakfast London",
    "Cafe Kensington",
    "Breakfast London",
    "Full English Breakfast",
    "Notting Hill Cafe",
    "Blenheim Crescent",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE.url,
    siteName: SITE.name,
    title,
    description,
    images: [
      {
        url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Mike's Cafe Full English Breakfast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE.url,
  },
  icons: {
    icon: [{ url: "/mikeslogo.png", type: "image/png" }],
    apple: [{ url: "/mikeslogo.png", type: "image/png" }],
  },
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  image:
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80",
  url: SITE.url,
  telephone: "+44-20-7229-5491",
  servesCuisine: ["British", "Breakfast", "Cafe"],
  priceRange: "££",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12 Blenheim Crescent",
    addressLocality: "Notting Hill",
    addressRegion: "London",
    postalCode: "W11 1NN",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.5152,
    longitude: -0.2055,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "1000",
    bestRating: "5",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "16:00",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('app-booting');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-walnut">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
