import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { HOME_SERVICES, PROVIDERS, SERVICE_SLOTS } from "@/lib/verticals";
import { currency } from "@/utils/format";
import { ServiceCategorySwitcher } from "@/components/common/ServiceCategorySwitcher";

export const Route = createFileRoute("/services")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search['service'] === "string" ? search['service'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Home services — LocoMart" },
      {
        name: "description",
        content: "Book verified electricians, plumbers, cleaners, AC service, salon at home and pest control with upfront pricing.",
      },
      { property: "og:title", content: "LocoMart Home Services — verified pros at your door" },
      { property: "og:description", content: "Transparent prices, same-day slots and background-checked professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { service } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [slot, setSlot] = useState(SERVICE_SLOTS[0]!);
  const [provider, setProvider] = useState(PROVIDERS[0]!.id);
  const [booking, setBooking] = useState<null | { code: string }>(null);

  const selected = HOME_SERVICES.find((s) => s.id === service) ?? null;
  const categories = Array.from(new Set(HOME_SERVICES.map((s) => s.category)));

  if (selected) {
    const pro = PROVIDERS.find((p) => p.id === provider)!;
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-8">
        <ServiceCategorySwitcher activeService="shop" />
        <button
          type="button"
          onClick={() => navigate({ to: "/services", search: { service: undefined } })}
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← All services
        </button>

        <header className="rounded-2xl border border-border bg-card p-5">
          <div className="text-4xl">{selected.emoji}</div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{selected.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{selected.about}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>★ {selected.rating}</span>
            <span>{selected.jobs}</span>
            <span>{selected.duration}</span>
            <span className="font-semibold text-foreground">From {currency(selected.from)}</span>
          </div>
        </header>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Pick a slot</h2>
          <div className="flex flex-wrap gap-2">
            {SERVICE_SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                  slot === s ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Choose a professional</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                className={`rounded-2xl border p-4 text-left ${
                  provider === p.id ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">★ {p.rating} · {p.jobs} jobs</div>
                <div className="text-xs text-muted-foreground">{p.years} yrs experience</div>
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => {
            setBooking({ code: `SV${Math.floor(100000 + Math.random() * 899999)}` });
            toast.success(`${selected.name} booked for ${slot}`);
          }}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
        >
          Book for {slot} · {currency(selected.from)}
        </button>

        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-sm"
          >
            <div className="font-semibold">Booking {booking.code} confirmed</div>
            <p className="mt-1 text-muted-foreground">
              {pro.name} will arrive at {slot}. You can reschedule up to 2 hours before the slot.
            </p>
            <button
              type="button"
              onClick={() => {
                setBooking(null);
                toast("Booking cancelled");
              }}
              className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold"
            >
              Cancel booking
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:py-8">
      <ServiceCategorySwitcher activeService="shop" />
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">Home services</h1>
        <p className="mt-1 text-muted-foreground">Background-verified pros, upfront pricing, same-day slots.</p>
      </header>

      {categories.map((cat) => (
        <section key={cat}>
          <h2 className="mb-3 text-lg font-semibold">{cat}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HOME_SERVICES.filter((s) => s.category === cat).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => navigate({ to: "/services", search: { service: s.id } })}
                className="rounded-2xl border border-border bg-card p-4 text-left transition-shadow hover:shadow-md"
              >
                <div className="text-2xl">{s.emoji}</div>
                <div className="mt-1 text-sm font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">From {currency(s.from)} · ★ {s.rating}</div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
