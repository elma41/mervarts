"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevron, IconClose, IconZoom } from "./Icons";

type Img = { lg: string; sm: string; srcSet?: string; alt: string };

export default function Gallery({ images, name }: { images: Img[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const dlg = useRef<HTMLDialogElement>(null);

  const go = useCallback((d: number) => { setZoom(false); setI((x) => (x + d + images.length) % images.length); }, [images.length]);

  useEffect(() => {
    const el = dlg.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  if (images.length === 0) {
    return (
      <div className="card-media paper-grain flex items-center justify-center !aspect-[4/5]">
        <span className="font-display text-7xl text-clay/40" aria-hidden="true">m.</span>
      </div>
    );
  }
  const cur = images[i];

  return (
    <div>
      <button
        type="button"
        onClick={() => dlg.current?.showModal()}
        className="card-media group block w-full cursor-zoom-in"
        aria-label={`${name} görselini büyüt (${i + 1}/${images.length})`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cur.lg} srcSet={cur.srcSet} sizes="(min-width:1024px) 50vw, 100vw" width={1600} height={2000} alt={cur.alt} fetchPriority={i === 0 ? "high" : "auto"} decoding="async" className="img-main" />
        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow" aria-hidden="true"><IconZoom /></span>
      </button>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label="Ürün görselleri">
          {images.map((im, n) => (
            <li key={im.lg}>
              <button type="button" onClick={() => setI(n)} aria-label={`Görsel ${n + 1}`} aria-current={n === i ? "true" : undefined}
                className={`relative block aspect-square w-full overflow-hidden rounded-xl bg-paper-2 ring-offset-2 ring-offset-paper transition ${n === i ? "ring-2 ring-clay" : "opacity-80 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.sm} alt="" width={160} height={160} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog ref={dlg} aria-label={`${name} — büyük görsel`} onClose={() => setZoom(false)}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/80">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cur.lg}
            alt={cur.alt}
            className={`max-h-[90dvh] max-w-[92vw] select-none object-contain transition-transform duration-500 ${zoom ? "scale-[2.2] cursor-zoom-out" : "cursor-zoom-in"}`}
            style={{ transformOrigin: origin }}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
              setZoom((z) => !z);
            }}
          />
          <button type="button" onClick={() => dlg.current?.close()} className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper/15 hover:bg-paper/25" aria-label="Kapat"><IconClose /></button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/15 hover:bg-paper/25" aria-label="Önceki görsel"><IconChevron dir="left" /></button>
              <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/15 hover:bg-paper/25" aria-label="Sonraki görsel"><IconChevron /></button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm" aria-live="polite">{i + 1} / {images.length}</p>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
