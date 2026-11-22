import Link from "next/link";
import HeroArt from "@/components/HeroArt";
import ProductCard from "@/components/ProductCard";
import ReviewBlock from "@/components/ReviewBlock";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { IconArrow, IconBrush, IconHeart, IconInstagram, IconPackage } from "@/components/Icons";

export const revalidate = 60;

export default async function Home() {
  const [s, categories, featured, latest] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 6 }),
    getProducts({ limit: 6 }),
  ]);
  const showcase = featured.length >= 3 ? featured : latest;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden paper-grain">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:pb-24 md:pt-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-earth">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" /> El emeği atölye
            </p>
            <h1 className="font-display text-[2.6rem] font-light leading-[1.04] sm:text-6xl lg:text-[4.4rem]">
              Her parça <em className="font-normal text-clay">bir kez</em> yapılır,
              <br className="hidden sm:block" /> bir kişiye ait olur.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-earth">
              {s.brand_name}&apos;in atölyesinden çıkan tablolar, seramikler ve küçük hediyeler. Sipariş üzerine, ölçünüze ve hikâyenize göre de üretilir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/urunler" className="btn btn-primary">Koleksiyonu keşfet <IconArrow /></Link>
              <Link href="/ozel-siparis" className="btn btn-ghost">Size özel yaptırın</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6 text-sm">
              <div><dt className="text-earth">Üretim</dt><dd className="font-display text-xl">%100 elde</dd></div>
              <div><dt className="text-earth">Seri</dt><dd className="font-display text-xl">Tek ürün</dd></div>
              <div><dt className="text-earth">Ödeme</dt><dd className="font-display text-xl">Shopier</dd></div>
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-[460px]">
            <HeroArt />
            <p className="absolute -bottom-3 left-4 rotate-[-3deg] rounded-full bg-ink px-4 py-2 font-display text-sm italic text-paper shadow-lg">imza: merv.</p>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      {categories.length > 0 && (
        <section aria-labelledby="kat-baslik" className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
          <h2 id="kat-baslik" className="sr-only">Kategoriler</h2>
          <ul className="flex flex-wrap gap-3" data-reveal>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/urunler/kategori/${c.slug}`} className="inline-flex min-h-[48px] items-center rounded-full border border-line bg-paper px-5 font-medium transition-colors hover:border-clay hover:text-clay">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* VİTRİN */}
      <section aria-labelledby="vitrin-baslik" className="mx-auto max-w-7xl px-5 pt-14 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4" data-reveal>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-clay">Atölyeden</p>
            <h2 id="vitrin-baslik" className="font-display text-3xl sm:text-4xl">Yeni ve öne çıkanlar</h2>
          </div>
          <Link href="/urunler" className="hidden items-center gap-2 font-semibold hover:text-clay sm:inline-flex">Tümünü gör <IconArrow /></Link>
        </div>
        {showcase.length > 0 ? (
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p, i) => (
              <li key={p.id} data-reveal data-reveal-delay={String((i % 3) + 1)}>
                <ProductCard p={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-paper-2/50 px-6 py-14 text-center">
            <p className="font-display text-2xl">Yeni parçalar hazırlanıyor.</p>
            <p className="mt-2 text-earth">Koleksiyon yakında burada. O zamana kadar Instagram&apos;dan atölyeyi takip edebilirsiniz.</p>
            <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-dark mt-6"><IconInstagram /> @merv.arts</a>
          </div>
        )}
      </section>

      {/* SÜREÇ */}
      <section aria-labelledby="surec-baslik" className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <div className="rounded-[32px] bg-ink px-6 py-14 text-paper sm:px-12">
          <h2 id="surec-baslik" className="max-w-2xl font-display text-3xl font-light sm:text-4xl" data-reveal>
            Size özel bir parça <em className="text-[#e7b59f]">üç adımda</em> hazır.
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { i: <IconHeart />, t: "Anlatın", d: "Ölçü, renk, isim ya da bir anı… Formdan ya da WhatsApp'tan fikrinizi paylaşın." },
              { i: <IconBrush />, t: "Elde hazırlanır", d: "Taslak ve fiyat onayınızdan sonra parçanız atölyede tek tek üretilir." },
              { i: <IconPackage />, t: "Özenle gönderilir", d: "Güvenli paketlenip kargoya verilir; ödeme Shopier ile güvence altındadır." },
            ].map((x, n) => (
              <li key={x.t} className="border-t border-paper/20 pt-6" data-reveal data-reveal-delay={String(n + 1)}>
                <span className="flex items-center gap-3 text-[#e7b59f]">{x.i}<span className="font-display text-sm">0{n + 1}</span></span>
                <h3 className="mt-3 font-display text-2xl">{x.t}</h3>
                <p className="mt-2 text-paper/90">{x.d}</p>
              </li>
            ))}
          </ol>
          <Link href="/ozel-siparis" className="btn mt-10 bg-paper text-ink hover:bg-white">Özel sipariş formu <IconArrow /></Link>
        </div>
      </section>

      {/* HAKKINDA KISA */}
      <section aria-labelledby="hakkinda-baslik" className="mx-auto mt-24 grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-2">
        <div data-reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-clay">Sanatçı</p>
          <h2 id="hakkinda-baslik" className="font-display text-3xl sm:text-4xl">Merve Türkdönmez</h2>
        </div>
        <div data-reveal data-reveal-delay="1">
          <p className="text-lg leading-relaxed text-earth">
            {s.about_text?.trim()
              ? s.about_text.split("\n")[0]
              : "Fırçadan çamura, boncuktan kâğıda; merv.arts gündelik hayata küçük, kişisel güzellikler katan el yapımı işlerin adresi."}
          </p>
          <Link href="/hakkinda" className="mt-5 inline-flex items-center gap-2 font-semibold text-clay hover:underline">Hikâyenin devamı <IconArrow /></Link>
        </div>
      </section>

      <ReviewBlock s={s} />
    </>
  );
}
