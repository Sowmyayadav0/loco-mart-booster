import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiTrendingUp, FiX, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
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

const TRENDING = ["Biryani", "Milk", "Eggs", "Paneer", "Pizza", "Atta", "Shampoo", "Bananas", "Chips", "Coffee"];

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

  function doSearch(val: string) {
    setTerm(val);
    if (val.trim()) void navigate({ to: "/search", search: { q: val.trim() } });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Search input */}
      <div>
        <h1 className="text-xl font-extrabold mb-3">Search LocoMart</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSearch(term);
          }}
          className="relative max-w-2xl"
        >
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products, stores, brands…"
            aria-label="Search"
            className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-10 text-sm outline-none focus:border-primary transition-colors"
          />
          {term && (
            <button
              type="button"
              onClick={() => { setTerm(""); void navigate({ to: "/search", search: { q: "" } }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid size-6 place-items-center rounded-full hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <FiX className="size-3.5 text-muted-foreground" />
            </button>
          )}
        </form>
      </div>

      {/* No query state */}
      {!q ? (
        <div className="space-y-6">
          {/* Trending searches */}
          <section>
            <h2 className="mb-3 text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <FiTrendingUp className="size-4 text-primary" /> Trending searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => doSearch(s)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Category shortcuts */}
          <section>
            <h2 className="mb-3 text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <FiClock className="size-4 text-primary" /> Browse by category
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
              {[
                { slug: "food", label: "Food", emoji: "🍛" },
                { slug: "grocery", label: "Grocery", emoji: "🛒" },
                { slug: "pharmacy", label: "Pharmacy", emoji: "💊" },
                { slug: "electronics", label: "Electronics", emoji: "📱" },
                { slug: "fashion", label: "Fashion", emoji: "👗" },
                { slug: "fruits", label: "Fruits", emoji: "🍎" },
                { slug: "bakery", label: "Bakery", emoji: "🥐" },
              ].map((cat) => (
                <a
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="surface-card flex flex-col items-center gap-1 p-3 text-center hover:border-primary/40 transition-all hover:-translate-y-0.5 rounded-2xl"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-[11px] font-semibold">{cat.label}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      ) : results.isLoading ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground animate-pulse">Searching for "{q}"…</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      ) : products.length === 0 && stores.length === 0 ? (
        <div className="surface-card p-12 text-center rounded-3xl">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-bold text-lg">No results for "{q}"</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different keyword, brand or category.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {TRENDING.slice(0, 5).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => doSearch(s)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Result count */}
          <p className="text-xs text-muted-foreground">
            {products.length + stores.length} results for <strong className="text-foreground">"{q}"</strong>
          </p>

          {stores.length > 0 ? (
            <section>
              <h2 className="mb-3 text-base font-bold">Stores ({stores.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stores.map((s) => (
                  <StoreCard key={s.id} store={s} />
                ))}
              </div>
            </section>
          ) : null}

          {products.length > 0 ? (
            <section>
              <h2 className="mb-3 text-base font-bold">Products ({products.length})</h2>
              <ProductGrid products={products} />
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
