import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck, FiCpu, FiMessageSquare, FiSend, FiStar, FiX, FiZap } from "react-icons/fi";
import { currency } from "@/utils/format";
import {
  ALL_BHIMAVARAM_DISHES,
  AI_FOOD_PROMPT_SUGGESTIONS,
  type FoodDish,
} from "./bhimavaramFoodData";

interface AIFoodAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: FoodDish) => void;
  onOpenRestaurant: (restaurantId: string) => void;
}

interface AIRecommendationResult {
  dish: FoodDish;
  matchScore: number; // e.g. 96
  matchReasons: string[];
}

export function AIFoodAssistantModal({
  isOpen,
  onClose,
  onSelectDish,
  onOpenRestaurant,
}: AIFoodAssistantModalProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AIRecommendationResult[]>([
    {
      dish: ALL_BHIMAVARAM_DISHES[0]!,
      matchScore: 96,
      matchReasons: [
        "Authentic firewood Andhra spice blend",
        "Priced at ₹249 (Well under ₹300 budget)",
        "Top-rated in Bhimavaram (4.9★ with 1,420+ ratings)",
        "Fast ~18 min preparation time",
      ],
    },
    {
      dish: ALL_BHIMAVARAM_DISHES[4]!,
      matchScore: 92,
      matchReasons: [
        "World famous fresh Godavari river catch",
        "Crispy sautéed in local spices & caramelized onions",
        "98% customer reorder rate",
      ],
    },
  ]);

  const handleRunSearch = (textToSearch: string) => {
    if (!textToSearch.trim()) return;
    setQuery(textToSearch);
    setIsSearching(true);

    setTimeout(() => {
      const lower = textToSearch.toLowerCase();
      let matched = ALL_BHIMAVARAM_DISHES.filter((d) => {
        if (lower.includes("veg") && !lower.includes("non")) return d.veg;
        if (lower.includes("chicken") || lower.includes("mutton") || lower.includes("seafood") || lower.includes("prawn")) return !d.veg;
        if (lower.includes("sweet") || lower.includes("dessert")) return d.category === "desserts";
        if (lower.includes("tiffin") || lower.includes("dosa") || lower.includes("idli") || lower.includes("breakfast")) return d.category === "tiffins";
        if (lower.includes("spicy")) return d.spicyLevel === "Spicy" || d.spicyLevel === "Extra Spicy";
        return true;
      });

      if (matched.length === 0) matched = ALL_BHIMAVARAM_DISHES;

      const aiResults: AIRecommendationResult[] = matched.slice(0, 3).map((dish, i) => ({
        dish,
        matchScore: 95 - i * 3,
        matchReasons: [
          `Matches your taste preference (${dish.spicyLevel} spice)`,
          `Fits your price expectations (${currency(dish.price)})`,
          `Fast local preparation (~${dish.prepTimeMin} mins)`,
          `${dish.reorderRate}% reorder rate in Bhimavaram`,
        ],
      }));

      setResults(aiResults);
      setIsSearching(false);
    }, 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* HEADER */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm text-xl">
                  ✨
                </span>
                <div>
                  <h3 className="text-lg font-black leading-tight flex items-center gap-2">
                    Loco AI Food Concierge
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                      Bhimavaram Live
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    Ask in natural language — instant tailored dishes matching your mood & budget.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
              >
                <FiX className="size-4.5" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* SEARCH INPUT */}
              <div className="space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunSearch(query);
                  }}
                  className="relative flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Give me something spicy under ₹300 in 25 mins"
                    className="flex-1 h-13 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !query.trim()}
                    className="h-13 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSearching ? "Thinking..." : "Find"}</span>
                    <FiZap className="size-4" />
                  </button>
                </form>

                {/* SUGGESTED PROMPT CHIPS */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Try asking:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AI_FOOD_PROMPT_SUGGESTIONS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleRunSearch(prompt)}
                        className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer text-left"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECOMMENDATION RESULTS */}
              <div className="space-y-3.5 pt-2 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    AI Match Recommendations ({results.length})
                  </h4>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Powered by Bhimavaram Taste Graph
                  </span>
                </div>

                <div className="space-y-4">
                  {results.map((rec) => {
                    const dish = rec.dish;
                    return (
                      <motion.div
                        key={dish.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 p-4 sm:p-5 shadow-xs space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="size-16 sm:size-20 rounded-2xl object-cover shrink-0 shadow-2xs"
                            />
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                  ⚡ {rec.matchScore}% Match
                                </span>
                                <span className="text-xs font-bold text-amber-500">
                                  ⭐ {dish.rating}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                                {dish.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                {dish.restaurantName} · ⏱️ ~{dish.prepTimeMin} mins
                              </p>
                              <div className="text-sm font-black text-slate-900 dark:text-white pt-0.5">
                                {currency(dish.price)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* WHY THIS MATCHES YOU */}
                        <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-white/10 space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                            Why this matches your request:
                          </span>
                          <ul className="space-y-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {rec.matchReasons.map((reason, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <FiCheck className="size-3.5 text-emerald-500 shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDish(dish);
                              onClose();
                            }}
                            className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Customize & Order · {currency(dish.price)}</span>
                            <FiArrowRight className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onOpenRestaurant(dish.restaurantId);
                              onClose();
                            }}
                            className="px-4 h-11 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            View Menu
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
