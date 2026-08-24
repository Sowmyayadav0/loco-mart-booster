import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiAward,
  FiBell,
  FiChevronRight,
  FiCreditCard,
  FiGlobe,
  FiHeadphones,
  FiHeart,
  FiLock,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiPocket,
  FiSettings,
  FiShield,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { api } from "@/lib/api";
import { navaStore } from "@/lib/navaStore";
import { signOutFirebase } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Account & Profile — LocoMart Super App" },
      { name: "description", content: "Manage your LocoMart account, saved addresses, wallet, orders and settings." },
      { property: "og:title", content: "Account & Profile — LocoMart" },
      { property: "og:description", content: "Manage orders, wallet, rewards, addresses and security preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
] as const;

function AccountPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const profile = useQuery({ queryKey: ["profile"], queryFn: api.profile });
  const addresses = useQuery({ queryKey: ["addresses"], queryFn: api.addresses });

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [showAddresses, setShowAddresses] = useState(false);

  // Language Picker State
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLangCode, setSelectedLangCode] = useState(() => {
    return navaStore.read<string>("user_language", "en");
  });

  const activeLang = LANGUAGES.find((l) => l.code === selectedLangCode) || LANGUAGES[0];

  function handleSelectLanguage(langCode: string) {
    setSelectedLangCode(langCode);
    navaStore.write("user_language", langCode);
    const chosen = LANGUAGES.find((l) => l.code === langCode);
    toast.success(`App language changed to ${chosen?.name} (${chosen?.native})`);
    setShowLanguageModal(false);
  }

  const user = profile.data;
  const displayName = user?.full_name || "Rohan Sharma";
  const displayPhone = user?.phone || "+91 98765 43210";
  const displayEmail = user?.email || "rohan.sharma@example.com";

  // Logout handler
  async function handleLogout() {
    try {
      await signOutFirebase();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    navaStore.setSession(null, null);
    qc.clear();
    toast.success("Logged out successfully");
    void navigate({ to: "/auth" });
  }

  // Update profile handler
  async function handleSaveProfile() {
    if (!nameInput && !phoneInput) {
      setEditing(false);
      return;
    }
    await api.updateProfile({ full_name: nameInput || displayName, phone: phoneInput || displayPhone });
    qc.invalidateQueries({ queryKey: ["profile"] });
    setEditing(false);
    toast.success("Profile details updated");
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-background pb-20">
      <main className="mx-auto max-w-md md:max-w-xl lg:max-w-2xl space-y-6 px-4 pt-6">
        {/* User Hero Section */}
        <section className="flex flex-col items-center text-center space-y-2">
          {/* User Name & Contact Details */}
          {editing ? (
            <div className="w-full max-w-sm space-y-2 pt-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Full Name"
                className="h-10 w-full rounded-2xl border border-border bg-card px-3 text-center text-sm font-bold outline-none focus:border-cyan-500"
              />
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Phone Number"
                className="h-10 w-full rounded-2xl border border-border bg-card px-3 text-center text-xs font-semibold outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2 justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500 px-4 py-1.5 text-xs font-bold text-white shadow-xs"
                >
                  <FiCheck className="size-3.5" /> Save Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">{displayName}</h1>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(displayName);
                    setPhoneInput(displayPhone);
                    setEditing(true);
                  }}
                  className="p-1 text-muted-foreground hover:text-cyan-600 transition-colors"
                  title="Edit Profile"
                >
                  <FiEdit2 className="size-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">{displayPhone}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">{displayEmail}</p>
            </div>
          )}
        </section>

        {/* 4 Quick Action Cards Grid (2x2 on mobile, 4 columns on tablet/desktop) */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/orders"
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-xs hover:scale-[1.02] hover:shadow-md transition-all group"
          >
            <span className="grid size-11 sm:size-12 place-items-center rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
              <FiPackage className="size-5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">Orders</span>
          </Link>

          <Link
            to="/wallet"
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-xs hover:scale-[1.02] hover:shadow-md transition-all group"
          >
            <span className="grid size-11 sm:size-12 place-items-center rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
              <FiCreditCard className="size-5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">Wallet</span>
          </Link>

          <Link
            to="/rewards"
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-xs hover:scale-[1.02] hover:shadow-md transition-all group"
          >
            <span className="grid size-11 sm:size-12 place-items-center rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <FiAward className="size-5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">Rewards</span>
          </Link>

          <Link
            to="/favourites"
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-xs hover:scale-[1.02] hover:shadow-md transition-all group"
          >
            <span className="grid size-11 sm:size-12 place-items-center rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 mb-2 group-hover:scale-110 transition-transform">
              <FiHeart className="size-5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">Favorites</span>
          </Link>
        </section>

        {/* Settings Navigation List Container */}
        <section className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-xs divide-y divide-border/50">
          {/* Saved Addresses */}
          <div>
            <button
              type="button"
              onClick={() => setShowAddresses(!showAddresses)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-10 place-items-center rounded-2xl bg-muted text-muted-foreground shrink-0">
                  <FiMapPin className="size-4.5" />
                </span>
                <span className="text-xs font-bold text-foreground">Saved Addresses</span>
              </div>
              <FiChevronRight className={`size-4 text-muted-foreground transition-transform ${showAddresses ? "rotate-90" : ""}`} />
            </button>

            {/* Address Drawer List */}
            {showAddresses ? (
              <div className="px-4 pb-4 bg-muted/20 space-y-2">
                {(addresses.data ?? []).length === 0 ? (
                  <p className="text-[11px] text-muted-foreground italic">No addresses saved yet.</p>
                ) : (
                  (addresses.data ?? []).map((addr) => (
                    <div key={addr.id} className="rounded-2xl border border-border bg-card p-3 text-xs flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-foreground">{addr.label}</span>
                        {addr.is_default ? (
                          <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">Default</span>
                        ) : null}
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {addr.house} {addr.street}, {addr.area}, {addr.city} {addr.pincode}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>

          {/* Saved Cards */}
          <Link
            to="/wallet"
            className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-muted text-muted-foreground shrink-0">
                <FiCreditCard className="size-4.5" />
              </span>
              <span className="text-xs font-bold text-foreground">Saved Cards</span>
            </div>
            <FiChevronRight className="size-4 text-muted-foreground" />
          </Link>

          {/* Language Selection */}
          <button
            type="button"
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-muted text-muted-foreground shrink-0">
                <FiGlobe className="size-4.5" />
              </span>
              <span className="text-xs font-bold text-foreground">Language</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <span>{activeLang.flag} {activeLang.name}</span>
              <FiChevronRight className="size-4" />
            </div>
          </button>

          {/* Privacy */}
          <div className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-muted text-muted-foreground shrink-0">
                <FiLock className="size-4.5" />
              </span>
              <span className="text-xs font-bold text-foreground">Privacy</span>
            </div>
            <FiChevronRight className="size-4 text-muted-foreground" />
          </div>

          {/* Security */}
          <div className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-muted text-muted-foreground shrink-0">
                <FiShield className="size-4.5" />
              </span>
              <span className="text-xs font-bold text-foreground">Security</span>
            </div>
            <FiChevronRight className="size-4 text-muted-foreground" />
          </div>

          {/* Support */}
          <div className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-muted text-muted-foreground shrink-0">
                <FiHeadphones className="size-4.5" />
              </span>
              <span className="text-xs font-bold text-foreground">Support</span>
            </div>
            <FiChevronRight className="size-4 text-muted-foreground" />
          </div>

          {/* Settings */}
          <div className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-muted text-muted-foreground shrink-0">
                <FiSettings className="size-4.5" />
              </span>
              <span className="text-xs font-bold text-foreground">Settings</span>
            </div>
            <FiChevronRight className="size-4 text-muted-foreground" />
          </div>

          {/* LOGOUT OPTION (AT THE VERY BOTTOM) */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-destructive/10 text-destructive shrink-0 group-hover:scale-105 transition-transform">
                <FiLogOut className="size-4.5" />
              </span>
              <span className="text-xs font-extrabold text-destructive">Logout</span>
            </div>
            <FiChevronRight className="size-4 text-destructive opacity-70" />
          </button>
        </section>
      </main>

      {/* LANGUAGE SELECTION MODAL */}
      {showLanguageModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-background border border-border p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
                  <FiGlobe className="size-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-foreground">Select App Language</h3>
                  <p className="text-xs text-muted-foreground">Choose your preferred language</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <FiX className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === selectedLangCode;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-black shadow-2xs"
                        : "border-border/70 hover:border-border hover:bg-muted/50 text-foreground font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className="text-xs">{lang.name}</div>
                        <div className="text-[10px] text-muted-foreground">{lang.native}</div>
                      </div>
                    </div>
                    {isSelected ? <FiCheck className="size-4 text-emerald-600 shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
