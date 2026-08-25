export interface FoodDish {
  id: string;
  name: string;
  teluguName: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  originalPrice: number;
  rating: number;
  ratingCount: number;
  reorderRate: number; // e.g. 92%
  image: string;
  description: string;
  cuisine: string;
  category: "biryani" | "south-indian" | "andhra-special" | "tiffins" | "starters" | "meals" | "desserts" | "fast-food" | "beverages" | "healthy";
  veg: boolean;
  spicyLevel: "Mild" | "Medium" | "Spicy" | "Extra Spicy";
  serves: string; // e.g. "Serves 1", "Serves 2-3"
  prepTimeMin: number;
  calories?: number;
  proteinGrams?: number;
  isBestseller?: boolean;
  isTrending?: boolean;
  isLocalSpecialty?: boolean;
  trustScores: {
    taste: number; // 1-5
    portion: number;
    packaging: number;
    value: number;
  };
  customizationOptions: {
    spiceLevels?: string[];
    portionSizes?: { label: string; priceDelta: number }[];
    addOns?: { name: string; price: number }[];
  };
}

export interface FoodRestaurant {
  id: string;
  slug: string;
  name: string;
  teluguName: string;
  logo: string;
  banner: string;
  rating: number;
  ratingCount: number;
  cuisines: string[];
  area: string; // e.g. "Prakasam Chowk, Bhimavaram"
  distanceKm: number;
  deliveryMins: number;
  priceRange: "₹" | "₹₹" | "₹₹₹";
  offer: string;
  bestSellerDish: string;
  veg: boolean;
  pureVeg?: boolean;
  isTrending?: boolean;
  isLocalGem?: boolean;
  isFastDelivery?: boolean;
  isNew?: boolean;
  recommendationReason: string[];
  aiReviewSummary: {
    highlights: string[];
    watchOuts: string[];
  };
  dishes: FoodDish[];
}

