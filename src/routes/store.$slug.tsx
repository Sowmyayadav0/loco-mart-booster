import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiArrowRight, FiClock, FiHeart, FiMapPin, FiSearch, FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "sonner";
import { api, friendlyError } from "@/lib/api";
import { ProductGrid } from "@/components/shop/ProductCard";
import { useAuth } from "@/hooks/useAuth";
import { cartTotals, useCart } from "@/hooks/useCart";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ");
    const title = `${name} — order online on LocoMart`;
    return {
      meta: [
        { title },
        { name: "description", content: `Order from ${name} with fast local delivery on LocoMart.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Menu, prices and delivery details for ${name}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: StorePage,
});

function StorePage() {
  const { slug } = Route.useParams();
  const { signedIn } = useAuth();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const { data: cart } = useCart();
  const { count, subtotal } = cartTotals(cart ?? []);

  const store = useQuery({ queryKey: ["store", slug], queryFn: () => api.storeBySlug(slug) });
  const storeId = store.data?.id;
  const products = useQuery({
    queryKey: ["store-products", storeId],
    queryFn: () => api.storeProducts(storeId as string),
    enabled: Boolean(storeId),
  });
  const favourites = useQuery({ queryKey: ["favourites"], queryFn: api.favourites, enabled: signedIn });
  const isFav = Boolean(storeId && (favourites.data ?? []).includes(storeId));

  const toggleFav = useMutation({
    mutationFn: () => api.toggleFavourite(storeId as string, !isFav),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favourites"] });
      toast.success(isFav ? "Removed from favourites" : "Added to favourites");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const filtered = useMemo(() => {
    const list = products.data ?? [];
    if (!query.trim()) return list;
    return list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [products.data, query]);

  if (store.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!store.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Store Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The store you're looking for doesn't exist or is currently inactive.</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
          Return to Home
        </Link>
      </div>
    );
  }

  const s = store.data;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-primary transition-colors">Stores</Link>
        <span>/</span>
        {s.category_id ? (
          <>
            <Link
              to="/category/$slug"
              params={{ slug: s.category_id }}
              className="hover:text-primary transition-colors capitalize"
            >
              {s.category_id}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="font-semibold text-foreground">{s.name}</span>
      </nav>

      {/* Store Hero Card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {s.banner_url ? (
          <img src={s.banner_url} alt={s.name} className="h-48 w-full object-cover sm:h-64" />
        ) : (
          <div className="h-40 w-full gradient-hero" />
        )}
        <div className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">{s.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                <FiStar /> {Number(s.rating).toFixed(1)} ({s.rating_count} reviews)
              </span>
              <span className="inline-flex items-center gap-1">
                <FiClock /> {s.delivery_minutes} min delivery
              </span>
              <span className="inline-flex items-center gap-1">
                <FiMapPin /> {s.area}, {s.city}
              </span>
              <span>Min order {currency(Number(s.min_order))}</span>
              <span>Delivery fee {currency(Number(s.delivery_fee))}</span>
            </div>

            {s.tags && s.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => (signedIn ? toggleFav.mutate() : toast.info("Sign in to save favourites"))}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                isFav ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:bg-muted"
              }`}
            >
              <FiHeart className={isFav ? "fill-current" : ""} /> {isFav ? "Saved" : "Save Store"}
            </button>
          </div>
        </div>
      </div>

      {/* Search in store */}
      <div className="relative max-w-md">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search items in ${s.name}…`}
          aria-label="Search in store"
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Menu / Products list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Menu & Catalog ({filtered.length})</h2>
        </div>

        {products.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="surface-card p-10 text-center rounded-2xl">
            <p className="font-semibold text-sm">No items match "{query}".</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-xs font-bold text-primary underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </section>

      {/* Sticky Bottom Cart Bar if items exist */}
      {count > 0 ? (
        <div className="fixed bottom-14 left-4 right-4 z-30 sm:bottom-6 mx-auto max-w-lg">
          <div className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-xl backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-primary-foreground/20 font-bold text-xs">
                {count}
              </span>
              <div>
                <p className="text-xs font-bold">{count} item{count > 1 ? "s" : ""} added</p>
                <p className="text-[11px] opacity-90">{currency(subtotal)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-foreground shadow-xs hover:bg-white/90"
              >
                <FiShoppingCart className="size-3.5" /> View Cart
              </Link>
              <Link
                to="/checkout"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-foreground/20 px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary-foreground/30"
              >
                Checkout <FiArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
