"use client";
import { useEffect, useRef, useState } from "react";

/** Kaydırdıkça eserlerin yana aktığı müze koridoru. Dar ekranda yatay kaydırma olarak kalır. */
export default function HGallery({ children, title, action }: { children: React.ReactNode; title: string; action?: React.ReactNode }) {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<SVGPathElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const s = sec.current, t = track.current;
    if (!s || !t) return;
    if (!pinned) { s.style.height = ""; t.style.transform = ""; return; }
    let dist = 0, raf = 0;
    const measure = () => {
      dist = Math.max(0, t.scrollWidth - window.innerWidth);
      s.style.height = `${dist + window.innerHeight}px`;
      update();
    };
    const update = () => {
      const r = s.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      t.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
      if (bar.current) bar.current.style.strokeDashoffset = String(1 - p);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", measure); cancelAnimationFrame(raf); };
  }, [pinned]);

  return (
    <section ref={sec} aria-labelledby="koleksiyon" className={`relative mt-16 ${pinned ? "hg-pinned" : ""}`}>
      <div className="hg-stick">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-end justify-between gap-4 px-5 sm:px-10 lg:px-14">
          <h2 id="koleksiyon" data-write className="font-display text-5xl sm:text-7xl">{title}</h2>
          {action}
        </div>
        <div className="relative mt-8 lg:mt-12">
          <div ref={track} className="hg-scroll" tabIndex={pinned ? -1 : 0} aria-label="Eserler">{children}</div>
        </div>
        {pinned && (
          <svg viewBox="0 0 1000 8" className="mx-auto mt-10 h-2 w-[min(1000px,80vw)] text-gold" aria-hidden="true">
            <path ref={bar} className="ink-line" pathLength={1} strokeWidth="1.5" d="M0 4 C 200 0, 300 8, 500 4 S 800 0, 1000 4" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
          </svg>
        )}
      </div>
    </section>
  );
}
