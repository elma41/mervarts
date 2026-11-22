"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = { name: string; slug: string; price: string; buy: string | null; src: string; srcSet?: string; alt: string; category: string };

const LAYERS = [
  { a: 0.04, b: 0.3, text: "El yapımı özel tasarım", side: "left" },
  { a: 0.26, b: 0.52, text: "Altın varakla, tek tek işlenir", side: "right" },
  { a: 0.48, b: 0.74, text: "Sınırlı üretim", side: "left" },
  { a: 0.68, b: 0.92, text: "Koleksiyon parçası", side: "right" },
] as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number) => t * t * (3 - 2 * t);
const mix = (c1: number[], c2: number[], t: number) => c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(",");

/** Kaydırmaya bağlı sinematik ürün sahnesi. Kütüphane yok: scroll + rAF + CSS değişkenleri. */
export default function ScrollFilm({ name, slug, price, buy, src, srcSet, alt, category }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.setProperty("--p", "1"); el.dataset.done = "true"; return; }
    let raf = 0, tx = 0.5, ty = 0.4, cx = 0.5, cy = 0.4;
    const A = [58, 18, 32], B = [122, 42, 28], C = [74, 26, 34];

    const apply = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = clamp(-r.top / Math.max(1, total));
      const settle = ease(clamp((p - 0.78) / 0.18));
      const rotY = lerp(-38, 38, ease(p)) * (1 - settle);
      const rotX = lerp(10, -6, p) * (1 - settle);
      const rotZ = lerp(-5, 4, p) * (1 - settle);
      const scale = lerp(0.74, 1.14, ease(clamp(p / 0.7))) - 0.12 * settle;
      el.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
      el.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
      el.style.setProperty("--rz", `${rotZ.toFixed(2)}deg`);
      el.style.setProperty("--sc", scale.toFixed(3));
      el.style.setProperty("--ty", `${lerp(40, -10, p).toFixed(1)}px`);
      el.style.setProperty("--bg1", `rgb(${p < 0.5 ? mix(A, B, p * 2) : mix(B, C, (p - 0.5) * 2)})`);
      el.style.setProperty("--glow", (0.35 + 0.5 * Math.sin(Math.PI * clamp(p * 1.1))).toFixed(2));
      el.style.setProperty("--prog", p.toFixed(3));
      el.style.setProperty("--cta", clamp((p - 0.86) / 0.1).toFixed(3));
      el.dataset.done = p > 0.9 ? "true" : "false";
      LAYERS.forEach((l, i) => {
        const t = clamp((p - l.a) / (l.b - l.a));
        const o = Math.min(1, Math.min(t / 0.25, (1 - t) / 0.25)); // gir, bekle, çık
        const dir = l.side === "left" ? -1 : 1;
        el.style.setProperty(`--o${i}`, Math.max(0, o).toFixed(3));
        el.style.setProperty(`--x${i}`, `${(dir * lerp(60, -60, t)).toFixed(1)}px`);
      });
    };
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      el.style.setProperty("--gx", `${(cx * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(cy * 100).toFixed(1)}%`);
      raf = requestAnimationFrame(loop);
    };
    const onScroll = () => apply();
    const onMove = (e: PointerEvent) => { tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight; };
    apply(); loop();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <section ref={root} className="film on-photo" aria-label={`${name}, sinematik ürün sahnesi`} data-done="false">
      <div className="film-stick">
        <div className="film-glow" aria-hidden="true" />
        <p className="film-brand">merv.arts</p>

        <div className="film-product" aria-hidden="false">
          <div className="film-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} srcSet={srcSet} sizes="(min-width:1024px) 34vw, 70vw" width={1600} height={2000} alt={alt} fetchPriority="high" decoding="async" />
            <span className="film-shine" aria-hidden="true" />
          </div>
        </div>

        <h1 className="sr-only">merv.arts: el emeği tezhip ve hat sanatı</h1>
        {LAYERS.map((l, i) => (
          <p key={i} className={`film-text film-text-${l.side}`} style={{ opacity: `var(--o${i}, 0)`, transform: `translate3d(var(--x${i}, 0px), 0, 0)` }}>{l.text}</p>
        ))}

        <div className="film-cta" style={{ opacity: "var(--cta, 0)", transform: "translateY(calc((1 - var(--cta, 0)) * 24px))" }}>
          <p className="film-cat">{category}</p>
          <p className="film-name">{name}</p>
          <p className="film-price">{price}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href={`/urun/${slug}`} className="btn btn-ghost">Koleksiyonu incele</Link>
            {buy && <a href={buy} target="_blank" rel="noopener" className="btn btn-primary film-buy">Shopier ile satın al</a>}
          </div>
        </div>

        <p className="film-hint" aria-hidden="true">Aşağı kaydırın</p>
        <div className="film-bar" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
