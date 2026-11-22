"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export type ShowItem = { slug: string; name: string; src: string; srcSet?: string; alt: string };

export default function AboutShow({ items }: { items: ShowItem[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 3000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="relative mx-auto w-full max-w-[520px] self-start">
      <svg className="pointer-events-none absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] overflow-visible" viewBox="0 0 560 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <g fill="none" strokeLinecap="round">
          <path className="flow-line text-navy" pathLength={1} strokeWidth="5" style={{ ["--d" as string]: "9s" }} d="M12 40 C 6 250, 10 450, 14 600 C 18 664, 60 684, 140 686 C 300 690, 420 688, 546 664" />
          <path className="flow-line text-navy" pathLength={1} strokeWidth="1.4" style={{ ["--d" as string]: "11s", ["--delay" as string]: "-3s" }} d="M70 694 C 240 698, 420 696, 548 678" />
          <path className="flow-line text-gold" pathLength={1} strokeWidth="2" style={{ ["--d" as string]: "8s", ["--delay" as string]: "-2s" }} d="M360 18 C 450 -8 548 36 540 108 C 534 160 470 158 476 116 C 480 88 514 94 512 116" />
          <path className="flow-line text-gold" pathLength={1} strokeWidth="1.6" style={{ ["--d" as string]: "10s", ["--delay" as string]: "-5s" }} d="M548 330 C 520 420, 556 520, 520 610" />
        </g>
      </svg>
      {items.length > 0 && (
        <div className="relative z-10">
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
        </div>
      )}
    </div>
  );
}
