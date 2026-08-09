import type { BuilderItem, SiteContent } from "@/types";

export const SITE = {
  name: "Mike's Cafe",
  established: 1962,
  tagline: "London's Beloved Breakfast Destination",
  rating: 4.6,
  reviewCount: 1000,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mikescafenottinghill.co.uk",
  logo: "/mikeslogo.png",
};

/** Local plate photography */
export const PLATES = {
  english: "/images/english-breakfast.jpg",
  eggsBenedict: "/images/eggs-benedict.jpg",
  frenchToast: "/images/french-toast.jpg",
  bagels: "/images/mikes-bagels.jpg",
  mediterranean: "/images/mediterranean.jpg",
  spicyScramble: "/images/spicy-scrambled-eggs.jpg",
  pancake: "/images/homemade-pancake.jpg",
  veggie: "/images/veggie-english.jpg",
  bloodyMary: "/images/bloody-mary.jpg",
  gammonEggs: "/images/gammon-eggs.jpg",
  smashedAvocado: "/images/smashed-avocado-bacon.jpg",
} as const;

/** Cafe atmosphere & gallery photography */
export const GALLERY_SHOTS = {
  goodFoodVibes: "/images/gallery/good-food-good-vibes.jpg",
  goodVibes: "/images/gallery/good-vibes-neon.jpg",
  fullEnglishPlate: "/images/gallery/full-english-plate.jpg",
  mikesMoments: "/images/gallery/mikes-moments.jpg",
  diningRoom: "/images/gallery/dining-room.jpg",
  cafeCounter: "/images/gallery/cafe-counter.jpg",
  boothsNeon: "/images/gallery/booths-and-neon.jpg",
} as const;

