import { Toaster as Sonner } from "sonner";
import { useApp } from "@/context/AppContext";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useApp();

  return (
    <Sonner
      theme={theme as "light" | "dark"}
      className="toaster group font-sans"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans rounded-2xl sm:rounded-full border border-white/20 bg-slate-950/90 text-white backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.3)] px-4 py-3 sm:py-3.5 flex items-center gap-3 text-xs sm:text-sm font-bold tracking-tight select-none",
          title: "text-white font-extrabold text-xs sm:text-sm tracking-tight leading-snug",
          description: "text-slate-300 text-[11px] sm:text-xs font-medium",
          actionButton:
            "rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs px-3 py-1 shadow-md shadow-cyan-500/20 transition-all",
          cancelButton:
            "rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-1 transition-all",
          closeButton:
            "!border-white/20 !bg-slate-900/80 hover:!bg-slate-800 !text-slate-300 hover:!text-white !size-5 !rounded-full transition-all shadow-md",
          success: "!border-emerald-500/40 !bg-slate-950/92 [&_[data-icon]]:!text-emerald-400",
          error: "!border-rose-500/40 !bg-slate-950/92 [&_[data-icon]]:!text-rose-400",
          warning: "!border-amber-500/40 !bg-slate-950/92 [&_[data-icon]]:!text-amber-400",
          info: "!border-cyan-500/40 !bg-slate-950/92 [&_[data-icon]]:!text-cyan-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
