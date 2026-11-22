"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "@/components/admin/AdminShell";

type Stat = { product_id: string; name: string; views: number; shopier_clicks: number; whatsapp_clicks: number };
type Low = { id: string; name: string; stock: number; is_sold_out: boolean };

export default function Dashboard() {
  const sb = browserClient();
  const { counts } = useAdmin();
  const [totals, setTotals] = useState({ all: 0, published: 0, draft: 0 });
  const [low, setLow] = useState<Low[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    (async () => {
      const [a, p] = await Promise.all([
        sb.from("products").select("id", { count: "exact", head: true }),
        sb.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
      ]);
      const all = a.count || 0, published = p.count || 0;
      setTotals({ all, published, draft: all - published });
      const { data: l } = await sb.from("products").select("id,name,stock,is_sold_out").eq("track_stock", true).lte("stock", 2).order("stock").limit(10);
      setLow((l as Low[]) || []);
      const { data: s } = await sb.from("product_stats").select("*").order("views", { ascending: false }).limit(8);
      setStats(((s as Stat[]) || []).filter((x) => x.views + x.shopier_clicks + x.whatsapp_clicks > 0));
    })();
  }, [sb]);

  const cards = [
    { label: "Toplam ürün", value: totals.all, href: "/admin/urunler" },
    { label: "Yayında", value: totals.published, href: "/admin/urunler" },
    { label: "Taslak", value: totals.draft, href: "/admin/urunler" },
    { label: "Yeni teklif talebi", value: counts.quotes, href: "/admin/gelen-kutusu?tab=teklif", hot: counts.quotes > 0 },
    { label: "Yeni iletişim mesajı", value: counts.contact, href: "/admin/gelen-kutusu?tab=iletisim", hot: counts.contact > 0 },
    { label: "Yeni öneri / şikayet", value: counts.feedback, href: "/admin/gelen-kutusu?tab=oneri", hot: counts.feedback > 0 },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Hoş geldiniz</h1>
          <p className="text-earth">Atölyenin kısa özeti.</p>
        </div>
        <Link href="/admin/urunler/duzenle?id=yeni" className="btn btn-primary">＋ Yeni ürün ekle</Link>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className={`block rounded-2xl border bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-md ${c.hot ? "border-clay" : "border-line"}`}>
              <p className="text-sm text-earth">{c.label}</p>
              <p className={`mt-1 font-display text-4xl ${c.hot ? "text-clay" : ""}`}>{c.value}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-xl">Kritik stok</h2>
          {low.length === 0 ? <p className="mt-2 text-sm text-earth">Stoğu 2 ve altına düşen ürün yok.</p> : (
            <ul className="mt-3 divide-y divide-line">
              {low.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <Link href={`/admin/urunler/duzenle?id=${p.id}`} className="font-medium hover:text-clay">{p.name}</Link>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.is_sold_out ? "bg-ink text-paper" : "bg-clay/10 text-clay-dark"}`}>
                    {p.is_sold_out ? "Tükendi" : `${p.stock} adet`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-display text-xl">En çok ilgi görenler</h2>
          {stats.length === 0 ? <p className="mt-2 text-sm text-earth">Henüz görüntülenme verisi yok. Ürünler yayına alınınca burada görünür.</p> : (
            <table className="mt-3 w-full text-sm">
              <thead><tr className="text-left text-earth"><th className="py-1 font-medium">Ürün</th><th className="font-medium">Görüntülenme</th><th className="font-medium">Shopier</th><th className="font-medium">WhatsApp</th></tr></thead>
              <tbody className="divide-y divide-line">
                {stats.map((s) => (
                  <tr key={s.product_id}><td className="py-2"><Link href={`/admin/urunler/duzenle?id=${s.product_id}`} className="hover:text-clay">{s.name}</Link></td><td>{s.views}</td><td>{s.shopier_clicks}</td><td>{s.whatsapp_clicks}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}
