import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { WelcomeSplashPage } from "@/components/auth/WelcomeSplashPage";
import { SuperAppOrbitScreen } from "@/components/auth/SuperAppOrbitScreen";
import { LanguageSelectScreen } from "@/components/auth/LanguageSelectScreen";
import { PermissionsScreen } from "@/components/auth/PermissionsScreen";
import { PhoneNumberScreen } from "@/components/auth/PhoneNumberScreen";
import { OtpPasswordScreen } from "@/components/auth/OtpPasswordScreen";
import { ReferralCodeScreen } from "@/components/auth/ReferralCodeScreen";
import { DeliveryAddressScreen } from "@/components/auth/DeliveryAddressScreen";
import { YouAreAllSetScreen } from "@/components/auth/YouAreAllSetScreen";

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
  const [showSplash, setShowSplash] = useState(true);
  const [showOrbit, setShowOrbit] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  // Step Sequence: 1: Language -> 2: Permissions -> 3: Referral Code -> 4: Delivery Address -> 5: You're All Set
  const [step, setStep] = useState<number>(1);
  const [referralCode, setReferralCode] = useState("");

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
      return;
    }
    setOtpSent(true);
    setOtpTimer(30);
  }

  // Step 2: Verify OTP
  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) {
      return;
    }
    setStep(3); // Move to Step 3: Personal Details
  }

  // Step 4: High Accuracy GPS Auto Detect & Reverse Geocoding
  async function detectHighAccuracyGps() {
    setGpsLoading(true);
    if (!("geolocation" in navigator)) {
      setGpsLoading(false);
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
          } else {
            setArea("Indiranagar 100 Feet Road");
            setCity("Bengaluru");
            setPincode("560038");
            navaStore.setActiveLocation("Indiranagar, Bengaluru 560038");
          }
        } catch {
          setArea("Indiranagar 100 Feet Road");
          setCity("Bengaluru");
          setPincode("560038");
          navaStore.setActiveLocation("Indiranagar, Bengaluru 560038");
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
    void navigate({ to: "/" });
  }

  // Sign In submit handler
  function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginPhoneOrEmail) {
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
    void navigate({ to: "/" });
  }

  if (showSplash) {
    return (
      <WelcomeSplashPage
        onProceed={() => {
          setShowSplash(false);
          setShowOrbit(true);
        }}
        onSignInDirect={() => {
          setShowSplash(false);
          setShowOrbit(false);
          setMode("signin");
        }}
      />
    );
  }

  if (showOrbit) {
    return (
      <SuperAppOrbitScreen
        onGetStarted={() => {
          setShowOrbit(false);
          setStep(1);
        }}
        onSkip={() => {
          setShowOrbit(false);
          setStep(1);
        }}
      />
    );
  }

  if (mode === "signup" && step === 1) {
    return (
      <LanguageSelectScreen
        initialLang={selectedLang}
        onContinue={(langCode) => {
          setSelectedLang(langCode);
          setStep(2);
        }}
        onBack={() => {
          setShowOrbit(true);
        }}
      />
    );
  }

  if (mode === "signup" && step === 2) {
    return (
      <PermissionsScreen
        onNext={() => setStep(3)}
        onSkip={() => setStep(3)}
        onBack={() => setStep(1)}
      />
    );
  }

  if (mode === "signup" && step === 3) {
    return (
      <PhoneNumberScreen
        onContinue={(phoneNum) => {
          setPhone(phoneNum);
          setStep(4);
        }}
        onBack={() => setStep(2)}
        onSwitchToPasswordLogin={() => {
          setMode("signin");
        }}
      />
    );
  }

  if (mode === "signup" && step === 4) {
    return (
      <OtpPasswordScreen
        phone={phone || "+91 98765 43210"}
        onVerifySuccess={() => setStep(5)}
        onBack={() => setStep(3)}
      />
    );
  }

  if (mode === "signup" && step === 5) {
    return (
      <ReferralCodeScreen
        onApply={(code) => {
          setReferralCode(code);
          setStep(6);
        }}
        onSkip={() => setStep(6)}
      />
    );
  }

  if (mode === "signup" && step === 6) {
    return (
      <DeliveryAddressScreen
        onConfirm={(addr) => {
          setHouse(addr);
          setStep(7);
        }}
        onSkip={() => setStep(7)}
        onBack={() => setStep(5)}
      />
    );
  }

  if (mode === "signup" && step === 7) {
    return (
      <YouAreAllSetScreen
        onStartExploring={() => {
          const finalLocation = house || "Flat 402, Prestige Elm, Koramangala 5th Block, Bengaluru";
          navaStore.setActiveLocation(finalLocation);

          const userProfile: Profile = {
            id: "usr-" + Date.now(),
            phone: phone || "+91 98765 43210",
            email: "customer@locomart.com",
            full_name: "LocoMart Customer",
            avatar_url: null,
            referral_code: referralCode || "LOCO999",
            gender: "Male",
            language: selectedLang,
          };
          navaStore.setSession(userProfile, "token-" + Date.now());
          void navigate({ to: "/" });
        }}
      />
    );
  }

  return (
    <PhoneNumberScreen
      onContinue={(phoneNum) => {
        setPhone(phoneNum);
        setStep(4);
      }}
      onBack={() => setStep(2)}
      onSwitchToPasswordLogin={() => setStep(4)}
    />
  );
}
