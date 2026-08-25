import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiClock,
  FiHeart,
  FiMapPin,
  FiSearch,
  FiStar,
  FiPlus,
  FiMinus,
  FiCheckCircle,
  FiTag,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiShare2,
  FiList,
} from "react-icons/fi";
import { toast } from "sonner";
import { api, friendlyError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useCart, useCartActions, cartTotals } from "@/hooks/useCart";
import { currency } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ");
    const title = `${name} — Menu, Offers & Order Online | LocoMart`;
    return {
      meta: [
        { title },
        { name: "description", content: `Order authentic dishes from ${name} with express delivery.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Menu, prices, ratings and reviews for ${name}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: StorePage,
});

const CATEGORY_ICONS: Record<string, string> = {
  "Biryani & Rice": "🍛",
  "Starters & Kebabs": "🍗",
  "Main Course Gravies": "🥘",
  "Breads & Roti": "🫓",
  "South Indian Tiffins": "🥞",
  "Pizzas & Burgers": "🍕",
  "Desserts & Shakes": "🍨",
  "Dairy": "🥛",
  "Snacks": "🥨",
  "Beverages": "🥤",
  "Staples": "🌾",
};

export function StorePage() {
  const { slug } = Route.useParams();
  const { signedIn } = useAuth();
  const qc = useQueryClient();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Cart & Actions
  const { data: cart = [] } = useCart();
  const { addToCart, setQty } = useCartActions();
  const { count: totalCartCount, subtotal } = cartTotals(cart);

  // Store data
  const storeQuery = useQuery({
    queryKey: ["store", slug],
    queryFn: () => api.storeBySlug(slug),
  });
  const store = storeQuery.data;
  const storeId = store?.id;

  const productsQuery = useQuery({
    queryKey: ["store-products", storeId],
    queryFn: () => api.storeProducts(storeId as string),
    enabled: Boolean(storeId),
  });
  const products = productsQuery.data ?? [];

  // Favourites
  const favourites = useQuery({
    queryKey: ["favourites"],
    queryFn: api.favourites,
    enabled: signedIn,
  });
  const isFav = Boolean(storeId && (favourites.data ?? []).includes(storeId));

  const toggleFav = useMutation({
    mutationFn: () => api.toggleFavourite(storeId as string, !isFav),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favourites"] });
      toast.success(isFav ? "Removed from favourites" : "Added to favourites");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  // Quantity mapping helper
  const cartItemMap = useMemo(() => {
    const map = new Map<string, { id: string; qty: number }>();
    for (const item of cart) {
      if (item.product_id) {
        map.set(item.product_id, { id: item.id, qty: item.quantity });
      }
    }
    return map;
  }, [cart]);

  // Filter products by search & dietary toggles
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      if (vegOnly && !p.is_veg) return false;
      if (nonVegOnly && p.is_veg) return false;
      if (bestsellerOnly && (p.rating ?? 0) < 4.5) return false;
      return true;
    });
  }, [products, searchQuery, vegOnly, nonVegOnly, bestsellerOnly]);

  // Group products by subcategory
  const groupedCategories = useMemo(() => {
    const groups: { title: string; items: Product[] }[] = [];
    const catMap = new Map<string, Product[]>();

    for (const p of filteredProducts) {
      const sub = p.subcategory || (p as any).sub || "Recommended";
      if (!catMap.has(sub)) {
        catMap.set(sub, []);
      }
      catMap.get(sub)!.push(p);
    }

    catMap.forEach((items, title) => {
      groups.push({ title, items });
    });

    return groups;
  }, [filteredProducts]);

  const toggleCategoryCollapse = (catTitle: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catTitle]: !prev[catTitle],
    }));
  };

  const scrollToCategory = (catTitle: string) => {
    setMenuModalOpen(false);
    setActiveCategory(catTitle);
    const id = `section-${catTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (storeQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6 select-none">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-4">
          <div className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center select-none">
        <div className="size-20 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-3xl mb-4">
          🍽️
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Restaurant Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This restaurant is temporarily unavailable or does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-cyan-600 transition-colors"
        >
          Explore Other Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-36 select-none bg-slate-50/60 dark:bg-slate-950">
      {/* 1. TOP FLOATING APP BAR */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-white/10 px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 grid place-items-center transition-colors text-slate-800 dark:text-slate-100 cursor-pointer"
              aria-label="Go back"
            >
              <FiArrowLeft className="size-4" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {store.name}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                {store.area}, {store.city} • {store.delivery_minutes} mins
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  void navigator.share({ title: store.name, url: window.location.href });
                } else {
                  void navigator.clipboard.writeText(window.location.href);
                  toast.success("Restaurant link copied to clipboard!");
                }
              }}
              className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 grid place-items-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Share"
            >
              <FiShare2 className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => (signedIn ? toggleFav.mutate() : toast.info("Sign in to save favourites"))}
              className={cn(
                "size-9 rounded-full grid place-items-center transition-all cursor-pointer",
                isFav
                  ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
              title="Favorite"
            >
              <FiHeart className={cn("size-4", isFav && "fill-current")} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-4 space-y-6">
        {/* 2. AUTHENTIC RESTAURANT ATMOSPHERE BANNER */}
        <div className="relative h-48 sm:h-64 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-white/10">
          <img
            src={store.banner_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"}
            alt={store.name}
            className="size-full object-cover"
          />
          {/* Specular Ambient Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Floating Restaurant Brand Avatar & Atmospheric Badge */}
          <div className="absolute bottom-4 left-4 sm:left-6 flex items-end gap-3.5 z-10">
            <div className="size-16 sm:size-20 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-900 bg-white shadow-xl shrink-0">
              <img
                src={store.logo_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80"}
                alt={store.name}
                className="size-full object-cover"
              />
            </div>
            <div className="text-white drop-shadow-md pb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 inline-flex items-center gap-1">
                🍽️ Authentic Kitchen & Express Delivery
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1 leading-tight">{store.name}</h2>
            </div>
          </div>
        </div>

        {/* 3. SWIGGY / ZOMATO SIGNATURE RESTAURANT DETAILS CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* Subtle Top Ambient Gradient */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-rose-500" />

          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {store.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <FiCheckCircle className="size-3" /> FSSAI Verified
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {store.tags && store.tags.length > 0 ? store.tags.join(" • ") : "North Indian • Biryani • Mughlai"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Outlet: <span className="font-bold text-slate-700 dark:text-slate-300">{store.area}</span> • {store.city}
                </p>
              </div>

              {/* Verified Rating Pill (Green Zomato/Swiggy Badge) */}
              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-xl font-black text-sm shadow-md shadow-emerald-600/30">
                  <span>{Number(store.rating || 4.4).toFixed(1)}</span>
                  <FiStar className="size-3.5 fill-current" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1">
                  {store.rating_count || 1200}+ ratings
                </span>
              </div>
            </div>

            {/* Delivery Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 border-t border-slate-100 dark:border-white/10 text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                <FiClock className="size-4" />
                <span>{store.delivery_minutes} MINS</span>
              </div>
              <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <FiMapPin className="size-4 text-slate-400" />
                <span>2.4 km away</span>
              </div>
              <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div>
                <span>₹350 for two</span>
              </div>
              <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="text-emerald-600 dark:text-emerald-400">
                <span>Free delivery on ₹199+</span>
              </div>
            </div>

            {/* OFFERS & DISCOUNTS CAROUSEL STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="size-7 rounded-xl bg-orange-500 text-white grid place-items-center font-black shrink-0">
                    %
                  </span>
                  <div className="truncate">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">FLAT 50% OFF up to ₹100</p>
                    <p className="text-[10px] text-slate-500">USE CODE <span className="font-bold text-orange-600 dark:text-orange-400">NAVA50</span></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText("NAVA50");
                    toast.success("Coupon code NAVA50 copied!");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500 text-orange-600 hover:text-white font-black text-[11px] transition-colors shrink-0 cursor-pointer"
                >
                  COPY
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-transparent border border-cyan-500/20 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="size-7 rounded-xl bg-cyan-500 text-white grid place-items-center font-black shrink-0">
                    ⚡
                  </span>
                  <div className="truncate">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">Free Delivery Guarantee</p>
                    <p className="text-[10px] text-slate-500">No surge pricing for your area</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MENU CONTROLS & SWIGGY/ZOMATO FILTER BAR (STICKY) */}
        <div className="sticky top-[60px] z-20 backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 py-3 border-y border-slate-200/80 dark:border-white/10 -mx-4 px-4 sm:-mx-6 sm:px-6 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* IN-MENU SEARCH BAR */}
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search menu in ${store.name}…`}
                className="w-full h-10 pl-9 pr-8 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold outline-none focus:border-cyan-500 text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 size-4 grid place-items-center cursor-pointer"
                >
                  <FiX className="size-3.5" />
                </button>
              )}
            </div>

            {/* PURE VEG / NON-VEG / BESTSELLER TOGGLE PILLS */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Veg Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  setVegOnly((v) => !v);
                  if (!vegOnly) setNonVegOnly(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition-all cursor-pointer",
                  vegOnly
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                )}
              >
                <span className="size-3.5 rounded-sm border border-emerald-600 grid place-items-center p-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                </span>
                <span>VEG</span>
              </button>

              {/* Non-Veg Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  setNonVegOnly((nv) => !nv);
                  if (!nonVegOnly) setVegOnly(false);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition-all cursor-pointer",
                  nonVegOnly
                    ? "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                )}
              >
                <span className="size-3.5 rounded-sm border border-rose-600 grid place-items-center p-0.5">
                  <span className="size-1.5 bg-rose-600 rotate-45" />
                </span>
                <span>NON-VEG</span>
              </button>

              {/* Bestseller Filter */}
              <button
                type="button"
                onClick={() => setBestsellerOnly((b) => !b)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-black transition-all cursor-pointer",
                  bestsellerOnly
                    ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                )}
              >
                <FiStar className={cn("size-3.5", bestsellerOnly && "fill-current")} />
                <span>Bestseller</span>
              </button>
            </div>
          </div>

          {/* HORIZONTAL SWIGGY-STYLE CATEGORY PILLS BAR */}
          {groupedCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {groupedCategories.map((group) => {
                const icon = CATEGORY_ICONS[group.title] || "🍽️";
                const isSelected = activeCategory === group.title;

                return (
                  <button
                    key={group.title}
                    type="button"
                    onClick={() => scrollToCategory(group.title)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer",
                      isSelected
                        ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10"
                    )}
                  >
                    <span>{icon}</span>
                    <span>{group.title}</span>
                    <span className="text-[10px] opacity-75 font-extrabold">({group.items.length})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. DISH MENU SECTIONS (ZOMATO / SWIGGY SIGNATURE ROW CARDS) */}
        {groupedCategories.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-12 text-center space-y-3">
            <div className="size-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-2xl">
              🔍
            </div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">No dishes match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with a different keyword or turn off the dietary filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setVegOnly(false);
                setNonVegOnly(false);
                setBestsellerOnly(false);
              }}
              className="px-4 py-2 rounded-full bg-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedCategories.map((group) => {
              const isCollapsed = collapsedCategories[group.title] ?? false;
              const sectionId = `section-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              const icon = CATEGORY_ICONS[group.title] || "🍽️";

              return (
                <section
                  key={group.title}
                  id={sectionId}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 overflow-hidden shadow-sm scroll-mt-36"
                >
                  {/* Category Header Bar with Collapse Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleCategoryCollapse(group.title)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/80 border-b border-slate-100 dark:border-white/5 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{icon}</span>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        {group.title}
                      </h2>
                      <span className="size-5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 text-[11px] font-black grid place-items-center">
                        {group.items.length}
                      </span>
                    </div>

                    <div className="text-slate-400">
                      {isCollapsed ? <FiChevronDown className="size-5" /> : <FiChevronUp className="size-5" />}
                    </div>
                  </button>

                  {/* Dish List Items */}
                  {!isCollapsed && (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {group.items.map((dish) => {
                        const cartEntry = cartItemMap.get(dish.id);
                        const qty = cartEntry?.qty || 0;
                        const isBestseller = (dish.rating ?? 0) >= 4.7;

                        return (
                          <article
                            key={dish.id}
                            className="p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            {/* LEFT SIDE: DETAILS */}
                            <div className="flex-1 min-w-0 space-y-2">
                              {/* Veg / Non-Veg & Bestseller Badge */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "size-4 rounded-sm border grid place-items-center p-0.5 shrink-0",
                                    dish.is_veg
                                      ? "border-emerald-600"
                                      : "border-rose-600"
                                  )}
                                  title={dish.is_veg ? "Vegetarian" : "Non-Vegetarian"}
                                >
                                  {dish.is_veg ? (
                                    <span className="size-2 rounded-full bg-emerald-600" />
                                  ) : (
                                    <span className="size-2 bg-rose-600 rotate-45" />
                                  )}
                                </span>

                                {isBestseller && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-[10px]">
                                    <FiStar className="size-2.5 fill-current" /> Bestseller
                                  </span>
                                )}
                              </div>

                              {/* Dish Title */}
                              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                                {dish.name}
                              </h3>

                              {/* Dish Price */}
                              <div className="flex items-center gap-2 font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                <span>{currency(dish.price)}</span>
                                {dish.mrp && dish.mrp > dish.price && (
                                  <span className="text-xs font-semibold text-slate-400 line-through">
                                    {currency(dish.mrp)}
                                  </span>
                                )}
                              </div>

                              {/* Rating & Reviews */}
                              {dish.rating ? (
                                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                  <div className="flex items-center gap-0.5 bg-emerald-500/15 px-1.5 py-0.5 rounded-md">
                                    <FiStar className="size-3 fill-current" />
                                    <span>{dish.rating}</span>
                                  </div>
                                  <span className="text-slate-400">
                                    ({dish.sales || 42} orders)
                                  </span>
                                </div>
                              ) : null}

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {dish.description || `${dish.name} prepared fresh with authentic ingredients and aromatic spices.`}
                              </p>
                            </div>

                            {/* RIGHT SIDE: DISH PHOTO & OVERLAPPING "ADD" / QUANTITY STEPPER BUTTON */}
                            <div className="relative shrink-0 flex flex-col items-center">
                              {/* Dish Image */}
                              <div className="relative size-28 sm:size-34 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-sm">
                                {dish.image_url ? (
                                  <img
                                    src={dish.image_url}
                                    alt={dish.name}
                                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="size-full grid place-items-center text-3xl">
                                    🍛
                                  </div>
                                )}
                              </div>

                              {/* Overlapping Floating ADD / Stepper Button */}
                              <div className="absolute -bottom-3 inset-x-2 flex justify-center">
                                {qty > 0 ? (
                                  /* ACTIVE QUANTITY STEPPER (- QTY +) */
                                  <div className="flex items-center justify-between w-24 sm:w-26 h-9 rounded-xl bg-slate-950 text-white border border-cyan-400/40 shadow-lg shadow-cyan-500/20 px-2 select-none">
                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.8 }}
                                      onClick={() => {
                                        if (cartEntry) {
                                          setQty(cartEntry.id, qty - 1);
                                        }
                                      }}
                                      className="size-6 grid place-items-center text-cyan-400 hover:text-white cursor-pointer"
                                      aria-label="Decrease quantity"
                                    >
                                      <FiMinus className="size-3.5 stroke-[3]" />
                                    </motion.button>

                                    <span className="font-black text-xs sm:text-sm text-cyan-300">
                                      {qty}
                                    </span>

                                    <motion.button
                                      type="button"
                                      whileTap={{ scale: 0.8 }}
                                      onClick={() => {
                                        if (cartEntry) {
                                          setQty(cartEntry.id, qty + 1);
                                        }
                                      }}
                                      className="size-6 grid place-items-center text-cyan-400 hover:text-white cursor-pointer"
                                      aria-label="Increase quantity"
                                    >
                                      <FiPlus className="size-3.5 stroke-[3]" />
                                    </motion.button>
                                  </div>
                                ) : (
                                  /* INACTIVE "ADD" BUTTON */
                                  <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => addToCart(dish.id, 1)}
                                    className="w-24 sm:w-26 h-9 rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <span>ADD</span>
                                    <FiPlus className="size-3.5 stroke-[3]" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. SWIGGY / ZOMATO SIGNATURE FLOATING "BROWSE MENU" FAB */}
      {groupedCategories.length > 0 && (
        <div className="fixed bottom-24 right-4 z-40">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950 text-white font-black text-xs tracking-wider uppercase border border-cyan-400/40 shadow-2xl shadow-slate-950/60 cursor-pointer backdrop-blur-xl"
          >
            <span>📖 BROWSE MENU</span>
            <span className="size-5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black grid place-items-center">
              {groupedCategories.length}
            </span>
          </motion.button>
        </div>
      )}

      {/* 7. "BROWSE MENU" DIALOG MODAL (PLACED COMFORTABLY ABOVE BOTTOM NAV) */}
      <AnimatePresence>
        {menuModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuModalOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-5 shadow-2xl z-10 max-h-[70vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    Menu Categories
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 grid place-items-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <FiX className="size-4" />
                </button>
              </div>

              {/* Category List */}
              <div className="flex-1 overflow-y-auto py-2 space-y-1 divide-y divide-slate-100 dark:divide-white/5">
                {groupedCategories.map((group) => {
                  const icon = CATEGORY_ICONS[group.title] || "🍽️";

                  return (
                    <button
                      key={group.title}
                      type="button"
                      onClick={() => scrollToCategory(group.title)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{icon}</span>
                        <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                          {group.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                        {group.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
