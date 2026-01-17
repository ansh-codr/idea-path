/**
 * Auth Context
 * ============
 * Provides authentication state throughout the app.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { 
  User, 
  subscribeToAuthChanges, 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  logOut, 
  resetPassword 
} from "@/lib/firebase";
import { setAuthTokenGetter } from "@/services/ideaForgeAPI";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Set the token getter for the API service whenever user changes
  useEffect(() => {
    setAuthTokenGetter(getIdToken);
  }, [getIdToken]);

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout: logOut,
    resetPassword,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
