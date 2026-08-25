import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiCreditCard,
  FiCrosshair,
  FiEdit2,
  FiMapPin,
  FiMessageSquare,
  FiNavigation,
  FiPhone,
  FiShield,
  FiStar,
  FiTag,
  FiTruck,
  FiUserCheck,
  FiX,
  FiZap,
} from "react-icons/fi";
import {
  DRIVERS,
  RECENT_PLACES,
  RIDE_OPTIONS,
  SAVED_PLACES,
  haversineKm,
} from "@/lib/verticals";
import { currency } from "@/utils/format";
import { ServiceCategorySwitcher } from "@/components/common/ServiceCategorySwitcher";
import { InteractiveRideMap } from "@/components/map/InteractiveRideMap";
import { navaStore } from "@/lib/navaStore";

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

// Extended Uber/Rapido Ride Categories
const EXPANDED_RIDE_OPTIONS = [
  {
    id: "bike",
    name: "Rapido Bike Taxi",
    tagline: "Fastest single rider trip",
    badge: "⚡ FASTEST",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-400/40",
    emoji: "🛵",
    seats: 1,
    desc: "Beat the traffic · Helmets provided",
    base: 20,
    perKm: 10,
    etaMin: 2,
    discountPct: 30,
  },
  {
    id: "auto",
    name: "Loco Auto (Electric)",
    tagline: "Zero surge guaranteed",
    badge: "🌱 ECO CHOICE",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-400/40",
    emoji: "🛺",
    seats: 3,
    desc: "Comfortable 3-wheeler · Upfront fare",
    base: 30,
    perKm: 14,
    etaMin: 3,
    discountPct: 20,
  },
  {
    id: "ubergo",
    name: "UberGo AC Cab",
    tagline: "Affordable AC hatchbacks",
    badge: "❄️ AC CAB",
    badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-400/40",
    emoji: "🚗",
    seats: 4,
    desc: "Pocket-friendly compact cars",
    base: 60,
    perKm: 18,
    etaMin: 4,
    discountPct: 15,
  },
  {
    id: "sedan",
    name: "Uber Premier Sedan",
    tagline: "Top-rated drivers & comfort",
    badge: "👑 PREMIER",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-400/40",
    emoji: "🚘",
    seats: 4,
    desc: "Spacious sedans · Extra legroom",
    base: 90,
    perKm: 24,
    etaMin: 5,
    discountPct: 10,
  },
];

