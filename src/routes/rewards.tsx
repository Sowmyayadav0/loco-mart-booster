import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards & tiers — LocoMart" },
      {
        name: "description",
        content: "Earn LocoMart points on every order, climb Silver, Gold and Platinum tiers, and redeem points for wallet cash.",
      },
      { property: "og:title", content: "LocoMart Rewards — points on every order" },
      { property: "og:description", content: "Unlock free delivery, bonus cashback and priority support as you climb tiers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RewardsPage,
});

const TIERS = [
  { name: "Silver", min: 0, perks: ["1 point per ₹10", "Birthday coupon"] },
  { name: "Gold", min: 2000, perks: ["1.5x points", "Free delivery twice a month", "Priority support"] },
  { name: "Platinum", min: 6000, perks: ["2x points", "Unlimited free delivery", "Early access to sales"] },
] as const;

function RewardsPage() {
  const orders = useQuery({ queryKey: ["orders"], queryFn: api.orders });
  const spent = (orders.data ?? []).reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const points = Math.floor(spent / 10) + 350;
  const tierIndex = points >= 6000 ? 2 : points >= 2000 ? 1 : 0;
  const tier = TIERS[tierIndex]!;
  const next = TIERS[tierIndex + 1];
  const progress = next ? Math.min(100, Math.round((points / next.min) * 100)) : 100;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Rewards</h1>
        <p className="mt-1 text-muted-foreground">Every order earns points. Points turn into wallet cash.</p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 to-card p-6"
      >
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tier.name} member</div>
        <div className="mt-1 text-4xl font-extrabold">{points.toLocaleString("en-IN")} pts</div>
        <div className="mt-1 text-sm text-muted-foreground">Worth {currency(Math.floor(points / 4))} in wallet credit</div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {next ? `${(next.min - points).toLocaleString("en-IN")} points to ${next.name}` : "You're at the top tier 🎉"}
        </div>
      </motion.section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Tiers & perks</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-4 ${i === tierIndex ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.min.toLocaleString("en-IN")}+ points</div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {t.perks.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Redeem points</h2>
        <p className="mt-1 text-sm text-muted-foreground">400 points = ₹100 wallet credit, instantly usable at checkout.</p>
        <button
          type="button"
          disabled={points < 400}
          onClick={async () => {
            await api.topUpWallet(100);
            toast.success("₹100 added to your wallet");
          }}
          className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          Redeem ₹100
        </button>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link to="/offers" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold">
          Browse coupons
        </Link>
        <Link to="/wallet" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold">
          Open wallet
        </Link>
      </section>
    </div>
  );
}
