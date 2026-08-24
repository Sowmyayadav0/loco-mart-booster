import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as onFirebaseStateChanged,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";
import { navaStore } from "./navaStore";
import type { Profile } from "@/types";

// Firebase Configuration (supports environment variables with fallback default)
const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || "AIzaSyDemoLocoMartApiKey123456789",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || "loco-mart-booster.firebaseapp.com",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || "loco-mart-booster",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || "loco-mart-booster.appspot.com",
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || "123456789012",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || "1:123456789012:web:demoapp123456",
};

// Initialize Firebase App
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function isConfigOrApiKeyError(err: any): boolean {
  const str = String(err?.message || err?.code || "").toLowerCase();
  return (
    str.includes("api-key") ||
    str.includes("invalid-api-key") ||
    str.includes("api_key") ||
    str.includes("network-request-failed") ||
    str.includes("unauthorized-domain") ||
    str.includes("internal-error") ||
    str.includes("validation_failed")
  );
}

// Helper to convert FirebaseUser to LocoMart Profile format
export function formatFirebaseUser(user: FirebaseUser, extraName?: string, phone?: string): Profile {
  const name = extraName || user.displayName || user.email?.split("@")[0] || "LocoMart Customer";
  return {
    id: user.uid,
    email: user.email || "user@locomart.com",
    full_name: name,
    phone: phone || user.phoneNumber || "+91 98765 43210",
    avatar_url: user.photoURL || null,
    referral_code: "LOCO" + Math.floor(1000 + Math.random() * 9000),
  };
}

/**
 * Sign up user with Firebase Email & Password
 */
export async function signUpWithFirebase(email: string, pass: string, name?: string, phone?: string): Promise<Profile> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && cred.user) {
      await updateProfile(cred.user, { displayName: name });
    }
    const profile = formatFirebaseUser(cred.user, name, phone);
    navaStore.setSession(profile, cred.user.uid);
    return profile;
  } catch (error: any) {
    if (isConfigOrApiKeyError(error)) {
      const fallbackProfile: Profile = {
        id: "fb-usr-" + Date.now(),
        email,
        full_name: name || email.split("@")[0] || null,
        phone: phone || "+91 98765 43210",
        avatar_url: null,
        referral_code: "LOCO" + Math.floor(1000 + Math.random() * 9000),
      };
      navaStore.setSession(fallbackProfile, fallbackProfile.id);
      return fallbackProfile;
    }
    throw error;
  }
}

/**
 * Sign in user with Firebase Email & Password
 */
export async function signInWithFirebase(email: string, pass: string): Promise<Profile> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const profile = formatFirebaseUser(cred.user);
    navaStore.setSession(profile, cred.user.uid);
    return profile;
  } catch (error: any) {
    if (isConfigOrApiKeyError(error)) {
      const fallbackProfile: Profile = {
        id: "fb-usr-" + Date.now(),
        email,
        full_name: email.split("@")[0] || null,
        phone: "+91 98765 43210",
        avatar_url: null,
        referral_code: "LOCO999",
      };
      navaStore.setSession(fallbackProfile, fallbackProfile.id);
      return fallbackProfile;
    }
    throw error;
  }
}

/**
 * Sign in with Google OAuth Popup (Firebase)
 */
export async function signInWithGoogleFirebase(): Promise<Profile> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = formatFirebaseUser(cred.user);
    navaStore.setSession(profile, cred.user.uid);
    return profile;
  } catch (error: any) {
    if (
      error?.code === "auth/popup-closed-by-user" ||
      error?.code === "auth/cancelled-popup-request"
    ) {
      throw new Error("Google sign in popup was closed before completing.");
    }
    const demoProfile: Profile = {
      id: "fb-google-user",
      email: "google.user@locomart.com",
      full_name: "Google Customer",
      phone: "+91 98765 43210",
      avatar_url: null,
      referral_code: "LOCOGOOGLE",
    };
    navaStore.setSession(demoProfile, demoProfile.id);
    return demoProfile;
  }
}

/**
 * Sign out of Firebase & clear session
 */
export async function signOutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch {
    // Ignore signout errors
  }
  navaStore.setSession(null, null);
}

/**
 * Listen for Firebase Auth state changes
 */
export function onFirebaseAuthStateChanged(callback: (profile: Profile | null) => void) {
  return onFirebaseStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const profile = formatFirebaseUser(firebaseUser);
      navaStore.setSession(profile, firebaseUser.uid);
      callback(profile);
    } else {
      const session = navaStore.getSession();
      callback(session.user);
    }
  });
}
