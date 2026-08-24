import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiArrowRight, FiCompass, FiSearch } from "react-icons/fi";
import { api } from "@/lib/api";
import { HOME_SERVICES } from "@/lib/verticals";
import { StoreCard } from "@/components/shop/StoreCard";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Directory — LocoMart Super App" },
      {
        name: "description",
        content:
          "Browse all food, grocery, fashion, electronics, pharmacy, rides, courier and home services across LocoMart.",
      },
      { property: "og:title", content: "Explore everything LocoMart delivers" },
      {
        property: "og:description",
        content: "One app for food, groceries, shopping, rides, parcels and home services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

const SERVICES = [
  { to: "/rides", title: "LocoMart Rides", sub: "Bike, auto & cab bookings", emoji: "🛺", tint: "bg-amber-500/10" },
  { to: "/courier", title: "LocoMart Courier", sub: "Send anything anywhere", emoji: "📦", tint: "bg-sky-500/10" },
  { to: "/services", title: "Home Services", sub: "Verified repair & cleaning pros", emoji: "🛠️", tint: "bg-violet-500/10" },
  { to: "/offers", title: "Offers & Coupons", sub: "Exclusive discounts & promo codes", emoji: "🎟️", tint: "bg-rose-500/10" },
  { to: "/rewards", title: "Rewards & Tiers", sub: "Earn points on every rupee spent", emoji: "🏆", tint: "bg-emerald-500/10" },
  { to: "/wishlist", title: "Saved Wishlist", sub: "Items kept for later", emoji: "❤️", tint: "bg-pink-500/10" },
  { to: "/wallet", title: "LocoMart Wallet", sub: "1-tap payments & instant refunds", emoji: "💳", tint: "bg-teal-500/10" },
  { to: "/orders", title: "My Orders", sub: "Track live & past deliveries", emoji: "📋", tint: "bg-blue-500/10" },
  { to: "/favourites", title: "Favourite Stores", sub: "Your saved neighborhood spots", emoji: "🏬", tint: "bg-indigo-500/10" },
] as const;

function ExplorePage() {
  const categories = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const stores = useQuery({ queryKey: ["stores"], queryFn: () => api.stores() });

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Explore</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">Explore LocoMart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete directory of stores, instant deliveries, rides, parcels and home services.
          </p>
        </div>

        <Link
          to="/search"
          search={{ q: "" }}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-xs hover:bg-muted"
        >
          <FiSearch /> Search Anything
        </Link>
      </header>

      {/* Services Hub */}
      <section>
        <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
          <FiCompass className="text-primary" /> Super App Services
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={s.to}
                className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40 group"
              >
                <span className={`grid size-12 place-items-center rounded-xl text-2xl ${s.tint}`}>
                  {s.emoji}
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-sm group-hover:text-primary transition-colors">{s.title}</span>
                  <span className="block text-xs text-muted-foreground">{s.sub}</span>
                </span>
                <FiArrowRight className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all size-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {categories.isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
            ))
            : (categories.data ?? []).map((c) => {
              const target =
                c.slug === "courier"
                  ? "/courier"
                  : ["rides", "bike", "auto", "cab"].includes(c.slug)
                    ? "/rides"
                    : c.slug === "home-services"
                      ? "/services"
                      : "/category/$slug";

              return (
                <Link
                  key={c.id}
                  to={target}
                  {...(target === "/category/$slug" ? { params: { slug: c.slug } } : {})}
                  className="surface-card hover-lift flex flex-col items-center justify-center p-4 text-center rounded-2xl group"
                >
                  <div className="text-3xl transition-transform group-hover:scale-110 mb-1.5">{c.icon ?? "🛍️"}</div>
                  <div className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">{c.name}</div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Featured Stores */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular Stores Across the City</h2>
          <Link to="/search" search={{ q: "" }} className="text-xs font-bold text-primary hover:underline">
            View all stores →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(stores.data ?? []).slice(0, 6).map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      </section>

      {/* Popular home services */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular Home Services</h2>
          <Link to="/services" className="text-xs font-bold text-primary hover:underline" search={{ service: undefined }}>
            View all pros →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HOME_SERVICES.slice(0, 8).map((s) => (
            <Link
              key={s.id}
              to="/services"
              search={{ service: s.id }}
              className="rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40 group"
            >
              <div className="text-3xl mb-1">{s.emoji}</div>
              <div className="mt-1 text-sm font-bold group-hover:text-primary transition-colors">{s.name}</div>
              <div className="text-xs text-muted-foreground">From ₹{s.from} · ★ {s.rating}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
