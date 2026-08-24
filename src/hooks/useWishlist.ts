import { useCallback, useEffect, useState } from "react";

const KEY = "nava-wishlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const onChange = () => setIds(read());
    window.addEventListener("nava-wishlist", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("nava-wishlist", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("nava-wishlist"));
  }, []);

  const remove = useCallback((id: string) => {
    const current = read();
    window.localStorage.setItem(KEY, JSON.stringify(current.filter((x) => x !== id)));
    window.dispatchEvent(new Event("nava-wishlist"));
  }, []);

  return { ids, toggle, remove, has: (id: string) => ids.includes(id) };
}
