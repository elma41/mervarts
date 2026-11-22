import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import BuyActions from "@/components/BuyActions";
import QuoteForm from "@/components/forms/QuoteForm";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import { getProduct, getProducts, getSettings } from "@/lib/data";
import { price, productImage, sortImages, waLink } from "@/lib/format";
import { SITE_URL } from "@/lib/config";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const ps = await getProducts();
  return ps.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Ürün bulunamadı", robots: { index: false } };
  const cover = sortImages(p.product_images)[0];
  const desc = (p.description || `${p.name} — Merve Türkdönmez'in el emeği, özgün tasarımı.`).replace(/\s+/g, " ").slice(0, 158);
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/urun/${p.slug}` },
    openGraph: {
      type: "website",
      title: `${p.name} · merv.arts`,
      description: desc,
      url: `/urun/${p.slug}`,
      images: cover ? [{ url: productImage(cover.path).lg, width: 1600, height: 2000, alt: cover.alt || p.name }] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, s] = await Promise.all([getProduct(slug), getSettings()]);
  if (!p) notFound();

  const imgs = sortImages(p.product_images).map((im) => ({ ...productImage(im.path), alt: im.alt || p.name }));
  const canBuy = p.pricing_mode === "fixed" && !p.is_sold_out;
  const shopier = p.shopier_url || s.shopier_url;
  const wa = waLink(s.whatsapp_number, `Merhaba, "${p.name}"${p.code ? ` (Kod: ${p.code})` : ""} hakkında bilgi almak istiyorum.\n${SITE_URL}/urun/${p.slug}`);
  const related = (await getProducts({ categoryId: p.category_id || undefined, limit: 4 })).filter((x) => x.id !== p.id).slice(0, 3);
  const lowStock = p.track_stock && !p.is_sold_out && p.stock > 0 && p.stock <= 2;

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <nav aria-label="Konum" className="text-sm text-earth">
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/" className="hover:text-clay">Ana sayfa</Link> /</li>
            <li><Link href="/urunler" className="hover:text-clay">Koleksiyon</Link> /</li>
            {p.categories && <li><Link href={`/urunler/kategori/${p.categories.slug}`} className="hover:text-clay">{p.categories.name}</Link> /</li>}
            <li aria-current="page" className="text-ink">{p.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Gallery images={imgs} name={p.name} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-wrap gap-2">
              {p.is_sold_out && <span className="badge !border-ink !bg-ink !text-paper">Tükendi</span>}
              {p.badges.map((b) => <span key={b} className="badge">{b}</span>)}
            </div>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight sm:text-5xl">{p.name}</h1>
            {p.code && <p className="mt-2 text-sm text-earth">Ürün kodu: <span className="font-semibold text-ink">{p.code}</span></p>}

            <p className="mt-6 font-display text-3xl">
              {p.pricing_mode === "fixed" && p.price != null ? price(p.price) : <span className="text-clay">Fiyat için teklif alın</span>}
            </p>
            {p.is_sold_out ? (
              <p className="mt-2 font-semibold text-clay-dark">Bu parça tükendi. Benzerini size özel hazırlayabiliriz.</p>
            ) : lowStock ? (
              <p className="mt-2 font-semibold text-clay-dark">Son {p.stock} adet</p>
            ) : null}

            <div className="mt-6">
              <BuyActions productId={p.id} shopierUrl={shopier} waUrl={wa} canBuy={canBuy} />
            </div>

            {p.description && (
              <div className="prose-art mt-8 border-t border-line pt-6 text-[1.02rem]">
                {p.description.split(/\n{2,}/).map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)}
              </div>
            )}

            <ul className="mt-6 grid gap-2 border-t border-line pt-6 text-sm text-earth">
              <li>✦ Elde üretilir; her parçada küçük farklılıklar el emeğinin imzasıdır.</li>
              <li>✦ Ödeme Shopier güvencesiyle; özel siparişlerde fiyat önceden onaylanır.</li>
              <li>✦ Özenli paketleme ile kargoya verilir.</li>
            </ul>
          </div>
        </div>
      </div>

      <section id="teklif" aria-labelledby="teklif-baslik" className="mx-auto mt-20 max-w-3xl scroll-mt-24 px-5 sm:px-8">
        <div className="rounded-[28px] border border-line bg-paper-2/50 p-6 sm:p-10">
          <h2 id="teklif-baslik" className="font-display text-3xl">Bu parçadan size özel isteyin</h2>
          <p className="mt-2 text-earth">Farklı ölçü, renk ya da kişiselleştirme için yazın; fiyat ve süreyi iletelim.</p>
          <div className="mt-6"><QuoteForm productId={p.id} productName={p.name} /></div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="benzer-baslik" className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
          <h2 id="benzer-baslik" className="mb-8 font-display text-3xl">Bunlar da hoşunuza gidebilir</h2>
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <li key={r.id} data-reveal><ProductCard p={r} /></li>)}
          </ul>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description || undefined,
          sku: p.code || p.id,
          image: imgs.map((i) => i.lg),
          url: `${SITE_URL}/urun/${p.slug}`,
          category: p.categories?.name,
          brand: { "@type": "Brand", name: "merv.arts" },
          creator: { "@type": "Person", name: "Merve Türkdönmez" },
          ...(p.pricing_mode === "fixed" && p.price != null
            ? {
                offers: {
                  "@type": "Offer",
                  price: p.price,
                  priceCurrency: "TRY",
                  availability: p.is_sold_out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                  url: shopier,
                  itemCondition: "https://schema.org/NewCondition",
                },
              }
            : {}),
        }}
      />
    </>
  );
}
