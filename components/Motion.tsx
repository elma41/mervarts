"use client";
import { useEffect } from "react";

/** İnce işaretçiyle: eserlerde altın parıltı ve hafif eğilme. Kütüphane yok. */
export default function Motion() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const g = (e.target as HTMLElement | null)?.closest?.(".group") as HTMLElement | null;
      if (!g) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const f = g.querySelector<HTMLElement>(".frame");
        const m = g.querySelector<HTMLElement>(".card-media, .frame-art");
        if (!f || !m) return;
        const r = f.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        f.style.setProperty("--rx", `${((x - 0.5) * 7).toFixed(2)}deg`);
        f.style.setProperty("--ry", `${((0.5 - y) * 7).toFixed(2)}deg`);
        m.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        m.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      });
    };
    const leave = (e: PointerEvent) => {
      const g = (e.target as HTMLElement | null)?.closest?.(".group") as HTMLElement | null;
      const f = g?.querySelector<HTMLElement>(".frame");
      if (f && !g?.contains(e.relatedTarget as Node)) { f.style.setProperty("--rx", "0deg"); f.style.setProperty("--ry", "0deg"); }
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    return () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", leave); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
