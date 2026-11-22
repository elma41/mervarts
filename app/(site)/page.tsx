import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ReviewBlock from "@/components/ReviewBlock";
import Marquee from "@/components/Marquee";
import { ART_BY_SLUG, ART_LIST, ArtGift, ArtJewel, ArtPainting, ArtVase, Sparkle, SpinBadge, TILE_BG } from "@/components/Art";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { price, productImage, sortImages } from "@/lib/format";
import { IconArrow, IconBrush, IconHeart, IconInstagram, IconPackage } from "@/components/Icons";
import type { Product } from "@/lib/types";

export const revalidate = 60;

function HeroCard({ p, art: Art, bg, className, style, priority }: {
  p?: Product; art: typeof ArtPainting; bg: string; className: string; style?: React.CSSProperties; priority?: boolean;
}) {
  const img = p ? sortImages(p.product_images)[0] : undefined;
  const src = img ? productImage(img.path) : null;
  const inner = (
    <div className={`pop-card relative h-full w-full overflow-hidden ${src ? "bg-paper-2" : bg}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src.sm} srcSet={src.srcSet} sizes="(min-width:1024px) 22vw, 45vw" width={640} height={800} alt={img?.alt || p?.name || ""}
          className="h-full w-full object-cover" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
      ) : (
        <div className="paper-grain flex h-full w-full items-center justify-center p-6"><Art className="h-full w-auto" /></div>
      )}
      {p && (
        <span className="absolute inset-x-3 bottom-3 truncate rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-extrabold">
          {p.name}{p.pricing_mode === "fixed" && p.price != null ? ` · ${price(p.price)}` : ""}
        </span>
      )}
    </div>
  );
  return (
    <div className={className} style={style}>
      {p ? <Link href={`/urun/${p.slug}`} className="block h-full w-full transition-transform duration-500 hover:-translate-y-2 hover:rotate-0">{inner}</Link> : inner}
    </div>
  );
}

export default async function Home() {
  const [s, categories, featured, latest] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 12 }),
  ]);
  const heroProducts = (featured.length ? featured : latest).slice(0, 3);
  const showcase = latest.slice(0, 8);
  const spotlight = featured[0] || latest[0];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative -mt-[84px] overflow-hidden pt-[84px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="blob absolute -left-24 top-10 h-80 w-80 bg-blush opacity-80 blur-2xl" />
          <div className="blob absolute right-[-6rem] top-40 h-96 w-96 bg-lav opacity-80 blur-2xl" style={{ animationDelay: "-3s" }} />
          <div className="blob absolute bottom-0 left-1/3 h-72 w-72 bg-[#fff0b8] opacity-90 blur-2xl" style={{ animationDelay: "-6s" }} />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:pt-20">
          <div>
            <p className="pop-in inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-4 py-1.5 text-sm font-extrabold" style={{ ["--r" as string]: "-2deg" }}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-ink" aria-hidden="true" /> Atölyeden yeni parçalar
            </p>
            <h1 className="mt-6 font-display text-[3.1rem] leading-[0.92] sm:text-7xl lg:text-[5.6rem]">
              Elde yapıldı.
              <br />
              <span className="hl" style={{ ["--hl" as string]: "#ff4f8b" }}>Tek</span> üretildi.
              <br />
              <span className="relative inline-block">
                Senin
                <svg viewBox="0 0 300 30" className="absolute -bottom-3 left-0 h-4 w-full" aria-hidden="true"><path d="M4 20C70 6 160 4 296 16" fill="none" stroke="#6c3cf0" strokeWidth="8" strokeLinecap="round" className="brush" /></svg>
              </span>{" "}
              oldu<span className="text-pink">.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg font-medium leading-relaxed text-earth sm:text-xl">
              {s.brand_name}&apos;in atölyesinden tablolar, seramikler, takılar ve hediyeler. Her biri tek; istersen sana özel de yapılır.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/urunler" className="btn btn-primary !px-7 text-base">Koleksiyonu keşfet <IconArrow /></Link>
              <Link href="/ozel-siparis" className="btn btn-ghost !px-7 text-base">Sana özel yaptır ✿</Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-3 text-sm font-extrabold" aria-label="Öne çıkanlar">
              <li className="rounded-full border-2 border-ink bg-paper px-4 py-2">✋ %100 el yapımı</li>
              <li className="rounded-full border-2 border-ink bg-paper px-4 py-2">✦ Tek ürün</li>
              <li className="rounded-full border-2 border-ink bg-paper px-4 py-2">🔒 Shopier güvencesi</li>
            </ul>
          </div>

          {/* Eğik ürün kolajı */}
          <div className="relative mx-auto mt-4 h-[400px] w-full max-w-[520px] sm:mt-0 sm:h-[540px]">
            <HeroCard p={heroProducts[0]} art={ArtPainting} bg="bg-sun" priority
              className="pop-in absolute left-[2%] top-[4%] h-[58%] w-[52%]" style={{ ["--r" as string]: "-7deg", transform: "rotate(-7deg)" }} />
            <HeroCard p={heroProducts[1]} art={ArtVase} bg="bg-pink"
              className="pop-in-2 absolute right-[2%] top-[0%] h-[50%] w-[44%]" style={{ ["--r" as string]: "6deg", transform: "rotate(6deg)" }} />
            <HeroCard p={heroProducts[2]} art={ArtJewel} bg="bg-sky"
              className="pop-in-3 absolute bottom-[2%] left-[26%] h-[48%] w-[48%]" style={{ ["--r" as string]: "-2deg", transform: "rotate(-2deg)" }} />
            <SpinBadge className="pop-in-4 absolute -right-2 bottom-[16%] hidden h-36 w-36 sm:block" />
            <Sparkle className="bob absolute left-[-4%] top-[60%] h-14 w-14" fill="#ff8a1f" />
            <Sparkle className="bob-3 absolute right-[44%] top-[-4%] h-10 w-10" fill="#2bd4a8" />
          </div>
        </div>
      </section>

      {/* ================= KAYAN ŞERİTLER ================= */}
      <div className="relative z-10 -mt-4 mb-6 py-10" aria-label="El yapımı, tek ürün, kişiye özel">
        <Marquee className="relative z-10 bg-pink text-ink" rotate="-2.5deg" items={["El yapımı", "Tek ürün", "Kişiye özel", "Tablo", "Seramik", "Takı", "Hediyelik", "Sevgiyle paketlenir"]} />
        <Marquee className="relative -mt-[22px] bg-violet text-white" reverse rotate="2.5deg" items={["merv.arts", "Merve Türkdönmez", "Atölyeden sana", "Her parça bir hikâye", "Shopier ile güvenli"]} />
      </div>

      {/* ================= ÜRÜNLER ================= */}
      <section aria-labelledby="vitrin-baslik" className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4" data-reveal>
          <h2 id="vitrin-baslik" className="font-display text-5xl leading-none sm:text-6xl">
            Yeni <span className="hl" style={{ ["--hl" as string]: "#ffd23f" }}>gelenler</span>
          </h2>
          <Link href="/urunler" className="btn btn-dark">Tümünü gör <IconArrow /></Link>
        </div>

        {showcase.length > 0 ? (
          <ul className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-10 pt-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {showcase.map((p, i) => (
              <li key={p.id} className="w-[78%] shrink-0 snap-start sm:w-auto" data-reveal data-reveal-delay={String((i % 4) + 0)}>
                <ProductCard p={p} index={i} priority={i < 2} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="pop-card grid items-center gap-8 bg-lav p-8 sm:grid-cols-[1fr_auto] sm:p-12" data-reveal>
            <div>
              <p className="font-display text-3xl sm:text-4xl">Yeni parçalar fırından çıkmak üzere 🔥</p>
              <p className="mt-3 max-w-xl text-lg font-medium text-earth">Koleksiyon çok yakında burada. O zamana kadar atölyede neler olduğunu Instagram&apos;dan izleyebilirsin.</p>
              <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-primary mt-6"><IconInstagram /> @merv.arts&apos;ı takip et</a>
            </div>
            <div className="hidden gap-3 sm:flex" aria-hidden="true">
              {ART_LIST.slice(0, 3).map((A, i) => (
                <div key={i} className={`pop-card bob flex h-36 w-28 items-center justify-center p-3 ${TILE_BG[i]}`} style={{ ["--r" as string]: `${(i - 1) * 6}deg`, animationDelay: `${i * 0.5}s` }}><A className="h-full w-auto" /></div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================= KATEGORİ BENTO ================= */}
      {categories.length > 0 && (
        <section aria-labelledby="kat-baslik" className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
          <h2 id="kat-baslik" className="mb-8 font-display text-4xl sm:text-5xl" data-reveal>Ne arıyorsun?</h2>
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {categories.map((c, i) => {
              const A = ART_BY_SLUG[c.slug] || ART_LIST[i % ART_LIST.length];
              return (
                <li key={c.id} data-reveal data-reveal-delay={String((i % 4) + 0)}>
                  <Link href={`/urunler/kategori/${c.slug}`} className={`pop-card group relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-5 transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-2deg] ${TILE_BG[i % TILE_BG.length]}`}>
                    <span className="relative z-10 font-display text-2xl leading-tight sm:text-3xl">{c.name}</span>
                    <A className="absolute -bottom-6 -right-6 h-[75%] w-auto transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110" />
                    <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink bg-paper transition-transform group-hover:rotate-45" aria-hidden="true"><IconArrow /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ================= SPOTLIGHT ================= */}
      {spotlight && (
        <section aria-labelledby="spot-baslik" className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
          <div className="pop-card grid overflow-hidden bg-sun md:grid-cols-2" data-reveal>
            <div className="relative aspect-[4/5] border-b-[2.5px] border-ink bg-paper-2 md:aspect-auto md:border-b-0 md:border-r-[2.5px]">
              {(() => {
                const im = sortImages(spotlight.product_images)[0];
                if (!im) return <div className="paper-grain flex h-full items-center justify-center p-12"><ArtGift className="h-full max-h-80 w-auto" /></div>;
                const src = productImage(im.path);
                // eslint-disable-next-line @next/next/no-img-element
                return <img src={src.lg} srcSet={src.srcSet} sizes="(min-width:768px) 50vw, 100vw" width={1600} height={2000} alt={im.alt || spotlight.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />;
              })()}
              <span className="badge absolute left-4 top-4 !bg-pink !text-sm">Atölyenin gözdesi</span>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em]">Öne çıkan parça</p>
              <h2 id="spot-baslik" className="mt-3 font-display text-4xl leading-none sm:text-5xl">{spotlight.name}</h2>
              {spotlight.description && <p className="mt-5 line-clamp-4 text-lg font-medium">{spotlight.description}</p>}
              <p className="mt-6 font-display text-3xl">{spotlight.pricing_mode === "fixed" && spotlight.price != null ? price(spotlight.price) : "Fiyat için sor"}</p>
              <Link href={`/urun/${spotlight.slug}`} className="btn btn-dark mt-7 self-start">İncele <IconArrow /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= SÜREÇ ================= */}
      <section aria-labelledby="surec-baslik" className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6" data-reveal>
          <h2 id="surec-baslik" className="max-w-2xl font-display text-4xl leading-[0.95] sm:text-6xl">
            Sana özel parça, <span className="hl" style={{ ["--hl" as string]: "#2bd4a8" }}>3 adımda</span>.
          </h2>
          <Link href="/ozel-siparis" className="btn btn-primary">Özel sipariş ver <IconArrow /></Link>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {[
            { i: <IconHeart />, t: "Anlat", d: "Ölçü, renk, isim ya da bir anı… Formdan veya WhatsApp'tan yaz.", bg: "bg-pink", r: "-2deg" },
            { i: <IconBrush />, t: "Elde yapılsın", d: "Fiyat ve taslağı onayla, parçan atölyede tek tek hazırlansın.", bg: "bg-sky", r: "1.5deg" },
            { i: <IconPackage />, t: "Kapına gelsin", d: "Özenle paketlenir, kargoya verilir. Ödeme Shopier güvencesiyle.", bg: "bg-mint", r: "-1deg" },
          ].map((x, n) => (
            <li key={x.t} className={`pop-card relative p-7 ${x.bg}`} style={{ transform: `rotate(${x.r})` }} data-reveal data-reveal-delay={String(n + 1)}>
              <span className="absolute -top-5 right-6 flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-ink bg-paper font-display text-xl">{n + 1}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-ink bg-paper">{x.i}</span>
              <h3 className="mt-5 font-display text-3xl">{x.t}</h3>
              <p className="mt-2 text-lg font-medium">{x.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ================= SANATÇI ================= */}
      <section aria-labelledby="sanatci-baslik" className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[32px] border-[2.5px] border-ink bg-violet p-8 text-white shadow-[6px_6px_0_#1e1233] sm:p-14" data-reveal>
          <div className="dots-light absolute inset-0" aria-hidden="true" />
          <Sparkle className="bob absolute right-8 top-8 h-16 w-16" fill="#ffd23f" />
          <div className="relative max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-sun">Atölyenin arkasındaki isim</p>
            <h2 id="sanatci-baslik" className="mt-3 font-display text-5xl leading-none sm:text-6xl">Merve Türkdönmez</h2>
            <p className="mt-6 text-xl font-medium leading-relaxed">
              {s.about_text?.trim()
                ? s.about_text.split("\n")[0]
                : "Fırçadan çamura, boncuktan kâğıda; merv.arts gündelik hayata küçük, kişisel güzellikler katan el yapımı işlerin adresi."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/hakkinda" className="btn btn-sun">Hikâyeyi oku <IconArrow /></Link>
              <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-ghost"><IconInstagram /> Instagram</a>
            </div>
          </div>
        </div>
      </section>

      <ReviewBlock s={s} />
    </>
  );
}
