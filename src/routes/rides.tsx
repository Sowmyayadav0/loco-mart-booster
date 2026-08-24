import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiCreditCard,
  FiCrosshair,
  FiMapPin,
  FiMessageSquare,
  FiNavigation,
  FiPhone,
  FiShield,
  FiStar,
  FiTruck,
  FiX,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import {
  DRIVERS,
  RECENT_PLACES,
  RIDE_OPTIONS,
  SAVED_PLACES,
  haversineKm,
} from "@/lib/verticals";
import { currency } from "@/utils/format";
import { ServiceCategorySwitcher } from "@/components/common/ServiceCategorySwitcher";

export const Route = createFileRoute("/rides")({
  head: () => ({
    meta: [
      { title: "LocoMart Rides — Book Bikes, Autos & Cabs Zero Surge" },
      {
        name: "description",
        content:
          "Book instant bike taxis, electric autos and AC cabs with upfront fares and live driver tracking on LocoMart.",
      },
      { property: "og:title", content: "LocoMart Rides — Bikes, Autos & Cabs" },
      { property: "og:description", content: "Upfront fares, instant pickup, zero surge pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RidesPage,
});

type Stage = "locate" | "select" | "confirm" | "assigned" | "ontrip" | "done";

const TRACK_STEPS = ["Driver assigned", "Arriving at pickup point", "Trip started", "Destination reached"];

// STUNNING SIMULATED MAP CANVAS WITH ANIMATED LIVE DRIVERS & ROUTE TRACE
function MapCanvas({ pickup, drop }: { pickup: string; drop: string }) {
  return (
    <div className="relative h-60 sm:h-72 w-full overflow-hidden rounded-3xl border border-border bg-slate-900 shadow-md select-none">
      {/* Dark/Light Stylized Grid Pattern */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Simulated Roads & Street Curves */}
      <svg className="absolute inset-0 h-full w-full opacity-30 stroke-emerald-400" fill="none">
        <path d="M 40 180 Q 180 80 340 140 T 600 60" strokeWidth="4" strokeDasharray="8 8" />
        <path d="M 100 240 Q 280 160 480 200" strokeWidth="3" />
      </svg>

      {/* Live Drivers Floating on Map */}
      <motion.div
        className="absolute flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-black text-white shadow-lg backdrop-blur"
        initial={{ left: "18%", top: "60%" }}
        animate={{ left: ["18%", "28%", "22%"], top: ["60%", "45%", "55%"] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      >
        🛵 2 min away
      </motion.div>

      <motion.div
        className="absolute flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-black text-white shadow-lg backdrop-blur"
        initial={{ left: "55%", top: "30%" }}
        animate={{ left: ["55%", "65%", "50%"], top: ["30%", "40%", "25%"] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      >
        🛺 3 min away
      </motion.div>

      <motion.div
        className="absolute flex items-center gap-1 rounded-full bg-blue-500/90 px-2 py-0.5 text-[10px] font-black text-white shadow-lg backdrop-blur"
        initial={{ left: "75%", top: "65%" }}
        animate={{ left: ["75%", "68%", "78%"], top: ["65%", "75%", "60%"] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
      >
        🚕 4 min away
      </motion.div>

      {/* Pickup Location Marker (Green Dot) */}
      <div className="absolute left-8 top-14 flex items-center gap-2">
        <div className="relative flex size-5 items-center justify-center">
          <span className="absolute size-5 rounded-full bg-emerald-500/40 animate-ping" />
          <span className="size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <span className="rounded-xl bg-slate-950/80 px-2.5 py-1 text-[10px] font-extrabold text-white border border-emerald-500/40 shadow-sm backdrop-blur">
          📍 {pickup ? pickup.split(",")[0] : "Koramangala, Bengaluru"}
        </span>
      </div>

      {/* Destination Marker (Red Dot) */}
      <div className="absolute right-8 bottom-10 flex items-center gap-2">
        <div className="relative flex size-5 items-center justify-center">
          <span className="absolute size-5 rounded-full bg-rose-500/40 animate-ping" />
          <span className="size-3 rounded-full bg-rose-500 ring-2 ring-white" />
        </div>
        <span className="rounded-xl bg-slate-950/80 px-2.5 py-1 text-[10px] font-extrabold text-white border border-rose-500/40 shadow-sm backdrop-blur">
          🏁 {drop ? drop.split(",")[0] : "Set Destination"}
        </span>
      </div>

      {/* Live Nearby Drivers Badge */}
      <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur shadow-sm">
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>14 Drivers live nearby · Zero Surge Pricing</span>
      </div>
    </div>
  );
}

function RidesPage() {
  const defaultPickup = (SAVED_PLACES && SAVED_PLACES.length > 0 && SAVED_PLACES[0]?.address)
    ? SAVED_PLACES[0].address
    : "Koramangala 5th Block, Bengaluru";

  const defaultVehicle = (RIDE_OPTIONS && RIDE_OPTIONS.length > 0 && RIDE_OPTIONS[0]?.id)
    ? RIDE_OPTIONS[0].id
    : "auto";

  const [pickup, setPickup] = useState<string>(defaultPickup);
  const [drop, setDrop] = useState<string>("");
  const [stage, setStage] = useState<Stage>("locate");
  const [vehicle, setVehicle] = useState<string>(defaultVehicle);
  const [payment, setPayment] = useState<string>("LocoMart Wallet");
  const [step, setStep] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);

  const km = useMemo(() => haversineKm(pickup + drop), [pickup, drop]);
  
  const quotes = useMemo(() => {
    return (RIDE_OPTIONS ?? []).map((o) => ({
      ...o,
      fare: Math.round(o.base + o.perKm * km),
      trip: Math.max(6, Math.round(km * 3)),
    }));
  }, [km]);

  const chosen = useMemo(() => {
    return quotes.find((q) => q.id === vehicle) ?? quotes[0] ?? {
      id: "auto",
      name: "Loco Auto",
      emoji: "🛺",
      seats: 3,
      desc: "Zero surge guarantee",
      base: 30,
      perKm: 15,
      etaMin: 3,
      fare: 75,
      trip: 12,
    };
  }, [quotes, vehicle]);

  const driver = useMemo(() => {
    const idx = Math.max(0, quotes.findIndex((q) => q.id === vehicle));
    const driversList = DRIVERS ?? [];
    return driversList[idx % Math.max(1, driversList.length)] ?? {
      name: "Rajesh Kumar",
      rating: 4.9,
      model: "Bajaj RE Auto",
      vehicle: "KA 01 AB 1234",
      phone: "+91 98765 43210",
    };
  }, [quotes, vehicle]);

  const advance = () => {
    setStep((s) => {
      const next = s + 1;
      if (next >= TRACK_STEPS.length) {
        setStage("done");
        return s;
      }
      if (next === 2) setStage("ontrip");
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8">
      {/* 1. TOP SERVICE CATEGORY SWITCHER */}
      <ServiceCategorySwitcher activeService="ride" />
      {/* Top Title & Subtitle */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">LocoMart Rides</h1>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-black text-amber-600 border border-amber-300/40">
              ⚡ Zero Surge Guarantee
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upfront fares for bikes, autos and cabs. Fast 2-5 min pickups across Bengaluru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPickup("Flat 402, Prestige Elm, Koramangala 5th Block, Bengaluru");
            toast.success("GPS Auto-detected location!");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all shadow-2xs"
        >
          <FiCrosshair className="size-3.5" /> Auto-Detect Current Location
        </button>
      </header>

      {/* INTERACTIVE STUNNING SIMULATED MAP CANVAS */}
      <MapCanvas pickup={pickup} drop={drop} />

      {/* RIDE BOOKING PANEL (2-Column Layout) */}
      {stage === "locate" || stage === "select" || stage === "confirm" ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT SIDE: Pickup & Destination Inputs */}
          <section className="space-y-5 rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs lg:col-span-6">
            <div className="space-y-3.5">
              {/* Pickup Input */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <FiNavigation className="size-4" /> Pickup Location
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">● Current GPS Pin</span>
                </label>
                <div className="relative">
                  <input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-border bg-muted/30 px-3.5 text-xs font-bold text-foreground outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Destination Input */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-rose-500">
                  <FiMapPin className="size-4" /> Destination
                </label>
                <div className="relative">
                  <input
                    value={drop}
                    onChange={(e) => {
                      setDrop(e.target.value);
                      setStage(e.target.value.trim() ? "select" : "locate");
                    }}
                    placeholder="Where to? (e.g. Indiranagar, MG Road, Airport)"
                    className="h-11 w-full rounded-2xl border border-border bg-muted/30 px-3.5 text-xs font-bold text-foreground outline-none focus:border-emerald-500 transition-colors"
                  />
                  {drop ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDrop("");
                        setStage("locate");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Saved Places Shortcuts */}
            <div className="space-y-2 pt-1 border-t border-border/50">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                SAVED PLACES
              </span>
              <div className="flex flex-wrap gap-2">
                {(SAVED_PLACES ?? []).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setDrop(p.address);
                      setStage("select");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-bold text-foreground hover:border-emerald-500 hover:bg-emerald-500/10 transition-all shadow-2xs"
                  >
                    <span>{p.label === "Home" ? "🏠" : p.label === "Work" ? "🏢" : "📍"}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Places */}
            <div className="space-y-2 pt-1 border-t border-border/50">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                RECENT DESTINATIONS
              </span>
              <ul className="space-y-1.5">
                {(RECENT_PLACES ?? []).map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => {
                        setDrop(r);
                        setStage("select");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-2xl border border-border/50 bg-card p-2.5 text-left text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      <FiMapPin className="shrink-0 text-emerald-600 size-4" />
                      <span className="line-clamp-1">{r}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* RIGHT SIDE: Ride Vehicle Selector Cards */}
          <section className="space-y-4 lg:col-span-6">
            {stage === "locate" ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center space-y-3">
                <span className="grid size-14 place-items-center rounded-full bg-emerald-500/10 text-2xl text-emerald-600 mx-auto">
                  🛺
                </span>
                <h3 className="text-base font-extrabold text-foreground">Where are you heading today?</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Select a destination or tap on any saved location to compare fares for Bike, Auto, and AC Cabs.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-foreground">Available Ride Options</h3>
                  <span className="text-xs font-bold text-emerald-600">{km} km route</span>
                </div>

                {/* Ride Vehicle Cards */}
                <div className="space-y-2.5">
                  {quotes.map((q) => {
                    const active = vehicle === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setVehicle(q.id)}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-500/10 shadow-xs ring-1 ring-emerald-500"
                            : "border-border/70 bg-card hover:border-emerald-500/50 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="grid size-12 place-items-center rounded-2xl bg-muted text-2xl shrink-0">
                            {q.emoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-foreground">{q.name}</h4>
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                                👥 {q.seats} seats
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {q.desc} · <b className="text-emerald-600 font-extrabold">{q.etaMin} min away</b>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-foreground">{currency(q.fare)}</span>
                          <span className="block text-[10px] text-muted-foreground">No Surge</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Methods & Book Button */}
                <div className="rounded-3xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1.5">
                      PAYMENT METHOD
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["LocoMart Wallet", "UPI / GPay", "Cash", "Credit Card"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPayment(p)}
                          className={`rounded-full border px-3 py-1 text-xs font-extrabold transition-all ${
                            payment === p
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-2xs"
                              : "border-border bg-card text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStage("assigned");
                      setStep(0);
                      toast.success(`${chosen.name} booked! Driver assigned.`);
                    }}
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-black text-white shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Book {chosen.name} · {currency(chosen.fare)}</span>
                    <FiArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {/* DRIVER ASSIGNED & LIVE TRACKING PANEL */}
      <AnimatePresence>
        {stage === "assigned" || stage === "ontrip" ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-emerald-500/30 bg-card p-6 space-y-6 shadow-xl"
          >
            {/* Driver Profile Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="grid size-14 place-items-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-600 font-bold border border-emerald-300/40">
                  👨‍✈️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-foreground">{driver.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                      <FiStar className="fill-amber-400 text-amber-400" /> {driver.rating}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {driver.model} · <b className="text-foreground">{driver.vehicle}</b>
                  </p>
                </div>
              </div>

              {/* OTP & Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">OTP CODE</span>
                  <span className="text-sm font-black text-emerald-600 tracking-wider">4821</span>
                </div>

                <a
                  href={`tel:${driver.phone.replace(/\s/g, "")}`}
                  className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs hover:scale-105 transition-transform"
                  title="Call Driver"
                >
                  <FiPhone className="size-4.5" />
                </a>
                <button
                  type="button"
                  onClick={() => toast.info("Opening live chat with " + driver.name)}
                  className="grid size-10 place-items-center rounded-2xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  title="Chat with Driver"
                >
                  <FiMessageSquare className="size-4.5" />
                </button>
              </div>
            </div>

            {/* Live Track Steps Timeline */}
            <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRACK_STEPS.map((s, i) => {
                const active = i <= step;
                return (
                  <li
                    key={s}
                    className={`rounded-2xl border p-3 text-center space-y-1 transition-all ${
                      active
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-extrabold"
                        : "border-border bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <span className={`inline-block size-2 rounded-full ${active ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                    <p className="text-xs font-bold leading-tight">{s}</p>
                  </li>
                );
              })}
            </ol>

            {/* Simulation Controls */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={advance}
                className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-black text-white shadow-md transition-colors"
              >
                {step < TRACK_STEPS.length - 1 ? "Simulate Next Tracking Step →" : "Complete Trip"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStage("select");
                  toast.info("Ride cancelled. Zero charges applied.");
                }}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
              >
                <FiX className="size-4" /> Cancel Ride
              </button>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {/* RIDE COMPLETED SUMMARY */}
      {stage === "done" ? (
        <section className="space-y-6 rounded-3xl border border-emerald-500/30 bg-card p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 text-2xl font-bold">
              🎉
            </span>
            <div>
              <h2 className="text-lg font-black text-foreground">Trip Completed!</h2>
              <p className="text-xs text-muted-foreground">You reached your destination safely with LocoMart Rides.</p>
            </div>
          </div>

          <dl className="space-y-2 text-xs border-y border-border/50 py-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Vehicle Fare ({chosen.name})</dt>
              <dd className="font-bold text-foreground">{currency(chosen.fare)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Distance Travelled</dt>
              <dd className="font-bold text-foreground">{km} km</dd>
            </div>
            <div className="flex justify-between pt-1 font-black text-sm">
              <dt>Paid via {payment}</dt>
              <dd className="text-emerald-600">{currency(chosen.fare)}</dd>
            </div>
          </dl>

          {/* Rate Driver */}
          <div className="text-center space-y-2">
            <p className="text-xs font-bold text-foreground">Rate your driver {driver.name}</p>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setRating(n);
                    toast.success("Thank you for rating your driver!");
                  }}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <FiStar className={`size-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStage("locate");
              setDrop("");
              setRating(0);
            }}
            className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Book Another Ride
          </button>
        </section>
      ) : null}
    </div>
  );
}
