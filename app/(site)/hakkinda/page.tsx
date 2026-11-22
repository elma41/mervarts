import type { Metadata } from "next";
import Link from "next/link";
import { ArtGift, ArtJewel, ArtPainting, ArtVase, SpinBadge } from "@/components/Art";
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
        <p className="inline-flex rounded-full border-2 border-ink bg-mint px-4 py-1.5 text-sm font-extrabold">Sanatçı</p>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl">Merve Türkdönmez</h1>
        <div className="prose-art mt-6 text-lg">
          {paras.map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/urunler" className="btn btn-primary">Koleksiyonu görün</Link>
          <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-ghost">Instagram&apos;da takip edin</a>
        </div>
      </article>
      <div className="relative mx-auto h-[460px] w-full max-w-[440px]" aria-hidden="true">
        <div className="pop-card bob absolute left-0 top-0 flex h-56 w-44 items-center justify-center bg-sun p-5" style={{ ["--r" as string]: "-6deg" }}><ArtPainting className="h-full w-auto" /></div>
        <div className="pop-card bob-2 absolute right-0 top-10 flex h-52 w-40 items-center justify-center bg-pink p-5" style={{ ["--r" as string]: "5deg" }}><ArtVase className="h-full w-auto" /></div>
        <div className="pop-card bob-3 absolute bottom-0 left-8 flex h-48 w-40 items-center justify-center bg-sky p-5" style={{ ["--r" as string]: "3deg" }}><ArtJewel className="h-full w-auto" /></div>
        <div className="pop-card bob absolute bottom-6 right-6 flex h-44 w-36 items-center justify-center bg-mint p-5" style={{ ["--r" as string]: "-4deg" }}><ArtGift className="h-full w-auto" /></div>
        <SpinBadge className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
