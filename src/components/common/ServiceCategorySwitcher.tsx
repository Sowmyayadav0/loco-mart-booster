import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiSearch, FiShoppingBag, FiTruck, FiX } from "react-icons/fi";

interface ServiceCategorySwitcherProps {
  activeService: "food" | "shop" | "ride" | "courier";
}

const CONTAINER_STYLES = {
  food: "bg-gradient-to-r from-amber-100/90 via-[#EEFBFD] to-cyan-100/90 border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/10",
  shop: "bg-gradient-to-r from-purple-100/90 via-[#F3E8FF] to-cyan-100/90 border-2 border-purple-400/40 shadow-lg shadow-purple-500/10",
  ride: "bg-gradient-to-r from-cyan-100/90 via-slate-100 to-teal-100/90 border-2 border-[#00BCD4]/40 shadow-lg shadow-cyan-500/10",
  courier: "bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-amber-100/90 border-2 border-amber-400/40 shadow-lg shadow-amber-500/10",
};

const SERVICES = [
  {
    key: "food",
    label: "Food",
    to: "/category/$slug",
    params: { slug: "food" },
    activeIconColor: "text-amber-500",
    activeTextColor: "text-[#044D63]",
    badgeBg: "bg-amber-100/80 text-amber-600",
    borderActive: "border-2 border-[#00BCD4]",
    icon: (
      <svg className="size-6 sm:size-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.46 3.9 3.43 4.38L6.05 22h2.9l-.38-8.62C10.54 12.9 12 11.12 12 9V2h-1v7zm9-7h-2c-1.66 0-3 1.34-3 3v6h3v11h2.5V2z" />
      </svg>
    ),
  },
  {
    key: "shop",
    label: "Shop",
    to: "/category/$slug",
    params: { slug: "shop" },
    activeIconColor: "text-purple-600",
    activeTextColor: "text-purple-950",
    badgeBg: "bg-purple-100/80 text-purple-700",
    borderActive: "border-2 border-purple-500",
    icon: <FiShoppingBag className="size-6 sm:size-7 stroke-[2.2]" />,
  },
  {
    key: "ride",
    label: "Ride",
    to: "/rides",
    activeIconColor: "text-[#00BCD4]",
    activeTextColor: "text-slate-950",
    badgeBg: "bg-cyan-100/80 text-cyan-700",
    borderActive: "border-2 border-[#00BCD4]",
    icon: (
      <svg className="size-6 sm:size-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z" />
        <circle cx="7.5" cy="15" r="1.5" />
        <circle cx="16.5" cy="15" r="1.5" />
      </svg>
    ),
  },
  {
    key: "courier",
    label: "Courier",
    to: "/courier",
    activeIconColor: "text-amber-600",
    activeTextColor: "text-amber-950",
    badgeBg: "bg-amber-100/80 text-amber-700",
    borderActive: "border-2 border-amber-500",
    icon: <FiTruck className="size-6 sm:size-7 stroke-[2.2]" />,
  },
] as const;

export function ServiceCategorySwitcher({ activeService }: ServiceCategorySwitcherProps) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const currentContainerBg = CONTAINER_STYLES[activeService] || CONTAINER_STYLES.food;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 space-y-3.5 select-none">
      {/* 1. SINGLE SEGMENTED CATEGORY TABS BAR */}
      <div className={`relative flex items-center rounded-3xl p-2 transition-all duration-500 backdrop-blur-xl ${currentContainerBg}`}>
        {SERVICES.map((s) => {
          const isActive = activeService === s.key;
          return (
            <Link
              key={s.key}
              to={s.to as any}
              params={"params" in s ? (s.params as any) : undefined}
              className="relative flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl transition-all cursor-pointer z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="activeServiceVibrantTabCard"
                  className={`absolute inset-0 rounded-2xl bg-white dark:bg-card shadow-xl ${s.borderActive} z-0`}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              {/* LOGO / ICON ON TOP WITH VIBRANT COLORED CONTAINER */}
              <span
                className={`relative z-10 grid size-10 sm:size-11 place-items-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${s.badgeBg} ${s.activeIconColor} scale-110 shadow-xs`
                    : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white hover:text-slate-900 hover:scale-105"
                }`}
              >
                {s.icon}
              </span>

              {/* NAME DOWN BELOW */}
              <span
                className={`relative z-10 text-xs sm:text-sm font-extrabold tracking-tight transition-colors ${
                  isActive ? s.activeTextColor : "text-slate-700 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 2. PROMINENT SEARCH BAR UNDER CATEGORIES TABS */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const qStr = term.trim();
          if (qStr) {
            void navigate({ to: "/search", search: { q: qStr } });
          }
        }}
        className="relative flex items-center w-full"
      >
        <FiSearch className="absolute left-4 text-slate-400 size-4.5 pointer-events-none" />
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
          placeholder={`Search ${activeService} items, stores, or services...`}
          className="h-11 sm:h-12 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-card text-slate-900 dark:text-white placeholder:text-slate-400 pl-11 pr-12 text-xs sm:text-sm font-extrabold outline-none focus:border-[#00BCD4] focus:ring-4 focus:ring-cyan-400/20 shadow-md transition-all"
        />
        {term ? (
          <button
            type="button"
            onClick={() => setTerm("")}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            title="Clear search"
          >
            <FiX className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            className="absolute right-1.5 grid size-9 place-items-center rounded-xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-[#044D63] hover:opacity-95 text-white font-bold transition-all shadow-xs"
            title="Search"
          >
            <FiSearch className="size-4" />
          </button>
        )}
      </form>
    </div>
  );
}
