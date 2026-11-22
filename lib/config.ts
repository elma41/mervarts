// Herkese açık değerler. Ortam değişkeni verilmezse demo projesinin değerleri kullanılır,
// böylece Vercel'de ek ayar yapmadan da çalışır. (Publishable anahtar gizli değildir;
// yetkiler Supabase RLS kurallarıyla korunur.)
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yedgykhlufezkuxbmeni.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_fKurhdO7t6Y7eyfMv3fw5A_ulW4h9hY";

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
export const SITE_URL = siteUrl();

export const REVALIDATE_SECONDS = 60;
