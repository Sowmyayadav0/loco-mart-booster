import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiArrowDown, FiArrowUp, FiCreditCard, FiPlus, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { api, friendlyError } from "@/lib/api";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({
    meta: [
      { title: "LocoMart Wallet — balance & cashback" },
      { name: "description", content: "Check your LocoMart Wallet balance, add money and view cashback history." },
      { property: "og:title", content: "LocoMart Wallet" },
      { property: "og:description", content: "Balance, top-ups, refunds and cashback in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const qc = useQueryClient();
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: api.wallet });

  const topUp = useMutation({
    mutationFn: (amount: number) => api.topUpWallet(amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Money added to wallet!");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const balance = wallet.data?.balance ?? 0;
  const transactions = wallet.data?.transactions ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-hero p-8 text-primary-foreground shadow-2xl"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
            <FiCreditCard className="size-4" /> LocoMart Wallet Balance
          </div>
          <div className="mt-2 flex items-end gap-3">
            <p className="text-5xl font-black tracking-tight">{currency(balance)}</p>
            {wallet.isLoading && <FiRefreshCw className="mb-2 size-5 animate-spin opacity-60" />}
          </div>
          <p className="mt-1 text-sm opacity-75">Available for instant checkout</p>

          {/* Top-up quick amounts */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[100, 250, 500, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => topUp.mutate(amt)}
                disabled={topUp.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-white/25 transition-all disabled:opacity-60 active:scale-95"
              >
                <FiPlus className="size-3.5" /> {currency(amt)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Total Added</p>
          <p className="mt-1 text-lg font-bold text-success">
            +{currency(transactions.filter(t => t.type !== "DEBIT").reduce((s, t) => s + Number(t.amount), 0))}
          </p>
        </div>
        <div className="surface-card p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="mt-1 text-lg font-bold text-destructive">
            -{currency(transactions.filter(t => t.type === "DEBIT").reduce((s, t) => s + Number(t.amount), 0))}
          </p>
        </div>
      </div>

      {/* Transactions */}
      <section className="surface-card p-5 rounded-3xl">
        <h2 className="flex items-center gap-2 font-bold text-base">
          <FiRefreshCw className="text-primary size-4" /> Transaction History
        </h2>

        {wallet.isLoading ? (
          <div className="mt-3 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <FiCreditCard className="mx-auto mb-2 size-8 opacity-30" />
            No transactions yet. Add money to get started!
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {transactions.map((t) => {
              const credit = t.type !== "DEBIT";
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-xl text-sm ${credit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {credit ? <FiArrowDown className="size-4" /> : <FiArrowUp className="size-4" />}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.type} · {new Date(t.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${credit ? "text-success" : "text-destructive"}`}>
                      {credit ? "+" : "-"}{currency(Number(t.amount))}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Bal {currency(Number(t.balance_after))}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Info */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">💡 About LocoMart Wallet</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Instant payments at checkout — no OTP needed</li>
          <li>Cashback & refunds credited automatically</li>
          <li>Points from Rewards can be redeemed here</li>
        </ul>
      </div>
    </div>
  );
}
