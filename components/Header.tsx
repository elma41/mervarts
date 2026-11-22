import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { publicUrl } from "@/lib/format";
import { IconBag, IconMenu } from "./Icons";

const NAV = [
  { href: "/urunler", label: "Koleksiyon" },
  { href: "/ozel-siparis", label: "Özel Sipariş" },
  { href: "/hakkinda", label: "Hikâye" },
  { href: "/iletisim", label: "İletişim" },
];

export function Logo({ s, light = false }: { s: SiteSettings; light?: boolean }) {
  if (s.logo_path) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={publicUrl("branding", s.logo_path)} alt={`${s.brand_name} logosu`} width={160} height={48} className="h-10 w-auto object-contain" />
    );
  }
  return (
    <span className={`font-display text-[1.6rem] leading-none ${light ? "text-paper" : "text-ink"}`}>
      merv<span className="inline-block -translate-y-[2px] text-pink">●</span>arts
    </span>
  );
}

export default function Header({ s }: { s: SiteSettings }) {
  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-4 rounded-full border-[2.5px] border-ink bg-paper/90 pl-5 pr-2 shadow-[4px_4px_0_#1e1233] backdrop-blur-md">
        <Link href="/" aria-label={`${s.brand_name} ana sayfa`} className="wiggle shrink-0">
          <Logo s={s} />
        </Link>

        <nav aria-label="Ana menü" className="hidden md:block">
          <ul className="flex items-center gap-1 text-[0.95rem] font-bold">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="rounded-full px-4 py-2 transition-colors hover:bg-sun">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={s.shopier_url} target="_blank" rel="noopener" className="btn btn-primary hidden !min-h-[46px] !px-5 !shadow-none hover:!shadow-[3px_3px_0_#1e1233] sm:inline-flex">
            <IconBag className="h-4 w-4" /> Mağaza
          </a>
          <details className="relative md:hidden">
            <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full bg-ink text-paper [&::-webkit-details-marker]:hidden" aria-label="Menüyü aç">
              <IconMenu />
            </summary>
            <nav aria-label="Mobil menü" className="pop-card absolute right-0 top-16 w-64 bg-paper p-3">
              <ul className="flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <li key={n.href}>
                    <Link href={n.href} className={`block rounded-2xl px-4 py-3 font-display text-xl ${["hover:bg-pink", "hover:bg-sun", "hover:bg-mint", "hover:bg-sky"][i]}`}>{n.label}</Link>
                  </li>
                ))}
                <li>
                  <a href={s.shopier_url} target="_blank" rel="noopener" className="btn btn-primary mt-2 w-full">Shopier Mağazası</a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
