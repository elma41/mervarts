import type { Metadata } from "next";
import LegalView from "@/components/LegalView";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "merv.arts gizlilik politikası: verilerinizin nasıl korunduğu ve kullanıldığı.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function Page() {
  return <LegalView slug="gizlilik-politikasi" />;
}
