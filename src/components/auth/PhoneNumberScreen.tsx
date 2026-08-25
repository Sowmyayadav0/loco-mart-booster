import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiLock, FiPhone } from "react-icons/fi";

interface PhoneNumberScreenProps {
  onContinue: (phoneNum: string) => void;
  onBack: () => void;
  onSwitchToPasswordLogin: () => void;
}

export function PhoneNumberScreen({
  onContinue,
  onBack,
  onSwitchToPasswordLogin,
}: PhoneNumberScreenProps) {
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMsg("");
    onContinue(`+91 ${clean}`);
  }

  return (
    <div className="relative h-screen max-h-screen w-full flex flex-col justify-between px-4 py-4 sm:py-8 bg-[#FAFDFB] dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-hidden transition-colors">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-75 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 40%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP BAR WITH BACK ARROW */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between shrink-0 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="size-10 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <FiArrowLeft className="size-5" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto space-y-6">
        {/* HEADING & SUBTITLE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-1.5"
        >
          <div className="grid place-items-center size-14 rounded-2xl bg-cyan-100/70 dark:bg-cyan-500/20 text-[#044D63] dark:text-cyan-300 mx-auto mb-2 shadow-xs">
            <FiPhone className="size-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#044D63] dark:text-cyan-400 tracking-tight">
            Enter mobile number
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
            We'll send you a 4-digit verification code.
          </p>
        </motion.div>

        {/* PHONE NUMBER INPUT FORM */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4 pt-1"
        >
          <div className="relative flex items-center rounded-2xl border-2 border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 p-1.5 shadow-md shadow-cyan-900/5 focus-within:border-[#00BCD4] focus-within:ring-2 focus-within:ring-cyan-400/20 transition-all">
            {/* COUNTRY CODE BADGE */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-r border-slate-200 dark:border-white/10 text-xs font-black text-slate-800 dark:text-slate-200 shrink-0">
              <span className="text-base">🇮🇳</span>
              <span>+91</span>
            </div>

            {/* 10-DIGIT PHONE INPUT */}
            <input
              type="tel"
              maxLength={10}
              autoFocus
              value={phone}
              onChange={(e) => {
                setErrorMsg("");
                setPhone(e.target.value.replace(/\D/g, ""));
              }}
              placeholder="98765 43210"
              className="w-full h-11 bg-transparent px-3 text-base sm:text-lg font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none tracking-wider"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-rose-500 text-center">{errorMsg}</p>
          )}

          {/* PRIMARY CYAN CONTINUE BUTTON */}
          <button
            type="submit"
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-[#044D63] hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <FiArrowRight className="size-5" />
          </button>
        </motion.form>

        {/* SWITCH TO PASSWORD LOGIN */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToPasswordLogin}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#044D63] dark:text-cyan-400 hover:underline cursor-pointer"
          >
            <FiLock className="size-3.5" />
            <span>Sign in with Password instead</span>
          </button>
        </div>
      </main>

      {/* FOOTER PRIVACY NOTICE */}
      <footer className="relative z-10 w-full max-w-md mx-auto pt-4 shrink-0 text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
          By continuing, you agree to LocoMart's <span className="underline">Terms of Service</span> & <span className="underline">Privacy Policy</span>.
        </p>
      </footer>
    </div>
  );
}
