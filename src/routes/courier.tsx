// src/routes/courier.tsx
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { COURIER_SPEEDS, PACKAGE_TYPES, SAVED_PLACES, haversineKm } from "@/lib/verticals";
import { currency } from "@/utils/format";
import { ServiceCategorySwitcher } from "@/components/common/ServiceCategorySwitcher";

export const Route = createFileRoute("/courier")({
  head: () => ({
    meta: [
      { title: "Send a parcel — LocoMart Courier" },
      {
        name: "description",
        content: "Send documents and parcels across the city with LocoMart Courier — express, standard and saver delivery with live rider tracking."
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
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:py-8 text-slate-900 dark:text-white">
      {/* 1. TOP SERVICE CATEGORY SWITCHER */}
      <ServiceCategorySwitcher activeService="courier" />
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-slate-900 dark:text-white">Send a parcel</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm sm:text-base">Doorstep pickup in minutes. Pay only for the distance you send.</p>
      </header>

      <section className="space-y-3 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-md dark:shadow-none">
        <label className="block text-sm font-extrabold text-slate-900 dark:text-white">Pickup address</label>
        <textarea
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          rows={2}
          className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 p-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
        <div className="flex flex-wrap gap-2">
          {SAVED_PLACES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPickup(p.address)}
              className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="block pt-2 text-sm font-extrabold text-slate-900 dark:text-white">Drop address</label>
        <textarea
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          rows={2}
          placeholder="Where should we deliver it?"
          className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 p-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-extrabold text-slate-900 dark:text-white">What are you sending?</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PACKAGE_TYPES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPkg(p.id)}
              className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                pkg === p.id
                  ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"
              }`}
            >
              <div className="text-2xl">{p.emoji}</div>
              <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{p.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{p.desc} · up to {p.maxKg} kg</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white">Weight</span>
          <input
            type="range"
            min={1}
            max={pkgType.maxKg}
            value={Math.min(weight, pkgType.maxKg)}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="flex-1 accent-emerald-500"
          />
          <span className="w-14 text-right text-sm text-slate-500 dark:text-slate-400 font-bold">{Math.min(weight, pkgType.maxKg)} kg</span>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-extrabold text-slate-900 dark:text-white">Delivery speed</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {COURIER_SPEEDS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSpeed(s.id)}
              className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                speed === s.id
                  ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"
              }`}
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</div>
              <div className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {s.etaMin < 60 ? `${s.etaMin} min` : `${Math.round(s.etaMin / 60)} hrs`}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-md dark:shadow-none space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Distance</span>
          <span className="font-bold text-slate-900 dark:text-white">{drop ? `${km} km` : "—"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Estimated fare</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{drop ? currency(price) : "—"}</span>
        </div>
        <button
          type="button"
          disabled={!drop}
          onClick={() => {
            setBooked({
              code: "CR-" + Math.floor(1000 + Math.random() * 9000),
              eta: speedType.etaMin,
              price,
            });
            toast.success("Parcel pickup confirmed!");
          }}
          className="mt-2 w-full rounded-2xl bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 py-3.5 text-sm font-black text-white transition-all cursor-pointer shadow-md"
        >
          Confirm parcel booking
        </button>
      </section>

      {booked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2 text-slate-900 dark:text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">Rider Assigned</span>
            <span className="rounded-full bg-emerald-500 text-white text-xs px-2.5 py-0.5 font-black">{booked.code}</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Pickup agent will arrive within {booked.eta} min. Total payable: {currency(booked.price)}.
          </p>
        </motion.div>
      )}
    </div>
  );
}
