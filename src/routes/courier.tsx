import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { COURIER_SPEEDS, PACKAGE_TYPES, SAVED_PLACES, haversineKm } from "@/lib/verticals";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/courier")({
  head: () => ({
    meta: [
      { title: "Send a parcel — LocoMart Courier" },
      {
        name: "description",
        content: "Send documents and parcels across the city with LocoMart Courier — express, standard and saver delivery with live rider tracking.",
      },
      { property: "og:title", content: "LocoMart Courier — send anything, anywhere in the city" },
      { property: "og:description", content: "Instant pickup, transparent pricing and live tracking for every parcel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CourierPage,
});

function CourierPage() {
  const [pickup, setPickup] = useState(SAVED_PLACES[0]!.address);
  const [drop, setDrop] = useState("");
  const [pkg, setPkg] = useState(PACKAGE_TYPES[0]!.id);
  const [speed, setSpeed] = useState(COURIER_SPEEDS[1]!.id);
  const [weight, setWeight] = useState(1);
  const [booked, setBooked] = useState<null | { code: string; eta: number; price: number }>(null);

  const km = useMemo(() => (drop ? haversineKm(pickup + drop) : 0), [pickup, drop]);
  const pkgType = PACKAGE_TYPES.find((p) => p.id === pkg)!;
  const speedType = COURIER_SPEEDS.find((s) => s.id === speed)!;
  const price = Math.round((35 + km * 9 + weight * 6) * pkgType.multiplier * speedType.multiplier);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Send a parcel</h1>
        <p className="mt-1 text-muted-foreground">Doorstep pickup in minutes. Pay only for the distance you send.</p>
      </header>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm font-semibold">Pickup address</label>
        <textarea
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {SAVED_PLACES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPickup(p.address)}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted"
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="block pt-2 text-sm font-semibold">Drop address</label>
        <textarea
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          rows={2}
          placeholder="Where should we deliver it?"
          className="w-full rounded-xl border border-border bg-background p-3 text-sm"
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">What are you sending?</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PACKAGE_TYPES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPkg(p.id)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                pkg === p.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="text-2xl">{p.emoji}</div>
              <div className="mt-1 text-sm font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.desc} · up to {p.maxKg} kg</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-semibold">Weight</span>
          <input
            type="range"
            min={1}
            max={pkgType.maxKg}
            value={Math.min(weight, pkgType.maxKg)}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="w-14 text-right text-sm text-muted-foreground">{Math.min(weight, pkgType.maxKg)} kg</span>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Delivery speed</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {COURIER_SPEEDS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSpeed(s.id)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                speed === s.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
              <div className="mt-1 text-xs font-semibold text-primary">
                {s.etaMin < 60 ? `${s.etaMin} min` : `${Math.round(s.etaMin / 60)} hrs`}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Distance</span>
          <span className="font-semibold">{drop ? `${km} km` : "—"}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated fare</span>
          <span className="text-lg font-extrabold">{drop ? currency(price) : "—"}</span>
        </div>
        <button
          type="button"
          disabled={!drop}
          onClick={() => {
            const code = `CR${Math.floor(100000 + Math.random() * 899999)}`;
            setBooked({ code, eta: speedType.etaMin, price });
            toast.success("Rider assigned — pickup on the way");
          }}
          className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          Book pickup
        </button>
      </section>

      {booked && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-5"
        >
          <div className="text-sm font-semibold">Parcel {booked.code} confirmed</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Rider arrives for pickup shortly. Estimated delivery in{" "}
            {booked.eta < 60 ? `${booked.eta} minutes` : `${Math.round(booked.eta / 60)} hours`}. Amount payable{" "}
            {currency(booked.price)}.
          </p>
          <button
            type="button"
            onClick={() => {
              setBooked(null);
              toast("Pickup cancelled");
            }}
            className="mt-3 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold"
          >
            Cancel pickup
          </button>
        </motion.section>
      )}
    </div>
  );
}
