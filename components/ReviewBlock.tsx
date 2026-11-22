import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { IconStar } from "./Icons";

export default function ReviewBlock({ s }: { s: SiteSettings }) {
  return (
    <section aria-labelledby="yorum-baslik" className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
      <div className="grid items-center gap-8 rounded-[32px] border border-line bg-paper-2/60 p-8 sm:p-12 md:grid-cols-[1fr_auto]" data-reveal>
        <div>
          <div className="flex gap-1 text-clay" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <IconStar key={i} />)}
          </div>
          <h2 id="yorum-baslik" className="mt-3 font-display text-3xl">Parçanız elinize ulaştı mı?</h2>
          <p className="mt-2 max-w-xl text-earth">
            Birkaç cümlelik yorumunuz küçük bir atölye için çok değerli. Bir öneriniz ya da sorununuz varsa doğrudan bize de yazabilirsiniz.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          {s.google_review_url ? (
            <a href={s.google_review_url} target="_blank" rel="noopener" className="btn btn-primary">Google&apos;da yorum yazın</a>
          ) : (
            <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-primary">Instagram&apos;da paylaşın</a>
          )}
          <Link href="/iletisim#oneri" className="btn btn-ghost">Öneri / şikayet bildirin</Link>
        </div>
      </div>
    </section>
  );
}
