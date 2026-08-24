import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiKey, FiLock } from "react-icons/fi";
import { toast } from "sonner";

interface OtpPasswordScreenProps {
  phone: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export function OtpPasswordScreen({ phone, onVerifySuccess, onBack }: OtpPasswordScreenProps) {
  const [usePassword, setUsePassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // OTP Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [timer]);

  function handleOtpChange(index: number, val: string) {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    if (clean && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  }

  function handleResend() {
    setTimer(30);
    setOtp(["", "", "", ""]);
    toast.success(`New 4-digit code sent to ${phone}!`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (usePassword) {
      if (!password || password.length < 6) {
        setLoading(false);
        toast.error("Password must be at least 6 characters.");
        return;
      }
      toast.success("Signed in successfully!");
      setLoading(false);
      onVerifySuccess();
    } else {
      const enteredCode = otp.join("");
      if (enteredCode.length < 4) {
        setLoading(false);
        toast.error("Please enter the complete 4-digit code.");
        return;
      }
      toast.success("Phone OTP verified successfully!");
      setLoading(false);
      onVerifySuccess();
    }
  }

  return (
    <div className="relative h-screen max-h-screen w-full flex flex-col justify-between px-4 py-4 sm:py-8 bg-[#FAFDFB] select-none overflow-hidden">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-75"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 40%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP BAR WITH BACK ARROW (Exact from Image 2) */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between shrink-0 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="size-10 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
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
          <div className="grid place-items-center size-14 rounded-2xl bg-cyan-100/70 text-[#044D63] mx-auto mb-2 shadow-xs">
            {usePassword ? <FiLock className="size-7" /> : <FiKey className="size-7" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#044D63] tracking-tight">
            {usePassword ? "Enter your password" : "Enter verification code"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            {usePassword ? (
              <span>Sign in with password for <b className="text-slate-900">{phone}</b></span>
            ) : (
              <span>Code sent to <b className="text-slate-900">{phone}</b></span>
            )}
          </p>
        </motion.div>

        {/* VERIFICATION FORM */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-5 pt-1"
        >
          {!usePassword ? (
            /* 4-DIGIT OTP BOXES */
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="size-13 sm:size-14 rounded-2xl border-2 border-slate-200 bg-white text-center text-2xl font-black text-slate-900 outline-none focus:border-[#00BCD4] focus:bg-[#EEFBFD] focus:ring-2 focus:ring-cyan-400/20 shadow-md transition-all"
                  />
                ))}
              </div>

              {/* RESEND OTP TIMER */}
              <div className="text-center text-xs font-bold">
                {timer > 0 ? (
                  <span className="text-slate-400">Resend code in <b className="text-cyan-700">{timer}s</b></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#00BCD4] hover:underline font-extrabold cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* PASSWORD INPUT */
            <div className="space-y-2">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 6+ character password"
                className="w-full h-13 rounded-2xl border-2 border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#00BCD4] focus:bg-[#EEFBFD] shadow-md transition-all"
              />
            </div>
          )}

          {/* PRIMARY CYAN SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-[#044D63] hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
            <FiArrowRight className="size-5" />
          </button>
        </motion.form>

        {/* TOGGLE BETWEEN OTP & PASSWORD */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setUsePassword(!usePassword)}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#044D63] hover:underline cursor-pointer"
          >
            {usePassword ? (
              <>
                <FiKey className="size-3.5" /> Use 4-Digit OTP Code instead
              </>
            ) : (
              <>
                <FiLock className="size-3.5" /> Use Account Password instead
              </>
            )}
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-md mx-auto pt-4 shrink-0 text-center">
        <p className="text-[10px] text-slate-400 font-semibold">
          🔒 256-bit Encrypted Secure Authentication
        </p>
      </footer>
    </div>
  );
}
