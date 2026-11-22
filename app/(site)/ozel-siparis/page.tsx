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
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-12 sm:px-10 lg:px-14 lg:grid-cols-[.9fr_1.1fr]">
      <header>
        <h1 className="font-display text-6xl font-semibold leading-[.95] sm:text-7xl xl:text-8xl">Aklındaki parçayı <em className="text-cobalt">birlikte</em> yapalım.</h1>
        <p className="mt-6 text-xl font-medium leading-relaxed text-ink/90 sm:text-2xl">
          Bir isim, bir tarih, bir renk paleti ya da bir fotoğraf… Formu doldurun; ölçü, malzeme ve teslim süresine göre size özel fiyat iletelim.
        </p>
        <ol className="mt-10 space-y-7 border-l-2 border-clay/40 pl-7">
          <li><strong className="font-display text-3xl font-semibold text-clay-dark">1. Talep</strong><p className="mt-1 text-xl leading-snug text-ink/85">Formu gönderin ya da WhatsApp&apos;tan yazın.</p></li>
          <li><strong className="font-display text-3xl font-semibold text-clay-dark">2. Teklif ve onay</strong><p className="mt-1 text-xl leading-snug text-ink/85">Fiyat, süre ve gerekirse taslak paylaşılır.</p></li>
          <li><strong className="font-display text-3xl font-semibold text-clay-dark">3. Üretim ve teslim</strong><p className="mt-1 text-xl leading-snug text-ink/85">Ödeme Shopier üzerinden alınır, parça elde hazırlanıp gönderilir.</p></li>
        </ol>
        {wa && <a href={wa} target="_blank" rel="noopener" className="btn btn-wa mt-8"><IconWhatsApp /> WhatsApp ile yazın</a>}
      </header>
      <section aria-label="Teklif formu" className="panel p-6 sm:p-10">
        <QuoteForm />
      </section>
    </div>
  );
}
