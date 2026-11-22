"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroHat } from "./Hat";

export type ShowItem = { slug: string; name: string; src: string; srcSet: string; alt: string };

export default function AboutShow({ items }: { items: ShowItem[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (items.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length, paused]);

  return (
    <div className="relative mx-auto w-full max-w-[520px] self-start" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pointer-events-none absolute -inset-10 text-ink" aria-hidden="true">
        <HeroHat className="h-full w-full overflow-visible" />
      </div>
      {items.length > 0 && (
        <div className="relative">
          <div className="frame">
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
              {items.map((it, k) => (
                <Link key={it.slug} href={`/urun/${it.slug}`} tabIndex={k === i ? 0 : -1} aria-hidden={k !== i}
                  className="absolute inset-0 block transition-opacity duration-[1200ms]" style={{ opacity: k === i ? 1 : 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.src} srcSet={it.srcSet} sizes="(min-width:768px) 40vw, 90vw" width={640} height={800} alt={it.alt}
                    className="h-full w-full object-cover" loading={k === 0 ? "eager" : "lazy"} decoding="async" />
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-4 font-display text-2xl text-clay" aria-live="polite">{items[i].name}</p>
          <div className="mt-2 flex gap-1.5" role="tablist" aria-label="Eserler">
            {items.map((it, k) => (
              <button key={it.slug} type="button" aria-label={it.name} aria-selected={k === i} role="tab" onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-clay" : "w-3 bg-earth/30"}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
