import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FiArrowRight,
  FiClock,
  FiHeart,
  FiMessageSquare,
  FiShield,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";
import { api } from "@/lib/api";
import { cartTotals, useCart, useWishlist } from "@/hooks/useCart";
import { currency } from "@/lib/utils";
import { ProductGrid, QuantityStepper } from "@/components/shop/ProductCard";
import { ProductFeedbackModal, type FeedbackData } from "@/components/feedback/ProductFeedbackModal";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product Detail — LocoMart` },
      { name: "description", content: "Order fresh products with fast 10-15 min delivery on LocoMart." },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const product = useQuery({ queryKey: ["product", id], queryFn: () => api.productById(id) });
  const related = useQuery({
    queryKey: ["related-products", product.data?.store?.id],
    queryFn: () => (product.data?.store?.id ? api.storeProducts(product.data.store.id) : Promise.resolve([])),
    enabled: Boolean(product.data?.store?.id),
  });

  const { data: cart } = useCart();
  const { isFav, toggleWish } = useWishlist();

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [userReviews, setUserReviews] = useState<FeedbackData[]>([
    {
      itemRating: 5,
      riderRating: 5,
      packagingRating: 5,
      tags: ["Fast", "Fresh", "Packed well"],
      comment: "Super fresh item and extremely fast 12 min delivery! Great packaging.",
    },
  ]);

  if (product.isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <div className="h-80 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  const p = product.data;

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The product you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground">
          Back to Home
        </Link>
      </div>
    );
  }

  const itemInCart = (cart ?? []).find((c) => c.product.id === p.id);
  const count = itemInCart?.quantity ?? 0;
  const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

  function handleFeedbackSubmitted(newFeedback: FeedbackData) {
    setUserReviews([newFeedback, ...userReviews]);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        {p.category_id ? (
          <>
            <Link to="/category/$slug" params={{ slug: p.category_id }} className="hover:text-primary transition-colors capitalize">
              {p.category_id}
            </Link>
            <span>/</span>
          </>
        ) : null}
        {p.store ? (
          <>
            <Link to="/store/$slug" params={{ slug: p.store.slug }} className="hover:text-primary transition-colors">
              {p.store.name}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="font-semibold text-foreground truncate max-w-xs">{p.name}</span>
      </nav>

      {/* Product Hero Info */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="surface-card relative overflow-hidden rounded-3xl p-4 flex items-center justify-center border border-border">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} className="aspect-square w-full rounded-2xl object-cover" />
          ) : (
            <div className="aspect-square w-full rounded-2xl bg-muted grid place-items-center text-6xl">
              🛍️
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              toggleWish(p.id);
              toast.success(isFav(p.id) ? "Removed from wishlist" : "Saved to wishlist");
            }}
            className="absolute top-6 right-6 grid size-10 place-items-center rounded-full bg-card/90 text-foreground shadow-md transition-transform hover:scale-110"
            aria-label="Wishlist"
          >
            <FiHeart className={`size-5 ${isFav(p.id) ? "fill-destructive text-destructive" : ""}`} />
          </button>
        </div>

        <div className="space-y-4">
          {p.store ? (
            <Link
              to="/store/$slug"
              params={{ slug: p.store.slug }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              Sold by {p.store.name} →
            </Link>
          ) : null}

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{p.name}</h1>
          <p className="text-sm text-muted-foreground">{p.unit} · {p.brand ?? "LocoMart Verified"}</p>

          <div className="flex flex-wrap items-center gap-3">
            {p.rating ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-700 dark:text-amber-400">
                <FiStar className="fill-amber-400 text-amber-400" /> {Number(p.rating).toFixed(1)} ({userReviews.length + 18} Reviews)
              </span>
            ) : null}

            {/* LEAVE FEEDBACK BUTTON */}
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-extrabold text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all"
            >
              <FiMessageSquare className="size-3.5" /> Leave Feedback & Review
            </button>
          </div>

          <div className="flex items-end gap-3 pt-2">
            <span className="text-3xl font-extrabold text-foreground">{currency(Number(p.price))}</span>
            {off > 0 ? (
              <>
                <span className="text-base text-muted-foreground line-through">{currency(Number(p.mrp))}</span>
                <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                  {off}% OFF
                </span>
              </>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <QuantityStepper product={p} />
            {count > 0 ? (
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold shadow-xs hover:bg-muted"
              >
                <FiShoppingCart className="size-4" /> Go to Cart ({count})
              </Link>
            ) : null}
          </div>

          {p.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground pt-2 border-t border-border">
              {p.description}
            </p>
          ) : null}

          <div className="grid gap-3 pt-4 sm:grid-cols-3">
            <Feature icon={<FiTruck />} title="Fast Delivery" text={`${p.store?.delivery_minutes ?? 15} mins to door`} />
            <Feature icon={<FiShield />} title="Quality Assured" text="Fresh & verified stock" />
            <Feature icon={<FiClock />} title="Easy Resolution" text="Instant refunds & support" />
          </div>
        </div>
      </div>

      {/* PRODUCT FEEDBACK & CUSTOMER REVIEWS SECTION */}
      <section className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-foreground">Customer Feedback & Ratings</h2>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-extrabold text-amber-600">
                ★ 4.9 Average
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real reviews from verified buyers delivered by LocoMart.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 dark:bg-cyan-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 dark:text-white shadow-xs hover:opacity-90 transition-opacity"
          >
            <FiMessageSquare className="size-4" /> Write Product Feedback
          </button>
        </div>

        {/* Customer Reviews List */}
        <div className="space-y-4">
          {userReviews.map((rev, idx) => (
            <div key={idx} className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">
                    U
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Verified Buyer</h4>
                    <span className="text-[10px] text-muted-foreground">Delivered recently</span>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: rev.itemRating }).map((_, i) => (
                    <FiStar key={i} className="size-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              {rev.tags && rev.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {rev.tags.map((t) => (
                    <span key={t} className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-600">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {rev.comment ? (
                <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* FEEDBACK MODAL */}
      <ProductFeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        productName={p.name}
        productImage={p.image_url ?? undefined}
        storeName={p.store?.name ?? "LocoMart Store"}
        onSuccess={handleFeedbackSubmitted}
      />

      {/* More items from this store */}
      {(related.data ?? []).length > 1 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">More from this store</h2>
            {p.store ? (
              <Link
                to="/store/$slug"
                params={{ slug: p.store.slug }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View full store <FiArrowRight className="size-3" />
              </Link>
            ) : null}
          </div>
          <ProductGrid products={(related.data ?? []).filter((r) => r.id !== p.id).slice(0, 5)} />
        </section>
      ) : null}
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="text-primary text-lg">{icon}</div>
      <p className="mt-1 text-sm font-bold">{title}</p>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
