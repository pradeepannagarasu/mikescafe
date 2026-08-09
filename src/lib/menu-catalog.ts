import type { MenuCategory, MenuGroup, MenuItem } from "@/types";
import { PLATES } from "@/lib/plates";
import { DISH_PHOTOS } from "@/lib/dish-photos";

type Spec = {
  name: string;
  price: number;
  category: MenuCategory;
  group?: MenuGroup;
  description?: string;
  /** Pass empty string for text-only items (no photo) */
  image?: string;
  favourite?: boolean;
  featured?: boolean;
  story?: string;
};

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function groupFor(category: MenuCategory): MenuGroup {
  if (category === "catering") return "catering";
  if (category === "shop") return "shop";
  if (
    category === "coffee" ||
    category === "juice" ||
    category === "soft-drinks" ||
    category === "beer" ||
    category === "wine"
  ) {
    return "drinks";
  }
  return "order";
}

function fallbackImage(category: MenuCategory): string | undefined {
  switch (category) {
    case "breakfast":
      return PLATES.italianoVegPanini;
    case "panini":
      return PLATES.parmaPanini;
    case "piadina":
      return PLATES.parmaPiadina;
    case "focaccia":
      return PLATES.chickenPanini;
    case "croissants":
      return PLATES.vegPiadina;
    case "pizza":
      return PLATES.salutarePanini;
    case "savouries":
      return PLATES.meatballs;
    case "bakery":
      return PLATES.vegPiadina;
    case "pasta":
      return PLATES.beefLasagna;
    case "lasagna":
      return PLATES.beefLasagna;
    case "mains":
      return PLATES.aubergineParmigiana;
    case "sides":
      return PLATES.chickenEscalope;
    case "starters":
      return PLATES.parmaPiadina;
    case "desserts":
      return undefined;
    case "shop":
      return undefined;
    case "catering":
      return PLATES.beefLasagna;
    default:
      return PLATES.parmaPanini;
  }
}

/** Catering trays reuse the matching counter plate photos */
const CATERING_PHOTOS: Record<string, string> = {
  "Lasagna Bolognese (Catering)": DISH_PHOTOS["Lasagna Bolognese"],
  "Lasagna Al Pesto (Catering)": DISH_PHOTOS["Lasagna Al Pesto"],
  "Lasagna Ai Funghi (Catering)": DISH_PHOTOS["Lasagna Bolognese"],
  "Cous Cous With Vegetables (Catering)": DISH_PHOTOS["Cous Cous Main"],
  "Traditional Meat Balls In Tomato Sauce (24 Pcs)":
    DISH_PHOTOS["Polpette Al Pomodoro With Rice"],
  "Spezzatino Di Manzo Con Piselli E Patate":
    DISH_PHOTOS["Marinated Roast Chicken Breast With Potatoes"],
  "Cotoletta Alla Milanese (6 Pieces)": DISH_PHOTOS["Chicken Cotoletta With Salad"],
  "Parmigiana Di Melanzane (Catering)": DISH_PHOTOS["Aubergine Parmigiana"],
  "Roast Potatoes (Catering)": DISH_PHOTOS["Roasted Potatoes"],
  "Broccoli With Fresh Chilli And Garlic": DISH_PHOTOS["Steamed Broccoli"],
  "Zucchine Alla Scapece": DISH_PHOTOS["Grilled Courgettes"],
  "Roasted Season Vegetables (Catering)": DISH_PHOTOS["Mixed Roasted Vegetables"],
  "Aubergine Caponata (Catering)": DISH_PHOTOS["Caponata Di Melanzane"],
  "Pizza Margherita (Catering)": DISH_PHOTOS["Pizza Margherita"],
  "Pizza Sausage And Mushroom (Catering)": DISH_PHOTOS["Pizza Bianca"],
  "Focaccia Ligure": DISH_PHOTOS["Focaccia Slice"],
};

