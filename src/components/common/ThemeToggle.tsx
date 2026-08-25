import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useApp } from "@/context/AppContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center p-1 rounded-full border transition-all duration-300 cursor-pointer outline-none select-none touch-manipulation active:scale-95 ${
        isDark
          ? "bg-slate-900/90 border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]"
          : "bg-slate-100/90 border-slate-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)]"
      } ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
    >
      {/* Sliding Glass Capsule Indicator */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
        }}
        className={`absolute top-1 bottom-1 w-[26px] sm:w-7 rounded-full transition-all duration-300 shadow-md ${
          isDark
            ? "left-[calc(100%-30px)] sm:left-[calc(100%-32px)] bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 shadow-[0_0_12px_rgba(147,51,234,0.6)]"
            : "left-1 bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
        }`}
        style={{
          transform: "translate3d(0,0,0)",
        }}
      />

      {/* Light Option (Sun) */}
      <div className="relative z-10 flex items-center justify-center size-6 sm:size-6.5">
        <motion.div
          animate={{
            rotate: isDark ? -45 : 0,
            scale: isDark ? 0.8 : 1,
            opacity: isDark ? 0.45 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          <FiSun
            className={`size-3.5 sm:size-4 transition-colors duration-200 ${
              !isDark
                ? "text-white stroke-[2.4] drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]"
                : "text-slate-400 group-hover:text-amber-300"
            }`}
          />
        </motion.div>
      </div>

      {/* Dark Option (Moon) */}
      <div className="relative z-10 flex items-center justify-center size-6 sm:size-6.5">
        <motion.div
          animate={{
            rotate: isDark ? 0 : 45,
            scale: isDark ? 1 : 0.8,
            opacity: isDark ? 1 : 0.45,
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          <FiMoon
            className={`size-3.5 sm:size-4 transition-colors duration-200 ${
              isDark
                ? "text-white stroke-[2.4] drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]"
                : "text-slate-500 group-hover:text-indigo-600"
            }`}
          />
        </motion.div>
      </div>
    </button>
  );
}
