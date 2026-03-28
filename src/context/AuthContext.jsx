/**
 * AuthContext — global auth state for the app.
 *
 * Provides:
 *   user     — current Supabase auth user (or null)
 *   loading  — true while the initial session is being resolved
 *   signInWithOtp(email)       — sends a one-time-password to the email
 *   verifyOtp(email, token)    — verifies the OTP
 *   signOut()                  — logs out and clears state
 *
 * Profile data lives in React Query (useProfile hook), not here.
 * Wrap your app with <AuthProvider> and consume via the useAuth() hook.
 */
import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithOtp = useCallback(async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    return data;
  }, []);

  const verifyOtp = useCallback(async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signInWithOtp, verifyOtp, signOut }),
    [user, loading, signInWithOtp, verifyOtp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
