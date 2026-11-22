import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { publicUrl } from "@/lib/format";
import { IconMenu } from "./Icons";

const NAV = [
  { href: "/urunler", label: "Koleksiyon" },
  { href: "/ozel-siparis", label: "Özel sipariş" },
  { href: "/hakkinda", label: "Atölye" },
  { href: "/iletisim", label: "İletişim" },
];

/** Marka işareti: tezhip rozeti içinde "m" harfi + yazı logosu. */
export function Mark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true" focusable="false">
      <circle r="47" fill="#7a1f33" />
      <circle r="43" fill="none" stroke="#e6c677" strokeWidth="1.4" />
      <g fill="none" stroke="#e6c677" strokeWidth="1.2" strokeLinecap="round" opacity=".85">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <path key={r} transform={`rotate(${r})`} d="M0 -30 C 5 -36, 5 -41, 0 -43 C -5 -41, -5 -36, 0 -30" />
        ))}
      </g>
      <text x="0" y="13" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="600" fontSize="42" fill="#fffdf8">m</text>
    </svg>
  );
}

export function Logo({ s, light = false }: { s: SiteSettings; light?: boolean }) {
  if (s.logo_path) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={publicUrl("branding", s.logo_path)} alt={`${s.brand_name} logosu`} width={160} height={48} className="h-10 w-auto object-contain" />
    );
  }
  return (
    <span className="flex items-center gap-3">
      <Mark />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.9rem] font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>merv<span className="text-gold">.</span>arts</span>
        <span className={`mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/80" : "text-earth"}`}>tezhip · hat sanatı</span>
      </span>
    </span>
  );
}

/** Shopier düğmesi: alışveriş çantası simgesi + Shopier yazısı. */
export function ShopierButton({ href, label = "Shopier'de satın al", className = "" }: { href: string; label?: string; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={`shopier-btn ${className}`}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M6 7h12l1 13H5L6 7z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </svg>
      <span>{label}</span>
    </a>
  );
}

export default function Header({ s }: { s: SiteSettings }) {
  const wa = s.whatsapp_number ? `https://wa.me/${s.whatsapp_number.replace(/\D/g, "")}` : null;
  return (
    <header className="relative z-40">
      <div className="topbar">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-10 lg:px-14">
          <p>El yapımı tezhip ve hat sanatı, kişiye özel sipariş alınır</p>
          <p className="hidden items-center gap-5 sm:flex">
            <span>Güvenli ödeme: Shopier</span>
            {wa && <a href={wa} target="_blank" rel="noopener">WhatsApp ile sipariş</a>}
            {s.instagram_url && <a href={s.instagram_url} target="_blank" rel="noopener">Instagram</a>}
          </p>
        </div>
      </div>

      <div className="border-b border-line bg-mat">
        <div className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-10 lg:px-14">
          <Link href="/" aria-label={`${s.brand_name} ana sayfa`} className="shrink-0">
            <Logo s={s} />
          </Link>

          <nav aria-label="Ana menü" className="hidden md:block">
            <ul className="flex items-center gap-8 text-base font-semibold text-ink">
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href} className="nav-link py-2">{n.label}</Link></li>
              ))}
              <li><ShopierButton href={s.shopier_url} label="Shopier mağazası" /></li>
            </ul>
          </nav>

          <details className="relative md:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center border border-ink [&::-webkit-details-marker]:hidden" aria-label="Menüyü aç">
              <IconMenu />
            </summary>
            <nav aria-label="Mobil menü" className="absolute right-0 top-14 w-72 border border-line bg-white p-2 shadow-xl">
              <ul className="flex flex-col">
                {NAV.map((n) => (
                  <li key={n.href}><Link href={n.href} className="block px-4 py-3 text-lg font-semibold hover:text-cobalt">{n.label}</Link></li>
                ))}
                <li className="p-2"><ShopierButton href={s.shopier_url} label="Shopier mağazası" className="w-full justify-center" /></li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
