import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      toast.success("Money added to wallet");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="rounded-3xl gradient-hero p-8 text-primary-foreground">
        <p className="text-sm text-primary-foreground/80">LocoMart Wallet balance</p>
        <p className="mt-1 text-4xl font-extrabold">{currency(wallet.data?.balance ?? 0)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[100, 250, 500, 1000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => topUp.mutate(amt)}
              disabled={topUp.isPending}
              className="rounded-xl bg-primary-foreground/15 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-primary-foreground/25"
            >
              + {currency(amt)}
            </button>
          ))}
        </div>
      </div>

      <section className="surface-card p-5">
        <h2 className="font-semibold">Transactions</h2>
        {(wallet.data?.transactions ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {(wallet.data?.transactions ?? []).map((t) => {
              const credit = t.type !== "DEBIT";
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.type} · {new Date(t.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${credit ? "text-success" : "text-destructive"}`}>
                      {credit ? "+" : "-"}
                      {currency(Number(t.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">Bal {currency(Number(t.balance_after))}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
