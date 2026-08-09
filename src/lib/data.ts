import type { BuilderItem, SiteContent } from "@/types";
import { PLATES } from "@/lib/plates";
import { menuCatalog } from "@/lib/menu-catalog";

export const SITE = {
  name: "La Piccola Deli",
  established: 2020,
  tagline: "Italian deli — panini, pasta, coffee & fresh favourites",
  rating: 4.8,
  reviewCount: 120,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mikescafe.pradeepandigital.workers.dev",
  logo: "/images/logo.png",
  logoLight: "/images/logo-light.png",
  instagram: "https://www.instagram.com/",
  instagramHandle: "@lapiccoladeli",
};

export { PLATES };

export const GALLERY_SHOTS = {
  hero: "/images/hero-interior.jpg",
  parma: PLATES.parmaPanini,
  lasagna: PLATES.beefLasagna,
  meatballs: PLATES.meatballs,
  aubergine: PLATES.aubergineParmigiana,
  piadina: PLATES.parmaPiadina,
  escalope: PLATES.chickenEscalope,
  pesto: PLATES.pestoBasilLasagna,
} as const;

export const defaultContent: SiteContent = {
  phone: "0000 000 0000",
  email: "hello@lapiccoladeli.co.uk",
  address: {
    line1: "Address coming soon",
    line2: "",
    city: "London",
    postcode: "",
    country: "United Kingdom",
  },
  specialOfTheDay: {
    name: "Lasagna Bolognese",
    description: "Slow-layered beef lasagna — order ahead for eat-in or collect.",
    price: 12,
  },
  openingHours: [
    { day: "Monday", hours: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
    { day: "Friday", hours: "9:00 AM - 5:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed", closed: true },
  ],
  featuredDishIds: [
    "panino-al-crudo",
    "piadina-parma-ham",
    "lasagna-bolognese",
    "lasagna-al-pesto",
    "aubergine-parmigiana",
    "polpette-al-pomodoro-with-rice",
  ],
  announcements: [
    {
      id: "a1",
      text: "Order menu for eat-in or collect — catering & shop available too",
      active: true,
    },
  ],
  menuItems: menuCatalog,
  reviews: [
    {
      id: "r1",
      name: "Rez Behnam",
      rating: 5,
      text: "Delicious pasta or pizza for under £10 in Kensington? Yes! What a wonderful restaurant/cafe/store. An amazing array of breakfast, lunch, dinner and coffee in a peaceful side street spot. Friendly, professional staff. Everything made fresh.",
      date: "4 months ago",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    {
      id: "r2",
      name: "John Doe",
      rating: 5,
      text: "Was brilliant. Chefs were kind and courteous, service was excellent, the food has the soul of Italian cuisine, and somehow despite being in London, the weather was absolutely lovely. Thank God and thank these fine lads for a brilliant experience.",
      date: "2 months ago",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
    {
      id: "r3",
      name: "Dean Gebauer",
      rating: 5,
      text: "Lovely little Italian cafe. The selection of authentic Italian food is incredible. The pastas are amazing! I can’t wait to come back and try more things. In the summer time they also have a little outdoor seating area with around 7 tables.",
      date: "11 months ago",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
    {
      id: "r4",
      name: "Julia Gidley",
      rating: 5,
      text: "Love this place! We visited on 2 different nights pretty close to closing time (if not a bit after!) and they greeted us cheerily on both occasions! We were looking for an easy dinner that didn't involve going out to a formal restaurant, and this was the perfect spot in the neighborhood, lovely location and wonderful people!",
      date: "3 months ago",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
  ],
  gallery: [
    { id: "g1", src: PLATES.parmaPanini, alt: "Parma panini", span: "wide" },
    { id: "g2", src: PLATES.meatballs, alt: "Meatballs", span: "normal" },
    { id: "g3", src: PLATES.beefLasagna, alt: "Beef lasagna", span: "tall" },
    { id: "g4", src: PLATES.parmaPiadina, alt: "Parma piadina", span: "normal" },
    { id: "g5", src: PLATES.aubergineParmigiana, alt: "Aubergine parmigiana", span: "wide" },
    { id: "g6", src: PLATES.chickenEscalope, alt: "Chicken escalope", span: "normal" },
    { id: "g7", src: PLATES.pestoBasilLasagna, alt: "Pesto lasagna", span: "tall" },
    { id: "g8", src: PLATES.salutarePanini, alt: "Salutare panini", span: "normal" },
    { id: "g9", src: PLATES.vegPiadina, alt: "Veg piadina", span: "wide" },
    { id: "g10", src: PLATES.spinachLasagna, alt: "Spinach lasagna", span: "normal" },
  ],
};

export const builderItems: BuilderItem[] = [];

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#story", label: "Story" },
  { href: "#favourites", label: "Favourites" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit" },
  { href: "#reserve", label: "Order" },
];

export const timeline = [
  {
    year: "Beginning",
    title: "A little deli with big flavour",
    text: "La Piccola Deli opened with honest Italian food made fresh every day.",
  },
  {
    year: "Kitchen",
    title: "From panini to pasta",
    text: "Panini, lasagna, mains and coffee — for eat-in or collect.",
  },
  {
    year: "Today",
    title: "Order ahead",
    text: "Browse the primary order menu first, then drinks, catering or the shop.",
  },
];

export const instagramPosts = [
  PLATES.parmaPanini,
  PLATES.meatballs,
  PLATES.beefLasagna,
  PLATES.parmaPiadina,
  PLATES.aubergineParmigiana,
  PLATES.pestoBasilLasagna,
];
