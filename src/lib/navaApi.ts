/* NAVA mock API — deterministic data + localStorage state. No network calls. */

import {
  CATEGORIES,
  COUPONS,
  PRODUCTS,
  STORES,
  BANNERS,
  RIDE_TYPES,
  PLACES,
  PACKAGE_TYPES,
  COURIER_SPEEDS,
  HOME_SERVICES,
  PROVIDERS,
  DRIVERS,
  FAQS,
  TRENDING_SEARCHES,
  type Category as NavaCategory,
  type Store as NavaStore,
  type Product as NavaProduct,
} from "@/nava/data";
import type {
  Address,
  AddressLabel,
  AppNotification,
  CartItem,
  Category,
  Coupon,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  Profile,
  Store,
  WalletTransaction,
  WalletTxnType,
} from "@/types";
import { navaStore, uuid, buildOrder } from "./navaStore";

function delay(ms = 200) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

function toCategory(c: NavaCategory): Category {
  return {
    id: c.slug,
    slug: c.slug,
    name: c.name,
    icon: c.emoji,
    image_url: null,
    sort_order: CATEGORIES.indexOf(c),
    is_service: c.kind === "service",
  };
}

function toStore(s: NavaStore): Store {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    category_id: s.category,
    description: s.description,
    logo_url: null,
    banner_url: null,
    address_line: `${s.area}, ${s.city}`,
    area: s.area,
    city: s.city,
    pincode: "500000",
    rating: s.rating,
    rating_count: s.ratingCount,
    delivery_minutes: s.deliveryMins,
    delivery_fee: s.deliveryFee,
    min_order: s.minOrder,
    is_open: true,
    tags: s.cuisines ?? [],
  };
}

function toProduct(p: NavaProduct): Product {
  const store = toStore(STORES.find((s) => s.id === p.storeId)!);
  return {
    id: p.id,
    store_id: p.storeId,
    category_id: p.category,
    name: p.name,
    description: p.description,
    image_url: null,
    brand: p.brand,
    unit: p.unit,
    price: p.price,
    mrp: p.mrp,
    stock: p.stock,
    is_available: p.stock > 0,
    is_veg: p.veg,
    rating: p.rating,
    sales: p.ratingCount,
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      delivery_minutes: store.delivery_minutes,
      delivery_fee: store.delivery_fee,
      min_order: store.min_order,
    },
  };
}

function toCoupon(c: (typeof COUPONS)[number]): Coupon {
  return {
    id: c.code,
    code: c.code,
    title: c.title,
    description: `Valid on ${c.category === "all" ? "all orders" : c.category}. Min order ${c.minOrder}.`,
    type: c.type === "percent" ? "PERCENT" : "FIXED",
    value: c.value,
    min_order: c.minOrder,
    max_discount: c.maxDiscount,
    expires_at: new Date(c.expiry).toISOString(),
  };
}

