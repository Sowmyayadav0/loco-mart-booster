import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiShoppingBag, FiTruck, FiX } from "react-icons/fi";
import { Utensils, Car } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface ServiceCategorySwitcherProps {
  activeService: "food" | "shop" | "ride" | "courier";
  showSearch?: boolean;
}

const SERVICES = [
  {
    key: "food" as const,
    label: "Food",
    badge: "20 min",
    to: "/category/$slug",
    params: { slug: "food" },
    accentColor: "#f97316",
    beamGradient: "linear-gradient(180deg, rgba(254,215,170,0.95) 0%, rgba(249,115,22,0.5) 25%, rgba(234,88,12,0.18) 65%, transparent 100%)",
    glowColor: "rgba(249, 115, 22, 0.65)",
    flareColor: "#ffedd5",
    icon: <Utensils className="size-6 stroke-[2.4]" />,
  },
  {
    key: "shop" as const,
    label: "Shop",
    badge: "Instant",
    to: "/category/$slug",
    params: { slug: "shop" },
    accentColor: "#a855f7",
    beamGradient: "linear-gradient(180deg, rgba(243,232,255,0.95) 0%, rgba(168,85,247,0.5) 25%, rgba(147,51,234,0.18) 65%, transparent 100%)",
    glowColor: "rgba(168, 85, 247, 0.65)",
    flareColor: "#f3e8ff",
    icon: <FiShoppingBag className="size-6 stroke-[2.4]" />,
  },
  {
    key: "ride" as const,
    label: "Ride",
    badge: "Nearby",
    to: "/rides",
    accentColor: "#06b6d4",
    beamGradient: "linear-gradient(180deg, rgba(207,250,254,0.95) 0%, rgba(6,182,212,0.5) 25%, rgba(14,165,233,0.18) 65%, transparent 100%)",
    glowColor: "rgba(6, 182, 212, 0.65)",
    flareColor: "#cffafe",
    icon: <Car className="size-6 stroke-[2.4]" />,
  },
  {
    key: "courier" as const,
    label: "Courier",
    badge: "Express",
    to: "/courier",
    accentColor: "#10b981",
    beamGradient: "linear-gradient(180deg, rgba(209,250,229,0.95) 0%, rgba(16,185,129,0.5) 25%, rgba(5,150,105,0.18) 65%, transparent 100%)",
    glowColor: "rgba(16, 185, 129, 0.65)",
    flareColor: "#d1fae5",
    icon: <FiTruck className="size-6 stroke-[2.4]" />,
  },
];

