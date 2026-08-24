import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { api } from "@/lib/api";
import { ProductGrid } from "@/components/shop/ProductCard";
import { StoreCard } from "@/components/shop/StoreCard";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({ q: (search['q'] as string) ?? "" }),
  head: () => ({
    meta: [
      { title: "Search products & stores — LocoMart" },
      { name: "description", content: "Search thousands of products and local stores on LocoMart." },
      { property: "og:title", content: "Search — LocoMart" },
      { property: "og:description", content: "Find products and stores near you instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

const SUGGESTIONS = ["Milk", "Bananas", "Biryani", "Paracetamol", "Rice", "Chips", "Coffee", "Eggs"];

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState(q);

  const results = useQuery({
    queryKey: ["search", q],
    queryFn: () => api.search(q),
    enabled: q.length > 0,
  });

  const products = results.data?.products ?? [];
  const stores = results.data?.stores ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Search LocoMart</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ to: "/search", search: { q: term.trim() } });
          }}
          className="relative mt-4 max-w-2xl"
        >
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="What are you looking for?"
            aria-label="Search"
            className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setTerm(s);
                void navigate({ to: "/search", search: { q: s } });
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {q ? (
        results.isLoading ? (
          <p className="text-sm text-muted-foreground">Searching…</p>
        ) : products.length === 0 && stores.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <p className="font-semibold">No results for “{q}”</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different keyword or brand.</p>
          </div>
        ) : (
          <>
            {stores.length > 0 ? (
              <section>
                <h2 className="mb-3 text-lg font-semibold">Stores</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stores.map((s) => (
                    <StoreCard key={s.id} store={s} />
                  ))}
                </div>
              </section>
            ) : null}
            {products.length > 0 ? (
              <section>
                <h2 className="mb-3 text-lg font-semibold">{products.length} products</h2>
                <ProductGrid products={products} />
              </section>
            ) : null}
          </>
        )
      ) : (
        <p className="text-sm text-muted-foreground">Start typing to search products and stores.</p>
      )}
    </div>
  );
}
