import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiMessageSquare,
  FiNavigation,
  FiPhone,
  FiShield,
  FiStar,
  FiX,
  FiZap,
} from "react-icons/fi";
import { currency } from "@/utils/format";

interface LiveFoodTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
}

const ORDER_STEPS = [
  { label: "Order Confirmed", time: "7:45 PM", done: true },
  { label: "Restaurant Preparing Fresh Food", time: "7:50 PM", done: true },
  { label: "Food Packed & Sealed", time: "8:00 PM", done: true },
  { label: "Rider on the way to Narasa Agraharam", time: "8:08 PM", done: false, active: true },
  { label: "Delivered at Door", time: "8:15 PM", done: false },
];

export function LiveFoodTrackingModal({ isOpen, onClose, orderNumber = "#LM-8492" }: LiveFoodTrackingModalProps) {
  const [currentStep, setCurrentStep] = useState(3);
  const [showDelayBanner, setShowDelayBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayBanner(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* HEADER */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                    Live Order Tracking
                    <span className="text-xs font-bold text-slate-500">{orderNumber}</span>
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
                    Arriving in ~14 mins · 8:12 PM
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
              >
                <FiX className="size-4" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* PROACTIVE DELAY COMMUNICATION BANNER */}
              <AnimatePresence>
                {showDelayBanner && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs font-bold text-amber-800 dark:text-amber-300"
                  >
                    <FiAlertCircle className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-black">Proactive Order Update</div>
                      <p className="text-[11px] text-amber-700 dark:text-amber-200/90 font-medium">
                        Fresh wood-fired cooking at Sri Sai Biryani is taking 3 extra minutes to ensure peak taste. Your order is on schedule!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SIMULATED MAP VIEW */}
              <div className="relative h-44 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-slate-900/10 pointer-events-none" />

                {/* VISUAL ROUTE LINE */}
                <div className="relative z-10 w-full px-6 flex items-center justify-between">
                  <div className="text-center space-y-1">
                    <div className="grid size-10 place-items-center rounded-2xl bg-slate-900 text-white text-lg shadow-md mx-auto">
                      🍳
                    </div>
                    <span className="text-[10px] font-black text-slate-500 block">Sri Sai Biryani</span>
                  </div>

                  <div className="flex-1 px-4 relative flex items-center justify-center">
                    <div className="w-full h-1 bg-dashed border-t-2 border-dashed border-emerald-500" />
                    <motion.div
                      animate={{ x: [-15, 15, -15] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute grid size-9 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg text-sm"
                    >
                      🛵
                    </motion.div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white text-lg shadow-md mx-auto">
                      🏠
                    </div>
                    <span className="text-[10px] font-black text-slate-500 block">Narasa Agraharam</span>
                  </div>
                </div>
              </div>

              {/* DRIVER PROFILE CARD */}
              <div className="p-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/20 text-2xl text-emerald-600 font-bold border border-emerald-500/30">
                    👨‍✈️
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        Kalyan Varma
                      </h4>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                        <FiStar className="fill-amber-500 text-amber-500 size-2.5" /> 4.9
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      Hero Splendor · <b className="text-slate-800 dark:text-slate-200">AP 37 BP 4821</b>
                    </p>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      ✓ Vaccinated & Temperature Checked
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:+919876543210"
                    className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                  >
                    <FiPhone className="size-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => alert("Connecting chat with delivery partner Kalyan Varma")}
                    className="grid size-10 place-items-center rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
                  >
                    <FiMessageSquare className="size-4" />
                  </button>
                </div>
              </div>

              {/* TIMELINE STEPS */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Order Status Timeline
                </span>
                <div className="space-y-3 pl-2">
                  {ORDER_STEPS.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative text-xs">
                      <div className="flex flex-col items-center">
                        <span
                          className={`size-3 rounded-full mt-0.5 ${
                            idx <= currentStep
                              ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                              : "bg-slate-300 dark:bg-slate-700"
                          }`}
                        />
                        {idx < ORDER_STEPS.length - 1 && (
                          <div className={`w-0.5 h-6 ${idx < currentStep ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                        )}
                      </div>
                      <div className="flex-1 flex justify-between">
                        <span
                          className={`font-bold ${
                            idx === currentStep
                              ? "text-emerald-600 dark:text-emerald-400 font-black"
                              : idx < currentStep
                              ? "text-slate-800 dark:text-slate-200"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
