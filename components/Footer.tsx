import Link from "next/link";
import type { SiteSettings, Category } from "@/lib/types";
import { IconInstagram, IconBag, IconWhatsApp } from "./Icons";
import { Sparkle } from "./Art";

export default function Footer({ s, categories }: { s: SiteSettings; categories: Category[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-28 overflow-hidden bg-ink text-paper">
      <div className="dots-light absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl leading-tight sm:text-4xl">
              Aklındaki parçayı <span className="hl text-ink" style={{ ["--hl" as string]: "#ff4f8b" }}>birlikte</span> yapalım.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={s.instagram_url} target="_blank" rel="noopener" className="btn btn-sun !shadow-[4px_4px_0_#ff4f8b]"><IconInstagram /> @merv.arts</a>
              {s.whatsapp_number && (
                <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener" className="btn btn-wa !shadow-[4px_4px_0_#ff4f8b]"><IconWhatsApp /> WhatsApp</a>
              )}
              <a href={s.shopier_url} target="_blank" rel="noopener" className="btn btn-ghost !shadow-[4px_4px_0_#ff4f8b]"><IconBag /> Shopier</a>
            </div>
          </div>

          <nav aria-label="Koleksiyon">
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-sun">Koleksiyon</h2>
            <ul className="space-y-2.5 text-lg">
              <li><Link className="hover:text-pink" href="/urunler">Tüm ürünler</Link></li>
              {categories.map((c) => (
                <li key={c.id}><Link className="hover:text-pink" href={`/urunler/kategori/${c.slug}`}>{c.name}</Link></li>
              ))}
              <li><Link className="hover:text-pink" href="/ozel-siparis">Özel sipariş</Link></li>
            </ul>
          </nav>

          <nav aria-label="Bilgi">
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-sun">Bilgi</h2>
            <ul className="space-y-2.5 text-lg">
              <li><Link className="hover:text-pink" href="/hakkinda">Hikâye</Link></li>
              <li><Link className="hover:text-pink" href="/iletisim">İletişim</Link></li>
              <li><Link className="hover:text-pink" href="/iletisim#oneri">Öneri / Şikayet</Link></li>
              <li><Link className="hover:text-pink" href="/kvkk">KVKK Aydınlatma Metni</Link></li>
              <li><Link className="hover:text-pink" href="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
              <li><Link className="hover:text-pink" href="/cerez-politikasi">Çerez Politikası</Link></li>
            </ul>
          </nav>
        </div>

        <div className="relative mt-16 select-none" aria-hidden="true">
          <p className="font-display text-[17.5vw] leading-[0.8] tracking-[-0.06em] text-paper sm:text-[17vw] xl:text-[15rem]">
            merv<span className="text-pink">●</span>arts
          </p>
          <Sparkle className="bob absolute right-[6%] top-[-10%] h-16 w-16 sm:h-24 sm:w-24" fill="#ffd23f" />
          <Sparkle className="bob-2 absolute left-[42%] top-[-18%] h-10 w-10 sm:h-14 sm:w-14" fill="#2bd4a8" />
        </div>
      </div>
      <div className="relative border-t border-paper/20">
        <p className="mx-auto max-w-7xl px-5 py-5 text-sm text-paper/80 sm:px-8">© {year} {s.brand_name} · @merv.arts · Elde, sevgiyle yapıldı.</p>
      </div>
    </footer>
  );
}
