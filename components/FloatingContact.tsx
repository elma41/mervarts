import type { SiteSettings } from "@/lib/types";
import { IconInstagram, IconWhatsApp } from "./Icons";

export default function FloatingContact({ s }: { s: SiteSettings }) {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3">
      <a href={s.instagram_url} target="_blank" rel="noopener" aria-label="Instagram'da merv.arts"
        className="wiggle flex h-13 w-13 h-[52px] w-[52px] items-center justify-center rounded-full border-[2.5px] border-ink bg-pink text-ink shadow-[3px_3px_0_#1e1233]">
        <IconInstagram />
      </a>
      {s.whatsapp_number && (
        <a href={`https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Merhaba, merv.arts ürünleri hakkında bilgi almak istiyorum.")}`} target="_blank" rel="noopener" aria-label="WhatsApp ile yazın"
          className="wiggle flex h-[52px] w-[52px] items-center justify-center rounded-full border-[2.5px] border-ink bg-[#25d366] text-ink shadow-[3px_3px_0_#1e1233]">
          <IconWhatsApp className="h-6 w-6" />
        </a>
      )}
    </div>
  );
}
