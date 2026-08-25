import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiShield, FiX, FiZap } from "react-icons/fi";
import { currency } from "@/utils/format";
import { ALL_BHIMAVARAM_DISHES, type FoodDish } from "./bhimavaramFoodData";

interface HealthModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: FoodDish) => void;
}

export function HealthModeModal({ isOpen, onClose, onSelectDish }: HealthModeModalProps) {
  const [activeHealthFilter, setActiveHealthFilter] = useState<"high-protein" | "low-calorie" | "veg" | "high-fiber">("high-protein");

  const healthyDishes = ALL_BHIMAVARAM_DISHES.filter((d) => {
    if (activeHealthFilter === "high-protein") return (d.proteinGrams || 0) >= 25;
    if (activeHealthFilter === "low-calorie") return (d.calories || 0) <= 400;
    if (activeHealthFilter === "veg") return d.veg;
    if (activeHealthFilter === "high-fiber") return d.category === "tiffins" || d.category === "meals";
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-lg max-h-[88vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* HEADER */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥗</span>
                <div>
                  <h3 className="text-base font-black leading-tight">Eat Better · Health Mode</h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    Verified macro nutrients & calorie-conscious meals in Bhimavaram.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
              >
                <FiX className="size-4.5" />
              </button>
            </div>

            {/* HEALTH FILTER CHIPS */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: "high-protein", label: "💪 High Protein (25g+)" },
                { id: "low-calorie", label: "🔥 Low Calorie (<400 kcal)" },
                { id: "veg", label: "🥦 Plant Based Veg" },
                { id: "high-fiber", label: "🌾 High Fiber & Millets" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveHealthFilter(pill.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    activeHealthFilter === pill.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* DISHES LIST */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
              {healthyDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3.5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="size-16 rounded-xl object-cover shrink-0 shadow-2xs"
                    />
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {dish.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        {dish.restaurantName}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                        {dish.proteinGrams && <span>⚡ {dish.proteinGrams}g Protein</span>}
                        {dish.calories && <span>• 🔥 {dish.calories} kcal</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900 dark:text-white block">
                      {currency(dish.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDish(dish);
                        onClose();
                      }}
                      className="mt-1 px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
