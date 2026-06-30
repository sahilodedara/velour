import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "product-media";

/** Upload a file to the public product-media bucket; returns its public URL. */
export async function uploadMedia(
  sb: SupabaseClient,
  file: File,
): Promise<{ url?: string; error?: string }> {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) return { error: error.message };
  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