export const navaApi = {
  categories: async (): Promise<Category[]> => {
    await delay();
    return CATEGORIES.map(toCategory);
  },

  stores: async (categorySlug?: string): Promise<Store[]> => {
    await delay();
    let list = STORES.map(toStore);
    if (categorySlug) {
      const slug = categorySlug.toLowerCase();
      if (slug === "shop") {
        const shopSlugs = ["fashion", "electronics", "pharmacy", "pets", "flowers", "hardware", "stationery"];
        list = list.filter((s) => Boolean(s.category_id && shopSlugs.includes(s.category_id)));
      } else if (slug === "food") {
        const foodSlugs = ["food", "grocery", "bakery", "meat", "fruits", "vegetables"];
        list = list.filter((s) => Boolean(s.category_id && foodSlugs.includes(s.category_id)));
      } else {
        list = list.filter(
          (s) =>
            s.category_id === slug ||
            s.tags?.some((t) => t.toLowerCase() === slug)
        );
      }
    }
    return list.sort((a, b) => b.rating - a.rating);
  },

  storeBySlug: async (slug: string): Promise<Store | null> => {
    await delay();
    const s = STORES.find((x) => x.slug === slug);
    return s ? toStore(s) : null;
  },

  storeProducts: async (storeId: string): Promise<Product[]> => {
    await delay();
    return PRODUCTS.filter((p) => p.storeId === storeId).map(toProduct);
  },

  bestsellers: async (limit = 12): Promise<Product[]> => {
    await delay();
    return PRODUCTS.filter((p) => p.stock > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(toProduct);
  },

  productById: async (id: string): Promise<Product | null> => {
    await delay();
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? toProduct(p) : null;
  },

  productsByCategory: async (categorySlug: string): Promise<Product[]> => {
    await delay();
    const slug = categorySlug.toLowerCase();

    if (slug === "shop") {
      const shopSlugs = ["fashion", "electronics", "pharmacy", "pets", "flowers", "hardware", "stationery"];
      return PRODUCTS.filter((p) => shopSlugs.includes(p.category) && p.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .map(toProduct);
    }

    if (slug === "food") {
      const foodSlugs = ["food", "grocery", "bakery", "meat", "fruits", "vegetables"];
      return PRODUCTS.filter((p) => foodSlugs.includes(p.category) && p.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .map(toProduct);
    }

    return PRODUCTS.filter((p) => {
      if (p.stock <= 0) return false;
      const cat = p.category.toLowerCase();
      const sub = p.subcategory.toLowerCase();
      const name = p.name.toLowerCase();

      if (cat === slug) return true;
      if (sub === slug) return true;
      if (slug === "dairy" && (sub.includes("dairy") || name.includes("milk") || name.includes("paneer") || name.includes("curd") || name.includes("cheese") || name.includes("butter"))) return true;
      if (slug === "bakery" && (cat === "bakery" || sub.includes("bakery") || name.includes("bread") || name.includes("cake") || name.includes("biscuit") || name.includes("bun"))) return true;
      if (slug === "restaurants" && cat === "food") return true;
      if (slug === "pets" && cat === "pets") return true;
      return false;
    })
      .sort((a, b) => b.rating - a.rating)
      .map(toProduct);
  },

  search: async (term: string): Promise<{ products: Product[]; stores: Store[] }> => {
    await delay();
    const q = term.trim().toLowerCase();
    if (!q) return { products: [], stores: [] };
    const products = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 30)
      .map(toProduct);
    const stores = STORES.filter((s) => s.name.toLowerCase().includes(q) || s.cuisines?.some((c) => c.toLowerCase().includes(q)))
      .slice(0, 10)
      .map(toStore);
    // update search history
    const history = navaStore.getSearchHistory().filter((h) => h.toLowerCase() !== q);
    navaStore.setSearchHistory([q, ...history].slice(0, 10));
    return { products, stores };
  },

  coupons: async (): Promise<Coupon[]> => {
    await delay();
    return COUPONS.map(toCoupon);
  },

  banners: async () => {
    await delay();
    return BANNERS;
  },

  trendingSearches: async (): Promise<string[]> => {
    await delay();
    return TRENDING_SEARCHES;
  },

  // --- Cart (localStorage) ---
  cart: async (): Promise<CartItem[]> => {
    await delay();
    return navaStore.getCart();
  },

  addToCart: async (productId: string, quantity = 1) => {
    await delay();
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    if (product.stock <= 0) throw new Error("OUT_OF_STOCK:" + product.name);
    const items = navaStore.getCart();
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 20, product.stock);
    } else {
      items.push({
        id: uuid(),
        product_id: productId,
        quantity: Math.min(quantity, product.stock),
        saved_for_later: false,
        product: toProduct(product),
      });
    }
    navaStore.setCart(items);
  },

  setCartQuantity: async (itemId: string, quantity: number) => {
    await delay();
    let items = navaStore.getCart();
    if (quantity <= 0) {
      items = items.filter((i) => i.id !== itemId);
    } else {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = Math.min(quantity, 20, item.product.stock);
      }
    }
    navaStore.setCart(items);
  },

  clearCart: async () => {
    await delay();
    navaStore.setCart([]);
  },

  // --- Addresses ---
  addresses: async (): Promise<Address[]> => {
    await delay();
    return navaStore.getAddresses();
  },

  saveAddress: async (address: Partial<Address> & { city: string; state: string; pincode: string }) => {
    await delay();
    const addresses = navaStore.getAddresses();
    if (address.is_default) {
      addresses.forEach((a) => (a.is_default = false));
    }
    if (address.id) {
      const idx = addresses.findIndex((a) => a.id === address.id);
      if (idx >= 0) {
        addresses[idx] = { ...addresses[idx], ...address } as Address;
        navaStore.setAddresses(addresses);
        return address.id;
      }
    }
    const id = uuid();
    const newAddress: Address = {
      id,
      label: (address.label ?? "OTHER") as AddressLabel,
      contact_name: address.contact_name ?? null,
      contact_phone: address.contact_phone ?? null,
      house: address.house ?? null,
      street: address.street ?? null,
      area: address.area ?? null,
      landmark: address.landmark ?? null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      instructions: address.instructions ?? null,
      is_default: address.is_default ?? false,
    };
    addresses.push(newAddress);
    navaStore.setAddresses(addresses);
    return id;
  },

  deleteAddress: async (id: string) => {
    await delay();
    const addresses = navaStore.getAddresses().filter((a) => a.id !== id);
    navaStore.setAddresses(addresses);
  },

  // --- Orders ---
  orders: async (): Promise<Order[]> => {
    await delay();
    return navaStore.getOrders();
  },

  order: async (id: string): Promise<Order | null> => {
    await delay();
    return navaStore.getOrders().find((o) => o.id === id) ?? null;
  },

  orderTimeline: async (id: string) => {
    await delay();
    const order = navaStore.getOrders().find((o) => o.id === id);
    if (!order) return [];
    const statusMap: Record<OrderStatus, string> = {
      PLACED: "Order placed",
      ACCEPTED: "Store accepted",
      PREPARING: "Preparing your order",
      READY: "Ready for pickup",
      PICKED_UP: "Rider picked up",
      ON_THE_WAY: "On the way",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
    };
    const timeline = [
      { id: "t1", status: "PLACED" as OrderStatus, note: statusMap.PLACED, created_at: order.placed_at },
    ];
    if (order.status !== "PLACED" && order.status !== "CANCELLED") {
      timeline.push({
        id: "t2",
        status: "ACCEPTED",
        note: statusMap.ACCEPTED,
        created_at: new Date(new Date(order.placed_at).getTime() + 2 * 60 * 1000).toISOString(),
      });
    }
    if (order.status === "CANCELLED") {
      timeline.push({
        id: "tc",
        status: "CANCELLED",
        note: order.cancelled_reason ?? "Cancelled by user",
        created_at: new Date().toISOString(),
      });
    }
    return timeline;
  },

  placeOrder: async (input: {
    addressId: string;
    paymentMethod: PaymentMethod;
    couponCode?: string | null;
    tip?: number;
    instructions?: string | null;
  }): Promise<string> => {
    await delay(400);
    const items = navaStore.getCart();
    const active = items.filter((i) => !i.saved_for_later);
    if (active.length === 0) throw new Error("CART_EMPTY");
    const store = active[0]?.product?.store;
    if (!store) throw new Error("STORE_NOT_FOUND");
    const multiStore = active.some((i) => i.product.store?.id !== store.id);
    if (multiStore) throw new Error("MULTI_STORE_CART");
    const addresses = navaStore.getAddresses();
    const address = addresses.find((a) => a.id === input.addressId);
    if (!address) throw new Error("INVALID_ADDRESS");
    const subtotal = active.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const storeFull = await navaApi.storeBySlug(store.slug);
    if (!storeFull) throw new Error("STORE_NOT_FOUND");
    if (subtotal < storeFull.min_order) throw new Error("MIN_ORDER_NOT_MET");

    let discount = 0;
    if (input.couponCode) {
      const coupon = COUPONS.find((c) => c.code === input.couponCode);
      if (!coupon || subtotal < coupon.minOrder) throw new Error("COUPON_INVALID:" + input.couponCode);
      if (coupon.type === "percent") {
        discount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount);
      } else {
        discount = Math.min(coupon.value, subtotal);
      }
    }

    const total = subtotal + storeFull.delivery_fee + 9 + Math.round(subtotal * 0.05) + (input.tip ?? 0) - discount;
    if (input.paymentMethod === "WALLET") {
      const wallet = navaStore.getWallet();
      if (wallet.balance < total) throw new Error("INSUFFICIENT_WALLET_BALANCE");
    }

    const order = buildOrder(items, address, storeFull, {
      paymentMethod: input.paymentMethod,
      couponCode: input.couponCode ?? null,
      tip: input.tip ?? 0,
      instructions: input.instructions ?? null,
    });
    order.discount = discount;
    order.total = total;

    if (input.paymentMethod === "WALLET") {
      const wallet = navaStore.getWallet();
      const after = wallet.balance - total;
      navaStore.setWallet({
        balance: after,
        transactions: [
          {
            id: uuid(),
            type: "DEBIT" as WalletTxnType,
            amount: total,
            balance_after: after,
            label: `Order ${order.code}`,
            created_at: new Date().toISOString(),
          },
          ...wallet.transactions,
        ],
      });
    }

    const orders = navaStore.getOrders();
    orders.unshift(order);
    navaStore.setOrders(orders);
    navaStore.setCart([]);

    // add notification
    const notifications = navaStore.getNotifications();
    notifications.unshift({
      id: uuid(),
      type: "order",
      title: "Order placed",
      message: `Your order ${order.code} from ${store.name} has been placed.`,
      order_id: order.id,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    navaStore.setNotifications(notifications);

    return order.id;
  },

  cancelOrder: async (orderId: string, reason: string) => {
    await delay();
    const orders = navaStore.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (["DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status)) throw new Error("CANCEL_NOT_ALLOWED");
    order.status = "CANCELLED";
    order.cancelled_reason = reason;
    if (order.payment_method !== "COD" && order.payment_status === "PAID") {
      order.payment_status = "REFUNDED";
      const wallet = navaStore.getWallet();
      const after = wallet.balance + order.total;
      navaStore.setWallet({
        balance: after,
        transactions: [
          {
            id: uuid(),
            type: "REFUND" as WalletTxnType,
            amount: order.total,
            balance_after: after,
            label: `Refund for ${order.code}`,
            created_at: new Date().toISOString(),
          },
          ...wallet.transactions,
        ],
      });
    }
    navaStore.setOrders(orders);
  },

  advanceOrder: async (orderId: string) => {
    await delay();
    const orders = navaStore.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    const flow: OrderStatus[] = ["PLACED", "ACCEPTED", "PREPARING", "READY", "PICKED_UP", "ON_THE_WAY", "DELIVERED"];
    const idx = flow.indexOf(order.status);
    if (idx >= 0 && idx < flow.length - 1) {
      order.status = flow[idx + 1]!;
      if (order.status === "PICKED_UP") {
        order.rider_name = "Prakash N.";
        order.rider_phone = "+91 98765 12345";
        order.rider_vehicle = "TS 08 GH 1123";
      }
      if (order.status === "DELIVERED") {
        order.delivered_at = new Date().toISOString();
        // reward points
        const rewards = navaStore.getRewards();
        const points = Math.round(order.total * 0.1);
        navaStore.setRewards({ points: rewards.points + points, redeemed: rewards.redeemed });
      }
    }
    navaStore.setOrders(orders);
  },

  quoteCoupon: async (code: string, subtotal: number) => {
    await delay();
    const coupon = COUPONS.find((c) => c.code === code);
    if (!coupon || subtotal < coupon.minOrder) {
      return { discount: 0, coupon_id: null, message: "Invalid coupon code" };
    }
    const discount =
      coupon.type === "percent"
        ? Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount)
        : Math.min(coupon.value, subtotal);
    return { discount, coupon_id: coupon.code, message: "Coupon applied" };
  },

  // --- Wallet ---
  wallet: async (): Promise<{ balance: number; transactions: WalletTransaction[] }> => {
    await delay();
    return navaStore.getWallet();
  },

  topUpWallet: async (amount: number) => {
    await delay();
    const wallet = navaStore.getWallet();
    const after = wallet.balance + amount;
    navaStore.setWallet({
      balance: after,
      transactions: [
        {
          id: uuid(),
          type: "CREDIT" as WalletTxnType,
          amount,
          balance_after: after,
          label: "Wallet top-up",
          created_at: new Date().toISOString(),
        },
        ...wallet.transactions,
      ],
    });
  },

  // --- Notifications ---
  notifications: async (): Promise<AppNotification[]> => {
    await delay();
    return navaStore.getNotifications();
  },

  markAllRead: async () => {
    await delay();
    const notifications = navaStore.getNotifications().map((n) => ({ ...n, is_read: true }));
    navaStore.setNotifications(notifications);
  },

  // --- Favourites ---
  favourites: async (): Promise<string[]> => {
    await delay();
    return navaStore.getFavourites();
  },

  toggleFavourite: async (storeId: string, on: boolean) => {
    await delay();
    const ids = navaStore.getFavourites();
    const next = on ? Array.from(new Set([...ids, storeId])) : ids.filter((id) => id !== storeId);
    navaStore.setFavourites(next);
  },

  // --- Profile ---
  profile: async (): Promise<Profile | null> => {
    await delay();
    return navaStore.getSession().user;
  },

  updateProfile: async (patch: Partial<Profile>) => {
    await delay();
    const session = navaStore.getSession();
    if (!session.user) throw new Error("AUTH_REQUIRED");
    const next = { ...session.user, ...patch };
    navaStore.setSession(next, session.token);
  },

  // --- Auth ---
  signIn: async (email: string, password: string): Promise<Profile> => {
    await delay(400);
    const session = navaStore.getSession();
    if (!session.user) {
      // create a mock user on first sign-in
      const user: Profile = {
        id: uuid(),
        full_name: email.split("@")[0] ?? "User",
        phone: "+91 98765 00000",
        email,
        avatar_url: null,
        referral_code: "NAVA" + Math.floor(1000 + Math.random() * 9000).toString(),
      };
      navaStore.setSession(user, "mock-token");
      return user;
    }
    return session.user;
  },

  signUp: async (email: string, password: string, name: string): Promise<Profile> => {
    await delay(400);
    const user: Profile = {
      id: uuid(),
      full_name: name,
      phone: "+91 98765 00000",
      email,
      avatar_url: null,
      referral_code: "NAVA" + Math.floor(1000 + Math.random() * 9000).toString(),
    };
    navaStore.setSession(user, "mock-token");
    return user;
  },

  signOut: async () => {
    await delay();
    navaStore.setSession(null, null);
  },

  googleSignIn: async () => {
    await delay(600);
    const user: Profile = {
      id: uuid(),
      full_name: "Google User",
      phone: "+91 98765 00000",
      email: "user@gmail.com",
      avatar_url: null,
      referral_code: "NAVA" + Math.floor(1000 + Math.random() * 9000).toString(),
    };
    navaStore.setSession(user, "mock-token");
    return user;
  },

  // --- Service data ---
  rideTypes: () => RIDE_TYPES,
  places: () => PLACES,
  packageTypes: () => PACKAGE_TYPES,
  courierSpeeds: () => COURIER_SPEEDS,
  homeServices: () => HOME_SERVICES,
  providers: () => PROVIDERS,
  drivers: () => DRIVERS,
  faqs: () => FAQS,
};

export function friendlyError(message: string) {
  if (message.includes("CART_EMPTY")) return "Your cart is empty.";
  if (message.includes("MULTI_STORE_CART")) return "Items from multiple stores need separate orders.";
  if (message.includes("OUT_OF_STOCK")) return `Out of stock: ${message.split(":").pop()}`;
  if (message.includes("MIN_ORDER_NOT_MET")) return "Order value is below the store minimum.";
  if (message.includes("INSUFFICIENT_WALLET_BALANCE")) return "Not enough wallet balance.";
  if (message.includes("COUPON_INVALID")) return message.split(":").pop() ?? "Coupon not valid.";
  if (message.includes("STORE_CLOSED")) return "This store is currently closed.";
  if (message.includes("CANCEL_NOT_ALLOWED")) return "This order can no longer be cancelled.";
  if (message.includes("INVALID_ADDRESS")) return "Please select a valid delivery address.";
  if (message.includes("AUTH_REQUIRED")) return "Please sign in to continue.";
  return message;
}
