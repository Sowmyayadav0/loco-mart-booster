import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FiCheck, FiCompass, FiCrosshair, FiMapPin, FiNavigation, FiSearch, FiX } from "react-icons/fi";
import { navaStore } from "@/lib/navaStore";
import { cn } from "@/lib/utils";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (location: { address: string; city: string; pincode: string; lat?: number; lng?: number }) => void;
}

export function LocationPickerModal({ isOpen, onClose, onSelectLocation }: LocationPickerModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAddress, setCurrentAddress] = useState("Koramangala 5th Block, Bengaluru, 560095");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 12.9352, lng: 77.6245 });

  const addresses = navaStore.getAddresses();

  if (!isOpen) return null;

  // AUTO-DETECT GPS LOCATION WITH OPENSTREETMAP REVERSE GEOCODING
  async function handleAutoDetectGPS() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    toast.loading("Detecting your high-accuracy GPS location...", { id: "gps-detect" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });

        try {
          // Reverse Geocoding via OpenStreetMap Nominatim API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await res.json();

          const addr = data.address || {};
          const area = addr.suburb || fontArea(addr) || addr.neighbourhood || "Koramangala";
          const city = addr.city || addr.town || addr.county || "Bengaluru";
          const pincode = addr.postcode || "560001";
          const fullFormatted = `${area}, ${city}, ${pincode}`;

          setCurrentAddress(fullFormatted);
          toast.success(`Location detected: ${fullFormatted}`, { id: "gps-detect" });

          if (onSelectLocation) {
            onSelectLocation({ address: fullFormatted, city, pincode, lat, lng });
          }
        } catch {
          const fallback = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
          setCurrentAddress(fallback);
          toast.success(`Coordinates fetched: ${fallback}`, { id: "gps-detect" });
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        toast.error("GPS access denied or timed out. Please select location manually.", { id: "gps-detect" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function fontArea(addr: any): string {
    return addr.road || addr.residential || "";
  }

  function handleConfirmLocation(addrStr: string) {
    setCurrentAddress(addrStr);
    const shortFormatted = `${addrStr.split(",")[0]}, ${addrStr.split(",")[2]?.trim() || "560001"}`;
    navaStore.setActiveLocation(shortFormatted);
    toast.success(`Selected delivery location: ${addrStr.split(",")[0]}`);
    if (onSelectLocation) {
      onSelectLocation({
        address: addrStr,
        city: addrStr.split(",")[1]?.trim() || "Bengaluru",
        pincode: addrStr.split(",")[2]?.trim() || "560001",
        lat: coords.lat,
        lng: coords.lng,
      });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-white/20 p-5 sm:p-6 shadow-[0_25px_70px_-10px_rgba(0,0,0,0.9)] space-y-5 text-white no-scrollbar">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 font-bold shadow-xs">
              <FiMapPin className="size-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">Select Delivery Location</h2>
              <p className="text-xs text-slate-300">High-Accuracy GPS & Saved Addresses</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* GPS AUTO-DETECT BUTTON */}
        <button
          type="button"
          onClick={handleAutoDetectGPS}
          disabled={loading}
          className="w-full flex items-center justify-between rounded-2xl border border-emerald-500/50 bg-emerald-950/60 p-4 text-white shadow-lg hover:bg-emerald-900/80 hover:border-emerald-400 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-emerald-500 text-slate-950 font-black shrink-0 group-hover:scale-110 transition-transform shadow-md">
              <FiCrosshair className={`size-5 ${loading ? "animate-spin" : ""}`} />
            </span>
            <div className="text-left">
              <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">Use Current GPS Location</h3>
              <p className="text-xs text-slate-300 mt-0.5">Auto-detect high accuracy position</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-400 text-slate-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-sm">
            {loading ? "Detecting…" : "Auto Detect"}
          </span>
        </button>

        {/* SIMULATED MAP PREVIEW WITH PIN */}
        <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-inner select-none">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Centered Map Pin */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center">
              <span className="absolute size-8 rounded-full bg-cyan-400/40 animate-ping" />
              <span className="grid size-10 place-items-center rounded-full bg-cyan-500 text-slate-950 font-black shadow-xl text-base">
                📍
              </span>
            </div>
            <span className="mt-2 rounded-xl bg-slate-900/95 px-3 py-1 text-xs font-black text-cyan-300 border border-cyan-400/40 backdrop-blur shadow-md max-w-[85%] truncate text-center">
              {currentAddress}
            </span>
          </div>

          <div className="absolute bottom-2 left-2 rounded-lg bg-slate-900/90 px-2 py-0.5 text-[10px] text-slate-400 font-mono border border-white/10">
            Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
          </div>
        </div>

        {/* SEARCH ADDRESS INPUT */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
            SEARCH AREA / CITY
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4.5" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area (e.g. Koramangala, Indiranagar, HSR Layout...)"
              className="h-11 w-full rounded-2xl border border-white/20 bg-slate-950/80 text-white placeholder:text-slate-400 pl-10 pr-4 text-xs font-bold outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
          </div>
        </div>

        {/* POPULAR AREAS LIST */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
            POPULAR BENGALURU AREAS
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              "Koramangala 5th Block",
              "Indiranagar 100ft Road",
              "HSR Layout Sector 1",
              "Whitefield Main Road",
              "MG Road, Brigade Road",
              "Jayanagar 4th Block",
            ]
              .filter((a) => !searchQuery || a.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleConfirmLocation(`${area}, Bengaluru`)}
                  className="rounded-full border border-white/15 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-100 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white transition-all shadow-xs cursor-pointer"
                >
                  📍 {area}
                </button>
              ))}
          </div>
        </div>

        {/* SAVED ADDRESSES LIST */}
        <div className="space-y-2 border-t border-white/10 pt-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
            SAVED ADDRESSES
          </span>
          <div className="space-y-2">
            {addresses.map((addr) => {
              const full = `${addr.house} ${addr.street}, ${addr.area}, ${addr.city} ${addr.pincode}`;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleConfirmLocation(full)}
                  className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/50 p-3 text-left hover:border-cyan-400 hover:bg-slate-800 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-cyan-400 border border-white/10 group-hover:bg-cyan-500/20 transition-colors">
                      {addr.label === "HOME" ? "🏠" : "🏢"}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-white">{addr.label}</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{full}</p>
                    </div>
                  </div>
                  <FiCheck className="size-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>

        {/* CONFIRM LOCATION BUTTON */}
        <button
          type="button"
          onClick={() => handleConfirmLocation(currentAddress)}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:opacity-95 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/30 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
        >
          Confirm Delivery Location
        </button>
      </div>
    </div>
  );
}
