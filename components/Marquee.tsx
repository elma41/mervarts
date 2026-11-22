/** Sonsuz kayan yazı şeridi (yalnızca CSS). Ekran okuyucular için tek sefer okunur. */
export default function Marquee({
  items, className = "", reverse = false, rotate = "-2deg",
}: { items: string[]; className?: string; reverse?: boolean; rotate?: string }) {
  const row = (hidden: boolean) => (
    <span className="marquee-track" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-10">
          <span>{t}</span>
          <span aria-hidden="true">✦</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`marquee border-y-[2.5px] border-ink py-3 font-display text-2xl sm:text-3xl ${reverse ? "marquee-reverse" : ""} ${className}`} style={{ transform: `rotate(${rotate})` }}>
      <div className="marquee-inner">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
