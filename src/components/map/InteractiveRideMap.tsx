import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiCrosshair, FiMapPin, FiNavigation } from "react-icons/fi";

interface InteractiveRideMapProps {
  pickup: string;
  drop: string;
  stage: string;
  selectedVehicle?: string;
  onPickupChange?: (address: string) => void;
  onDropChange?: (address: string) => void;
}

const geoCache = new Map<string, [number, number]>();

// Known hub coordinates for instant zero-latency lookup
const KNOWN_HUB_COORDS: Record<string, [number, number]> = {
  bhimavaram: [16.5449, 81.5212],
  "narasa agraharam": [16.5449, 81.5212],
  "534201": [16.5449, 81.5212],
  sp: [16.5410, 81.5230],
  street: [16.5420, 81.5240],
  hyderabad: [17.3850, 78.4867],
  vijayawada: [16.5062, 80.6480],
  visakhapatnam: [17.6868, 83.2185],
  koramangala: [12.9352, 77.6245],
  indiranagar: [12.9784, 77.6408],
  "mg road": [12.9756, 77.6066],
  airport: [13.1986, 77.7066],
  whitefield: [12.9698, 77.7500],
  "hsr layout": [12.9121, 77.6446],
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
};

async function geocodeAddressToCoords(addr: string, isDrop = false): Promise<[number, number]> {
  if (!addr || !addr.trim()) {
    return isDrop ? [16.5420, 81.5240] : [16.5449, 81.5212];
  }
  const clean = addr.trim().toLowerCase();

  if (geoCache.has(clean)) {
    return geoCache.get(clean)!;
  }

  // 1. Direct match check
  for (const [key, coords] of Object.entries(KNOWN_HUB_COORDS)) {
    if (clean.includes(key)) {
      geoCache.set(clean, coords);
      return coords;
    }
  }

  // 2. OpenStreetMap Nominatim Geocoding API
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr)}&countrycodes=in&format=json&limit=1`
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        const coords: [number, number] = [lat, lon];
        geoCache.set(clean, coords);
        return coords;
      }
    }
  } catch {
    // Ignore network error
  }

  // 3. Postal Code fallback (e.g. 534201)
  const pinMatch = addr.match(/\b\d{6}\b/);
  if (pinMatch) {
    try {
      const pinRes = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pinMatch[0]}&country=India&format=json&limit=1`
      );
      const pinData = await pinRes.json();
      if (Array.isArray(pinData) && pinData.length > 0) {
        const lat = parseFloat(pinData[0].lat);
        const lon = parseFloat(pinData[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          const coords: [number, number] = [lat, lon];
          geoCache.set(clean, coords);
          return coords;
        }
      }
    } catch {
      // Ignore
    }
  }

  // If address contains 534201 or Bhimavaram or Agraharam
  if (clean.includes("534") || clean.includes("bhimavaram") || clean.includes("agraharam") || clean.includes("sp")) {
    const bhimCoords: [number, number] = isDrop ? [16.5410, 81.5280] : [16.5449, 81.5212];
    geoCache.set(clean, bhimCoords);
    return bhimCoords;
  }

  return isDrop ? [12.9784, 77.6408] : [12.9352, 77.6245];
}

// Generate smooth curved points between two coordinates
function generateCurvedRoute(p1: [number, number], p2: [number, number]): [number, number][] {
  const points: [number, number][] = [];
  const steps = 30;
  const midLat = (p1[0] + p2[0]) / 2 + 0.003;
  const midLng = (p1[1] + p2[1]) / 2 - 0.002;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * midLat + t * t * p2[0];
    const lng = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * midLng + t * t * p2[1];
    points.push([lat, lng]);
  }
  return points;
}

