"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** [data-reveal] öğelerini görünür olduklarında yumuşakça belirtir. Kütüphane yok, ~0.5 KB. */
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
