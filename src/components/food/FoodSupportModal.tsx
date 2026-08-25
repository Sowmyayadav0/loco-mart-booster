import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheck, FiHeadphones, FiHelpCircle, FiMessageSquare, FiPhone, FiX } from "react-icons/fi";

interface FoodSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORT_TOPICS = [
  { id: "late", title: "Order is delayed / Taking too long", icon: "⏱️" },
  { id: "missing", title: "Missing item or wrong dish delivered", icon: "📦" },
  { id: "quality", title: "Food taste / quality or packaging issue", icon: "🍲" },
  { id: "payment", title: "Payment deducted but order not placed", icon: "💳" },
  { id: "cancel", title: "Cancellation or refund status", icon: "🔄" },
];

export function FoodSupportModal({ isOpen, onClose }: FoodSupportModalProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedTopic(null);
      onClose();
    }, 2000);
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
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-2xl bg-white/20 text-lg">
                  🎧
                </span>
                <div>
                  <h3 className="text-base font-black leading-tight">Loco Food Support</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    24/7 Dedicated Bhimavaram Care Team
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
            <div className="p-5 sm:p-6 space-y-4">
              {submitted ? (
                <div className="text-center py-8 space-y-2">
                  <div className="grid size-14 place-items-center rounded-full bg-emerald-500/20 text-emerald-600 mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    Support Ticket Created
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Our Bhimavaram support agent will call or message you in under 2 minutes.
                  </p>
                </div>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    What issue are you facing?
                  </span>
                  <div className="space-y-2">
                    {SUPPORT_TOPICS.map((topic) => {
                      const active = selectedTopic === topic.id;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSelectedTopic(topic.id)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                            active
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500"
                              : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span>{topic.icon}</span>
                            <span>{topic.title}</span>
                          </div>
                          {active && <FiCheck className="size-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={!selectedTopic}
                    onClick={handleSubmit}
                    className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Connect with Support Agent</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