function RidesPage() {
  const defaultPickup =
    navaStore.getActiveLocation() ||
    (SAVED_PLACES && SAVED_PLACES.length > 0 && SAVED_PLACES[0]?.address) ||
    "Narasa Agraharam, Bhimavaram";

  const [pickup, setPickup] = useState<string>(defaultPickup);
  const [drop, setDrop] = useState<string>("");
  const [stage, setStage] = useState<Stage>("locate");
  const [vehicle, setVehicle] = useState<string>("auto");
  const [payment, setPayment] = useState<string>("UPI / GPay");
  const [couponApplied, setCouponApplied] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [gpsLoading, setGpsLoading] = useState(false);

  const km = useMemo(() => Math.max(3.2, haversineKm(pickup + drop)), [pickup, drop]);

  const quotes = useMemo(() => {
    return EXPANDED_RIDE_OPTIONS.map((o) => {
      const originalFare = Math.round(o.base + o.perKm * km);
      const discount = couponApplied ? 50 : 0;
      const finalFare = Math.max(25, originalFare - discount);
      return {
        ...o,
        originalFare,
        fare: finalFare,
        trip: Math.max(5, Math.round(km * 3)),
      };
    });
  }, [km, couponApplied]);

  const chosen = useMemo(() => {
    return (
      quotes.find((q) => q.id === vehicle) ||
      quotes[1] ||
      quotes[0] || {
        id: "auto",
        name: "Loco Auto (Electric)",
        tagline: "Zero surge guaranteed",
        badge: "🌱 ECO CHOICE",
        badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-400/40",
        emoji: "🛺",
        seats: 3,
        desc: "Comfortable 3-wheeler · Upfront fare",
        base: 30,
        perKm: 14,
        etaMin: 3,
        discountPct: 20,
        originalFare: 80,
        fare: 50,
        trip: 10,
      }
    );
  }, [quotes, vehicle]);

  const driver = useMemo(() => {
    const idx = Math.max(0, quotes.findIndex((q) => q.id === vehicle));
    const driversList = DRIVERS ?? [];
    return (
      driversList[idx % Math.max(1, driversList.length)] ?? {
        name: "Rajesh Kumar",
        rating: 4.9,
        model: "Bajaj RE Auto",
        vehicle: "AP 37 AB 9876",
        phone: "+91 98765 43210",
      }
    );
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

  async function handleAutoDetectGPS() {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const road = addr.road || addr.suburb || addr.neighbourhood || "";
              const area = addr.suburb || addr.village || addr.county || "";
              const city = addr.city || addr.town || addr.municipality || "";
              const parts = [road, area, city].filter(Boolean);
              const formatted = parts.length > 0 ? parts.join(", ") : data.display_name;
              setPickup(formatted);
              navaStore.setActiveLocation(formatted);
              setGpsLoading(false);
              return;
            }
          } catch {
            // Fallback
          }
          const fallback = `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          setPickup(fallback);
          navaStore.setActiveLocation(fallback);
          setGpsLoading(false);
        },
        () => {
          setGpsLoading(false);
        }
      );
    } else {
      setGpsLoading(false);
    }
  }

  function handleSelectDestination(destinationAddress: string) {
    setDrop(destinationAddress);
    setStage("select"); // Move to Screen 2 (Map & Vehicles)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (drop.trim().length > 0) {
      setStage("select"); // Move to Screen 2
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8 text-slate-900 dark:text-white select-none">
      {/* 1. TOP SERVICE CATEGORY SWITCHER */}
      <ServiceCategorySwitcher activeService="ride" />

      {/* ========================================================= */}
      {/* SCREEN 1: UBER-STYLE "WHERE TO?" LOCATION SELECTOR (NO MAP) */}
      {/* ========================================================= */}
      {stage === "locate" && (
        <div className="mx-auto max-w-xl space-y-6">
          {/* HEADER */}
          <header className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ⚡ Zero Surge Guarantee · Instant Pickup
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Where can we take you?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Book Rapido bikes, electric autos and AC cabs across your city.
            </p>
          </header>

          {/* UBER SIGNATURE LOCATION INPUT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-6"
          >
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              {/* VERTICAL CONNECTOR INPUTS */}
              <div className="relative space-y-3">
                {/* Connecting vertical dashed line */}
                <div className="absolute left-[19px] top-[32px] bottom-[32px] w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 z-0" />

                {/* PICKUP LOCATION INPUT */}
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                    <span>PICKUP LOCATION</span>
                    <button
                      type="button"
                      onClick={handleAutoDetectGPS}
                      className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <FiCrosshair className="size-3" />
                      <span>{gpsLoading ? "Detecting..." : "● LIVE GPS"}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 p-3 shadow-2xs focus-within:border-emerald-500 transition-all">
                    <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-white shrink-0 shadow-xs">
                      <FiNavigation className="size-3.5" />
                    </span>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Enter pickup address"
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* DESTINATION INPUT */}
                <div className="relative z-10 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                    WHERE ARE YOU HEADING?
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-rose-400/80 dark:border-rose-500/60 bg-slate-100 dark:bg-slate-800 p-3 shadow-md focus-within:border-rose-500 transition-all">
                    <span className="grid size-7 place-items-center rounded-full bg-rose-500 text-white shrink-0 shadow-xs">
                      <FiMapPin className="size-3.5" />
                    </span>
                    <input
                      type="text"
                      autoFocus
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      placeholder="Enter destination (e.g. Airport, Market, Street)"
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    {drop && (
                      <button
                        type="button"
                        onClick={() => setDrop("")}
                        className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-300 transition-colors cursor-pointer shrink-0"
                      >
                        <FiX className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* PROMINENT "SEE PRICES & MAP" BUTTON */}
              <button
                type="submit"
                disabled={!drop.trim()}
                className={`w-full h-13 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                  drop.trim()
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                }`}
              >
                <span>Find Rides & See Map</span>
                <FiArrowRight className="size-4.5" />
              </button>
            </form>

            {/* SAVED PLACES SHORTCUTS (1-CLICK DIRECT TO SCREEN 2) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                SAVED PLACES
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {(SAVED_PLACES ?? []).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectDestination(p.address)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 hover:border-emerald-500 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all cursor-pointer space-y-1.5 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {p.label === "Home" ? "🏠" : p.label === "Work" ? "🏢" : "📍"}
                    </span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* RECENT SEARCHES (1-CLICK DIRECT TO SCREEN 2) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                RECENT SEARCHES
              </span>
              <div className="space-y-2">
                {(RECENT_PLACES ?? []).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectDestination(r)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 text-left hover:bg-emerald-500/10 dark:hover:bg-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <FiClock className="size-4" />
                    </span>
                    <div className="overflow-hidden flex-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {r}
                      </span>
                    </div>
                    <FiArrowRight className="size-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 2: UBER-STYLE INTERACTIVE MAP & RIDE SELECTION */}
      {/* ========================================================= */}
      {(stage === "select" || stage === "confirm") && (
        <div className="space-y-6">
          {/* TOP ROUTE BAR WITH BACK BUTTON */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
            <button
              type="button"
              onClick={() => setStage("locate")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <FiArrowLeft className="size-4" />
              <span>Change Location</span>
            </button>

            {/* ROUTE SUMMARY BADGE */}
            <div className="flex items-center gap-2 text-xs font-black max-w-md truncate">
              <span className="text-emerald-600 dark:text-emerald-400 truncate">
                🟢 {pickup.split(",")[0] || pickup}
              </span>
              <span className="text-slate-400">➔</span>
              <span className="text-rose-600 dark:text-rose-400 truncate">
                🔴 {drop.split(",")[0] || drop}
              </span>
            </div>

            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              {km} km route
            </div>
          </div>

          {/* INTERACTIVE LEAFLET & OPENSTREETMAP CANVAS */}
          <InteractiveRideMap
            pickup={pickup}
            drop={drop}
            stage={stage}
            selectedVehicle={vehicle}
            onPickupChange={(newPickup) => setPickup(newPickup)}
            onDropChange={(newDrop) => setDrop(newDrop)}
          />

          {/* 2-COLUMN VEHICLES & CONFIRMATION PANEL */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* LEFT COLUMN: VEHICLE OPTIONS CARDS */}
            <section className="space-y-3 lg:col-span-7">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Available Rides ({quotes.length})
                </h2>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FiShield className="size-3.5" /> Zero Surge Guaranteed
                </span>
              </div>

              {quotes.map((q) => {
                const active = vehicle === q.id;
                return (
                  <motion.button
                    key={q.id}
                    type="button"
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setVehicle(q.id)}
                    className={`flex w-full items-center justify-between rounded-3xl border p-4.5 text-left transition-all cursor-pointer ${
                      active
                        ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-md ring-2 ring-emerald-500/30"
                        : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* VEHICLE EMOJI ICON BADGE */}
                      <div className="relative grid size-14 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-3xl shrink-0 shadow-2xs">
                        {q.emoji}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            {q.name}
                          </h3>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-black border ${q.badgeBg}`}>
                            {q.badge}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {q.desc}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5 text-[11px] font-extrabold">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ⏱️ {q.etaMin} mins away
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            👥 {q.seats} seats
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* FARE & PRICING */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        {couponApplied && (
                          <span className="text-xs font-bold text-slate-400 line-through">
                            {currency(q.originalFare)}
                          </span>
                        )}
                        <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                          {currency(q.fare)}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        NO SURGE
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </section>

            {/* RIGHT COLUMN: PAYMENT & CONFIRM BOOKING */}
            <section className="space-y-4 lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xl dark:shadow-none">
                {/* PROMO COUPON ROW */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-300">
                    <FiTag className="size-4 text-emerald-500" />
                    <span>PROMO 'LOCO50' (₹50 OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCouponApplied(!couponApplied)}
                    className="text-xs font-black text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
                  >
                    {couponApplied ? "Remove" : "Apply"}
                  </button>
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    PAYMENT METHOD
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["UPI / GPay", "Cash", "Loco Wallet", "Credit Card"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPayment(p)}
                        className={`p-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center ${
                          payment === p
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                            : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FARE BREAKDOWN */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Base & Distance Fare</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currency(chosen.originalFare)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>- ₹50</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-white/5">
                    <span>Total Payable</span>
                    <span className="text-base text-emerald-600 dark:text-emerald-400">{currency(chosen.fare)}</span>
                  </div>
                </div>

                {/* UBER / RAPIDO CONFIRM BOOKING CTA BUTTON */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStage("assigned");
                    setStep(0);
                  }}
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Request {chosen.name}</span>
                  <FiArrowRight className="size-5" />
                </motion.button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 3: DRIVER ASSIGNED & LIVE TRACKING SCREEN */}
      {/* ========================================================= */}
      <AnimatePresence>
        {(stage === "assigned" || stage === "ontrip") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* LIVE TRACKING MAP */}
            <InteractiveRideMap
              pickup={pickup}
              drop={drop}
              stage={stage}
              selectedVehicle={vehicle}
            />

            {/* DRIVER HEADER PROFILE CARD */}
            <div className="rounded-3xl border border-emerald-500/30 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative grid size-16 place-items-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-3xl text-white font-bold shadow-lg shadow-emerald-500/20">
                    👨‍✈️
                    <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {driver.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-400/30">
                        <FiStar className="fill-amber-400 text-amber-400 size-3.5" /> {driver.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {driver.model} · <b className="text-slate-900 dark:text-white uppercase tracking-wider">{driver.vehicle}</b>
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                      <FiUserCheck className="size-3.5" /> Verified Captain · 2,400+ Completed Trips
                    </p>
                  </div>
                </div>

                {/* 4-DIGIT PIN OTP & QUICK CALL/CHAT BUTTONS */}
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 px-4 py-2 text-center shadow-xs">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                      START TRIP PIN
                    </span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-widest">
                      4821
                    </span>
                  </div>

                  <a
                    href={`tel:${driver.phone.replace(/\s/g, "")}`}
                    className="grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                    title="Call Captain"
                  >
                    <FiPhone className="size-5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => alert("Connecting live chat with " + driver.name)}
                    className="grid size-12 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Chat with Captain"
                  >
                    <FiMessageSquare className="size-5" />
                  </button>
                </div>
              </div>

              {/* LIVE STEP TIMELINE */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  TRIP PROGRESS
                </span>
                <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TRACK_STEPS.map((s, i) => {
                    const active = i <= step;
                    return (
                      <li
                        key={s}
                        className={`rounded-2xl border p-3.5 text-center space-y-1.5 transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-black shadow-xs"
                            : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 text-slate-400"
                        }`}
                      >
                        <span
                          className={`inline-block size-2.5 rounded-full ${
                            active ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-700"
                          }`}
                        />
                        <p className="text-xs font-extrabold leading-tight">{s}</p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* SIMULATION STEP CONTROLS */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={advance}
                  className="flex-1 h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{step < TRACK_STEPS.length - 1 ? "Simulate Next Tracking Step →" : "Complete Trip"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStage("select");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 h-13 text-xs font-black text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <FiX className="size-4" /> Cancel Ride
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* SCREEN 4: RIDE COMPLETED SUMMARY */}
      {/* ========================================================= */}
      {stage === "done" && (
        <section className="space-y-6 rounded-3xl border border-emerald-500/30 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-600 text-3xl font-bold border border-emerald-500/30">
              🎉
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Trip Completed!</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                You reached your destination safely with Loco Rides.
              </p>
            </div>
          </div>

          <dl className="space-y-2.5 text-xs sm:text-sm border-y border-slate-200 dark:border-white/10 py-4">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400 font-semibold">Vehicle Type ({chosen.name})</dt>
              <dd className="font-extrabold text-slate-900 dark:text-white">{currency(chosen.fare)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400 font-semibold">Distance Travelled</dt>
              <dd className="font-extrabold text-slate-900 dark:text-white">{km} km</dd>
            </div>
            <div className="flex justify-between pt-1 font-black text-base text-slate-900 dark:text-white">
              <dt>Total Paid via {payment}</dt>
              <dd className="text-emerald-600 dark:text-emerald-400">{currency(chosen.fare)}</dd>
            </div>
          </dl>

          {/* Rate Driver */}
          <div className="text-center space-y-2">
            <p className="text-xs font-black text-slate-900 dark:text-white">Rate Captain {driver.name}</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setRating(n);
                  }}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer"
                >
                  <FiStar
                    className={`size-7 ${
                      n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
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
            className="w-full h-13 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white hover:bg-emerald-700 transition-colors shadow-md cursor-pointer"
          >
            Book Another Ride
          </button>
        </section>
      )}
    </div>
  );
}
