import { createFileRoute, Link } from "@tanstack/react-router";
import { FiArrowRight, FiHeart, FiMinus, FiPercent, FiPlus, FiShoppingCart, FiTag, FiTrash2 } from "react-icons/fi";
import { cartTotals, useCart, useCartActions } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — LocoMart" },
      { name: "description", content: "Review items in your LocoMart cart and checkout in a few taps." },
      { property: "og:title", content: "Your cart — LocoMart" },
      { property: "og:description", content: "Review your items and place your order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { signedIn } = useAuth();
  const { data, isLoading } = useCart();
  const { setQty, clear } = useCartActions();
  const { active, subtotal, savings, count, store } = cartTotals(data ?? []);

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary mb-4">
          <FiShoppingCart className="size-8" />
        </span>
        <h1 className="text-2xl font-bold">Sign in to see your cart</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your saved items, delivery address and wallet credits sync once you're signed in.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/auth"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            to="/explore"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-6 text-sm font-bold hover:bg-muted"
          >
            Explore Stores
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-2xl bg-muted" />
            <div className="h-28 animate-pulse rounded-2xl bg-muted" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (active.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary mb-4">
          <FiShoppingCart className="size-8" />
        </span>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse fresh groceries, top restaurant menus, medicines or local shops near you.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/explore"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"
          >
            Explore Catalog <FiArrowRight />
          </Link>
          <Link
            to="/offers"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold hover:bg-muted"
          >
            <FiTag /> View Offers
          </Link>
          <Link
            to="/wishlist"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold hover:bg-muted"
          >
            <FiHeart /> Wishlist
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = Number(store?.delivery_fee ?? 0);
  const platformFee = 5;
  const total = subtotal + deliveryFee + platformFee;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        {/* Breadcrumb / Cart Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Your cart ({count})</h1>
            {store ? (
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Delivering from{" "}
                <Link to="/store/$slug" params={{ slug: store.slug }} className="font-bold text-foreground hover:text-primary underline">
                  {store.name}
                </Link>{" "}
                · {store.delivery_minutes} min delivery
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => clear.mutate()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <FiTrash2 /> Clear Cart
          </button>
        </div>

        {/* Cart items */}
        <div className="space-y-3">
          {active.map((item) => (
            <article key={item.id} className="surface-card flex gap-3.5 p-3.5 rounded-2xl">
              {item.product_id ? (
                <Link to="/product/$id" params={{ id: item.product_id }} className="shrink-0">
                  {item.product?.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="size-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="size-20 rounded-xl bg-muted grid place-items-center text-2xl">
                      🛍️
                    </div>
                  )}
                </Link>
              ) : null}

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  {item.product_id ? (
                    <Link
                      to="/product/$id"
                      params={{ id: item.product_id }}
                      className="text-sm font-bold text-foreground hover:text-primary line-clamp-1 transition-colors"
                    >
                      {item.product?.name}
                    </Link>
                  ) : (
                    <h2 className="text-sm font-semibold">{item.product?.name}</h2>
                  )}
                  <p className="text-xs text-muted-foreground">{item.product?.unit}</p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="font-extrabold text-sm text-foreground">
                    {currency(Number(item.product?.price ?? 0) * item.quantity)}
                  </p>
                  <div className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-2 py-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                      className="grid size-6 place-items-center rounded-lg hover:bg-muted"
                    >
                      <FiMinus className="size-3.5" />
                    </button>
                    <span className="min-w-4 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="grid size-6 place-items-center rounded-lg hover:bg-muted"
                    >
                      <FiPlus className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coupon Teaser */}
        <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
          <div className="flex items-center gap-2.5">
            <FiTag className="text-primary size-4" />
            <span>Have a discount coupon or promo code?</span>
          </div>
          <Link to="/offers" className="font-bold text-primary hover:underline">
            View Live Offers →
          </Link>
        </div>

        {/* Continue Shopping Link */}
        <div className="pt-2">
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
            ← Continue shopping in other stores
          </Link>
        </div>
      </section>

      {/* Bill summary aside */}
      <aside className="h-fit lg:sticky lg:top-24">
        <div className="surface-card space-y-3.5 p-5 rounded-3xl">
          <h2 className="font-bold text-base">Bill Summary</h2>
          <Row label="Item total" value={currency(subtotal)} />
          <Row label="Delivery fee" value={currency(deliveryFee)} />
          <Row label="Platform fee" value={currency(platformFee)} />
          {savings > 0 ? <Row label="Total Savings" value={`-${currency(savings)}`} accent /> : null}
          <div className="border-t border-border pt-3">
            <Row label="To pay" value={currency(total)} bold />
          </div>
          <Link
            to="/checkout"
            className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-[1.02]"
          >
            Proceed to Checkout <FiArrowRight />
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between text-xs sm:text-sm ${bold ? "font-bold text-base" : ""}`}>
      <span className={accent ? "text-success font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={accent ? "text-success font-bold" : ""}>{value}</span>
    </div>
  );
}
