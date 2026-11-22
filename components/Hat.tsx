/** Hat ve tezhip çizgileri: saf SVG, yalnızca stroke animasyonu (JS yok). */

/** Eserin etrafında bir nefeste çekilen hat darbeleri. */
export function HeroHat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 720 840" className={className} aria-hidden="true" focusable="false" overflow="visible">
      {/* kalın uç: kamış kalemin geniş darbesi, eserin sol ve alt kenarını sarar */}
      <path className="ink-line draw text-navy" pathLength={1} strokeWidth="8" style={{ ["--d" as string]: "3s", ["--delay" as string]: ".2s" }}
        d="M-420 852 C -200 866, -60 840, -34 640 C -20 480, -44 300, -14 120" />
      <path className="ink-line draw text-navy" pathLength={1} strokeWidth="1.6" style={{ ["--d" as string]: "3.4s", ["--delay" as string]: ".5s" }}
        d="M-420 870 C -180 884, -34 860, 4 660 C 30 500, -6 320, 18 150" />
      <path className="ink-line draw text-navy" pathLength={1} strokeWidth="8" style={{ ["--d" as string]: "2.4s", ["--delay" as string]: "1.4s" }}
        d="M-34 640 C 0 880, 300 900, 520 888 S 720 870, 760 740" />
      {/* altın tezhip dalı: sağ üst köşede kıvrılır */}
      <path className="ink-line draw text-gold" pathLength={1} strokeWidth="1.8" style={{ ["--d" as string]: "3.4s", ["--delay" as string]: "1.2s" }}
        d="M560 24 C 660 -30, 770 20, 742 110 C 718 182, 626 168, 640 104 C 650 62, 708 70, 700 108" />
      <path className="ink-line draw text-gold" pathLength={1} strokeWidth="1.8" style={{ ["--d" as string]: "3s", ["--delay" as string]: "2s" }}
        d="M-14 120 C -40 56, 20 -8, 96 12 C 150 26, 146 84, 104 80" />
      <circle className="fade-in" cx="760" cy="740" r="8" fill="#7a1f33" style={{ ["--delay" as string]: "3.6s" }} />
      <circle className="fade-in" cx="-14" cy="120" r="5" fill="#b08a2e" style={{ ["--delay" as string]: "2.8s" }} />
    </svg>
  );
}

/** Bölümleri ayıran ince hat süsü. */
export function HatDivider({ className = "" }: { className?: string }) {
  return (
    <svg data-draw viewBox="0 0 1200 40" preserveAspectRatio="none" className={`h-8 w-full text-gold ${className}`} aria-hidden="true" focusable="false">
      <path className="ink-line" pathLength={1} strokeWidth="1.3"
        d="M0 20 C 120 4, 200 36, 320 20 S 500 4, 600 20 S 800 36, 900 20 S 1100 4, 1200 20" />
      <path d="M600 8 L610 20 L600 32 L590 20 Z" fill="currentColor" />
    </svg>
  );
}

/** Sayfa kaydıkça uzayan ana hat. */
export function ScrollHat() {
  return (
    <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden h-screen w-16 text-gold opacity-60 lg:block" aria-hidden="true" focusable="false">
      <path className="ink-line scroll-draw" pathLength={1} strokeWidth="1.4"
        d="M60 0 C 10 120, 90 220, 50 340 S 10 560, 60 680 S 90 860, 40 1000" />
    </svg>
  );
}
