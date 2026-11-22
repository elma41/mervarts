import { SUPABASE_URL } from "./config";

export function publicUrl(bucket: string, path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/** Ürün görselleri iki boyutta saklanır: <ad>.webp (1600px) ve <ad>-sm.webp (640px). */
export function productImage(path: string) {
  const lg = publicUrl("product-images", path);
  const sm = path.endsWith(".webp") ? publicUrl("product-images", path.replace(/\.webp$/, "-sm.webp")) : lg;
  return { lg, sm, srcSet: sm === lg ? undefined : `${sm} 640w, ${lg} 1600w` };
}

export function price(n: number | null) {
  if (n == null) return "";
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}

export function waLink(number: string | null, text: string) {
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function slugify(s: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };
  return s
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c] || c)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function sortImages<T extends { is_cover: boolean; sort_order: number }>(imgs: T[] | undefined) {
  return [...(imgs || [])].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order);
}

export function dateTR(s: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(s));
}
