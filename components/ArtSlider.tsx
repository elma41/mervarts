"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type SlideData = {
  slug: string; name: string; category: string; price: string; buy: string; soldOut: boolean;
  src: string; srcSet?: string; alt: string; bg: string; dark: boolean;
};

function Rosette({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} style={style} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <path key={r} transform={`rotate(${r})`} d="M0 -6 C 13 -14, 13 -34, 0 -46 C -13 -34, -13 -14, 0 -6" />
        ))}
        <circle r="5" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Tam ekran eser slayt gösterisi: her eserin kendi rengi, dev adı, eğik çerçevesi ve süzülen süsleri var. */
export default function ArtSlider({ slides }: { slides: SlideData[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = slides.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, n]);

  const cur = slides[i];
  return (
    <section
      className="slider"
      data-tone={cur.dark ? "dark" : "light"}
      style={{ background: cur.bg, color: cur.dark ? "#f6efdc" : "#1c1b2b" }}
      aria-roledescription="carousel"
      aria-label="Öne çıkan eserler"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h1 className="sr-only">merv.arts, Merve Türkdönmez: tezhip ve hat sanatı</h1>

      {slides.map((s, k) => (
        <div key={k} className="sl" data-on={k === i} aria-hidden={k !== i} role="group" aria-roledescription="slayt" aria-label={`${k + 1} / ${n}`}>
          <p className="sl-title" aria-hidden="true" data-long={s.name.length > 14}>{s.name}</p>

          <Rosette className="orn orn-a" />
          <Rosette className="orn orn-b" />
          <Rosette className="orn orn-c" />

          <Link href={`/urun/${s.slug}`} className="sl-art" tabIndex={k === i ? 0 : -1} aria-label={`${s.name} eserini incele`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} srcSet={s.srcSet} sizes="(min-width:1024px) 34vw, 70vw" width={1600} height={2000} alt={s.alt}
              fetchPriority={k === 0 ? "high" : "low"} loading={k === 0 ? "eager" : "lazy"} decoding="async" />
          </Link>

          <div className="sl-copy">
            <p className="sl-cat">{s.category}</p>
            <p className="sl-name">{s.name}</p>
            <p className="sl-price">{s.price}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/urun/${s.slug}`} className="btn sl-btn-ghost" tabIndex={k === i ? 0 : -1}>Eseri incele</Link>
              {!s.soldOut && <a href={s.buy} target="_blank" rel="noopener" className="btn sl-btn" tabIndex={k === i ? 0 : -1}>Shopier&apos;den satın al</a>}
            </div>
          </div>
        </div>
      ))}

      <svg className="badge-spin" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <defs><path id="rim" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
        <text fontSize="17" letterSpacing="4.2" fill="currentColor" fontFamily="var(--font-sans)" fontWeight="600">
          <textPath href="#rim">EL YAPIMI · TEZHİP · ALTIN VARAK · KİŞİYE ÖZEL ·</textPath>
        </text>
        <circle cx="100" cy="100" r="6" fill="currentColor" />
      </svg>

      <div className="sl-ctrl">
        <button type="button" onClick={() => go(-1)} aria-label="Önceki eser" className="sl-arrow">‹</button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Eser seç">
          {slides.map((_, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`${k + 1}. eser`} onClick={() => setI(k)} className="sl-dot" data-on={k === i} />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Sonraki eser" className="sl-arrow">›</button>
      </div>
    </section>
  );
}
