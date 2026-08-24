import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight, FiCheck, FiClock, FiCompass, FiGrid, FiSearch, FiShield, FiShoppingBag, FiSliders, FiZap } from "react-icons/fi";
import { api } from "@/lib/api";
import { ProductGrid } from "@/components/shop/ProductCard";
import { StoreCard } from "@/components/shop/StoreCard";
import { FoodHubView } from "@/components/food/FoodHubView";
import { ShopHubView } from "@/components/shop/ShopHubView";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const name = params.slug.replace(/-/g, " ");
    const title = `${name.charAt(0).toUpperCase() + name.slice(1)} — LocoMart`;
    return {
      meta: [
        { title },
        { name: "description", content: `Browse ${name} stores and products delivered fast by LocoMart.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Shop ${name} from trusted local stores on LocoMart.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const stores = useQuery({ queryKey: ["stores", slug], queryFn: () => api.stores(slug) });
  const products = useQuery({
    queryKey: ["category-products", slug],
    queryFn: () => api.productsByCategory(slug),
  });

  const label = slug.replace(/-/g, " ");
  const isFoodHub = ["food", "restaurants"].includes(slug);
  const isShopHub = ["shop"].includes(slug);

  if (isFoodHub) {
    return <FoodHubView />;
  }

  if (isShopHub) {
    return <ShopHubView />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-primary transition-colors">Categories</Link>
        <span>/</span>
        <span className="font-semibold text-foreground capitalize">{label}</span>
      </nav>

      {/* GENERIC CATEGORY HEADER */}
      <header className="rounded-3xl gradient-hero p-8 text-primary-foreground shadow-md">
        <h1 className="text-3xl font-black capitalize sm:text-4xl">{label}</h1>
        <p className="mt-2 text-primary-foreground/90 text-sm sm:text-base">
          Browse stores and products for {label} delivered fast to your location.
        </p>
      </header>

      {/* STORES SECTION */}
      {(stores.data ?? []).length > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Stores in {label} ({stores.data?.length})</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(stores.data ?? []).map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </section>
      ) : null}

      {/* PRODUCTS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Products in {label} ({products.data?.length ?? 0})</h2>
        </div>

        {products.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (products.data ?? []).length === 0 ? (
          <div className="surface-card p-10 text-center rounded-3xl">
            <p className="font-semibold text-lg">No products found for {label}.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try exploring other categories or search for specific items.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/explore" className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground">
                Browse All Categories
              </Link>
              <Link to="/search" search={{ q: "" }} className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold hover:bg-muted">
                Search Products
              </Link>
            </div>
          </div>
        ) : (
          <ProductGrid products={products.data ?? []} />
        )}
      </section>
    </div>
  );
}
