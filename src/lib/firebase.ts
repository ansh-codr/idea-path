/**
 * Firebase Configuration
 * ======================
 * Client-side Firebase initialization for authentication.
 */

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser and if supported)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

// Initialize Auth
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Auth Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    let message = "Login failed. Please try again.";
    if (error.code === "auth/user-not-found") {
      message = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      message = "Incorrect password.";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address.";
    } else if (error.code === "auth/too-many-requests") {
      message = "Too many failed attempts. Please try again later.";
    }
    return { user: null, error: message };
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName?: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    
    return { user: result.user, error: null };
  } catch (error: any) {
    let message = "Sign up failed. Please try again.";
    if (error.code === "auth/email-already-in-use") {
      message = "An account already exists with this email.";
    } else if (error.code === "auth/weak-password") {
      message = "Password should be at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address.";
    }
    return { user: null, error: message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    let message = "Password reset failed.";
    if (error.code === "auth/user-not-found") {
      message = "No account found with this email.";
    }
    return { error: message };
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export type { User };
export default app;
