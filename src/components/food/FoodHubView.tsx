import { useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCpu,
  FiFilter,
  FiHeart,
  FiHelpCircle,
  FiInfo,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiShield,
  FiStar,
  FiTag,
  FiTruck,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import { currency } from "@/utils/format";
import { ServiceCategorySwitcher } from "@/components/common/ServiceCategorySwitcher";
import { navaStore } from "@/lib/navaStore";
import {
  BHIMAVARAM_CATEGORIES,
  BHIMAVARAM_RESTAURANTS,
  MOOD_OPTIONS,
  ALL_BHIMAVARAM_DISHES,
  type FoodDish,
  type FoodRestaurant,
} from "./bhimavaramFoodData";

import { DishCustomizerModal } from "./DishCustomizerModal";
import { AIFoodAssistantModal } from "./AIFoodAssistantModal";
import { RestaurantDetailModal } from "./RestaurantDetailModal";
import { SurpriseMeModal } from "./SurpriseMeModal";
import { PartyPlannerModal } from "./PartyPlannerModal";
import { GroupOrderModal } from "./GroupOrderModal";
import { ScheduleOrderModal } from "./ScheduleOrderModal";
import { HealthModeModal } from "./HealthModeModal";
import { SmartFoodCartDrawer, type FoodCartItem } from "./SmartFoodCartDrawer";
import { LiveFoodTrackingModal } from "./LiveFoodTrackingModal";
import { FoodSupportModal } from "./FoodSupportModal";

export function FoodHubView() {
  const navigate = useNavigate();
  const activeLocation = navaStore.getActiveLocation() || "Narasa Agraharam, Bhimavaram";

  // Navigation & Language State
  const [language, setLanguage] = useState<"en" | "te">("en");

  // Search & Filters State
  const [universalSearch, setUniversalSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeMood, setActiveMood] = useState<string>("all");
  const [smartFilters, setSmartFilters] = useState({
    under200: false,
    pureVeg: false,
    nonVeg: false,
    spicy: false,
    topRated: false,
    fastDelivery: false,
  });

  // Modal Open States
  const [customizerDish, setCustomizerDish] = useState<FoodDish | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<FoodRestaurant | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isGroupOrderOpen, setIsGroupOrderOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState<FoodCartItem[]>([
    {
      id: "init-1",
      dish: ALL_BHIMAVARAM_DISHES[0]!,
      qty: 1,
      spice: "Medium",
      portion: "Regular",
      addOns: ["Extra Raita"],
      notes: "Less spicy salan please",
    },
  ]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.qty, 0);

  // Filter Restaurants & Dishes dynamically
  const filteredRestaurants = useMemo(() => {
    return BHIMAVARAM_RESTAURANTS.filter((rest) => {
      // Smart filters
      if (smartFilters.pureVeg && !rest.pureVeg) return false;
      if (smartFilters.topRated && rest.rating < 4.8) return false;
      if (smartFilters.fastDelivery && rest.deliveryMins > 20) return false;

      // Category filter
      if (activeCategory !== "all") {
        const hasCategoryDish = rest.dishes.some((d) => d.category === activeCategory);
        if (!hasCategoryDish) return false;
      }

      // Mood filter
      if (activeMood !== "all") {
        if (activeMood === "spicy" && !rest.cuisines.some((c) => c.toLowerCase().includes("andhra") || c.toLowerCase().includes("biryani"))) return false;
        if (activeMood === "comfort" && !rest.veg) return false;
        if (activeMood === "fast" && rest.deliveryMins > 18) return false;
        if (activeMood === "budget" && rest.priceRange !== "₹") return false;
      }

      // Universal search
      if (universalSearch.trim()) {
        const q = universalSearch.toLowerCase();
        const matchesName = rest.name.toLowerCase().includes(q) || rest.teluguName.includes(q);
        const matchesCuisine = rest.cuisines.some((c) => c.toLowerCase().includes(q));
        const matchesDish = rest.dishes.some((d) => d.name.toLowerCase().includes(q) || d.teluguName.includes(q));
        return matchesName || matchesCuisine || matchesDish;
      }

      return true;
    });
  }, [activeCategory, activeMood, smartFilters, universalSearch]);

  const handleAddToCart = (
    dish: FoodDish,
    qty: number,
    customizedOptions: { spice: string; portion: string; addOns: string[]; notes: string }
  ) => {
    const newItem: FoodCartItem = {
      id: `${dish.id}-${Date.now()}`,
      dish,
      qty,
      spice: customizedOptions.spice,
      portion: customizedOptions.portion,
      addOns: customizedOptions.addOns,
      notes: customizedOptions.notes,
    };
    setCartItems((prev) => [...prev, newItem]);
  };

  const handleUpdateQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, qty: newQty } : item))
      );
    }
  };

  const handleOrderPartyPack = (items: { dish: FoodDish; qty: number }[]) => {
    const newItems: FoodCartItem[] = items.map((i) => ({
      id: `${i.dish.id}-party-${Date.now()}`,
      dish: i.dish,
      qty: i.qty,
      spice: "Medium",
      portion: "Party Size",
      addOns: [],
      notes: "Party Pack Order",
    }));
    setCartItems((prev) => [...prev, ...newItems]);
    setIsCartOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8 text-slate-900 dark:text-white select-none">
      {/* 1. TOP SERVICE CATEGORY SWITCHER */}
      <ServiceCategorySwitcher activeService="food" />

      {/* 2. LOCALIZED FOOD HEADER WITH LOCATION & LANGUAGE SWITCHER */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {language === "en" ? "DELIVERING TO" : "డెలివరీ చిరునామా"}
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ● {language === "en" ? "Bhimavaram Hub" : "భీమవరం"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FiMapPin className="size-4 text-emerald-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-sm">
              📍 {activeLocation}
            </h2>
          </div>
        </div>

        {/* TOP QUICK ACTION TOOLS */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* LANGUAGE TOGGLE */}
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "te" : "en")}
            className="px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs font-black hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {language === "en" ? "🌐 తెలుగు" : "🌐 English"}
          </button>

          {/* LIVE TRACKING BADGE */}
          <button
            type="button"
            onClick={() => setIsLiveTrackingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-xs font-black text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Track Order (8:12 PM)</span>
          </button>
        </div>
      </header>

      {/* 3. UNIVERSAL FOOD SEARCH WITH NATURAL LANGUAGE ASSISTANT */}
      <section className="space-y-3">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 size-5 text-slate-400" />
          <input
            type="text"
            value={universalSearch}
            onChange={(e) => setUniversalSearch(e.target.value)}
            placeholder={
              language === "en"
                ? "🔍 What are you craving in Bhimavaram? (e.g. Chicken Biryani, Ghee Dosa, Prawns Fry, Under ₹200)"
                : "🔍 మీరు ఏమి తినాలనుకుంటున్నారు? (చికెన్ బిర్యానీ, నెయ్యి కారం దోశ, రొయ్యల వేపుడు)"
            }
            className="w-full h-14 pl-12 pr-32 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-xl dark:shadow-none transition-all placeholder:text-slate-400"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {universalSearch && (
              <button
                type="button"
                onClick={() => setUniversalSearch("")}
                className="size-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold mr-1 cursor-pointer"
              >
                ✕
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAIOpen(true)}
              className="h-10 px-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
            >
              <FiZap className="size-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </div>

        {/* INSTANT NATURAL LANGUAGE QUERY CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Popular:</span>
          {[
            "Chicken Biryani",
            "Ghee Karam Dosa",
            "Bhimavaram Prawns Fry",
            "Food Under ₹200",
            "High Protein",
            "Godavari Sweets",
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setUniversalSearch(tag)}
              className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 4. QUICK FOOD CATEGORIES (HORIZONTAL CARDS WITH HIGH-RES IMAGES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {language === "en" ? "Explore Bhimavaram Cuisines" : "భీమవరం రుచులు"}
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {BHIMAVARAM_CATEGORIES.length} Categories
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {BHIMAVARAM_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(isSelected ? "all" : cat.id)}
                className={`flex flex-col items-center p-2.5 rounded-3xl border transition-all cursor-pointer shrink-0 w-24 sm:w-28 group ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-md ring-2 ring-emerald-500/30"
                    : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-emerald-500/50"
                }`}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="size-14 sm:size-16 rounded-2xl object-cover shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-black text-slate-900 dark:text-white mt-2 text-center line-clamp-1">
                  {language === "en" ? cat.name : cat.teluguName}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. MOOD / INTENT DISCOVERY CHIPS */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-xl dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {language === "en" ? "What are you in the mood for?" : "ఈరోజు మీ మూడ్ ఏమిటి?"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Tap any mood to dynamically adjust food recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = activeMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setActiveMood(isSelected ? "all" : mood.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. SPECIAL FEATURE TOOLS GRID (Surprise Me, Party, Group, Schedule, Health, Support) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { id: "surprise", label: "✨ Surprise Me", desc: "AI pick", color: "from-amber-500 to-orange-600", onClick: () => setIsSurpriseOpen(true) },
          { id: "party", label: "🎉 Party Planner", desc: "Bulk meals", color: "from-purple-600 to-indigo-600", onClick: () => setIsPartyOpen(true) },
          { id: "group", label: "👥 Group Order", desc: "Split basket", color: "from-blue-600 to-cyan-600", onClick: () => setIsGroupOrderOpen(true) },
          { id: "schedule", label: "⏰ Schedule", desc: "Future meals", color: "from-emerald-600 to-teal-600", onClick: () => setIsScheduleOpen(true) },
          { id: "health", label: "🥗 Eat Better", desc: "High protein", color: "from-teal-600 to-emerald-700", onClick: () => setIsHealthOpen(true) },
          { id: "support", label: "🎧 24/7 Support", desc: "Local help", color: "from-slate-800 to-slate-900", onClick: () => setIsSupportOpen(true) },
        ].map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={tool.onClick}
            className="p-3.5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-lg transition-all text-left space-y-1 cursor-pointer group"
          >
            <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {tool.label}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{tool.desc}</div>
          </button>
        ))}
      </section>

      {/* 7. SMART CONTEXTUAL FILTERS */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Filters:</span>
        <button
          type="button"
          onClick={() => setSmartFilters({ ...smartFilters, under200: !smartFilters.under200 })}
          className={`px-3 py-1.5 rounded-full border font-bold transition-all cursor-pointer ${
            smartFilters.under200
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          Under ₹200
        </button>

        <button
          type="button"
          onClick={() => setSmartFilters({ ...smartFilters, pureVeg: !smartFilters.pureVeg })}
          className={`px-3 py-1.5 rounded-full border font-bold transition-all cursor-pointer ${
            smartFilters.pureVeg
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          Pure Veg 🟢
        </button>

        <button
          type="button"
          onClick={() => setSmartFilters({ ...smartFilters, topRated: !smartFilters.topRated })}
          className={`px-3 py-1.5 rounded-full border font-bold transition-all cursor-pointer ${
            smartFilters.topRated
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          4.8+ Rated ⭐
        </button>

        <button
          type="button"
          onClick={() => setSmartFilters({ ...smartFilters, fastDelivery: !smartFilters.fastDelivery })}
          className={`px-3 py-1.5 rounded-full border font-bold transition-all cursor-pointer ${
            smartFilters.fastDelivery
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          Fast Delivery ⚡ (&lt;20m)
        </button>
      </section>

      {/* 8. RESTAURANTS & DISHES DISCOVERY LIST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {language === "en" ? "Bhimavaram Food Picks & Restaurants" : "భీమవరం రెస్టారెంట్లు"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Authentic local favorites, zero surge pricing, verified hygiene standards.
            </p>
          </div>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {filteredRestaurants.length} Kitchens Open
          </span>
        </div>

        {/* RESTAURANT CARDS GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredRestaurants.map((rest) => (
            <motion.div
              key={rest.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-xl dark:shadow-none hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* RESTAURANT BANNER */}
                <div
                  onClick={() => setSelectedRestaurant(rest)}
                  className="relative h-44 w-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={rest.banner}
                    alt={rest.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* PROMO OFFER BADGE */}
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <FiTag className="size-3" />
                    <span>{rest.offer}</span>
                  </div>

                  {/* ETA BADGE */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-black px-3 py-1 rounded-xl">
                    ⏱️ {rest.deliveryMins} mins · {rest.distanceKm} km
                  </div>
                </div>

                {/* RESTAURANT CONTENT */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          onClick={() => setSelectedRestaurant(rest)}
                          className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight hover:text-emerald-600 cursor-pointer"
                        >
                          {rest.name}
                        </h3>
                        {rest.veg && (
                          <span className="size-3 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                        {rest.cuisines.join(" • ")} · 📍 {rest.area}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-black text-amber-700 dark:text-amber-300">
                        <FiStar className="fill-amber-500 text-amber-500 size-3" /> {rest.rating}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-bold mt-0.5">
                        {rest.ratingCount}+ ratings
                      </span>
                    </div>
                  </div>

                  {/* WHY WE RECOMMEND THIS (INTELLIGENCE LAYER) */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 space-y-1 text-xs">
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
                      Why we recommend this:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                      ✓ {rest.recommendationReason[0]}
                    </p>
                  </div>

                  {/* POPULAR DISHES MINI CAROUSEL */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block">
                      Popular Dishes
                    </span>
                    <div className="space-y-2">
                      {rest.dishes.slice(0, 2).map((dish) => (
                        <div
                          key={dish.id}
                          className="flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 text-xs font-bold"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span
                              className={`size-2 rounded-full ${
                                dish.veg ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            <span className="text-slate-900 dark:text-white truncate">
                              {dish.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-black text-slate-900 dark:text-white">
                              {currency(dish.price)}
                            </span>
                            <button
                              type="button"
                              onClick={() => setCustomizerDish(dish)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-2xs cursor-pointer"
                            >
                              + ADD
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* VIEW FULL MENU BUTTON */}
              <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={() => setSelectedRestaurant(rest)}
                  className="w-full h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-black text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Explore Full Menu ({rest.dishes.length} items)</span>
                  <FiArrowRight className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. FLOATING BOTTOM CART BAR (ZOMATO / SWIGGY STYLE) */}
      <AnimatePresence>
        {totalCartCount > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40"
          >
            <div
              onClick={() => setIsCartOpen(true)}
              className="p-4 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-600/40 flex items-center justify-between cursor-pointer transform hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-white/20 font-black text-sm">
                  {totalCartCount}
                </span>
                <div>
                  <span className="block text-xs font-bold opacity-90 uppercase tracking-wider">
                    {totalCartCount} Item{totalCartCount > 1 ? "s" : ""} Added
                  </span>
                  <span className="text-base font-black">{currency(cartSubtotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-black text-sm">
                <span>View Cart & Checkout</span>
                <FiArrowRight className="size-4.5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALL CONNECTED MODALS */}
      <DishCustomizerModal
        dish={customizerDish}
        isOpen={Boolean(customizerDish)}
        onClose={() => setCustomizerDish(null)}
        onAddToCart={handleAddToCart}
      />

      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        isOpen={Boolean(selectedRestaurant)}
        onClose={() => setSelectedRestaurant(null)}
        onSelectDish={(dish) => setCustomizerDish(dish)}
      />

      <AIFoodAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onSelectDish={(dish) => setCustomizerDish(dish)}
        onOpenRestaurant={(restId) => {
          const rest = BHIMAVARAM_RESTAURANTS.find((r) => r.id === restId);
          if (rest) setSelectedRestaurant(rest);
        }}
      />

      <SurpriseMeModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        onOrderDish={(dish) => setCustomizerDish(dish)}
      />

      <PartyPlannerModal
        isOpen={isPartyOpen}
        onClose={() => setIsPartyOpen(false)}
        onOrderPartyPack={handleOrderPartyPack}
      />

      <GroupOrderModal
        isOpen={isGroupOrderOpen}
        onClose={() => setIsGroupOrderOpen(false)}
      />

      <ScheduleOrderModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onConfirmSchedule={(slot) => {
          toast.success(`Delivery scheduled for ${slot}`);
        }}
      />

      <HealthModeModal
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
        onSelectDish={(dish) => setCustomizerDish(dish)}
      />

      <SmartFoodCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onCheckout={() => {
          setIsLiveTrackingOpen(true);
        }}
      />

      <LiveFoodTrackingModal
        isOpen={isLiveTrackingOpen}
        onClose={() => setIsLiveTrackingOpen(false)}
      />

      <FoodSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
