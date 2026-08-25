import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck, FiRefreshCw, FiStar, FiX, FiZap } from "react-icons/fi";
import { currency } from "@/utils/format";
import { ALL_BHIMAVARAM_DISHES, type FoodDish } from "./bhimavaramFoodData";

interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderDish: (dish: FoodDish) => void;
}

export function SurpriseMeModal({ isOpen, onClose, onOrderDish }: SurpriseMeModalProps) {
  const [budget, setBudget] = useState(300);
  const [dietary, setDietary] = useState<"any" | "veg" | "non-veg">("any");
  const [spicyPref, setSpicyPref] = useState<"any" | "mild" | "spicy">("any");
  const [pickedDish, setPickedDish] = useState<FoodDish | null>(ALL_BHIMAVARAM_DISHES[0] || null);
  const [isRolling, setIsRolling] = useState(false);

  const rollSurprise = () => {
    setIsRolling(true);
    setTimeout(() => {
      const candidates = ALL_BHIMAVARAM_DISHES.filter((d) => {
        if (d.price > budget) return false;
        if (dietary === "veg" && !d.veg) return false;
        if (dietary === "non-veg" && d.veg) return false;
        if (spicyPref === "spicy" && d.spicyLevel !== "Spicy" && d.spicyLevel !== "Extra Spicy") return false;
        if (spicyPref === "mild" && d.spicyLevel !== "Mild") return false;
        return true;
      });

      const list = candidates.length > 0 ? candidates : ALL_BHIMAVARAM_DISHES;
      const random = list[Math.floor(Math.random() * list.length)] || ALL_BHIMAVARAM_DISHES[0]!;
      setPickedDish(random);
      setIsRolling(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-md flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* HEADER */}
            <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-base font-black leading-tight">Surprise Me</h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Can't decide? Let our Bhimavaram Food AI pick for you!
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

            {/* BODY */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* BUDGET SLIDER */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                    Max Budget
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                    {currency(budget)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={600}
                  step={50}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* DIETARY PREFERENCE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "any", label: "Any 🍽️" },
                    { id: "veg", label: "Pure Veg 🟢" },
                    { id: "non-veg", label: "Non-Veg 🍗" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDietary(item.id as any)}
                      className={`p-2 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center ${
                        dietary === item.id
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SURPRISE CARD RESULT */}
              {pickedDish && (
                <div className="p-4 rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black text-amber-700 dark:text-amber-300">
                    <span>✨ WE PICKED THIS FOR YOU</span>
                    <button
                      type="button"
                      onClick={rollSurprise}
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <FiRefreshCw className={`size-3 ${isRolling ? "animate-spin" : ""}`} /> Roll Again
                    </button>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img
                      src={pickedDish.image}
                      alt={pickedDish.name}
                      className="size-16 rounded-2xl object-cover shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {pickedDish.name}
                        </h4>
                        <span className="text-xs font-bold text-amber-500">⭐ {pickedDish.rating}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        {pickedDish.restaurantName} · ⏱️ ~{pickedDish.prepTimeMin} mins
                      </p>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 pt-0.5">
                        {currency(pickedDish.price)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <button
                type="button"
                onClick={() => {
                  if (pickedDish) {
                    onOrderDish(pickedDish);
                    onClose();
                  }
                }}
                className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order This Surprise Dish</span>
                <FiArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
