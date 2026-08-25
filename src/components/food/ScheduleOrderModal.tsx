import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiCheck, FiX } from "react-icons/fi";

interface ScheduleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (slot: string) => void;
}

export function ScheduleOrderModal({ isOpen, onClose, onConfirmSchedule }: ScheduleOrderModalProps) {
  const [selectedSlot, setSelectedSlot] = useState("Dinner Tonight · 8:00 PM");

  const SLOTS = [
    { id: "tonight-dinner", label: "Dinner Tonight · 8:00 PM", desc: "Fresh hot delivery right on time for dinner" },
    { id: "tonight-late", label: "Late Night · 10:30 PM", desc: "For post-movie or study cravings" },
    { id: "tomorrow-breakfast", label: "Tomorrow Breakfast · 8:00 AM", desc: "Piping hot ghee dosas & filter coffee" },
    { id: "tomorrow-lunch", label: "Tomorrow Lunch · 1:00 PM", desc: "Freshly cooked afternoon thalis" },
  ];

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
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <h3 className="text-base font-black leading-tight">Schedule Order Delivery</h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    Pick your preferred meal time for hassle-free delivery.
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
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Select Time Slot
              </span>
              <div className="space-y-2.5">
                {SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot.label;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.label)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className={`size-4 mt-0.5 rounded-full border flex items-center justify-center ${isSelected ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-400"}`}>
                        {isSelected && <FiCheck className="size-3" />}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-black text-xs sm:text-sm">{slot.label}</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{slot.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  onConfirmSchedule(selectedSlot);
                  onClose();
                }}
                className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Delivery Slot</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
