import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiNavigation, FiPackage, FiShoppingBag } from "react-icons/fi";

interface SuperAppOrbitScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

const SERVICES = [
  { id: "food", title: "Eat", desc: "Fresh Food & Groceries" },
  { id: "shop", title: "Shop", desc: "Fashion, Tech & Pharmacy" },
  { id: "rides", title: "Ride", desc: "Bikes, Autos & Cabs" },
  { id: "send", title: "Send", desc: "Instant Parcel Courier" },
];

export function SuperAppOrbitScreen({ onGetStarted, onSkip }: SuperAppOrbitScreenProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto cycle active feature highlight every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SERVICES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 py-6 sm:py-10 bg-[#FAFDFB] dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-hidden transition-colors">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-75 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(180, 240, 245, 0.5) 0%, rgba(224, 247, 250, 0.2) 42%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP HEADER WITH SKIP BUTTON */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-end shrink-0">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
        >
          Skip
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-8">
        {/* ROTATING 4 ICONS ORBIT CONTAINER */}
        <div className="relative size-64 sm:size-72 flex items-center justify-center my-2">
          {/* Subtle Glowing Orbit Ring */}
          <div className="absolute size-52 sm:size-60 rounded-full border border-cyan-300/40 dark:border-cyan-500/30 bg-cyan-50/20 dark:bg-cyan-500/10 shadow-inner animate-pulse" />

          {/* Center Brand Badge */}
          <div className="absolute grid place-items-center size-14 rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-100/80 dark:border-white/10 z-10 text-cyan-600 dark:text-cyan-400">
            <span className="text-xl font-black tracking-tight">H</span>
          </div>

          {/* REVOLVING ORBIT WITH 4 SERVICE ICONS */}
          <motion.div
            className="absolute size-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {/* TOP ICON: EAT / FOOD */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="grid place-items-center size-16 sm:size-18 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-cyan-900/10 dark:shadow-none border border-slate-100 dark:border-white/10 text-amber-500 p-3 hover:scale-110 transition-transform cursor-pointer"
              >
                <svg className="size-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.46 3.9 3.43 4.38L6.05 22h2.9l-.38-8.62C10.54 12.9 12 11.12 12 9V2h-1v7zm9-7h-2c-1.66 0-3 1.34-3 3v6h3v11h2.5V2z" />
                </svg>
              </motion.div>
            </div>

            {/* RIGHT ICON: SHOP */}
            <div className="absolute top-1/2 -right-1 -translate-y-1/2">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="grid place-items-center size-16 sm:size-18 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-cyan-900/10 dark:shadow-none border border-slate-100 dark:border-white/10 text-emerald-500 p-3 hover:scale-110 transition-transform cursor-pointer"
              >
                <FiShoppingBag className="size-7 stroke-[2.2]" />
              </motion.div>
            </div>

            {/* BOTTOM ICON: RIDE */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="grid place-items-center size-16 sm:size-18 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-cyan-900/10 dark:shadow-none border border-slate-100 dark:border-white/10 text-slate-800 dark:text-cyan-400 p-3 hover:scale-110 transition-transform cursor-pointer"
              >
                <svg className="size-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z" />
                  <circle cx="7.5" cy="15" r="1.5" />
                  <circle cx="16.5" cy="15" r="1.5" />
                </svg>
              </motion.div>
            </div>

            {/* LEFT ICON: SEND */}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="grid place-items-center size-16 sm:size-18 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-cyan-900/10 dark:shadow-none border border-slate-100 dark:border-white/10 text-amber-700 dark:text-amber-400 p-3 hover:scale-110 transition-transform cursor-pointer"
              >
                <FiPackage className="size-7 stroke-[2.2]" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* TITLE & SUBTITLE */}
        <div className="text-center space-y-2 pt-2 px-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Your city.<br />
            One SUPER app.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold max-w-xs mx-auto">
            Eat, shop, ride and send — all nearby.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center space-y-6 pt-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-7 h-1.5 rounded-full bg-[#00BCD4] shadow-xs transition-all" />
          <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={onGetStarted}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-teal-600 hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get started</span>
          <FiArrowRight className="size-5" />
        </button>
      </footer>
    </div>
  );
}
