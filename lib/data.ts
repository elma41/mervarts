import "server-only";
import { cache } from "react";
import { serverClient } from "./supabase";
import type { Category, LegalPage, Product, SiteSettings } from "./types";

const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  brand_name: "Merve Türkdönmez",
  tagline: "El emeği, özgün sanat ürünleri",
  about_text: "",
  logo_path: null,
  whatsapp_number: null,
  shopier_url: "https://www.shopier.com/MErvarts",
  instagram_url: "https://www.instagram.com/merv.arts/",
  google_review_url: null,
  contact_email: null,
  updated_at: new Date(0).toISOString(),
};

const PRODUCT_SELECT = "*, product_images(*), categories(slug,name)";

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const { data } = await serverClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (data as SiteSettings) || FALLBACK_SETTINGS;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data } = await serverClient().from("categories").select("id,slug,name,sort_order").order("sort_order");
  return (data as Category[]) || [];
});

export const getProducts = cache(
  async (opts: { categoryId?: string; featured?: boolean; limit?: number } = {}): Promise<Product[]> => {
    let q = serverClient()
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "published")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (opts.categoryId) q = q.eq("category_id", opts.categoryId);
    if (opts.featured) q = q.eq("is_featured", true);
    if (opts.limit) q = q.limit(opts.limit);
    const { data } = await q;
    return (data as Product[]) || [];
  },
);

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const { data } = await serverClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as Product) || null;
});

export const getLegal = cache(async (slug: string): Promise<LegalPage | null> => {
  const { data } = await serverClient().from("legal_pages").select("*").eq("slug", slug).maybeSingle();
  return (data as LegalPage) || null;
});
