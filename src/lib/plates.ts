import { DISH_PHOTOS } from "@/lib/dish-photos";

/** Shared plate image paths for menu + gallery */
export const PLATES = {
  salutarePanini: DISH_PHOTOS["Panino Al Cotto"],
  parmaPanini: DISH_PHOTOS["Panino Al Crudo"],
  chickenPanini: DISH_PHOTOS["Focaccia Chicken Escalope"],
  italianoVegPanini: DISH_PHOTOS["Panino Italiano - Wholegrain"],
  salutarePiadina: DISH_PHOTOS["Piadina Mortadella"],
  parmaPiadina: DISH_PHOTOS["Piadina Parma Ham"],
  chickenPiadina: DISH_PHOTOS["Piadina Parma Ham"],
  vegPiadina: DISH_PHOTOS["Piadina Mortadella"],
  beefLasagna: DISH_PHOTOS["Lasagna Bolognese"],
  spinachLasagna: DISH_PHOTOS["Lasagna Al Pesto"],
  pestoBasilLasagna: DISH_PHOTOS["Lasagna Al Pesto"],
  chickenEscalope: DISH_PHOTOS["Chicken Cotoletta With Salad"],
  meatballs: DISH_PHOTOS["Polpette Al Pomodoro With Rice"],
  aubergineParmigiana: DISH_PHOTOS["Aubergine Parmigiana"],
  pizzaMargherita: DISH_PHOTOS["Pizza Margherita"],
  arancino: DISH_PHOTOS["Arancino"],
  avocadoToast: DISH_PHOTOS["Avocado On Toast"],
} as const;
