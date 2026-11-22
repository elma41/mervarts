import Link from "next/link";
import type { Product } from "@/lib/types";
import { price, productImage, sortImages } from "@/lib/format";

/** Paspartulu çerçeve + müze etiketi. */
export default function ProductCard({ p, priority = false, sizes }: { p: Product; priority?: boolean; sizes?: string }) {
  const imgs = sortImages(p.product_images);
  const main = imgs[0] ? productImage(imgs[0].path) : null;
  const alt = imgs[1] ? productImage(imgs[1].path) : null;
  const sz = sizes || "(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw";
  const detail = [p.categories?.name, ...p.badges.slice(0, 1)].filter(Boolean).join(", ");

  return (
    <article className="group">
      <Link href={`/urun/${p.slug}`} className="block">
        <div className="frame">
          <div className="card-media">
            {main ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="img-main" src={main.sm} srcSet={main.srcSet} sizes={sz} width={640} height={800} alt={imgs[0].alt || p.name}
                  loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
                {alt && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="img-alt" src={alt.sm} srcSet={alt.srcSet} sizes={sz} width={640} height={800} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                )}
              </>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-sm text-earth">Fotoğraf yakında</span>
            )}
            {p.is_sold_out && <span className="absolute left-0 top-3 bg-ink px-2.5 py-1 text-xs font-semibold text-white">Satıldı</span>}
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-semibold group-hover:text-cobalt">{p.name}</h3>
            {detail && <p className="truncate text-sm text-earth">{detail}</p>}
          </div>
          <p className="shrink-0 text-[0.95rem] font-semibold text-cobalt">
            {p.is_sold_out ? <span className="text-earth">Satıldı</span> : p.pricing_mode === "fixed" && p.price != null ? price(p.price) : "Fiyat sorun"}
          </p>
        </div>
      </Link>
      {!p.is_sold_out && p.shopier_url && p.pricing_mode === "fixed" && (
        <a href={p.shopier_url} target="_blank" rel="noopener" className="card-buy" aria-label={`${p.name} için Shopier'de satın al`}>Shopier&apos;de satın al</a>
      )}
    </article>
  );
}