function build(specs: Spec[]): MenuItem[] {
  const seen = new Set<string>();
  const out: MenuItem[] = [];
  for (const s of specs) {
    let id = slug(s.name);
    if (seen.has(id)) id = `${id}-${s.price.toFixed(2).replace(".", "")}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const category = s.category;
    const group = s.group ?? groupFor(category);
    const image =
      s.image !== undefined
        ? s.image || undefined
        : DISH_PHOTOS[s.name] ?? CATERING_PHOTOS[s.name] ?? fallbackImage(category);
    out.push({
      id,
      name: s.name,
      description: s.description ?? "",
      price: s.price,
      category,
      group,
      ...(image ? { image } : {}),
      favourite: s.favourite,
      featured: s.featured,
      story: s.story,
    });
  }
  return out;
}

/** Primary click & collect food + core drinks; catering & shop are separate groups */
export const menuCatalog: MenuItem[] = build([
  // ORDER: Breakfast
  { name: "Avocado On Toast", price: 10.5, category: "breakfast", favourite: true },
  { name: "Scrambled Eggs On Toast", price: 11.5, category: "breakfast", favourite: true },
  { name: "Greek Yoghurt Granola", price: 5.8, category: "breakfast" },

  // ORDER: Panini
  {
    name: "Panino Al Crudo",
    price: 9.5,
    category: "panini",
    favourite: true,
    featured: true,
    description: "Classic panino with cured ham.",
    story: "A Piccola counter favourite, simple, generous, Italian.",
  },
  {
    name: "Panino Al Cotto",
    price: 9.5,
    category: "panini",
    favourite: true,
  },
  {
    name: "Panino Italiano - Wholegrain",
    price: 9.5,
    category: "panini",
    favourite: true,
  },
  {
    name: "Panino Salmon And Cream Cheese",
    price: 10,
    category: "panini",
    favourite: true,
  },

  // ORDER: Piadina
  {
    name: "Piadina Mortadella",
    price: 9.5,
    category: "piadina",
    favourite: true,
  },
  {
    name: "Piadina Parma Ham",
    price: 9.5,
    category: "piadina",
    favourite: true,
    featured: true,
    story: "Thin grilled piadina with Parma ham.",
  },

  // ORDER: Focaccia
  { name: "Focaccia Mortadella", price: 7.5, category: "focaccia" },
  { name: "Focaccia Salame And Scamorza", price: 7.5, category: "focaccia" },
  {
    name: "Focaccia Chicken Escalope",
    price: 10,
    category: "focaccia",
    favourite: true,
  },
  { name: "Focaccia Slice", price: 2.8, category: "focaccia" },

  // ORDER: Croissants
  { name: "Croissant Plain", price: 2.9, category: "croissants" },
  { name: "Croissant Chocolate", price: 3.4, category: "croissants", favourite: true },
  { name: "Croissant Apricot", price: 3.4, category: "croissants" },
  { name: "Croissant Custard", price: 3.4, category: "croissants" },
  { name: "Croissant Pistachio", price: 3.4, category: "croissants" },
  { name: "Ham And Cheese Croissant", price: 7.5, category: "croissants" },
  { name: "Mozzarella And Tomato Croissant", price: 7.5, category: "croissants" },

  // ORDER: Pizzas
  { name: "Pizza Margherita", price: 6.5, category: "pizza", favourite: true },
  { name: "Pizza Bianca", price: 6.5, category: "pizza" },

  // ORDER: Savouries
  { name: "Frittata Homemade", price: 7, category: "savouries", favourite: true },
  { name: "Valdostana", price: 6, category: "savouries" },
  { name: "Pasqualina", price: 6, category: "savouries" },
  { name: "Panzerotto Mediterraneo", price: 5.5, category: "savouries" },
  { name: "Arancino", price: 4.8, category: "savouries", favourite: true },

  // ORDER: Pasta
  { name: "Pasta Al Pesto", price: 8.5, category: "pasta", favourite: true },
  { name: "Pasta Al Pomodoro", price: 8.5, category: "pasta", favourite: true },
  { name: "Arrabbiata Pasta", price: 8.5, category: "pasta" },
  { name: "Bolognese Pasta", price: 9.5, category: "pasta", favourite: true },
  { name: "Pasta Salsiccia Ragu", price: 10, category: "pasta" },
  { name: "Pasta Boscaiola", price: 10, category: "pasta" },
  { name: "Gnocchi Al Pesto", price: 10.5, category: "pasta" },
  { name: "Gnocchi Alla Sorrentina", price: 10.5, category: "pasta" },
  { name: "Cous Cous Main", price: 9.5, category: "pasta" },
  { name: "Cous Cous Chicken Main", price: 12, category: "pasta" },

  // ORDER: Lasagna
  {
    name: "Lasagna Bolognese",
    price: 12,
    category: "lasagna",
    favourite: true,
    featured: true,
    story: "Slow-layered beef lasagna, comfort food done the Italian way.",
  },
  {
    name: "Lasagna Al Pesto",
    price: 12,
    category: "lasagna",
    favourite: true,
    featured: true,
    story: "Bright pesto lasagna from the Piccola kitchen.",
  },

  // ORDER: Mains
  {
    name: "Aubergine Parmigiana",
    price: 12,
    category: "mains",
    favourite: true,
    featured: true,
    story: "Layered aubergine with tomato and melted cheese.",
  },
  {
    name: "Chicken Cotoletta With Salad",
    price: 12.5,
    category: "mains",
    favourite: true,
  },
  {
    name: "Polpette Al Pomodoro With Rice",
    price: 12.5,
    category: "mains",
    favourite: true,
    featured: true,
    story: "House meatballs in tomato sauce, served with rice.",
  },
  { name: "Roastbeef Rocket And Parmesan", price: 14.5, category: "mains", favourite: true },
  { name: "Marinated Roast Chicken Breast With Potatoes", price: 12.5, category: "mains" },
  { name: "Chicken Caesar Salad", price: 12.5, category: "mains", favourite: true },
  { name: "Mini Sausage And Potatoes", price: 12.5, category: "mains" },
  { name: "Leek And Potatoes Soup", price: 6.5, category: "mains" },
  { name: "Butternut Squash Soup", price: 6.5, category: "mains" },

  // ORDER: Sides
  { name: "Roasted Potatoes", price: 6.5, category: "sides" },
  { name: "Roast Peppers", price: 6.5, category: "sides" },
  { name: "Steamed Broccoli", price: 6.5, category: "sides" },
  { name: "Grilled Courgettes", price: 6.5, category: "sides" },
  { name: "Caponata Di Melanzane", price: 6.5, category: "sides" },
  { name: "Peas And Onion", price: 6.5, category: "sides" },
  { name: "Steamed Rice", price: 4.5, category: "sides" },
  { name: "Mixed Roasted Vegetables", price: 6.5, category: "sides" },

  // ORDER: Cold Starters
  { name: "Bresaola Carpaccio", price: 13.5, category: "starters", favourite: true },
  { name: "La Caprese Di Bufala", price: 12.5, category: "starters", favourite: true },
  { name: "La Caprese Di Burrata", price: 12.5, category: "starters" },
  { name: "Parma Ham Platter With Focaccia", price: 12.5, category: "starters", favourite: true },
  { name: "Sourdough Sliced", price: 2, category: "starters" },

  // ORDER: Desserts (text-only, no plate photos)
  { name: "Mixed Fruits Tarte", price: 6.5, category: "desserts", image: "" },
  { name: "Homemade Tiramisu", price: 6.5, category: "desserts", favourite: true, image: "" },
  { name: "Baked Cheesecake Blueberries", price: 5.5, category: "desserts", image: "" },
  { name: "Handmade Classic Cannoli", price: 6.5, category: "desserts", favourite: true, image: "" },
  { name: "Chocolate Brownies", price: 3.7, category: "desserts", image: "" },
  { name: "Eclairs Coffee", price: 4.5, category: "desserts", image: "" },
  { name: "Eclairs Vanilla", price: 4.5, category: "desserts", image: "" },
  { name: "Eclairs Chocolate", price: 4.5, category: "desserts", image: "" },
  { name: "Eclairs Pistachio", price: 5.5, category: "desserts", image: "" },
  { name: "Torta Della Nonna", price: 5.5, category: "desserts", image: "" },
  { name: "Strudel", price: 5.5, category: "desserts", image: "" },
  { name: "Torta Caprese", price: 5.5, category: "desserts", image: "" },
  { name: "Large Fruit Tarte - Whole", price: 55, category: "desserts", image: "" },

  // DRINKS: Coffee & Tea
  { name: "Espresso", price: 1.8, category: "coffee" },
  { name: "Double Espresso", price: 2.4, category: "coffee" },
  { name: "Macchiato", price: 2.9, category: "coffee" },
  { name: "Double Macchiato", price: 3.3, category: "coffee" },
  { name: "Cappuccino", price: 3.6, category: "coffee", favourite: true },
  { name: "Latte", price: 3.6, category: "coffee", favourite: true },
  { name: "Iced Latte", price: 4.3, category: "coffee" },
  { name: "Americano", price: 3.4, category: "coffee" },
  { name: "Mocha", price: 4.4, category: "coffee" },
  { name: "Flat White", price: 4, category: "coffee" },
  { name: "Matcha Latte", price: 5.49, category: "coffee" },
  { name: "Hot Chocolate", price: 3.6, category: "coffee" },
  { name: "English Breakfast Tea", price: 3.6, category: "coffee" },
  { name: "Earl Grey", price: 3.6, category: "coffee" },
  { name: "Mint Tea", price: 3.6, category: "coffee" },
  { name: "Camomile", price: 3.6, category: "coffee" },
  { name: "Green Tea", price: 3.6, category: "coffee" },
  { name: "Peppermint Tea", price: 3.6, category: "coffee" },

  // DRINKS: Fresh Juice
  { name: "Orange Juice", price: 6, category: "juice" },
  { name: "Orange Carrot Lemon Juice", price: 6.2, category: "juice" },

  // DRINKS: Soft
  { name: "Coca Cola In Can", price: 2.5, category: "soft-drinks" },
  { name: "Diet Coke In Can", price: 2.5, category: "soft-drinks" },
  { name: "Estathe Lemon", price: 3.5, category: "soft-drinks" },
  { name: "Estathe Peach", price: 3.5, category: "soft-drinks" },

  // CATERING
  { name: "Lasagna Bolognese (Catering)", price: 55, category: "catering" },
  { name: "Lasagna Al Pesto (Catering)", price: 55, category: "catering" },
  { name: "Lasagna Ai Funghi (Catering)", price: 55, category: "catering" },
  { name: "Cous Cous With Vegetables (Catering)", price: 32, category: "catering" },
  { name: "Traditional Meat Balls In Tomato Sauce (24 Pcs)", price: 55, category: "catering" },
  { name: "Spezzatino Di Manzo Con Piselli E Patate", price: 60, category: "catering" },
  { name: "Cotoletta Alla Milanese (6 Pieces)", price: 50, category: "catering" },
  { name: "Parmigiana Di Melanzane (Catering)", price: 60, category: "catering" },
  { name: "Roast Potatoes (Catering)", price: 24, category: "catering" },
  { name: "Broccoli With Fresh Chilli And Garlic", price: 24, category: "catering" },
  { name: "Zucchine Alla Scapece", price: 24, category: "catering" },
  { name: "Roasted Season Vegetables (Catering)", price: 24, category: "catering" },
  { name: "Aubergine Caponata (Catering)", price: 28.5, category: "catering" },
  { name: "Pizza Margherita (Catering)", price: 26, category: "catering" },
  { name: "Pizza Sausage And Mushroom (Catering)", price: 32, category: "catering" },
  { name: "Focaccia Ligure", price: 18, category: "catering" },
  { name: "Tiramisu (Catering)", price: 40, category: "catering" },
  { name: "Baked Cheese Cake (Catering)", price: 38, category: "catering" },
  { name: "Large Fruit Tarte (Catering)", price: 55, category: "catering" },

  // SHOP (text-only retail list, no product photos)
  { name: "Mortadella Bologna IGP With Pistachio 170g", price: 6, category: "shop", description: "Charcuterie", image: "" },
  { name: "Cooked Ham High Quality 170g", price: 9.5, category: "shop", description: "Charcuterie", image: "" },
  { name: "Bresaola Punta D'Anca 100g", price: 9.5, category: "shop", description: "Charcuterie", image: "" },
  { name: "Nduja Di Spilinga 230g", price: 8.5, category: "shop", description: "Charcuterie", image: "" },
  { name: "Guanciale 250g", price: 10, category: "shop", description: "Charcuterie", image: "" },
  { name: "Salsicciamo Luganega Classic 400g", price: 8.5, category: "shop", description: "Fresh meat", image: "" },
  { name: "Spaghetti Gentile 500g", price: 4.5, category: "shop", description: "Pasta & rice", image: "" },
  { name: "Rigatoni Gentile 500g", price: 4.5, category: "shop", description: "Pasta & rice", image: "" },
  { name: "Paccheri Gentile 500g", price: 4.5, category: "shop", description: "Pasta & rice", image: "" },
  { name: "Arborio Rice 1kg", price: 5.2, category: "shop", description: "Pasta & rice", image: "" },
  { name: "Fresh Basil Pesto 250g", price: 11.3, category: "shop", description: "Sauces & jars", image: "" },
  { name: "Passata - La Torrente 800g", price: 3.8, category: "shop", description: "Sauces & jars", image: "" },
  { name: "Parmigiano Reggiano DOP Aged 24 Months 200g", price: 7, category: "shop", description: "Cheeses", image: "" },
  { name: "Pecorino Romano DOP 100g", price: 5, category: "shop", description: "Cheeses", image: "" },
  { name: "Smoked Scamorza - Sabelli 250g", price: 5.9, category: "shop", description: "Cheeses", image: "" },
  { name: "Mascarpone Cheese - Sabelli 500g", price: 6.5, category: "shop", description: "Cheeses", image: "" },
  { name: "Extra Virgin Oil Intense Fruity - Donnafranca 500ml", price: 22, category: "shop", description: "Oil & dressing", image: "" },
  { name: "Baiocchi Mulino Bianco 260g", price: 3.9, category: "shop", description: "Biscuits & snack", image: "" },
  { name: "Pan Di Stelle Mulino Bianco 350g", price: 4.5, category: "shop", description: "Biscuits & snack", image: "" },
  { name: "Still Water - San Benedetto 500ml", price: 1.5, category: "shop", description: "Soft drinks", image: "" },
  { name: "Sparkling Water - San Pellegrino 500ml", price: 1.5, category: "shop", description: "Soft drinks", image: "" },
]);

export const MENU_GROUPS: { id: MenuGroup; label: string; hint: string }[] = [
  { id: "order", label: "Order", hint: "Primary food menu" },
  { id: "drinks", label: "Drinks", hint: "Coffee, juice & soft drinks" },
  { id: "catering", label: "Catering", hint: "Party trays & sharing" },
  { id: "shop", label: "Shop", hint: "Retail to take home" },
];

export const ORDER_CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "panini", label: "Panini" },
  { id: "piadina", label: "Piadina" },
  { id: "focaccia", label: "Focaccia" },
  { id: "croissants", label: "Croissants" },
  { id: "pizza", label: "Pizzas" },
  { id: "savouries", label: "Savouries" },
  { id: "pasta", label: "Pasta" },
  { id: "lasagna", label: "Lasagna" },
  { id: "mains", label: "Mains" },
  { id: "sides", label: "Sides" },
  { id: "starters", label: "Cold Starters" },
  { id: "desserts", label: "Desserts" },
];

export const DRINK_CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: "coffee", label: "Coffee & Tea" },
  { id: "juice", label: "Fresh Juice" },
  { id: "soft-drinks", label: "Soft Drinks" },
];
