import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiBell, FiCheckCircle, FiPackage, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — LocoMart" },
      { name: "description", content: "Order updates, offers and account alerts from LocoMart." },
      { property: "og:title", content: "Notifications — LocoMart" },
      { property: "og:description", content: "Stay on top of your deliveries and deals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

function getNotifIcon(type: string) {
  if (type === "order") return <FiPackage className="size-4" />;
  if (type === "offer") return <FiTag className="size-4" />;
  return <FiBell className="size-4" />;
}

function getNotifColor(type: string) {
  if (type === "order") return "bg-primary/10 text-primary";
  if (type === "offer") return "bg-amber-500/10 text-amber-400";
  return "bg-slate-500/10 text-slate-400";
}

function NotificationsPage() {
  const qc = useQueryClient();
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: api.notifications });
  const markAll = useMutation({
    mutationFn: api.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const items = notifications.data ?? [];
  const unread = items.filter((n) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Notifications</h1>
          {unread > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">{unread} unread</p>
          )}
        </div>
        {unread > 0 ? (
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold hover:border-primary/40 transition-colors"
          >
            <FiCheckCircle className="size-3.5 text-primary" /> Mark all read
          </button>
        ) : null}
      </div>

      {notifications.isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="surface-card p-12 text-center rounded-3xl">
          <FiBell className="mx-auto mb-3 size-10 text-muted-foreground opacity-30" />
          <p className="font-semibold">All caught up!</p>
          <p className="mt-1 text-sm text-muted-foreground">Order updates and deal alerts will appear here.</p>
          <Link to="/" className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n, i) => (
            <motion.li
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`surface-card p-4 flex items-start gap-3.5 ${!n.is_read ? "border-l-4 border-l-primary" : ""}`}
            >
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm ${getNotifColor(n.type)}`}>
                {getNotifIcon(n.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${!n.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                  {n.title}
                </p>
                {n.message ? (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                ) : null}
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  {new Date(n.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              {n.order_id && (
                <Link
                  to="/orders/$id"
                  params={{ id: n.order_id }}
                  className="shrink-0 text-[11px] font-bold text-primary hover:underline"
                >
                  Track →
                </Link>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
