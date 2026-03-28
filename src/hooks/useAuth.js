/**
 * useAuth() — convenience hook for consuming AuthContext.
 * Throws if called outside of <AuthProvider>.
 *
 * @returns {{ user, loading, signInWithOtp, verifyOtp, signOut }}
 */
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
