/** Özgün, hafif SVG kompozisyon: kemerli pencere, güneş, fırça darbesi ve dal. Görsel indirmesi yok → hızlı LCP. */
export default function HeroArt() {
  return (
    <svg viewBox="0 0 520 620" className="h-auto w-full" role="img" aria-labelledby="hero-art-title">
      <title id="hero-art-title">Kemerli bir pencere içinde güneş, fırça darbesi ve dal motifinden oluşan soyut çizim</title>
      <defs>
        <clipPath id="arch"><path d="M60 600V250a200 200 0 0 1 400 0v350Z" /></clipPath>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9d3bd" />
          <stop offset="1" stopColor="#d9b597" />
        </linearGradient>
      </defs>
      <path d="M60 600V250a200 200 0 0 1 400 0v350Z" fill="url(#sky)" />
      <g clipPath="url(#arch)">
        <circle cx="330" cy="250" r="86" fill="#9e4126" opacity=".88" />
        <path d="M40 470c70-40 140-48 210-20s150 30 240-14v190H40Z" fill="#55624a" opacity=".85" />
        <path d="M40 520c90-34 170-30 240-4s140 18 210-6v120H40Z" fill="#3d4636" />
        <path d="M30 560c120-20 220 14 300 4s120-18 200-8v80H30Z" fill="#221c18" opacity=".9" />
      </g>
      <path d="M60 600V250a200 200 0 0 1 400 0v350" fill="none" stroke="#221c18" strokeWidth="2" />
      <path className="brush-draw" d="M78 330c48-26 98-40 152-30 44 8 72 34 118 30 30-3 58-18 84-36" fill="none" stroke="#f6f1ea" strokeWidth="10" strokeLinecap="round" opacity=".9" />
      <g className="floaty" style={{ transformOrigin: "120px 160px" }}>
        <path d="M118 210c-6-46 6-92 40-128" fill="none" stroke="#55624a" strokeWidth="3" strokeLinecap="round" />
        <path d="M136 150c-22-6-38-22-42-44 22 2 40 18 42 44ZM146 118c18-14 40-16 58-6-14 16-36 20-58 6ZM124 186c-20 2-38-8-46-26 20-2 38 8 46 26Z" fill="#55624a" />
      </g>
      <circle cx="470" cy="110" r="18" fill="none" stroke="#9e4126" strokeWidth="2" />
      <circle cx="40" cy="300" r="6" fill="#9e4126" />
    </svg>
  );
}
