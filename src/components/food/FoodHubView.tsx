import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiPlus,
  FiStar,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useCartActions } from "@/hooks/useCart";
import { ServiceCategorySwitcher } from "@/components/common/ServiceCategorySwitcher";
import { StoreCard } from "@/components/shop/StoreCard";

// Comprehensive authentic cuisine & food categories for "What's on your mind?"
const FOOD_CUISINE_CATEGORIES = [
  { name: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80" },
  { name: "Pizzas", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80" },
  { name: "Burgers", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" },
  { name: "Dosas", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80" },
  { name: "North Indian", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80" },
  { name: "Chinese", img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=300&q=80" },
  { name: "Kebabs", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80" },
  { name: "Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=300&q=80" },
  { name: "Thalis", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&q=80" },
  { name: "Idli & Vada", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80" },
  { name: "Sandwiches", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80" },
  { name: "Pasta", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=300&q=80" },
  { name: "Haleem", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80" },
  { name: "Shakes", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80" },
  { name: "Cakes", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80" },
  { name: "Coffee & Tea", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=300&q=80" },
  { name: "Chaat & Samosa", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80" },
  { name: "Seafood", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=300&q=80" },
  { name: "Salads", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" },
  { name: "Desserts", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80" },
];

export function FoodHubView() {
  const navigate = useNavigate();
  const { addToCart } = useCartActions();
  const cuisineScrollRef = useRef<HTMLDivElement>(null);

  // Transient animated feedback state for clicked product IDs
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Mouse drag-to-scroll support for desktop
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Load authentic restaurants from API
  const storesQuery = useQuery({
    queryKey: ["stores", "food"],
    queryFn: () => api.stores("food"),
  });
  const restaurants = storesQuery.data ?? [];

  // Flash Deals Countdown Timer (02:15:00)
  const [timeLeft, setTimeLeft] = useState(8100);

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

  const scrollCuisines = (direction: "left" | "right") => {
    if (cuisineScrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      cuisineScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = cuisineScrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = cuisineScrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const el = cuisineScrollRef.current;
    if (el && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
    }
  };

  function handleQuickAdd(productId: string, dishName: string) {
    addToCart(productId, 1);
    setJustAddedId(productId);
    toast.success(`Added ${dishName} to cart!`);
    setTimeout(() => setJustAddedId(null), 1200);
  }

  function handleReorder() {
    handleQuickAdd("p-1", "Hyderabadi Chicken Dum Biryani");
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6 select-none">
      {/* 1. TOP SERVICE CATEGORY SWITCHER */}
      <ServiceCategorySwitcher activeService="food" />

      {/* 2. HERO PROMOTIONAL 3D BANNER CARD (50% OFF) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#034254] to-teal-950 text-white p-6 sm:p-10 border-t-2 border-l border-white/30 border-b-[4px] border-r-2 border-slate-950 shadow-xl shadow-cyan-950/30 select-none transform-gpu transition-transform duration-300 hover:scale-[1.008]">
        {/* Dynamic Specular Laser Sheen Sweep */}
        <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none" />

        {/* Ambient Underglow Core */}
        <div className="absolute -right-10 -bottom-10 size-60 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 max-w-lg space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 border border-cyan-300/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-200 shadow-xs">
            <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
            🔥 Enrolled Partner Special
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-teal-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            50% OFF
          </h2>
          <p className="text-sm sm:text-base font-bold text-slate-200">
            On your first 3 food orders from top rated restaurants. Delivered in 20-30 mins!
          </p>

          <div className="pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.92, y: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              onClick={() => toast.info("50% discount coupon 'SUPER50' auto-applied at checkout!")}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm border-t border-white/60 border-b-2 border-teal-900 shadow-[0_6px_20px_rgba(0,188,212,0.4)] active:shadow-inner transition-all cursor-pointer touch-manipulation"
            >
              ORDER NOW
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3. WHAT'S ON YOUR MIND? (SMOOTH HARDWARE-ACCELERATED CAROUSEL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              What's on your mind?
            </h2>
            <span className="text-xs font-bold text-slate-400">({FOOD_CUISINE_CATEGORIES.length} Cuisines)</span>
          </div>

          {/* Left & Right Smooth Scroll Buttons with Elastic Press Physics */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollCuisines("left")}
              className="size-8.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 grid place-items-center text-slate-700 dark:text-slate-200 shadow-xs transition-transform active:scale-90 cursor-pointer touch-manipulation"
              title="Scroll left"
            >
              <FiChevronLeft className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollCuisines("right")}
              className="size-8.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 grid place-items-center text-slate-700 dark:text-slate-200 shadow-xs transition-transform active:scale-90 cursor-pointer touch-manipulation"
              title="Scroll right"
            >
              <FiChevronRight className="size-4.5" />
            </button>
          </div>
        </div>

        {/* HORIZONTAL SMOOTH SCROLL CAROUSEL */}
        <div
          ref={cuisineScrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-1 cursor-grab active:cursor-grabbing touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {FOOD_CUISINE_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => void navigate({ to: "/search", search: { q: cat.name } })}
              className="flex flex-col items-center gap-2 group cursor-pointer shrink-0 w-[72px] sm:w-[84px] select-none transform-gpu transition-transform duration-200 hover:-translate-y-1.5 active:scale-95 touch-manipulation"
            >
              {/* 3D Porcelain Beveled Lens Chassis */}
              <div className="relative size-16 sm:size-20">
                <div className="absolute -bottom-1.5 inset-x-1 h-3 rounded-full bg-slate-950/30 blur-xs group-hover:scale-75 group-hover:opacity-40 transition-all duration-300" />

                <div className="relative w-full h-full rounded-full p-0.5 bg-gradient-to-b from-white via-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900 shadow-[0_6px_16px_rgba(0,0,0,0.18),inset_0_1.5px_2px_white] group-hover:scale-105 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.25)] transition-all duration-200">
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-115 transition-transform duration-300 pointer-events-none"
                    />

                    {/* Specular dynamic shifting glaze lens */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/45 pointer-events-none rounded-full" />
                  </div>
                </div>
              </div>

              {/* Cuisine Name Label */}
              <span className="relative z-10 text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight text-center truncate w-full group-hover:text-cyan-500 transition-colors duration-200">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TRENDING POPULAR RESTAURANTS (ACTUAL RESTAURANT STORE CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-sm font-black shadow-xs">
              🔥
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Trending Restaurants
            </h2>
          </div>
          <Link
            to="/search"
            search={{ q: "" }}
            className="text-xs font-black text-cyan-600 dark:text-cyan-400 hover:underline active:opacity-70 transition-opacity cursor-pointer"
          >
            SEE ALL ({restaurants.length})
          </Link>
        </div>

        {/* Real Restaurants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {restaurants.slice(0, 8).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>

      {/* 5. POPULAR DISHES NEAR YOU (COMPACT 4-PER-ROW GRID WITH TACTILE POP BUTTONS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-black shadow-xs">
              🍛
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Dishes Near You
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Quick 1-Tap Add</span>
        </div>

        {/* COMPACT 4-PER-ROW GRID (4 on top row, 4 on bottom row) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            {
              id: "tr-1",
              productId: "p-1",
              name: "Dum Biryani",
              price: 289,
              restaurant: "Bawarchi",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "tr-2",
              productId: "p-2",
              name: "Butter Masala",
              price: 249,
              restaurant: "Sri Kanya",
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "tr-3",
              productId: "p-3",
              name: "Special Haleem",
              price: 320,
              restaurant: "Pista House",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "tr-4",
              productId: "p-4",
              name: "Ghee Dosa",
              price: 119,
              restaurant: "Chaitanya",
              rating: 4.7,
              img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "tr-5",
              productId: "p-5",
              name: "Smoky Burger",
              price: 189,
              restaurant: "Leon's",
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "tr-6",
              productId: "p-6",
              name: "Farmhouse Pizza",
              price: 299,
              restaurant: "La Pino'z",
              rating: 4.6,
              img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "tr-7",
              productId: "p-7",
              name: "Paneer Thali",
              price: 219,
              restaurant: "Santosh Dhaba",
              rating: 4.7,
              img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "tr-8",
              productId: "p-8",
              name: "Thick Shake",
              price: 169,
              restaurant: "Thick Shake Co",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all duration-200 group relative select-none transform-gpu"
            >
              {/* Mini Food Photo */}
              <div className="relative size-12 sm:size-14 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Details (Name, Restaurant, Price) */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-xs sm:text-[13px] text-slate-900 dark:text-white truncate leading-tight group-hover:text-cyan-500 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 truncate mt-0.5">
                  {item.restaurant}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                    ₹{item.price}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                    <FiStar className="size-2.5 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>

              {/* 1-Tap Tactile Quick Add '+' Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => handleQuickAdd(item.productId, item.name)}
                className={`size-7 sm:size-8 rounded-full grid place-items-center shrink-0 cursor-pointer shadow-xs border transition-colors duration-200 ${
                  justAddedId === item.productId
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/40"
                    : "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40 hover:bg-cyan-500 hover:text-white"
                }`}
                title="Add to cart"
              >
                {justAddedId === item.productId ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                  >
                    <FiCheck className="size-3.5 sm:size-4 stroke-[3]" />
                  </motion.div>
                ) : (
                  <FiPlus className="size-3.5 sm:size-4 stroke-[2.5]" />
                )}
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FLASH DEALS BANNER (UP TO 60% OFF) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 text-white p-6 sm:p-8 shadow-xl shadow-orange-600/20 select-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
              <FiZap className="size-3.5 fill-current text-yellow-300" />
              <span>Flash Deals Ending Soon</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Up to 60% OFF Top Cuisines
            </h2>
            <p className="text-sm font-bold text-white/90">
              Limited time offers on Biryanis, Pizzas, Desserts and Burgers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Live Clock Timer */}
            <div className="flex items-center gap-2 bg-slate-950/40 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl">
              <FiClock className="size-4 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
              <div className="font-mono font-black text-base sm:text-lg tracking-wider text-amber-300">
                {formatTimer(timeLeft)}
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              onClick={() => void navigate({ to: "/offers" })}
              className="h-11 px-6 rounded-full bg-white text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors shadow-lg active:scale-95 cursor-pointer touch-manipulation"
            >
              Grab Deals
            </motion.button>
          </div>
        </div>
      </div>

      {/* 7. PREVIOUS ORDER REORDER CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-4">
          <div className="size-14 sm:size-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80"
              alt="Previous order"
              className="size-full object-cover"
            />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Order Again
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Hyderabadi Chicken Dum Biryani
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Bawarchi Restaurant • ₹289 • Delivered yesterday
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleReorder}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-500/30 transition-colors cursor-pointer touch-manipulation"
        >
          REORDER
        </motion.button>
      </div>
    </div>
  );
}
