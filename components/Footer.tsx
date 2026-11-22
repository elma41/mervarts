import Link from "next/link";
import type { SiteSettings, Category } from "@/lib/types";
import { Logo } from "./Header";

export default function Footer({ s, categories }: { s: SiteSettings; categories: Category[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-14">
        <div>
          <Logo s={s} />
          <p className="mt-4 max-w-[34ch] text-earth">{s.tagline}. Her eser tek tek, atölyede elde yapılır.</p>
          <Link href="/ozel-siparis" className="btn btn-primary mt-6">Size özel yaptırın</Link>
        </div>

        <nav aria-label="Koleksiyon">
          <h2 className="mb-4 font-display text-lg">Koleksiyon</h2>
          <ul className="space-y-2.5">
            <li><Link className="hover:text-cobalt" href="/urunler">Tüm eserler</Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link className="hover:text-cobalt" href={`/urunler/kategori/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Atölye">
          <h2 className="mb-4 font-display text-lg">Atölye</h2>
          <ul className="space-y-2.5">
            <li><Link className="hover:text-cobalt" href="/hakkinda">Merve Türkdönmez</Link></li>
            <li><Link className="hover:text-cobalt" href="/iletisim">İletişim</Link></li>
            <li><Link className="hover:text-cobalt" href="/iletisim#oneri">Öneri ve şikayet</Link></li>
            <li><a className="hover:text-cobalt" href={s.instagram_url} target="_blank" rel="noopener">Instagram</a></li>
            <li><a className="hover:text-cobalt" href={s.shopier_url} target="_blank" rel="noopener">Shopier mağazası</a></li>
            {s.whatsapp_number && <li><a className="hover:text-cobalt" href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener">WhatsApp</a></li>}
          </ul>
        </nav>

        <nav aria-label="Yasal">
          <h2 className="mb-4 font-display text-lg">Yasal</h2>
          <ul className="space-y-2.5">
            <li><Link className="hover:text-cobalt" href="/kvkk">KVKK aydınlatma metni</Link></li>
            <li><Link className="hover:text-cobalt" href="/gizlilik-politikasi">Gizlilik politikası</Link></li>
            <li><Link className="hover:text-cobalt" href="/cerez-politikasi">Çerez politikası</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1440px] px-5 py-6 text-sm text-earth sm:px-10 lg:px-14">© {year} {s.brand_name}. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
