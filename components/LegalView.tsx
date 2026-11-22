import { notFound } from "next/navigation";
import SimpleText from "./SimpleText";
import { getLegal } from "@/lib/data";
import { dateTR } from "@/lib/format";

export default async function LegalView({ slug }: { slug: string }) {
  const page = await getLegal(slug);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 pt-12 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-clay">Yasal bilgilendirme</p>
      <h1 className="mt-1 font-display text-4xl font-light">{page.title}</h1>
      <p className="mt-2 text-sm text-earth">Sürüm {page.version} · Son güncelleme: {dateTR(page.updated_at)}</p>
      <div className="prose-art mt-8">
        {page.body.trim() ? <SimpleText text={page.body} /> : <p>Bu metin hazırlanmaktadır.</p>}
      </div>
    </article>
  );
}
