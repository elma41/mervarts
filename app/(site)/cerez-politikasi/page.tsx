import type { Metadata } from "next";
import LegalView from "@/components/LegalView";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "merv.arts çerez politikası: sitede kullanılan çerezler ve tarayıcı depolama alanı.",
  alternates: { canonical: "/cerez-politikasi" },
};

export default function Page() {
  return <LegalView slug="cerez-politikasi" />;
}
