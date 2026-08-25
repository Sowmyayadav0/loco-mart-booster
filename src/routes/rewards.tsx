import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FiAward, FiGift, FiStar, FiTrendingUp, FiZap } from "react-icons/fi";
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
  {
    name: "Silver",
    min: 0,
    icon: "🥈",
    color: "from-slate-400 to-slate-600",
    glow: "shadow-slate-400/20",
    perks: ["1 point per ₹10 spent", "Birthday surprise coupon", "Early access to flash sales"],
  },
  {
    name: "Gold",
    min: 2000,
    icon: "🥇",
    color: "from-yellow-400 to-amber-600",
    glow: "shadow-amber-400/30",
    perks: ["1.5× points on all orders", "Free delivery twice a month", "Priority customer support"],
  },
  {
    name: "Platinum",
    min: 6000,
    icon: "💎",
    color: "from-cyan-400 to-indigo-600",
    glow: "shadow-cyan-400/30",
    perks: ["2× points on every order", "Unlimited free delivery", "Early access to new features", "Dedicated account manager"],
  },
] as const;

const RECENT_ACTIVITY = [
  { label: "Earned from last order", points: 45, time: "2 hours ago", type: "credit" },
  { label: "Redeemed for wallet cash", points: -400, time: "Yesterday", type: "debit" },
  { label: "Birthday bonus", points: 200, time: "5 days ago", type: "credit" },
  { label: "Order #ORD-891234", points: 68, time: "1 week ago", type: "credit" },
];

function RewardsPage() {
  const orders = useQuery({ queryKey: ["orders"], queryFn: api.orders });
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: api.wallet });
  const spent = (orders.data ?? []).reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const points = Math.floor(spent / 10) + 350;
  const tierIndex = points >= 6000 ? 2 : points >= 2000 ? 1 : 0;
  const tier = TIERS[tierIndex]!;
  const next = TIERS[tierIndex + 1];
  const progress = next ? Math.min(100, Math.round((points / next.min) * 100)) : 100;
  const walletValue = Math.floor(points / 4);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Rewards & Points</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every order earns points. Points convert to wallet cash.</p>
      </header>

      {/* Points Card */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl bg-gradient-to-br ${tier.color} p-6 text-white shadow-2xl ${tier.glow}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
              <FiAward className="size-4" /> {tier.name} Member
            </div>
            <div className="mt-2 text-5xl font-black tracking-tight">
              {points.toLocaleString("en-IN")}
              <span className="ml-2 text-xl font-bold opacity-75">pts</span>
            </div>
            <div className="mt-1 text-sm opacity-80">≈ {currency(walletValue)} wallet credit</div>
          </div>
          <span className="text-5xl">{tier.icon}</span>
        </div>

        {next && (
          <div className="mt-5">
            <div className="flex justify-between text-xs font-semibold opacity-80 mb-1.5">
              <span>{points.toLocaleString("en-IN")} pts</span>
              <span>{next.name} at {next.min.toLocaleString("en-IN")} pts</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="h-full rounded-full bg-white"
              />
            </div>
            <div className="mt-1.5 text-xs opacity-75">
              {(next.min - points).toLocaleString("en-IN")} more points to {next.name}
            </div>
          </div>
        )}
        {!next && (
          <div className="mt-4 text-sm font-bold">🎉 You've reached the top tier! Enjoy all Platinum perks.</div>
        )}
      </motion.section>

      {/* Redeem section */}
      <section className="surface-card p-5 rounded-3xl">
        <h2 className="flex items-center gap-2 text-base font-bold"><FiGift className="text-primary" /> Redeem Points</h2>
        <p className="mt-1 text-sm text-muted-foreground">400 points = ₹100 wallet credit. Instantly usable at checkout.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {[{ pts: 400, val: 100 }, { pts: 800, val: 200 }, { pts: 2000, val: 500 }].map((opt) => (
            <button
              key={opt.pts}
              type="button"
              disabled={points < opt.pts}
              onClick={async () => {
                await api.topUpWallet(opt.val);
                toast.success(`₹${opt.val} added to your wallet!`);
              }}
              className="flex flex-col items-center gap-0.5 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-3 text-center hover:bg-primary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-base font-black text-primary">₹{opt.val}</span>
              <span className="text-[11px] text-muted-foreground">{opt.pts.toLocaleString()} pts</span>
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Wallet balance: <strong className="text-foreground">{currency(wallet.data?.balance ?? 0)}</strong>
        </div>
      </section>

      {/* Tiers */}
      <section>
        <h2 className="mb-3 text-lg font-bold flex items-center gap-2"><FiTrendingUp className="text-primary" /> Membership Tiers</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-4 transition-all ${i === tierIndex ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-card"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground">{t.min.toLocaleString("en-IN")}+ points</div>
                </div>
              </div>
              <ul className="space-y-1">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <FiZap className="size-3 shrink-0 mt-0.5 text-primary" /> {p}
                  </li>
                ))}
              </ul>
              {i === tierIndex && (
                <div className="mt-2 rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary text-center">
                  Your current tier
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="surface-card p-5 rounded-3xl">
        <h2 className="flex items-center gap-2 text-base font-bold mb-3"><FiStar className="text-primary" /> Recent Activity</h2>
        <ul className="divide-y divide-border">
          {RECENT_ACTIVITY.map((item, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className={`text-sm font-bold ${item.type === "credit" ? "text-success" : "text-destructive"}`}>
                {item.type === "credit" ? "+" : ""}{item.points.toLocaleString()} pts
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTAs */}
      <section className="flex flex-wrap gap-3">
        <Link to="/offers" className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary/30 transition-colors">
          🎟️ Browse Coupons
        </Link>
        <Link to="/wallet" className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary/30 transition-colors">
          💳 Open Wallet
        </Link>
        <Link to="/orders" className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary/30 transition-colors">
          📦 Order History
        </Link>
      </section>
    </div>
  );
}
