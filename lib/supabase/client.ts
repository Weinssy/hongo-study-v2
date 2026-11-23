import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

/**
 * Klien Supabase opsional.
 *
 * Mengembalikan `null` bila env belum diisi — aplikasi Fase 1 memang
 * dirancang tetap jalan penuh dari data lokal (mode tamu) sebelum
 * project Supabase dibuat. Koneksi nyata menunggu project + keys milik Wein.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cached = url && anonKey ? createClient(url, anonKey) : null;
  return cached;
}