export function CategorySearchBar({
  activeService = "food",
  className = "",
  placeholder,
}: {
  activeService?: "food" | "shop" | "ride" | "courier";
  className?: string;
  placeholder?: string;
}) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const activeItem = SERVICES.find((s) => s.key === activeService) ?? SERVICES[0]!;
  const defaultPlaceholder =
    placeholder || `Search ${activeItem.label} (${activeItem.badge}) — stores, items, or services...`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const qStr = term.trim();
        if (qStr) {
          void navigate({ to: "/search", search: { q: qStr } });
        }
      }}
      className={cn("relative flex items-center w-full group max-w-2xl mx-auto my-3.5", className)}
    >
      <div className="absolute left-4 z-10 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-200 pointer-events-none">
        <FiSearch className="size-4.5" />
      </div>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const qStr = term.trim();
            if (qStr) {
              void navigate({ to: "/search", search: { q: qStr } });
            }
          }
        }}
        placeholder={defaultPlaceholder}
        className="h-11 sm:h-12 w-full rounded-2xl border border-white/15 bg-slate-950/85 backdrop-blur-3xl text-white placeholder:text-slate-400 pl-11 pr-14 text-xs sm:text-sm font-semibold outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.1)] transition-all duration-200"
      />
      {term ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => setTerm("")}
          className="absolute right-3.5 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Clear search"
        >
          <FiX className="size-4" />
        </motion.button>
      ) : (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute right-1.5 grid size-8 sm:size-9 place-items-center rounded-xl text-white font-bold transition-all shadow-md cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${activeItem.accentColor} 0%, ${activeItem.glowColor} 100%)`,
            boxShadow: `0 4px 14px ${activeItem.glowColor}`,
          }}
          title="Search"
        >
          <FiSearch className="size-4" />
        </motion.button>
      )}
    </form>
  );
}

export function ServiceCategorySwitcher({ activeService, showSearch = false }: ServiceCategorySwitcherProps) {
  const { setActiveHub } = useApp();

  const activeItem = SERVICES.find((s) => s.key === activeService) ?? SERVICES[0]!;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 space-y-3.5 select-none touch-manipulation">
      {/* 1. CINEMATIC VOLUMETRIC TORCH LIGHT DECK - BRIGHT RADIANT THEMED AMBIENCE */}
      <div className="relative pt-4">
        {/* Dynamic Ambient Backlight Halo matching the active lamp color (Brighter & Wider) */}
        <div
          className="absolute inset-x-4 -top-6 h-44 rounded-full opacity-85 pointer-events-none transition-all duration-700 will-change-transform"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 50%, ${activeItem.glowColor} 0%, ${activeItem.accentColor}33 45%, transparent 75%)`,
            transform: "translate3d(0,0,0)",
          }}
        />

        {/* Dynamic Center Hotspot Glow */}
        <div
          className="absolute inset-x-16 -top-2 h-28 rounded-full opacity-55 pointer-events-none transition-all duration-700 will-change-transform"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${activeItem.accentColor}70 0%, ${activeItem.glowColor}30 50%, transparent 75%)`,
            transform: "translate3d(0,0,0)",
          }}
        />

        {/* Chassis Dark Smoked Glass Dock Tray (Always Sleek Black Glass) */}
        <div className="relative rounded-[28px] p-2 sm:p-2.5 bg-slate-950/75 backdrop-blur-2xl backdrop-saturate-200 border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Dynamic Active Lamp Interior Chassis Color Wash (Bright & Vivid) */}
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${activeItem.accentColor}40 0%, ${activeItem.glowColor}25 50%, transparent 85%)`,
              transform: "translate3d(0,0,0)",
            }}
          />

          {/* Top Edge Specular Laser Rim Light */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-5" />

          {/* Background Ambient Grid Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-5" />

          <div className="relative z-10 grid grid-cols-4 gap-1.5 sm:gap-2">
            {SERVICES.map((s) => {
              const isActive = activeService === s.key;

              return (
                <Link
                  key={s.key}
                  to={s.to as any}
                  params={"params" in s ? (s.params as any) : undefined}
                  preload="intent"
                  onClick={() => setActiveHub(s.key)}
                  className="group relative flex flex-col items-center justify-center gap-1.5 py-3 sm:py-4 px-2 rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 touch-manipulation select-none will-change-transform"
                >
                  {/* 1. DYNAMIC HIGH-VISIBILITY LUXURY PULL-CHAIN (ULTRA-SMOOTH PHYSICAL STRING PULL) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key={`pull-cord-${s.key}`}
                        initial={{ y: -55, opacity: 0, rotate: 0 }}
                        animate={{
                          // 1. Smooth physical gravity drop -> 2. Elastic tug downward -> 3. Smooth upward snap -> 4. Retract into socket
                          y: [-55, 22, 30, -12, -55],
                          opacity: [0, 1, 1, 1, 0],
                          rotate: [0, -1.2, 0.6, -0.3, 0],
                        }}
                        transition={{
                          duration: 1.4,
                          times: [0, 0.36, 0.52, 0.82, 1],
                          ease: [
                            [0.25, 1, 0.5, 1],     // 1. Smooth deceleration on drop
                            [0.34, 1.4, 0.64, 1],  // 2. Elastic springy tug down
                            [0.4, 0, 0.2, 1],      // 3. Smooth upward acceleration snap
                            [0.55, 0, 1, 0.45],    // 4. Clean exit into ceiling
                          ],
                        }}
                        className="absolute top-0 right-2 sm:right-3.5 z-40 flex flex-col items-center pointer-events-none origin-top will-change-transform"
                        style={{
                          transform: "translate3d(0,0,0)",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {/* Ceiling Escutcheon Socket */}
                        <div
                          className="w-2.5 h-1 rounded-full shadow-md mb-0.5"
                          style={{
                            background: s.accentColor,
                            boxShadow: `0 0 6px ${s.accentColor}`,
                          }}
                        />

                        {/* Metallic Theme-Colored Beaded Chain */}
                        <div className="flex flex-col items-center gap-[2.5px] py-0.5">
                          <div
                            className="w-[1.5px] h-7 sm:h-8 shadow-md rounded-full"
                            style={{
                              background: `linear-gradient(180deg, #ffffff 0%, ${s.flareColor} 40%, ${s.accentColor} 100%)`,
                              boxShadow: `0 0 8px ${s.accentColor}`,
                            }}
                          />
                          <div
                            className="size-1 rounded-full border border-white/60 shadow-xs"
                            style={{ background: s.flareColor }}
                          />
                          <div
                            className="size-1 rounded-full border border-white/80 shadow-xs"
                            style={{ background: s.accentColor }}
                          />
                        </div>
                        
                        {/* Glowing Glass & Crystal Pendant Pull Knob */}
                        <motion.div
                          animate={{
                            scale: [1, 1, 1.2, 1.05, 1],
                          }}
                          transition={{
                            duration: 1.4,
                            times: [0, 0.36, 0.52, 0.82, 1],
                            ease: [
                              [0.25, 1, 0.5, 1],
                              [0.34, 1.4, 0.64, 1],
                              [0.4, 0, 0.2, 1],
                              [0.55, 0, 1, 0.45],
                            ],
                          }}
                          className="size-3.5 rounded-full border-2 border-white shadow-lg -mt-0.5 flex items-center justify-center will-change-transform"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${s.flareColor} 40%, ${s.accentColor} 100%)`,
                            boxShadow: `0 0 14px ${s.accentColor}, 0 0 24px ${s.glowColor}`,
                            transform: "translate3d(0,0,0)",
                            backfaceVisibility: "hidden",
                          }}
                        >
                          <div className="size-1 rounded-full bg-white shadow-xs" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 2. VOLUMETRIC TORCH SPOTLIGHT BEAM - TURNS ON RIGHT AS STRING PULLS UP & FADES */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key={`torch-lamp-${s.key}`}
                        initial={{ opacity: 0, scaleY: 0.1 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.2, transition: { duration: 0.25 } }}
                        transition={{
                          delay: 1.15, // Turns ON as pull-up finishes and string fades smoothly!
                          duration: 0.65,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="absolute inset-0 pointer-events-none z-10 origin-top will-change-transform"
                        style={{
                          transform: "translate3d(0,0,0)",
                        }}
                      >
                        {/* Overhead Lamp Fixture & Bulb */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center z-40 pointer-events-none">
                          {/* Wide Corona Lens Glow */}
                          <div
                            className="w-20 h-5 rounded-full blur-md opacity-95"
                            style={{ background: s.accentColor }}
                          />
                          {/* High-Intensity White-Hot Bulb Filament */}
                          <div
                            className="absolute w-10 h-2 rounded-full bg-white shadow-[0_0_15px_#fff,0_0_30px_currentColor]"
                            style={{ color: s.accentColor }}
                          />
                        </div>

                        {/* Volumetric Conical Light Beam */}
                        <div
                          className="absolute -inset-x-5 -top-2 bottom-0 pointer-events-none z-10 opacity-95"
                          style={{
                            background: s.beamGradient,
                            clipPath: "polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%)",
                            transform: "translate3d(0,0,0)",
                          }}
                        />

                        {/* Soft Warm Optical Ambient Flare */}
                        <motion.div
                          key={`lamp-flash-${s.key}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.85, 0], scale: [0.5, 1.4, 2] }}
                          transition={{ delay: 1.15, duration: 0.7, ease: "easeOut" }}
                          className="absolute inset-0 pointer-events-none z-30 will-change-transform"
                          style={{
                            background: `radial-gradient(circle at 50% 10%, #ffffff 0%, ${s.accentColor} 45%, transparent 75%)`,
                            transform: "translate3d(0,0,0)",
                          }}
                        />

                        {/* Soft Ambient Ground Glow */}
                        <div
                          className="absolute -inset-x-2 -bottom-2 h-14 rounded-full blur-lg pointer-events-none z-5 opacity-80"
                          style={{ background: s.glowColor, transform: "translate3d(0,0,0)" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ICON (ILLUMINATED BY LAMP) */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className={`relative z-20 flex items-center justify-center p-2 rounded-xl transition-colors duration-200 will-change-transform ${
                      isActive
                        ? "text-white"
                        : "text-slate-300/90 group-hover:text-white"
                    }`}
                    style={{
                      transform: "translate3d(0,0,0)",
                      filter: isActive
                        ? `drop-shadow(0 0 16px ${s.accentColor}) drop-shadow(0 0 4px rgba(255,255,255,0.9))`
                        : undefined,
                    }}
                  >
                    {s.icon}
                  </motion.div>

                  {/* LABEL */}
                  <span
                    className={`relative z-20 text-xs sm:text-[13px] tracking-tight transition-colors duration-200 ${
                      isActive
                        ? "text-white font-black drop-shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                        : "font-bold text-slate-300/90 group-hover:text-white"
                    }`}
                  >
                    {s.label}
                  </span>

                  {/* MICRO STATUS TAG */}
                  <span
                    className={`relative z-20 text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-white bg-white/20 backdrop-blur-sm shadow-xs drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                        : "text-slate-400 bg-white/5 group-hover:text-slate-200"
                    }`}
                  >
                    {s.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>      {showSearch && <CategorySearchBar activeService={activeService} />}
    </div>
  );
}
