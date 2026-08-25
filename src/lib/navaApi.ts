/* NAVA mock API — deterministic data + localStorage state. No network calls. */

import {
  CATEGORIES,
  COUPONS,
  PRODUCTS,
  STORES,
  BANNERS,
  RIDE_TYPES,
  PLACES,
  PACKAGE_TYPES,
  COURIER_SPEEDS,
  HOME_SERVICES,
  PROVIDERS,
  DRIVERS,
  FAQS,
  TRENDING_SEARCHES,
  type Category as NavaCategory,
  type Store as NavaStore,
  type Product as NavaProduct,
} from "@/nava/data";
import type {
  Address,
  AddressLabel,
  AppNotification,
  CartItem,
  Category,
  Coupon,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  Profile,
  Store,
  WalletTransaction,
  WalletTxnType,
} from "@/types";
import { navaStore, uuid, buildOrder } from "./navaStore";

function delay(ms = 200) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

function toCategory(c: NavaCategory): Category {
  return {
    id: c.slug,
    slug: c.slug,
    name: c.name,
    icon: c.emoji,
    image_url: null,
    sort_order: CATEGORIES.indexOf(c),
    is_service: c.kind === "service",
  };
}

const STORE_ACCURATE_MEDIA: Record<string, { banner: string; logo: string }> = {
  // Food & Restaurants
  "bawarchi restaurant": {
    banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
  },
  "sri kanya restaurant": {
    banner: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80",
  },
  "pista house": {
    banner: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=200&q=80",
  },
  "chaitanya food court": {
    banner: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=200&q=80",
  },
  "leon's burgers & wings": {
    banner: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80",
  },
  "la pino'z pizza": {
    banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80",
  },
  "santosh dhaba exclusive": {
    banner: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=200&q=80",
  },
  "the thick shake factory": {
    banner: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=200&q=80",
  },
  "deccan spice house": {
    banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80",
  },
  "tandoor junction": {
    banner: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=200&q=80",
  },
  "green leaf meals": {
    banner: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=200&q=80",
  },
  "wok & roll": {
    banner: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=200&q=80",
  },
  "slice society": {
    banner: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80",
  },
  "sweet karma": {
    banner: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80",
  },

  // Grocery & Supermarket
  "nava mart express": {
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80",
  },
  "daily basket": {
    banner: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80",
  },
};

const CATEGORY_DEFAULT_MEDIA: Record<string, { banner: string; logo: string }> = {
  food: {
    banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
  },
  grocery: {
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80",
  },
  fashion: {
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=200&q=80",
  },
  electronics: {
    banner: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80",
  },
  pharmacy: {
    banner: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80",
  },
};

function toStore(s: NavaStore): Store {
  const key = s.name.toLowerCase().trim();
  const media = STORE_ACCURATE_MEDIA[key] || CATEGORY_DEFAULT_MEDIA[s.category] || CATEGORY_DEFAULT_MEDIA["food"]!;

  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    category_id: s.category,
    description: s.description,
    logo_url: media.logo,
    banner_url: media.banner,
    address_line: `${s.area}, ${s.city}`,
    area: s.area,
    city: s.city,
    pincode: "500000",
    rating: s.rating,
    rating_count: s.ratingCount,
    delivery_minutes: s.deliveryMins,
    delivery_fee: s.deliveryFee,
    min_order: s.minOrder,
    is_open: true,
    tags: s.cuisines ?? [],
  };
}

