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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-background border border-border p-5 sm:p-6 shadow-2xl space-y-5 no-scrollbar">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
              <FiMapPin className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-foreground">Select Delivery Location</h2>
              <p className="text-xs text-muted-foreground">High-Accuracy GPS & Saved Addresses</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* GPS AUTO-DETECT BUTTON */}
        <button
          type="button"
          onClick={handleAutoDetectGPS}
          disabled={loading}
          className="w-full flex items-center justify-between rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300 shadow-2xs hover:bg-emerald-500 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white shrink-0 group-hover:scale-110 transition-transform">
              <FiCrosshair className={`size-5 ${loading ? "animate-spin" : ""}`} />
            </span>
            <div className="text-left">
              <h3 className="text-xs font-black">Use Current GPS Location</h3>
              <p className="text-[11px] opacity-80 mt-0.5">Auto-detect high accuracy position</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-600/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
            {loading ? "Detecting…" : "Auto Detect"}
          </span>
        </button>

        {/* SIMULATED MAP PREVIEW WITH PIN */}
        <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-border bg-slate-900 shadow-inner select-none">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Centered Map Pin */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center">
              <span className="absolute size-8 rounded-full bg-emerald-500/40 animate-ping" />
              <span className="grid size-10 place-items-center rounded-full bg-emerald-600 text-white shadow-xl">
                📍
              </span>
            </div>
            <span className="mt-2 rounded-xl bg-slate-950/90 px-3 py-1 text-[10px] font-black text-emerald-400 border border-emerald-500/40 backdrop-blur shadow-md">
              {currentAddress}
            </span>
          </div>

          <div className="absolute bottom-2 left-2 rounded-lg bg-slate-950/80 px-2 py-0.5 text-[9px] text-muted-foreground font-mono">
            Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
          </div>
        </div>

        {/* SEARCH ADDRESS INPUT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            SEARCH AREA / CITY
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area (e.g. Koramangala, Indiranagar, HSR Layout...)"
              className="h-11 w-full rounded-2xl border border-border bg-muted/40 pl-10 pr-4 text-xs font-bold outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* POPULAR AREAS LIST */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
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
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:border-emerald-500 hover:bg-emerald-500/10 transition-all shadow-2xs"
                >
                  📍 {area}
                </button>
              ))}
          </div>
        </div>

        {/* SAVED ADDRESSES LIST */}
        <div className="space-y-2 border-t border-border/50 pt-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
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
                  className="w-full flex items-center justify-between rounded-2xl border border-border/70 bg-card p-3 text-left hover:border-emerald-500 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-muted text-muted-foreground group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
                      {addr.label === "HOME" ? "🏠" : "🏢"}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-foreground">{addr.label}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{full}</p>
                    </div>
                  </div>
                  <FiCheck className="size-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>

        {/* CONFIRM LOCATION BUTTON */}
        <button
          type="button"
          onClick={() => handleConfirmLocation(currentAddress)}
          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-black text-white shadow-md hover:scale-[1.01] transition-all"
        >
          Confirm Delivery Location
        </button>
      </div>
    </div>
  );
}