export function InteractiveRideMap({
  pickup,
  drop,
  stage,
  selectedVehicle = "auto",
  onPickupChange,
  onDropChange,
}: InteractiveRideMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeGlowRef = useRef<L.Polyline | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const nearbyMarkersRef = useRef<L.Marker[]>([]);

  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);
  const [mapTargetMode, setMapTargetMode] = useState<"destination" | "pickup">("destination");
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  const hasDrop = Boolean(drop && drop.trim().length > 0);

  // Reverse Geocoding helper function
  async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.residential || "";
        const area = addr.suburb || addr.neighbourhood || addr.village || addr.county || "";
        const city = addr.city || addr.town || addr.municipality || "Bhimavaram";
        const parts = [road, area, city].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : data.display_name;
      }
    } catch {
      // Fallback
    }
    return `Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center initially, will auto-adjust as soon as pickup geocodes
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([16.5449, 81.5212], 14);

    // CartoDB Voyager Map Tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    // CLICK ON MAP TO DETECT & SET LOCATION
    map.on("click", async (e: L.LeafletMouseEvent) => {
      setGeocodingLoading(true);
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);
      setGeocodingLoading(false);

      if (mapTargetMode === "pickup" || !hasDrop) {
        if (onPickupChange) onPickupChange(address);
      } else {
        if (onDropChange) onDropChange(address);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapTargetMode, hasDrop, onPickupChange, onDropChange]);

  // GPS AUTO DETECT BUTTON HANDLER
  function handleDetectCurrentGPS() {
    setGeocodingLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const map = mapInstanceRef.current;
          if (map) {
            map.setView([lat, lng], 15);
          }
          const address = await reverseGeocode(lat, lng);
          setGeocodingLoading(false);
          if (onPickupChange) onPickupChange(address);
        },
        () => {
          setGeocodingLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGeocodingLoading(false);
    }
  }

  // Update Markers, Route & Directions dynamically
  useEffect(() => {
    let isCancelled = false;

    async function updateMapElements() {
      const map = mapInstanceRef.current;
      if (!map) return;

      const pCoords = await geocodeAddressToCoords(pickup, false);
      if (isCancelled) return;

      // 1. Pickup Marker (Green Pin - Draggable)
      const pickupIcon = L.divIcon({
        className: "custom-pickup-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: grab;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(16, 185, 129, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; position: absolute;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #10B981; border: 3px solid white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6); position: relative; z-index: 10;"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng(pCoords);
      } else {
        pickupMarkerRef.current = L.marker(pCoords, { icon: pickupIcon, draggable: true }).addTo(map);

        pickupMarkerRef.current.on("dragend", async (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setGeocodingLoading(true);
          const newAddr = await reverseGeocode(position.lat, position.lng);
          setGeocodingLoading(false);
          if (onPickupChange) onPickupChange(newAddr);
        });
      }

      pickupMarkerRef.current.bindPopup(
        `<div style="font-weight: 800; font-size: 12px; color: #065F46;">📍 Pickup: ${pickup || "Current Location"}<br/><span style="font-size:10px; color:#64748B;">Drag pin to adjust pickup</span></div>`
      );

      // Clear previous layers
      if (dropMarkerRef.current) {
        map.removeLayer(dropMarkerRef.current);
        dropMarkerRef.current = null;
      }
      if (routePolylineRef.current) {
        map.removeLayer(routePolylineRef.current);
        routePolylineRef.current = null;
      }
      if (routeGlowRef.current) {
        map.removeLayer(routeGlowRef.current);
        routeGlowRef.current = null;
      }
      if (vehicleMarkerRef.current) {
        map.removeLayer(vehicleMarkerRef.current);
        vehicleMarkerRef.current = null;
      }

      nearbyMarkersRef.current.forEach((m) => map.removeLayer(m));
      nearbyMarkersRef.current = [];

      // If no destination yet: center map on pickup and draw nearby driver badges around pCoords
      if (!hasDrop) {
        const nearbyOffsets = [
          [0.002, 0.003, "🛵 2 min away"],
          [-0.003, 0.004, "🛺 3 min away"],
          [0.004, -0.002, "🚕 4 min away"],
        ];

        nearbyOffsets.forEach(([dLat, dLng, label]) => {
          const pos: [number, number] = [pCoords[0] + (dLat as number), pCoords[1] + (dLng as number)];
          const vehicleIcon = L.divIcon({
            className: "custom-vehicle-pin",
            html: `<div style="background: rgba(15, 23, 42, 0.9); color: white; border: 1.5px solid #00BCD4; padding: 2px 8px; border-radius: 20px; font-weight: 800; font-size: 10px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">${label}</div>`,
            iconSize: [80, 20],
            iconAnchor: [40, 10],
          });
          const m = L.marker(pos, { icon: vehicleIcon }).addTo(map);
          nearbyMarkersRef.current.push(m);
        });

        map.setView(pCoords, 14);
        setRouteDistance(null);
        setRouteDuration(null);
        return;
      }

      // If Destination IS provided: Geocode Drop address
      const dCoords = await geocodeAddressToCoords(drop, true);
      if (isCancelled) return;

      const dropIcon = L.divIcon({
        className: "custom-drop-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: grab;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(244, 63, 94, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; position: absolute;"></div>
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #F43F5E; border: 3px solid white; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.6); display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: 900; position: relative; z-index: 10;">🏁</div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      dropMarkerRef.current = L.marker(dCoords, { icon: dropIcon, draggable: true }).addTo(map);

      dropMarkerRef.current.on("dragend", async (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setGeocodingLoading(true);
        const newAddr = await reverseGeocode(position.lat, position.lng);
        setGeocodingLoading(false);
        if (onDropChange) onDropChange(newAddr);
      });

      dropMarkerRef.current.bindPopup(
        `<div style="font-weight: 800; font-size: 12px; color: #9F1239;">🏁 Destination: ${drop}<br/><span style="font-size:10px; color:#64748B;">Drag pin to adjust destination</span></div>`
      );

      // Fetch Real OSRM Route between pCoords & dCoords
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pCoords[1]},${pCoords[0]};${dCoords[1]},${dCoords[0]}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (isCancelled) return;
          let routeLatLngs: [number, number][] = [];

          if (data && data.routes && data.routes.length > 0) {
            const r = data.routes[0];
            routeLatLngs = r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            const distKm = (r.distance / 1000).toFixed(1);
            const durationMin = Math.round(r.duration / 60);
            setRouteDistance(`${distKm} km`);
            setRouteDuration(`${durationMin} mins`);
          } else {
            routeLatLngs = generateCurvedRoute(pCoords, dCoords);
            setRouteDistance("4.5 km");
            setRouteDuration("14 mins");
          }

          routeGlowRef.current = L.polyline(routeLatLngs, {
            color: "#00BCD4",
            weight: 8,
            opacity: 0.35,
            lineCap: "round",
          }).addTo(map);

          routePolylineRef.current = L.polyline(routeLatLngs, {
            color: "#0284C7",
            weight: 4,
            opacity: 0.9,
            dashArray: "10, 10",
            lineCap: "round",
          }).addTo(map);

          const vehicleEmoji = selectedVehicle === "bike" ? "🛵" : selectedVehicle === "auto" ? "🛺" : "🚕";
          const midPoint = routeLatLngs[Math.floor(routeLatLngs.length / 2)] || pCoords;

          const movingVehicleIcon = L.divIcon({
            className: "custom-moving-vehicle",
            html: `<div style="background: #020617; border: 2px solid #00BCD4; border-radius: 20px; padding: 3px 10px; color: white; font-weight: 900; font-size: 12px; box-shadow: 0 6px 18px rgba(0,188,212,0.5); display: flex; align-items: center; gap: 4px;">${vehicleEmoji} <span>On Route</span></div>`,
            iconSize: [90, 26],
            iconAnchor: [45, 13],
          });

          vehicleMarkerRef.current = L.marker(midPoint, { icon: movingVehicleIcon }).addTo(map);

          const bounds = L.latLngBounds([pCoords, dCoords]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        })
        .catch(() => {
          if (isCancelled) return;
          const routeLatLngs = generateCurvedRoute(pCoords, dCoords);
          setRouteDistance("4.5 km");
          setRouteDuration("14 mins");

          routeGlowRef.current = L.polyline(routeLatLngs, {
            color: "#00BCD4",
            weight: 8,
            opacity: 0.35,
          }).addTo(map);

          routePolylineRef.current = L.polyline(routeLatLngs, {
            color: "#0284C7",
            weight: 4,
            opacity: 0.9,
            dashArray: "10, 10",
          }).addTo(map);

          const bounds = L.latLngBounds([pCoords, dCoords]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        });
    }

    void updateMapElements();

    return () => {
      isCancelled = true;
    };
  }, [pickup, drop, selectedVehicle, onPickupChange, onDropChange]);

  return (
    <div className="relative h-72 sm:h-84 w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-900 shadow-lg select-none">
      {/* LEAFLET MAP CONTAINER */}
      <div ref={mapContainerRef} className="size-full z-0 cursor-crosshair" />

      {/* TOP RIGHT INTERACTIVE CONTROLS */}
      <div className="absolute top-3 right-12 z-10 flex items-center gap-2">
        {/* GPS DETECT BUTTON */}
        <button
          type="button"
          onClick={handleDetectCurrentGPS}
          disabled={geocodingLoading}
          className="h-8 px-3 rounded-full bg-slate-950/90 text-emerald-400 border border-emerald-500/40 text-xs font-black backdrop-blur flex items-center gap-1.5 shadow-md hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <FiCrosshair className="size-3.5" />
          <span>{geocodingLoading ? "Detecting..." : "GPS Location"}</span>
        </button>
      </div>

      {/* TOP LEFT INTERACTIVE MODE SWITCHER OVERLAY */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md p-1 border border-cyan-400/40 shadow-xl">
        <button
          type="button"
          onClick={() => setMapTargetMode("destination")}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
            mapTargetMode === "destination"
              ? "bg-rose-500 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FiMapPin className="size-3" />
          <span>Set Destination</span>
        </button>

        <button
          type="button"
          onClick={() => setMapTargetMode("pickup")}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
            mapTargetMode === "pickup"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FiNavigation className="size-3" />
          <span>Set Pickup</span>
        </button>
      </div>

      {/* TOP FLOATING OVERLAY: LIVE ROUTE DIRECTIONS SUMMARY */}
      {hasDrop && routeDistance && (
        <div className="absolute top-13 left-3 z-10 flex items-center gap-2 rounded-2xl bg-slate-950/90 backdrop-blur-md px-3.5 py-2 text-white border border-cyan-400/40 shadow-xl">
          <div className="size-2 rounded-full bg-cyan-400 animate-pulse" />
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="text-cyan-300">Directions:</span>
            <span>{routeDistance}</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-400">{routeDuration}</span>
          </div>
        </div>
      )}

      {/* MAP CLICK INSTRUCTION OVERLAY */}
      <div className="absolute bottom-3 right-3 z-10 text-[10px] font-extrabold text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur">
        💡 Tap map or drag pins to set location
      </div>

      {/* BOTTOM FLOATING OVERLAY: NEARBY STATUS BADGE */}
      <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-extrabold text-emerald-400 border border-emerald-500/40 shadow-md">
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>14 Drivers live nearby · Zero Surge</span>
      </div>
    </div>
  );
}
