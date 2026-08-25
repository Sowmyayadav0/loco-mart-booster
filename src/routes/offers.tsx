import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiCopy, FiTag, FiArrowRight, FiPercent, FiZap } from "react-icons/fi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & promo codes — LocoMart" },
      { name: "description", content: "Save more with LocoMart promo codes, cashback offers and first-order deals." },
      { property: "og:title", content: "Offers & promo codes — LocoMart" },
      { property: "og:description", content: "Live coupons on groceries, food and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OffersPage,
});

const FEATURED_BANNERS = [
  { title: "New User Offer", subtitle: "Flat ₹200 OFF on your first order above ₹499", code: "LOCO200", emoji: "🎉", gradient: "from-purple-600 to-indigo-600" },
  { title: "Weekend Special", subtitle: "20% off on all grocery & bakery items", code: "WKND20", emoji: "🛒", gradient: "from-emerald-600 to-teal-600" },
  { title: "Ride Cashback", subtitle: "Get ₹50 back on first 3 rides this week", code: "RIDE50", emoji: "🛺", gradient: "from-amber-500 to-orange-600" },
];

function OffersPage() {
  const coupons = useQuery({ queryKey: ["coupons"], queryFn: api.coupons });

  function copyCoupon(code: string) {
    void navigator.clipboard?.writeText(code);
    toast.success(`Code "${code}" copied to clipboard!`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Offers & Coupons</h1>
        <p className="mt-1 text-sm text-muted-foreground">Apply these at checkout to save on your order.</p>
      </header>

      {/* Featured offer banners */}
      <section>
        <h2 className="mb-3 text-base font-bold flex items-center gap-2">
          <FiZap className="text-primary" /> Featured Deals
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURED_BANNERS.map((b, i) => (
            <motion.div
              key={b.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${b.gradient} p-5 text-white`}
            >
              <div className="absolute -right-4 -top-4 text-6xl opacity-20">{b.emoji}</div>
              <div className="text-lg font-black">{b.emoji} {b.title}</div>
              <p className="mt-1 text-xs font-medium opacity-85">{b.subtitle}</p>
              <button
                type="button"
                onClick={() => copyCoupon(b.code)}
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur hover:bg-white/25 transition-all"
              >
                <FiCopy className="size-3" /> {b.code}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All coupons */}
      <section>
        <h2 className="mb-3 text-base font-bold flex items-center gap-2">
          <FiTag className="text-primary" /> All Active Coupons
        </h2>
        {coupons.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (coupons.data ?? []).length === 0 ? (
          <div className="surface-card p-10 text-center">
            <FiTag className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="font-semibold">No live offers right now.</p>
            <p className="mt-1 text-sm text-muted-foreground">Check back soon for new deals!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(coupons.data ?? []).map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="surface-card flex gap-4 p-5 relative overflow-hidden"
              >
                {/* Left discount badge */}
                <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary px-3 py-4 min-w-[68px]">
                  {c.type === "PERCENT" ? (
                    <>
                      <FiPercent className="size-5" />
                      <span className="mt-1 text-xl font-black">{c.value}%</span>
                      <span className="text-[10px] font-semibold opacity-70">OFF</span>
                    </>
                  ) : (
                    <>
                      <FiTag className="size-5" />
                      <span className="mt-1 text-xl font-black">₹{c.value}</span>
                      <span className="text-[10px] font-semibold opacity-70">OFF</span>
                    </>
                  )}
                </div>

                {/* Right content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-tight">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Min order {currency(Number(c.min_order))}
                    {c.max_discount ? ` · Max discount ${currency(Number(c.max_discount))}` : ""}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyCoupon(c.code)}
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-primary px-3 py-1.5 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <FiCopy className="size-3" /> {c.code}
                    </button>
                    <Link
                      to="/cart"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Apply now <FiArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>

                {/* Scissor line */}
                <div className="absolute left-[92px] top-0 bottom-0 border-l border-dashed border-border" />
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Info box */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">💡 How to use coupons</p>
        <ol className="list-decimal list-inside space-y-0.5">
          <li>Copy the coupon code above</li>
          <li>Add items to your cart</li>
          <li>Enter the code in the promo field at checkout</li>
          <li>Discount is applied instantly before payment</li>
        </ol>
      </div>
    </div>
  );
}
