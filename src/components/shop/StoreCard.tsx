import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FiClock, FiStar, FiTruck, FiTag } from "react-icons/fi";
import type { Store } from "@/types";
import { currency } from "@/utils/format";

// Authentic HD photography map for stores
const STORE_ACCURATE_BANNERS: Record<string, string> = {
  "bawarchi restaurant": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  "sri kanya restaurant": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
  "pista house": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "deccan spice house": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "chaitanya food court": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  "leon's burgers & wings": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  "la pino'z pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  "santosh dhaba exclusive": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  "the thick shake factory": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
  "tandoor junction": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "green leaf meals": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  "wok & roll": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
  "slice society": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  "sweet karma": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
};

const STORE_ACCURATE_LOGOS: Record<string, string> = {
  "bawarchi restaurant": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
  "sri kanya restaurant": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80",
  "pista house": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=200&q=80",
  "deccan spice house": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80",
  "chaitanya food court": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=200&q=80",
  "leon's burgers & wings": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80",
  "la pino'z pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80",
  "santosh dhaba exclusive": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=200&q=80",
};

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  food: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
  pharmacy: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80",
};

export function StoreCard({ store }: { store: Store }) {
  const [imgError, setImgError] = useState(false);

  const nameKey = store.name.toLowerCase().trim();
  
  // Resolve authentic banner image (with fallback to dictionary if picsum is stored)
  let bannerUrl = store.banner_url;
  if (!bannerUrl || bannerUrl.includes("picsum.photos") || imgError) {
    bannerUrl = STORE_ACCURATE_BANNERS[nameKey] || CATEGORY_DEFAULT_IMAGES[store.category_id || "food"] || CATEGORY_DEFAULT_IMAGES["food"]!;
  }

  return (
    <div className="transform-gpu transition-all duration-200 hover:-translate-y-1.5 active:scale-[0.98]">
      <Link
        to="/store/$slug"
        params={{ slug: store.slug }}
        className="group block overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 select-none"
      >
        {/* HERO RESTAURANT PHOTO */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-800">
          <img
            src={bannerUrl}
            alt={store.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="size-full object-cover group-hover:scale-108 transition-transform duration-500"
          />

          {/* Top & Bottom Specular Gradients for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Delivery Time Pill (Top Left) */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black text-white border border-white/20 shadow-md">
            <FiClock className="size-3 text-cyan-400" />
            <span>{store.is_open ? `${store.delivery_minutes} mins` : "Closed"}</span>
          </div>

          {/* Rating Pill (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-black text-white shadow-md shadow-emerald-600/30">
            <FiStar className="size-3 fill-current" />
            <span>{Number(store.rating || 4.2).toFixed(1)}</span>
          </div>

          {/* Discount / Offer Tag Overlay (Bottom Left) */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1.5 bg-orange-500/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black tracking-wide border border-white/20 shadow-sm truncate">
              <FiTag className="size-3 shrink-0" />
              <span className="truncate">{store.offer || "FLAT 50% OFF up to ₹100"}</span>
            </div>
          </div>
        </div>

        {/* RESTAURANT DETAILS BODY */}
        <div className="p-4 sm:p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight group-hover:text-cyan-500 transition-colors">
              {store.name}
            </h3>
          </div>

          <p className="line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {store.tags && store.tags.length > 0 ? store.tags.join(" • ") : "Hyderabadi • Biryani • Mughlai"}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <FiTruck className="size-3 text-cyan-500" />
              <span>{store.delivery_fee === 0 ? "Free Delivery" : `₹${store.delivery_fee} delivery`}</span>
            </span>
            <span>Min order {currency(Number(store.min_order || 0))}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
