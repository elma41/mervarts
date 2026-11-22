import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import { getProducts, getSettings } from "@/lib/data";
import { price, productImage, sortImages } from "@/lib/format";

const PAGES = ["urunler", "ozel-siparis", "hakkinda", "iletisim"];

/** Sabit tohumlu karıştırma: her derleme aynı sırayı verir, sayfalar birbirinden farklı görünür. */
function shuffle<T>(arr: T[], seed: number) {
  const a = [...arr];
  let x = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    x = (x * 1664525 + 1013904223) % 4294967296;
    const j = x % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Her sayfanın üstünde, o sayfaya özel sırayla dönen ürün slaytı. */
export default async function PageSlider({ page }: { page: string }) {
  const [s, all] = await Promise.all([getSettings(), getProducts({ limit: 24 })]);
  const withPhoto = all.filter((p) => sortImages(p.product_images)[0]);
  if (withPhoto.length === 0) return null;
  const base = shuffle(withPhoto, 7);
  const idx = Math.max(0, PAGES.indexOf(page));
  const start = (idx * 3) % base.length;
  const order = [...base.slice(start), ...base.slice(0, start)];
  const picked = shuffle(order.slice(0, Math.min(8, order.length)), 11 + idx * 13).slice(0, 6);
  const slides: HeroSlide[] = picked.map((p) => {
    const i = sortImages(p.product_images);
    const im = i[(idx + 1) % i.length] || i[0];
    const src = productImage(im.path);
    return { slug: p.slug, name: p.name, category: p.categories?.name || "", src: src.lg, srcSet: src.srcSet, alt: im.alt || p.name,
      price: p.pricing_mode === "fixed" && p.price != null ? price(p.price) : "", buy: p.is_sold_out ? null : p.shopier_url || s.shopier_url };
  });
  return <HeroSlider slides={slides} compact />;
}
