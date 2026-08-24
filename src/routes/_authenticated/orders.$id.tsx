import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiPhone, FiTruck } from "react-icons/fi";
import { api, friendlyError } from "@/lib/api";
import { OrderStatusBadge, statusLabel } from "@/components/common/StatusBadge";
import { currency } from "@/utils/format";
import type { OrderStatus } from "@/types";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order tracking — LocoMart" },
      { name: "description", content: "Live status, rider details and bill breakdown for your LocoMart order." },
      { property: "og:title", content: "Order tracking — LocoMart" },
      { property: "og:description", content: "Follow your delivery in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderDetail,
});

const FLOW: OrderStatus[] = ["PLACED", "ACCEPTED", "PREPARING", "READY", "ON_THE_WAY", "DELIVERED"];

function OrderDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const order = useQuery({ queryKey: ["order", id], queryFn: () => api.order(id), refetchInterval: 10000 });
  const timeline = useQuery({ queryKey: ["order-timeline", id], queryFn: () => api.orderTimeline(id) });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["order", id] });
    qc.invalidateQueries({ queryKey: ["order-timeline", id] });
    qc.invalidateQueries({ queryKey: ["orders"] });
  };

  const advance = useMutation({
    mutationFn: () => api.advanceOrder(id),
    onSuccess: refresh,
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });
  const cancel = useMutation({
    mutationFn: () => api.cancelOrder(id, "Changed my mind"),
    onSuccess: () => {
      refresh();
      toast.success("Order cancelled and refunded where applicable");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  if (order.isLoading) return <p className="p-8 text-sm text-muted-foreground">Loading order…</p>;
  if (!order.data) return <p className="p-8 text-sm text-muted-foreground">Order not found.</p>;

  const o = order.data;
  const currentIdx = FLOW.indexOf(o.status);
  const done = o.status === "DELIVERED" || o.status === "CANCELLED" || o.status === "REFUNDED";

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Order #{o.code}</h1>
            <p className="text-sm text-muted-foreground">
              {o.store?.name} · {new Date(o.placed_at).toLocaleString("en-IN")}
            </p>
          </div>
          <OrderStatusBadge status={o.status} />
        </div>

        <section className="surface-card p-5">
          <h2 className="font-semibold">Delivery progress</h2>
          <ol className="mt-4 space-y-4">
            {FLOW.map((step, idx) => {
              const reached = currentIdx >= idx && o.status !== "CANCELLED";
              return (
                <li key={step} className="flex gap-3">
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${reached ? "" : "text-muted-foreground"}`}>
                      {statusLabel(step)}
                    </p>
                    {idx === currentIdx && !done ? (
                      <p className="text-xs text-muted-foreground">
                        In progress · ETA {o.eta_minutes ?? 30} min
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>

          {!done ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => advance.mutate()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
              >
                <FiTruck className="mr-1 inline" /> Simulate next status
              </button>
              <button
                type="button"
                onClick={() => cancel.mutate()}
                className="rounded-xl border border-destructive px-4 py-2 text-sm font-bold text-destructive"
              >
                Cancel order
              </button>
            </div>
          ) : null}
        </section>

        {o.rider_name ? (
          <section className="surface-card flex items-center justify-between p-5">
            <div>
              <h2 className="font-semibold">{o.rider_name}</h2>
              <p className="text-sm text-muted-foreground">{o.rider_vehicle}</p>
            </div>
            <a
              href={`tel:${o.rider_phone}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold"
            >
              <FiPhone /> Call rider
            </a>
          </section>
        ) : null}

        <section className="surface-card p-5">
          <h2 className="font-semibold">Activity</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(timeline.data ?? []).map((t) => (
              <li key={t.id} className="flex justify-between gap-3">
                <span>{t.note || statusLabel(t.status)}</span>
                <span className="shrink-0 text-muted-foreground">
                  {new Date(t.created_at).toLocaleTimeString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <div className="surface-card p-5">
          <h2 className="font-semibold">Items</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(o.order_items ?? []).map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {i.quantity} × {i.name}
                </span>
                <span>{currency(Number(i.total))}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
            <Row label="Subtotal" value={currency(Number(o.subtotal))} />
            {Number(o.discount) > 0 ? <Row label="Discount" value={`-${currency(Number(o.discount))}`} /> : null}
            <Row label="Taxes" value={currency(Number(o.tax))} />
            <Row label="Delivery" value={currency(Number(o.delivery_fee))} />
            <Row label="Platform fee" value={currency(Number(o.platform_fee))} />
            {Number(o.tip) > 0 ? <Row label="Tip" value={currency(Number(o.tip))} /> : null}
            <div className="flex justify-between pt-2 text-base font-bold">
              <span>Total paid</span>
              <span>{currency(Number(o.total))}</span>
            </div>
            <p className="pt-1 text-xs text-muted-foreground">
              {o.payment_method} · {o.payment_status}
            </p>
          </div>
        </div>
        <Link to="/orders" className="block text-center text-sm font-semibold text-primary">
          Back to all orders
        </Link>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
