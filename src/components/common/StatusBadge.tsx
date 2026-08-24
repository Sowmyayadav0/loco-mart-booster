import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

type Tone = "success" | "warning" | "info" | "danger" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/10 text-info",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

const statusTone: Record<OrderStatus, Tone> = {
  PLACED: "info",
  ACCEPTED: "info",
  PREPARING: "warning",
  READY: "warning",
  PICKED_UP: "info",
  ON_THE_WAY: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "neutral",
};

export const statusLabel = (status: OrderStatus) =>
  status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function Badge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClass[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return <Badge label={statusLabel(status)} tone={statusTone[status]} {...(className ? { className } : {})} />;
}
