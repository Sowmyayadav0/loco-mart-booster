// Local (non-DB) catalogue for the service verticals: rides, courier and home services.
// These power fully interactive booking flows with realistic Indian data.

export interface RideOption {
  id: string;
  name: string;
  desc: string;
  seats: number;
  etaMin: number;
  perKm: number;
  base: number;
  emoji: string;
}

export const RIDE_OPTIONS: RideOption[] = [
  { id: "bike", name: "Bike", desc: "Beat the traffic", seats: 1, etaMin: 2, perKm: 7, base: 20, emoji: "🏍️" },
  { id: "auto", name: "Auto", desc: "Everyday commute", seats: 3, etaMin: 4, perKm: 12, base: 30, emoji: "🛺" },
  { id: "mini", name: "Mini", desc: "Compact AC hatchback", seats: 4, etaMin: 6, perKm: 15, base: 49, emoji: "🚗" },
  { id: "sedan", name: "Sedan", desc: "Extra legroom", seats: 4, etaMin: 7, perKm: 19, base: 69, emoji: "🚙" },
  { id: "suv", name: "SUV", desc: "For groups & luggage", seats: 6, etaMin: 9, perKm: 24, base: 99, emoji: "🚐" },
];

export const SAVED_PLACES = [
  { id: "home", label: "Home", address: "Flat 402, Prestige Elm, Koramangala 5th Block, Bengaluru 560095" },
  { id: "work", label: "Work", address: "Ecospace Business Park, Bellandur, Bengaluru 560103" },
  { id: "gym", label: "Gym", address: "Cult.fit, Indiranagar 100ft Road, Bengaluru 560038" },
];

export const RECENT_PLACES = [
  "Kempegowda International Airport, Devanahalli",
  "Phoenix Mall of Asia, Hebbal",
  "Cubbon Park Metro Station, Sampangi Rama Nagar",
  "Manyata Tech Park, Nagavara",
];

export const DRIVERS = [
  { name: "Ravi Kumar", rating: 4.9, vehicle: "KA 05 HJ 4412", model: "Maruti Swift · White", phone: "+91 98450 11223" },
  { name: "Imran Shaikh", rating: 4.8, vehicle: "KA 03 MN 8890", model: "Bajaj RE · Yellow", phone: "+91 99860 44551" },
  { name: "Sunil Patil", rating: 4.7, vehicle: "KA 51 AB 2210", model: "Hyundai Aura · Silver", phone: "+91 90080 77321" },
];

export interface PackageType {
  id: string;
  name: string;
  desc: string;
  maxKg: number;
  multiplier: number;
  emoji: string;
}

export const PACKAGE_TYPES: PackageType[] = [
  { id: "docs", name: "Documents", desc: "Papers, files, cards", maxKg: 1, multiplier: 1, emoji: "📄" },
  { id: "small", name: "Small parcel", desc: "Shoebox size", maxKg: 3, multiplier: 1.2, emoji: "📦" },
  { id: "medium", name: "Medium parcel", desc: "Carry bag size", maxKg: 8, multiplier: 1.5, emoji: "🧳" },
  { id: "large", name: "Large parcel", desc: "Suitcase size", maxKg: 20, multiplier: 2.1, emoji: "🗄️" },
  { id: "fragile", name: "Fragile", desc: "Glass, electronics", maxKg: 10, multiplier: 1.8, emoji: "🍶" },
  { id: "food", name: "Food", desc: "Insulated handling", maxKg: 5, multiplier: 1.3, emoji: "🍱" },
];

export const COURIER_SPEEDS = [
  { id: "express", name: "Express", desc: "Dedicated rider, direct drop", etaMin: 45, multiplier: 1.6 },
  { id: "standard", name: "Standard", desc: "Same-day delivery", etaMin: 180, multiplier: 1 },
  { id: "saver", name: "Saver", desc: "Batched, next morning", etaMin: 900, multiplier: 0.75 },
];

