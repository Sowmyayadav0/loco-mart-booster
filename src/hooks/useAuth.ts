import { useEffect, useState } from "react";
import { navaStore } from "@/lib/navaStore";
import { onFirebaseAuthStateChanged } from "@/lib/firebase";
import type { Profile } from "@/types";

export function useAuth() {
  const [session, setSession] = useState<{ user: Profile | null; token: string | null }>({
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = () => {
      const current = navaStore.getSession();
      setSession(current);
      setLoading(false);
    };

    refresh();

    // Listen to Firebase auth changes
    const unsubscribeFirebase = onFirebaseAuthStateChanged((profile) => {
      if (profile) {
        setSession({ user: profile, token: profile.id });
      } else {
        setSession(navaStore.getSession());
      }
      setLoading(false);
    });

    // Listen to storage events
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("nava::")) refresh();
    };

    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribeFirebase();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    session,
    user: session.user,
    loading,
    signedIn: Boolean(session.token && session.user),
  };
}
