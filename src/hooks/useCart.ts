import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api, friendlyError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { CartItem } from "@/types";

export function useCart() {
  const { signedIn } = useAuth();
  return useQuery({
    queryKey: ["cart"],
    queryFn: api.cart,
    enabled: signedIn,
    initialData: [] as CartItem[],
  });
}

export function cartTotals(items: CartItem[]) {
  const active = items.filter((i) => !i.saved_for_later);
  const subtotal = active.reduce((sum, i) => sum + Number(i.product?.price ?? 0) * i.quantity, 0);
  const mrpTotal = active.reduce((sum, i) => sum + Number(i.product?.mrp ?? 0) * i.quantity, 0);
  const count = active.reduce((sum, i) => sum + i.quantity, 0);
  const store = active[0]?.product?.store ?? null;
  return { active, subtotal, savings: Math.max(0, mrpTotal - subtotal), count, store };
}

export function useCartActions() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { signedIn } = useAuth();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cart"] });

  const add = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      api.addToCart(productId, quantity ?? 1),
    onSuccess: () => {
      invalidate();
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const setQtyMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.setCartQuantity(itemId, quantity),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const clearMutation = useMutation({
    mutationFn: api.clearCart,
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const addToCart = (productId: string, quantity = 1) => {
    if (!signedIn) {
      toast.info("Sign in to start your order");
      void navigate({ to: "/auth" });
      return;
    }
    add.mutate({ productId, quantity });
  };

  const setQty = (itemId: string, quantity: number) => {
    setQtyMutation.mutate({ itemId, quantity });
  };

  const clearCart = () => {
    clearMutation.mutate();
  };

  const clearCallable = Object.assign(clearCart, clearMutation);

  return {
    addToCart,
    setQty: Object.assign(setQty, setQtyMutation),
    clear: clearCallable,
    clearCart,
    adding: add.isPending,
  };
}

export function useWishlist() {
  const [favs, setFavs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("locomart::favs") || "[]");
    } catch {
      return [];
    }
  });

  const isFav = (id: string) => favs.includes(id);

  const toggleWish = (id: string) => {
    const next = isFav(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    localStorage.setItem("locomart::favs", JSON.stringify(next));
  };

  return { favs, isFav, toggleWish };
}
