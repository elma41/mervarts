import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Category, Product } from "@/lib/types";

export default function ProductGrid({
  title, intro, products, categories, active,
}: { title: string; intro: string; products: Product[]; categories: Category[]; active?: string }) {
  const chip = (on: boolean) =>
    `inline-flex min-h-[46px] items-center whitespace-nowrap border px-5 font-medium transition-colors ${on ? "border-ink bg-ink text-[#14121c]" : "border-line bg-mat hover:border-ink"}`;
  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-10 lg:px-14">
      <header className="max-w-3xl">
        <h1 className="font-display text-6xl leading-[.95] sm:text-8xl">{title}</h1>
        <p className="mt-5 text-lg text-earth sm:text-xl">{intro}</p>
      </header>

      <nav aria-label="Eser türleri" className="-mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex gap-3 pb-3 pt-1">
          <li><Link href="/urunler" aria-current={!active ? "page" : undefined} className={chip(!active)}>Tümü</Link></li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/urunler/kategori/${c.slug}`} aria-current={active === c.slug ? "page" : undefined} className={chip(active === c.slug)}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {products.length > 0 ? (
        <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.id}><ProductCard p={p} priority={i < 3} /></li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 border border-line bg-mat p-8 sm:p-12">
          <p className="font-display text-4xl">Bu türde şu an eser yok.</p>
          <p className="mt-3 text-lg text-earth">Aklınızdaki eseri sizin için işleyebiliriz.</p>
          <Link href="/ozel-siparis" className="btn btn-primary mt-6">Kişiye özel iste</Link>
        </div>
      )}
    </div>
  );
}
