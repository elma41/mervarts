import Link from "next/link";
import type { SiteSettings, Category } from "@/lib/types";
import { IconInstagram, IconBag, IconWhatsApp } from "./Icons";
import { Logo } from "./Header";

export default function Footer({ s, categories }: { s: SiteSettings; categories: Category[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-paper-2/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo s={s} />
          <p className="mt-4 max-w-sm text-earth">{s.tagline}. Her parça tek tek, elde hazırlanır.</p>
          <div className="mt-5 flex gap-2">
            <a href={s.instagram_url} target="_blank" rel="noopener" aria-label="Instagram'da merv.arts" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-clay hover:text-clay">
              <IconInstagram />
            </a>
            <a href={s.shopier_url} target="_blank" rel="noopener" aria-label="Shopier mağazası" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-clay hover:text-clay">
              <IconBag />
            </a>
            {s.whatsapp_number && (
              <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener" aria-label="WhatsApp ile yazın" className="flex h-11 w-11 items-center justify-center rounded-full border border-line hover:border-clay hover:text-clay">
                <IconWhatsApp />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Koleksiyon">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-earth">Koleksiyon</h2>
          <ul className="space-y-2">
            <li><Link className="hover:text-clay" href="/urunler">Tüm ürünler</Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link className="hover:text-clay" href={`/urunler/kategori/${c.slug}`}>{c.name}</Link></li>
            ))}
            <li><Link className="hover:text-clay" href="/ozel-siparis">Özel sipariş</Link></li>
          </ul>
        </nav>

        <nav aria-label="Kurumsal">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-earth">Bilgi</h2>
          <ul className="space-y-2">
            <li><Link className="hover:text-clay" href="/hakkinda">Hakkında</Link></li>
            <li><Link className="hover:text-clay" href="/iletisim">İletişim</Link></li>
            <li><Link className="hover:text-clay" href="/iletisim#oneri">Öneri / Şikayet</Link></li>
            <li><Link className="hover:text-clay" href="/kvkk">KVKK Aydınlatma Metni</Link></li>
            <li><Link className="hover:text-clay" href="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
            <li><Link className="hover:text-clay" href="/cerez-politikasi">Çerez Politikası</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-5 py-5 text-sm text-earth sm:px-8">© {year} {s.brand_name} · @merv.arts · Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
