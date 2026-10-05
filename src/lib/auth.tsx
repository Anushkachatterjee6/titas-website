import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * Centralised Supabase auth state. `loading` stays true until the initial
 * session restore (from localStorage) completes, so route guards and the
 * header never briefly flash a "logged out" state for an already-logged-in
 * visitor.
 */

export type SignUpDetails = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

export type OAuthProvider = "google" | "facebook";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** Email confirmation is disabled for TiTAS accounts — a successful call
   *  always returns an active session, ready to use immediately. */
  signUp: (details: SignUpDetails) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Redirects the browser to the provider's consent screen via Supabase
   *  Auth's own OAuth flow — no custom auth system, no credentials here.
   *  Only resolves with an error if Supabase rejects the request before any
   *  redirect happens (e.g. malformed call); a disabled/unconfigured
   *  provider instead surfaces as an error page from Supabase itself after
   *  the redirect, which this app can't intercept client-side. */
  signInWithOAuth: (provider: OAuthProvider, redirectPath?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Translates raw Supabase/GoTrue errors into copy a customer can act on. */
function friendlyAuthError(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "That email and password don't match our records. Please try again.";
  }
  if (m.includes("user already registered") || m.includes("already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (m.includes("password should be at least")) {
    return "Password must be at least 6 characters long.";
  }
  if (m.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (m.includes("network")) {
    return "Couldn't reach the server. Please check your connection and try again.";
  }
  return "Something went wrong. Please try again in a moment.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async ({ fullName, phone, email, password }: SignUpDetails) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Read by the existing database trigger to populate public.profiles.
        data: { full_name: fullName, phone },
      },
    });
    if (error) return { error: friendlyAuthError(error.message) };
    // Confirm Email is disabled for this project, so signUp already returns
    // an active session — the caller can move straight into the app.
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: friendlyAuthError(error.message) };
    return { error: null };
  }, []);

  const signInWithOAuth = useCallback(async (provider: OAuthProvider, redirectPath = "/account") => {
    // Built from the current origin so this works unmodified on localhost,
    // Vercel previews and the eventual production domain — never hardcoded.
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      ...(typeof window !== "undefined"
        ? {
            options: {
              redirectTo: `${window.location.origin}${redirectPath}`,
              // Google only: force the account-chooser screen instead of
              // silently reusing whichever Google account is already
              // signed in on the device.
              ...(provider === "google" ? { queryParams: { prompt: "select_account" } } : {}),
            },
          }
        : {}),
    });
    if (error) return { error: friendlyAuthError(error.message) };
    // On success the browser is already navigating to the provider's
    // consent screen — there is nothing further to do here.
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      typeof window !== "undefined"
        ? { redirectTo: `${window.location.origin}/reset-password` }
        : {},
    );
    if (error) return { error: friendlyAuthError(error.message) };
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: friendlyAuthError(error.message) };
    return { error: null };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        requestPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
