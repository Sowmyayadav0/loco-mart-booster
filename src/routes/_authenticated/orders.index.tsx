import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiMessageSquare, FiPackage, FiStar } from "react-icons/fi";
import { api } from "@/lib/api";
import { OrderStatusBadge } from "@/components/common/StatusBadge";
import { currency } from "@/lib/utils";
import { ProductFeedbackModal, type FeedbackData } from "@/components/feedback/ProductFeedbackModal";

export const Route = createFileRoute("/_authenticated/orders/")({
  head: () => ({
    meta: [
      { title: "Your Orders & Feedback — LocoMart" },
      { name: "description", content: "Track current deliveries and browse your LocoMart order history & reviews." },
      { property: "og:title", content: "Your orders — LocoMart" },
      { property: "og:description", content: "Live tracking, feedback reviews, and past orders in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const orders = useQuery({ queryKey: ["orders"], queryFn: api.orders, refetchInterval: 15000 });
  const [activeFeedbackOrder, setActiveFeedbackOrder] = useState<any | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Your Orders</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track live deliveries and leave product & delivery feedback.
          </p>
        </div>
      </div>

      {orders.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (orders.data ?? []).length === 0 ? (
        <div className="surface-card p-10 text-center rounded-3xl border border-border">
          <p className="font-semibold text-lg">No orders placed yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start shopping for food, groceries and products!</p>
          <Link to="/" className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(orders.data ?? []).map((o) => (
            <div
              key={o.id}
              className="surface-card rounded-3xl border border-border/70 p-5 space-y-3 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/orders/$id"
                  params={{ id: o.id }}
                  className="flex items-center gap-3.5 group"
                >
                  {o.store?.logo_url ? (
                    <img src={o.store.logo_url} alt={o.store.name} className="size-12 rounded-2xl object-cover border border-border shrink-0" />
                  ) : (
                    <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-xl text-primary shrink-0">
                      <FiPackage />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-extrabold text-base group-hover:text-primary transition-colors">{o.store?.name ?? "LocoMart Store Order"}</h2>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      #{o.code} · {new Date(o.placed_at).toLocaleString("en-IN")} · {o.order_items?.length ?? 1} item(s)
                    </p>
                  </div>
                </Link>

                <div className="text-right">
                  <p className="text-lg font-black text-foreground">{currency(Number(o.total))}</p>
                </div>
              </div>

              {/* Action Buttons: View Details & Leave Feedback */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
                <Link
                  to="/orders/$id"
                  params={{ id: o.id }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View Order Details & Live Track →
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveFeedbackOrder(o)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-extrabold text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-2xs"
                >
                  <FiMessageSquare className="size-3.5" /> Rate & Leave Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FEEDBACK MODAL FOR ORDERS */}
      {activeFeedbackOrder ? (
        <ProductFeedbackModal
          isOpen={Boolean(activeFeedbackOrder)}
          onClose={() => setActiveFeedbackOrder(null)}
          productName={activeFeedbackOrder.order_items?.[0]?.product?.name ?? activeFeedbackOrder.store?.name ?? "Order Item"}
          productImage={activeFeedbackOrder.order_items?.[0]?.product?.image_url ?? activeFeedbackOrder.store?.logo_url ?? undefined}
          storeName={activeFeedbackOrder.store?.name ?? "LocoMart Verified Store"}
          timeAgo={`Delivered · #${activeFeedbackOrder.code}`}
        />
      ) : null}
    </div>
  );
}