export const defaultContent: SiteContent = {
  phone: "+44 20 7229 5491",
  email: "hello@mikescafenottinghill.co.uk",
  address: {
    line1: "12 Blenheim Crescent",
    line2: "Notting Hill",
    city: "London",
    postcode: "W11 1NN",
    country: "United Kingdom",
  },
  specialOfTheDay: {
    name: "The Notting Hill Full English",
    description:
      "Two eggs your way, Cumberland sausage, smoked back bacon, grilled tomato, field mushrooms, bubble & squeak, baked beans and thick-cut toast.",
    price: 14.5,
  },
  openingHours: [
    { day: "Monday", hours: "Closed", closed: true },
    { day: "Tuesday", hours: "Closed", closed: true },
    { day: "Wednesday", hours: "8:00 AM - 4:00 PM" },
    { day: "Thursday", hours: "8:00 AM - 4:00 PM" },
    { day: "Friday", hours: "8:00 AM - 4:00 PM" },
    { day: "Saturday", hours: "8:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "8:00 AM - 4:00 PM" },
  ],
  featuredDishIds: [
    "full-english",
    "eggs-benedict",
    "french-toast",
    "smashed-avocado",
  ],
  announcements: [
    {
      id: "a1",
      text: "Weekend mornings fill quickly - reserve ahead for parties of 4+",
      active: true,
    },
  ],
  menuItems: [
    {
      id: "full-english",
      name: "Full English",
      description:
        "Two eggs, bacon, sausage, beans, mushrooms, tomato, toast - the London classic since 1962.",
      price: 13.5,
      category: "breakfast",
      image: PLATES.english,
      favourite: true,
      featured: true,
      ingredients: [
        "Free-range eggs",
        "Smoked bacon",
        "Cumberland sausage",
        "Baked beans",
        "Mushrooms",
        "Tomato",
        "Sourdough toast",
      ],
      story:
        "Our Full English has been the heart of the morning rush on Blenheim Crescent for over sixty years - cooked the same way Mike intended.",
      chefNote: "Ask for your eggs fried, scrambled or poached.",
    },
    {
      id: "big-boy",
      name: "The Big Boy",
      description:
        "Double everything. Built for the hungriest mornings in West London.",
      price: 17.5,
      category: "breakfast",
      image: PLATES.english,
      favourite: true,
      featured: true,
      ingredients: [
        "Four eggs",
        "Double bacon",
        "Two sausages",
        "Hash browns",
        "Black pudding",
        "Toast",
      ],
      story:
        "Born from regulars who asked for 'just a bit more' - The Big Boy became legend.",
      chefNote: "A proper challenge. Few leave hungry.",
    },
    {
      id: "eggs-benedict",
      name: "Eggs Benedict",
      description:
        "Poached eggs, honey-roast ham, toasted muffin, hollandaise.",
      price: 12.5,
      category: "breakfast",
      image: PLATES.eggsBenedict,
      favourite: true,
      featured: true,
      ingredients: ["Poached eggs", "Ham", "English muffin", "Hollandaise"],
      story: "Our hollandaise is whisked fresh each morning.",
      chefNote: "Try it with smoked salmon as Eggs Royale.",
    },
    {
      id: "french-toast",
      name: "French Toast",
      description:
        "Brioche soaked overnight, berry compote, maple butter, crème fraîche.",
      price: 11.5,
      category: "breakfast",
      image: PLATES.frenchToast,
      favourite: true,
      featured: true,
    },
    {
      id: "mikes-bagel",
      name: "Mike's Bagel",
      description:
        "Toasted bagel, cream cheese, smoked salmon, dill, lemon.",
      price: 10.5,
      category: "breakfast",
      image: PLATES.bagels,
      favourite: true,
    },
    {
      id: "mediterranean",
      name: "Mediterranean Breakfast",
      description:
        "Grilled halloumi, avocado, roasted peppers, olives, warm flatbread.",
      price: 12.0,
      category: "vegetarian",
      image: PLATES.mediterranean,
      favourite: true,
    },
    {
      id: "spicy-scramble",
      name: "Spicy Scrambled Eggs",
      description:
        "Soft scrambled eggs with chilli, spring onion, coriander on sourdough.",
      price: 9.5,
      category: "breakfast",
      image: PLATES.spicyScramble,
      favourite: true,
    },
    {
      id: "smashed-avocado",
      name: "Smashed Avocado & Bacon",
      description:
        "Smashed avocado on toast with smoked bacon, chilli flakes and lemon.",
      price: 11.5,
      category: "breakfast",
      image: PLATES.smashedAvocado,
      favourite: true,
      featured: true,
    },
    {
      id: "gammon-eggs",
      name: "Gammon & Eggs",
      description:
        "Thick-cut gammon steak, two eggs your way, grilled tomato and toast.",
      price: 12.5,
      category: "traditional",
      image: PLATES.gammonEggs,
      favourite: true,
    },
    {
      id: "yogurt",
      name: "Natural Yogurt",
      description: "Greek yogurt, honey, house granola, seasonal fruit.",
      price: 7.5,
      category: "vegetarian",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80",
    },
    {
      id: "pancake",
      name: "Homemade Pancake",
      description:
        "Fluffy buttermilk stack, maple syrup, butter, fresh berries.",
      price: 10.0,
      category: "breakfast",
      image: PLATES.pancake,
      favourite: true,
    },
    {
      id: "bubble",
      name: "Bubble & Squeak",
      description: "Crispy leftover veg cake with two eggs and brown sauce.",
      price: 9.0,
      category: "traditional",
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80",
    },
    {
      id: "black-pudding",
      name: "Black Pudding & Eggs",
      description: "Seared black pudding, fried eggs, grilled tomato, toast.",
      price: 11.0,
      category: "traditional",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
    },
    {
      id: "veggie-english",
      name: "Vegetarian English",
      description:
        "Eggs, halloumi, mushrooms, tomatoes, beans, hash browns, toast.",
      price: 12.5,
      category: "vegetarian",
      image: PLATES.veggie,
      favourite: true,
    },
    {
      id: "club-sandwich",
      name: "Club Sandwich",
      description: "Chicken, bacon, lettuce, tomato, mayo on toasted bread.",
      price: 11.5,
      category: "sandwiches",
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=900&q=80",
    },
    {
      id: "blt",
      name: "BLT",
      description: "Crispy bacon, lettuce, tomato, aioli on sourdough.",
      price: 9.5,
      category: "sandwiches",
      image:
        "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=900&q=80",
    },
    {
      id: "soup-lunch",
      name: "Soup of the Day",
      description: "Seasonal soup with warm bread and butter.",
      price: 7.5,
      category: "lunch",
      image:
        "https://images.unsplash.com/photo-1547592166-23acba13379d?w=900&q=80",
    },
    {
      id: "jacket",
      name: "Jacket Potato",
      description: "Crispy jacket with butter and choice of topping.",
      price: 8.5,
      category: "lunch",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=900&q=80",
    },
    {
      id: "filter-coffee",
      name: "Filter Coffee",
      description: "Slow-brewed house blend - rich and warming.",
      price: 3.2,
      category: "drinks",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80",
    },
    {
      id: "flat-white",
      name: "Flat White",
      description: "Double shot, silky microfoam.",
      price: 3.8,
      category: "drinks",
      image:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=900&q=80",
    },
    {
      id: "bloody-mary",
      name: "Bloody Mary",
      description:
        "House vodka, tomato juice, Worcestershire, Tabasco, celery salt - a Mike's morning classic.",
      price: 8.5,
      category: "drinks",
      image: PLATES.bloodyMary,
      favourite: true,
    },
    {
      id: "fresh-oj",
      name: "Fresh Orange Juice",
      description: "Squeezed to order each morning.",
      price: 4.5,
      category: "drinks",
      image:
        "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=900&q=80",
    },
    {
      id: "english-tea",
      name: "English Breakfast Tea",
      description: "Proper builder's brew in a pot for one.",
      price: 2.8,
      category: "drinks",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&q=80",
    },
    {
      id: "sticky-toffee",
      name: "Sticky Toffee Pudding",
      description: "Warm date sponge, toffee sauce, vanilla ice cream.",
      price: 6.5,
      category: "desserts",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80",
    },
    {
      id: "apple-crumble",
      name: "Apple Crumble",
      description: "Bramley apple, oat topping, custard.",
      price: 6.0,
      category: "desserts",
      image:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=900&q=80",
    },
  ],
  reviews: [
    {
      id: "r1",
      name: "Sarah Mitchell",
      rating: 5,
      text: "Best Full English in Notting Hill - no contest. The booths, the smell of coffee, the friendly staff. Feels like home every single time.",
      date: "2 weeks ago",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    {
      id: "r2",
      name: "James Cooper",
      rating: 5,
      text: "Been coming since I was a kid in the 80s. Mike's is London heritage on a plate. The Big Boy still defeats me.",
      date: "1 month ago",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    {
      id: "r3",
      name: "Elena Rossi",
      rating: 5,
      text: "Tourists and locals packed in together - that's how you know it's real. Eggs Benedict was perfect.",
      date: "3 weeks ago",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    },
    {
      id: "r4",
      name: "Tom Bradley",
      rating: 4,
      text: "Classic British café done right. Arrive early on weekends. Coffee is strong, toast is thick, vibes are unbeatable.",
      date: "1 week ago",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
    {
      id: "r5",
      name: "Priya Sharma",
      rating: 5,
      text: "The vegetarian English is generous and delicious. Staff remembered our order from last month. Pure Notting Hill magic.",
      date: "5 days ago",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    },
    {
      id: "r6",
      name: "Oliver Wright",
      rating: 5,
      text: "A proper greasy spoon elevated with love. Red booths, morning light through the windows - cinematic.",
      date: "2 months ago",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
  ],
  gallery: [
    {
      id: "g1",
      src: GALLERY_SHOTS.goodFoodVibes,
      alt: "Mike's Cafe - Good Food, Good Vibes",
      span: "wide",
    },
    {
      id: "g2",
      src: GALLERY_SHOTS.goodVibes,
      alt: "Good vibes only neon sign at Mike's Cafe",
      span: "wide",
    },
    {
      id: "g3",
      src: GALLERY_SHOTS.diningRoom,
      alt: "Dining room with red booths and neon glow",
      span: "tall",
    },
    {
      id: "g4",
      src: GALLERY_SHOTS.fullEnglishPlate,
      alt: "Full English breakfast plate",
      span: "tall",
    },
    {
      id: "g5",
      src: GALLERY_SHOTS.mikesMoments,
      alt: "MIKES marquee, coffee and breakfast moments",
      span: "normal",
    },
    {
      id: "g6",
      src: GALLERY_SHOTS.cafeCounter,
      alt: "Cafe counter, booths and Good Food neon",
      span: "tall",
    },
    {
      id: "g7",
      src: GALLERY_SHOTS.boothsNeon,
      alt: "Booth seating and brick wall neon",
      span: "wide",
    },
    {
      id: "g8",
      src: PLATES.eggsBenedict,
      alt: "Eggs Benedict",
      span: "normal",
    },
    {
      id: "g9",
      src: PLATES.frenchToast,
      alt: "French toast",
      span: "wide",
    },
    {
      id: "g10",
      src: PLATES.english,
      alt: "Classic Full English at Mike's",
      span: "tall",
    },
    {
      id: "g11",
      src: PLATES.bagels,
      alt: "Mike's bagels",
      span: "normal",
    },
    {
      id: "g12",
      src: PLATES.pancake,
      alt: "Homemade pancakes",
      span: "normal",
    },
  ],
};

export const builderItems: BuilderItem[] = [
  {
    id: "eggs-fried",
    name: "Fried Eggs",
    price: 2.5,
    category: "eggs",
    image: PLATES.gammonEggs,
    focus: "55% 40%",
  },
  {
    id: "eggs-scrambled",
    name: "Scrambled Eggs",
    price: 2.5,
    category: "eggs",
    image: PLATES.spicyScramble,
    focus: "50% 45%",
  },
  {
    id: "eggs-poached",
    name: "Poached Eggs",
    price: 2.8,
    category: "eggs",
    image: PLATES.eggsBenedict,
    focus: "48% 42%",
  },
  {
    id: "bacon",
    name: "Smoked Bacon",
    price: 2.8,
    category: "meat",
    image: PLATES.smashedAvocado,
    focus: "70% 55%",
  },
  {
    id: "sausage",
    name: "Cumberland Sausage",
    price: 2.8,
    category: "meat",
    image: PLATES.english,
    focus: "30% 60%",
  },
  {
    id: "black-pudding",
    name: "Black Pudding",
    price: 2.5,
    category: "meat",
    image: PLATES.english,
    focus: "65% 70%",
  },
  {
    id: "beans",
    name: "Baked Beans",
    price: 1.5,
    category: "sides",
    image: PLATES.english,
    focus: "75% 40%",
  },
  {
    id: "toast",
    name: "Thick Toast",
    price: 1.8,
    category: "sides",
    image: PLATES.smashedAvocado,
    focus: "35% 70%",
  },
  {
    id: "hash",
    name: "Hash Browns",
    price: 2.2,
    category: "sides",
    image: PLATES.veggie,
    focus: "40% 65%",
  },
  {
    id: "mushrooms",
    name: "Field Mushrooms",
    price: 2.0,
    category: "veg",
    image: PLATES.mediterranean,
    focus: "60% 50%",
  },
  {
    id: "tomatoes",
    name: "Grilled Tomatoes",
    price: 1.5,
    category: "veg",
    image: PLATES.english,
    focus: "85% 55%",
  },
  {
    id: "bubble",
    name: "Bubble & Squeak",
    price: 2.5,
    category: "veg",
    image: PLATES.veggie,
    focus: "50% 55%",
  },
];

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#story", label: "Story" },
  { href: "#breakfast", label: "Breakfast" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
  { href: "#contact", label: "Contact" },
];

export const timeline = [
  {
    year: "1962",
    title: "The Beginning",
    text: "Mike opened the doors on Blenheim Crescent with a simple promise - honest breakfast, strong tea, and a warm seat for everyone.",
  },
  {
    year: "1978",
    title: "A Local Landmark",
    text: "Through the rise of Notting Hill as a cultural quarter, Mike's remained the neighbourhood's morning ritual.",
  },
  {
    year: "1995",
    title: "Film & Fame",
    text: "As the area appeared on screens worldwide, visitors found what locals already knew - the best breakfast in W11.",
  },
  {
    year: "Today",
    title: "Still Serving",
    text: "Same booths. Same recipes. Same spirit. Over sixty years of mornings, still cooked with care.",
  },
];

export const instagramPosts = [
  GALLERY_SHOTS.goodFoodVibes,
  GALLERY_SHOTS.goodVibes,
  GALLERY_SHOTS.fullEnglishPlate,
  GALLERY_SHOTS.diningRoom,
  PLATES.eggsBenedict,
  GALLERY_SHOTS.cafeCounter,
];
