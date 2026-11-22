import type { Metadata } from "next";
import Link from "next/link";
import { HeroHat } from "@/components/Hat";
import { getSettings } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Hakkında — Merve Türkdönmez",
  description: "merv.arts'ın arkasındaki sanatçı Merve Türkdönmez ve el emeği üretim anlayışı.",
  alternates: { canonical: "/hakkinda" },
};

export default async function Page() {
  const s = await getSettings();
  const paras = s.about_text?.trim()
    ? s.about_text.split(/\n{2,}|\n/).filter(Boolean)
    : [
        "merv.arts, Merve Türkdönmez'in tezhip ve hat işlerinin adı. Her eser bir levha, bir harf ya da bir çiçekle başlar; kalemle çizilir, altınla ve renkle işlenir.",
        "Seri üretim yok. Esmâ-ül Hüsnâ levhaları, harf tabloları, gül ve rokoko süslemeleri atölyede tek tek hazırlanır. Elin bıraktığı küçük izler her eseri benzersiz yapar.",
        "Beğendiğiniz bir eserin size özel bir versiyonunu da isteyebilirsiniz.",
      ];
  return (
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
  );
}
