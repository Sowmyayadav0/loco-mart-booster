import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiBriefcase, FiCrosshair, FiHome, FiMapPin, FiSearch } from "react-icons/fi";
import { navaStore } from "@/lib/navaStore";

interface DeliveryAddressScreenProps {
  onConfirm: (address: string) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function DeliveryAddressScreen({ onConfirm, onSkip, onBack }: DeliveryAddressScreenProps) {
  const [selectedAddr, setSelectedAddr] = useState("Home");
  const [customAddress, setCustomAddress] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  const ADDRESS_LIST = [
    {
      id: "Home",
      title: "Home",
      address: "42 Valley Road, Phase 2, Bangalore, 560038",
      icon: FiHome,
      badgeColor: "bg-cyan-100 dark:bg-cyan-500/20 text-[#044D63] dark:text-cyan-300",
    },
    {
      id: "Work",
      title: "Work",
      address: "Tech Park, Tower C, Outer Ring Road, Bengaluru",
      icon: FiBriefcase,
      badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    },
    {
      id: "Other",
      title: "Other",
      address: "Metro Station Drop-off, Gate 2, Bengaluru",
      icon: FiMapPin,
      badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    },
  ];

  // REAL HIGH-ACCURACY GPS DETECT WITH REVERSE GEOCODING
  async function handleUseCurrentLocation() {
    if (!("geolocation" in navigator)) {
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.residential || "";
            const area = addr.suburb || addr.neighbourhood || addr.village || addr.county || "";
            const city = addr.city || addr.town || addr.municipality || addr.state_district || "Bengaluru";
            const postcode = addr.postcode ? ` ${addr.postcode}` : "";

            const parts = [road, area, city].filter(Boolean);
            const formatted = parts.length > 0 ? parts.join(", ") + postcode : data.display_name;

            setSelectedAddr("GPS Location");
            setCustomAddress(formatted);
            navaStore.setActiveLocation(formatted);
          } else {
            const fallback = `GPS Pin (${lat.toFixed(4)}, ${lng.toFixed(4)}), Bengaluru`;
            setSelectedAddr("GPS Location");
            setCustomAddress(fallback);
            navaStore.setActiveLocation(fallback);
          }
        } catch {
          const fallback = `GPS Pin (${lat.toFixed(4)}, ${lng.toFixed(4)}), Bengaluru`;
          setSelectedAddr("GPS Location");
          setCustomAddress(fallback);
          navaStore.setActiveLocation(fallback);
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        setLocLoading(false);
        const fallback = "Flat 402, Prestige Elm, Koramangala 5th Block, Bengaluru 560095";
        setSelectedAddr("GPS Location");
        setCustomAddress(fallback);
        navaStore.setActiveLocation(fallback);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // Handle Search Input & Pincode Lookup
  async function handleSearchChange(value: string) {
    setCustomAddress(value);
    setSelectedAddr("GPS Location");

    const cleanPin = value.trim();
    if (cleanPin.length === 6 && /^\d+$/.test(cleanPin)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const mappedStr = `${po.Name}, ${po.District || "Bengaluru"}, ${po.State || "Karnataka"} ${cleanPin}`;
          setCustomAddress(mappedStr);
          navaStore.setActiveLocation(mappedStr);
        }
      } catch {
        // Fallback
      }
    }
  }

  function handleConfirm() {
    const chosen =
      selectedAddr === "GPS Location"
        ? customAddress || "Koramangala 5th Block, Bengaluru"
        : ADDRESS_LIST.find((a) => a.id === selectedAddr)?.address || "42 Valley Road, Bangalore";

    navaStore.setActiveLocation(chosen);
    onConfirm(chosen);
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 py-4 sm:py-8 bg-[#FAFDFB] dark:bg-slate-950 text-slate-900 dark:text-white select-none overflow-hidden transition-colors">
      {/* MAP TEXTURE BACKGROUND PREVIEW HEADER */}
      <div
        className="absolute top-0 left-0 right-0 h-40 opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 100%), url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')",
          backgroundSize: "cover",
        }}
      />

      {/* TOP BAR WITH BACK BUTTON & SKIP */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between shrink-0 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="size-10 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <FiArrowLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="text-xs sm:text-sm font-extrabold text-[#044D63] dark:text-cyan-400 hover:underline transition-colors px-3 py-1 cursor-pointer"
        >
          Skip
        </button>
      </header>

      {/* BOTTOM SHEET / CARD CONTAINER */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto space-y-4 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-white/10 shadow-xl shadow-cyan-900/10 dark:shadow-none space-y-4"
        >
          {/* SHEET HANDLE PIN */}
          <div className="w-12 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto" />

          {/* HEADING */}
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Where should we deliver?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Move the map to adjust or search for an address.
            </p>
          </div>

          {/* SEARCH ADDRESS INPUT */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 size-4.5" />
            <input
              type="text"
              value={customAddress}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search area, street, landmark or 6-digit Pincode"
              className="w-full h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800 pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00BCD4] focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>

          {/* USE CURRENT LOCATION BUTTON */}
          <button
            type="button"
            disabled={locLoading}
            onClick={handleUseCurrentLocation}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-cyan-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiCrosshair className="size-4.5" />
            <span>{locLoading ? "Detecting GPS location..." : "Use current location"}</span>
          </button>

          {/* SAVED ADDRESSES SECTION */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              <span className="flex items-center gap-1 text-[#044D63] dark:text-cyan-400">
                ⭐ SAVED ADDRESSES
              </span>
              <span className="text-[#044D63] dark:text-cyan-400 cursor-pointer hover:underline">VIEW ALL</span>
            </div>

            {/* ADDRESS CARDS LIST */}
            <div className="space-y-2 pt-1 max-h-[30vh] overflow-y-auto no-scrollbar">
              {ADDRESS_LIST.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedAddr === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedAddr(item.id);
                      setCustomAddress(item.address);
                    }}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#00BCD4] bg-[#EEFBFD] dark:bg-cyan-500/20 shadow-xs"
                        : "border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <span className={`grid size-10 place-items-center rounded-2xl ${item.badgeColor} shrink-0`}>
                      <IconComponent className="size-5" />
                    </span>
                    <div className="space-y-0.5 overflow-hidden">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate leading-tight">
                        {item.address}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>

      {/* FOOTER CONFIRM BUTTON */}
      <footer className="relative z-10 w-full max-w-md mx-auto pt-3 shrink-0">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-13 rounded-2xl bg-[#044D63] hover:bg-[#033B4C] text-white font-extrabold text-base shadow-lg shadow-cyan-950/20 transition-all flex items-center justify-center cursor-pointer"
        >
          Confirm Location
        </button>
      </footer>
    </div>
  );
}
