import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiPlus, FiMinus, FiStar, FiShoppingBag } from "react-icons/fi";
import type { CartItem, Product } from "@/types";
import { currency } from "@/utils/format";
import { useCart, useCartActions } from "@/hooks/useCart";

function useLine(productId: string): CartItem | undefined {
  const { data } = useCart();
  return (data ?? []).find((i) => i.product_id === productId && !i.saved_for_later);
}

export function QuantityStepper({ product }: { product: Product }) {
  const line = useLine(product.id);
  const { addToCart, setQty } = useCartActions();
  const soldOut = !product.is_available || product.stock <= 0;

  if (soldOut) {
    return (
      <span className="inline-flex h-9 items-center rounded-xl bg-slate-700 px-3 text-xs font-semibold text-slate-400">
        Sold out
      </span>
    );
  }

  if (!line) {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => addToCart(product.id)}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 dark:bg-cyan-500/20 px-3.5 text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-300 transition-colors hover:bg-cyan-500 hover:text-white"
      >
        <FiPlus className="size-3.5" /> Add
      </motion.button>
    );
  }

  return (
    <div className="inline-flex h-9 items-center gap-2.5 rounded-xl bg-cyan-500 text-slate-950 px-2.5 shadow-sm font-black">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQty.mutate({ itemId: line.id, quantity: line.quantity - 1 })}
        className="grid size-6 place-items-center rounded-lg hover:bg-black/15 transition-colors cursor-pointer"
      >
        <FiMinus className="size-3 stroke-[2.5]" />
      </button>
      <span className="min-w-4 text-center text-xs sm:text-sm font-black">{line.quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setQty.mutate({ itemId: line.id, quantity: line.quantity + 1 })}
        className="grid size-6 place-items-center rounded-lg hover:bg-black/15 transition-colors cursor-pointer"
      >
        <FiPlus className="size-3 stroke-[2.5]" />
      </button>
    </div>
  );
}

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-4xl">
        <FiShoppingBag className="size-10 text-slate-400 dark:text-slate-600" />
      </div>
    );
  }

  return (
    <div className="aspect-square w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%]" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const off =
    Number(product.mrp) > Number(product.price)
      ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
      : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      className="surface-card hover-lift flex flex-col overflow-hidden group"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="relative block overflow-hidden">
        <ProductImage src={product.image_url} alt={product.name} />
        {off > 0 ? (
          <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-white shadow">
            {off}% OFF
          </span>
        ) : null}
        {product.is_veg ? (
          <span className="absolute right-2 top-2 size-4 rounded-sm border-2 border-success grid place-items-center">
            <span className="size-2 rounded-full bg-success" />
          </span>
        ) : product.is_veg === false ? (
          <span className="absolute right-2 top-2 size-4 rounded-sm border-2 border-destructive grid place-items-center">
            <span className="size-2 rounded-full bg-destructive" />
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-xs font-semibold leading-snug text-foreground hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-[11px] text-muted-foreground">{product.unit}</p>
        {product.rating ? (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <FiStar className="text-warning size-3" /> {Number(product.rating).toFixed(1)}
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-sm font-bold">{currency(Number(product.price))}</p>
            {off > 0 ? (
              <p className="text-[11px] text-muted-foreground line-through">{currency(Number(product.mrp))}</p>
            ) : null}
          </div>
          <QuantityStepper product={product} />
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
