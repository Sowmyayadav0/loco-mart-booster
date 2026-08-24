import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiPlus, FiMinus, FiStar } from "react-icons/fi";
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
      <span className="inline-flex h-9 items-center rounded-xl bg-muted px-3 text-xs font-semibold text-muted-foreground">
        Sold out
      </span>
    );
  }

  if (!line) {
    return (
      <button
        type="button"
        onClick={() => addToCart(product.id)}
        className="inline-flex h-9 items-center gap-1 rounded-xl border border-primary bg-primary/10 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <FiPlus /> Add
      </button>
    );
  }

  return (
    <div className="inline-flex h-9 items-center gap-3 rounded-xl bg-primary px-2 text-primary-foreground">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQty.mutate({ itemId: line.id, quantity: line.quantity - 1 })}
        className="grid size-6 place-items-center rounded-lg hover:bg-black/10"
      >
        <FiMinus />
      </button>
      <span className="min-w-4 text-center text-sm font-bold">{line.quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setQty.mutate({ itemId: line.id, quantity: line.quantity + 1 })}
        className="grid size-6 place-items-center rounded-lg hover:bg-black/10"
      >
        <FiPlus />
      </button>
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
      className="surface-card hover-lift flex flex-col overflow-hidden"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="relative block">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="aspect-square w-full bg-muted" />
        )}
        {off > 0 ? (
          <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-bold text-destructive-foreground">
            {off}% OFF
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.unit}</p>
        {product.rating ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <FiStar className="text-warning" /> {Number(product.rating).toFixed(1)}
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-sm font-bold">{currency(Number(product.price))}</p>
            {off > 0 ? (
              <p className="text-xs text-muted-foreground line-through">{currency(Number(product.mrp))}</p>
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
