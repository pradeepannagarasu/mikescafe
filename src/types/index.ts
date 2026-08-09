export type MenuCategory =
  | "breakfast"
  | "traditional"
  | "vegetarian"
  | "lunch"
  | "sandwiches"
  | "drinks"
  | "desserts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
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
  /** Cropped dish photo used while mixing on the plate */
  image: string;
  /** CSS object-position for ingredient crop */
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
