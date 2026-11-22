import type { Metadata } from "next";
import Link from "next/link";
import HeroArt from "@/components/HeroArt";
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
        "merv.arts, Merve Türkdönmez'in el emeğiyle ürettiği özgün işlerin adı. Her parça; bir fikirle, bir renkle ya da birinin anlattığı küçük bir hikâyeyle başlar.",
        "Seri üretim yok. Tuval, seramik, takı ya da hediye; hepsi atölyede tek tek hazırlanır. Bu yüzden her parçada elin bıraktığı küçük izler vardır ve bunlar onu özel kılar.",
        "Beğendiğiniz bir işin size özel bir versiyonunu da isteyebilirsiniz.",
      ];
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-12 sm:px-8 md:grid-cols-[1.1fr_.9fr]">
      <article>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-clay">Sanatçı</p>
        <h1 className="mt-1 font-display text-4xl font-light sm:text-5xl">Merve Türkdönmez</h1>
        <div className="prose-art mt-6 text-lg">
          {paras.map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/urunler" className="btn btn-primary">Koleksiyonu görün</Link>
          <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-ghost">Instagram&apos;da takip edin</a>
        </div>
      </article>
      <div className="mx-auto w-full max-w-[420px]"><HeroArt /></div>
    </div>
  );
}
