import { getRequestHeader } from "@tanstack/react-start/server";

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Server-side submission limit per client IP (hashed, never stored in clear).
 * Throws a user-facing error when the limit is exceeded.
 */
export async function enforceRateLimit(bucket: string, max: number, windowMinutes: number) {
  const ip =
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const keyHash = await sha256(`${bucket}:${ip}`);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  const { count, error } = await db
    .from("form_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("bucket", bucket)
    .eq("key_hash", keyHash)
    .gte("created_at", since);
  if (error) {
    console.error(error);
    return; // Fail open: never block legitimate customers on a counter failure.
  }
  if ((count ?? 0) >= max) {
    throw new Error("Trop de demandes envoyées. Réessayez dans quelques minutes ou appelez le garage.");
  }
  await db.from("form_rate_limits").insert({ bucket, key_hash: keyHash });
  // Opportunistic cleanup of old entries.
  await db
    .from("form_rate_limits")
    .delete()
    .lt("created_at", new Date(Date.now() - 24 * 3_600_000).toISOString());
}
