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
      <header className="mx-auto max-w-[1440px] px-5 pt-12 sm:px-10 lg:px-14">
        <h1 className="font-display text-6xl leading-[.95] sm:text-7xl">Merhaba, <em className="text-cobalt">yazın.</em></h1>
        <p className="mt-4 max-w-2xl text-lg text-earth">İş birliği, sergi ve etkinlik davetleri ya da aklınıza takılan her şey için yazabilirsiniz.</p>
      </header>

      <section aria-labelledby="iletisim-form" className="mx-auto mt-10 max-w-[1440px] px-5 sm:px-10 lg:px-14">
        <div className="panel grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-14 lg:p-14">
          <div>
            <h2 id="iletisim-form" className="font-display text-4xl leading-tight">İletişim formu</h2>
            <ul className="mt-6 space-y-3">
              <li><a href={s.instagram_url} target="_blank" rel="noopener" className="inline-flex items-center gap-3 font-semibold hover:text-clay"><IconInstagram /> @merv.arts</a></li>
              <li><a href={s.shopier_url} target="_blank" rel="noopener" className="inline-flex items-center gap-3 font-semibold hover:text-clay"><IconBag /> Shopier mağazası</a></li>
              {s.whatsapp_number && <li><a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener" className="inline-flex items-center gap-3 font-semibold hover:text-clay"><IconWhatsApp /> WhatsApp</a></li>}
              {s.contact_email && <li><a href={`mailto:${s.contact_email}`} className="font-semibold hover:text-clay">{s.contact_email}</a></li>}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>

      <section id="oneri" aria-labelledby="oneri-baslik" className="mx-auto mt-12 max-w-[1440px] scroll-mt-24 px-5 sm:px-10 lg:px-14">
        <div className="panel grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-14 lg:p-14">
          <div>
            <h2 id="oneri-baslik" className="font-display text-4xl leading-tight">Öneri, istek ve şikayet</h2>
            <p className="mt-4 text-lg text-earth">Deneyiminizi iyileştirmek için her bildirimi dikkatle okuyoruz.</p>
          </div>
          <FeedbackForm />
        </div>
      </section>

      <ReviewBlock s={s} />
    </>
  );
}
