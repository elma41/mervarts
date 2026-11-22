import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ReviewBlock from "@/components/ReviewBlock";
import { HatDivider } from "@/components/Hat";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
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
  const [s, categories, latest] = await Promise.all([getSettings(), getCategories(), getProducts({ limit: 24 })]);
  const withPhoto = latest.filter((p) => img(p));
  const heroSlides: HeroSlide[] = [...withPhoto.filter((p) => p.is_featured), ...withPhoto.filter((p) => !p.is_featured)].slice(0, 6).map((p) => {
    const im = img(p)!;
    return { slug: p.slug, name: p.name, category: p.categories?.name || "", src: im.src.lg, srcSet: im.src.srcSet, alt: im.alt,
      price: p.pricing_mode === "fixed" && p.price != null ? price(p.price) : "Fiyat için teklif alın", buy: p.is_sold_out ? null : p.shopier_url || s.shopier_url };
  });
  const slidePool = [...withPhoto.filter((p) => p.is_featured), ...withPhoto.filter((p) => !p.is_featured)].slice(0, 4);
  const catCover = (slug: string) => {
    const p = latest.find((x) => x.categories?.slug === slug && img(x));
    return p ? img(p) : null;
  };
  const trust = [
    ["El yapımı", "Her eser tek tek, kalemle ve altın varakla işlenir."],
    ["Kişiye özel", "İsim, harf veya Esmâ seçin; ölçü ve renkleri birlikte belirleyelim."],
    ["Güvenli ödeme", "Satın alma Shopier üzerinden, kapıda teslim takibiyle yapılır."],
    ["WhatsApp'tan sipariş", "Sorunuzu yazın, eseri birlikte seçelim."],
  ];

  return (
    <>
      {heroSlides.length > 0 ? (
        <HeroSlider slides={heroSlides} />
      ) : (
        <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-10 lg:px-14">
          <h1 className="font-display text-6xl sm:text-8xl">El emeği sanat eserleri.</h1>
          <Link href="/urunler" className="btn btn-primary mt-8">Eserleri keşfet</Link>
        </section>
      )}

      <ul className="feat" aria-label="Neden merv.arts">
        {trust.map(([t, d]) => (
          <li key={t}>
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-earth">{d}</p>
          </li>
        ))}
      </ul>

      {categories.length > 0 && (
        <section aria-labelledby="turler" className="mx-auto mt-20 max-w-[1440px] px-5 sm:px-10 lg:px-14">
          <h2 id="turler" data-reveal className="font-display text-4xl sm:text-5xl">Eser türleri</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((c) => {
              const cv = catCover(c.slug);
              return (
                <li key={c.id} data-reveal>
                  <Link href={`/urunler/kategori/${c.slug}`} className="group block">
                    <div className="cat-tile">
                      <svg className="cat-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <path className="flow-line" pathLength="1" style={{ ["--d" as string]: "7s" }} d="M0 8 C 25 -2, 45 18, 70 6 S 100 12, 100 4" fill="none" strokeWidth="1.4" />
                        <path className="flow-line" pathLength="1" style={{ ["--d" as string]: "9s", ["--delay" as string]: "1.5s" }} d="M100 92 C 75 102, 55 82, 30 94 S 0 88, 0 96" fill="none" strokeWidth="1.4" />
                        <path className="flow-line" pathLength="1" style={{ ["--d" as string]: "8s", ["--delay" as string]: "3s" }} d="M4 0 C -2 30, 10 55, 3 100" fill="none" strokeWidth="1.4" />
                        <path className="flow-line" pathLength="1" style={{ ["--d" as string]: "10s", ["--delay" as string]: "2s" }} d="M96 100 C 102 70, 90 45, 97 0" fill="none" strokeWidth="1.4" />
                      </svg>
                      <div className="cat-img">
                      {cv && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cv.src.sm} width={640} height={800} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                      </div>
                    </div>
                    <p className="mt-3 font-semibold group-hover:text-cobalt">{c.name}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="koleksiyon" className="mx-auto mt-20 max-w-[1440px] px-5 sm:px-10 lg:px-14">
        <div className="flex items-end justify-between gap-6">
          <h2 id="koleksiyon" data-reveal className="font-display text-4xl sm:text-5xl">Eserler</h2>
          <Link href="/urunler" className="link-line">Filtrele ve sırala</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {latest.slice(0, 12).map((p, i) => <div key={p.id} data-reveal style={{ ["--delay" as string]: `${(i % 4) * 0.08}s` }}><ProductCard p={p} priority={i < 4} /></div>)}
        </div>
      </section>

      <section aria-labelledby="ozel" className="mx-auto mt-24 max-w-[1440px] px-5 sm:px-10 lg:px-14">
        <div data-reveal className="panel grid items-center gap-6 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <h2 id="ozel" className="font-display text-4xl leading-tight sm:text-6xl">Adınızın harfi, bir tabloda.</h2>
          <div>
            <p className="text-lg text-earth">Harf, isim ya da bir Esmâ seçin; ölçüyü ve renkleri birlikte belirleyelim. Eser yalnızca sizin için işlenir.</p>
            <Link href="/ozel-siparis" className="btn btn-primary mt-6">Teklif isteyin</Link>
          </div>
        </div>
      </section>

      <div className="mt-24">
        <ReviewBlock s={s} />
      </div>
    </>
  );
}
