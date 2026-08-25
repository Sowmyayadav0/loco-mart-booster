import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiMinus,
  FiPlus,
  FiShield,
  FiTag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { currency } from "@/utils/format";
import type { FoodDish } from "./bhimavaramFoodData";

export interface FoodCartItem {
  id: string;
  dish: FoodDish;
  qty: number;
  spice: string;
  portion: string;
  addOns: string[];
  notes: string;
}

interface SmartFoodCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: FoodCartItem[];
  onUpdateQty: (itemId: string, newQty: number) => void;
  onCheckout: () => void;
}

export function SmartFoodCartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onCheckout,
}: SmartFoodCartDrawerProps) {
  const [deliveryInstruction, setDeliveryInstruction] = useState("Leave at door");
  const [couponCode, setCouponCode] = useState("BHIMAVARAM100");
  const [couponApplied, setCouponApplied] = useState(true);

  const subtotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.qty, 0);
  const deliveryFee = subtotal > 300 ? 0 : 25;
  const platformFee = 5;
  const taxes = Math.round(subtotal * 0.05);
  const discount = couponApplied && subtotal > 150 ? Math.min(100, Math.round(subtotal * 0.2)) : 0;
  const total = Math.max(0, subtotal + deliveryFee + platformFee + taxes - discount);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
          >
            {/* HEADER */}
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 text-lg font-bold">
                  🛒
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    Your Food Order ({cartItems.length} items)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Delivering to Narasa Agraharam, Bhimavaram
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                <FiX className="size-4.5" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <span className="text-4xl">🍽️</span>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-300">
                    Your cart is hungry!
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore delicious Biryanis, Dosas, and Andhra curries from Bhimavaram's top kitchens.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 cursor-pointer shadow-md"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* DELIVERY ETA INTELLIGENCE */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-black text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <FiClock className="size-4 text-emerald-600 shrink-0" />
                      <span>Arrives by 8:12 PM</span>
                    </div>
                    <span className="text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded-md">
                      94% High Confidence
                    </span>
                  </div>

                  {/* CART ITEMS LIST */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Order Items
                    </span>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`size-2.5 rounded-full ${
                                item.dish.veg ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            <h4 className="font-black text-slate-900 dark:text-white leading-tight">
                              {item.dish.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                            {item.dish.restaurantName} · {item.spice}
                          </p>
                          {item.addOns.length > 0 && (
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              + {item.addOns.join(", ")}
                            </p>
                          )}
                          <div className="font-black text-slate-900 dark:text-white pt-0.5">
                            {currency(item.dish.price * item.qty)}
                          </div>
                        </div>

                        {/* QTY CONTROLLER */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1 rounded-xl shrink-0">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.qty - 1)}
                            className="size-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                          >
                            <FiMinus className="size-3.5" />
                          </button>
                          <span className="w-4 text-center font-black text-slate-900 dark:text-white">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.qty + 1)}
                            className="size-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                          >
                            <FiPlus className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PROMO CODE BOX */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-black text-emerald-800 dark:text-emerald-300">
                      <FiTag className="size-4 text-emerald-600" />
                      <span>PROMO 'BHIMAVARAM100' APPLIED</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCouponApplied(!couponApplied)}
                      className="font-black text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
                    >
                      {couponApplied ? "Remove" : "Apply"}
                    </button>
                  </div>

                  {/* TRANSPARENT BILL BREAKDOWN */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Bill Summary (Zero Hidden Fees)
                    </span>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Item Total</span>
                      <span className="font-bold text-slate-900 dark:text-white">{currency(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Delivery Partner Fee</span>
                      <span>{deliveryFee === 0 ? <b className="text-emerald-600">FREE</b> : currency(deliveryFee)}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Platform Fee</span>
                      <span>{currency(platformFee)}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>GST & Restaurant Taxes (5%)</span>
                      <span>{currency(taxes)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Best Offer Savings</span>
                        <span>- {currency(discount)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                      <span>To Pay</span>
                      <span className="text-base text-emerald-600 dark:text-emerald-400">{currency(total)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* CHECKOUT FOOTER */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onCheckout();
                    onClose();
                  }}
                  className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-between px-5 cursor-pointer"
                >
                  <div className="text-left">
                    <span className="block text-[11px] opacity-80 uppercase tracking-wider font-bold">
                      Pay via UPI / GPay
                    </span>
                    <span>{currency(total)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Place Order</span>
                    <FiArrowRight className="size-4.5" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
