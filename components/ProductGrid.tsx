import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Category, Product } from "@/lib/types";

export default function ProductGrid({
  title, intro, products, categories, active,
}: { title: string; intro: string; products: Product[]; categories: Category[]; active?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-clay">Koleksiyon</p>
        <h1 className="mt-1 font-display text-4xl font-light sm:text-5xl">{title}</h1>
        <p className="mt-3 text-lg text-earth">{intro}</p>
      </header>

      <nav aria-label="Kategoriler" className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex gap-2 pb-2">
          <li>
            <Link href="/urunler" aria-current={!active ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 font-medium ${!active ? "border-ink bg-ink text-paper" : "border-line hover:border-clay hover:text-clay"}`}>
              Tümü
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/urunler/kategori/${c.slug}`} aria-current={active === c.slug ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 font-medium ${active === c.slug ? "border-ink bg-ink text-paper" : "border-line hover:border-clay hover:text-clay"}`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {products.length > 0 ? (
        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.id} {...(i > 2 ? { "data-reveal": true } : {})}>
              <ProductCard p={p} priority={i < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-paper-2/50 px-6 py-14 text-center">
          <p className="font-display text-2xl">Bu bölümde şu an ürün yok.</p>
          <p className="mt-2 text-earth">Aklınızdaki parçayı size özel hazırlayabiliriz.</p>
          <Link href="/ozel-siparis" className="btn btn-primary mt-6">Özel sipariş verin</Link>
        </div>
      )}
    </div>
  );
}
