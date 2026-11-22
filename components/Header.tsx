import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { publicUrl } from "@/lib/format";
import { IconBag, IconMenu } from "./Icons";

const NAV = [
  { href: "/urunler", label: "Koleksiyon" },
  { href: "/ozel-siparis", label: "Özel Sipariş" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/iletisim", label: "İletişim" },
];

export function Logo({ s }: { s: SiteSettings }) {
  if (s.logo_path) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={publicUrl("branding", s.logo_path)} alt={`${s.brand_name} logosu`} width={160} height={48} className="h-10 w-auto object-contain" />
    );
  }
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-[1.45rem] font-medium tracking-tight">
        merv<span className="text-clay">.</span>arts
      </span>
      <span className="text-[0.62rem] uppercase tracking-[0.28em] text-earth mt-1">{s.brand_name}</span>
    </span>
  );
}

export default function Header({ s }: { s: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label={`${s.brand_name} ana sayfa`} className="shrink-0">
          <Logo s={s} />
        </Link>

        <nav aria-label="Ana menü" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[0.95rem] font-medium">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="relative py-2 text-ink/85 transition-colors hover:text-clay after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-500 hover:after:scale-x-100">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={s.shopier_url} target="_blank" rel="noopener" className="btn btn-dark hidden !min-h-[42px] !px-4 sm:inline-flex">
            <IconBag className="h-4 w-4" /> Mağaza
          </a>
          {/* JS gerektirmeyen mobil menü */}
          <details className="group relative md:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-line [&::-webkit-details-marker]:hidden" aria-label="Menüyü aç">
              <IconMenu />
            </summary>
            <nav aria-label="Mobil menü" className="absolute right-0 top-14 w-60 rounded-2xl border border-line bg-paper p-3 shadow-xl">
              <ul className="flex flex-col">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="block rounded-xl px-4 py-3 font-medium hover:bg-paper-2">{n.label}</Link>
                  </li>
                ))}
                <li>
                  <a href={s.shopier_url} target="_blank" rel="noopener" className="mt-1 block rounded-xl bg-ink px-4 py-3 font-semibold text-paper">Shopier Mağazası</a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
