import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBox,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiMapPin,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import { useCartActions } from "@/hooks/useCart";
import { ServiceCategorySwitcher } from "@/components/common/ServiceCategorySwitcher";

export function FoodHubView() {
  const navigate = useNavigate();
  const { addToCart } = useCartActions();

  // Flash Deals Countdown Timer (02:15:00)
  const [timeLeft, setTimeLeft] = useState(8100); // 2 hours 15 mins in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 8100));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Reorder Sri Kanya Restaurant Biryani
  function handleReorder() {
    addToCart("prod-1", 1);
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6 select-none">
      {/* 1. TOP SERVICE CATEGORY SWITCHER */}
      <ServiceCategorySwitcher activeService="food" />

      {/* 2. HERO PROMOTIONAL BANNER CARD (50% OFF - Exact from Image) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#044D63] via-[#0288D1] to-teal-800 text-white p-6 sm:p-10 shadow-xl">
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 max-w-lg space-y-3">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur">
            🔥 Special Offer
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            50% OFF
          </h2>
          <p className="text-sm sm:text-base font-medium opacity-90">
            On your first 3 food orders. Delivered in 20-30 mins!
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => toast.info("50% discount coupon 'SUPER50' auto-applied at checkout!")}
              className="h-12 px-7 rounded-full bg-[#00BCD4] hover:bg-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105"
            >
              ORDER NOW
            </button>
          </div>
        </div>
      </div>

      {/* 3. EXPLORE CATEGORIES (Restaurants & Hot Meals Only) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Explore Restaurants & Cuisines
          </h2>
          <button
            type="button"
            onClick={() => void navigate({ to: "/search", search: { q: "" } })}
            className="flex items-center gap-1 text-xs font-black text-[#00BCD4] hover:underline"
          >
            <span>MORE</span>
            <FiArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {[
            { name: "Biryani", icon: "🍲", bg: "bg-amber-50 text-amber-700" },
            { name: "Mandi", icon: "🍢", bg: "bg-rose-50 text-rose-700" },
            { name: "Pizza", icon: "🍕", bg: "bg-orange-50 text-orange-700" },
            { name: "Burgers", icon: "🍔", bg: "bg-yellow-50 text-yellow-700" },
            { name: "Desserts", icon: "🧁", bg: "bg-pink-50 text-pink-700" },
            { name: "Chinese", icon: "🍜", bg: "bg-red-50 text-red-700" },
            { name: "Meals", icon: "🍱", bg: "bg-emerald-50 text-emerald-700" },
            { name: "Beverages", icon: "🥤", bg: "bg-purple-50 text-purple-700" },
          ].map((cat) => (
            <motion.div
              key={cat.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => void navigate({ to: "/search", search: { q: cat.name } })}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md hover:border-cyan-300 transition-all cursor-pointer space-y-1.5"
            >
              <span className={`grid size-12 place-items-center rounded-2xl text-2xl ${cat.bg}`}>
                {cat.icon}
              </span>
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. TRENDING NOW (Restaurant Specialities Only) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Trending Restaurants
          </h2>
          <button
            type="button"
            onClick={() => void navigate({ to: "/search", search: { q: "" } })}
            className="text-xs font-black text-[#00BCD4] hover:underline"
          >
            SEE ALL
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: "tr-1",
              name: "Bhimavaram Special Biryani",
              price: 250,
              time: "30 mins",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "tr-2",
              name: "Chef Special Butter Chicken",
              price: 280,
              time: "25 mins",
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "tr-3",
              name: "Authentic Arabian Mandi",
              price: 399,
              time: "25 mins",
              rating: 4.7,
              img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "tr-4",
              name: "Artisan Pizza & Garlic Bread",
              price: 299,
              time: "20 mins",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.img}
                  alt={item.name}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-black text-slate-800 flex items-center gap-1 shadow-xs">
                  <FiStar className="size-3.5 fill-amber-400 text-amber-400" /> {item.rating}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-[#00BCD4] transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>₹{item.price} • {item.time}</span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart("prod-1", 1);
                    }}
                    className="size-8 rounded-full bg-[#EEFBFD] hover:bg-[#00BCD4] text-[#044D63] hover:text-white grid place-items-center transition-colors shadow-2xs"
                  >
                    <FiPlus className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECOMMENDED FOR YOU (Restaurant Specials) */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Recommended Meals & Combos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "South Indian Meals Thali",
              sub: "Free Delivery",
              img: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Local Sweets & Desserts",
              sub: "Explore now",
              img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Chef Special Biryani Thali",
              sub: "Up to 20% Off",
              img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            },
          ].map((rec, i) => (
            <div
              key={i}
              className="relative h-44 rounded-3xl overflow-hidden shadow-md group cursor-pointer"
            >
              <img
                src={rec.img}
                alt={rec.title}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-5 flex flex-col justify-end text-white">
                <h3 className="text-lg font-black leading-tight">{rec.title}</h3>
                <p className="text-xs font-semibold opacity-90">{rec.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RECENTLY ORDERED CARD (Sri Kanya Restaurant Reorder) */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Recently Ordered
        </h2>

        <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80"
              alt="Sri Kanya Restaurant"
              className="size-14 sm:size-16 rounded-2xl object-cover shrink-0 border border-slate-200"
            />
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                Sri Kanya Restaurant
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Chicken Dum Biryani • ₹260
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReorder}
            className="h-10 px-5 rounded-full bg-[#D7F5F8] hover:bg-[#00BCD4] text-[#044D63] hover:text-white font-black text-xs shadow-2xs transition-all uppercase tracking-wider shrink-0"
          >
            REORDER
          </button>
        </div>
      </div>

      {/* 7. NEARBY RESTAURANTS (Restaurants Only) */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Nearby Restaurants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Sri Kanya Restaurant",
              cat: "Multi-Cuisine • Biryani",
              dist: "1.2 km",
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Royal Arabian Mandi",
              cat: "Arabian & Grill",
              dist: "0.8 km",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Bavarchi Biryani House",
              cat: "Hyderabadi Restaurant",
              dist: "1.5 km",
              rating: 4.7,
              img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
            },
          ].map((store, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <img
                src={store.img}
                alt={store.name}
                className="size-16 rounded-2xl object-cover shrink-0 border border-slate-200"
              />
              <div className="space-y-0.5 overflow-hidden">
                <h3 className="text-base font-extrabold text-slate-900 leading-tight truncate">
                  {store.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {store.cat} • {store.dist}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 pt-0.5">
                  <FiStar className="size-3.5 fill-amber-400" />
                  <span>{store.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. FLASH FOOD DEALS ⚡ (Restaurant Combos Only) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Restaurant Flash Deals ⚡
            </h2>
            <span className="rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs px-3 py-1">
              Ends in {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Chicken Dum Biryani Combo", price: 199, orig: 299, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80" },
            { name: "Paneer Masala + 2 Roti", price: 179, orig: 250, img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80" },
            { name: "Crispy Burger & Fries", price: 149, orig: 220, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
            { name: "Cold Coffee & Lava Cake", price: 120, orig: 180, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80" },
          ].map((deal, i) => (
            <div key={i} className="p-3.5 rounded-3xl bg-white border border-slate-100 shadow-md space-y-2 flex flex-col justify-between">
              <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-slate-50">
                <img src={deal.img} alt={deal.name} className="size-full object-cover" />
                <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  SAVE ₹{deal.orig - deal.price}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">{deal.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-black text-slate-900">₹{deal.price}</span>
                  <span className="text-xs font-semibold text-slate-400 line-through">₹{deal.orig}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart("prod-2", 1);
                }}
                className="w-full h-9 rounded-xl bg-[#00BCD4] hover:bg-cyan-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <FiPlus className="size-3.5" /> Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
