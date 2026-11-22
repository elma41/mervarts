import type { Metadata } from "next";
import Link from "next/link";
import { HeroHat } from "@/components/Hat";
import { getProducts, getSettings } from "@/lib/data";
import { productImage, sortImages } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Hakkında — Merve Türkdönmez",
  description: "merv.arts'ın arkasındaki sanatçı Merve Türkdönmez ve el emeği üretim anlayışı.",
  alternates: { canonical: "/hakkinda" },
};

export default async function Page() {
  const [s, products] = await Promise.all([getSettings(), getProducts({ limit: 12 })]);
  const works = products.filter((p) => sortImages(p.product_images)[0]).slice(0, 3);
  const paras = s.about_text?.trim()
    ? s.about_text.split(/\n{2,}|\n/).filter(Boolean)
    : [
        "merv.arts, Merve Türkdönmez'in tezhip ve hat işlerinin adı. Her eser bir levha, bir harf ya da bir çiçekle başlar; kalemle çizilir, altınla ve renkle işlenir.",
        "Seri üretim yok. Esmâ-ül Hüsnâ levhaları, harf tabloları, gül ve rokoko süslemeleri atölyede tek tek hazırlanır. Elin bıraktığı küçük izler her eseri benzersiz yapar.",
        "Beğendiğiniz bir eserin size özel bir versiyonunu da isteyebilirsiniz.",
      ];
  return (
    <>
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-12 sm:px-10 lg:px-14 md:grid-cols-[1.1fr_.9fr]">
      <article>
        <h1 className="font-display text-6xl leading-[.95] sm:text-7xl">Merve Türkdönmez</h1>
        <div className="prose-art mt-6 text-lg">
          {paras.map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/urunler" className="btn btn-primary">Koleksiyonu görün</Link>
          <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-ghost">Instagram&apos;da takip edin</a>
        </div>
      </article>
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px] text-ink"><HeroHat className="absolute inset-0 h-full w-full overflow-visible" /></div>
    </div>

    {works.length > 0 && (
      <section aria-labelledby="atolye" className="mx-auto mt-20 max-w-[1440px] px-5 pb-8 sm:px-10 lg:px-14">
        <h2 id="atolye" data-reveal className="font-display text-4xl sm:text-5xl">Atölyeden eserler</h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-3">
          {works.map((p, i) => {
            const im = productImage(sortImages(p.product_images)[0].path);
            return (
              <li key={p.id} data-reveal style={{ ["--delay" as string]: `${i * 0.12}s` }} className={i === 1 ? "sm:mt-14" : ""}>
                <Link href={`/urun/${p.slug}`} className="group block">
                  <div className="frame">
                    <div className="card-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="img-main" src={im.sm} srcSet={im.srcSet} sizes="(min-width:640px) 30vw, 90vw" width={640} height={800} alt={sortImages(p.product_images)[0].alt || p.name} loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <p className="mt-4 font-display text-2xl group-hover:text-cobalt">{p.name}</p>
                  <p className="text-sm text-earth">{p.categories?.name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    )}
    </>
  );
}
