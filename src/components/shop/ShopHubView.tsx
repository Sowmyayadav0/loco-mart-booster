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

export function ShopHubView() {
  const navigate = useNavigate();
  const { addToCart } = useCartActions();

  // Flash Deals Countdown Timer (01:45:00)
  const [timeLeft, setTimeLeft] = useState(6300); // 1 hour 45 mins in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 6300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Reorder Reliance Smart Basket
  function handleReorder() {
    addToCart("p-17", 1);
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6 select-none">
      {/* 1. TOP SERVICE CATEGORY SWITCHER */}
      <ServiceCategorySwitcher activeService="shop" />

      {/* 2. HERO PROMOTIONAL BANNER CARD (FLAT 30% OFF ON SHOPPING) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-800 to-[#044D63] text-white p-6 sm:p-10 shadow-xl">
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 max-w-lg space-y-3">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur">
            🛍️ Superstore Deals
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            UP TO 40% OFF
          </h2>
          <p className="text-sm sm:text-base font-medium opacity-90">
            Groceries, Electronics, Fashion & Pharmacy delivered to your door in 15 mins!
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => toast.info("Superstore coupon 'SHOP40' auto-applied at checkout!")}
              className="h-12 px-7 rounded-full bg-[#00BCD4] hover:bg-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* 3. EXPLORE SHOP CATEGORIES - COMPACT CREATIVE CAPSULE RIBBON */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs">
              ✦
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Explore Shop Aisles
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void navigate({ to: "/search", search: { q: "" } })}
            className="flex items-center gap-1 text-[11px] font-extrabold tracking-wider text-purple-500 hover:text-purple-400 uppercase transition-colors"
          >
            <span>All Aisles</span>
            <FiArrowRight className="size-3" />
          </button>
        </div>

        {/* Compact Horizontal Glass Capsule Stream */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar select-none touch-pan-x">
            {[
              {
                name: "Groceries",
                badge: "Staples 🛒",
                img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-emerald-500/25 hover:border-emerald-400/50",
                badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
                slug: "grocery",
              },
              {
                name: "Dairy & Eggs",
                badge: "Fresh 🥛",
                img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-sky-500/25 hover:border-sky-400/50",
                badgeColor: "text-sky-400 bg-sky-500/15 border-sky-500/30",
                slug: "dairy",
              },
              {
                name: "Bakery",
                badge: "Oven 🥐",
                img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-amber-500/25 hover:border-amber-400/50",
                badgeColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
                slug: "bakery",
              },
              {
                name: "Fruits & Veg",
                badge: "Farm 🍎",
                img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-green-500/25 hover:border-green-400/50",
                badgeColor: "text-green-400 bg-green-500/15 border-green-400/30",
                slug: "fruits",
              },
              {
                name: "Meat & Fish",
                badge: "Prime 🍗",
                img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-rose-500/25 hover:border-rose-400/50",
                badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
                slug: "meat",
              },
              {
                name: "Pharmacy",
                badge: "Care 💊",
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-teal-500/25 hover:border-teal-400/50",
                badgeColor: "text-teal-400 bg-teal-500/15 border-teal-500/30",
                slug: "pharmacy",
              },
              {
                name: "Fashion",
                badge: "Trend 👗",
                img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-pink-500/25 hover:border-pink-400/50",
                badgeColor: "text-pink-400 bg-pink-500/15 border-pink-500/30",
                slug: "fashion",
              },
              {
                name: "Electronics",
                badge: "Tech 📱",
                img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80",
                glow: "hover:shadow-purple-500/25 hover:border-purple-400/50",
                badgeColor: "text-purple-400 bg-purple-500/15 border-purple-500/30",
                slug: "electronics",
              },
            ].map((cat) => (
              <motion.button
                key={cat.name}
                type="button"
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                onClick={() => void navigate({ to: "/category/$slug", params: { slug: cat.slug } })}
                className={`group shrink-0 flex items-center gap-2.5 h-11 sm:h-12 pl-1.5 pr-3 rounded-full bg-slate-950/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-md ${cat.glow} hover:bg-slate-900 transition-all duration-200 cursor-pointer`}
              >
                {/* Micro Lens Photo Orb */}
                <div className="relative size-8 sm:size-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-white/40 to-transparent shadow-xs">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full group-hover:scale-115 transition-transform duration-300"
                  />
                </div>

                {/* Name */}
                <span className="text-xs sm:text-[13px] font-black text-white tracking-tight group-hover:text-purple-400 transition-colors">
                  {cat.name}
                </span>

                {/* Micro Pill Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}
                >
                  {cat.badge}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TRENDING SHOP DEALS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Trending Superstore Deals
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
              id: "shop-1",
              productId: "p-17",
              name: "Fresh Full Cream Milk & Curd",
              price: 64,
              time: "15 mins",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "shop-2",
              productId: "p-49",
              name: "BassPods Pro ANC Earbuds",
              price: 3499,
              time: "25 mins",
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "shop-3",
              productId: "p-19",
              name: "Malai Paneer Fresh Block",
              price: 92,
              time: "10 mins",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "shop-4",
              productId: "p-33",
              name: "Cotton Casual Slim Fit Shirt",
              price: 999,
              time: "30 mins",
              rating: 4.7,
              img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
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
                      addToCart(item.productId, 1);
                    }}
                    className="size-8 rounded-full bg-[#EEFBFD] hover:bg-[#00BCD4] text-[#044D63] hover:text-white grid place-items-center transition-colors shadow-2xs cursor-pointer"
                  >
                    <FiPlus className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECOMMENDED SHOP COMBOS */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Superstore Special Collections
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Supermarket Daily Pantry",
              sub: "Up to 30% Off",
              img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Pharmacy & Health Essentials",
              sub: "15-Min Express",
              img: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Tech Accessories & Audio",
              sub: "100% Original Warranty",
              img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
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

      {/* 6. RECENTLY PURCHASED SHOP CARD */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Recently Purchased
        </h2>

        <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=150&q=80"
              alt="Reliance Smart Supermarket"
              className="size-14 sm:size-16 rounded-2xl object-cover shrink-0 border border-slate-200"
            />
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                Reliance Smart Supermarket
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Fresh Dairy & Pantry Basket • ₹345
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

      {/* 7. FEATURED SUPERSTORES & PHARMACIES */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Featured Superstores
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Reliance Smart Supermarket",
              cat: "Groceries & Daily Essentials",
              dist: "1.2 km",
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Apollo Pharmacy 24/7",
              cat: "Medicines & Healthcare",
              dist: "0.8 km",
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Zudio Fashion & Lifestyle",
              cat: "Apparel & Accessories",
              dist: "2.1 km",
              rating: 4.7,
              img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
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

      {/* 8. SUPERSTORE FLASH DEALS ⚡ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Superstore Flash Deals ⚡
            </h2>
            <span className="rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs px-3 py-1">
              Ends in {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Organic Honey 500g", price: 199, orig: 299, img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80" },
            { name: "Almonds 250g Pack", price: 249, orig: 380, img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80" },
            { name: "Fresh Filter Coffee", price: 99, orig: 140, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80" },
            { name: "Dark Chocolate 100g", price: 120, orig: 180, img: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80" },
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
                  addToCart("p-18", 1);
                }}
                className="w-full h-9 rounded-xl bg-[#00BCD4] hover:bg-cyan-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
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
