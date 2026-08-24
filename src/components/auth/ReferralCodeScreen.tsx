import { useState } from "react";
import { motion } from "framer-motion";
import { FiGlobe, FiUser } from "react-icons/fi";
import { toast } from "sonner";

interface ReferralCodeScreenProps {
  onApply: (code: string) => void;
  onSkip: () => void;
}

export function ReferralCodeScreen({ onApply, onSkip }: ReferralCodeScreenProps) {
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter a referral code or tap Skip.");
      return;
    }
    toast.success(`Referral code '${code.toUpperCase()}' applied! ₹100 Welcome reward unlocked.`);
    onApply(code.toUpperCase());
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 py-6 sm:py-10 bg-[#FAFDFB] select-none overflow-hidden">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 40%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP HEADER (Exact from Image 1: Avatar, SUPER title, Translate icon) */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between shrink-0">
        <div className="size-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="User Profile"
            className="size-full object-cover"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#044D63] tracking-wider uppercase">
          SUPER
        </h1>

        <button
          type="button"
          onClick={() => toast.info("Select language anytime from header")}
          className="p-1.5 rounded-full text-[#044D63] hover:bg-slate-200/50 transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <span className="text-base font-serif">文A</span>
        </button>
      </header>

      {/* MAIN CONTENT AREA (Exact from Image 1) */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Have a referral code?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xs mx-auto">
            Enter it below to claim your welcome reward.
          </p>
        </motion.div>

        {/* INPUT FORM (Exact from Image 1) */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4 pt-2"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            className="w-full h-14 rounded-2xl border border-slate-300 bg-white px-4 text-center text-sm font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#044D63] focus:ring-2 focus:ring-[#044D63]/20 shadow-2xs transition-all"
          />

          <button
            type="submit"
            className="w-full h-13 rounded-2xl bg-[#044D63] hover:bg-[#033B4C] text-white font-extrabold text-base shadow-lg shadow-cyan-950/20 transition-all flex items-center justify-center"
          >
            Apply
          </button>
        </motion.form>
      </main>

      {/* FOOTER SKIP LINK (Exact from Image 1) */}
      <footer className="relative z-10 w-full max-w-md mx-auto pt-4 shrink-0 text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs sm:text-sm font-extrabold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
        >
          Skip
        </button>
      </footer>
    </div>
  );
}
