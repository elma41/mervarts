import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ReviewBlock from "@/components/ReviewBlock";
import HGallery from "@/components/HGallery";
import { HatDivider, HeroHat, ScrollHat } from "@/components/Hat";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { price, productImage, sortImages } from "@/lib/format";

export const revalidate = 60;

const DUST = [
  [8, 72, 6, 9, 0], [18, 30, 4, 11, 1.2], [30, 84, 8, 8, 2.1], [44, 18, 5, 12, .6], [52, 66, 6, 10, 3], [63, 40, 4, 9, 1.8],
  [72, 82, 7, 13, .3], [82, 24, 5, 10, 2.6], [90, 58, 6, 11, 1.1], [24, 56, 4, 14, 3.4], [58, 10, 5, 9, 2.2], [95, 90, 4, 12, .9],
];

export default async function Home() {
  const [s, categories, featured, latest] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 12 }),
  ]);
  const hero = featured[0] || latest[0];
  const heroImg = hero ? sortImages(hero.product_images)[0] : undefined;
  const heroSrc = heroImg ? productImage(heroImg.path) : null;
  const showcase = latest.slice(0, 9);

  return (
    <>
      <ScrollHat />

      {/* ============ GİRİŞ ============ */}
      <section className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-20 pt-6 sm:px-10 lg:grid-cols-[1.1fr_.9fr] lg:px-14 lg:pt-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {DUST.map(([x, y, z, t, d], i) => (
            <span key={i} className="dust" style={{ left: `${x}%`, top: `${y}%`, width: z * 3, height: z * 3, ["--t" as string]: `${t}s`, ["--dl" as string]: `${d}s` }} />
          ))}
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-[3.4rem] leading-[.95] sm:text-7xl lg:text-[6.4rem]">
            <span className="rise block" style={{ ["--delay" as string]: ".1s" }}>Kalemle,</span>
            <span className="rise block italic text-cobalt" style={{ ["--delay" as string]: ".3s" }}>altınla,</span>
            <span className="rise block" style={{ ["--delay" as string]: ".5s" }}>sabırla.</span>
          </h1>
          <p className="rise mt-8 max-w-[46ch] text-lg leading-relaxed text-earth sm:text-xl" style={{ ["--delay" as string]: ".8s" }}>
            Merve Türkdönmez&apos;in tezhip işleri: Esmâ-ül Hüsnâ levhaları, kişiye özel harf tabloları, gül ve rokoko süslemeleri. Her eser tek, her biri elde işlendi.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ ["--delay" as string]: "1s" }}>
            <Link href="/urunler" className="btn btn-primary">Koleksiyonu gör</Link>
            <Link href="/ozel-siparis" className="btn btn-ghost">Kişiye özel iste</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          
          <HeroHat className="pointer-events-none absolute -inset-10 z-20 h-[calc(100%+5rem)] w-[calc(100%+5rem)] overflow-visible" />
          {hero && heroSrc && (
            <Link href={`/urun/${hero.slug}`} className="group relative z-10 block rotate-[1.2deg] transition-transform duration-700 hover:rotate-0">
              <div className="frame fade-in" style={{ ["--delay" as string]: ".6s" }}>
                <div className="frame-art aspect-[4/5]"><div className="unveil h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroSrc.lg} srcSet={heroSrc.srcSet} sizes="(min-width:1024px) 40vw, 90vw" width={1600} height={2000} alt={heroImg?.alt || hero.name} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
                </div></div>
              </div>
              <div className="museum-label absolute -bottom-5 right-6 fade-in" style={{ ["--delay" as string]: "1.4s" }}>
                <b>{hero.name}</b>
                <span>{hero.categories?.name}{hero.pricing_mode === "fixed" && hero.price != null ? ` · ${price(hero.price)}` : ""}</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <HatDivider className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-14" />

      {/* ============ KOLEKSİYON ============ */}
      <HGallery title="Koleksiyon" action={<Link href="/urunler" className="link-line">Tüm eserler</Link>}>
        {showcase.map((p, i) => (
          <div key={p.id} className={i % 2 === 1 ? "lg:mt-24" : ""}>
            <ProductCard p={p} priority={i < 3} />
          </div>
        ))}
        <Link href="/urunler" className="group/end flex min-h-[320px] items-center justify-center self-center text-center">
          <span className="font-display text-4xl italic text-cobalt transition-transform duration-500 group-hover/end:translate-x-2 sm:text-5xl">Tüm eserler</span>
        </Link>
      </HGallery>

      {/* ============ KATEGORİLER ============ */}
      {categories.length > 0 && (
        <section aria-labelledby="turler" className="mx-auto mt-28 max-w-[1440px] px-5 sm:px-10 lg:px-14">
          <h2 id="turler" data-write className="font-display text-4xl sm:text-6xl">Eser türleri</h2>
          <ul className="mt-8 border-t border-line">
            {categories.map((c, i) => (
              <li key={c.id} className="border-b border-line" data-reveal style={{ ["--delay" as string]: `${i * 0.12}s` }}>
                <Link href={`/urunler/kategori/${c.slug}`} className="cat-row group flex items-baseline justify-between gap-6 py-6 sm:py-8">
                  <span className="font-display text-4xl transition-transform duration-500 group-hover:translate-x-3 sm:text-6xl">{c.name}</span>
                  <span className="text-cobalt transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">Görüntüle</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============ KİŞİYE ÖZEL ============ */}
      <section aria-labelledby="ozel" className="relative mt-28 overflow-hidden bg-cobalt text-white">
        <svg data-draw viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-gold opacity-70" aria-hidden="true" focusable="false">
          <path className="ink-line" pathLength={1} strokeWidth="1.5" d="M-20 300 C 200 80, 360 360, 560 200 S 900 40, 1220 220" />
          <path className="ink-line" pathLength={1} strokeWidth="6" opacity=".5" d="M-20 330 C 200 110, 360 390, 560 230 S 900 70, 1220 250" />
        </svg>
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-20 sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:px-14 lg:py-28">
          <h2 id="ozel" data-write className="font-display text-5xl leading-[1.02] sm:text-7xl">Adınızın harfi, bir tabloda.</h2>
          <div>
            <p className="max-w-[42ch] text-lg text-white/90">Harf, isim ya da bir Esmâ seçin; ölçüyü ve renkleri birlikte belirleyelim. Eser yalnızca sizin için işlenir.</p>
            <Link href="/ozel-siparis" className="btn mt-7 bg-white text-cobalt hover:bg-paper">Teklif isteyin</Link>
          </div>
        </div>
      </section>

      <ReviewBlock s={s} />
    </>
  );
}
