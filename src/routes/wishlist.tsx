import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FiHeart } from "react-icons/fi";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductCard } from "@/components/shop/ProductCard";
import { api } from "@/lib/api";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/types";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist — LocoMart" },
      {
        name: "description",
        content: "Everything you saved for later on LocoMart — add items back to your cart whenever you're ready.",
      },
      { property: "og:title", content: "Your LocoMart wishlist" },
      { property: "og:description", content: "Saved products from stores across your city, ready to reorder." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids, remove } = useWishlist();

  const products = useQuery({
    queryKey: ["wishlist-products", ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const results = await Promise.all(ids.map((id) => api.productById(id)));
      return results.filter((p): p is Product => Boolean(p));
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Wishlist</h1>
        <p className="mt-1 text-muted-foreground">{ids.length} item{ids.length === 1 ? "" : "s"} saved for later.</p>
      </header>

      {ids.length === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="Nothing saved yet"
          description="Tap the heart on any product to keep it here for later."
          action={
            <Link to="/explore" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
              Start exploring
            </Link>
          }
        />
      ) : products.isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ids.map((id) => (
            <div key={id} className="h-64 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(products.data ?? []).map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-card/90 text-destructive shadow"
                aria-label={`Remove ${p.name} from wishlist`}
              >
                <FiHeart className="size-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
