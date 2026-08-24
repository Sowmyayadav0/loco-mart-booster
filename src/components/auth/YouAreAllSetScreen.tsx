import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiPackage, FiShoppingBag } from "react-icons/fi";

interface YouAreAllSetScreenProps {
  onStartExploring: () => void;
}

export function YouAreAllSetScreen({ onStartExploring }: YouAreAllSetScreenProps) {
  const [countdown, setCountdown] = useState(3);

  // Auto redirect to website after 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onStartExploring();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onStartExploring]);

  return (
    <div className="relative h-screen max-h-screen w-full flex flex-col justify-between px-4 py-4 sm:py-6 bg-[#FAFDFB] select-none overflow-hidden">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-75"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 42%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP HEADER STATUS */}
      <header className="relative z-10 w-full max-w-sm mx-auto flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold text-slate-400">LocoMart Super App</span>
        <span className="text-[11px] font-extrabold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/60">
          Entering website in {countdown}s...
        </span>
      </header>

      {/* MAIN CONTENT AREA: COMPACT SINGLE-SCREEN FIT CONTAINER */}
      <main className="relative z-10 my-auto w-full max-w-sm mx-auto flex flex-col items-center justify-center space-y-4">
        {/* CONFETTI POPPER BADGE */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="grid place-items-center size-14 sm:size-16 rounded-full bg-[#D7F5F8] shadow-md shadow-cyan-500/10 text-2xl shrink-0"
        >
          🎉
        </motion.div>

        {/* HEADING & SUBTITLE */}
        <div className="text-center space-y-1 px-2 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#044D63] tracking-tight">
            You're all set!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Your super app is ready. You can now:
          </p>
        </div>

        {/* 4 SERVICE TILES GRID (2x2) (Compact Fit Sizes) */}
        <div className="grid grid-cols-2 gap-3 w-full pt-1">
          {/* EAT TILE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.25 }}
            className="flex flex-col items-center justify-center h-24 sm:h-26 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-cyan-900/5 space-y-1.5 hover:border-cyan-400 hover:bg-[#EEFBFD] transition-all cursor-pointer"
            onClick={onStartExploring}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-500">
              <svg className="size-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.46 3.9 3.43 4.38L6.05 22h2.9l-.38-8.62C10.54 12.9 12 11.12 12 9V2h-1v7zm9-7h-2c-1.66 0-3 1.34-3 3v6h3v11h2.5V2z" />
              </svg>
            </span>
            <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
              EAT
            </span>
          </motion.div>

          {/* SHOP TILE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="flex flex-col items-center justify-center h-24 sm:h-26 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-cyan-900/5 space-y-1.5 hover:border-cyan-400 hover:bg-[#EEFBFD] transition-all cursor-pointer"
            onClick={onStartExploring}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-50 text-[#044D63]">
              <FiShoppingBag className="size-5.5 stroke-[2.2]" />
            </span>
            <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
              SHOP
            </span>
          </motion.div>

          {/* MOVE TILE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="flex flex-col items-center justify-center h-24 sm:h-26 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-cyan-900/5 space-y-1.5 hover:border-cyan-400 hover:bg-[#EEFBFD] transition-all cursor-pointer"
            onClick={onStartExploring}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-100/60 text-[#044D63]">
              <svg className="size-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z" />
                <circle cx="7.5" cy="15" r="1.5" />
                <circle cx="16.5" cy="15" r="1.5" />
              </svg>
            </span>
            <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
              MOVE
            </span>
          </motion.div>

          {/* SEND TILE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
            className="flex flex-col items-center justify-center h-24 sm:h-26 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-cyan-900/5 space-y-1.5 hover:border-cyan-400 hover:bg-[#EEFBFD] transition-all cursor-pointer"
            onClick={onStartExploring}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-[#044D63]">
              <FiPackage className="size-5.5 stroke-[2.2]" />
            </span>
            <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
              SEND
            </span>
          </motion.div>
        </div>
      </main>

      {/* FOOTER START EXPLORING BUTTON (Guaranteed inside view) */}
      <footer className="relative z-10 w-full max-w-sm mx-auto pt-2 shrink-0">
        <button
          type="button"
          onClick={onStartExploring}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-[#044D63] hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <span>Start Exploring</span>
          <FiArrowRight className="size-4.5" />
        </button>
      </footer>
    </div>
  );
}
