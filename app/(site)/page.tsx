import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ReviewBlock from "@/components/ReviewBlock";
import HGallery from "@/components/HGallery";
import ArtSlider, { type SlideData } from "@/components/ArtSlider";
import { HatDivider, ScrollHat } from "@/components/Hat";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { price, productImage, sortImages } from "@/lib/format";
import type { Product } from "@/lib/types";

export const revalidate = 60;


function img(p: Product, n = 0) {
  const imgs = sortImages(p.product_images);
  const i = imgs[n] || imgs[0];
  return i ? { src: productImage(i.path), alt: i.alt || p.name } : null;
}

export default async function Home() {
  const [s, categories, featured, latest] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 14 }),
  ]);
  const withPhoto = (list: Product[]) => list.filter((p) => img(p));
  const pool = withPhoto(featured.length ? featured : latest);
  const TONE: Record<string, { bg: string; dark: boolean }> = {
    "esma-ul-husna": { bg: "#5a1a2b", dark: true },
    "kisiye-ozel-harf": { bg: "#1f2a5c", dark: true },
    "gul-ve-cicek": { bg: "#efd8d0", dark: false },
    "rokoko-tezhip": { bg: "#2f5a46", dark: true },
  };
  const slides: SlideData[] = pool.slice(0, 5).map((p) => {
    const im = img(p)!;
    const t = TONE[p.categories?.slug || ""] || { bg: "#f1e8d6", dark: false };
    return {
      slug: p.slug, name: p.name, category: p.categories?.name || "", soldOut: p.is_sold_out,
      price: p.pricing_mode === "fixed" && p.price != null ? price(p.price) : "Fiyat için teklif alın",
      buy: p.shopier_url || s.shopier_url, src: im.src.lg, srcSet: im.src.srcSet, alt: im.alt, bg: t.bg, dark: t.dark,
    };
  });
  const scenes = pool.slice(0, 5);
  const showcase = latest.slice(0, 12);
  const names = latest.map((p) => p.name);
  const catCover = (slug: string) => {
    const p = latest.find((x) => x.categories?.slug === slug && img(x));
    return p ? img(p) : null;
  };

  return (
    <>
      <ScrollHat />

      {/* ============ ESER SLAYTLARI ============ */}
      {slides.length > 0 ? <ArtSlider slides={slides} /> : (
        <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-10 lg:px-14">
          <h1 className="font-display text-7xl sm:text-9xl">Kalemle, <em className="text-cobalt">altınla,</em> sabırla.</h1>
          <Link href="/urunler" className="btn btn-primary mt-8">Koleksiyonu gör</Link>
        </section>
      )}

      {/* ============ KAYAN İSİMLER ============ */}
      {names.length > 0 && (
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...names, ...names, ...names, ...names].map((n, i) => <span key={i}>{n}</span>)}
          </div>
        </div>
      )}

      {/* ============ TAM EKRAN SAHNELER ============ */}
      {scenes.map((p, i) => {
        const im = img(p, 1)!;
        const buy = p.shopier_url || s.shopier_url;
        return (
          <section key={p.id} className={`scene on-photo ${i % 2 ? "flip" : ""}`} aria-label={p.name}>
            <div className="scene-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="grade" src={im.src.lg} srcSet={im.src.srcSet} sizes="100vw" width={1600} height={2000} alt={im.alt} loading="lazy" decoding="async" />
            </div>
            <div className="scene-shade" aria-hidden="true" />
            <div className={`scene-copy relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-10 sm:pb-20 lg:px-14 ${i % 2 ? "lg:text-right" : ""}`}>
              <p className="text-earth">{p.categories?.name}{p.badges[0] ? `, ${p.badges[0]}` : ""}</p>
              <h2 className="scene-title mt-2 font-display" data-write>{p.name}</h2>
              <div className={`mt-6 flex flex-wrap items-center gap-4 ${i % 2 ? "lg:justify-end" : ""}`}>
                <span className="font-display text-4xl text-cobalt">{p.pricing_mode === "fixed" && p.price != null ? price(p.price) : "Fiyat için teklif alın"}</span>
                <Link href={`/urun/${p.slug}`} className="btn btn-ghost">Eseri incele</Link>
                {!p.is_sold_out && <a href={buy} target="_blank" rel="noopener" className="btn btn-primary">Shopier&apos;den satın al</a>}
              </div>
            </div>
          </section>
        );
      })}

      <HatDivider className="mx-auto mt-24 max-w-[1440px] px-5 sm:px-10 lg:px-14" />

      {/* ============ TÜM KOLEKSİYON ============ */}
      <HGallery title="Tüm koleksiyon" action={<Link href="/urunler" className="link-line">Tüm eserler</Link>}>
        {showcase.map((p, i) => (
          <div key={p.id} className={i % 2 === 1 ? "lg:mt-24" : ""}>
            <ProductCard p={p} priority={i < 3} />
          </div>
        ))}
        <Link href="/urunler" className="group/end flex min-h-[320px] items-center justify-center self-center text-center">
          <span className="font-display text-4xl italic text-cobalt transition-transform duration-500 group-hover/end:translate-x-2 sm:text-5xl">Tüm eserler</span>
        </Link>
      </HGallery>

      {/* ============ ESER TÜRLERİ ============ */}
      {categories.length > 0 && (
        <section aria-labelledby="turler" className="mx-auto mt-28 max-w-[1440px] px-5 sm:px-10 lg:px-14">
          <h2 id="turler" data-write className="font-display text-4xl sm:text-6xl">Eser türleri</h2>
          <ul className="mt-8 border-t border-line">
            {categories.map((c, i) => {
              const cv = catCover(c.slug);
              return (
                <li key={c.id} className="border-b border-line" data-reveal style={{ ["--delay" as string]: `${i * 0.12}s` }}>
                  <Link href={`/urunler/kategori/${c.slug}`} className="cat-row group flex items-baseline justify-between gap-6 py-6 sm:py-8">
                    <span className="font-display text-4xl transition-transform duration-500 group-hover:translate-x-3 sm:text-7xl">{c.name}</span>
                    <span className="text-cobalt" aria-hidden="true">Görüntüle</span>
                    {cv && (
                      <span className="cat-peek" aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="grade" src={cv.src.sm} width={640} height={800} alt="" loading="lazy" decoding="async" />
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ============ KİŞİYE ÖZEL ============ */}
      <section aria-labelledby="ozel" className="on-photo relative mt-28 overflow-hidden bg-[#3a1220]">
        <svg data-draw viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-gold opacity-70" aria-hidden="true" focusable="false">
          <path className="ink-line" pathLength={1} strokeWidth="1.5" d="M-20 300 C 200 80, 360 360, 560 200 S 900 40, 1220 220" />
          <path className="ink-line" pathLength={1} strokeWidth="6" opacity=".5" d="M-20 330 C 200 110, 360 390, 560 230 S 900 70, 1220 250" />
        </svg>
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-24 sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:px-14 lg:py-36">
          <h2 id="ozel" data-write className="font-display text-5xl leading-[1.02] sm:text-8xl">Adınızın harfi, bir tabloda.</h2>
          <div>
            <p className="max-w-[42ch] text-lg text-ink/90">Harf, isim ya da bir Esmâ seçin; ölçüyü ve renkleri birlikte belirleyelim. Eser yalnızca sizin için işlenir.</p>
            <Link href="/ozel-siparis" className="btn btn-primary mt-7">Teklif isteyin</Link>
          </div>
        </div>
      </section>

      <ReviewBlock s={s} />
    </>
  );
}
