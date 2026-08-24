import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiShield, FiZap } from "react-icons/fi";

interface WelcomeSplashPageProps {
  onProceed: () => void;
  onSignInDirect?: () => void;
}

export function WelcomeSplashPage({ onProceed, onSignInDirect }: WelcomeSplashPageProps) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("CHECKING CONNECTION • V1.0.0");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Smooth progress animation from 15% to 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText("SYSTEM READY • CONNECTED");
          setIsReady(true);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 18) + 8;
        if (next >= 60 && prev < 60) {
          setStatusText("LOADING HYPERLOCAL ENGINE • V1.0.0");
        }
        if (next >= 90 && prev < 90) {
          setStatusText("PREPARING YOUR EXPERIENCE • V1.0.0");
        }
        return Math.min(100, next);
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-8 sm:py-12 bg-[#FAFDFB] overflow-hidden select-none">
      {/* SOFT CYAN AMBIENT RADIAL GLOW (Combined from Image 1 & Image 2 & Image 3) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(175, 238, 245, 0.45) 0%, rgba(224, 247, 250, 0.25) 35%, rgba(250, 253, 251, 0) 70%)",
        }}
      />

      {/* TOP NAVIGATION HEADER WITH BRAND BADGE & DIRECT SIGN IN */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-300/40">
            <FiZap className="size-3.5 text-cyan-500" /> LocoMart Super App
          </span>
        </div>
        {onSignInDirect && (
          <button
            type="button"
            onClick={onSignInDirect}
            className="text-xs font-extrabold text-slate-600 hover:text-cyan-600 transition-colors px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white/80 hover:bg-white shadow-2xs"
          >
            Already have an account? <span className="text-cyan-600 font-black underline ml-1">Sign In</span>
          </button>
        )}
      </header>

      {/* MAIN CENTER CONTENT (Combining Image 3 Card & Image 2 Headline) */}
      <main className="relative z-10 my-auto flex flex-col items-center text-center space-y-6 max-w-lg w-full">
        {/* CENTER WHITE FLOATING LOGO CARD (Exact from Image 3) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative grid place-items-center rounded-3xl bg-white p-7 shadow-2xl shadow-cyan-900/10 border border-slate-100 max-w-[280px] sm:max-w-[310px] w-full aspect-square"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* HYPERLOCAL "H" BRAND ICON (From Image 3) */}
            <div className="relative flex items-center justify-center size-24 sm:size-28 rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-400 to-teal-500 p-1 shadow-lg shadow-cyan-500/25 animate-pulse">
              <div className="size-full bg-white rounded-[22px] flex items-center justify-center p-2">
                <svg className="size-16 sm:size-20" viewBox="0 0 100 100" fill="none">
                  {/* Linked Double Pill "H" Logo */}
                  <rect x="18" y="20" width="20" height="60" rx="10" fill="#00BCD4" />
                  <rect x="62" y="20" width="20" height="60" rx="10" fill="#00BCD4" />
                  <rect x="25" y="40" width="50" height="20" rx="10" fill="#00BCD4" />
                  <rect x="24" y="27" width="8" height="46" rx="4" fill="#E0F7FA" />
                  <rect x="68" y="27" width="8" height="46" rx="4" fill="#E0F7FA" />
                  <rect x="32" y="46" width="36" height="8" rx="4" fill="#E0F7FA" />
                </svg>
              </div>
            </div>

            {/* LOGO TEXT INSIDE CARD (From Image 3) */}
            <div className="space-y-0.5">
              <h2 className="text-sm sm:text-base font-black tracking-wider text-cyan-600 uppercase">
                HYPERLOCAL
              </h2>
              <p className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">
                SUPER APP
              </p>
            </div>
          </div>
        </motion.div>

        {/* SUBTITLE BELOW CARD (From Image 3) */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl sm:text-3xl font-black text-[#044D63] tracking-tight"
        >
          Almost ready...
        </motion.h3>

        {/* BIG TAGLINE HEADLINE (From Image 2) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="space-y-2 pt-2"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything. Nearby.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xs mx-auto">
            Food, Groceries, Shopping, Rides & Instant Parcel Courier delivered to your doorstep.
          </p>
        </motion.div>

        {/* ACTION BUTTON TO SIGN UP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="pt-4 w-full max-w-xs"
        >
          <button
            type="button"
            onClick={onProceed}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
          >
            <span>{isReady ? "Get Started" : "Continue to Sign Up"}</span>
            <FiArrowRight className="size-5" />
          </button>
        </motion.div>
      </main>

      {/* FOOTER SECTION: CONNECTION CHECK & PROGRESS BAR (Exact from Image 2) */}
      <footer className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-3 text-center pb-2">
        {/* UPPERCASE CONNECTION STATUS TEXT (From Image 2) */}
        <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
          {isReady ? (
            <span className="flex items-center gap-1.5 text-emerald-600">
              <FiCheckCircle className="size-3.5" /> SYSTEM READY • V1.0.0
            </span>
          ) : (
            <span>{statusText}</span>
          )}
        </div>

        {/* ANIMATED PROGRESS BAR TRACK & FILL (Exact from Image 2) */}
        <div className="h-1.5 w-64 sm:w-72 rounded-full bg-slate-200/80 overflow-hidden shadow-inner p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* TRUST BADGE */}
        <div className="pt-2 text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <FiShield className="size-3.5 text-cyan-600" /> 100% Encrypted & Safe Super App
        </div>
      </footer>
    </div>
  );
}
