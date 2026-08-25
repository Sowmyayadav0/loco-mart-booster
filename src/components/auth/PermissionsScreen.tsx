import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiBell, FiCheck, FiMapPin } from "react-icons/fi";

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
        },
        () => {
          setLocationLoading(false);
          setLocationAllowed(true);
        },
        { timeout: 5000 }
      );
    } else {
      setLocationLoading(false);
      setLocationAllowed(true);
    }
  }

  // Handle Request Notifications
  function handleRequestNotifications() {
    setNotificationLoading(true);
    if ("Notification" in window) {
      Notification.requestPermission()
        .then((permission) => {
          setNotificationLoading(false);
          setNotificationAllowed(permission === "granted");
        })
        .catch(() => {
          setNotificationLoading(false);
          setNotificationAllowed(true);
        });
    } else {
      setNotificationLoading(false);
      setNotificationAllowed(true);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between px-4 py-6 sm:py-10 bg-[#FAFDFB] dark:bg-slate-950 text-slate-900 dark:text-white select-none transition-colors">
      {/* SOFT CYAN AMBIENT RADIAL BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(180, 240, 245, 0.45) 0%, rgba(224, 247, 250, 0.2) 40%, rgba(250, 253, 251, 0) 75%)",
        }}
      />

      {/* TOP HEADER WITH BACK ARROW */}
      <header className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="size-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <FiArrowLeft className="size-5" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 my-auto w-full max-w-md mx-auto space-y-6">
        {/* HEADING */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#044D63] dark:text-cyan-400 tracking-tight">
            Make SUPER work better
          </h1>
        </div>

        {/* PERMISSION CARD 1: LOCATION */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-xl shadow-cyan-900/5 dark:shadow-none space-y-4"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-[#D7F5F8] dark:bg-cyan-500/20 text-[#044D63] dark:text-cyan-300 shrink-0">
              <FiMapPin className="size-6" />
            </span>
            <div className="space-y-0.5">
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                Location
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-normal">
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
                : "bg-[#00BCD4] hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 cursor-pointer"
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

        {/* PERMISSION CARD 2: NOTIFICATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-xl shadow-cyan-900/5 dark:shadow-none space-y-4"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-[#D7F5F8] dark:bg-cyan-500/20 text-[#044D63] dark:text-cyan-300 shrink-0">
              <FiBell className="size-6" />
            </span>
            <div className="space-y-0.5">
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                Notifications
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-normal">
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
                : "bg-[#00BCD4] hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 cursor-pointer"
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

      {/* FOOTER ACTIONS */}
      <footer className="relative z-10 w-full max-w-md mx-auto space-y-3 pt-6">
        <button
          type="button"
          onClick={() => onNext({ location: locationAllowed, notifications: notificationAllowed })}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BCD4] to-teal-600 hover:opacity-95 text-white font-extrabold text-base shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center cursor-pointer"
        >
          Next
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-center py-1 block cursor-pointer"
        >
          Skip for now
        </button>
      </footer>
    </div>
  );
}
