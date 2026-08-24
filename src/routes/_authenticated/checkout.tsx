import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiArrowLeft, FiCheck, FiCreditCard, FiMapPin, FiTag } from "react-icons/fi";
import { api, friendlyError } from "@/lib/api";
import { cartTotals, useCart } from "@/hooks/useCart";
import { currency } from "@/utils/format";
import type { Address, PaymentMethod } from "@/types";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — LocoMart" },
      { name: "description", content: "Confirm your address, apply a coupon and pay for your LocoMart order." },
      { property: "og:title", content: "Checkout — LocoMart" },
      { property: "og:description", content: "Secure checkout for your local delivery order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const PAYMENTS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "UPI", label: "UPI (Google Pay, PhonePe, Paytm)", icon: "⚡" },
  { id: "CARD", label: "Credit / Debit Card", icon: "💳" },
  { id: "WALLET", label: "LocoMart Wallet", icon: "👛" },
  { id: "NETBANKING", label: "Netbanking", icon: "🏦" },
  { id: "COD", label: "Cash on Delivery", icon: "💵" },
];

const emptyAddress = {
  label: "HOME" as const,
  contact_name: "",
  contact_phone: "",
  house: "",
  street: "",
  area: "",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
  is_default: true,
};

function CheckoutPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cart } = useCart();
  const { active, subtotal, store } = cartTotals(cart ?? []);
  const addresses = useQuery({ queryKey: ["addresses"], queryFn: api.addresses });
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: api.wallet });

  const [addressId, setAddressId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyAddress });
  const [payment, setPayment] = useState<PaymentMethod>("UPI");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const [instructions, setInstructions] = useState("");

  const selected = addressId || (addresses.data ?? []).find((a) => a.is_default)?.id || (addresses.data ?? [])[0]?.id || "";

  const saveAddress = useMutation({
    mutationFn: () => api.saveAddress(form as Partial<Address> & { city: string; state: string; pincode: string }),
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      setAddressId(id as string);
      setShowForm(false);
      setForm({ ...emptyAddress });
      toast.success("Address saved");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const applyCoupon = useMutation({
    mutationFn: () => api.quoteCoupon(coupon.trim().toUpperCase(), subtotal),
    onSuccess: (res) => {
      setDiscount(Number(res.discount ?? 0));
      if (Number(res.discount ?? 0) > 0) toast.success(res.message || "Coupon applied");
      else toast.error(res.message || "Coupon not valid");
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const placeOrder = useMutation({
    mutationFn: () =>
      api.placeOrder({
        addressId: selected,
        paymentMethod: payment,
        couponCode: discount > 0 ? coupon.trim().toUpperCase() : null,
        tip,
        instructions: instructions || null,
      }),
    onSuccess: (orderId) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
      void navigate({ to: "/orders/$id", params: { id: orderId } });
    },
    onError: (e: Error) => toast.error(friendlyError(e.message)),
  });

  const deliveryFee = Number(store?.delivery_fee ?? 0);
  const platformFee = 5;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal - discount) + deliveryFee + platformFee + tax + tip;

  if (active.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add items to your cart before proceeding to checkout.</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Return link */}
      <div className="flex items-center justify-between">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <FiArrowLeft /> Back to Cart
        </Link>
        {store ? (
          <span className="text-xs text-muted-foreground">
            Ordering from <b className="text-foreground">{store.name}</b>
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <h1 className="text-2xl font-extrabold">Checkout</h1>

          {/* Delivery Address Section */}
          <section className="surface-card p-5 rounded-3xl">
            <h2 className="flex items-center gap-2 font-bold text-base">
              <FiMapPin className="text-primary" /> Delivery Address
            </h2>
            <div className="mt-3 space-y-2">
              {(addresses.data ?? []).map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-3.5 text-sm transition-colors ${
                    selected === a.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selected === a.id}
                    onChange={() => setAddressId(a.id)}
                    className="mt-1"
                  />
                  <span>
                    <b>{a.label}</b> {a.contact_name ? `(${a.contact_name})` : ""} — {a.house} {a.street}, {a.area}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {a.city}, {a.state} {a.pincode}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {showForm ? (
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 rounded-2xl border border-border bg-muted/20 p-4">
                {(
                  [
                    ["contact_name", "Full Name"],
                    ["contact_phone", "Phone Number"],
                    ["house", "House / Flat No."],
                    ["street", "Street / Landmark"],
                    ["area", "Area / Locality"],
                    ["city", "City"],
                    ["state", "State"],
                    ["pincode", "Pincode"],
                  ] as const
                ).map(([key, label]) => (
                  <input
                    key={key}
                    value={form[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={label}
                    aria-label={label}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                ))}
                <div className="sm:col-span-2 flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => saveAddress.mutate()}
                    disabled={!form.city || !form.state || !form.pincode || !form.house}
                    className="h-10 flex-1 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground disabled:opacity-60"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="h-10 rounded-xl border border-border px-4 text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-3 text-xs font-bold text-primary hover:underline block"
              >
                + Add a New Delivery Address
              </button>
            )}
          </section>

          {/* Payment Method Section */}
          <section className="surface-card p-5 rounded-3xl">
            <h2 className="flex items-center gap-2 font-bold text-base">
              <FiCreditCard className="text-primary" /> Payment Method
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {PAYMENTS.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-2xl border p-3 text-sm transition-colors ${
                    payment === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                  />
                  <span>{p.icon}</span>
                  <span className="font-semibold text-xs sm:text-sm">{p.label}</span>
                </label>
              ))}
            </div>

            {payment === "WALLET" ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/10 p-3 text-xs">
                <span>
                  Wallet balance: <b>{currency(wallet.data?.balance ?? 0)}</b>
                </span>
                <Link to="/wallet" className="font-bold text-primary hover:underline">
                  Top up wallet →
                </Link>
              </div>
            ) : null}
          </section>

          {/* Coupon & Tip */}
          <section className="surface-card space-y-3 p-5 rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Promo Code & Delivery Tip</h2>
              <Link to="/offers" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <FiTag className="size-3" /> View Offers
              </Link>
            </div>

            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter promo code (e.g. LOCO50)"
                aria-label="Promo code"
                className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-xs uppercase outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => applyCoupon.mutate()}
                disabled={!coupon.trim()}
                className="h-10 rounded-xl border border-primary px-4 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Add a delivery rider tip:</p>
              <div className="flex flex-wrap gap-2">
                {[0, 10, 20, 30, 50].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                      tip === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                    }`}
                  >
                    {t === 0 ? "No tip" : currency(t)}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Delivery instructions (e.g. leave at door, call on arrival)"
              aria-label="Delivery instructions"
              rows={2}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-primary"
            />
          </section>
        </div>

        {/* Order Summary Aside */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="surface-card space-y-3 p-5 rounded-3xl">
            <h2 className="font-bold text-base">Order Summary</h2>
            <div className="max-h-48 space-y-2 overflow-y-auto no-scrollbar pr-1">
              {active.map((i) => (
                <div key={i.id} className="flex justify-between text-xs text-muted-foreground">
                  <span className="line-clamp-1 pr-2">
                    {i.quantity} × {i.product?.name}
                  </span>
                  <span className="font-semibold text-foreground">{currency(Number(i.product?.price ?? 0) * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 border-t border-border pt-3 text-xs">
              <Row label="Item Total" value={currency(subtotal)} />
              {discount > 0 ? <Row label="Promo Discount" value={`-${currency(discount)}`} accent /> : null}
              <Row label="Taxes & Charges (5%)" value={currency(tax)} />
              <Row label="Delivery Fee" value={currency(deliveryFee)} />
              <Row label="Platform Fee" value={currency(platformFee)} />
              {tip > 0 ? <Row label="Rider Tip" value={currency(tip)} /> : null}
            </div>

            <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold">
              <span>Total Payable</span>
              <span>{currency(total)}</span>
            </div>

            <button
              type="button"
              onClick={() => placeOrder.mutate()}
              disabled={!selected || placeOrder.isPending}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <FiCheck /> {placeOrder.isPending ? "Placing order…" : `Pay ${currency(total)} & Order`}
            </button>

            {!selected ? (
              <p className="text-center text-xs text-destructive font-medium">Please select a delivery address.</p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-xs">
      <span className={accent ? "text-success font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={accent ? "text-success font-bold" : "text-foreground"}>{value}</span>
    </div>
  );
}
