/* NAVA localStorage-backed application state. No backend required. */

import type {
  Address,
  AddressLabel,
  AppNotification,
  CartItem,
  Coupon,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  Profile,
  Store,
  WalletTransaction,
  WalletTxnType,
} from "@/types";

const LS_PREFIX = "nava::";

function getKey(key: string) {
  return `${LS_PREFIX}${key}`;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(getKey(key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getKey(key), JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key: getKey(key) }));
  window.dispatchEvent(new CustomEvent("nava-location-change", { detail: { key, value } }));
}

export const navaStore = {
  read,
  write,

  // Auth
  getSession() {
    return read<{ user: Profile | null; token: string | null }>("session", { user: null, token: null });
  },
  setSession(user: Profile | null, token: string | null) {
    write("session", { user, token });
  },

  // Cart
  getCart(): CartItem[] {
    return read<CartItem[]>("cart", []);
  },
  setCart(items: CartItem[]) {
    write("cart", items);
  },

  // Addresses
  getAddresses(): Address[] {
    return read<Address[]>("addresses", [
      {
        id: "addr-1",
        label: "HOME" as AddressLabel,
        contact_name: "Rahul Sharma",
        contact_phone: "+91 98765 43210",
        house: "12-4-85/B",
        street: "Road No. 12",
        area: "Banjara Hills",
        landmark: "Near LV Prasad Eye Institute",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        instructions: "Ring the bell twice",
        is_default: true,
      },
    ]);
  },
  setAddresses(addresses: Address[]) {
    write("addresses", addresses);
  },

  // Orders
  getOrders(): Order[] {
    return read<Order[]>("orders", []);
  },
  setOrders(orders: Order[]) {
    write("orders", orders);
  },

  // Wallet
  getWallet(): { balance: number; transactions: WalletTransaction[] } {
    return read<{ balance: number; transactions: WalletTransaction[] }>("wallet", {
      balance: 250,
      transactions: [
        {
          id: "txn-1",
          type: "CREDIT" as WalletTxnType,
          amount: 250,
          balance_after: 250,
          label: "Welcome bonus",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
      ],
    });
  },
  setWallet(wallet: { balance: number; transactions: WalletTransaction[] }) {
    write("wallet", wallet);
  },

  // Notifications
  getNotifications(): AppNotification[] {
    return read<AppNotification[]>("notifications", [
      {
        id: "ntf-1",
        type: "welcome",
        title: "Welcome to NAVA",
        message: "Your city, delivered in minutes. Explore 18+ services now.",
        order_id: null,
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ]);
  },
  setNotifications(notifications: AppNotification[]) {
    write("notifications", notifications);
  },

  // Favourites
  getFavourites(): string[] {
    return read<string[]>("favourites", []);
  },
  setFavourites(ids: string[]) {
    write("favourites", ids);
  },

  // Search history
  getSearchHistory(): string[] {
    return read<string[]>("searchHistory", []);
  },
  setSearchHistory(history: string[]) {
    write("searchHistory", history);
  },

  // Wishlist
  getWishlist(): string[] {
    return read<string[]>("wishlist", []);
  },
  setWishlist(ids: string[]) {
    write("wishlist", ids);
  },

  // Rewards
  getRewards(): { points: number; redeemed: number } {
    return read<{ points: number; redeemed: number }>("rewards", { points: 1250, redeemed: 0 });
  },
  setRewards(rewards: { points: number; redeemed: number }) {
    write("rewards", rewards);
  },

  // Seen onboarding
  hasOnboarded() {
    return read<boolean>("onboarded", false);
  },
  setOnboarded(value: boolean) {
    write("onboarded", value);
  },

  // Active Delivery Location
  getActiveLocation(): string {
    return read<string>("activeLocation", "Indiranagar, Bengaluru 560038");
  },
  setActiveLocation(location: string) {
    write("activeLocation", location);
  },

  clearAll() {
    if (typeof window === "undefined") return;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(LS_PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  },
};

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function orderCode() {
  return "NAVA" + Math.floor(100000 + Math.random() * 900000).toString();
}

export function buildOrder(
  items: CartItem[],
  address: Address,
  store: Store,
  opts: {
    paymentMethod: PaymentMethod;
    couponCode?: string | null;
    tip?: number;
    instructions?: string | null;
  },
): Order {
  const active = items.filter((i) => !i.saved_for_later);
  const subtotal = active.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const mrpTotal = active.reduce((sum, i) => sum + i.product.mrp * i.quantity, 0);
  const savings = Math.max(0, mrpTotal - subtotal);
  const deliveryFee = store.delivery_fee ?? 0;
  const platformFee = 9;
  const tax = Math.round(subtotal * 0.05);
  const tip = opts.tip ?? 0;
  let discount = 0;
  if (opts.couponCode) {
    // coupon validation is done in the caller; apply flat value if present
    discount = 0;
  }
  const total = Math.max(0, subtotal + deliveryFee + platformFee + tax + tip - discount);
  const orderItems: OrderItem[] = active.map((i) => ({
    id: uuid(),
    name: i.product.name,
    image_url: i.product.image_url ?? null,
    unit: i.product.unit,
    price: i.product.price,
    quantity: i.quantity,
    total: i.product.price * i.quantity,
  }));
  return {
    id: uuid(),
    code: orderCode(),
    store_id: store.id,
    status: "PLACED" as OrderStatus,
    address: address as unknown as Record<string, unknown>,
    contact_phone: address.contact_phone,
    instructions: opts.instructions ?? null,
    coupon_code: opts.couponCode ?? null,
    subtotal,
    discount,
    tax,
    delivery_fee: deliveryFee,
    platform_fee: platformFee,
    tip,
    total,
    payment_method: opts.paymentMethod,
    payment_status: (opts.paymentMethod === "COD" ? "PENDING" : "PAID") as PaymentStatus,
    rider_name: null,
    rider_phone: null,
    rider_vehicle: null,
    eta_minutes: store.delivery_minutes ?? 30,
    placed_at: new Date().toISOString(),
    delivered_at: null,
    cancelled_reason: null,
    store,
    order_items: orderItems,
  };
}
