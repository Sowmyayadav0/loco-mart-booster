import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiTag } from "react-icons/fi";
import { toast } from "sonner";
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

function OffersPage() {
  const coupons = useQuery({ queryKey: ["coupons"], queryFn: api.coupons });

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold">Offers for you</h1>
        <p className="text-sm text-muted-foreground">Apply any of these codes at checkout.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {(coupons.data ?? []).map((c) => (
          <article key={c.id} className="surface-card hover-lift flex gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <FiTag className="size-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-semibold">{c.title}</h2>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Min order {currency(Number(c.min_order))}
                {c.max_discount ? ` · Up to ${currency(Number(c.max_discount))}` : ""}
              </p>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(c.code);
                  toast.success(`Code ${c.code} copied`);
                }}
                className="mt-3 rounded-lg border border-dashed border-primary px-3 py-1.5 text-sm font-bold tracking-wide text-primary"
              >
                {c.code}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!coupons.isLoading && (coupons.data ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">No live offers right now. Check back soon.</p>
      ) : null}
    </div>
  );
}
