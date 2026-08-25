import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiCopy, FiShare2, FiUsers, FiX } from "react-icons/fi";
import { currency } from "@/utils/format";

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GroupOrderModal({ isOpen, onClose }: GroupOrderModalProps) {
  const [copied, setCopied] = useState(false);

  const groupParticipants = [
    { name: "You (Host)", items: "Special Pot Biryani × 1", amount: 249, avatar: "👨" },
    { name: "Rahul V.", items: "Chicken 65 × 1, Thums Up × 1", amount: 220, avatar: "👦" },
    { name: "Priya S.", items: "Ghee Karam Dosa × 1, Pootharekulu × 1", amount: 180, avatar: "👩" },
  ];

  const totalAmount = groupParticipants.reduce((sum, p) => sum + p.amount, 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://locomart.app/group/bhimavaram-dinner-4921");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="p-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="text-base font-black leading-tight">Group Order Cart</h3>
                  <p className="text-xs text-blue-100 font-medium">
                    Order together, split dishes individually, 1 shared checkout.
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
              {/* SHARE LINK BOX */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300 block">
                  Invite Friends to Add Their Food
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="locomart.app/group/bhimavaram-dinner-4921"
                    className="flex-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <FiCheck className="size-3.5" /> : <FiCopy className="size-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* PARTICIPANTS BREAKDOWN */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Active Member Baskets ({groupParticipants.length})
                </span>
                <div className="space-y-2">
                  {groupParticipants.map((p) => (
                    <div
                      key={p.name}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{p.avatar}</span>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white leading-tight">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                            {p.items}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">
                        {currency(p.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-black">
                <span>Total Combined Order</span>
                <span className="text-base text-emerald-600 dark:text-emerald-400">
                  {currency(totalAmount)}
                </span>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Group Checkout · {currency(totalAmount)}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
