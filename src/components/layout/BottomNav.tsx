import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiZap,
  FiNavigation,
  FiLayers,
  FiX,
  FiArrowRight,
  FiTrash2,
} from "react-icons/fi";
import { useCart, useCartActions, cartTotals } from "@/hooks/useCart";
import { useApp } from "@/context/AppContext";
import { currency } from "@/utils/format";
import { cn } from "@/lib/utils";

// 4 Elevated Master Categories in the Circular Titanium-Glass Fanout Hub
const ORBITAL_SERVICES = [
  {
    id: "food",
    name: "Food",
    to: "/category/$slug",
    params: { slug: "food" },
    icon: FiZap,
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.5)",
    borderHighlight: "border-amber-400/70",
    gradient: "radial-gradient(circle at 40% 30%, #5a2204 0%, #1e1b4b 70%, #030712 100%)",
    x: -88,
    y: -54,
  },
  {
    id: "shop",
    name: "Shop",
    to: "/category/$slug",
    params: { slug: "shop" },
    icon: FiShoppingBag,
    accent: "#A855F7",
    glow: "rgba(168, 85, 247, 0.5)",
    borderHighlight: "border-purple-400/70",
    gradient: "radial-gradient(circle at 40% 30%, #4a0d78 0%, #1e1b4b 70%, #030712 100%)",
    x: -32,
    y: -106,
  },
  {
    id: "rides",
    name: "Rides",
    to: "/rides",
    icon: FiNavigation,
    accent: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.5)",
    borderHighlight: "border-cyan-400/70",
    gradient: "radial-gradient(circle at 40% 30%, #0c4a6e 0%, #1e1b4b 70%, #030712 100%)",
    x: 32,
    y: -106,
  },
  {
    id: "services",
    name: "Services",
    to: "/services",
    icon: FiLayers,
    accent: "#10B981",
    glow: "rgba(16, 185, 129, 0.5)",
    borderHighlight: "border-emerald-400/70",
    gradient: "radial-gradient(circle at 40% 30%, #065f46 0%, #1e1b4b 70%, #030712 100%)",
    x: 88,
    y: -54,
  },
];

