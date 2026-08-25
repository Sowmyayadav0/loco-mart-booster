export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "PICKED_UP"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "UPI" | "CARD" | "NETBANKING" | "WALLET" | "COD";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type AddressLabel = "HOME" | "WORK" | "OTHER";
export type WalletTxnType = "CREDIT" | "DEBIT" | "CASHBACK" | "REFUND" | "REFERRAL" | "REWARD";

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_service: boolean;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  address_line: string | null;
  area: string | null;
  city: string;
  pincode: string | null;
  rating: number;
  rating_count: number;
  delivery_minutes: number;
  delivery_fee: number;
  min_order: number;
  is_open: boolean;
  tags: string[];
  offer?: string;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  subcategory?: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  brand: string | null;
  unit: string;
  price: number;
  mrp: number;
  stock: number;
  is_available: boolean;
  is_veg: boolean | null;
  rating: number;
  sales: number;
  store?: Pick<Store, "id" | "name" | "slug" | "delivery_minutes" | "delivery_fee" | "min_order"> | null;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  saved_for_later: boolean;
  product: Product;
}

export interface Address {
  id: string;
  label: AddressLabel;
  contact_name: string | null;
  contact_phone: string | null;
  house: string | null;
  street: string | null;
  area: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  instructions: string | null;
  is_default: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  image_url: string | null;
  unit: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  code: string;
  store_id: string;
  status: OrderStatus;
  address: Record<string, unknown>;
  contact_phone: string | null;
  instructions: string | null;
  coupon_code: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  delivery_fee: number;
  platform_fee: number;
  tip: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  rider_name: string | null;
  rider_phone: string | null;
  rider_vehicle: string | null;
  eta_minutes: number | null;
  placed_at: string;
  delivered_at: string | null;
  cancelled_reason: string | null;
  store?: Pick<Store, "name" | "slug" | "logo_url" | "area"> | null;
  order_items?: OrderItem[];
}

export interface WalletTransaction {
  id: string;
  type: WalletTxnType;
  amount: number;
  balance_after: number;
  label: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  min_order: number;
  max_discount: number | null;
  expires_at: string | null;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  referral_code: string | null;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say" | null;
  dob?: string | null;
  language?: string | null;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    pincode?: string;
  } | null;
}
