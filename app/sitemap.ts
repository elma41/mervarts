import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getCategories, getProducts } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const now = new Date();
  const fixed = ["", "/urunler", "/ozel-siparis", "/hakkinda", "/iletisim", "/kvkk", "/gizlilik-politikasi", "/cerez-politikasi"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: (p === "" || p === "/urunler" ? "daily" : "monthly") as "daily" | "monthly",
    priority: p === "" ? 1 : p === "/urunler" ? 0.9 : 0.5,
  }));
  return [
    ...fixed,
    ...categories.map((c) => ({ url: `${SITE_URL}/urunler/kategori/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${SITE_URL}/urun/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
