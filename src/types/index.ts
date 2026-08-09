export type MenuGroup = "order" | "drinks" | "catering" | "shop";

export type MenuCategory =
  | "breakfast"
  | "sandwiches"
  | "pizza"
  | "savouries"
  | "bakery"
  | "pasta"
  | "mains"
  | "sides"
  | "starters"
  | "desserts"
  | "coffee"
  | "juice"
  | "soft-drinks"
  | "beer"
  | "wine"
  | "catering"
  | "shop";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  /** order = primary click & collect food; drinks / catering / shop are secondary */
  group: MenuGroup;
  image: string;
  favourite?: boolean;
  featured?: boolean;
  ingredients?: string[];
  story?: string;
  chefNote?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  photo?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  span?: "tall" | "wide" | "normal";
}

export interface OpeningHours {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface Announcement {
  id: string;
  text: string;
  active: boolean;
}

export interface BuilderItem {
  id: string;
  name: string;
  price: number;
  category: "eggs" | "meat" | "sides" | "veg";
  image: string;
  focus?: string;
}

export interface SiteContent {
  specialOfTheDay: {
    name: string;
    description: string;
    price: number;
  };
  openingHours: OpeningHours[];
  menuItems: MenuItem[];
  reviews: Review[];
  gallery: GalleryImage[];
  featuredDishIds: string[];
  announcements: Announcement[];
  phone: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    postcode: string;
    country: string;
  };
}
