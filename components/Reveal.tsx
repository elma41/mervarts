"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** [data-reveal], [data-write], [data-draw] öğelerini görünür olduklarında harekete geçirir. Kütüphane yok. */
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible), [data-write]:not(.is-visible), [data-draw]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      return;
    }
    // Kırpılmış (clip-path) öğeler görünmez sayıldığı için bunlarda üst öğe izlenir.
    const watch = new Map<Element, HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            watch.get(e.target)?.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => {
      const t = el.hasAttribute("data-write") && el.parentElement ? el.parentElement : el;
      watch.set(t, el);
      io.observe(t);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
