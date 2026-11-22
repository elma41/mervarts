"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export type Chapter = {
  slug: string; name: string; category: string; code: string | null; badges: string[]; blurb: string; stock: string | null;
  price: string; buy: string | null; src: string; srcSet?: string; alt: string; bg: string; tone: string;
};

const clamp = (x: number) => Math.min(1, Math.max(0, x));

/** Büyük görselli, kaydırmayla açılan eser bölümleri. Kütüphane yok: scroll + CSS değişkenleri. */
export default function ScrollChapters({ chapters }: { chapters: Chapter[] }) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.style.setProperty("--cp", "1")); return; }
    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const p = clamp(-r.top / Math.max(1, r.height - vh));
        el.style.setProperty("--cp", p.toFixed(3));
        el.style.setProperty("--enter", clamp(1 - r.top / vh).toFixed(3));
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  return (
    <div className="chapters">
      {chapters.map((c, i) => (
        <section key={c.slug} ref={(el) => { refs.current[i] = el; }} className={`chapter ${i % 2 ? "flip" : ""}`} style={{ background: c.bg, color: c.tone }} aria-label={c.name}>
          <div className="chapter-stick">
            <div className="chapter-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} srcSet={c.srcSet} sizes="(min-width:1024px) 55vw, 100vw" width={1600} height={2000} alt={c.alt} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
            </div>
            <div className="chapter-copy">
              <p className="ch-in ch-1">{c.category}</p>
              <h2 className="ch-in ch-2 chapter-name">{c.name}</h2>
              {c.blurb && <p className="ch-in ch-3 chapter-blurb">{c.blurb}</p>}
              <ul className="ch-in ch-4 chapter-specs">
                {c.code && <li><span>Eser kodu</span><b>{c.code}</b></li>}
                <li><span>Üretim</span><b>El yapımı</b></li>
                {c.badges.filter((b) => b !== "El Yapımı").slice(0, 3).map((b) => <li key={b}><span>Özellik</span><b>{b}</b></li>)}
                {c.stock && <li><span>Stok</span><b>{c.stock}</b></li>}
              </ul>
              <div className="ch-in ch-5 mt-6 flex flex-wrap items-center gap-3">
                <span className="chapter-price">{c.price}</span>
                <Link href={`/urun/${c.slug}`} className="btn btn-ghost">Eseri incele</Link>
                {c.buy && <a href={c.buy} target="_blank" rel="noopener" className="shopier-btn">Shopier&apos;de satın al</a>}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
