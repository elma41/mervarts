import Link from "next/link";
import type { Product } from "@/lib/types";
import { price, productImage, sortImages } from "@/lib/format";

export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const imgs = sortImages(p.product_images);
  const main = imgs[0] ? productImage(imgs[0].path) : null;
  const alt = imgs[1] ? productImage(imgs[1].path) : null;
  const badges = p.is_sold_out ? ["Tükendi", ...p.badges.slice(0, 1)] : p.badges.slice(0, 2);

  return (
    <article className="group relative">
      <Link href={`/urun/${p.slug}`} className="block focus-visible:outline-offset-4">
        <div className="card-media">
          {main ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="img-main"
                src={main.sm}
                srcSet={main.srcSet}
                sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
                width={640}
                height={800}
                alt={imgs[0].alt || p.name}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                decoding="async"
              />
              {alt && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="img-alt" src={alt.sm} srcSet={alt.srcSet} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" width={640} height={800} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center paper-grain">
              <span className="font-display text-5xl text-clay/40" aria-hidden="true">m.</span>
            </div>
          )}
          {badges.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <span key={b} className={`badge ${b === "Tükendi" ? "!bg-ink !text-paper !border-ink" : ""}`}>{b}</span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-snug transition-colors group-hover:text-clay">{p.name}</h3>
            {p.categories?.name && <p className="mt-0.5 text-sm text-earth">{p.categories.name}</p>}
          </div>
          <p className="shrink-0 pt-0.5 text-[0.95rem] font-semibold">
            {p.pricing_mode === "fixed" && p.price != null ? price(p.price) : <span className="text-clay">Fiyat al</span>}
          </p>
        </div>
      </Link>
    </article>
  );
}
