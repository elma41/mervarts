import type { Metadata } from "next";
import QuoteForm from "@/components/forms/QuoteForm";
import { getSettings } from "@/lib/data";
import { waLink } from "@/lib/format";
import { IconWhatsApp } from "@/components/Icons";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Özel sipariş — size özel el yapımı tasarım",
  description: "Ölçünüze, renginize ve hikâyenize göre el yapımı tablo, seramik, takı ya da hediye yaptırın. Hızlı teklif formu.",
  alternates: { canonical: "/ozel-siparis" },
};

export default async function Page() {
  const s = await getSettings();
  const wa = waLink(s.whatsapp_number, "Merhaba, özel sipariş için bilgi almak istiyorum.");
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-12 sm:px-8 lg:grid-cols-[.9fr_1.1fr]">
      <header>
        <p className="inline-flex rounded-full border-2 border-ink bg-mint px-4 py-1.5 text-sm font-extrabold">Kişiye özel</p>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl">Aklındaki parçayı <span className="hl" style={{ ["--hl" as string]: "#ffd23f" }}>birlikte</span> yapalım.</h1>
        <p className="mt-4 text-lg text-earth">
          Bir isim, bir tarih, bir renk paleti ya da bir fotoğraf… Formu doldurun; ölçü, malzeme ve teslim süresine göre size özel fiyat iletelim.
        </p>
        <ol className="mt-8 space-y-4 border-l border-line pl-6">
          <li><strong className="font-display text-lg">1. Talep</strong><p className="text-earth">Formu gönderin ya da WhatsApp&apos;tan yazın.</p></li>
          <li><strong className="font-display text-lg">2. Teklif ve onay</strong><p className="text-earth">Fiyat, süre ve gerekirse taslak paylaşılır.</p></li>
          <li><strong className="font-display text-lg">3. Üretim ve teslim</strong><p className="text-earth">Ödeme Shopier üzerinden alınır, parça elde hazırlanıp gönderilir.</p></li>
        </ol>
        {wa && <a href={wa} target="_blank" rel="noopener" className="btn btn-wa mt-8"><IconWhatsApp /> WhatsApp ile yazın</a>}
      </header>
      <section aria-label="Teklif formu" className="pop-card bg-lav p-6 sm:p-10">
        <QuoteForm />
      </section>
    </div>
  );
}
