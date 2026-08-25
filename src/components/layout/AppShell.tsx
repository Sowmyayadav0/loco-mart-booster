import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiAward,
  FiBell,
  FiChevronDown,
  FiChevronRight,
  FiCompass,
  FiCreditCard,
  FiGlobe,
  FiHeadphones,
  FiHeart,
  FiHome,
  FiLock,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiSettings,
  FiShield,
  FiShoppingCart,
  FiTag,
  FiTruck,
  FiUser,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cartTotals, useCart } from "@/hooks/useCart";
import { api } from "@/lib/api";
import { navaStore } from "@/lib/navaStore";
import { cn } from "@/lib/utils";

import { LocationPickerModal } from "@/components/location/LocationPickerModal";
import { BottomNav } from "@/components/layout/BottomNav";
import { useApp } from "@/context/AppContext";
import { ThemeToggle } from "@/components/common/ThemeToggle";

function useUnread() {
  const { signedIn } = useAuth();
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: api.notifications,
    enabled: signedIn,
  });
  return (data ?? []).filter((n) => !n.is_read).length;
}

// Subcategories under FOOD (Restaurants & Cuisines ONLY)
const FOOD_SUBCATEGORIES = [
  { slug: "restaurants", label: "Restaurants & Biryani", icon: "🍲" },
  { slug: "restaurants", label: "Rolls & Wraps", icon: "🌯" },
  { slug: "restaurants", label: "Pizza & Pasta", icon: "🍕" },
  { slug: "restaurants", label: "Burgers & Fast Food", icon: "🍔" },
  { slug: "restaurants", label: "Sweets & Desserts", icon: "🧁" },
] as const;

// Subcategories under SHOP (Groceries, Supermarket, Pharmacy, Fashion, etc.)
const SHOP_SUBCATEGORIES = [
  { slug: "grocery", label: "Groceries & Snacks", icon: "🛒" },
  { slug: "dairy", label: "Dairy & Eggs", icon: "🥛" },
  { slug: "bakery", label: "Bakery & Cakes", icon: "🥐" },
  { slug: "fruits", label: "Fruits & Veggies", icon: "🍎" },
  { slug: "meat", label: "Meat & Seafood", icon: "🍗" },
  { slug: "pharmacy", label: "Pharmacy & Wellness", icon: "💊" },
  { slug: "fashion", label: "Fashion & Apparel", icon: "👗" },
  { slug: "electronics", label: "Mobiles & Electronics", icon: "📱" },
  { slug: "pets", label: "Pet Supplies", icon: "🐶" },
  { slug: "flowers", label: "Flowers & Gifts", icon: "💐" },
  { slug: "hardware", label: "Hardware & Tools", icon: "🔧" },
] as const;

