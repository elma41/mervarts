"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export type FilmItem = { slug: string; name: string; category: string; price: string; src: string; srcSet?: string; alt: string };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number) => t * t * (3 - 2 * t);
const mix = (c1: number[], c2: number[], t: number) => c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(",");

/** Kaydırmaya bağlı "Tüm koleksiyon" sahnesi: iki sıra eser, biri sola biri sağa akar; ortadaki kart öne çıkar. */
export default function ScrollFilm({ items, shopier }: { items: FilmItem[]; shopier: string }) {
  const root = useRef<HTMLElement>(null);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, a = rowA.current, b = rowB.current;
    if (!el || !a || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.dataset.done = "true"; return; }
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".film-item"));
    let raf = 0, tx = 0.5, ty = 0.4, cx = 0.5, cy = 0.4, pending = false;
    const A = [58, 18, 32], B = [122, 42, 28], C = [74, 26, 34];

    const apply = () => {
      pending = false;
      const vw = window.innerWidth;
      const r = el.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      const e = ease(p);
      const spanA = Math.max(0, a.scrollWidth - vw + 80), spanB = Math.max(0, b.scrollWidth - vw + 80);
      a.style.transform = `translate3d(${(-spanA * e + 40).toFixed(1)}px,0,0)`;
      b.style.transform = `translate3d(${(-spanB * (1 - e) + 40).toFixed(1)}px,0,0)`;
      for (const c of cards) {
        const cr = c.getBoundingClientRect();
        const d = clamp(Math.abs((cr.left + cr.width / 2 - vw / 2) / (vw * 0.6)));
        const sign = cr.left + cr.width / 2 < vw / 2 ? 1 : -1;
        c.style.setProperty("--cs", (1.1 - d * 0.3).toFixed(3));
        c.style.setProperty("--cr", `${(sign * d * 32).toFixed(1)}deg`);
        c.style.setProperty("--co", (1 - d * 0.45).toFixed(2));
      }
      el.style.setProperty("--bg1", `rgb(${p < 0.5 ? mix(A, B, p * 2) : mix(B, C, (p - 0.5) * 2)})`);
      el.style.setProperty("--glow", (0.35 + 0.5 * Math.sin(Math.PI * p)).toFixed(2));
      el.style.setProperty("--prog", p.toFixed(3));
      el.style.setProperty("--tt", `${lerp(80, -80, p).toFixed(1)}px`);
      el.style.setProperty("--cta", clamp((p - 0.82) / 0.12).toFixed(3));
      el.dataset.done = p > 0.9 ? "true" : "false";
    };
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      el.style.setProperty("--gx", `${(cx * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(cy * 100).toFixed(1)}%`);
      raf = requestAnimationFrame(loop);
    };
    const on = () => { if (!pending) { pending = true; requestAnimationFrame(apply); } };
    const onMove = (e: PointerEvent) => { tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight; };
    apply(); loop();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); window.removeEventListener("pointermove", onMove); };
  }, []);

  const rows: FilmItem[][] = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];
  const card = (p: FilmItem, i: number) => (
    <Link key={p.slug} href={`/urun/${p.slug}`} className="film-item" aria-label={`${p.name}, ${p.price}`}>
      <span className="film-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.src} srcSet={p.srcSet} sizes="(min-width:1024px) 24vw, 46vw" width={1600} height={2000} alt={p.alt} loading={i < 2 ? "eager" : "lazy"} decoding="async" />
      </span>
      <span className="film-cap"><b>{p.name}</b><i>{p.price}</i></span>
    </Link>
  );

  return (
    <section ref={root} className="film on-photo" aria-label="Tüm koleksiyon" data-done="false">
      <div className="film-stick">
        <div className="film-glow" aria-hidden="true" />
        <h1 className="film-title" aria-label="Tüm koleksiyon, merv.arts el emeği tezhip ve hat sanatı">
          <span aria-hidden="true">Tüm koleksiyon</span>
        </h1>
        <div className="film-rows">
          <div ref={rowA} className="film-row">{rows[0].map((p, i) => card(p, i))}</div>
          <div ref={rowB} className="film-row film-row-b">{rows[1].map((p, i) => card(p, i + 2))}</div>
        </div>
        <div className="film-cta" style={{ opacity: "var(--cta, 0)", transform: "translateY(calc((1 - var(--cta, 0)) * 24px))" }}>
          <Link href="/urunler" className="btn btn-primary film-buy">Koleksiyonu incele</Link>
          <a href={shopier} target="_blank" rel="noopener" className="btn btn-ghost">Shopier mağazası</a>
        </div>
        <p className="film-hint" aria-hidden="true">Aşağı kaydırın</p>
        <div className="film-bar" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
