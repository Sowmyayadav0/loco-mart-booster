import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight, FiCheck, FiClock, FiCompass, FiGrid, FiSearch, FiShield, FiShoppingBag, FiSliders, FiZap } from "react-icons/fi";
import { api } from "@/lib/api";
import { ProductGrid } from "@/components/shop/ProductCard";
import { StoreCard } from "@/components/shop/StoreCard";

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

// Shop Options specified by user
const SHOP_CATEGORIES = [
  { slug: "fashion", name: "Fashion", desc: "Clothing, Footwear & Accessories", icon: "👗", color: "bg-pink-500/10 text-pink-600 border-pink-500/30" },
  { slug: "electronics", name: "Electronics", desc: "Mobiles, Audio, Laptops & Accessories", icon: "📱", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  { slug: "pharmacy", name: "Pharmacy", desc: "Medicines, Supplements & Wellness", icon: "💊", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  { slug: "pets", name: "Pet Supplies", desc: "Dog & Cat Food, Toys & Grooming", icon: "🐶", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  { slug: "flowers", name: "Flowers", desc: "Fresh Flowers, Bouquets & Gifts", icon: "💐", color: "bg-rose-500/10 text-rose-600 border-rose-500/30" },
  { slug: "hardware", name: "Hardware", desc: "Tools, Electricals & Paints", icon: "🔧", color: "bg-violet-500/10 text-violet-600 border-violet-500/30" },
] as const;

// Food Categories (Instamart Look) specified by user
const FOOD_CATEGORIES = [
  { slug: "dairy", name: "Dairy & Eggs", sub: "Milk, Butter, Paneer, Curd, Cheese", icon: "🥛", gradient: "from-sky-500/20 to-sky-500/5 border-sky-500/30 text-sky-600" },
  { slug: "bakery", name: "Bakery & Cakes", sub: "Breads, Cakes, Buns, Cookies", icon: "🥐", gradient: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-600" },
  { slug: "restaurants", name: "Restaurants", sub: "Hot Biryani, Pizza, North & South Meals", icon: "🍽️", gradient: "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-600" },
  { slug: "fruits", name: "Fruits & Veggies", sub: "Fresh Seasonal & Organic Produce", icon: "🍎", gradient: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-600" },
  { slug: "grocery", name: "Snacks & Drinks", sub: "Chips, Cold Drinks, Juices & Biscuits", icon: "🍿", gradient: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-600" },
  { slug: "meat", name: "Meat & Seafood", sub: "Fresh Chicken, Mutton, Fish & Eggs", icon: "🍗", gradient: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-600" },
] as const;

function CategoryPage() {
  const { slug } = Route.useParams();
  const stores = useQuery({ queryKey: ["stores", slug], queryFn: () => api.stores(slug) });
  const products = useQuery({
    queryKey: ["category-products", slug],
    queryFn: () => api.productsByCategory(slug),
  });

  const [activeSub, setActiveSub] = useState<string>("all");

  const label = slug.replace(/-/g, " ");
  const isShopHub = slug === "shop";
  const isFoodHub = ["food", "dairy", "bakery", "restaurants", "grocery", "fruits", "vegetables", "meat"].includes(slug);

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

      {/* SHOP HUB VIEW */}
      {isShopHub ? (
        <div className="space-y-8">
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur mb-3">
                🛍️ LocoMart Shop Superstore
              </div>
              <h1 className="text-3xl font-black sm:text-5xl tracking-tight">Shop Categories</h1>
              <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
                Choose from Fashion, Electronics, Pharmacy, Pet Supplies, Flowers and Hardware stores delivered to your doorstep.
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 text-9xl opacity-20 pointer-events-none select-none">
              🛍️
            </div>
          </header>

          {/* Shop Options Grid */}
          <section>
            <h2 className="text-xl font-extrabold mb-4">Select a Shop Option</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className={`group flex flex-col justify-between rounded-2xl border ${cat.color} p-4 text-center transition-all hover:scale-105 hover:shadow-md`}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary">{cat.name}</h3>
                    <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">{cat.desc}</p>
                  </div>
                  <span className="mt-3 inline-block rounded-full bg-card px-2.5 py-1 text-[10px] font-bold text-foreground shadow-xs">
                    Browse →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : isFoodHub ? (
        /* LOCOMART FRESH FOOD VIEW */
        <div className="space-y-8">
          {/* Fresh Food Header */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 text-white shadow-lg">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black backdrop-blur">
                <FiZap className="size-4 animate-bounce" /> LOCOMART EXPRESS · 10-15 MIN DELIVERY
              </div>
              <h1 className="text-3xl font-black sm:text-5xl tracking-tight">LocoMart Fresh Food</h1>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Fresh Dairy, Bakery, Hot Restaurants, Fruits & Veggies delivered superfast.
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 text-9xl opacity-20 pointer-events-none select-none">
              ⚡
            </div>
          </header>

          {/* Sub-Category Grid (Dairy, Bakery, Restaurants, etc.) */}
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight">Food Categories</h2>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
              {FOOD_CATEGORIES.map((food) => {
                const active = slug === food.slug;
                return (
                  <Link
                    key={food.slug}
                    to="/category/$slug"
                    params={{ slug: food.slug }}
                    className={`group flex flex-col justify-between rounded-2xl border ${food.gradient} p-4 text-center backdrop-blur transition-all hover:scale-105 hover:shadow-md ${
                      active ? "ring-2 ring-orange-500 shadow-md scale-105" : ""
                    }`}
                  >
                    <div className="text-4xl mb-2 transition-transform group-hover:scale-110">{food.icon}</div>
                    <div>
                      <h3 className="font-extrabold text-sm text-foreground group-hover:text-orange-600">
                        {food.name}
                      </h3>
                      <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">{food.sub}</p>
                    </div>
                    <span className={`mt-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${active ? "bg-orange-500 text-white" : "bg-card text-foreground shadow-xs"}`}>
                      {active ? "Active" : "Shop →"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        /* GENERIC CATEGORY HEADER */
        <header className="rounded-3xl gradient-hero p-8 text-primary-foreground shadow-md">
          <h1 className="text-3xl font-black capitalize sm:text-4xl">{label}</h1>
          <p className="mt-2 text-primary-foreground/90 text-sm sm:text-base">
            Browse stores and products for {label} delivered fast to your location.
          </p>
        </header>
      )}

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