export const BHIMAVARAM_CATEGORIES = [
  { id: "all", name: "All", teluguName: "అన్నీ", icon: "✨", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" },
  { id: "biryani", name: "Biryani", teluguName: "బిర్యానీ", icon: "🍛", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80" },
  { id: "andhra-special", name: "Andhra Ruchulu", teluguName: "ఆంధ్ర రుచులు", icon: "🌶️", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&q=80" },
  { id: "tiffins", name: "Tiffins & Dosas", teluguName: "టిఫిన్స్", icon: "🥞", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80" },
  { id: "starters", name: "Starters & Kebabs", teluguName: "స్టార్టర్స్", icon: "🍗", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80" },
  { id: "meals", name: "Godavari Thalis", teluguName: "భోజనం", icon: "🍱", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80" },
  { id: "desserts", name: "Godavari Sweets", teluguName: "మిఠాయిలు", icon: "🍮", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80" },
  { id: "fast-food", name: "Pizza & Burgers", teluguName: "పిజ్జా & బర్గర్స్", icon: "🍕", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80" },
  { id: "chinese", name: "Chinese & Noodles", teluguName: "చైనీస్", icon: "🥡", img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=300&q=80" },
  { id: "healthy", name: "Healthy & Salads", teluguName: "ఆరోగ్యకరమైన ఆహారం", icon: "🥗", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" },
  { id: "beverages", name: "Chai & Shakes", teluguName: "టీ & షేక్స్", icon: "🥤", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80" },
];

export const MOOD_OPTIONS = [
  { id: "all", label: "All Moods", emoji: "✨", desc: "Discover all dishes" },
  { id: "hungry", label: "Hungry", emoji: "😋", desc: "Filling biryanis & rich meals" },
  { id: "spicy", label: "Something Spicy", emoji: "🌶️", desc: "Fiery Andhra gravies & fry" },
  { id: "comfort", label: "Comfort Food", emoji: "❤️", desc: "Warm ghee dosas & curd rice" },
  { id: "healthy", label: "Light & Healthy", emoji: "🥗", desc: "High protein, low calorie" },
  { id: "treat", label: "Treat Myself", emoji: "🍰", desc: "Decadent cakes & sweets" },
  { id: "family", label: "Family Dinner", emoji: "👨‍👩‍👧", desc: "Jumbo packs & thali combos" },
  { id: "party", label: "Party Mode", emoji: "🎉", desc: "Mandi platters & starters" },
  { id: "budget", label: "Under Budget", emoji: "💰", desc: "Best value under ₹180" },
  { id: "fast", label: "Fast Delivery", emoji: "⚡", desc: "Under 20 min arrivals" },
];

export const BHIMAVARAM_RESTAURANTS: FoodRestaurant[] = [
  {
    id: "rest-1",
    slug: "sri-sai-biryani-bhimavaram",
    name: "Sri Sai Biryani & Family Restaurant",
    teluguName: "శ్రీ సాయి బిర్యానీ",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    ratingCount: 2450,
    cuisines: ["Bhimavaram Biryani", "Andhra", "Mughlai"],
    area: "Prakasam Chowk, Bhimavaram",
    distanceKm: 1.8,
    deliveryMins: 22,
    priceRange: "₹₹",
    offer: "Flat ₹50 OFF on orders above ₹249",
    bestSellerDish: "Special Pot Chicken Biryani",
    veg: false,
    isTrending: true,
    isLocalGem: true,
    recommendationReason: [
      "Top-rated Biryani in Bhimavaram (4.8★)",
      "94% reorder rate from Narasa Agraharam",
      "Authentic Godavari spices & firewood cooked",
      "Fast 22 min door-to-door delivery",
    ],
    aiReviewSummary: {
      highlights: ["Fragrant basmati rice & tender meat", "Generous portion size", "Piping hot sealed packaging"],
      watchOuts: ["Avakaya Biryani is intensely spicy — select mild if preferred"],
    },
    dishes: [
      {
        id: "d-1",
        name: "Special Pot Chicken Dum Biryani",
        teluguName: "పాట్ చికెన్ దమ్ బిర్యానీ",
        restaurantId: "rest-1",
        restaurantName: "Sri Sai Biryani",
        price: 249,
        originalPrice: 299,
        rating: 4.9,
        ratingCount: 1420,
        reorderRate: 95,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        description: "Signature Bhimavaram style pot dum biryani with long grain basmati rice, tender spiced chicken, egg and mirchi ka salan.",
        cuisine: "Andhra Biryani",
        category: "biryani",
        veg: false,
        spicyLevel: "Medium",
        serves: "Serves 1-2",
        prepTimeMin: 18,
        calories: 620,
        proteinGrams: 34,
        isBestseller: true,
        isTrending: true,
        trustScores: { taste: 5.0, portion: 4.9, packaging: 4.9, value: 5.0 },
        customizationOptions: {
          spiceLevels: ["Mild", "Medium Spicy", "Authentic Andhra Spicy"],
          portionSizes: [
            { label: "Regular (Serves 1)", priceDelta: 0 },
            { label: "Jumbo Family Pack (Serves 3-4)", priceDelta: 280 },
          ],
          addOns: [
            { name: "Extra Boiled Egg (1 pc)", price: 15 },
            { name: "Extra Mirchi Ka Salan", price: 25 },
            { name: "Special Onion Raita (200ml)", price: 20 },
            { name: "Chicken 65 Side (4 pcs)", price: 99 },
          ],
        },
      },
      {
        id: "d-2",
        name: "Bhimavaram Avakaya Chicken Biryani",
        teluguName: "ఆవకాయ చికెన్ బిర్యానీ",
        restaurantId: "rest-1",
        restaurantName: "Sri Sai Biryani",
        price: 269,
        originalPrice: 320,
        rating: 4.8,
        ratingCount: 890,
        reorderRate: 91,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
        description: "Tangy, spicy mango pickle infused rice layers with juicy chicken pieces. A true West Godavari delicacy.",
        cuisine: "Andhra Special",
        category: "biryani",
        veg: false,
        spicyLevel: "Spicy",
        serves: "Serves 1-2",
        prepTimeMin: 20,
        calories: 650,
        proteinGrams: 32,
        isLocalSpecialty: true,
        trustScores: { taste: 4.9, portion: 4.8, packaging: 4.9, value: 4.8 },
        customizationOptions: {
          spiceLevels: ["Medium Spicy", "Extra Fiery"],
          addOns: [
            { name: "Extra Raita", price: 20 },
            { name: "Double Chicken Pieces", price: 90 },
          ],
        },
      },
      {
        id: "d-3",
        name: "Gongura Mutton Dum Biryani",
        teluguName: "గోంగూర మటన్ బిర్యానీ",
        restaurantId: "rest-1",
        restaurantName: "Sri Sai Biryani",
        price: 349,
        originalPrice: 399,
        rating: 4.9,
        ratingCount: 780,
        reorderRate: 93,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        description: "Tender local mutton chunks marinated in sorrel leaves (Gongura) and slow dum cooked to perfection.",
        cuisine: "Andhra Special",
        category: "biryani",
        veg: false,
        spicyLevel: "Spicy",
        serves: "Serves 1-2",
        prepTimeMin: 22,
        calories: 710,
        proteinGrams: 42,
        isBestseller: true,
        trustScores: { taste: 5.0, portion: 4.8, packaging: 4.9, value: 4.9 },
        customizationOptions: {
          addOns: [
            { name: "Extra Mutton Pieces", price: 120 },
            { name: "Extra Gongura Gravy", price: 35 },
          ],
        },
      },
      {
        id: "d-4",
        name: "Crispy Bhimavaram Chicken Pakoda",
        teluguName: "చికెన్ పకోడా",
        restaurantId: "rest-1",
        restaurantName: "Sri Sai Biryani",
        price: 189,
        originalPrice: 220,
        rating: 4.7,
        ratingCount: 650,
        reorderRate: 88,
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        description: "Bone-in chicken marinated with ginger garlic and crunchy gram flour, deep fried with curry leaves and green chillies.",
        cuisine: "Starters",
        category: "starters",
        veg: false,
        spicyLevel: "Spicy",
        serves: "Serves 2",
        prepTimeMin: 15,
        calories: 420,
        proteinGrams: 28,
        trustScores: { taste: 4.8, portion: 4.7, packaging: 4.8, value: 4.9 },
        customizationOptions: {
          addOns: [{ name: "Extra Fried Onions & Lemon", price: 15 }],
        },
      },
    ],
  },
  {
    id: "rest-2",
    slug: "annapurna-tiffins-bhimavaram",
    name: "Annapurna Tiffins & Filter Coffee",
    teluguName: "అన్నపూర్ణ టిఫిన్స్",
    logo: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    ratingCount: 3100,
    cuisines: ["South Indian Tiffins", "Dosas", "Filter Coffee"],
    area: "Station Road, Bhimavaram",
    distanceKm: 1.2,
    deliveryMins: 16,
    priceRange: "₹",
    offer: "20% OFF on all morning breakfast combos",
    bestSellerDish: "Ghee Karam Dosa with Allam Pachadi",
    veg: true,
    pureVeg: true,
    isFastDelivery: true,
    isLocalGem: true,
    recommendationReason: [
      "Bhimavaram's #1 Morning Tiffin Center",
      "Pure Desi Ghee & Fresh Ground Chutneys",
      "Fast 16 min express breakfast delivery",
      "Pocket friendly (Average meal ₹90)",
    ],
    aiReviewSummary: {
      highlights: ["Crispy dosas with dripping pure ghee", "Ginger (Allam) pachadi is unmatched", "Ultra fast delivery"],
      watchOuts: ["High morning rush between 7:30 - 9:30 AM"],
    },
    dishes: [
      {
        id: "d-5",
        name: "Ghee Karam Dosa with Allam Pachadi",
        teluguName: "నెయ్యి కారం దోశ",
        restaurantId: "rest-2",
        restaurantName: "Annapurna Tiffins",
        price: 85,
        originalPrice: 100,
        rating: 4.9,
        ratingCount: 2100,
        reorderRate: 96,
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
        description: "Golden crispy thin crepe smeared with spicy red chilli garlic chutney and loaded with pure buffalo ghee. Served with 3 chutneys & sambar.",
        cuisine: "South Indian",
        category: "tiffins",
        veg: true,
        spicyLevel: "Medium",
        serves: "Serves 1",
        prepTimeMin: 12,
        calories: 340,
        proteinGrams: 8,
        isBestseller: true,
        trustScores: { taste: 5.0, portion: 4.9, packaging: 4.9, value: 5.0 },
        customizationOptions: {
          addOns: [
            { name: "Extra Ghee Bowl", price: 20 },
            { name: "Extra Allam Chutney (100ml)", price: 15 },
            { name: "Hot Sambar Bowl", price: 15 },
          ],
        },
      },
      {
        id: "d-6",
        name: "Godavari Pesarattu Upma Combo",
        teluguName: "పెసరట్టు ఉప్మా",
        restaurantId: "rest-2",
        restaurantName: "Annapurna Tiffins",
        price: 95,
        originalPrice: 110,
        rating: 4.8,
        ratingCount: 1650,
        reorderRate: 92,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        description: "Whole green gram dosa stuffed with ghee seasoned sooji upma, topped with roasted cashews, ginger & onions.",
        cuisine: "South Indian",
        category: "tiffins",
        veg: true,
        spicyLevel: "Mild",
        serves: "Serves 1",
        prepTimeMin: 14,
        calories: 380,
        proteinGrams: 14,
        isLocalSpecialty: true,
        trustScores: { taste: 4.9, portion: 5.0, packaging: 4.8, value: 5.0 },
        customizationOptions: {
          addOns: [{ name: "Extra Ghee Topping", price: 15 }],
        },
      },
      {
        id: "d-7",
        name: "Babai Ghee Podi Idli (4 pcs)",
        teluguName: "బాబాయ్ నెయ్యి పొడి ఇడ్లీ",
        restaurantId: "rest-2",
        restaurantName: "Annapurna Tiffins",
        price: 70,
        originalPrice: 85,
        rating: 4.8,
        ratingCount: 1200,
        reorderRate: 94,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        description: "Melt-in-mouth steaming hot idlis smothered in fragrant gunpowder (podi) and pure ghee.",
        cuisine: "South Indian",
        category: "tiffins",
        veg: true,
        spicyLevel: "Medium",
        serves: "Serves 1",
        prepTimeMin: 10,
        calories: 290,
        proteinGrams: 9,
        trustScores: { taste: 4.9, portion: 4.8, packaging: 4.9, value: 4.9 },
        customizationOptions: {
          addOns: [{ name: "Extra Podi & Ghee", price: 20 }],
        },
      },
    ],
  },
  {
    id: "rest-3",
    slug: "mavullamma-godavari-ruchulu",
    name: "Mavullamma Godavari Ruchulu",
    teluguName: "మావుళ్ళమ్మ గోదావరి రుచులు",
    logo: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    ratingCount: 1850,
    cuisines: ["Godavari Seafood", "Bhimavaram Prawns", "Andhra Meals"],
    area: "Mavullamma Temple Road, Bhimavaram",
    distanceKm: 2.4,
    deliveryMins: 25,
    priceRange: "₹₹",
    offer: "Free Fish Pulusu Gravy with every Sea Food combo",
    bestSellerDish: "Bhimavaram Royyala Vepudu (Prawns Fry)",
    veg: false,
    isTrending: true,
    isLocalGem: true,
    recommendationReason: [
      "World-famous Bhimavaram fresh-catch prawns & fish",
      "Authentic home-style wood fired cooking",
      "Highest rating in coastal Andhra (4.9★)",
    ],
    aiReviewSummary: {
      highlights: ["Fresh juicy prawns with crunchy onions", "Traditional thick tamarind pulusu", "Generous seafood portions"],
      watchOuts: ["Rich & spicy — perfect with hot steamed rice"],
    },
    dishes: [
      {
        id: "d-8",
        name: "Bhimavaram Special Royyala Vepudu (Prawns Fry)",
        teluguName: "భీమవరం రొయ్యల వేపుడు",
        restaurantId: "rest-3",
        restaurantName: "Mavullamma Godavari Ruchulu",
        price: 299,
        originalPrice: 350,
        rating: 5.0,
        ratingCount: 1540,
        reorderRate: 98,
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
        description: "Fresh Godavari river prawns sauteed with hand-ground spices, caramelized onions, curry leaves and green chillies. World famous Bhimavaram specialty.",
        cuisine: "Seafood",
        category: "andhra-special",
        veg: false,
        spicyLevel: "Spicy",
        serves: "Serves 2",
        prepTimeMin: 20,
        calories: 380,
        proteinGrams: 36,
        isBestseller: true,
        isLocalSpecialty: true,
        trustScores: { taste: 5.0, portion: 5.0, packaging: 4.9, value: 4.9 },
        customizationOptions: {
          spiceLevels: ["Medium Spicy", "Traditional Godavari Spicy"],
          addOns: [
            { name: "Steamed Sona Masoori Rice Bowl", price: 40 },
            { name: "Pappu Charu Side Bowl", price: 30 },
          ],
        },
      },
      {
        id: "d-9",
        name: "Traditional Godavari Chepala Pulusu",
        teluguName: "గోదావరి చేపల పులుసు",
        restaurantId: "rest-3",
        restaurantName: "Mavullamma Godavari Ruchulu",
        price: 279,
        originalPrice: 320,
        rating: 4.9,
        ratingCount: 920,
        reorderRate: 95,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        description: "Fresh Korrameenu (Murrel fish) simmered in tangy tamarind gravy, fenugreek, garlic and shallots. Tastes even better the next day.",
        cuisine: "Andhra Special",
        category: "andhra-special",
        veg: false,
        spicyLevel: "Spicy",
        serves: "Serves 1-2",
        prepTimeMin: 22,
        calories: 410,
        proteinGrams: 30,
        isLocalSpecialty: true,
        trustScores: { taste: 5.0, portion: 4.8, packaging: 4.9, value: 4.9 },
        customizationOptions: {
          addOns: [{ name: "Hot Ghee Rice Portion", price: 50 }],
        },
      },
    ],
  },
  {
    id: "rest-4",
    slug: "sweet-magic-bhimavaram",
    name: "Sweet Magic & Godavari Bakers",
    teluguName: "స్వీట్ మ్యాజిక్",
    logo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    ratingCount: 2200,
    cuisines: ["Godavari Sweets", "Bakery", "Desserts", "Savouries"],
    area: "P.P. Road, Bhimavaram",
    distanceKm: 1.5,
    deliveryMins: 18,
    priceRange: "₹₹",
    offer: "Buy 500g Sweets Get 100g Cashew Pakoda Free",
    bestSellerDish: "Atreyapuram Ghee Bellam Pootharekulu (5 Pcs)",
    veg: true,
    pureVeg: true,
    isLocalGem: true,
    recommendationReason: [
      "Freshly rolled authentic Atreyapuram rice paper Pootharekulu",
      "Pure ghee sweets with zero preservatives",
      "Famous across West Godavari for gift boxes",
    ],
    aiReviewSummary: {
      highlights: ["Paper-thin crispy layers stuffed with ghee & nuts", "Freshly baked pastries", "Premium packaging"],
      watchOuts: ["High demand on festive days"],
    },
    dishes: [
      {
        id: "d-10",
        name: "Atreyapuram Ghee Bellam Pootharekulu (5 Pcs)",
        teluguName: "ఆత్రేయపురం పూతరేకులు",
        restaurantId: "rest-4",
        restaurantName: "Sweet Magic & Bakers",
        price: 160,
        originalPrice: 190,
        rating: 5.0,
        ratingCount: 1800,
        reorderRate: 97,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        description: "Paper-thin edible rice starch sheets rolled with rich organic jaggery (bellam), pure country ghee, chopped cashews & pistachios.",
        cuisine: "Godavari Sweets",
        category: "desserts",
        veg: true,
        spicyLevel: "Mild",
        serves: "5 Pieces",
        prepTimeMin: 10,
        calories: 380,
        proteinGrams: 6,
        isBestseller: true,
        isLocalSpecialty: true,
        trustScores: { taste: 5.0, portion: 4.9, packaging: 5.0, value: 5.0 },
        customizationOptions: {
          portionSizes: [
            { label: "5 Pieces Pack", priceDelta: 0 },
            { label: "10 Pieces Gift Box", priceDelta: 150 },
          ],
        },
      },
      {
        id: "d-11",
        name: "Special Apricot Delight Pastry",
        teluguName: "ఆప్రికాట్ డిలైట్",
        restaurantId: "rest-4",
        restaurantName: "Sweet Magic & Bakers",
        price: 139,
        originalPrice: 160,
        rating: 4.9,
        ratingCount: 950,
        reorderRate: 94,
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        description: "Layered sponge cake soaked in stewed Turkish apricot compote, topped with custard cream and slivered almonds.",
        cuisine: "Desserts",
        category: "desserts",
        veg: true,
        spicyLevel: "Mild",
        serves: "Serves 1",
        prepTimeMin: 10,
        calories: 310,
        proteinGrams: 5,
        trustScores: { taste: 5.0, portion: 4.8, packaging: 4.9, value: 4.8 },
        customizationOptions: {
          addOns: [{ name: "Extra Custard Cream Layer", price: 30 }],
        },
      },
    ],
  },
  {
    id: "rest-5",
    slug: "grand-arya-pure-veg",
    name: "Grand Arya Pure Veg & Thalis",
    teluguName: "గ్రాండ్ ఆర్య వెజ్",
    logo: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    ratingCount: 1620,
    cuisines: ["Pure Veg", "North Indian", "South Indian Meals"],
    area: "J.P. Road, Bhimavaram",
    distanceKm: 2.1,
    deliveryMins: 20,
    priceRange: "₹₹",
    offer: "Flat 15% OFF on Family Veg Combos",
    bestSellerDish: "Grand Andhra Royal Veg Thali",
    veg: true,
    pureVeg: true,
    recommendationReason: [
      "100% Strict Pure Vegetarian Kitchen",
      "Unlimited Thali components sealed in spill-proof trays",
      "High hygiene standards with contactless packaging",
    ],
    aiReviewSummary: {
      highlights: ["Wholesome nutritious meal", "Spill-proof 9-compartment thali", "Authentic sambar & payasam"],
      watchOuts: ["Curries change daily based on fresh market produce"],
    },
    dishes: [
      {
        id: "d-12",
        name: "Grand Andhra Royal Veg Thali",
        teluguName: "రాయల్ వెజ్ భోజనం",
        restaurantId: "rest-5",
        restaurantName: "Grand Arya Pure Veg",
        price: 199,
        originalPrice: 240,
        rating: 4.9,
        ratingCount: 1400,
        reorderRate: 95,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
        description: "Complete feast: Steamed Sona Masoori Rice, Pappu with Ghee, 2 Veg Curries, Godavari Sambar, Rasam, Majjiga Pulusu, Curd, Papad, Kandi Podi & Payasam sweet.",
        cuisine: "Meals",
        category: "meals",
        veg: true,
        spicyLevel: "Medium",
        serves: "Serves 1 Hungry Adult",
        prepTimeMin: 15,
        calories: 680,
        proteinGrams: 22,
        isBestseller: true,
        trustScores: { taste: 4.9, portion: 5.0, packaging: 5.0, value: 5.0 },
        customizationOptions: {
          addOns: [
            { name: "Extra Paneer Butter Masala Cup", price: 60 },
            { name: "Extra Fresh Curd Cup", price: 20 },
            { name: "2 Butter Phulkas", price: 30 },
          ],
        },
      },
    ],
  },
  {
    id: "rest-6",
    slug: "cafe-under-the-tree",
    name: "Cafe Under The Tree & Bistro",
    teluguName: "కేఫ్ అండర్ ది ట్రీ",
    logo: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    ratingCount: 1100,
    cuisines: ["Cafe", "Pizza", "Artisan Burgers", "Cold Brews"],
    area: "DNR College Road, Bhimavaram",
    distanceKm: 2.8,
    deliveryMins: 24,
    priceRange: "₹₹",
    offer: "Free Garlic Bread on Pizza orders above ₹399",
    bestSellerDish: "Smoked Peri Peri Chicken Burger",
    veg: false,
    isNew: true,
    recommendationReason: [
      "Top hangout cafe in Bhimavaram with 100% fresh gourmet buns",
      "Wood-fired pizzas with artisanal mozzarella",
      "Popular among students and young professionals",
    ],
    aiReviewSummary: {
      highlights: ["Juicy burger patties & crisp fries", "Creamy milkshakes", "Eco-friendly box packaging"],
      watchOuts: ["Pizzas take ~22 min to bake to perfection"],
    },
    dishes: [
      {
        id: "d-13",
        name: "Smoked Peri Peri Crunchy Chicken Burger",
        teluguName: "పెరి పెరి చికెన్ బర్గర్",
        restaurantId: "rest-6",
        restaurantName: "Cafe Under The Tree",
        price: 179,
        originalPrice: 210,
        rating: 4.8,
        ratingCount: 780,
        reorderRate: 90,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        description: "Crispy fried chicken breast fillet tossed in peri peri spice, topped with melted cheddar cheese, jalapeños and chipotle garlic mayo in a brioche bun.",
        cuisine: "Burgers",
        category: "fast-food",
        veg: false,
        spicyLevel: "Medium",
        serves: "Serves 1",
        prepTimeMin: 16,
        calories: 520,
        proteinGrams: 28,
        isBestseller: true,
        trustScores: { taste: 4.8, portion: 4.7, packaging: 4.9, value: 4.7 },
        customizationOptions: {
          addOns: [
            { name: "Extra Melted Cheese Slice", price: 25 },
            { name: "Seasoned French Fries Regular", price: 69 },
            { name: "Belgium Chocolate Shake", price: 99 },
          ],
        },
      },
      {
        id: "d-14",
        name: "Farmhouse Loaded Cheese Burst Pizza (10\")",
        teluguName: "ఫార్మ్‌హౌస్ పిజ్జా",
        restaurantId: "rest-6",
        restaurantName: "Cafe Under The Tree",
        price: 299,
        originalPrice: 360,
        rating: 4.7,
        ratingCount: 620,
        reorderRate: 88,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        description: "Thin crust hand-stretched dough with San Marzano tomato sauce, mozzarella cheese burst, bell peppers, sweet corn, mushrooms, olives and basil.",
        cuisine: "Pizza",
        category: "fast-food",
        veg: true,
        spicyLevel: "Mild",
        serves: "Serves 2-3",
        prepTimeMin: 20,
        calories: 780,
        proteinGrams: 24,
        trustScores: { taste: 4.7, portion: 4.8, packaging: 4.9, value: 4.7 },
        customizationOptions: {
          addOns: [
            { name: "Extra Jalapeños & Olives", price: 30 },
            { name: "Cheesy Dip Cup", price: 25 },
          ],
        },
      },
    ],
  },
];

// Flat list of all dishes across all Bhimavaram restaurants
export const ALL_BHIMAVARAM_DISHES: FoodDish[] = BHIMAVARAM_RESTAURANTS.flatMap((r) => r.dishes);

// Quick natural language AI prompt suggestions
export const AI_FOOD_PROMPT_SUGGESTIONS = [
  "I'm hungry. Give me something spicy under ₹300 that arrives in 25 minutes.",
  "Recommend a light high-protein vegetarian lunch under ₹200.",
  "Best Godavari authentic Biryani for a family dinner tonight.",
  "Famous local dessert from Bhimavaram for a sweet craving.",
  "Crispy breakfast tiffin with filter coffee nearby.",
];
