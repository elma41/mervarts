"use client";

function go(to: "top" | "bottom") {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: to === "top" ? 0 : document.documentElement.scrollHeight, behavior: reduce ? "auto" : "smooth" });
}

/** Sağ altta: sayfanın başına / sonuna git. */
export default function ScrollButtons() {
  const cls = "flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-lg transition-transform hover:-translate-y-0.5";
  return (
    <div className="fixed bottom-5 right-3 z-30 flex flex-col gap-2 sm:right-5">
      <button type="button" onClick={() => go("top")} className={cls} aria-label="Sayfanın başına git">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l6-6 6 6" /></svg>
      </button>
      <button type="button" onClick={() => go("bottom")} className={cls} aria-label="Sayfanın sonuna git">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8l6 6 6-6" /></svg>
      </button>
    </div>
  );
}
