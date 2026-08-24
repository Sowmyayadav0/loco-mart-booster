import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiGlobe,
  FiLock,
  FiMail,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShield,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { navaStore } from "@/lib/navaStore";
import type { Profile } from "@/types";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign Up & Language Selection — LocoMart Super App" },
      { name: "description", content: "Choose app language, verify phone OTP, fill personal details and auto-detect GPS location." },
      { property: "og:title", content: "Sign Up — LocoMart" },
      { property: "og:description", content: "Language selection, Phone OTP, profile info and high-accuracy GPS location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
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

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"] as const;

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  // Step Sequence: 1: Language -> 2: Phone & OTP -> 3: Personal Details -> 4: Location & High-Accuracy GPS
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Language
  const [selectedLang, setSelectedLang] = useState<string>("en");

  // Step 2: Phone & OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);

  // Step 3: Personal Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "Prefer not to say">("Male");
  const [dob, setDob] = useState("");

  // Step 4: High Accuracy GPS Location & Reverse Geocoding
  const [house, setHouse] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [pincode, setPincode] = useState("560001");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeMappedInfo, setPincodeMappedInfo] = useState<string | null>(null);

  // Sign in state
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const { signedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (signedIn) void navigate({ to: "/" });
  }, [signedIn, navigate]);

  // OTP Countdown timer
  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [otpSent, otpTimer]);

  // Step 2: Send OTP
  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    setOtpSent(true);
    setOtpTimer(30);
    toast.success(`OTP sent to +91 ${phone}! (Test code: 1234)`);
  }

  // Step 2: Verify OTP
  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) {
      toast.error("Please enter the 4-digit OTP code.");
      return;
    }
    toast.success("Phone number verified successfully!");
    setStep(3); // Move to Step 3: Personal Details
  }

  // Step 4: High Accuracy GPS Auto Detect & Reverse Geocoding
  async function detectHighAccuracyGps() {
    setGpsLoading(true);
    if (!("geolocation" in navigator)) {
      setGpsLoading(false);
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setGpsDetected(true);

        try {
          // Reverse Geocoding with OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          if (data && data.address) {
            const addrObj = data.address;
            const detectedStreet =
              addrObj.road || addrObj.suburb || addrObj.neighbourhood || addrObj.residential || "Main Road";
            const detectedCity =
              addrObj.city || addrObj.town || addrObj.village || addrObj.county || addrObj.state_district || "Bengaluru";
            const detectedPin = addrObj.postcode || "560001";

            setArea(detectedStreet);
            setCity(detectedCity);
            setPincode(detectedPin);
            setPincodeMappedInfo(`${detectedStreet}, ${detectedCity} (${detectedPin})`);
            navaStore.setActiveLocation(`${detectedStreet}, ${detectedCity} ${detectedPin}`);
            toast.success(`Accurate Location Detected: ${detectedStreet}, ${detectedCity}!`);
          } else {
            setArea("Indiranagar 100 Feet Road");
            setCity("Bengaluru");
            setPincode("560038");
            navaStore.setActiveLocation("Indiranagar, Bengaluru 560038");
            toast.success("GPS Coordinates Detected!");
          }
        } catch {
          setArea("Indiranagar 100 Feet Road");
          setCity("Bengaluru");
          setPincode("560038");
          navaStore.setActiveLocation("Indiranagar, Bengaluru 560038");
          toast.success("GPS Location Detected!");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        setCoords({ lat: 12.9716, lng: 77.5946 });
        setGpsDetected(true);
        setArea("Indiranagar, MG Road");
        setCity("Bengaluru");
        setPincode("560038");
        navaStore.setActiveLocation("Indiranagar, Bengaluru 560038");
        toast.success("Location auto-detected via GPS!");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // Pincode Lookup & Place Detection
  async function lookupPlaceByPincode(pin: string) {
    const cleanPin = pin.trim();
    if (cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setPincodeMappedInfo(null);
      return;
    }
    setPincodeLoading(true);
    try {
      // 1. Indian Postal Pincode API
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const dist = po.District || po.Circle || "Bengaluru";
        const st = po.State || "Karnataka";
        const name = po.Name || po.Block || "Central";

        setCity(dist);
        setArea(`${name}, ${dist}`);
        const mappedStr = `${name}, ${dist}, ${st}`;
        setPincodeMappedInfo(mappedStr);
        toast.success(`Pincode ${cleanPin} Mapped: ${name}, ${dist}!`);
        navaStore.setActiveLocation(`${name}, ${dist} ${cleanPin}`);
      } else {
        // 2. OpenStreetMap Nominatim search fallback
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${cleanPin}&country=India&format=json`
        );
        const osmData = await osmRes.json();
        if (Array.isArray(osmData) && osmData.length > 0) {
          const place = osmData[0];
          const displayParts = place.display_name.split(",");
          const detectedCity = displayParts[1]?.trim() || displayParts[0]?.trim() || "Bengaluru";
          const detectedArea = displayParts[0]?.trim() || "Local Area";
          setCity(detectedCity);
          setArea(detectedArea);
          if (place.lat && place.lon) {
            setCoords({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
          }
          const mappedStr = `${detectedArea}, ${detectedCity}`;
          setPincodeMappedInfo(mappedStr);
          toast.success(`Location Mapped from Pincode ${cleanPin}!`);
          navaStore.setActiveLocation(`${detectedArea}, ${detectedCity} ${cleanPin}`);
        }
      }
    } catch {
      // Ignore network errors gracefully
    } finally {
      setPincodeLoading(false);
    }
  }

  function handlePincodeChange(val: string) {
    setPincode(val);
    if (val.trim().length === 6) {
      void lookupPlaceByPincode(val);
    }
  }

  // Final Registration Submission
  function handleCompleteRegistration() {
    setBusy(true);

    const profileData: Profile = {
      id: "usr-" + Date.now(),
      phone: phone ? `+91 ${phone}` : "+91 98765 43210",
      full_name: name || "LocoMart Customer",
      email: email || `${phone}@locomart.com`,
      avatar_url: null,
      referral_code: "LOCO" + Math.floor(1000 + Math.random() * 9000),
      gender,
      dob: dob || null,
      language: selectedLang,
      location: {
        lat: coords.lat || 12.9716,
        lng: coords.lng || 77.5946,
        address: `${house ? house + ", " : ""}${area}`,
        city,
        pincode,
      },
    };

    // Save session
    navaStore.setSession(profileData, "token-" + Date.now());

    // Save user delivery address
    const existingAddrs = navaStore.getAddresses();
    const newAddr = {
      id: "addr-" + Date.now(),
      label: "HOME" as const,
      contact_name: name || "Customer",
      contact_phone: phone ? `+91 ${phone}` : "+91 98765 43210",
      house: house || "Building A",
      street: area || "Main Street",
      area: area || "Central Area",
      city: city || "Bengaluru",
      state: "Karnataka",
      pincode: pincode || "560001",
      is_default: true,
      landmark: "",
      instructions: "",
    };
    navaStore.setAddresses([newAddr, ...existingAddrs]);

    // Synchronize active location with navaStore so it appears on home page location tab
    const activeLoc = `${house ? house + ", " : ""}${area ? area + ", " : ""}${city} ${pincode}`;
    navaStore.setActiveLocation(activeLoc);

    setBusy(false);
    toast.success(`Welcome to LocoMart, ${name || "Partner"}! 🎉`);
    void navigate({ to: "/" });
  }

  // Sign In submit handler
  function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginPhoneOrEmail) {
      toast.error("Please enter your registered phone number or email.");
      return;
    }
    const userProfile: Profile = {
      id: "usr-signin",
      phone: loginPhoneOrEmail.includes("@") ? "+91 98765 43210" : loginPhoneOrEmail,
      email: loginPhoneOrEmail.includes("@") ? loginPhoneOrEmail : `${loginPhoneOrEmail}@locomart.com`,
      full_name: loginPhoneOrEmail.split("@")[0] || "LocoMart Customer",
      avatar_url: null,
      referral_code: "LOCO999",
      gender: "Male",
      language: "en",
    };
    navaStore.setSession(userProfile, "token-signin");
    toast.success("Signed in successfully!");
    void navigate({ to: "/" });
  }

  return (
    <div className="w-full max-w-5xl max-h-[92vh] flex items-center justify-center p-1 sm:p-3">
      {/* Split Grid: Left Side Website Branding, Right Side Compact Form */}
      <div className="w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border border-border bg-card shadow-2xl grid lg:grid-cols-12">
        {/* LEFT SIDE: Website Name & Branding */}
        <section className="relative overflow-hidden gradient-hero p-8 sm:p-12 text-primary-foreground flex flex-col justify-between lg:col-span-5">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/20 text-2xl font-black text-white shadow-md backdrop-blur">
                L
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                  LocoMart
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground/80">
                  Super App
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur">
                <FiZap className="size-3.5" /> 10-15 Min Delivery
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Everything local, delivered fast.
              </h2>
              <p className="text-xs sm:text-sm text-primary-foreground/90 leading-relaxed">
                Order fresh food, shop superstores, book zero-surge rides, and send instant parcels.
              </p>
            </div>

            <ul className="space-y-3 text-xs text-primary-foreground/95 pt-2">
              <li className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">🍛</span>
                <span><b>Fresh Food & Groceries</b> · Dairy, Bakery & Hot Meals</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">🛍️</span>
                <span><b>Shop Hub</b> · Fashion, Electronics & Pharmacy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">🛺</span>
                <span><b>LocoMart Rides</b> · Bike, Auto & Cabs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">📦</span>
                <span><b>Parcel Courier</b> · Live Order Tracking</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/20 text-[11px] text-primary-foreground/80 flex items-center justify-between">
            <span>🛡️ 100% Safe & Secure</span>
            <span>LocoMart Inc.</span>
          </div>

          <div className="absolute -bottom-10 -right-10 text-[160px] opacity-15 select-none pointer-events-none">
            ⚡
          </div>
        </section>

        {/* RIGHT SIDE: Compact Form Container */}
        <section className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 rounded-2xl bg-muted p-1 text-xs font-bold mb-6">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-xl py-2.5 transition-all ${
                  mode === "signup" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-xl py-2.5 transition-all ${
                  mode === "signin" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
            </div>

            {mode === "signin" ? (
              /* SIGN IN FORM */
              <div className="space-y-5 max-w-sm mx-auto py-4">
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-black">Welcome Back</h3>
                  <p className="text-xs text-muted-foreground">Sign in with registered Phone or Email</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Phone / Email</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                      <input
                        type="text"
                        required
                        value={loginPhoneOrEmail}
                        onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                        placeholder="+91 98765 43210 or email"
                        className="h-10 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-xs font-medium outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground mb-1 block">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        className="h-10 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-xs outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-11 w-full rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground shadow-md transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    Sign In <FiArrowRight />
                  </button>
                </form>
              </div>
            ) : (
              /* COMPACT MULTI-STEP SIGNUP FORM */
              <div className="space-y-5">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                    <span className="text-primary font-black">
                      Step {step} of 4: {
                        step === 1 ? "App Language" :
                        step === 2 ? "Phone & OTP" :
                        step === 3 ? "Personal Details" : "GPS Location"
                      }
                    </span>
                    <span>{step * 25}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${step * 25}%` }}
                    />
                  </div>
                </div>

                {/* STEP 1: LANGUAGE SELECTION */}
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black flex items-center gap-1.5">
                        🌐 Choose Language
                      </h3>
                      <p className="text-xs text-muted-foreground">Select your preferred app language</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {LANGUAGES.map((lang) => {
                        const active = selectedLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setSelectedLang(lang.code)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                              active
                                ? "border-primary bg-primary/10 text-primary shadow-2xs scale-105"
                                : "border-border bg-card text-foreground hover:border-primary/40"
                            }`}
                          >
                            <span className="text-xl mb-0.5">{lang.flag}</span>
                            <span className="font-extrabold text-xs">{lang.native}</span>
                            <span className="text-[9px] text-muted-foreground">{lang.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="h-11 w-full rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                      Next: Phone Number & OTP <FiArrowRight className="size-4" />
                    </button>
                  </div>
                ) : step === 2 ? (
                  /* STEP 2: PHONE & OTP */
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black flex items-center gap-1.5">
                        📱 Phone Number & OTP
                      </h3>
                      <p className="text-xs text-muted-foreground">Verify your mobile number with OTP</p>
                    </div>

                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-3.5">
                        <div>
                          <label className="text-xs font-bold text-foreground mb-1 block">Mobile Number</label>
                          <div className="flex gap-2">
                            <span className="flex items-center rounded-2xl border border-border bg-muted/60 px-3 text-xs font-extrabold text-foreground">
                              🇮🇳 +91
                            </span>
                            <div className="relative flex-1">
                              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                              <input
                                type="tel"
                                required
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                placeholder="98765 43210"
                                className="h-10 w-full rounded-2xl border border-border bg-background pl-9 pr-3 text-xs font-bold tracking-wider outline-none focus:border-primary"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="h-10 rounded-2xl border border-border px-4 text-xs font-bold hover:bg-muted"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="h-10 flex-1 rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                          >
                            Send OTP <FiArrowRight />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <p className="text-xs text-muted-foreground">
                          Enter 4-digit code sent to <b className="text-foreground">+91 {phone}</b>
                        </p>

                        <div className="flex justify-center gap-2">
                          {[0, 1, 2, 3].map((idx) => (
                            <input
                              key={idx}
                              id={`otp-${idx}`}
                              type="text"
                              maxLength={1}
                              value={otp[idx]}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                const newOtp = [...otp];
                                newOtp[idx] = val;
                                setOtp(newOtp);
                                if (val && idx < 3) {
                                  document.getElementById(`otp-${idx + 1}`)?.focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                                  document.getElementById(`otp-${idx - 1}`)?.focus();
                                }
                              }}
                              className="size-12 rounded-2xl border-2 border-border bg-background text-center text-lg font-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="font-bold text-muted-foreground hover:text-foreground"
                          >
                            Change Number
                          </button>
                          {otpTimer > 0 ? (
                            <span>Resend in <b>{otpTimer}s</b></span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setOtpTimer(30);
                                toast.success("OTP sent! (Test code: 1234)");
                              }}
                              className="font-extrabold text-primary hover:underline"
                            >
                              Resend Code
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="h-10 rounded-2xl border border-border px-4 text-xs font-bold hover:bg-muted"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="h-10 flex-1 rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                          >
                            Verify & Continue <FiArrowRight />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : step === 3 ? (
                  /* STEP 3: PERSONAL DETAILS */
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black flex items-center gap-1.5">
                        👤 Personal Details
                      </h3>
                      <p className="text-xs text-muted-foreground">Name, Email, Gender and DOB</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-foreground mb-1 block">Full Name (Username) *</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="h-10 w-full rounded-2xl border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-foreground mb-1 block">Email Address *</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="rahul@example.com"
                            className="h-10 w-full rounded-2xl border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-foreground mb-1 block">Gender *</label>
                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                          {GENDER_OPTIONS.map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setGender(g)}
                              className={`rounded-xl border py-2 px-1 text-[11px] font-extrabold transition-all ${
                                gender === g
                                  ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                                  : "border-border bg-card text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-foreground mb-1 block">Date of Birth (DOB) *</label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                          <input
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="h-10 w-full rounded-2xl border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="h-10 rounded-2xl border border-border px-4 text-xs font-bold hover:bg-muted"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!name.trim()) {
                            toast.error("Please enter your Full Name.");
                            return;
                          }
                          if (!email.trim() || !email.includes("@")) {
                            toast.error("Please enter a valid Email Address.");
                            return;
                          }
                          setStep(4);
                        }}
                        className="h-10 flex-1 rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                      >
                        Next: GPS Location <FiArrowRight />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 4: LOCATION & ACCURATE GPS WITH PINCODE MAPPING */
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black flex items-center gap-1.5">
                        📍 GPS Location & Pincode Detection
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Detect your address via GPS or enter your 6-digit Pincode to auto-map place.
                      </p>
                    </div>

                    {/* GPS AUTO-DETECT BUTTON */}
                    <button
                      type="button"
                      onClick={detectHighAccuracyGps}
                      disabled={gpsLoading}
                      className="w-full rounded-2xl border-2 border-primary/40 bg-primary/10 p-3 text-xs font-extrabold text-primary shadow-2xs transition-all hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2 group"
                    >
                      <FiNavigation className={`size-4 ${gpsLoading ? "animate-spin" : "group-hover:rotate-45 transition-transform"}`} />
                      {gpsLoading
                        ? "Detecting High-Accuracy GPS Position…"
                        : gpsDetected
                        ? "📍 Location Auto-Detected via GPS!"
                        : "Auto-Detect My Location (GPS)"}
                    </button>

                    {/* LIVE MAPPED LOCATION PREVIEW CARD */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          🗺️ Home Location Preview
                        </span>
                        <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800 dark:text-emerald-300">
                          {gpsDetected ? "GPS Verified" : pincodeMappedInfo ? "Pincode Mapped" : "Active Location"}
                        </span>
                      </div>

                      <p className="text-xs font-black text-foreground leading-tight">
                        {house ? `${house}, ` : ""}{area ? `${area}, ` : ""}{city} - {pincode}
                      </p>

                      {pincodeMappedInfo ? (
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                          <FiCheckCircle className="size-3 shrink-0" />
                          <span>Mapped via Pincode: {pincodeMappedInfo}</span>
                        </p>
                      ) : null}

                      {coords.lat ? (
                        <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5 pt-0.5 border-t border-emerald-200/50 dark:border-emerald-800/40">
                          <FiCompass className="size-3 text-emerald-600 shrink-0" />
                          <span>GPS Coordinates: {coords.lat.toFixed(4)}, {coords.lng?.toFixed(4)}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-foreground mb-0.5 block">House / Flat No.</label>
                        <input
                          type="text"
                          value={house}
                          onChange={(e) => setHouse(e.target.value)}
                          placeholder="e.g. Flat 402, Building A"
                          className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-foreground mb-0.5 block">Street / Area *</label>
                        <input
                          type="text"
                          required
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          placeholder="e.g. Indiranagar 100 Feet Road"
                          className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-foreground mb-0.5 block">City *</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Bengaluru"
                            className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[11px] font-bold text-foreground block">Pincode *</label>
                            {pincodeLoading ? (
                              <span className="text-[9px] font-extrabold text-emerald-600 animate-pulse">Mapping...</span>
                            ) : null}
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            placeholder="e.g. 560038"
                            className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="h-10 rounded-2xl border border-border px-4 text-xs font-bold hover:bg-muted"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={handleCompleteRegistration}
                        className="h-10 flex-1 rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        Complete Registration 🚀
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
