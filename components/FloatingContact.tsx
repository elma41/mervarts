import type { SiteSettings } from "@/lib/types";
import { IconWhatsApp } from "./Icons";

/** Yalnızca WhatsApp numarası girildiyse görünen tek, sade iletişim butonu. */
export default function FloatingContact({ s }: { s: SiteSettings }) {
  if (!s.whatsapp_number) return null;
  return (
    <a href={`https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent("Merhaba, merv.arts eserleri hakkında bilgi almak istiyorum.")}`} target="_blank" rel="noopener" aria-label="WhatsApp ile yazın"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f6f46] text-white shadow-lg transition-transform hover:-translate-y-0.5">
      <IconWhatsApp className="h-6 w-6" />
    </a>
  );
}