const PRODUCT_ACCURATE_IMAGES: Record<string, string> = {
  // Food items
  "hyderabadi chicken dum biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  "mutton biryani family pack": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
  "veg paneer biryani": "https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=600&q=80",
  "bhimavaram special biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  "farmhouse pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  "peri peri chicken pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
  "classic cheese burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  "double chicken burger": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
  "ghee podi idli": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
  "masala dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
  "andhra meals unlimited": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
  "chilli paneer dry": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
  "hakka noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
  "chicken manchurian": "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
  "double ka meetha": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  "choco lava cake": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
  "gulab jamun": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",

  // Grocery & Dairy
  "full cream milk": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
  "fresh curd cup": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
  "malai paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
  "salted potato chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
  "masala mixture": "https://images.unsplash.com/photo-1621996346565-e3d5d62810a9?auto=format&fit=crop&w=600&q=80",
  "choco cream biscuits": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
  "cold coffee tetra": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
  "orange juice": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
  "green tea bags": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  "sona masoori rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
  "toor dal": "https://images.unsplash.com/photo-1585994192700-474a501866b7?auto=format&fit=crop&w=600&q=80",
  "sunflower oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
  "floor cleaner lemon": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80",
  "detergent powder": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
  "herbal shampoo": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
  "charcoal face wash": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",

  // Fashion
  "cotton casual shirt": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
  "slim fit denim jeans": "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
  "printed kurta set": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  "banarasi silk saree": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
  "floral summer dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
  "western crop top": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
  "kids cartoon tee": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80",
  "running sports shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  "leather formal shoes": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
  "analog wrist watch": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
  "leather sling bag": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",

  // Electronics
  "nova x5 5g smartphone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  "pixelio note 12": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
  "aerobook 14 laptop": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  "prostudio gaming laptop": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
  "slatetab 11": "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=600&q=80",
  "basspods pro anc": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
  "studio over-ear headset": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  "pulsefit smartwatch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  'vividview 43" 4k tv': "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80",
  "console play station bundle": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
  "wireless gaming mouse": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
  "65w fast charger": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",

  // Meat & Seafood
  "chicken curry cut": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80",
  "boneless chicken breast": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80",
  "mutton curry cut": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  "prawns cleaned": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80",
  "rohu fish steaks": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80",
  "farm eggs tray": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",

  // Fruits & Veggies
  "banana robusta": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  "nagpur oranges": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80",
  "alphonso mangoes": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
  "imported kiwi": "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80",
  "dragon fruit": "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=600&q=80",
  "mixed cut fruit bowl": "https://images.unsplash.com/photo-1568827999250-3f6abb743122?auto=format&fit=crop&w=600&q=80",
  "tomato local": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  "onion": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80",
  "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  "palak leafy bunch": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  "coriander bunch": "https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=600&q=80",
  "organic broccoli": "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80",

  // Bakery
  "whole wheat bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  "butter croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  "black forest cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
  "red velvet pastry": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80",
  "butter cookies jar": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",

  // Pharmacy & Wellness
  "vitamin c chewable tablets": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  "whey protein chocolate": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80",
  "digital thermometer": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
  "bp monitor automatic": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",

  // Flowers & Pets
  "red rose bouquet": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
  "mixed seasonal bouquet": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
  "adult dog dry food": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
  "cat salmon treats": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80",
};

const CATEGORY_ACCURATE_FALLBACKS: Record<string, string> = {
  food: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  fashion: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
  electronics: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  pharmacy: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
  meat: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80",
  fruits: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  vegetables: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  flowers: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
  pets: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
  hardware: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
  stationery: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
};

function productImageUrl(p: NavaProduct): string {
  const key = p.name.toLowerCase().trim();
  if (PRODUCT_ACCURATE_IMAGES[key]) {
    return PRODUCT_ACCURATE_IMAGES[key];
  }
  // Try partial search for keywords
  for (const [k, url] of Object.entries(PRODUCT_ACCURATE_IMAGES)) {
    if (key.includes(k) || k.includes(key)) {
      return url;
    }
  }
  // Keyword heuristic
  if (key.includes("biryani")) return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80";
  if (key.includes("pizza")) return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80";
  if (key.includes("burger")) return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80";
  if (key.includes("milk")) return "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80";
  if (key.includes("paneer")) return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80";
  if (key.includes("chips")) return "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80";
  if (key.includes("dosa")) return "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80";
  if (key.includes("noodle")) return "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80";
  if (key.includes("cake")) return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";
  if (key.includes("phone")) return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";
  if (key.includes("laptop")) return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80";
  if (key.includes("shirt")) return "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80";
  if (key.includes("shoe")) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";

  return CATEGORY_ACCURATE_FALLBACKS[p.category.toLowerCase()] || CATEGORY_ACCURATE_FALLBACKS["grocery"]!;
}

