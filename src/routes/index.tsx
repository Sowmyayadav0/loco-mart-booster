import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiAward,
  FiClock,
  FiCreditCard,
  FiHeart,
  FiMapPin,
  FiNavigation,
  FiPackage,
  FiPercent,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
  FiTag,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/shop/ProductCard";
import { StoreCard } from "@/components/shop/StoreCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LocoMart — Food, Shop, Rides & Parcel Delivered" },
      {
        name: "description",
        content:
          "Order food, shop essentials, book rides and send parcels fast on LocoMart super app.",
      },
      { property: "og:title", content: "LocoMart — Food, Shop, Rides & Parcel" },
      {
        property: "og:description",
        content: "Fresh food, groceries, fashion, electronics, pharmacy, rides & parcel courier in one app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

// "What we offer" 4 Core Service Cards
const WHAT_WE_OFFER = [
  {
    slug: "food",
    to: "/category/$slug",
    params: { slug: "food" },
    title: "Food & Groceries",
    desc: "Delicious food & groceries delivered fast",
    emoji: "🍔",
    bg: "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/70 hover:border-emerald-500",
    color: "text-emerald-700 dark:text-emerald-400",
    btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  {
    slug: "shop",
    to: "/category/$slug",
    params: { slug: "shop" },
    title: "Shop",
    desc: "Fashion, electronics & more all in one place",
    emoji: "🛍️",
    bg: "bg-purple-50/80 dark:bg-purple-950/40 border-purple-200/70 hover:border-purple-500",
    color: "text-purple-700 dark:text-purple-400",
    btnColor: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  {
    slug: "rides",
    to: "/rides",
    title: "Rides",
    desc: "Quick & safe rides across the city",
    emoji: "🚕",
    bg: "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/70 hover:border-amber-500",
    color: "text-amber-700 dark:text-amber-400",
    btnColor: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  {
    slug: "courier",
    to: "/courier",
    title: "Parcel",
    desc: "Send & receive parcels with ease",
    emoji: "📦",
    bg: "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/70 hover:border-blue-500",
    color: "text-blue-700 dark:text-blue-400",
    btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
  },
] as const;

// Requested Food Subcategories (Instamart Look)
const INSTAMART_FOOD_CATEGORIES = [
  { slug: "dairy", name: "Dairy & Eggs", sub: "Milk, Butter, Paneer, Curd", icon: "🥛", gradient: "bg-sky-500/10 border-sky-500/20 text-sky-600" },
  { slug: "bakery", name: "Bakery & Cakes", sub: "Breads, Buns, Cakes & Biscuits", icon: "🥐", gradient: "bg-amber-500/10 border-amber-500/20 text-amber-600" },
  { slug: "restaurants", name: "Restaurants", sub: "Hot Biryani, Pizza, Meals", icon: "🍽️", gradient: "bg-orange-500/10 border-orange-500/20 text-orange-600" },
  { slug: "fruits", name: "Fruits & Veggies", sub: "Fresh Seasonal & Organic", icon: "🍎", gradient: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" },
  { slug: "grocery", name: "Snacks & Drinks", sub: "Chips, Juice, Biscuits", icon: "🍿", gradient: "bg-purple-500/10 border-purple-500/20 text-purple-600" },
  { slug: "meat", name: "Meat & Seafood", sub: "Chicken, Mutton, Fish", icon: "🍗", gradient: "bg-red-500/10 border-red-500/20 text-red-600" },
] as const;

function HomePage() {
  const stores = useQuery({ queryKey: ["stores"], queryFn: () => api.stores() });
  const picks = useQuery({ queryKey: ["bestsellers"], queryFn: () => api.bestsellers(8) });
  const foodProducts = useQuery({ queryKey: ["food-products"], queryFn: () => api.productsByCategory("food") });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-4 sm:py-6">
      {/* HERO BANNER SECTION (Compact & Well-Proportioned) */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/90 via-green-50/60 to-emerald-100/70 dark:from-emerald-950/40 dark:via-green-950/20 dark:to-teal-950/30 p-5 sm:p-7 shadow-2xs">
        <div className="grid items-center gap-6 lg:grid-cols-12">
          {/* Left Column: Headline & Action Buttons */}
          <div className="space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/60 border border-emerald-300/40 px-3 py-0.5 text-[11px] font-black text-emerald-800 dark:text-emerald-300">
              <FiZap className="size-3 fill-emerald-600 text-emerald-600" />
              <span>4 Main Services · 10-15 Min Delivery</span>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-4xl lg:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Food, Shop, Rides & Parcel.
              </h1>
              <h1 className="text-2xl sm:text-4xl lg:text-4xl font-black tracking-tight leading-tight text-emerald-600 dark:text-emerald-400">
                All in one place.
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-lg leading-relaxed font-medium">
              Fresh food & groceries, fashion & electronics shopping, instant rides, and parcel delivery across the city.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <Link
                to="/category/$slug"
                params={{ slug: "food" }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-xs transition-all hover:scale-105"
              >
                Order Food & Groceries <FiArrowRight className="size-3.5" />
              </Link>
              <Link
                to="/category/$slug"
                params={{ slug: "shop" }}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/40 bg-white/80 dark:bg-slate-900/80 px-5 py-2.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 backdrop-blur hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors shadow-2xs"
              >
                Browse Shop Categories
              </Link>
            </div>

            {/* 4 Feature Badges Pill Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/40">
              <div className="flex items-center gap-2 rounded-xl bg-white/80 dark:bg-card/80 p-2 shadow-2xs border border-emerald-100">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 text-xs shrink-0">🛵</span>
                <div>
                  <h4 className="text-[10px] font-black text-foreground">Fast Delivery</h4>
                  <p className="text-[9px] text-muted-foreground">10-15 mins</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/80 dark:bg-card/80 p-2 shadow-2xs border border-emerald-100">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 text-xs shrink-0">🏷️</span>
                <div>
                  <h4 className="text-[10px] font-black text-foreground">Best Prices</h4>
                  <p className="text-[9px] text-muted-foreground">Great offers</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/80 dark:bg-card/80 p-2 shadow-2xs border border-emerald-100">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 text-xs shrink-0">📍</span>
                <div>
                  <h4 className="text-[10px] font-black text-foreground">Live Tracking</h4>
                  <p className="text-[9px] text-muted-foreground">Real-time status</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/80 dark:bg-card/80 p-2 shadow-2xs border border-emerald-100">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 text-xs shrink-0">🔄</span>
                <div>
                  <h4 className="text-[10px] font-black text-foreground">Easy Returns</h4>
                  <p className="text-[9px] text-muted-foreground">Hassle-free</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile Phone & Live Tracking Illustration */}
          <div className="relative hidden lg:flex items-center justify-center lg:col-span-5">
            {/* Compact Phone Mockup Frame */}
            <div className="relative w-52 rounded-[32px] border-6 border-slate-900 bg-card p-2.5 shadow-xl overflow-hidden">
              {/* Phone Header */}
              <div className="space-y-1.5 rounded-xl bg-emerald-600 p-2.5 text-white">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="flex items-center gap-1">📍 Deliver to Koramangala ▾</span>
                </div>
                <div className="rounded-lg bg-white/20 p-1 text-[9px] backdrop-blur">
                  🔍 Search food, groceries...
                </div>
                <div className="rounded-lg bg-emerald-700 p-1.5 text-center text-[10px] font-black">
                  Groceries in 10-15 mins 🚀
                </div>
              </div>

              {/* Phone Categories preview */}
              <div className="p-1.5 space-y-1.5">
                <span className="text-[9px] font-bold text-foreground">Top Categories</span>
                <div className="grid grid-cols-4 gap-1 text-center text-[8px] font-bold">
                  <div className="rounded bg-amber-50 p-1">🍎 Fruits</div>
                  <div className="rounded bg-emerald-50 p-1">🥦 Veggies</div>
                  <div className="rounded bg-sky-50 p-1">🥛 Dairy</div>
                  <div className="rounded bg-purple-50 p-1">🍿 Snacks</div>
                </div>
              </div>
            </div>

            {/* Floating Live Tracking Card Overlay */}
            <div className="absolute -bottom-2 -right-2 rounded-xl border border-emerald-200 bg-white dark:bg-slate-900 p-3 shadow-lg space-y-1 animate-bounce-slow">
              <div className="flex items-center gap-1.5">
                <span className="grid size-7 place-items-center rounded-full bg-emerald-600 text-white text-[10px]">
                  🛵
                </span>
                <div>
                  <h4 className="text-[11px] font-black text-foreground">Live Tracking</h4>
                  <p className="text-[9px] text-muted-foreground">Your order is on the way!</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[8px] font-extrabold text-emerald-600">
                📍 10 mins away
              </div>
            </div>

            {/* Salad bowl image graphic */}
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
              alt="Fresh Salad"
              className="absolute -bottom-4 -left-4 size-20 rounded-full border-2 border-white object-cover shadow-md"
            />
          </div>
        </div>
      </section>

      {/* "WHAT WE OFFER" SECTION (Compact 4 Primary Service Cards) */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">What we offer</h2>
          <p className="text-xs text-muted-foreground">Explore our four main services delivered to your doorstep</p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT_WE_OFFER.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={item.to}
                {...("params" in item ? { params: item.params } : {})}
                className={`group flex flex-col justify-between rounded-2xl border ${item.bg} p-4 sm:p-5 transition-all hover:scale-[1.01] hover:shadow-md h-full`}
              >
                <div>
                  <span className="text-3xl sm:text-4xl block mb-2.5 transition-transform group-hover:scale-110">{item.emoji}</span>
                  <h3 className={`text-base font-extrabold tracking-tight ${item.color}`}>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <span className={`grid size-7 place-items-center rounded-full ${item.btnColor} shadow-2xs transition-transform group-hover:translate-x-1`}>
                    <FiArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOCOMART FRESH FOOD CATEGORY SECTION */}
      <section className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-card p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-orange-500 text-xl text-white font-black shadow-xs">
              ⚡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight text-foreground">LocoMart Fresh Food</h2>
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wide">
                  10 Min Delivery
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Dairy, Bakery, Restaurants, Fresh Produce & Daily Treats
              </p>
            </div>
          </div>

          <Link
            to="/category/$slug"
            params={{ slug: "food" }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-colors"
          >
            Explore Food Store <FiArrowRight className="size-3" />
          </Link>
        </div>

        {/* Food Categories Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {INSTAMART_FOOD_CATEGORIES.map((food) => (
            <Link
              key={food.slug}
              to="/category/$slug"
              params={{ slug: food.slug }}
              className={`group flex flex-col items-center justify-between p-3 text-center rounded-2xl border ${food.gradient} backdrop-blur transition-all hover:scale-105 hover:shadow-2xs`}
            >
              <div className="text-3xl mb-1.5 transition-transform group-hover:scale-110">{food.icon}</div>
              <div>
                <h3 className="text-xs font-bold leading-tight text-foreground group-hover:text-orange-600">
                  {food.name}
                </h3>
                <p className="mt-0.5 text-[9px] text-muted-foreground line-clamp-1">{food.sub}</p>
              </div>
              <span className="mt-2.5 rounded-full bg-card px-2 py-0.5 text-[9px] font-extrabold text-foreground shadow-2xs">
                Shop Now →
              </span>
            </Link>
          ))}
        </div>

        {/* Best-selling Products Carousel / Grid */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-extrabold text-foreground">Top Fresh Food Products</h3>
            <Link to="/category/$slug" params={{ slug: "food" }} className="text-xs font-bold text-orange-600 hover:underline">
              View all products →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {(foodProducts.data ?? []).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-extrabold">Featured Local Stores</h2>
            <p className="text-xs text-muted-foreground">Top rated restaurants, supermarkets & shops</p>
          </div>
          <Link to="/search" search={{ q: "" }} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            Search stores <FiArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {(stores.data ?? []).slice(0, 6).map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      </section>

      {/* Trending Bestsellers */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-extrabold">Bestsellers Near You</h2>
            <p className="text-xs text-muted-foreground">Popular food items and daily essentials</p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            Browse all <FiArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {(picks.data ?? []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
