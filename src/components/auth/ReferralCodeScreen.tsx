import { useState } from "react";
import { motion } from "framer-motion";

interface ReferralCodeScreenProps {
  onApply: (code: string) => void;
  onSkip: () => void;
}

export function ReferralCodeScreen({ onApply, onSkip }: ReferralCodeScreenProps) {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg("Please enter a referral code or tap Skip.");
      return;
    }
    setErrorMsg("");
    onApply(code.toUpperCase());
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 py-6 sm:py-10 bg-[#FAFDFB] dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-hidden transition-colors">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 40%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP HEADER */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between shrink-0">
        <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-white/10 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="User Profile"
            className="size-full object-cover"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#044D63] dark:text-cyan-400 tracking-wider uppercase">
          SUPER
        </h1>

        <div className="size-9" />
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Have a referral code?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold max-w-xs mx-auto">
            Enter it below to claim your welcome reward.
          </p>
        </motion.div>

        {/* INPUT FORM */}
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
            onChange={(e) => {
              setErrorMsg("");
              setCode(e.target.value.toUpperCase());
            }}
            placeholder="ENTER CODE"
            className="w-full h-14 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 text-center text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-[#044D63] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#044D63]/20 shadow-2xs transition-all"
          />

          {errorMsg && (
            <p className="text-xs font-bold text-rose-500 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full h-13 rounded-2xl bg-[#044D63] hover:bg-[#033B4C] text-white font-extrabold text-base shadow-lg shadow-cyan-950/20 transition-all flex items-center justify-center cursor-pointer"
          >
            Apply
          </button>
        </motion.form>
      </main>

      {/* FOOTER SKIP LINK */}
      <footer className="relative z-10 w-full max-w-md mx-auto pt-4 shrink-0 text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-1 cursor-pointer"
        >
          Skip
        </button>
      </footer>
    </div>
  );
}