// Account Sidebar Quick Tools Section
const ACCOUNT_SIDEBAR_TOOLS = [
  { to: "/orders", label: "My Orders", icon: FiPackage },
  { to: "/wishlist", label: "My Wishlist", icon: FiHeart },
  { to: "/account", label: "My Addresses", icon: FiMapPin },
  { to: "/offers", label: "Coupons & Offers", icon: FiTag },
  { to: "/account", label: "Help & Support", icon: FiHeadphones },
  { to: "/account", label: "Settings", icon: FiSettings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { signedIn, user } = useAuth();
  const { data: cart } = useCart();
  const { count, subtotal } = cartTotals(cart ?? []);
  const unread = useUnread();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => navaStore.getActiveLocation());
  const [foodDropdownOpen, setFoodDropdownOpen] = useState(true);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(true);

  const closeSidebar = () => {
    setSidebarOpen(false);
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    const handleLocationSync = () => {
      setSelectedLocation(navaStore.getActiveLocation());
    };
    window.addEventListener("storage", handleLocationSync);
    window.addEventListener("nava-location-change", handleLocationSync);
    return () => {
      window.removeEventListener("storage", handleLocationSync);
      window.removeEventListener("nava-location-change", handleLocationSync);
    };
  }, []);

  const userName = user?.full_name || user?.email?.split("@")[0] || "Rohan";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    navaStore.setSession(null, null);
    setProfileMenuOpen(false);
    void navigate({ to: "/" });
  };

  // If on Auth Page (/auth) or Launch Page (/launch), render full-screen layout without top header or sidebar
  if (pathname === "/auth" || pathname === "/launch") {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center p-0 select-none">
        <main className="w-full h-full flex items-center justify-center overflow-hidden">{children}</main>
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / 199) * 100));

  const { theme, activeHub, setActiveHub, getHomeRoute } = useApp();
  const isDark = theme === "dark";
  const homeTarget = getHomeRoute();

  // Track active service hub across navigation
  useEffect(() => {
    if (pathname === "/category/shop" || pathname.startsWith("/category/shop")) {
      setActiveHub("shop");
    } else if (pathname === "/" || pathname === "/category/food" || pathname.startsWith("/category/food")) {
      setActiveHub("food");
    } else if (pathname.startsWith("/rides")) {
      setActiveHub("ride");
    } else if (pathname.startsWith("/courier")) {
      setActiveHub("courier");
    } else if (pathname.startsWith("/services")) {
      setActiveHub("services");
    }
  }, [pathname, setActiveHub]);

  // Determine per-lamp ambient tint colors for the full page
  const isFood = pathname === "/" || pathname.includes("food") || pathname.includes("restaurant");
  const isShop = pathname.includes("shop") || pathname.includes("grocery") || pathname.includes("dairy") || pathname.includes("bakery") || pathname.includes("fruits") || pathname.includes("meat");
  const isRide = pathname.includes("ride");
  const isCourier = pathname.includes("courier");

  const lampColors = isDark
    ? isShop
      ? { bg: "#0f0a1a", glow1: "rgba(168, 85, 247, 0.12)", glow2: "rgba(139, 92, 246, 0.06)" }
      : isRide
      ? { bg: "#030d12", glow1: "rgba(6, 182, 212, 0.12)", glow2: "rgba(34, 211, 238, 0.06)" }
      : isCourier
      ? { bg: "#030f09", glow1: "rgba(16, 185, 129, 0.12)", glow2: "rgba(52, 211, 153, 0.06)" }
      : { bg: "#120d04", glow1: "rgba(251, 146, 60, 0.12)", glow2: "rgba(245, 158, 11, 0.06)" }
    : isShop
    ? { bg: "#faf5ff", glow1: "rgba(168, 85, 247, 0.08)", glow2: "rgba(139, 92, 246, 0.04)" }
    : isRide
    ? { bg: "#f0fdfa", glow1: "rgba(6, 182, 212, 0.08)", glow2: "rgba(34, 211, 238, 0.04)" }
    : isCourier
    ? { bg: "#f0fdf4", glow1: "rgba(16, 185, 129, 0.08)", glow2: "rgba(52, 211, 153, 0.04)" }
    : { bg: "#fffbf5", glow1: "rgba(251, 146, 60, 0.08)", glow2: "rgba(245, 158, 11, 0.04)" };

  return (
    <div className="relative flex min-h-screen text-foreground transition-colors duration-700" style={{ backgroundColor: lampColors.bg }}>
      {/* WHOLE-PAGE AMBIENT LAMP TINT — top radial bloom + full floor bleed */}
      <motion.div
        key={isFood ? "food" : isShop ? "shop" : isRide ? "ride" : "courier"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 140% 55% at 50% -5%, ${lampColors.glow1} 0%, transparent 75%),
            radial-gradient(ellipse 100% 40% at 50% 105%, ${lampColors.glow2} 0%, transparent 70%)
          `,
        }}
      />
      {/* LEFT SIDEBAR NAVIGATION DRAWER */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-white/10 bg-slate-950/90 backdrop-blur-2xl text-white p-4 transition-transform duration-300 w-[290px] max-w-[85vw] overflow-y-auto no-scrollbar shadow-2xl",
          (sidebarOpen || mobileSidebarOpen) ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-4">
          {/* Logo Badge & Close Button */}
          <div className="flex items-center justify-between px-1 py-1">
            <Link
              to={homeTarget.to as any}
              params={homeTarget.params as any}
              onClick={closeSidebar}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <span className="grid size-9 place-items-center rounded-2xl bg-emerald-600 text-lg font-black text-white shadow-sm transition-transform group-hover:scale-105">
                L
              </span>
              <div className="leading-none">
                <span className="text-lg font-black tracking-tight text-foreground">LocoMart</span>
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">
                  Super App
                </span>
              </div>
            </Link>

            {/* Always Visible Close (X) Icon Button inside Menu Header */}
            <button
              type="button"
              onClick={closeSidebar}
              className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-400/30 transition-all shrink-0"
              aria-label="Close Menu"
              title="Close Menu"
            >
              <FiX className="size-4.5" />
            </button>
          </div>

          {/* Primary Sidebar Items Navigation List */}
          <nav className="space-y-1 pt-1">
            {/* HOME ITEM */}
            <Link
              to={homeTarget.to as any}
              params={homeTarget.params as any}
              onClick={closeSidebar}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                pathname === "/" || pathname === homeTarget.pathname
                  ? "bg-emerald-500/20 text-emerald-300 font-extrabold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🏠</span>
                <span>Home</span>
              </div>
            </Link>

            {/* FOOD CATEGORY DROPDOWN */}
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-xl hover:bg-white/10 transition-all pr-2">
                <Link
                  to="/category/$slug"
                  params={{ slug: "food" }}
                  onClick={closeSidebar}
                  className={cn(
                    "flex-1 flex items-center justify-between px-3 py-2 text-xs font-bold",
                    pathname.includes("food")
                      ? "text-emerald-400 font-extrabold"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">🍿</span>
                    <span>Food</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-400">
                    EXPRESS
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setFoodDropdownOpen(!foodDropdownOpen)}
                  className="p-1.5 text-slate-400 hover:text-white"
                  aria-label="Toggle Food Subcategories"
                >
                  <FiChevronDown className={cn("size-3.5 transition-transform", foodDropdownOpen ? "rotate-180" : "")} />
                </button>
              </div>

              {/* Food Subcategories Dropdown Items */}
              {foodDropdownOpen ? (
                <div className="pl-6 space-y-0.5 border-l-2 border-emerald-500/20 ml-4 py-1">
                  {FOOD_SUBCATEGORIES.map((sub) => {
                    const active = pathname.includes(sub.slug);
                    return (
                      <Link
                        key={sub.slug}
                        to="/category/$slug"
                        params={{ slug: sub.slug }}
                        onClick={closeSidebar}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all",
                          active
                            ? "bg-emerald-500/15 text-emerald-400 font-extrabold"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span className="text-xs">{sub.icon}</span>
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* SHOP CATEGORY DROPDOWN */}
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-xl hover:bg-white/10 transition-all pr-2">
                <Link
                  to="/category/$slug"
                  params={{ slug: "shop" }}
                  onClick={closeSidebar}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-3 py-2 text-xs font-bold",
                    pathname.includes("shop")
                      ? "text-purple-400 font-extrabold"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  <span className="text-sm">🛍️</span>
                  <span>Shop</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                  className="p-1.5 text-slate-400 hover:text-white"
                  aria-label="Toggle Shop Subcategories"
                >
                  <FiChevronDown className={cn("size-3.5 transition-transform", shopDropdownOpen ? "rotate-180" : "")} />
                </button>
              </div>

              {/* Shop Subcategories Dropdown Items */}
              {shopDropdownOpen ? (
                <div className="pl-6 space-y-0.5 border-l-2 border-purple-500/20 ml-4 py-1">
                  {SHOP_SUBCATEGORIES.map((sub) => {
                    const active = pathname.includes(sub.slug);
                    return (
                      <Link
                        key={sub.slug}
                        to="/category/$slug"
                        params={{ slug: sub.slug }}
                        onClick={closeSidebar}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all",
                          active
                            ? "bg-purple-500/15 text-purple-400 font-extrabold"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <span className="text-xs">{sub.icon}</span>
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* RIDES */}
            <Link
              to="/rides"
              onClick={closeSidebar}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                pathname.startsWith("/rides")
                  ? "bg-cyan-500/20 text-cyan-300 font-extrabold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🛺</span>
                <span>Rides</span>
              </div>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-cyan-400">
                LIVE
              </span>
            </Link>

            {/* PARCEL */}
            <Link
              to="/courier"
              onClick={closeSidebar}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                pathname.startsWith("/courier")
                  ? "bg-emerald-500/20 text-emerald-300 font-extrabold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">📦</span>
                <span>Parcel</span>
              </div>
            </Link>

            {/* OFFERS */}
            <Link
              to="/offers"
              onClick={closeSidebar}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                pathname.startsWith("/offers")
                  ? "bg-orange-500/20 text-orange-300 font-extrabold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🎟️</span>
                <span>Offers & Deals</span>
              </div>
            </Link>

            {/* EXPLORE ALL */}
            <Link
              to="/explore"
              onClick={closeSidebar}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                pathname.startsWith("/explore")
                  ? "bg-white/15 text-white font-extrabold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">⋮</span>
                <span>More Services</span>
              </div>
            </Link>
          </nav>

          <div className="border-t border-white/10 my-2" />

          {/* Account Tools List */}
          <div className="space-y-1">
            {ACCOUNT_SIDEBAR_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.label}
                  to={tool.to}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Icon className="size-4 text-slate-500" />
                  <span>{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Unlock Free Delivery Promo Card */}
        <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-950/40 p-3 space-y-2">
          <div>
            <h4 className="text-[11px] font-black text-foreground">Unlock Free Delivery</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Add items worth <b className="text-emerald-700">₹199</b> to get <b className="text-emerald-700">FREE delivery</b>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
            <span>₹0</span>
            <span>₹199</span>
          </div>
        </div>
      </aside>

      {/* BACKDROP OVERLAY */}
      {(sidebarOpen || mobileSidebarOpen) ? (
        <div
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={closeSidebar}
        />
      ) : null}

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
        {/* TOP HEADER BAR - SLEEK CRYSTAL GLASS NAVBAR */}
        <header
          className={cn(
            "sticky top-0 z-30 flex items-center justify-between gap-3 sm:gap-4 border-b backdrop-blur-3xl backdrop-saturate-200 px-3.5 sm:px-6 py-2.5 transition-colors duration-300",
            isDark
              ? "border-white/10 bg-slate-950/80 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.12)]"
              : "border-slate-200/80 bg-white/85 text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)]"
          )}
        >
          {/* Top Laser Specular Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

          {/* Left: Delivery Location Capsule */}
          <div className="flex items-center min-w-0">
            {/* Location Selector Badge - Luxury Crystal Radar Pill */}
            <button
              type="button"
              onClick={() => setLocationPickerOpen(true)}
              className={cn(
                "group flex items-center gap-2 rounded-xl sm:rounded-2xl border px-2.5 sm:px-3 py-1.5 text-left backdrop-blur-md transition-all duration-200 shadow-xs max-w-[175px] sm:max-w-[250px] shrink-0 cursor-pointer active:scale-95",
                isDark
                  ? "bg-white/5 hover:bg-white/10 border-white/15 hover:border-cyan-400/50 text-white"
                  : "bg-slate-100/90 hover:bg-slate-200/80 border-slate-200 hover:border-cyan-500/50 text-slate-900"
              )}
              title="Change Delivery Location"
            >
              {/* Pulsing Live Radar Indicator */}
              <div className="relative flex size-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-cyan-400 shadow-[0_0_8px_#00BCD4]" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className={cn("text-[9px] font-bold tracking-wider uppercase leading-none", isDark ? "text-slate-400" : "text-slate-500")}>
                  Deliver to
                </span>
                <div className="flex items-center gap-1 min-w-0 mt-0.5">
                  <span className={cn("truncate font-extrabold text-xs transition-colors", isDark ? "text-white group-hover:text-cyan-300" : "text-slate-900 group-hover:text-cyan-600")}>
                    {selectedLocation.split(",")[0] || "Select Location"}
                  </span>
                  <FiChevronDown className={cn("size-3 shrink-0 transition-transform group-hover:translate-y-0.5", isDark ? "text-slate-400 group-hover:text-cyan-300" : "text-slate-500 group-hover:text-cyan-600")} />
                </div>
              </div>
            </button>
          </div>

          {/* Right Header Navigation Icons & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Smooth Theme Toggle Switcher */}
            <ThemeToggle className="shrink-0" />

            <Link
              to="/offers"
              className={cn(
                "hidden lg:flex items-center gap-1.5 text-xs font-bold rounded-xl px-3 py-1.5 transition-all shadow-xs border",
                isDark
                  ? "text-amber-300 bg-amber-400/10 border-amber-300/30 hover:bg-amber-400/20 hover:border-amber-300/60"
                  : "text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100/80"
              )}
            >
              <FiTag className="size-3.5 text-amber-500" />
              <span>Offers</span>
            </Link>

            <Link
              to="/orders"
              className={cn(
                "hidden lg:flex items-center gap-1.5 text-xs font-bold rounded-xl px-3 py-1.5 transition-all shadow-xs border",
                isDark
                  ? "text-cyan-200 bg-cyan-400/10 border-cyan-300/30 hover:bg-cyan-400/20 hover:border-cyan-300/60"
                  : "text-cyan-800 bg-cyan-50 border-cyan-200 hover:bg-cyan-100/80"
              )}
            >
              <FiPackage className="size-3.5 text-cyan-500" />
              <span>Orders</span>
            </Link>

            <Link
              to="/wishlist"
              className={cn(
                "hidden md:grid size-8.5 sm:size-9 place-items-center rounded-xl border transition-all shrink-0 shadow-xs",
                isDark
                  ? "border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400/60"
                  : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
              )}
              title="Wishlist"
            >
              <FiHeart className="size-4 stroke-[2]" />
            </Link>

            {/* Notifications Icon Button */}
            <Link
              to="/notifications"
              className={cn(
                "relative grid size-8.5 sm:size-9 place-items-center rounded-xl border transition-all shrink-0 backdrop-blur-md shadow-xs active:scale-95",
                isDark
                  ? "border-white/15 bg-white/5 text-slate-200 hover:text-white hover:bg-white/15 hover:border-white/30"
                  : "border-slate-200 bg-slate-100/90 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80"
              )}
              aria-label="Notifications"
              title="Notifications"
            >
              <FiBell className="size-4 stroke-[2]" />
              {unread > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-slate-950 shadow-md z-10 animate-pulse">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Link>

            {/* Cart Button - Glowing 3D Pill */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 px-3 sm:px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-[0_4px_16px_rgba(0,188,212,0.35)] transition-all hover:scale-105 active:scale-95"
            >
              <FiShoppingCart className="size-4 stroke-[2.5]" />
              <span className="hidden sm:inline font-black">Cart</span>
              {count > 0 ? (
                <span className="grid min-w-4 h-4 place-items-center rounded-full bg-slate-950 px-1 text-[10px] font-black text-cyan-300 shadow-xs">
                  {count}
                </span>
              ) : null}
            </Link>

            {/* Profile Avatar Button */}
            <Link
              to="/account"
              className="relative grid size-8.5 sm:size-9 place-items-center rounded-full bg-gradient-to-tr from-cyan-500 via-teal-600 to-slate-900 text-white font-black text-xs border-2 border-white/30 hover:border-cyan-400 shadow-[0_2px_10px_rgba(0,188,212,0.3)] hover:scale-105 active:scale-95 transition-all"
              title={userName}
            >
              {userInitial}
              {/* Online indicator dot */}
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 shadow-xs" />
            </Link>
          </div>
        </header>

        {/* Page Body View */}
        <main className="relative flex-1 pb-24 sm:pb-20 z-10">{children}</main>

        {/* ULTRA-SMOOTH GLASS FLOATING BOTTOM NAVIGATION DOCK (HOME, SERVICES, ORDERS & INTEGRATED CART BANNER) */}
        <BottomNav />
      </div>

      {/* LOCATION PICKER MODAL */}
      <LocationPickerModal
        isOpen={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onSelectLocation={(loc) => {
          const locStr = `${loc.address.split(",")[0]}, ${loc.pincode}`;
          navaStore.setActiveLocation(locStr);
        }}
      />
    </div>
  );
}
