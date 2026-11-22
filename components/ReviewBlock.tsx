import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { IconStar } from "./Icons";

export default function ReviewBlock({ s }: { s: SiteSettings }) {
  return (
    <section aria-labelledby="yorum-baslik" className="mx-auto mt-24 max-w-[1440px] px-5 sm:px-10 lg:px-14">
      <div className="panel grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[1fr_auto]" data-reveal>
        <div>
          <div className="flex gap-1 text-gold" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <span key={i} className="star" style={{ animationDelay: `${i * 0.18}s` }}><IconStar className="h-7 w-7" /></span>)}
          </div>
          <h2 id="yorum-baslik" className="mt-4 font-display text-4xl leading-none sm:text-6xl">Eser eline ulaştı mı?</h2>
          <p className="mt-3 max-w-xl text-lg text-earth">
            Birkaç cümlelik yorumun küçük bir atölye için çok değerli. Bir önerin ya da sorunun varsa doğrudan bize de yazabilirsin.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row md:flex-col">
          {s.google_review_url ? (
            <a href={s.google_review_url} target="_blank" rel="noopener" className="btn btn-primary">Google&apos;da yorum yaz</a>
          ) : (
            <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-primary">Instagram&apos;da paylaş</a>
          )}
          <Link href="/iletisim#oneri" className="btn btn-ghost">Öneri veya şikayet bildir</Link>
        </div>
      </div>
    </section>
  );
}