function toProduct(p: NavaProduct): Product {
  const store = toStore(STORES.find((s) => s.id === p.storeId)!);
  return {
    id: p.id,
    store_id: p.storeId,
    category_id: p.category,
    subcategory: p.subcategory || (p as any).sub || "Recommended",
    name: p.name,
    description: p.description,
    image_url: productImageUrl(p),
    brand: p.brand,
    unit: p.unit,
    price: p.price,
    mrp: p.mrp,
    stock: p.stock,
    is_available: p.stock > 0,
    is_veg: p.veg,
    rating: p.rating,
    sales: p.ratingCount,
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      delivery_minutes: store.delivery_minutes,
      delivery_fee: store.delivery_fee,
      min_order: store.min_order,
    },
  };
}

function toCoupon(c: (typeof COUPONS)[number]): Coupon {
  return {
    id: c.code,
    code: c.code,
    title: c.title,
    description: `Valid on ${c.category === "all" ? "all orders" : c.category}. Min order ${c.minOrder}.`,
    type: c.type === "percent" ? "PERCENT" : "FIXED",
    value: c.value,
    min_order: c.minOrder,
    max_discount: c.maxDiscount,
    expires_at: new Date(c.expiry).toISOString(),
  };
}

export const navaApi = {
  categories: async (): Promise<Category[]> => {
    await delay();
    return CATEGORIES.map(toCategory);
  },

  stores: async (categorySlug?: string): Promise<Store[]> => {
    await delay();
    let list = STORES.map(toStore);
    if (categorySlug) {
      const slug = categorySlug.toLowerCase();
      if (slug === "shop") {
        const shopSlugs = ["fashion", "electronics", "pharmacy", "pets", "flowers", "hardware", "stationery"];
        list = list.filter((s) => Boolean(s.category_id && shopSlugs.includes(s.category_id)));
      } else if (slug === "food") {
        const foodSlugs = ["food", "grocery", "bakery", "meat", "fruits", "vegetables"];
        list = list.filter((s) => Boolean(s.category_id && foodSlugs.includes(s.category_id)));
      } else {
        list = list.filter(
          (s) =>
            s.category_id === slug ||
            s.tags?.some((t) => t.toLowerCase() === slug)
        );
      }
    }
    return list.sort((a, b) => b.rating - a.rating);
  },

  storeBySlug: async (slug: string): Promise<Store | null> => {
    await delay();
    const s = STORES.find((x) => x.slug === slug);
    return s ? toStore(s) : null;
  },

  storeProducts: async (storeId: string): Promise<Product[]> => {
    await delay();
    return PRODUCTS.filter((p) => p.storeId === storeId).map(toProduct);
  },

  bestsellers: async (limit = 12): Promise<Product[]> => {
    await delay();
    return PRODUCTS.filter((p) => p.stock > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(toProduct);
  },

  productById: async (id: string): Promise<Product | null> => {
    await delay();
    let p = PRODUCTS.find((x) => x.id === id);
    if (!p) {
      const altId = id.startsWith("prod-") ? id.replace("prod-", "p-") : id.startsWith("p-") ? id.replace("p-", "prod-") : id;
      p = PRODUCTS.find((x) => x.id === altId) ?? PRODUCTS.find((x) => x.id.includes(id.replace(/\D/g, ""))) ?? PRODUCTS[0];
    }
    return p ? toProduct(p) : null;
  },

  productsByCategory: async (categorySlug: string): Promise<Product[]> => {
    await delay();
    const slug = categorySlug.toLowerCase();

    if (slug === "shop") {
      const shopSlugs = ["fashion", "electronics", "pharmacy", "pets", "flowers", "hardware", "stationery"];
      return PRODUCTS.filter((p) => shopSlugs.includes(p.category) && p.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .map(toProduct);
    }

    if (slug === "food") {
      const foodSlugs = ["food", "grocery", "bakery", "meat", "fruits", "vegetables"];
      return PRODUCTS.filter((p) => foodSlugs.includes(p.category) && p.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .map(toProduct);
    }

    return PRODUCTS.filter((p) => {
      if (p.stock <= 0) return false;
      const cat = p.category.toLowerCase();
      const sub = p.subcategory.toLowerCase();
      const name = p.name.toLowerCase();

      if (cat === slug) return true;
      if (sub === slug) return true;
      if (slug === "dairy" && (sub.includes("dairy") || name.includes("milk") || name.includes("paneer") || name.includes("curd") || name.includes("cheese") || name.includes("butter"))) return true;
      if (slug === "bakery" && (cat === "bakery" || sub.includes("bakery") || name.includes("bread") || name.includes("cake") || name.includes("biscuit") || name.includes("bun"))) return true;
      if (slug === "restaurants" && cat === "food") return true;
      if (slug === "pets" && cat === "pets") return true;
      return false;
    })
      .sort((a, b) => b.rating - a.rating)
      .map(toProduct);
  },

  search: async (term: string): Promise<{ products: Product[]; stores: Store[] }> => {
    await delay();
    const q = term.trim().toLowerCase();
    if (!q) return { products: [], stores: [] };
    const products = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 30)
      .map(toProduct);
    const stores = STORES.filter((s) => s.name.toLowerCase().includes(q) || s.cuisines?.some((c) => c.toLowerCase().includes(q)))
      .slice(0, 10)
      .map(toStore);
    // update search history
    const history = navaStore.getSearchHistory().filter((h) => h.toLowerCase() !== q);
    navaStore.setSearchHistory([q, ...history].slice(0, 10));
    return { products, stores };
  },

  coupons: async (): Promise<Coupon[]> => {
    await delay();
    return COUPONS.map(toCoupon);
  },

  banners: async () => {
    await delay();
    return BANNERS;
  },

  trendingSearches: async (): Promise<string[]> => {
    await delay();
    return TRENDING_SEARCHES;
  },

  // --- Cart (localStorage) ---
  cart: async (): Promise<CartItem[]> => {
    await delay();
    return navaStore.getCart();
  },

  addToCart: async (productId: string, quantity = 1) => {
    await delay();
    let product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      const altId = productId.startsWith("prod-") ? productId.replace("prod-", "p-") : productId.startsWith("p-") ? productId.replace("p-", "prod-") : productId;
      product = PRODUCTS.find((p) => p.id === altId) ?? PRODUCTS.find((p) => p.id.includes(productId.replace(/\D/g, ""))) ?? PRODUCTS[0];
    }
    if (!product) {
      product = PRODUCTS[0]!;
    }
    const safeStock = Math.max(product.stock, 50);
    const items = navaStore.getCart();
    const existing = items.find((i) => i.product_id === product!.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 20, safeStock);
    } else {
      items.push({
        id: uuid(),
        product_id: product.id,
        quantity: Math.min(quantity, safeStock),
        saved_for_later: false,
        product: toProduct(product),
      });
    }
    navaStore.setCart(items);
  },

  setCartQuantity: async (itemId: string, quantity: number) => {
    await delay();
    let items = navaStore.getCart();
    if (quantity <= 0) {
      items = items.filter((i) => i.id !== itemId);
    } else {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = Math.min(quantity, 20, item.product.stock);
      }
    }
    navaStore.setCart(items);
  },

  clearCart: async () => {
    await delay();
    navaStore.setCart([]);
  },

  // --- Addresses ---
  addresses: async (): Promise<Address[]> => {
    await delay();
    return navaStore.getAddresses();
  },

  saveAddress: async (address: Partial<Address> & { city: string; state: string; pincode: string }) => {
    await delay();
    const addresses = navaStore.getAddresses();
    if (address.is_default) {
      addresses.forEach((a) => (a.is_default = false));
    }
    if (address.id) {
      const idx = addresses.findIndex((a) => a.id === address.id);
      if (idx >= 0) {
        addresses[idx] = { ...addresses[idx], ...address } as Address;
        navaStore.setAddresses(addresses);
        return address.id;
      }
    }
    const id = uuid();
    const newAddress: Address = {
      id,
      label: (address.label ?? "OTHER") as AddressLabel,
      contact_name: address.contact_name ?? null,
      contact_phone: address.contact_phone ?? null,
      house: address.house ?? null,
      street: address.street ?? null,
      area: address.area ?? null,
      landmark: address.landmark ?? null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      instructions: address.instructions ?? null,
      is_default: address.is_default ?? false,
    };
    addresses.push(newAddress);
    navaStore.setAddresses(addresses);
    return id;
  },

  deleteAddress: async (id: string) => {
    await delay();
    const addresses = navaStore.getAddresses().filter((a) => a.id !== id);
    navaStore.setAddresses(addresses);
  },

  // --- Orders ---
  orders: async (): Promise<Order[]> => {
    await delay();
    return navaStore.getOrders();
  },

  order: async (id: string): Promise<Order | null> => {
    await delay();
    return navaStore.getOrders().find((o) => o.id === id) ?? null;
  },

  orderTimeline: async (id: string) => {
    await delay();
    const order = navaStore.getOrders().find((o) => o.id === id);
    if (!order) return [];
    const statusMap: Record<OrderStatus, string> = {
      PLACED: "Order placed",
      ACCEPTED: "Store accepted",
      PREPARING: "Preparing your order",
      READY: "Ready for pickup",
      PICKED_UP: "Rider picked up",
      ON_THE_WAY: "On the way",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
    };
    const timeline = [
      { id: "t1", status: "PLACED" as OrderStatus, note: statusMap.PLACED, created_at: order.placed_at },
    ];
    if (order.status !== "PLACED" && order.status !== "CANCELLED") {
      timeline.push({
        id: "t2",
        status: "ACCEPTED",
        note: statusMap.ACCEPTED,
        created_at: new Date(new Date(order.placed_at).getTime() + 2 * 60 * 1000).toISOString(),
      });
    }
    if (order.status === "CANCELLED") {
      timeline.push({
        id: "tc",
        status: "CANCELLED",
        note: order.cancelled_reason ?? "Cancelled by user",
        created_at: new Date().toISOString(),
      });
    }
    return timeline;
  },

  placeOrder: async (input: {
    addressId: string;
    paymentMethod: PaymentMethod;
    couponCode?: string | null;
    tip?: number;
    instructions?: string | null;
  }): Promise<string> => {
    await delay(400);
    const items = navaStore.getCart();
    const active = items.filter((i) => !i.saved_for_later);
    if (active.length === 0) throw new Error("CART_EMPTY");
    const store = active[0]?.product?.store;
    if (!store) throw new Error("STORE_NOT_FOUND");
    const multiStore = active.some((i) => i.product.store?.id !== store.id);
    if (multiStore) throw new Error("MULTI_STORE_CART");
    const addresses = navaStore.getAddresses();
    const address = addresses.find((a) => a.id === input.addressId);
    if (!address) throw new Error("INVALID_ADDRESS");
    const subtotal = active.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const storeFull = await navaApi.storeBySlug(store.slug);
    if (!storeFull) throw new Error("STORE_NOT_FOUND");
    if (subtotal < storeFull.min_order) throw new Error("MIN_ORDER_NOT_MET");

    let discount = 0;
    if (input.couponCode) {
      const coupon = COUPONS.find((c) => c.code === input.couponCode);
      if (!coupon || subtotal < coupon.minOrder) throw new Error("COUPON_INVALID:" + input.couponCode);
      if (coupon.type === "percent") {
        discount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount);
      } else {
        discount = Math.min(coupon.value, subtotal);
      }
    }

    const total = subtotal + storeFull.delivery_fee + 9 + Math.round(subtotal * 0.05) + (input.tip ?? 0) - discount;
    if (input.paymentMethod === "WALLET") {
      const wallet = navaStore.getWallet();
      if (wallet.balance < total) throw new Error("INSUFFICIENT_WALLET_BALANCE");
    }

    const order = buildOrder(items, address, storeFull, {
      paymentMethod: input.paymentMethod,
      couponCode: input.couponCode ?? null,
      tip: input.tip ?? 0,
      instructions: input.instructions ?? null,
    });
    order.discount = discount;
    order.total = total;

    if (input.paymentMethod === "WALLET") {
      const wallet = navaStore.getWallet();
      const after = wallet.balance - total;
      navaStore.setWallet({
        balance: after,
        transactions: [
          {
            id: uuid(),
            type: "DEBIT" as WalletTxnType,
            amount: total,
            balance_after: after,
            label: `Order ${order.code}`,
            created_at: new Date().toISOString(),
          },
          ...wallet.transactions,
        ],
      });
    }

    const orders = navaStore.getOrders();
    orders.unshift(order);
    navaStore.setOrders(orders);
    navaStore.setCart([]);

    // add notification
    const notifications = navaStore.getNotifications();
    notifications.unshift({
      id: uuid(),
      type: "order",
      title: "Order placed",
      message: `Your order ${order.code} from ${store.name} has been placed.`,
      order_id: order.id,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    navaStore.setNotifications(notifications);

    return order.id;
  },

  cancelOrder: async (orderId: string, reason: string) => {
    await delay();
    const orders = navaStore.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (["DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status)) throw new Error("CANCEL_NOT_ALLOWED");
    order.status = "CANCELLED";
    order.cancelled_reason = reason;
    if (order.payment_method !== "COD" && order.payment_status === "PAID") {
      order.payment_status = "REFUNDED";
      const wallet = navaStore.getWallet();
      const after = wallet.balance + order.total;
      navaStore.setWallet({
        balance: after,
        transactions: [
          {
            id: uuid(),
            type: "REFUND" as WalletTxnType,
            amount: order.total,
            balance_after: after,
            label: `Refund for ${order.code}`,
            created_at: new Date().toISOString(),
          },
          ...wallet.transactions,
        ],
      });
    }
    navaStore.setOrders(orders);
  },

  advanceOrder: async (orderId: string) => {
    await delay();
    const orders = navaStore.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    const flow: OrderStatus[] = ["PLACED", "ACCEPTED", "PREPARING", "READY", "PICKED_UP", "ON_THE_WAY", "DELIVERED"];
    const idx = flow.indexOf(order.status);
    if (idx >= 0 && idx < flow.length - 1) {
      order.status = flow[idx + 1]!;
      if (order.status === "PICKED_UP") {
        order.rider_name = "Prakash N.";
        order.rider_phone = "+91 98765 12345";
        order.rider_vehicle = "TS 08 GH 1123";
      }
      if (order.status === "DELIVERED") {
        order.delivered_at = new Date().toISOString();
        // reward points
        const rewards = navaStore.getRewards();
        const points = Math.round(order.total * 0.1);
        navaStore.setRewards({ points: rewards.points + points, redeemed: rewards.redeemed });
      }
    }
    navaStore.setOrders(orders);
  },

  quoteCoupon: async (code: string, subtotal: number) => {
    await delay();
    const coupon = COUPONS.find((c) => c.code === code);
    if (!coupon || subtotal < coupon.minOrder) {
      return { discount: 0, coupon_id: null, message: "Invalid coupon code" };
    }
    const discount =
      coupon.type === "percent"
        ? Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount)
        : Math.min(coupon.value, subtotal);
    return { discount, coupon_id: coupon.code, message: "Coupon applied" };
  },

  // --- Wallet ---
  wallet: async (): Promise<{ balance: number; transactions: WalletTransaction[] }> => {
    await delay();
    return navaStore.getWallet();
  },

  topUpWallet: async (amount: number) => {
    await delay();
    const wallet = navaStore.getWallet();
    const after = wallet.balance + amount;
    navaStore.setWallet({
      balance: after,
      transactions: [
        {
          id: uuid(),
          type: "CREDIT" as WalletTxnType,
          amount,
          balance_after: after,
          label: "Wallet top-up",
          created_at: new Date().toISOString(),
        },
        ...wallet.transactions,
      ],
    });
  },

  // --- Notifications ---
  notifications: async (): Promise<AppNotification[]> => {
    await delay();
    return navaStore.getNotifications();
  },

  markAllRead: async () => {
    await delay();
    const notifications = navaStore.getNotifications().map((n) => ({ ...n, is_read: true }));
    navaStore.setNotifications(notifications);
  },

  // --- Favourites ---
  favourites: async (): Promise<string[]> => {
    await delay();
    return navaStore.getFavourites();
  },

  toggleFavourite: async (storeId: string, on: boolean) => {
    await delay();
    const ids = navaStore.getFavourites();
    const next = on ? Array.from(new Set([...ids, storeId])) : ids.filter((id) => id !== storeId);
    navaStore.setFavourites(next);
  },

  // --- Profile ---
  profile: async (): Promise<Profile | null> => {
    await delay();
    return navaStore.getSession().user;
  },

  updateProfile: async (patch: Partial<Profile>) => {
    await delay();
    const session = navaStore.getSession();
    if (!session.user) throw new Error("AUTH_REQUIRED");
    const next = { ...session.user, ...patch };
    navaStore.setSession(next, session.token);
  },

  // --- Auth ---
  signIn: async (email: string, password: string): Promise<Profile> => {
    await delay(400);
    const session = navaStore.getSession();
    if (!session.user) {
      // create a mock user on first sign-in
      const user: Profile = {
        id: uuid(),
        full_name: email.split("@")[0] ?? "User",
        phone: "+91 98765 00000",
        email,
        avatar_url: null,
        referral_code: "NAVA" + Math.floor(1000 + Math.random() * 9000).toString(),
      };
      navaStore.setSession(user, "mock-token");
      return user;
    }
    return session.user;
  },

  signUp: async (email: string, password: string, name: string): Promise<Profile> => {
    await delay(400);
    const user: Profile = {
      id: uuid(),
      full_name: name,
      phone: "+91 98765 00000",
      email,
      avatar_url: null,
      referral_code: "NAVA" + Math.floor(1000 + Math.random() * 9000).toString(),
    };
    navaStore.setSession(user, "mock-token");
    return user;
  },

  signOut: async () => {
    await delay();
    navaStore.setSession(null, null);
  },

  googleSignIn: async () => {
    await delay(600);
    const user: Profile = {
      id: uuid(),
      full_name: "Google User",
      phone: "+91 98765 00000",
      email: "user@gmail.com",
      avatar_url: null,
      referral_code: "NAVA" + Math.floor(1000 + Math.random() * 9000).toString(),
    };
    navaStore.setSession(user, "mock-token");
    return user;
  },

  // --- Service data ---
  rideTypes: () => RIDE_TYPES,
  places: () => PLACES,
  packageTypes: () => PACKAGE_TYPES,
  courierSpeeds: () => COURIER_SPEEDS,
  homeServices: () => HOME_SERVICES,
  providers: () => PROVIDERS,
  drivers: () => DRIVERS,
  faqs: () => FAQS,
};

export function friendlyError(message: string) {
  if (message.includes("CART_EMPTY")) return "Your cart is empty.";
  if (message.includes("MULTI_STORE_CART")) return "Items from multiple stores need separate orders.";
  if (message.includes("OUT_OF_STOCK")) return `Out of stock: ${message.split(":").pop()}`;
  if (message.includes("MIN_ORDER_NOT_MET")) return "Order value is below the store minimum.";
  if (message.includes("INSUFFICIENT_WALLET_BALANCE")) return "Not enough wallet balance.";
  if (message.includes("COUPON_INVALID")) return message.split(":").pop() ?? "Coupon not valid.";
  if (message.includes("STORE_CLOSED")) return "This store is currently closed.";
  if (message.includes("CANCEL_NOT_ALLOWED")) return "This order can no longer be cancelled.";
  if (message.includes("INVALID_ADDRESS")) return "Please select a valid delivery address.";
  if (message.includes("AUTH_REQUIRED")) return "Please sign in to continue.";
  return message;
}