export interface HomeService {
  id: string;
  name: string;
  category: string;
  from: number;
  rating: number;
  jobs: string;
  duration: string;
  emoji: string;
  about: string;
}

export const HOME_SERVICES: HomeService[] = [
  { id: "electrician", name: "Electrician", category: "Repairs", from: 149, rating: 4.8, jobs: "12k+ jobs", duration: "45–60 min", emoji: "💡", about: "Switchboards, fans, wiring faults and light fittings." },
  { id: "plumber", name: "Plumber", category: "Repairs", from: 169, rating: 4.7, jobs: "9k+ jobs", duration: "45–90 min", emoji: "🚿", about: "Leaking taps, blocked drains, flush tank and pipe fixes." },
  { id: "cleaning", name: "Home cleaning", category: "Cleaning", from: 599, rating: 4.9, jobs: "22k+ jobs", duration: "3–4 hrs", emoji: "🧹", about: "Deep cleaning for kitchen, bathrooms and full apartments." },
  { id: "ac", name: "AC service", category: "Appliances", from: 499, rating: 4.8, jobs: "18k+ jobs", duration: "60–90 min", emoji: "❄️", about: "Jet wash servicing, gas top-up and installation." },
  { id: "appliance", name: "Appliance repair", category: "Appliances", from: 249, rating: 4.6, jobs: "7k+ jobs", duration: "60 min", emoji: "🧺", about: "Washing machine, fridge, microwave and chimney repairs." },
  { id: "beauty", name: "Beauty at home", category: "Wellness", from: 399, rating: 4.9, jobs: "31k+ jobs", duration: "60–120 min", emoji: "💅", about: "Salon-grade facials, waxing, manicure and hair care." },
  { id: "painting", name: "Painting", category: "Home improvement", from: 3999, rating: 4.7, jobs: "3k+ jobs", duration: "1–3 days", emoji: "🎨", about: "Interior repaint with putty, primer and two coats." },
  { id: "pest", name: "Pest control", category: "Home improvement", from: 899, rating: 4.8, jobs: "6k+ jobs", duration: "90 min", emoji: "🐜", about: "Cockroach, termite and mosquito treatment, odourless gel." },
];

export const SERVICE_SLOTS = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

export const PROVIDERS = [
  { id: "p1", name: "Mahesh Reddy", rating: 4.9, jobs: 1420, years: 8 },
  { id: "p2", name: "Anil Verma", rating: 4.8, jobs: 980, years: 6 },
  { id: "p3", name: "Farida Begum", rating: 4.9, jobs: 2110, years: 9 },
];

export function haversineKm(seed: string) {
  // Deterministic pseudo-distance so estimates stay stable per address pair.
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 9973;
  return Math.round((3 + (h % 220) / 10) * 10) / 10;
}

export const FAQS = [
  { q: "How do I track my order?", a: "Open Orders, pick the active order and tap Track. You'll see live status from confirmed to delivered." },
  { q: "When will my refund arrive?", a: "Refunds to LocoMart Wallet are instant. Bank refunds take 3–5 working days." },
  { q: "Can I cancel a ride after booking?", a: "Yes. Cancelling within 2 minutes of driver assignment is free; after that a ₹25 fee applies." },
  { q: "An item is missing from my order", a: "Report it from the order details page within 24 hours and we'll refund the item value instantly." },
  { q: "How do prescription medicines work?", a: "Upload a valid prescription at checkout. Our pharmacist verifies it before dispatch, usually within 15 minutes." },
  { q: "How do I change my delivery address?", a: "Go to Profile → Saved addresses. You can add, edit or set a default address anytime." },
];

export const SUPPORT_TOPICS = [
  "Order issue",
  "Payment issue",
  "Refund",
  "Delivery issue",
  "Missing item",
  "Damaged product",
  "Ride issue",
  "Account issue",
];
