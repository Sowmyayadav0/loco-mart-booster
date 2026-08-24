import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StoreCard } from "@/components/shop/StoreCard";

export const Route = createFileRoute("/_authenticated/favourites")({
  head: () => ({
    meta: [
      { title: "Saved stores — LocoMart" },
      { name: "description", content: "Your favourite local stores saved for one-tap reordering on LocoMart." },
      { property: "og:title", content: "Saved stores — LocoMart" },
      { property: "og:description", content: "Quickly reorder from stores you love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavouritesPage,
});

function FavouritesPage() {
  const ids = useQuery({ queryKey: ["favourites"], queryFn: api.favourites });
  const stores = useQuery({ queryKey: ["stores"], queryFn: () => api.stores() });
  const saved = (stores.data ?? []).filter((s) => (ids.data ?? []).includes(s.id));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Saved stores</h1>
      {saved.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="font-semibold">No favourites yet</p>
          <Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary">
            Discover stores
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      )}
    </div>
  );
}
