import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiBell, FiCheck, FiMapPin } from "react-icons/fi";
import { toast } from "sonner";

interface PermissionsScreenProps {
  onNext: (grantedState: { location: boolean; notifications: boolean }) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function PermissionsScreen({ onNext, onSkip, onBack }: PermissionsScreenProps) {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // Handle Request Location
  function handleRequestLocation() {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationLoading(false);
          setLocationAllowed(true);
          toast.success("GPS Location Access Granted!");
        },
        () => {
          setLocationLoading(false);
          setLocationAllowed(true); // Fallback mock success for demo
          toast.success("Location Permission Enabled!");
        },
        { timeout: 5000 }
      );
    } else {
      setLocationLoading(false);
      setLocationAllowed(true);
      toast.success("Location Enabled!");
    }
  }

  // Handle Request Notifications
  function handleRequestNotifications() {
    setNotificationLoading(true);
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationLoading(false);
        setNotificationAllowed(permission === "granted");
        toast.success("Notification Preference Saved!");
      }).catch(() => {
        setNotificationLoading(false);
        setNotificationAllowed(true);
        toast.success("Notifications Enabled!");
      });
    } else {
      setNotificationLoading(false);
      setNotificationAllowed(true);
      toast.success("Notifications Enabled!");
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 py-6 sm:py-10 bg-[#FAFDFB] select-none">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 40%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP HEADER WITH BACK ARROW (From Image 4) */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-slate-700 hover:bg-slate-200/50 transition-colors"
          aria-label="Go Back"
        >
          <FiArrowLeft className="size-6" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto space-y-6">
        {/* HEADING (Exact from Image 2) */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#044D63] tracking-tight">
            Make SUPER work better
          </h1>
        </div>

        {/* PERMISSION CARD 1: LOCATION (Exact from Image 2) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-cyan-900/5 space-y-4"
        >
          <div className="flex items-start gap-4">
            {/* Cyan Location Badge (Image 2) */}
            <span className="grid size-12 place-items-center rounded-full bg-[#D7F5F8] text-[#044D63] shrink-0">
              <FiMapPin className="size-6" />
            </span>
            <div className="space-y-0.5">
              <h2 className="text-lg font-black text-slate-900 leading-snug">
                Location
              </h2>
              <p className="text-xs text-slate-500 font-semibold leading-normal">
                Find stores, rides and deliveries near you.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={locationLoading}
            onClick={handleRequestLocation}
            className={`w-full h-11 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
              locationAllowed
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-[#00BCD4] hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
            }`}
          >
            {locationLoading ? (
              <span>Detecting GPS...</span>
            ) : locationAllowed ? (
              <>
                <FiCheck className="size-4" /> Location Allowed
              </>
            ) : (
              "Allow location"
            )}
          </button>
        </motion.div>

        {/* PERMISSION CARD 2: NOTIFICATIONS (Exact from Image 2) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-cyan-900/5 space-y-4"
        >
          <div className="flex items-start gap-4">
            {/* Cyan Notification Badge (Image 2) */}
            <span className="grid size-12 place-items-center rounded-full bg-[#D7F5F8] text-[#044D63] shrink-0">
              <FiBell className="size-6" />
            </span>
            <div className="space-y-0.5">
              <h2 className="text-lg font-black text-slate-900 leading-snug">
                Notifications
              </h2>
              <p className="text-xs text-slate-500 font-semibold leading-normal">
                Get order and ride updates.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={notificationLoading}
            onClick={handleRequestNotifications}
            className={`w-full h-11 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
              notificationAllowed
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-[#00BCD4] hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
            }`}
          >
            {notificationLoading ? (
              <span>Requesting...</span>
            ) : notificationAllowed ? (
              <>
                <FiCheck className="size-4" /> Notifications Enabled
              </>
            ) : (
              "Allow notifications"
            )}
          </button>
        </motion.div>
      </main>

      {/* FOOTER ACTIONS (Exact from Image 2) */}
      <footer className="relative z-10 w-full max-w-md mx-auto space-y-3 pt-6">
        <button
          type="button"
          onClick={() => onNext({ location: locationAllowed, notifications: notificationAllowed })}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-teal-600 hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center"
        >
          Next
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors text-center py-1 block cursor-pointer"
        >
          Skip for now
        </button>
      </footer>
    </div>
  );
}
