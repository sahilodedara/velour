"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both env vars are present — lets the app run (demo mode) without Supabase. */
export const isSupabaseEnabled = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

/** Singleton browser Supabase client. Returns null when not configured. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnabled) return null;
  if (!cached) {
    cached = createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return cached;
}
