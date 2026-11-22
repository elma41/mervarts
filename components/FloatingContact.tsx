import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

/** Sayfanın sağ kenarında duran hızlı eylemler: teklif, WhatsApp, Instagram, Shopier. */
export default function FloatingContact({ s }: { s: SiteSettings }) {
  const wa = s.whatsapp_number
    ? `https://wa.me/${s.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent("Merhaba, merv.arts eserleri hakkında bilgi almak istiyorum.")}`
    : null;
  const base = "block rounded-l-2xl px-4 py-3 text-sm font-bold shadow-lg transition-transform hover:-translate-x-1 sm:px-5 sm:py-3.5 sm:text-base";
  return (
    <nav aria-label="Hızlı işlemler" className="fixed right-0 top-1/2 z-30 flex -translate-y-1/2 flex-col items-end gap-2">
      <Link href="/ozel-siparis" className={`${base} bg-clay text-white`}>Teklif al</Link>
      {wa && <a href={wa} target="_blank" rel="noopener" className={`${base} bg-[#1f6f46] text-white`}>WhatsApp</a>}
      {s.instagram_url && <a href={s.instagram_url} target="_blank" rel="noopener" className={`${base} bg-white text-ink`}>Instagram</a>}
      {s.shopier_url && <a href={s.shopier_url} target="_blank" rel="noopener" className={`${base} bg-ink text-white`}>Shopier</a>}
    </nav>
  );
}
