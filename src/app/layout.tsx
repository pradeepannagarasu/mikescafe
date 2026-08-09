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

const title = `${SITE.name} | Italian Deli | Panini, Piadina & Lasagna`;
const description =
  "La Piccola Deli, Italian panini, piadina, lasagna and mains. Order ahead to eat in or collect.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description,
  keywords: [
    "La Piccola Deli",
    "Italian Deli London",
    "Panini",
    "Piadina",
    "Lasagna",
    "Italian lunch",
    "Collect order",
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
        url: "/images/menu/parma-panini.jpg",
        width: 1200,
        height: 630,
        alt: "Parma panini at La Piccola Deli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/menu/parma-panini.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE.url,
  },
  icons: {
    icon: [{ url: "/images/logo.png", type: "image/png" }],
    apple: [{ url: "/images/logo.png", type: "image/png" }],
  },
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  image: `${SITE.url}/images/menu/parma-panini.jpg`,
  url: SITE.url,
  servesCuisine: ["Italian", "Deli", "Sandwiches"],
  priceRange: "££",
  menu: `${SITE.url}/#menu`,
  acceptsReservations: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Address coming soon",
    addressLocality: "London",
    addressCountry: "GB",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SITE.rating,
    reviewCount: SITE.reviewCount,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
