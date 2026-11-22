import type { SiteSettings } from "@/lib/types";
import { IconInstagram, IconWhatsApp } from "./Icons";

export default function FloatingContact({ s }: { s: SiteSettings }) {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2">
      <a href={s.instagram_url} target="_blank" rel="noopener" aria-label="Instagram'da merv.arts" className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink shadow-lg ring-1 ring-line transition-transform hover:-translate-y-0.5">
        <IconInstagram />
      </a>
      {s.whatsapp_number && (
        <a href={`https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Merhaba, merv.arts ürünleri hakkında bilgi almak istiyorum.")}`} target="_blank" rel="noopener" aria-label="WhatsApp ile yazın" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f6f46] text-white shadow-lg transition-transform hover:-translate-y-0.5">
          <IconWhatsApp className="h-6 w-6" />
        </a>
      )}
    </div>
  );
}
