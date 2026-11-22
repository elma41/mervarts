import Link from "next/link";
import ProductCard from "./ProductCard";
import { ART_LIST, Sparkle, TILE_BG } from "./Art";
import type { Category, Product } from "@/lib/types";

const CHIP = ["hover:bg-pink", "hover:bg-sun", "hover:bg-sky", "hover:bg-mint", "hover:bg-lav", "hover:bg-orange"];

export default function ProductGrid({
  title, intro, products, categories, active,
}: { title: string; intro: string; products: Product[]; categories: Category[]; active?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8">
      <header className="relative max-w-3xl">
        <Sparkle className="bob absolute -left-2 -top-6 h-10 w-10 sm:-left-10" fill="#ffd23f" />
        <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl">{title}</h1>
        <p className="mt-4 text-lg font-medium text-earth sm:text-xl">{intro}</p>
      </header>

      <nav aria-label="Kategoriler" className="-mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex gap-3 pb-3 pt-1">
          <li>
            <Link href="/urunler" aria-current={!active ? "page" : undefined}
              className={`inline-flex min-h-[46px] items-center whitespace-nowrap rounded-full border-[2.5px] border-ink px-5 font-extrabold transition ${!active ? "bg-ink text-paper shadow-[3px_3px_0_#ff4f8b]" : "bg-paper hover:bg-sun"}`}>
              Tümü
            </Link>
          </li>
          {categories.map((c, i) => (
            <li key={c.id}>
              <Link href={`/urunler/kategori/${c.slug}`} aria-current={active === c.slug ? "page" : undefined}
                className={`inline-flex min-h-[46px] items-center whitespace-nowrap rounded-full border-[2.5px] border-ink px-5 font-extrabold transition ${active === c.slug ? "bg-ink text-paper shadow-[3px_3px_0_#ff4f8b]" : `bg-paper ${CHIP[i % CHIP.length]}`}`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {products.length > 0 ? (
        <ul className="mt-10 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.id} {...(i > 2 ? { "data-reveal": true } : {})}>
              <ProductCard p={p} index={i} priority={i < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="pop-card mt-10 grid items-center gap-8 bg-lav p-8 sm:grid-cols-[1fr_auto] sm:p-12">
          <div>
            <p className="font-display text-3xl sm:text-4xl">Bu rafta şimdilik yer var 🌱</p>
            <p className="mt-3 text-lg font-medium text-earth">Aklındaki parçayı sana özel hazırlayabiliriz.</p>
            <Link href="/ozel-siparis" className="btn btn-primary mt-6">Özel sipariş ver</Link>
          </div>
          <div className="hidden gap-3 sm:flex" aria-hidden="true">
            {ART_LIST.slice(1, 4).map((A, i) => (
              <div key={i} className={`pop-card bob flex h-32 w-24 items-center justify-center p-3 ${TILE_BG[i + 1]}`} style={{ ["--r" as string]: `${(i - 1) * 6}deg`, animationDelay: `${i * 0.5}s` }}><A className="h-full w-auto" /></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
