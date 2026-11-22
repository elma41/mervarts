"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = { slug: string; name: string; category: string; price: string; buy: string | null; src: string; srcSet?: string; alt: string };

/** Ürünlerin yana kayarak değiştiği tam genişlikte giriş alanı. Kütüphane yok. */
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const touch = useRef<number | null>(null);
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 3000);
    return () => clearInterval(t);
  }, [paused, n, i]);

  return (
    <section
      className="hs" aria-roledescription="carousel" aria-label="Öne çıkan eserler"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touch.current == null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touch.current = null; }}
    >
      <h1 className="sr-only">merv.arts: Merve Türkdönmez el yapımı tezhip ve hat sanatı</h1>
      {slides.map((s, k) => {
        const d = (k - i + n) % n;
        const state = d === 0 ? "active" : d === n - 1 ? "prev" : "next";
        return (
          <div key={s.slug} className="hs-slide" data-state={state} aria-hidden={d !== 0} role="group" aria-roledescription="slayt" aria-label={`${k + 1} / ${n}: ${s.name}`}>
            <div className="hs-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} srcSet={s.srcSet} sizes="100vw" width={1600} height={2000} alt="" loading={k === 0 ? "eager" : "lazy"} decoding="async" />
            </div>
            <div className="hs-in">
              <div className="hs-copy">
                <p className="hs-cat">{s.category}</p>
                <p className="hs-name">{s.name}</p>
                <div className="hs-btns">
                  <Link href={`/urun/${s.slug}`} className="hs-btn hs-btn-ghost" tabIndex={d === 0 ? 0 : -1}>Eseri incele</Link>
                  {s.buy && <a href={s.buy} target="_blank" rel="noopener" className="hs-btn hs-btn-buy" tabIndex={d === 0 ? 0 : -1}>Shopier&apos;de satın al</a>}
                </div>
              </div>
              <Link href={`/urun/${s.slug}`} className="hs-frame" tabIndex={d === 0 ? 0 : -1} aria-label={`${s.name} eserini incele`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} srcSet={s.srcSet} sizes="(min-width:1024px) 40vw, 70vw" width={1600} height={2000} alt={s.alt} fetchPriority={k === 0 ? "high" : "low"} loading={k === 0 ? "eager" : "lazy"} decoding="async" />
              </Link>
            </div>
          </div>
        );
      })}

      <div className="hs-ctrl">
        <button type="button" onClick={() => go(-1)} aria-label="Önceki eser" className="hs-arrow">‹</button>
        <div className="hs-dots" role="tablist" aria-label="Eser seç">
          {slides.map((_, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`${k + 1}. eser`} onClick={() => setI(k)} className="hs-dot" data-on={k === i}>
              <i />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Sonraki eser" className="hs-arrow">›</button>
      </div>
    </section>
  );
}
