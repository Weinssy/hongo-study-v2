"use client";

// Konteks auth Supabase (Fase 2). Bila env Supabase kosong, klien bernilai
// null dan konteks melaporkan supabaseReady = false: seluruh aplikasi tetap
// berjalan sebagai tamu, halaman /masuk menampilkan pemberitahuan jujur.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase/client";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  supabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = getSupabaseClient();
  const supabaseReady = client !== null;

  useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }
    let active = true;
    client.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [client]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!client) return { error: "Login belum aktif: Supabase belum terhubung." };
      const { error } = await client.auth.signInWithPassword({ email, password });
      return { error: error ? error.message : null };
    },
    [client],
  );

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!client) {
        return { error: "Pendaftaran belum aktif: Supabase belum terhubung.", needsEmailConfirmation: false };
      }
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return { error: error.message, needsEmailConfirmation: false };
      // Tanpa sesi setelah daftar berarti project meminta konfirmasi email.
      return { error: null, needsEmailConfirmation: data.session === null };
    },
    [client],
  );

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
    setUser(null);
  }, [client]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, supabaseReady, signIn, signUp, signOut }),
    [user, loading, supabaseReady, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
