import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ReviewBlock from "@/components/ReviewBlock";
import HGallery from "@/components/HGallery";
import { HatDivider, HeroSwash, ScrollHat } from "@/components/Hat";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { price, productImage, sortImages } from "@/lib/format";
import type { Product } from "@/lib/types";

export const revalidate = 60;

const DUST = [
  [8, 72, 6, 9, 0], [18, 30, 4, 11, 1.2], [30, 84, 8, 8, 2.1], [44, 18, 5, 12, .6], [52, 66, 6, 10, 3], [63, 40, 4, 9, 1.8],
  [72, 82, 7, 13, .3], [82, 24, 5, 10, 2.6], [90, 58, 6, 11, 1.1], [24, 56, 4, 14, 3.4], [58, 10, 5, 9, 2.2], [95, 90, 4, 12, .9],
];

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
  const slidesSrc = pool.slice(0, 4);
  while (slidesSrc.length && slidesSrc.length < 4) slidesSrc.push(slidesSrc[slidesSrc.length % Math.max(1, pool.length)]);
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

      {/* ============ TAM EKRAN GİRİŞ ============ */}
      <section className="hero-shell" aria-label="Giriş">
        {slidesSrc.map((p, i) => {
          const im = img(p)!;
          return (
            <div className="slide" key={i} style={{ ["--i" as string]: i }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bg grade" src={im.src.lg} srcSet={im.src.srcSet} sizes="100vw" width={1600} height={2000} alt={i === 0 ? im.alt : ""} aria-hidden={i === 0 ? undefined : true}
                fetchPriority={i === 0 ? "high" : "low"} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              <Link href={`/urun/${p.slug}`} className="slide-cap group" tabIndex={i === 0 ? undefined : -1}>
                <span className="block text-sm text-earth">{p.categories?.name}</span>
                <span className="block font-display text-3xl italic transition-colors group-hover:text-cobalt sm:text-4xl">{p.name}</span>
                {p.pricing_mode === "fixed" && p.price != null && <span className="block text-cobalt">{price(p.price)}</span>}
              </Link>
            </div>
          );
        })}
        <div className="hero-shade" aria-hidden="true" />
        <HeroSwash className="pointer-events-none absolute inset-0 h-full w-full" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {DUST.map(([x, y, z, t, d], i) => (
            <span key={i} className="dust" style={{ left: `${x}%`, top: `${y}%`, width: z * 3, height: z * 3, ["--t" as string]: `${t}s`, ["--dl" as string]: `${d}s` }} />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 pb-12 sm:px-10 sm:pb-16 lg:px-14">
          <h1 className="font-display text-[clamp(4.2rem,13vw,12rem)] leading-[.84] tracking-[-.02em]">
            <span className="rise block" style={{ ["--delay" as string]: ".2s" }}>Kalemle,</span>
            <span className="rise block italic text-cobalt" style={{ ["--delay" as string]: ".45s" }}>altınla,</span>
            <span className="rise block" style={{ ["--delay" as string]: ".7s" }}>sabırla.</span>
          </h1>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ ["--delay" as string]: "1.1s" }}>
            <Link href="/urunler" className="btn btn-primary">Koleksiyonu gör</Link>
            <Link href="/ozel-siparis" className="btn btn-ghost">Kişiye özel iste</Link>
          </div>
        </div>
        <span className="cue absolute bottom-0 left-1/2 hidden h-14 w-px bg-gold sm:block" aria-hidden="true" />
      </section>

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
          <section key={p.id} className={`scene ${i % 2 ? "flip" : ""}`} aria-label={p.name}>
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
      <section aria-labelledby="ozel" className="relative mt-28 overflow-hidden bg-[#2a0f1a]">
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
