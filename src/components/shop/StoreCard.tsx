import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiClock, FiStar } from "react-icons/fi";
import type { Store } from "@/types";
import { currency } from "@/utils/format";

export function StoreCard({ store }: { store: Store }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to="/store/$slug"
        params={{ slug: store.slug }}
        className="surface-card hover-lift block overflow-hidden"
      >
        <div className="relative">
          {store.banner_url ? (
            <img
              src={store.banner_url}
              alt={store.name}
              loading="lazy"
              className="h-36 w-full object-cover"
            />
          ) : (
            <div className="h-36 w-full gradient-hero" />
          )}
          <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground">
            {store.is_open ? `${store.delivery_minutes} min delivery` : "Closed now"}
          </span>
        </div>
        <div className="space-y-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{store.name}</h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-bold text-success">
              <FiStar /> {Number(store.rating).toFixed(1)}
            </span>
          </div>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {store.tags?.slice(0, 3).join(" · ") || store.description}
          </p>
          <p className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FiClock /> {store.area ?? store.city}
            </span>
            <span>Min {currency(Number(store.min_order))}</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
