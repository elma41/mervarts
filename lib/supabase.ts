import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, REVALIDATE_SECONDS } from "./config";

/** Sunucu tarafı (yalnızca herkese açık verileri okur, önbellekli). */
export function serverClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS, tags: ["supabase"] } } as RequestInit),
    },
  });
}

let browser: SupabaseClient | null = null;
/** Tarayıcı tarafı (formlar ve admin paneli). */
export function browserClient(): SupabaseClient {
  if (!browser) {
    browser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "mervarts-auth" },
    });
  }
  return browser;
}
