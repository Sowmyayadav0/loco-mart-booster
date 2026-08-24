import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiBell } from "react-icons/fi";
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

function NotificationsPage() {
  const qc = useQueryClient();
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: api.notifications });
  const markAll = useMutation({
    mutationFn: api.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const items = notifications.data ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {items.some((n) => !n.is_read) ? (
          <button type="button" onClick={() => markAll.mutate()} className="text-sm font-semibold text-primary">
            Mark all read
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          <FiBell className="mx-auto mb-2 size-6" />
          Nothing here yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={`surface-card p-4 ${n.is_read ? "" : "border-l-4 border-l-primary"}`}
            >
              <p className="text-sm font-semibold">{n.title}</p>
              {n.message ? <p className="text-sm text-muted-foreground">{n.message}</p> : null}
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(n.created_at).toLocaleString("en-IN")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
