import type { Metadata } from "next";
import LegalView from "@/components/LegalView";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 sayılı KVKK kapsamında merv.arts aydınlatma metni: hangi kişisel verilerin, hangi amaçla işlendiği ve haklarınız.",
  alternates: { canonical: "/kvkk" },
};

export default function Page() {
  return <LegalView slug="kvkk" />;
}