export function BottomNav() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, activeHub, setActiveHub, getHomeRoute } = useApp();
  const isDark = theme === "dark";
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);

  // Cart integration & Actions
  const { data: cart = [] } = useCart();
  const { clearCart } = useCartActions();
  const { count, subtotal, active, store } = cartTotals(cart);

  // Ultra-smooth scroll detection without layout thrashing
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastY;

          if (currentY < 60) {
            setIsScrolledDown(false);
          } else if (delta > 8) {
            setIsScrolledDown(true);
          } else if (delta < -5) {
            setIsScrolledDown(false);
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-close menu on route change
  useEffect(() => {
    setServicesMenuOpen(false);
    setIsScrolledDown(false);
  }, [pathname]);

  const isCartOrCheckout = pathname.startsWith("/cart") || pathname.startsWith("/checkout");
  const hasCartItems = count > 0 && !isCartOrCheckout;

  const isCollapsed = isScrolledDown && !servicesMenuOpen;

  const homeTarget = getHomeRoute();
  const isHomeActive =
    pathname === homeTarget.pathname ||
    (activeHub === "food" && (pathname === "/" || pathname === "/category/food")) ||
    (activeHub === "shop" && pathname === "/category/shop") ||
    (activeHub === "ride" && pathname === "/rides") ||
    (activeHub === "courier" && pathname === "/courier") ||
    (activeHub === "services" && pathname === "/services");

  const isOrdersActive = pathname.startsWith("/orders");
  const isServicesActive =
    pathname.startsWith("/services") ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/rides") ||
    pathname.startsWith("/courier") ||
    pathname.startsWith("/category");

  const handleSelectService = useCallback((opt: (typeof ORBITAL_SERVICES)[0]) => {
    setServicesMenuOpen(false);
    setActiveHub(opt.id as any);
    if ("params" in opt && opt.params) {
      void navigate({ to: opt.to, params: opt.params });
    } else {
      void navigate({ to: opt.to as any });
    }
  }, [navigate, setActiveHub]);

  // Clear & descriptive product order details
  const firstItem = active[0]?.product;
  const uniqueItemsCount = active.length;
  const itemSummary = firstItem
    ? uniqueItemsCount === 1
      ? `${firstItem.name} (${active[0].quantity}x)`
      : `${firstItem.name} +${uniqueItemsCount - 1} more`
    : store?.name || "Your Order";

  const subLine = `${currency(subtotal)} • ${store?.name || "Instant Delivery"}`;

  const itemImage =
    firstItem?.image_url ||
    (firstItem ? `https://picsum.photos/seed/${firstItem.id}/120/120` : null);

  return (
    <>
      {/* 1. INTERACTIVE FULL-SCREEN BACKDROP & UNCLIPPED ORBITAL FAN-OUT MENU */}
      <AnimatePresence>
        {servicesMenuOpen && (
          <>
            {/* Backdrop Dismiss Layer */}
            <motion.div
              key="services-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setServicesMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[6px] cursor-pointer select-none touch-manipulation"
            />

            {/* UNCLIPPED ORBITAL 4-OPTIONS FAN-OUT DIAL */}
            <div className="fixed bottom-16 sm:bottom-18 inset-x-0 z-50 pointer-events-none flex items-center justify-center select-none">
              <div className="relative flex items-center justify-center">
                {ORBITAL_SERVICES.map((opt, idx) => {
                  const IconComponent = opt.icon;

                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: opt.x,
                        y: opt.y,
                        scale: 1,
                        opacity: 1,
                      }}
                      exit={{
                        x: 0,
                        y: 0,
                        scale: 0,
                        opacity: 0,
                        transition: { duration: 0.14, ease: "easeIn" },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 22,
                        mass: 0.55,
                        delay: idx * 0.02,
                      }}
                      whileHover={{ scale: 1.15, y: opt.y - 4 }}
                      whileTap={{ scale: 0.86 }}
                      onClick={() => handleSelectService(opt)}
                      className="absolute pointer-events-auto flex flex-col items-center group cursor-pointer outline-none will-change-transform select-none touch-manipulation"
                      style={{
                        transform: "translate3d(0,0,0)",
                      }}
                    >
                      {/* Sleek Smoked Titanium Glass Disc */}
                      <div
                        className={cn(
                          "relative size-12.5 sm:size-13 rounded-full flex items-center justify-center backdrop-blur-2xl border transition-all duration-200 overflow-hidden shadow-2xl",
                          opt.borderHighlight
                        )}
                        style={{
                          background: opt.gradient,
                          boxShadow: `
                            0 10px 25px -4px ${opt.glow},
                            0 0 20px ${opt.glow},
                            inset 0 1.5px 1.5px rgba(255, 255, 255, 0.45),
                            inset 0 -2px 3px rgba(0, 0, 0, 0.6)
                          `,
                        }}
                      >
                        {/* Top Specular Glare Arc */}
                        <div className="absolute top-0.5 inset-x-2 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

                        {/* Clean Refined Vector Line Icon */}
                        <IconComponent
                          className="size-5.5 transition-transform duration-200 group-hover:scale-110"
                          style={{
                            color: opt.accent,
                            filter: `drop-shadow(0 0 8px ${opt.accent})`,
                          }}
                        />
                      </div>

                      {/* Minimalist Smoked Glass Label Tag */}
                      <div
                        className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider text-white backdrop-blur-xl border border-white/20 whitespace-nowrap flex items-center gap-1 shadow-lg bg-slate-950/90"
                        style={{
                          boxShadow: `0 4px 12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)`,
                        }}
                      >
                        <span>{opt.name}</span>
                        <span
                          className="size-1 rounded-full"
                          style={{ background: opt.accent, boxShadow: `0 0 5px ${opt.accent}` }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC MORPHING LUXURY SMOKED GLASS DOCK (GPU-ACCELERATED, ZERO-JANK) */}
      <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none select-none">
        <div className="relative pointer-events-auto flex items-center justify-center">
          {/* FLOATING LUXURY SMOKED GLASS CHASSIS */}
          <nav
            aria-label="Bottom Navigation"
            className={cn(
              "relative flex items-center justify-between transition-all duration-300 ease-out transform-gpu",
              "rounded-full backdrop-blur-2xl backdrop-saturate-200 border",
              isCollapsed
                ? "w-13 h-13 p-0 bg-transparent border-transparent shadow-none"
                : cn(
                    "w-[340px] sm:w-[385px] px-2.5 sm:px-3 py-1.5 sm:py-2",
                    isDark
                      ? "bg-slate-950/92 border-white/20 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),inset_0_1.5px_1px_rgba(255,255,255,0.25)]"
                      : "bg-white/95 border-slate-200/90 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15),inset_0_1.5px_1.5px_rgba(255,255,255,1)]"
                  )
            )}
          >
            {/* Top Specular Rim Laser Highlight */}
            {!isCollapsed && (
              <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none rounded-full" />
            )}

            {/* ========================================================================= */}
            {/* LEFT SECTION: HOME TAB / CART PREVIEW (AUTO-HIDES ON SCROLL DOWN) */}
            {/* ========================================================================= */}
            <div
              className={cn(
                "flex-1 min-w-0 transition-all duration-300 ease-out transform-gpu",
                isCollapsed
                  ? "opacity-0 -translate-x-4 max-w-0 pointer-events-none overflow-hidden"
                  : "opacity-100 translate-x-0 max-w-[140px] overflow-hidden"
              )}
            >
              {hasCartItems ? (
                /* CART PREVIEW PANEL (CLEARLY SHOWS ORDERED ITEMS & QUANTITY) */
                <div
                  onClick={() => {
                    void navigate({ to: "/cart" });
                  }}
                  className="flex items-center gap-2 min-w-0 pr-1 py-0.5 cursor-pointer group select-none touch-manipulation transition-transform active:scale-95"
                  title="View Cart Details"
                >
                  {/* Thumbnail Avatar with Quantity Badge */}
                  <div className="relative size-9 sm:size-9.5 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-cyan-400/40 shadow-xs">
                    {itemImage ? (
                      <img
                        src={itemImage}
                        alt={itemSummary}
                        className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="size-full grid place-items-center text-cyan-400">
                        <FiShoppingBag className="size-4.5" />
                      </div>
                    )}
                    <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[8px] grid place-items-center ring-1 ring-slate-950">
                      {count}
                    </span>
                  </div>

                  {/* Ordered Item Name & Price Sub-line */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-[11px] sm:text-xs text-white truncate leading-tight group-hover:text-cyan-300 transition-colors">
                      {itemSummary}
                    </span>
                    <span className="text-[10px] font-extrabold text-cyan-300 truncate leading-tight mt-0.5">
                      {subLine}
                    </span>
                  </div>
                </div>
              ) : (
                /* STANDARD HOME TAB (WHEN CART IS EMPTY) */
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setServicesMenuOpen(false);
                      if (homeTarget.params) {
                        void navigate({ to: homeTarget.to as any, params: homeTarget.params as any });
                      } else {
                        void navigate({ to: homeTarget.to as any });
                      }
                    }}
                    className={cn(
                      "relative w-full flex items-center justify-center gap-1.5 py-2 px-3",
                      "rounded-full outline-none transition-all duration-150 cursor-pointer select-none group touch-manipulation active:scale-95",
                      isHomeActive && (isDark ? "bg-white/10 text-cyan-300 shadow-inner" : "bg-slate-900/10 text-cyan-700")
                    )}
                  >
                    <div className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                      <FiHome
                        className={cn(
                          "size-4 transition-transform duration-150",
                          isHomeActive
                            ? isDark
                              ? "text-cyan-400 stroke-[2.5] scale-110"
                              : "text-cyan-600 stroke-[2.5] scale-110"
                            : isDark
                            ? "text-slate-400 group-hover:text-slate-200 stroke-[1.8]"
                            : "text-slate-500 group-hover:text-slate-900 stroke-[1.8]"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-bold tracking-tight transition-colors duration-150",
                          isHomeActive
                            ? isDark
                              ? "text-white font-black"
                              : "text-slate-950 font-black"
                            : isDark
                            ? "text-slate-400 group-hover:text-slate-200"
                            : "text-slate-500 group-hover:text-slate-900"
                        )}
                      >
                        Home
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* CENTER SECTION: ALWAYS PROMINENT ROUND 3D "SERVICES" HUB BUTTON */}
            {/* ========================================================================= */}
            <div className="relative flex items-center justify-center px-1 shrink-0">
              {/* Central Sleek Convex Smoked Glass FAB Hub */}
              <button
                type="button"
                onClick={() => setServicesMenuOpen((prev) => !prev)}
                aria-label="Services Menu"
                aria-expanded={servicesMenuOpen}
                className={cn(
                  "relative size-12 sm:size-13 rounded-full flex flex-col items-center justify-center transition-all duration-200 outline-none z-30 cursor-pointer overflow-hidden text-white shadow-xl touch-manipulation transform-gpu hover:scale-110 active:scale-90",
                  isCollapsed && "shadow-[0_0_28px_rgba(168,85,247,0.6),0_10px_25px_-5px_rgba(6,182,212,0.5)]"
                )}
                style={{
                  background: servicesMenuOpen
                    ? "radial-gradient(circle at 40% 30%, #334155 0%, #1e1b4b 60%, #0f172a 100%)"
                    : isServicesActive
                    ? "radial-gradient(circle at 40% 30%, #475569 0%, #1e1b4b 60%, #020617 100%)"
                    : "radial-gradient(circle at 40% 30%, #334155 0%, #0f172a 70%, #020617 100%)",
                  border: servicesMenuOpen ? "2px solid rgba(244, 63, 94, 0.85)" : "2px solid rgba(255, 255, 255, 0.45)",
                  boxShadow: servicesMenuOpen
                    ? `
                        0 0 24px rgba(244, 63, 94, 0.65),
                        0 8px 24px -4px rgba(244, 63, 94, 0.55),
                        inset 0 2px 2px rgba(255, 255, 255, 0.65),
                        inset 0 -3px 4px rgba(0, 0, 0, 0.7)
                      `
                    : `
                        0 0 22px rgba(168, 85, 247, 0.55),
                        0 8px 20px -4px rgba(0, 188, 212, 0.45),
                        inset 0 2px 2px rgba(255, 255, 255, 0.6),
                        inset 0 -3px 4px rgba(0, 0, 0, 0.7)
                      `,
                }}
              >
                {/* Top Specular Rim Glare */}
                <div className="absolute top-0.5 inset-x-2.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

                {/* Morphing Line Icon (Grid <-> Close X) */}
                <div className="grid place-items-center relative z-10 transition-transform duration-200">
                  {servicesMenuOpen ? (
                    <FiX className="size-5 sm:size-5.5 stroke-[2.5] text-rose-400" />
                  ) : (
                    <FiGrid className="size-5 sm:size-5.5 stroke-[2.2] text-cyan-300" />
                  )}
                </div>

                {/* Active Indicator Pulse Sparkle */}
                {isServicesActive && !servicesMenuOpen && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#00BCD4]" />
                )}
              </button>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT SECTION: ORDERS TAB / VIEW CART (AUTO-HIDES ON SCROLL DOWN) */}
            {/* ========================================================================= */}
            <div
              className={cn(
                "flex-1 min-w-0 transition-all duration-300 ease-out transform-gpu",
                isCollapsed
                  ? "opacity-0 translate-x-4 max-w-0 pointer-events-none overflow-hidden"
                  : "opacity-100 translate-x-0 max-w-[140px] overflow-hidden"
              )}
            >
              {hasCartItems ? (
                /* "VIEW CART" & DELETE ACTION GROUP (WHEN CART HAS ITEMS) */
                <div className="flex items-center justify-end gap-1.5 pl-1 whitespace-nowrap">
                  {/* VIEW CART PILL BUTTON */}
                  <button
                    type="button"
                    onClick={() => void navigate({ to: "/cart" })}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 hover:opacity-95 text-white font-black text-[11px] sm:text-xs shadow-md shadow-rose-600/35 active:scale-95 transition-all cursor-pointer truncate touch-manipulation"
                  >
                    <span>View Cart</span>
                    <FiArrowRight className="size-3 stroke-[2.5] shrink-0" />
                  </button>

                  {/* DELETE / CLEAR CART TRASH BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      clearCart();
                    }}
                    className="size-8 rounded-full bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 hover:text-rose-200 border border-rose-500/30 grid place-items-center transition-all active:scale-85 shrink-0 cursor-pointer shadow-xs touch-manipulation"
                    title="Delete / Clear Cart"
                    aria-label="Delete / Clear Cart"
                  >
                    <FiTrash2 className="size-3.5" />
                  </button>
                </div>
              ) : (
                /* STANDARD ORDERS TAB (WHEN CART IS EMPTY) */
                <div className="flex items-center justify-center">
                  <Link
                    to="/orders"
                    preload="intent"
                    onClick={() => setServicesMenuOpen(false)}
                    className={cn(
                      "relative w-full flex items-center justify-center gap-1.5 py-2 px-3",
                      "rounded-full outline-none transition-all duration-150 cursor-pointer select-none group touch-manipulation active:scale-95",
                      isOrdersActive && (isDark ? "bg-white/10 text-amber-300 shadow-inner" : "bg-slate-900/10 text-amber-700")
                    )}
                  >
                    <div className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                      <FiPackage
                        className={cn(
                          "size-4 transition-transform duration-150",
                          isOrdersActive
                            ? isDark
                              ? "text-amber-400 stroke-[2.5] scale-110"
                              : "text-amber-600 stroke-[2.5] scale-110"
                            : isDark
                            ? "text-slate-400 group-hover:text-slate-200 stroke-[1.8]"
                            : "text-slate-500 group-hover:text-slate-900 stroke-[1.8]"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-bold tracking-tight transition-colors duration-150",
                          isOrdersActive
                            ? isDark
                              ? "text-white font-black"
                              : "text-slate-950 font-black"
                            : isDark
                            ? "text-slate-400 group-hover:text-slate-200"
                            : "text-slate-500 group-hover:text-slate-900"
                        )}
                      >
                        Orders
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
