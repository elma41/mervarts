import Link from "next/link";
import type { Product } from "@/lib/types";
import { price, productImage, sortImages } from "@/lib/format";
import { ART_BY_SLUG, ArtPainting, TILE_BG } from "./Art";
import { IconArrow } from "./Icons";

export default function ProductCard({ p, priority = false, index = 0, size = "md" }: { p: Product; priority?: boolean; index?: number; size?: "md" | "lg" }) {
  const imgs = sortImages(p.product_images);
  const main = imgs[0] ? productImage(imgs[0].path) : null;
  const alt = imgs[1] ? productImage(imgs[1].path) : null;
  const badges = p.is_sold_out ? ["Tükendi", ...p.badges.slice(0, 1)] : p.badges.slice(0, 2);
  const Art = (p.categories?.slug && ART_BY_SLUG[p.categories.slug]) || ArtPainting;
  const bg = TILE_BG[index % TILE_BG.length];
  const sizes = size === "lg" ? "(min-width:1024px) 40vw, 85vw" : "(min-width:1024px) 30vw, (min-width:640px) 45vw, 85vw";

  return (
    <article className="tilt-card group relative">
      <Link href={`/urun/${p.slug}`} className="block rounded-[24px] focus-visible:outline-offset-4">
        <div className={`card-media ${main ? "" : bg} shadow-[6px_6px_0_#1e1233]`}>
          {main ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="img-main" src={main.sm} srcSet={main.srcSet} sizes={sizes} width={640} height={800} alt={imgs[0].alt || p.name}
                loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
              {alt && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="img-alt" src={alt.sm} srcSet={alt.srcSet} sizes={sizes} width={640} height={800} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              )}
            </>
          ) : (
            <div className="paper-grain absolute inset-0 flex items-center justify-center p-10">
              <Art className="h-full w-auto transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105" />
            </div>
          )}
          {badges.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <span key={b} className={`badge ${b === "Tükendi" ? "!bg-ink !text-paper" : ""}`}>{b}</span>
              ))}
            </div>
          )}
          <span className="absolute bottom-3 right-3 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full border-[2.5px] border-ink bg-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
            <IconArrow className="h-5 w-5 -rotate-45" />
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-3 px-1">
          <div className="min-w-0">
            <h3 className={`font-display leading-tight ${size === "lg" ? "text-2xl" : "text-xl"}`}>{p.name}</h3>
            {p.categories?.name && <p className="mt-1 text-sm font-semibold text-earth">{p.categories.name}</p>}
          </div>
          <p className={`shrink-0 rounded-full border-2 border-ink px-3 py-1 text-sm font-extrabold ${p.pricing_mode === "fixed" && p.price != null ? "bg-sun" : "bg-lav"}`}>
            {p.pricing_mode === "fixed" && p.price != null ? price(p.price) : "Fiyat al"}
          </p>
        </div>
      </Link>
    </article>
  );
}
