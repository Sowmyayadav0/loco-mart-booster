import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiHeart,
  FiInfo,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiShield,
  FiStar,
  FiTag,
  FiX,
  FiZap,
} from "react-icons/fi";
import { currency } from "@/utils/format";
import type { FoodRestaurant, FoodDish } from "./bhimavaramFoodData";

interface RestaurantDetailModalProps {
  restaurant: FoodRestaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: FoodDish) => void;
}

export function RestaurantDetailModal({
  restaurant,
  isOpen,
  onClose,
  onSelectDish,
}: RestaurantDetailModalProps) {
  if (!restaurant) return null;

  const [menuSearch, setMenuSearch] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [isFav, setIsFav] = useState(false);

  // Extract unique categories from dishes
  const categories = useMemo(() => {
    const set = new Set(restaurant.dishes.map((d) => d.category));
    return ["all", ...Array.from(set)];
  }, [restaurant]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return restaurant.dishes.filter((dish) => {
      if (activeCategoryTab !== "all" && dish.category !== activeCategoryTab) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q) || dish.teluguName.includes(q);
        const matchesDesc = dish.description.toLowerCase().includes(q);
        const matchesCuisine = dish.cuisine.toLowerCase().includes(q);
        const matchesVeg = q === "veg" ? dish.veg : q === "non veg" ? !dish.veg : false;
        return matchesName || matchesDesc || matchesCuisine || matchesVeg;
      }
      return true;
    });
  }, [restaurant, activeCategoryTab, menuSearch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-3xl h-full sm:max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* IMMERSIVE RESTAURANT HEADER BANNER */}
            <div className="relative h-52 sm:h-60 w-full overflow-hidden shrink-0">
              <img
                src={restaurant.banner}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* TOP ACTION BAR */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <button
                  type="button"
                  onClick={onClose}
                  className="grid size-10 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <FiArrowLeft className="size-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFav(!isFav)}
                    className="grid size-10 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <FiHeart className={`size-5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid size-10 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <FiX className="size-5" />
                  </button>
                </div>
              </div>

              {/* RESTAURANT INFO OVERLAY */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-end gap-3.5">
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="size-16 rounded-2xl border-2 border-white/40 object-cover shadow-md shrink-0 bg-white"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-2xl font-black leading-tight text-white">
                        {restaurant.name}
                      </h2>
                      <span className="rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-black text-white">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 flex-wrap">
                      <span>{restaurant.cuisines.join(" • ")}</span>
                      <span>•</span>
                      <span>📍 {restaurant.area}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs font-bold pt-0.5">
                      <span className="inline-flex items-center gap-1 bg-amber-500 px-2 py-0.5 rounded-md text-slate-950 font-black">
                        <FiStar className="fill-slate-950 size-3" /> {restaurant.rating} ({restaurant.ratingCount}+)
                      </span>
                      <span>⏱️ {restaurant.deliveryMins} mins</span>
                      <span>•</span>
                      <span>🛵 {restaurant.distanceKm} km away</span>
                      <span>•</span>
                      <span>{restaurant.priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI REVIEW SUMMARY & WHY RECOMMENDING BANNER */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-200 dark:border-white/10 space-y-3 shrink-0">
              {/* OFFERS BADGE */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-700 dark:text-emerald-300">
                <FiTag className="size-4 text-emerald-600" />
                <span>{restaurant.offer}</span>
              </div>

              {/* AI REVIEWS HIGHLIGHT */}
              <div className="grid sm:grid-cols-2 gap-2 text-xs font-bold">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
                    ✨ Customers Love
                  </span>
                  <ul className="text-slate-700 dark:text-slate-300 space-y-0.5 text-[11px]">
                    {restaurant.aiReviewSummary.highlights.map((h, i) => (
                      <li key={i}>✓ {h}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block">
                    ⚠️ Good to know
                  </span>
                  <ul className="text-slate-700 dark:text-slate-300 space-y-0.5 text-[11px]">
                    {restaurant.aiReviewSummary.watchOuts.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* STICKY MENU SEARCH & CATEGORY TABS */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 space-y-3 shrink-0">
              {/* MENU SEARCH */}
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="🔍 Search this menu (e.g. Biryani, Spicy, Veg, Prawns)"
                  className="w-full h-11 pl-10 pr-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
                {menuSearch && (
                  <button
                    type="button"
                    onClick={() => setMenuSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* HORIZONTAL CATEGORIES BAR */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryTab(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black capitalize whitespace-nowrap transition-all cursor-pointer ${
                      activeCategoryTab === cat
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {cat.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* DISHES LIST */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Menu Items ({filteredDishes.length})
                </h3>
              </div>

              {filteredDishes.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm font-bold text-slate-500">No dishes matched "{menuSearch}".</p>
                  <button
                    type="button"
                    onClick={() => setMenuSearch("")}
                    className="text-xs font-black text-emerald-600 underline"
                  >
                    Clear menu search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex items-start justify-between gap-4 p-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xs hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-3 rounded-full ${
                              dish.veg ? "bg-emerald-500" : "bg-rose-500"
                            } ring-2 ring-slate-200 dark:ring-slate-700`}
                          />
                          {dish.isBestseller && (
                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-400 border border-amber-400/40">
                              🔥 Bestseller
                            </span>
                          )}
                          <span className="text-xs font-bold text-amber-500">
                            ⭐ {dish.rating} ({dish.ratingCount})
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                          {dish.description}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-xs">
                          <span className="text-base font-black text-slate-900 dark:text-white">
                            {currency(dish.price)}
                          </span>
                          {dish.originalPrice > dish.price && (
                            <span className="text-xs font-bold text-slate-400 line-through">
                              {currency(dish.originalPrice)}
                            </span>
                          )}
                          <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                            {dish.serves}
                          </span>
                        </div>
                      </div>

                      {/* DISH IMAGE & ADD BUTTON */}
                      <div className="relative shrink-0 flex flex-col items-center">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="size-24 sm:size-28 rounded-2xl object-cover shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => onSelectDish(dish)}
                          className="absolute -bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl font-black text-xs shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                        >
                          <FiPlus className="size-3.5" /> ADD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
