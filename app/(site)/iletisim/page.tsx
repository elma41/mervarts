import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import FeedbackForm from "@/components/forms/FeedbackForm";
import ReviewBlock from "@/components/ReviewBlock";
import { getSettings } from "@/lib/data";
import { IconBag, IconInstagram, IconWhatsApp } from "@/components/Icons";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "İletişim — iş birliği, sergi ve sorular",
  description: "merv.arts ile iletişime geçin: iş birliği, sergi/etkinlik ve genel sorular. Öneri, istek ve şikayetlerinizi de iletebilirsiniz.",
  alternates: { canonical: "/iletisim" },
};

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-12 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
        <header>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-clay">İletişim</p>
          <h1 className="mt-1 font-display text-4xl font-light sm:text-5xl">Merhaba deyin.</h1>
          <p className="mt-4 text-lg text-earth">İş birliği, sergi ve etkinlik davetleri ya da aklınıza takılan her şey için yazabilirsiniz.</p>
          <ul className="mt-8 space-y-3">
            <li><a href={s.instagram_url} target="_blank" rel="noopener" className="inline-flex items-center gap-3 font-semibold hover:text-clay"><IconInstagram /> @merv.arts</a></li>
            <li><a href={s.shopier_url} target="_blank" rel="noopener" className="inline-flex items-center gap-3 font-semibold hover:text-clay"><IconBag /> Shopier mağazası</a></li>
            {s.whatsapp_number && <li><a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener" className="inline-flex items-center gap-3 font-semibold hover:text-clay"><IconWhatsApp /> WhatsApp</a></li>}
            {s.contact_email && <li><a href={`mailto:${s.contact_email}`} className="font-semibold hover:text-clay">{s.contact_email}</a></li>}
          </ul>
        </header>
        <section aria-labelledby="iletisim-form" className="rounded-[28px] border border-line bg-paper-2/50 p-6 sm:p-10">
          <h2 id="iletisim-form" className="mb-6 font-display text-2xl">İletişim formu</h2>
          <ContactForm />
        </section>
      </div>

      <section id="oneri" aria-labelledby="oneri-baslik" className="mx-auto mt-20 max-w-3xl scroll-mt-24 px-5 sm:px-8">
        <h2 id="oneri-baslik" className="font-display text-3xl">Öneri, istek ve şikayet</h2>
        <p className="mt-2 text-earth">Deneyiminizi iyileştirmek için her bildirimi dikkatle okuyoruz.</p>
        <div className="mt-6 rounded-[28px] border border-line bg-paper p-6 sm:p-10"><FeedbackForm /></div>
      </section>

      <ReviewBlock s={s} />
    </>
  );
}
