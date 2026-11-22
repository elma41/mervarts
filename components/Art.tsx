/** Özgün, hafif SVG çizimler — ürün fotoğrafı olmadığında ve kategori kartlarında kullanılır. */
type P = { className?: string };

export const ArtPainting = ({ className = "" }: P) => (
  <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
    <rect x="22" y="18" width="156" height="200" rx="6" fill="#fff" stroke="#1e1233" strokeWidth="5" />
    <rect x="36" y="32" width="128" height="172" rx="2" fill="#ffd23f" />
    <circle cx="122" cy="82" r="30" fill="#ff4f8b" />
    <path d="M36 160c26-26 52-30 78-12s38 6 50-10v66H36Z" fill="#6c3cf0" />
    <path d="M36 186c30-16 60-14 92 0 14 6 26 4 36-2v20H36Z" fill="#1e1233" />
    <path d="M52 120c14-12 30-14 46-4" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const ArtVase = ({ className = "" }: P) => (
  <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
    <path d="M78 30h44v18c0 8 26 18 30 50 5 40-10 92-52 112-42-20-57-72-52-112 4-32 30-42 30-50Z" fill="#ff8a1f" stroke="#1e1233" strokeWidth="5" strokeLinejoin="round" />
    <path d="M62 112c26 10 50 10 76 0" fill="none" stroke="#1e1233" strokeWidth="5" strokeLinecap="round" />
    <path d="M58 142c28 12 56 12 84 0" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    <circle cx="82" cy="172" r="7" fill="#1e1233" /><circle cx="104" cy="178" r="7" fill="#1e1233" /><circle cx="124" cy="170" r="7" fill="#1e1233" />
    <path d="M96 30c-6-16-2-24 8-28M104 30c8-12 18-14 26-10" fill="none" stroke="#2bd4a8" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const ArtJewel = ({ className = "" }: P) => (
  <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
    <path d="M36 30c10 80 118 80 128 0" fill="none" stroke="#1e1233" strokeWidth="5" strokeLinecap="round" />
    {[[52, 74, "#ff4f8b"], [74, 96, "#ffd23f"], [100, 104, "#55c8ff"], [126, 96, "#ffd23f"], [148, 74, "#ff4f8b"]].map(([x, y, c], i) => (
      <circle key={i} cx={x as number} cy={y as number} r="11" fill={c as string} stroke="#1e1233" strokeWidth="4" />
    ))}
    <path d="M100 116v20" stroke="#1e1233" strokeWidth="5" />
    <path d="M100 136l34 34-34 46-34-46Z" fill="#6c3cf0" stroke="#1e1233" strokeWidth="5" strokeLinejoin="round" />
    <path d="M84 160l16 14 16-14" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const ArtGift = ({ className = "" }: P) => (
  <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
    <rect x="34" y="100" width="132" height="112" rx="10" fill="#2bd4a8" stroke="#1e1233" strokeWidth="5" />
    <rect x="26" y="74" width="148" height="36" rx="8" fill="#ff4f8b" stroke="#1e1233" strokeWidth="5" />
    <rect x="88" y="74" width="24" height="138" fill="#ffd23f" stroke="#1e1233" strokeWidth="5" />
    <path d="M100 74c-30-10-46-40-26-50s26 30 26 50c0-20 6-60 26-50s4 40-26 50Z" fill="#ffd23f" stroke="#1e1233" strokeWidth="5" strokeLinejoin="round" />
    <path d="M150 140l6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2Z" fill="#fff" stroke="#1e1233" strokeWidth="3" />
  </svg>
);

export const ART_BY_SLUG: Record<string, (p: P) => React.ReactElement> = {
  tablolar: ArtPainting,
  seramik: ArtVase,
  taki: ArtJewel,
  hediyelik: ArtGift,
};
export const ART_LIST = [ArtPainting, ArtVase, ArtJewel, ArtGift];
export const TILE_BG = ["bg-sun", "bg-pink", "bg-sky", "bg-mint", "bg-lav", "bg-orange"];

/** Dönen yuvarlak yazı rozeti */
export function SpinBadge({ text = "EL YAPIMI ✦ TEK ÜRÜN ✦ MERV.ARTS ✦ ", className = "" }: { text?: string; className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="spin-slow h-full w-full">
        <defs><path id="circ" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" /></defs>
        <circle cx="100" cy="100" r="96" fill="#ffd23f" stroke="#1e1233" strokeWidth="5" />
        <text fontFamily="Bricolage, sans-serif" fontWeight="800" fontSize="19" letterSpacing="2.5" fill="#1e1233">
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-4xl text-ink">✿</span>
    </div>
  );
}

/** Yıldız / parıltı çıkartması */
export const Sparkle = ({ className = "", fill = "#ff4f8b" }: P & { fill?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path d="M50 4c4 26 20 42 46 46-26 4-42 20-46 46-4-26-20-42-46-46 26-4 42-20 46-46Z" fill={fill} stroke="#1e1233" strokeWidth="5" strokeLinejoin="round" />
  </svg>
);
