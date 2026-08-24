import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
  FiSearch,
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
  { slug: "restaurants", label: "Arabian & Mandi", icon: "🍢" },
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
  const [term, setTerm] = useState("");

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

  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-background text-foreground">
      {/* LEFT SIDEBAR NAVIGATION DRAWER */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-slate-200 dark:border-border bg-white dark:bg-card p-4 transition-transform duration-300 w-[290px] max-w-[85vw] overflow-y-auto no-scrollbar shadow-2xl",
          (sidebarOpen || mobileSidebarOpen) ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-4">
          {/* Logo Badge & Close Button */}
          <div className="flex items-center justify-between px-1 py-1">
            <Link to="/" onClick={closeSidebar} className="flex items-center gap-2.5 group">
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
              className="grid size-8 place-items-center rounded-full border border-border/70 bg-muted/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shrink-0"
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
              to="/"
              onClick={closeSidebar}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                pathname === "/"
                  ? "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold shadow-2xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🏠</span>
                <span>Home</span>
              </div>
            </Link>

            {/* FOOD CATEGORY DROPDOWN */}
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-xl hover:bg-muted transition-all pr-2">
                <Link
                  to="/category/$slug"
                  params={{ slug: "food" }}
                  onClick={closeSidebar}
                  className={cn(
                    "flex-1 flex items-center justify-between px-3 py-2 text-xs font-bold",
                    pathname.includes("food")
                      ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">🍿</span>
                    <span>Food</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                    EXPRESS
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setFoodDropdownOpen(!foodDropdownOpen)}
                  className="p-1.5 text-muted-foreground hover:text-foreground"
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
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
              <div className="flex items-center justify-between rounded-xl hover:bg-muted transition-all pr-2">
                <Link
                  to="/category/$slug"
                  params={{ slug: "shop" }}
                  onClick={closeSidebar}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-3 py-2 text-xs font-bold",
                    pathname.includes("shop")
                      ? "text-purple-700 dark:text-purple-400 font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-sm">🛍️</span>
                  <span>Shop</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                  className="p-1.5 text-muted-foreground hover:text-foreground"
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
                            ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 font-extrabold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  ? "bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold shadow-2xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🛺</span>
                <span>Rides</span>
              </div>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">
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
                  ? "bg-blue-100/70 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-extrabold shadow-2xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  ? "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold shadow-2xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  ? "bg-muted text-foreground font-extrabold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">⋮</span>
                <span>More Services</span>
              </div>
            </Link>
          </nav>

          <div className="border-t border-border/60 my-2" />

          {/* Account Tools List */}
          <div className="space-y-1">
            {ACCOUNT_SIDEBAR_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.label}
                  to={tool.to}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 rounded-xl px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Icon className="size-4 text-muted-foreground" />
                  <span>{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Unlock Free Delivery Promo Card */}
        <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 space-y-2">
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
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-cyan-500/30 bg-gradient-to-r from-slate-900 via-[#044D63] to-teal-950 px-4 py-2.5 backdrop-blur-xl shadow-lg text-white">
          <div className="flex items-center gap-2.5">
            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center shadow-md shrink-0 backdrop-blur-md"
              aria-label="Open Sidebar"
              title="Open Menu"
            >
              <FiMenu className="size-5" />
            </button>

            {/* Location Selector Badge - Vibrant Pill */}
            <button
              type="button"
              onClick={() => setLocationPickerOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-cyan-400/15 border border-cyan-400/40 px-3 py-1.5 text-xs text-cyan-200 backdrop-blur-md transition-all hover:bg-cyan-400/25 shadow-sm max-w-[140px] sm:max-w-[200px] shrink-0"
              title="Change Delivery Location"
            >
              <FiMapPin className="text-[#00BCD4] size-3.5 shrink-0 animate-pulse" />
              <span className="truncate font-black text-xs text-white">
                {selectedLocation.split(",")[0] || "Location"}
              </span>
              <FiChevronDown className="size-3 shrink-0 text-cyan-300" />
            </button>
          </div>

          {/* Right Header Navigation Icons & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/offers"
              className="hidden lg:flex items-center gap-1 text-xs font-black text-amber-300 bg-amber-400/15 border border-amber-300/40 rounded-xl px-2.5 py-1.5 hover:bg-amber-400/25 transition-all"
            >
              <FiTag className="size-3.5 text-amber-300" /> Offers
            </Link>

            <Link
              to="/orders"
              className="hidden lg:flex items-center gap-1 text-xs font-black text-cyan-200 bg-cyan-400/15 border border-cyan-300/40 rounded-xl px-2.5 py-1.5 hover:bg-cyan-400/25 transition-all"
            >
              <FiPackage className="size-3.5 text-cyan-300" /> Orders
            </Link>

            <Link
              to="/wishlist"
              className="hidden md:grid size-9 place-items-center rounded-xl border border-rose-400/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 transition-all shrink-0"
              title="Wishlist"
            >
              <FiHeart className="size-4.5 stroke-[2]" />
            </Link>

            {/* Notifications Icon Button */}
            <Link
              to="/notifications"
              className="relative grid size-9 place-items-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all shrink-0 backdrop-blur-md"
              aria-label="Notifications"
              title="Notifications"
            >
              <FiBell className="size-4.5 stroke-[2]" />
              {unread > 0 ? (
                <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-slate-900 shadow-md z-10">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-emerald-400 hover:opacity-95 px-3 py-1.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105"
            >
              <FiShoppingCart className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 ? (
                <span className="grid min-w-4 h-4 place-items-center rounded-full bg-slate-950 px-1 text-[10px] font-black text-cyan-300 shadow-2xs">
                  {count}
                </span>
              ) : null}
            </Link>

            {/* Profile Avatar Button */}
            <Link
              to="/account"
              className="grid size-9 place-items-center rounded-full bg-gradient-to-tr from-cyan-400 to-[#044D63] text-white font-extrabold text-xs border-2 border-white/40 shadow-md hover:scale-105 transition-transform"
              title={userName}
            >
              {userInitial}
            </Link>
          </div>
        </header>

        {/* Page Body View */}
        <main className="flex-1 pb-16">{children}</main>
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
