import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Motion from "@/components/Motion";
import FloatingContact from "@/components/FloatingContact";
import ScrollButtons from "@/components/ScrollButtons";
import JsonLd from "@/components/JsonLd";
import { getCategories, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/config";
import { publicUrl } from "@/lib/format";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, categories] = await Promise.all([getSettings(), getCategories()]);
  const sameAs = [s.instagram_url, s.shopier_url].filter(Boolean);
  return (
    <>
      <a href="#icerik" className="skip-link">İçeriğe geç</a>
      <Header s={s} />
      <main id="icerik">{children}</main>
      <Footer s={s} categories={categories} />
      <FloatingContact s={s} />
      <ScrollButtons />
      <Reveal />
      <Motion />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#sanatci`,
              name: "Merve Türkdönmez",
              alternateName: "merv.arts",
              jobTitle: "Sanatçı, el emeği tasarımcı",
              url: SITE_URL,
              sameAs,
            },
            {
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#isletme`,
              name: `${s.brand_name} · merv.arts`,
              description: s.tagline,
              url: SITE_URL,
              image: s.logo_path ? publicUrl("branding", s.logo_path) : `${SITE_URL}/opengraph-image`,
              founder: { "@id": `${SITE_URL}/#sanatci` },
              ...(s.whatsapp_number ? { telephone: `+${s.whatsapp_number}` } : {}),
              ...(s.contact_email ? { email: s.contact_email } : {}),
              address: { "@type": "PostalAddress", addressCountry: "TR" },
              sameAs,
            },
            { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: SITE_URL, name: "merv.arts", inLanguage: "tr-TR" },
          ],
        }}
      />
    </>
  );
}
