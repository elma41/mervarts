export type SiteSettings = {
  id: number;
  brand_name: string;
  tagline: string;
  about_text: string;
  logo_path: string | null;
  whatsapp_number: string | null;
  shopier_url: string;
  instagram_url: string;
  google_review_url: string | null;
  contact_email: string | null;
  updated_at: string;
};

export type Category = { id: string; slug: string; name: string; sort_order: number };

export type ProductImage = {
  id: string;
  product_id: string;
  path: string;
  alt: string;
  sort_order: number;
  is_cover: boolean;
};

export type Product = {
  id: string;
  slug: string;
  code: string | null;
  name: string;
  description: string;
  category_id: string | null;
  pricing_mode: "fixed" | "quote";
  price: number | null;
  shopier_url: string | null;
  track_stock: boolean;
  stock: number;
  is_sold_out: boolean;
  badges: string[];
  status: "draft" | "published";
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
  categories?: Pick<Category, "slug" | "name"> | null;
};

export type LegalPage = { slug: string; title: string; body: string; version: number; updated_at: string };

export const BADGES = ["Tek Ürün", "El Yapımı", "Sınırlı Stok", "Yeni", "Kişiye Özel"] as const;
