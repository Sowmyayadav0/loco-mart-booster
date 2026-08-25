import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiChevronDown } from "react-icons/fi";

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
  subLabel: string;
}

export const ONBOARDING_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", native: "English", subLabel: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी", subLabel: "Hindi" },
  { code: "te", name: "Telugu", native: "తెలుగు", subLabel: "Telugu" },
  { code: "ta", name: "Tamil", native: "தமிழ்", subLabel: "Tamil" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", subLabel: "Kannada" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", subLabel: "Malayalam" },
  { code: "mr", name: "Marathi", native: "मराठी", subLabel: "Marathi" },
  { code: "bn", name: "Bengali", native: "বাংলা", subLabel: "Bengali" },
];

interface LanguageSelectScreenProps {
  onContinue: (langCode: string) => void;
  onBack: () => void;
  initialLang?: string;
}

export function LanguageSelectScreen({ onContinue, onBack, initialLang = "en" }: LanguageSelectScreenProps) {
  const [selected, setSelected] = useState<string>(initialLang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollMore, setCanScrollMore] = useState(false);

  function handleScroll() {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollMore(scrollTop + clientHeight < scrollHeight - 10);
    }
  }

  function handleScrollDownClick() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 140, behavior: "smooth" });
    }
  }

  return (
    <div className="relative h-screen max-h-screen w-full flex flex-col justify-between px-4 py-4 sm:py-6 bg-[#FAFDFB] dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-hidden transition-colors">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 40%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP HEADER WITH BACK ARROW */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          aria-label="Go Back"
        >
          <FiArrowLeft className="size-5" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto flex flex-col justify-center space-y-3.5 overflow-hidden">
        {/* HEADING & SUBTITLE */}
        <div className="text-center space-y-1 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#044D63] dark:text-cyan-400 tracking-tight">
            Choose your language
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            You can always change this later in settings.
          </p>
        </div>

        {/* SCROLLABLE 2-COLUMN LANGUAGE CARDS GRID */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[56vh] sm:max-h-[62vh] overflow-y-auto no-scrollbar scroll-slim pr-1 py-1"
        >
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {ONBOARDING_LANGUAGES.map((lang) => {
              const isActive = selected === lang.code;
              return (
                <motion.button
                  key={lang.code}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(lang.code)}
                  className={`relative flex flex-col justify-between text-left p-3 sm:p-3.5 rounded-2xl border-2 transition-all min-h-[76px] sm:min-h-[84px] cursor-pointer ${
                    isActive
                      ? "border-[#00BCD4] bg-[#EEFBFD] dark:bg-cyan-500/20 shadow-md shadow-cyan-500/10"
                      : "border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-cyan-300 dark:hover:border-cyan-500/40 shadow-2xs"
                  }`}
                >
                  {/* CHECKMARK BADGE FOR SELECTED */}
                  {isActive && (
                    <span className="absolute top-2.5 right-2.5 text-[#00BCD4] dark:text-cyan-400">
                      <FiCheckCircle className="size-4.5" />
                    </span>
                  )}

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                      {lang.subLabel}
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white block mt-0.5 leading-tight">
                      {lang.native}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* OPTIONAL SCROLL DOWN BUTTON INDICATOR */}
        {canScrollMore && (
          <button
            type="button"
            onClick={handleScrollDownClick}
            className="flex items-center justify-center gap-1 text-[11px] font-extrabold text-cyan-700 dark:text-cyan-300 bg-cyan-100/80 dark:bg-cyan-500/20 hover:bg-cyan-200/80 px-3 py-1 rounded-full w-max mx-auto shadow-2xs transition-all animate-bounce cursor-pointer shrink-0"
          >
            <span>Scroll down for more</span>
            <FiChevronDown className="size-3.5" />
          </button>
        )}
      </main>

      {/* FOOTER FIXED CONTINUE BUTTON */}
      <footer className="relative z-10 w-full max-w-md mx-auto pt-3 shrink-0">
        <button
          type="button"
          onClick={() => onContinue(selected)}
          className="w-full h-12 sm:h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-teal-600 hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <FiArrowRight className="size-5" />
        </button>
      </footer>
    </div>
  );
}
