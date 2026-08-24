/* NAVA mock catalogue — deterministic, no network needed. */

export type CategoryKind = "shop" | "service";

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  hue: number;
  kind: CategoryKind;
  subcategories: string[];
  route?: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  category: string;
  cuisines: string[];
  area: string;
  city: string;
  rating: number;
  ratingCount: number;
  deliveryMins: number;
  deliveryFee: number;
  minOrder: number;
  distanceKm: number;
  emoji: string;
  hue: number;
  openHours: string;
  description: string;
  offer: string;
  trending: boolean;
  veg: boolean;
}

export interface Product {
  id: string;
  name: string;
  storeId: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  mrp: number;
  unit: string;
  rating: number;
  ratingCount: number;
  emoji: string;
  hue: number;
  stock: number;
  veg: boolean;
  description: string;
  specs: Record<string, string>;
  variantLabel?: string;
  variants?: string[];
  flash?: boolean;
}

export interface Coupon {
  code: string;
  title: string;
  type: "percent" | "flat";
  value: number;
  maxDiscount: number;
  minOrder: number;
  category: string | "all";
  expiry: string;
}

export const CATEGORIES: Category[] = [
  { slug: "food", name: "Food", emoji: "🍛", hue: 25, kind: "shop", subcategories: ["Biryani", "Pizza", "Burgers", "South Indian", "Chinese", "Desserts"] },
  { slug: "grocery", name: "Grocery", emoji: "🛒", hue: 140, kind: "shop", subcategories: ["Dairy", "Snacks", "Beverages", "Staples", "Household", "Personal care"] },
  { slug: "fashion", name: "Fashion", emoji: "👗", hue: 330, kind: "shop", subcategories: ["Men", "Women", "Kids", "Footwear", "Accessories", "Ethnic", "Western"] },
  { slug: "electronics", name: "Electronics", emoji: "📱", hue: 250, kind: "shop", subcategories: ["Mobiles", "Laptops", "Tablets", "Headphones", "Smartwatches", "TVs", "Gaming", "Accessories"] },
  { slug: "pharmacy", name: "Pharmacy", emoji: "💊", hue: 190, kind: "shop", subcategories: ["Personal care", "Wellness", "Healthcare products"] },
  { slug: "meat", name: "Meat", emoji: "🍗", hue: 15, kind: "shop", subcategories: ["Chicken", "Mutton", "Seafood", "Eggs"] },
  { slug: "fruits", name: "Fruits", emoji: "🍎", hue: 40, kind: "shop", subcategories: ["Seasonal", "Exotic", "Cut fruit"] },
  { slug: "vegetables", name: "Vegetables", emoji: "🥦", hue: 130, kind: "shop", subcategories: ["Daily veggies", "Leafy", "Organic"] },
  { slug: "bakery", name: "Bakery", emoji: "🥐", hue: 60, kind: "shop", subcategories: ["Breads", "Cakes", "Cookies"] },
  { slug: "flowers", name: "Flowers", emoji: "💐", hue: 350, kind: "shop", subcategories: ["Bouquets", "Roses", "Gifts"] },
  { slug: "pets", name: "Pet Supplies", emoji: "🐶", hue: 90, kind: "shop", subcategories: ["Food", "Toys", "Grooming"] },
  { slug: "hardware", name: "Hardware", emoji: "🔧", hue: 220, kind: "shop", subcategories: ["Tools", "Electricals", "Paints"] },
  { slug: "stationery", name: "Stationery", emoji: "📚", hue: 275, kind: "shop", subcategories: ["Books", "Pens", "Notebooks", "School supplies"] },
  { slug: "courier", name: "Courier", emoji: "📦", hue: 210, kind: "service", subcategories: [], route: "/courier" },
  { slug: "bike", name: "Bike", emoji: "🏍️", hue: 165, kind: "service", subcategories: [], route: "/rides" },
  { slug: "auto", name: "Auto", emoji: "🛺", hue: 50, kind: "service", subcategories: [], route: "/rides" },
  { slug: "cab", name: "Cab", emoji: "🚗", hue: 235, kind: "service", subcategories: [], route: "/rides" },
  { slug: "home-services", name: "Home Services", emoji: "🧰", hue: 300, kind: "service", subcategories: [], route: "/services" },
];

