"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevron, IconClose, IconZoom } from "./Icons";

type Img = { lg: string; sm: string; srcSet?: string; alt: string };

export default function Gallery({ images, name }: { images: Img[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [hold, setHold] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);

  const go = useCallback((d: number) => { setZoom(false); setI((x) => (x + d + images.length) % images.length); }, [images.length]);

  useEffect(() => {
    if (images.length < 2 || hold || zoom) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length, hold, zoom]);

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
    <div onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="rounded-[22px] bg-white p-3 shadow-[0_24px_50px_-28px_rgba(40,20,20,.45)] sm:p-4">
        <button
          type="button"
          onClick={() => { setHold(true); dlg.current?.showModal(); }}
          className="relative block h-[min(60dvh,620px)] w-full cursor-zoom-in overflow-hidden rounded-xl bg-paper-2"
          aria-label={`${name} görselini büyüt (${i + 1}/${images.length})`}
        >
          {images.map((im, n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={im.lg} src={im.lg} srcSet={im.srcSet} sizes="(min-width:1024px) 50vw, 100vw" width={1600} height={2000} alt={im.alt}
              loading={n === 0 ? "eager" : "lazy"} decoding="async"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${n === i ? "opacity-100" : "opacity-0"}`} />
          ))}
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow" aria-hidden="true"><IconZoom /></span>
        </button>

        {images.length > 1 && (
          <ul className="mt-3 flex justify-center gap-2" aria-label="Ürün görselleri">
            {images.map((im, n) => (
              <li key={im.lg} className="w-14 sm:w-16">
                <button type="button" onClick={() => setI(n)} aria-label={`Görsel ${n + 1}`} aria-current={n === i ? "true" : undefined}
                  className={`relative block aspect-square w-full overflow-hidden rounded-xl bg-white p-0.5 transition ${n === i ? "ring-2 ring-clay" : "opacity-60 hover:opacity-100"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.sm} alt="" width={160} height={160} loading="lazy" decoding="async" className="h-full w-full rounded-lg object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <dialog ref={dlg} aria-label={`${name} — büyük görsel`} onClose={() => { setZoom(false); setHold(false); }}
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
