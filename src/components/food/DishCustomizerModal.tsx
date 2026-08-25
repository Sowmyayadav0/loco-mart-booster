import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiMinus, FiPlus, FiStar, FiX, FiShield, FiHeart } from "react-icons/fi";
import { currency } from "@/utils/format";
import type { FoodDish } from "./bhimavaramFoodData";

interface DishCustomizerModalProps {
  dish: FoodDish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: FoodDish, qty: number, customizedOptions: { spice: string; portion: string; addOns: string[]; notes: string }) => void;
}

export function DishCustomizerModal({ dish, isOpen, onClose, onAddToCart }: DishCustomizerModalProps) {
  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState(dish.customizationOptions.spiceLevels?.[0] || dish.spicyLevel);
  const [selectedPortion, setSelectedPortion] = useState(dish.customizationOptions.portionSizes?.[0] || { label: "Standard", priceDelta: 0 });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [cookingNotes, setCookingNotes] = useState("");

  const toggleAddOn = (name: string) => {
    if (selectedAddOns.includes(name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a !== name));
    } else {
      setSelectedAddOns([...selectedAddOns, name]);
    }
  };

  const addOnTotal = (dish.customizationOptions.addOns || [])
    .filter((a) => selectedAddOns.includes(a.name))
    .reduce((sum, a) => sum + a.price, 0);

  const unitPrice = dish.price + selectedPortion.priceDelta + addOnTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirmAdd = () => {
    onAddToCart(dish, quantity, {
      spice: selectedSpice,
      portion: selectedPortion.label,
      addOns: selectedAddOns,
      notes: cookingNotes,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* MODAL HEADER & DISH IMAGE */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden shrink-0">
              <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <FiX className="size-5" />
              </button>

              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`size-3 rounded-full ${
                      dish.veg ? "bg-emerald-500" : "bg-rose-500"
                    } ring-2 ring-white`}
                  />
                  <span className="text-xs font-bold text-amber-300">
                    ⭐ {dish.rating} ({dish.ratingCount} reviews) · {dish.reorderRate}% Reorder Rate
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {dish.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium line-clamp-1">{dish.description}</p>
              </div>
            </div>

            {/* SCROLLABLE CUSTOMIZATION OPTIONS */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* ITEM-LEVEL TRUST METRICS */}
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <FiShield className="size-4 text-emerald-600" /> Item Quality Rating
                  </span>
                  <span>{dish.reorderRate}% Customer Reorder Rate</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-300 pt-1 border-t border-emerald-500/20">
                  <div>Taste ⭐ {dish.trustScores.taste}</div>
                  <div>Portion ⭐ {dish.trustScores.portion}</div>
                  <div>Pack ⭐ {dish.trustScores.packaging}</div>
                  <div>Value ⭐ {dish.trustScores.value}</div>
                </div>
              </div>

              {/* SPICE LEVEL SELECTION */}
              {dish.customizationOptions.spiceLevels && dish.customizationOptions.spiceLevels.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Choose Spice Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dish.customizationOptions.spiceLevels.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedSpice(lvl)}
                        className={`p-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center ${
                          selectedSpice === lvl
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                            : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PORTION SIZE */}
              {dish.customizationOptions.portionSizes && dish.customizationOptions.portionSizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Select Portion Size
                  </label>
                  <div className="space-y-2">
                    {dish.customizationOptions.portionSizes.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setSelectedPortion(p)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                          selectedPortion.label === p.label
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500"
                            : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <span>{p.label}</span>
                        <span>{p.priceDelta === 0 ? "Standard" : `+ ${currency(p.priceDelta)}`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ADD-ONS */}
              {dish.customizationOptions.addOns && dish.customizationOptions.addOns.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Recommended Add-Ons
                  </label>
                  <div className="space-y-2">
                    {dish.customizationOptions.addOns.map((a) => {
                      const isSelected = selectedAddOns.includes(a.name);
                      return (
                        <button
                          key={a.name}
                          type="button"
                          onClick={() => toggleAddOn(a.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                              : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`grid size-5 place-items-center rounded-md border ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}
                            >
                              {isSelected && <FiCheck className="size-3.5" />}
                            </span>
                            <span>{a.name}</span>
                          </div>
                          <span className="font-black text-slate-900 dark:text-white">+ {currency(a.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* COOKING INSTRUCTIONS */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Cooking Notes / Special Requests
                </label>
                <input
                  type="text"
                  value={cookingNotes}
                  onChange={(e) => setCookingNotes(e.target.value)}
                  placeholder="e.g. Less oil, extra lemon, spicy salan"
                  className="w-full h-11 px-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* MODAL FOOTER WITH QUANTITY & ADD TO CART CTA */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-white font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <FiMinus className="size-4" />
                </button>
                <span className="w-6 text-center text-sm font-black text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="size-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-white font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <FiPlus className="size-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-between px-5 cursor-pointer"
              >
                <span>Add Item</span>
                <span>{currency(totalPrice)}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