export const SHOP_CATEGORIES = CATEGORIES.filter((c) => c.kind === "shop");

const AREAS = ["Banjara Hills", "Gachibowli", "Kondapur", "Madhapur", "Jubilee Hills", "Kukatpally", "Begumpet", "Ameerpet"];

interface StoreSeed {
  name: string;
  category: string;
  emoji: string;
  cuisines?: string[];
  veg?: boolean;
}

const STORE_SEEDS: StoreSeed[] = [
  { name: "Deccan Spice House", category: "food", emoji: "🍲", cuisines: ["Hyderabadi", "Biryani", "Mughlai"] },
  { name: "Tandoor Junction", category: "food", emoji: "🍢", cuisines: ["North Indian", "Kebabs"] },
  { name: "Green Leaf Meals", category: "food", emoji: "🥗", cuisines: ["South Indian", "Thali"], veg: true },
  { name: "Wok & Roll", category: "food", emoji: "🥡", cuisines: ["Chinese", "Asian"] },
  { name: "Slice Society", category: "food", emoji: "🍕", cuisines: ["Pizza", "Italian"] },
  { name: "Sweet Karma", category: "food", emoji: "🍮", cuisines: ["Desserts", "Bakery"], veg: true },
  { name: "NAVA Mart Express", category: "grocery", emoji: "🛍️" },
  { name: "Daily Basket", category: "grocery", emoji: "🧺" },
  { name: "Value Kirana", category: "grocery", emoji: "🏪" },
  { name: "Threadline Studio", category: "fashion", emoji: "🧵" },
  { name: "Urban Drape", category: "fashion", emoji: "👚" },
  { name: "StepUp Footwear", category: "fashion", emoji: "👟" },
  { name: "VoltCity Electronics", category: "electronics", emoji: "🔌" },
  { name: "GadgetNest", category: "electronics", emoji: "🎧" },
  { name: "CareWell Pharmacy", category: "pharmacy", emoji: "🏥" },
  { name: "MediQuick", category: "pharmacy", emoji: "🩺" },
  { name: "Fresh Cuts Meat Co.", category: "meat", emoji: "🥩" },
  { name: "Coastal Catch", category: "meat", emoji: "🐟" },
  { name: "Orchard Fresh", category: "fruits", emoji: "🍇" },
  { name: "Farm Basket Veggies", category: "vegetables", emoji: "🥕" },
  { name: "Crust & Crumb Bakery", category: "bakery", emoji: "🍞" },
  { name: "Petal Story", category: "flowers", emoji: "🌷" },
  { name: "Pawtown Supplies", category: "pets", emoji: "🦴" },
  { name: "FixIt Hardware", category: "hardware", emoji: "🔩" },
  { name: "Inkwell Stationers", category: "stationery", emoji: "✏️" },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// deterministic pseudo random
function rnd(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const STORES: Store[] = STORE_SEEDS.map((s, i) => {
  const cat = CATEGORIES.find((c) => c.slug === s.category)!;
  const r = rnd(i + 1);
  return {
    id: `st-${i + 1}`,
    slug: slugify(s.name),
    name: s.name,
    category: s.category,
    cuisines: s.cuisines ?? [cat.name],
    area: AREAS[i % AREAS.length]!,
    city: "Hyderabad",
    rating: Number((3.9 + r * 1).toFixed(1)),
    ratingCount: 120 + Math.floor(r * 4200),
    deliveryMins: 12 + Math.floor(r * 38),
    deliveryFee: [0, 15, 19, 25, 29][Math.floor(r * 5)]!,
    minOrder: [0, 99, 149, 199][Math.floor(r * 4)]!,
    distanceKm: Number((0.4 + r * 6).toFixed(1)),
    emoji: s.emoji,
    hue: cat.hue,
    openHours: i % 4 === 0 ? "24 hours" : "8:00 AM – 11:30 PM",
    description: `${s.name} is a trusted ${cat.name.toLowerCase()} partner in ${AREAS[i % AREAS.length]}, known for quality, fair prices and quick NAVA delivery.`,
    offer: ["Flat ₹75 OFF above ₹399", "20% OFF up to ₹100", "Buy 1 Get 1 on select items", "Free delivery today"][Math.floor(r * 4)]!,
    trending: r > 0.55,
    veg: s.veg ?? false,
  };
});

interface ItemSeed {
  name: string;
  sub: string;
  price: number;
  unit: string;
  emoji: string;
  brand?: string;
  veg?: boolean;
  variantLabel?: string;
  variants?: string[];
}

const CATALOG: Record<string, ItemSeed[]> = {
  food: [
    { name: "Hyderabadi Chicken Dum Biryani", sub: "Biryani", price: 289, unit: "Serves 1", emoji: "🍛" },
    { name: "Mutton Biryani Family Pack", sub: "Biryani", price: 649, unit: "Serves 3", emoji: "🍲" },
    { name: "Veg Paneer Biryani", sub: "Biryani", price: 229, unit: "Serves 1", emoji: "🍚", veg: true },
    { name: "Farmhouse Pizza", sub: "Pizza", price: 349, unit: "Medium", emoji: "🍕", veg: true, variantLabel: "Size", variants: ["Regular", "Medium", "Large"] },
    { name: "Peri Peri Chicken Pizza", sub: "Pizza", price: 429, unit: "Medium", emoji: "🍕", variantLabel: "Size", variants: ["Regular", "Medium", "Large"] },
    { name: "Classic Cheese Burger", sub: "Burgers", price: 169, unit: "1 pc", emoji: "🍔", veg: true },
    { name: "Double Chicken Burger", sub: "Burgers", price: 239, unit: "1 pc", emoji: "🍔" },
    { name: "Ghee Podi Idli", sub: "South Indian", price: 129, unit: "4 pcs", emoji: "🍥", veg: true },
    { name: "Masala Dosa", sub: "South Indian", price: 119, unit: "1 pc", emoji: "🥞", veg: true },
    { name: "Andhra Meals Unlimited", sub: "South Indian", price: 199, unit: "1 thali", emoji: "🍱", veg: true },
    { name: "Chilli Paneer Dry", sub: "Chinese", price: 219, unit: "250 g", emoji: "🥘", veg: true },
    { name: "Hakka Noodles", sub: "Chinese", price: 179, unit: "1 box", emoji: "🍜", veg: true },
    { name: "Chicken Manchurian", sub: "Chinese", price: 249, unit: "300 g", emoji: "🍗" },
    { name: "Double Ka Meetha", sub: "Desserts", price: 99, unit: "150 g", emoji: "🍮", veg: true },
    { name: "Choco Lava Cake", sub: "Desserts", price: 89, unit: "2 pcs", emoji: "🍫", veg: true },
    { name: "Gulab Jamun", sub: "Desserts", price: 79, unit: "4 pcs", emoji: "🍡", veg: true },
  ],
  grocery: [
    { name: "Full Cream Milk", sub: "Dairy", price: 34, unit: "500 ml", emoji: "🥛", brand: "Amrit", veg: true },
    { name: "Fresh Curd Cup", sub: "Dairy", price: 30, unit: "400 g", emoji: "🍶", brand: "Amrit", veg: true },
    { name: "Malai Paneer", sub: "Dairy", price: 92, unit: "200 g", emoji: "🧀", brand: "Amrit", veg: true },
    { name: "Salted Potato Chips", sub: "Snacks", price: 20, unit: "52 g", emoji: "🥔", brand: "CrispCo", veg: true },
    { name: "Masala Mixture", sub: "Snacks", price: 65, unit: "400 g", emoji: "🥨", brand: "Guntur Snacks", veg: true },
    { name: "Choco Cream Biscuits", sub: "Snacks", price: 40, unit: "300 g", emoji: "🍪", brand: "Sunbite", veg: true },
    { name: "Cold Coffee Tetra", sub: "Beverages", price: 45, unit: "180 ml", emoji: "☕", brand: "BrewLab", veg: true },
    { name: "Orange Juice", sub: "Beverages", price: 110, unit: "1 L", emoji: "🧃", brand: "Orchard", veg: true },
    { name: "Green Tea Bags", sub: "Beverages", price: 220, unit: "50 bags", emoji: "🍵", brand: "Leafly", veg: true },
    { name: "Sona Masoori Rice", sub: "Staples", price: 640, unit: "10 kg", emoji: "🌾", brand: "Godavari", veg: true },
    { name: "Toor Dal", sub: "Staples", price: 175, unit: "1 kg", emoji: "🫘", brand: "Godavari", veg: true },
    { name: "Sunflower Oil", sub: "Staples", price: 155, unit: "1 L", emoji: "🛢️", brand: "SunPure", veg: true },
    { name: "Floor Cleaner Lemon", sub: "Household", price: 189, unit: "1 L", emoji: "🧴", brand: "ShinePro", veg: true },
    { name: "Detergent Powder", sub: "Household", price: 240, unit: "2 kg", emoji: "🧼", brand: "WashWell", veg: true },
    { name: "Herbal Shampoo", sub: "Personal care", price: 265, unit: "340 ml", emoji: "🧴", brand: "Neemveda", veg: true },
    { name: "Charcoal Face Wash", sub: "Personal care", price: 199, unit: "100 g", emoji: "🧖", brand: "Neemveda", veg: true },
  ],
  fashion: [
    { name: "Cotton Casual Shirt", sub: "Men", price: 999, unit: "1 pc", emoji: "👔", brand: "Threadline", variantLabel: "Size", variants: ["S", "M", "L", "XL"] },
    { name: "Slim Fit Denim Jeans", sub: "Men", price: 1499, unit: "1 pc", emoji: "👖", brand: "Denimo", variantLabel: "Size", variants: ["30", "32", "34", "36"] },
    { name: "Printed Kurta Set", sub: "Ethnic", price: 1799, unit: "1 set", emoji: "🥻", brand: "Rangrez", variantLabel: "Size", variants: ["S", "M", "L", "XL"] },
    { name: "Banarasi Silk Saree", sub: "Ethnic", price: 3499, unit: "1 pc", emoji: "🧣", brand: "Rangrez" },
    { name: "Floral Summer Dress", sub: "Women", price: 1299, unit: "1 pc", emoji: "👗", brand: "Urban Drape", variantLabel: "Size", variants: ["XS", "S", "M", "L"] },
    { name: "Western Crop Top", sub: "Western", price: 699, unit: "1 pc", emoji: "👚", brand: "Urban Drape", variantLabel: "Size", variants: ["XS", "S", "M", "L"] },
    { name: "Kids Cartoon Tee", sub: "Kids", price: 449, unit: "1 pc", emoji: "🧒", brand: "TinyTales", variantLabel: "Age", variants: ["2-3y", "4-5y", "6-7y"] },
    { name: "Running Sports Shoes", sub: "Footwear", price: 2199, unit: "1 pair", emoji: "👟", brand: "StepUp", variantLabel: "Size", variants: ["6", "7", "8", "9", "10"] },
    { name: "Leather Formal Shoes", sub: "Footwear", price: 2599, unit: "1 pair", emoji: "👞", brand: "StepUp", variantLabel: "Size", variants: ["6", "7", "8", "9"] },
    { name: "Analog Wrist Watch", sub: "Accessories", price: 1899, unit: "1 pc", emoji: "⌚", brand: "Chronos" },
    { name: "Leather Sling Bag", sub: "Accessories", price: 1399, unit: "1 pc", emoji: "👜", brand: "Carryon" },
  ],
  electronics: [
    { name: "Nova X5 5G Smartphone", sub: "Mobiles", price: 18999, unit: "1 unit", emoji: "📱", brand: "Nova", variantLabel: "Storage", variants: ["128 GB", "256 GB"] },
    { name: "Pixelio Note 12", sub: "Mobiles", price: 13499, unit: "1 unit", emoji: "📲", brand: "Pixelio", variantLabel: "Storage", variants: ["64 GB", "128 GB"] },
    { name: "AeroBook 14 Laptop", sub: "Laptops", price: 54999, unit: "1 unit", emoji: "💻", brand: "Aero", variantLabel: "RAM", variants: ["8 GB", "16 GB"] },
    { name: "ProStudio Gaming Laptop", sub: "Laptops", price: 89999, unit: "1 unit", emoji: "🖥️", brand: "ProStudio" },
    { name: "SlateTab 11", sub: "Tablets", price: 21999, unit: "1 unit", emoji: "📟", brand: "Slate" },
    { name: "BassPods Pro ANC", sub: "Headphones", price: 3499, unit: "1 pair", emoji: "🎧", brand: "BassLab", variantLabel: "Colour", variants: ["Black", "White", "Blue"] },
    { name: "Studio Over-Ear Headset", sub: "Headphones", price: 5999, unit: "1 unit", emoji: "🎧", brand: "BassLab" },
    { name: "PulseFit Smartwatch", sub: "Smartwatches", price: 2999, unit: "1 unit", emoji: "⌚", brand: "PulseFit", variantLabel: "Strap", variants: ["Silicone", "Metal"] },
    { name: 'VividView 43" 4K TV', sub: "TVs", price: 27999, unit: "1 unit", emoji: "📺", brand: "VividView" },
    { name: "Console Play Station Bundle", sub: "Gaming", price: 44999, unit: "1 unit", emoji: "🎮", brand: "PlayBox" },
    { name: "Wireless Gaming Mouse", sub: "Accessories", price: 1799, unit: "1 unit", emoji: "🖱️", brand: "ClickPro" },
    { name: "65W Fast Charger", sub: "Accessories", price: 1299, unit: "1 unit", emoji: "🔌", brand: "VoltCity" },
  ],
  pharmacy: [
    { name: "Vitamin C Chewable Tablets", sub: "Wellness", price: 249, unit: "60 tabs", emoji: "💊", brand: "Wellcore" },
    { name: "Whey Protein Chocolate", sub: "Wellness", price: 2399, unit: "1 kg", emoji: "🥤", brand: "Wellcore", variantLabel: "Flavour", variants: ["Chocolate", "Vanilla"] },
    { name: "Digital Thermometer", sub: "Healthcare products", price: 299, unit: "1 unit", emoji: "🌡️", brand: "MediQuick" },
    { name: "BP Monitor Automatic", sub: "Healthcare products", price: 1899, unit: "1 unit", emoji: "🩺", brand: "MediQuick" },
    { name: "Antiseptic Liquid", sub: "Healthcare products", price: 165, unit: "500 ml", emoji: "🧴", brand: "SafeGuard" },
    { name: "Sunscreen SPF 50", sub: "Personal care", price: 449, unit: "80 g", emoji: "🧴", brand: "DermaSafe" },
    { name: "Hand Sanitizer", sub: "Personal care", price: 99, unit: "200 ml", emoji: "🧼", brand: "SafeGuard" },
  ],
  meat: [
    { name: "Chicken Curry Cut", sub: "Chicken", price: 259, unit: "1 kg", emoji: "🍗" },
    { name: "Boneless Chicken Breast", sub: "Chicken", price: 329, unit: "500 g", emoji: "🍖" },
    { name: "Mutton Curry Cut", sub: "Mutton", price: 899, unit: "500 g", emoji: "🥩" },
    { name: "Prawns Cleaned", sub: "Seafood", price: 549, unit: "500 g", emoji: "🦐" },
    { name: "Rohu Fish Steaks", sub: "Seafood", price: 349, unit: "500 g", emoji: "🐟" },
    { name: "Farm Eggs Tray", sub: "Eggs", price: 149, unit: "30 pcs", emoji: "🥚", veg: true },
  ],
  fruits: [
    { name: "Banana Robusta", sub: "Seasonal", price: 54, unit: "1 kg", emoji: "🍌", veg: true },
    { name: "Nagpur Oranges", sub: "Seasonal", price: 129, unit: "1 kg", emoji: "🍊", veg: true },
    { name: "Alphonso Mangoes", sub: "Seasonal", price: 499, unit: "1 dozen", emoji: "🥭", veg: true },
    { name: "Imported Kiwi", sub: "Exotic", price: 189, unit: "3 pcs", emoji: "🥝", veg: true },
    { name: "Dragon Fruit", sub: "Exotic", price: 149, unit: "1 pc", emoji: "🐉", veg: true },
    { name: "Mixed Cut Fruit Bowl", sub: "Cut fruit", price: 99, unit: "300 g", emoji: "🍉", veg: true },
  ],
  vegetables: [
    { name: "Tomato Local", sub: "Daily veggies", price: 32, unit: "1 kg", emoji: "🍅", veg: true },
    { name: "Onion", sub: "Daily veggies", price: 40, unit: "1 kg", emoji: "🧅", veg: true },
    { name: "Potato", sub: "Daily veggies", price: 38, unit: "1 kg", emoji: "🥔", veg: true },
    { name: "Palak Leafy Bunch", sub: "Leafy", price: 25, unit: "250 g", emoji: "🥬", veg: true },
    { name: "Coriander Bunch", sub: "Leafy", price: 15, unit: "100 g", emoji: "🌿", veg: true },
    { name: "Organic Broccoli", sub: "Organic", price: 89, unit: "500 g", emoji: "🥦", veg: true },
  ],
  bakery: [
    { name: "Whole Wheat Bread", sub: "Breads", price: 55, unit: "400 g", emoji: "🍞", veg: true },
    { name: "Butter Croissant", sub: "Breads", price: 79, unit: "2 pcs", emoji: "🥐", veg: true },
    { name: "Black Forest Cake", sub: "Cakes", price: 599, unit: "500 g", emoji: "🎂", veg: true, variantLabel: "Weight", variants: ["500 g", "1 kg"] },
    { name: "Red Velvet Pastry", sub: "Cakes", price: 129, unit: "1 pc", emoji: "🍰", veg: true },
    { name: "Butter Cookies Jar", sub: "Cookies", price: 249, unit: "400 g", emoji: "🍪", veg: true },
  ],
  flowers: [
    { name: "Red Rose Bouquet", sub: "Roses", price: 649, unit: "12 stems", emoji: "🌹", veg: true },
    { name: "Mixed Seasonal Bouquet", sub: "Bouquets", price: 899, unit: "1 bouquet", emoji: "💐", veg: true },
    { name: "Orchid Arrangement", sub: "Bouquets", price: 1249, unit: "1 vase", emoji: "🪻", veg: true },
    { name: "Chocolate & Flowers Combo", sub: "Gifts", price: 1099, unit: "1 combo", emoji: "🎁", veg: true },
  ],
  pets: [
    { name: "Adult Dog Dry Food", sub: "Food", price: 1299, unit: "3 kg", emoji: "🦴", brand: "Pawtown" },
    { name: "Cat Salmon Treats", sub: "Food", price: 349, unit: "450 g", emoji: "🐱", brand: "Pawtown" },
    { name: "Squeaky Chew Toy", sub: "Toys", price: 299, unit: "1 pc", emoji: "🧸", brand: "Pawtown" },
    { name: "Pet Grooming Brush", sub: "Grooming", price: 449, unit: "1 pc", emoji: "🪥", brand: "Pawtown" },
  ],
  hardware: [
    { name: "Cordless Drill Machine", sub: "Tools", price: 2799, unit: "1 unit", emoji: "🛠️", brand: "FixIt" },
    { name: "Screwdriver Tool Kit", sub: "Tools", price: 899, unit: "24 pcs", emoji: "🔧", brand: "FixIt" },
    { name: "LED Bulb 9W Pack", sub: "Electricals", price: 399, unit: "4 pcs", emoji: "💡", brand: "GlowMax" },
    { name: "Interior Emulsion Paint", sub: "Paints", price: 1899, unit: "10 L", emoji: "🎨", brand: "ColourCraft", variantLabel: "Shade", variants: ["Ivory", "Sky", "Beige"] },
  ],
  stationery: [
    { name: "Ruled Notebook Pack", sub: "Notebooks", price: 249, unit: "6 books", emoji: "📓", brand: "Inkwell" },
    { name: "Gel Pen Set Blue", sub: "Pens", price: 120, unit: "10 pens", emoji: "🖊️", brand: "Inkwell" },
    { name: "Competitive Exam Guide", sub: "Books", price: 549, unit: "1 book", emoji: "📕", brand: "StudyHub" },
    { name: "School Supplies Combo", sub: "School supplies", price: 799, unit: "1 kit", emoji: "🎒", brand: "Inkwell" },
  ],
};

export const PRODUCTS: Product[] = (() => {
  const out: Product[] = [];
  let n = 0;
  for (const [cat, items] of Object.entries(CATALOG)) {
    const catStores = STORES.filter((s) => s.category === cat);
    const hue = CATEGORIES.find((c) => c.slug === cat)!.hue;
    items.forEach((it, i) => {
      n += 1;
      const r = rnd(n + 100);
      const store = catStores[i % Math.max(catStores.length, 1)]!;
      const discount = 0.05 + r * 0.35;
      out.push({
        id: `p-${n}`,
        name: it.name,
        storeId: store.id,
        category: cat,
        subcategory: it.sub,
        brand: it.brand ?? store.name,
        price: it.price,
        mrp: Math.round((it.price / (1 - discount)) / 5) * 5,
        unit: it.unit,
        rating: Number((3.7 + r * 1.2).toFixed(1)),
        ratingCount: 24 + Math.floor(r * 2400),
        emoji: it.emoji,
        hue,
        stock: r > 0.93 ? 0 : 5 + Math.floor(r * 60),
        veg: it.veg ?? false,
        description: `${it.name} from ${store.name}. Freshly sourced, quality checked and delivered by NAVA in ${store.deliveryMins} minutes.`,
        specs: {
          Brand: it.brand ?? store.name,
          Pack: it.unit,
          Category: CATEGORIES.find((c) => c.slug === cat)!.name,
          Seller: store.name,
          Returns: "Easy 24-hour return",
        },
        ...(it.variantLabel ? { variantLabel: it.variantLabel, variants: it.variants } : {}),
        flash: r > 0.72,
      });
    });
  }
  return out;
})();

export const COUPONS: Coupon[] = [
  { code: "NAVA50", title: "Flat ₹50 off on orders above ₹299", type: "flat", value: 50, maxDiscount: 50, minOrder: 299, category: "all", expiry: "31 Dec 2026" },
  { code: "WELCOME100", title: "₹100 off for new users above ₹499", type: "flat", value: 100, maxDiscount: 100, minOrder: 499, category: "all", expiry: "31 Dec 2026" },
  { code: "FIRSTORDER", title: "30% off up to ₹150 on your first order", type: "percent", value: 30, maxDiscount: 150, minOrder: 199, category: "all", expiry: "31 Dec 2026" },
  { code: "GROCERY20", title: "20% off up to ₹120 on grocery", type: "percent", value: 20, maxDiscount: 120, minOrder: 399, category: "grocery", expiry: "31 Dec 2026" },
  { code: "FASHION15", title: "15% off up to ₹300 on fashion", type: "percent", value: 15, maxDiscount: 300, minOrder: 999, category: "fashion", expiry: "31 Dec 2026" },
];

export const BANNERS = [
  { id: "b1", title: "Festival Feast Days", subtitle: "Up to 60% off on biryani & thalis", cta: "Order food", to: "/category/food", emoji: "🎉", hue: 25 },
  { id: "b2", title: "10-minute Grocery", subtitle: "Daily essentials at kirana prices", cta: "Shop grocery", to: "/category/grocery", emoji: "⚡", hue: 145 },
  { id: "b3", title: "Gadget Carnival", subtitle: "Flat ₹3000 off on 5G phones", cta: "Explore", to: "/category/electronics", emoji: "📱", hue: 255 },
  { id: "b4", title: "Ride for less", subtitle: "Bike rides from ₹25 across the city", cta: "Book a ride", to: "/rides", emoji: "🏍️", hue: 175 },
];

export const RIDE_TYPES = [
  { id: "bike", name: "Bike", emoji: "🏍️", base: 20, perKm: 6, capacity: 1, eta: 3 },
  { id: "auto", name: "Auto", emoji: "🛺", base: 30, perKm: 11, capacity: 3, eta: 5 },
  { id: "mini", name: "Mini", emoji: "🚗", base: 50, perKm: 14, capacity: 4, eta: 6 },
  { id: "sedan", name: "Sedan", emoji: "🚙", base: 70, perKm: 18, capacity: 4, eta: 8 },
  { id: "suv", name: "SUV", emoji: "🚐", base: 110, perKm: 24, capacity: 6, eta: 11 },
];

export const PLACES = [
  { name: "Home — Road No. 12, Banjara Hills", lat: 17.41, lng: 78.44 },
  { name: "Work — Cyber Towers, Hitec City", lat: 17.45, lng: 78.38 },
  { name: "Rajiv Gandhi Intl. Airport", lat: 17.24, lng: 78.43 },
  { name: "Secunderabad Railway Station", lat: 17.43, lng: 78.5 },
  { name: "Inorbit Mall, Madhapur", lat: 17.43, lng: 78.38 },
  { name: "Charminar, Old City", lat: 17.36, lng: 78.47 },
  { name: "Gachibowli Stadium", lat: 17.44, lng: 78.34 },
];

export const PACKAGE_TYPES = [
  { id: "docs", name: "Documents", emoji: "📄", multiplier: 1 },
  { id: "food", name: "Food / Tiffin", emoji: "🍱", multiplier: 1.1 },
  { id: "electronics", name: "Electronics", emoji: "📦", multiplier: 1.3 },
  { id: "clothes", name: "Clothes", emoji: "👕", multiplier: 1.05 },
  { id: "other", name: "Other", emoji: "🎁", multiplier: 1.15 },
];

export const COURIER_SPEEDS = [
  { id: "standard", name: "Standard", note: "Within 3 hours", multiplier: 1 },
  { id: "express", name: "Express", note: "Within 60 minutes", multiplier: 1.6 },
  { id: "sameday", name: "Scheduled", note: "Pick a slot today", multiplier: 0.9 },
];

export const HOME_SERVICES = [
  { id: "electrician", name: "Electrician", emoji: "💡", price: 249, duration: "45 min", desc: "Switches, fans, wiring & repairs" },
  { id: "plumber", name: "Plumber", emoji: "🚿", price: 299, duration: "60 min", desc: "Leaks, taps, drainage & fittings" },
  { id: "cleaning", name: "Cleaning", emoji: "🧹", price: 899, duration: "3 hours", desc: "Deep home cleaning by pros" },
  { id: "ac", name: "AC Repair", emoji: "❄️", price: 549, duration: "90 min", desc: "Service, gas refill & repair" },
  { id: "appliance", name: "Appliance Repair", emoji: "🔧", price: 399, duration: "60 min", desc: "Fridge, washing machine, microwave" },
  { id: "beauty", name: "Beauty", emoji: "💅", price: 799, duration: "75 min", desc: "Salon services at home" },
  { id: "painting", name: "Painting", emoji: "🎨", price: 2499, duration: "1 day", desc: "Room painting with premium paints" },
  { id: "pest", name: "Pest Control", emoji: "🐜", price: 1199, duration: "2 hours", desc: "Cockroach, termite & mosquito control" },
];

export const PROVIDERS = [
  { id: "pr1", name: "Ramesh Kumar", rating: 4.9, jobs: 1240, years: 8 },
  { id: "pr2", name: "Syed Imran", rating: 4.8, jobs: 860, years: 6 },
  { id: "pr3", name: "Lakshmi Devi", rating: 4.9, jobs: 1520, years: 10 },
  { id: "pr4", name: "Arun Teja", rating: 4.7, jobs: 540, years: 4 },
];

export const DRIVERS = [
  { name: "Venkatesh R.", vehicle: "Honda Activa", number: "TS 09 EK 4412", rating: 4.9 },
  { name: "Mohammed Ali", vehicle: "Bajaj Auto", number: "TS 10 UB 7781", rating: 4.8 },
  { name: "Suresh Babu", vehicle: "Swift Dzire", number: "TS 07 FN 2093", rating: 4.9 },
];

export const RIDERS = [
  { name: "Prakash N.", vehicle: "Scooter", number: "TS 08 GH 1123", rating: 4.8 },
  { name: "Imran S.", vehicle: "Bike", number: "TS 09 AC 5567", rating: 4.9 },
  { name: "Kiran V.", vehicle: "EV Scooter", number: "TS 11 EV 3321", rating: 4.7 },
];

export const FAQS = [
  { q: "How do I track my order?", a: "Open Orders from the bottom navigation, choose the active order and tap Track. You will see live status, rider details and ETA." },
  { q: "When is my refund credited?", a: "Refunds for cancelled prepaid orders are credited to your NAVA Wallet instantly and to bank accounts in 3-5 working days." },
  { q: "How do coupons work?", a: "Apply a coupon on the cart or checkout screen. Each coupon has a minimum order value, category and expiry which is validated automatically." },
  { q: "Can I schedule a delivery?", a: "Yes. At checkout choose Schedule and pick a date and time slot that suits you." },
  { q: "How do referrals work?", a: "Share your referral code from Profile → Referrals. You earn ₹100 in wallet credit when your friend completes their first order." },
  { q: "Is cash on delivery available?", a: "COD is available on most orders below ₹5,000 depending on your address and the store." },
];

export const TRENDING_SEARCHES = ["Biryani", "Milk", "iPhone", "Paracetamol", "Chicken", "Cake", "Bouquet", "Shoes"];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const storeById = (id: string) => STORES.find((s) => s.id === id);
export const storeBySlug = (slug: string) => STORES.find((s) => s.slug === slug);
export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
