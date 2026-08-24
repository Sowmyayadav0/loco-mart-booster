import type { IconType } from "react-icons";
import { motion } from "framer-motion";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type StatTone = "primary" | "info" | "warning" | "danger" | "neutral";

const toneRing: Record<StatTone, string> = {
  primary: "bg-primary-soft text-primary",
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning-foreground",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

interface StatCardProps {
  label: string;
  value: string;
  icon: IconType;
  tone?: StatTone;
  change?: number;
  hint?: string;
  index?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  change,
  hint,
  index = 0,
}: StatCardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      className="surface-card hover-lift relative overflow-hidden p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5" />
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", toneRing[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof change === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
              positive ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
            {Math.abs(change)}%
          </span>
        ) : null}
        {hint ? <span className="truncate text-muted-foreground">{hint}</span> : null}
      </div>
    </motion.article>
  );
}
