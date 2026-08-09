import { DISH_PHOTOS } from "@/lib/dish-photos";

/** Shared plate image paths for menu + gallery */
export const PLATES = {
  salutarePanini: DISH_PHOTOS["Panino Al Cotto"],
  parmaPanini: DISH_PHOTOS["Panino Al Crudo"],
  chickenPanini: "/images/menu/chicken-panini.jpg",
  italianoVegPanini: "/images/menu/italiano-veg-panini.jpg",
  salutarePiadina: "/images/menu/salutare-piadina.jpg",
  parmaPiadina: "/images/menu/parma-piadina.jpg",
  chickenPiadina: "/images/menu/chicken-piadina.jpg",
  vegPiadina: "/images/menu/veg-piadina.jpg",
  beefLasagna: DISH_PHOTOS["Lasagna Bolognese"],
  spinachLasagna: "/images/menu/spinach-lasagna.jpg",
  pestoBasilLasagna: DISH_PHOTOS["Lasagna Al Pesto"],
  chickenEscalope: "/images/menu/chicken-escalope.jpg",
  meatballs: "/images/menu/meatballs.jpg",
  aubergineParmigiana: "/images/menu/aubergine-parmigiana.jpg",
  pizzaMargherita: DISH_PHOTOS["Pizza Margherita"],
  arancino: DISH_PHOTOS["Arancino"],
  avocadoToast: DISH_PHOTOS["Avocado On Toast"],
} as const;
