import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck, FiUsers, FiX, FiZap } from "react-icons/fi";
import { currency } from "@/utils/format";
import { ALL_BHIMAVARAM_DISHES, type FoodDish } from "./bhimavaramFoodData";

interface PartyPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPartyPack: (dishes: { dish: FoodDish; qty: number }[]) => void;
}

export function PartyPlannerModal({ isOpen, onClose, onOrderPartyPack }: PartyPlannerModalProps) {
  const [peopleCount, setPeopleCount] = useState(8);
  const [budget, setBudget] = useState(2500);
  const [partyType, setPartyType] = useState<"biryani" | "mandi" | "mixed">("biryani");

  const comboPlan = useMemo(() => {
    const mainBiryani = ALL_BHIMAVARAM_DISHES[0]!;
    const starters = ALL_BHIMAVARAM_DISHES[3]!;
    const dessert = ALL_BHIMAVARAM_DISHES[6]!;

    const mainQty = Math.ceil(peopleCount / 2);
    const starterQty = Math.ceil(peopleCount / 3);
    const dessertQty = Math.ceil(peopleCount / 2);

    const items = [
      { dish: mainBiryani, qty: mainQty },
      { dish: starters, qty: starterQty },
      { dish: dessert, qty: dessertQty },
    ];

    const total = items.reduce((sum, item) => sum + item.dish.price * item.qty, 0);

    return { items, total, perHead: Math.round(total / peopleCount) };
  }, [peopleCount, partyType]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-lg flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* HEADER */}
            <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h3 className="text-base font-black leading-tight">Plan a Party in Bhimavaram</h3>
                  <p className="text-xs text-purple-200 font-medium">
                    Auto-balanced bulk food packs for gatherings, birthdays & celebrations.
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
              {/* PEOPLE COUNT */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                    Number of Guests
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-black">
                    👥 {peopleCount} People
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={30}
                  step={2}
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* PARTY MEAL TYPE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Food Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "biryani", label: "🍛 Biryani Feast" },
                    { id: "mandi", label: "🍗 Mandi Platter" },
                    { id: "mixed", label: "🍱 Mixed Andhra Thali" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPartyType(item.id as any)}
                      className={`p-2 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center ${
                        partyType === item.id
                          ? "border-purple-600 bg-purple-600 text-white shadow-xs"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RECOMMENDED COMBO PACK PREVIEW */}
              <div className="p-4 rounded-3xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-purple-700 dark:text-purple-300">
                  <span>✨ AUTO-CALCULATED COMBO PACK</span>
                  <span>{currency(comboPlan.perHead)} / person</span>
                </div>

                <div className="space-y-2 text-xs">
                  {comboPlan.items.map((item) => (
                    <div key={item.dish.id} className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.dish.name} × {item.qty}
                      </span>
                      <span className="font-black text-slate-900 dark:text-white">
                        {currency(item.dish.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-purple-500/20 flex justify-between items-center text-sm font-black text-purple-900 dark:text-purple-100">
                  <span>Total Party Pack Cost</span>
                  <span className="text-base text-emerald-600 dark:text-emerald-400">
                    {currency(comboPlan.total)}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="button"
                onClick={() => {
                  onOrderPartyPack(comboPlan.items);
                  onClose();
                }}
                className="w-full h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add {peopleCount}-Person Party Pack to Cart</span>
                <FiArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
