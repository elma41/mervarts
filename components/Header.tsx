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

export function Logo({ s, light = false }: { s: SiteSettings; light?: boolean }) {
  if (s.logo_path) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={publicUrl("branding", s.logo_path)} alt={`${s.brand_name} logosu`} width={160} height={48} className="h-10 w-auto object-contain" />
    );
  }
  return <span className={`font-display text-[1.6rem] leading-none ${light ? "text-white" : "text-ink"}`}>merv.arts</span>;
}

export default function Header({ s }: { s: SiteSettings }) {
  return (
    <header className="relative z-40">
      <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-10 lg:px-14">
        <Link href="/" aria-label={`${s.brand_name} ana sayfa`} className="shrink-0">
          <Logo s={s} />
        </Link>

        <nav aria-label="Ana menü" className="hidden md:block">
          <ul className="flex items-center gap-9 text-[0.95rem] font-medium">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="py-2 transition-colors hover:text-cobalt">{n.label}</Link>
              </li>
            ))}
            <li>
              <a href={s.shopier_url} target="_blank" rel="noopener" className="link-line !border-cobalt">Shopier mağazası</a>
            </li>
          </ul>
        </nav>

        <details className="relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center border border-ink [&::-webkit-details-marker]:hidden" aria-label="Menüyü aç">
            <IconMenu />
          </summary>
          <nav aria-label="Mobil menü" className="absolute right-0 top-14 w-64 border border-line bg-paper-2 p-2 shadow-xl">
            <ul className="flex flex-col">
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href} className="block px-4 py-3 font-display text-xl hover:text-cobalt">{n.label}</Link></li>
              ))}
              <li><a href={s.shopier_url} target="_blank" rel="noopener" className="btn btn-primary mt-2 w-full">Shopier mağazası</a></li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
