"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "@/components/admin/AdminShell";
import { price, productImage, sortImages } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

export default function ProductsAdmin() {
  const sb = browserClient();
  const { toast } = useAdmin();
  const [items, setItems] = useState<Product[] | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "soldout">("all");

  const load = useCallback(async () => {
    const [{ data }, { data: c }] = await Promise.all([
      sb.from("products").select("*, product_images(*), categories(slug,name)").order("sort_order").order("created_at", { ascending: false }),
      sb.from("categories").select("*").order("sort_order"),
    ]);
    setItems((data as Product[]) || []);
    setCats((c as Category[]) || []);
  }, [sb]);
  useEffect(() => { void load(); }, [load]);

  const shown = useMemo(() => (items || []).filter((p) => {
    if (filter === "published" && p.status !== "published") return false;
    if (filter === "draft" && p.status !== "draft") return false;
    if (filter === "soldout" && !p.is_sold_out) return false;
    const s = q.trim().toLocaleLowerCase("tr-TR");
    return !s || p.name.toLocaleLowerCase("tr-TR").includes(s) || (p.code || "").toLowerCase().includes(s);
  }), [items, q, filter]);

  async function patch(p: Product, change: Partial<Product>, okMsg: string) {
    const { error } = await sb.from("products").update(change).eq("id", p.id);
    if (error) toast("Kaydedilemedi: " + error.message, "err");
    else { toast(okMsg); void load(); }
  }

  async function remove(p: Product) {
    if (!confirm(`"${p.name}" kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`)) return;
    const paths = (p.product_images || []).flatMap((i) => [i.path, i.path.replace(/\.webp$/, "-sm.webp")]);
    await sb.from("product_events").delete().eq("product_id", p.id);
    await sb.from("quote_requests").update({ product_id: null }).eq("product_id", p.id);
    await sb.from("product_images").delete().eq("product_id", p.id);
    const { error } = await sb.from("products").delete().eq("id", p.id);
    if (error) { toast("Silinemedi: " + error.message, "err"); return; }
    if (paths.length) await sb.storage.from("product-images").remove(paths);
    toast("Ürün silindi"); void load();
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Ürünler</h1>
          <p className="text-earth">{items ? `${items.length} ürün` : "Yükleniyor…"}</p>
        </div>
        <Link href="/admin/urunler/yeni" className="btn btn-primary">＋ Yeni ürün</Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="ps">Ürün ara</label>
        <input id="ps" className="field max-w-xs" placeholder="Ad ya da kod ile ara…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filtre">
          {([["all", "Tümü"], ["published", "Yayında"], ["draft", "Taslak"], ["soldout", "Tükenen"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} aria-pressed={filter === v}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === v ? "border-ink bg-ink text-paper" : "border-line bg-paper"}`}>{l}</button>
          ))}
        </div>
      </div>

      {items && items.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper p-10 text-center">
          <p className="font-display text-2xl">Henüz ürün yok</p>
          <p className="mt-1 text-earth">İlk ürünü ekleyin; fotoğrafları sürükleyip bırakmanız yeterli.</p>
          <Link href="/admin/urunler/yeni" className="btn btn-primary mt-5">＋ İlk ürünü ekle</Link>
        </div>
      )}

      <ul className="mt-6 grid gap-3">
        {shown.map((p) => {
          const cover = sortImages(p.product_images)[0];
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper p-3 sm:flex-nowrap">
              <Link href={`/admin/urunler/${p.id}`} className="block h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-paper-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {cover && <img src={productImage(cover.path).sm} alt="" className="h-full w-full object-cover" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/urunler/${p.id}`} className="font-semibold hover:text-clay">{p.name}</Link>
                <p className="text-sm text-earth">
                  {p.code && <>{p.code} · </>}
                  {cats.find((c) => c.id === p.category_id)?.name || "Kategorisiz"} ·{" "}
                  {p.pricing_mode === "fixed" ? (p.price != null ? price(p.price) : "Fiyat girilmedi") : "Teklif usulü"}
                </p>
              </div>

              <div className="flex items-center gap-1" aria-label="Stok">
                {p.track_stock ? (
                  <>
                    <button className="h-9 w-9 rounded-full border border-line" aria-label="Stoğu azalt" onClick={() => patch(p, { stock: Math.max(0, p.stock - 1) }, "Stok güncellendi")}>−</button>
                    <span className={`min-w-[64px] text-center text-sm font-bold ${p.is_sold_out ? "text-clay-dark" : ""}`}>{p.is_sold_out ? "Tükendi" : `${p.stock} adet`}</span>
                    <button className="h-9 w-9 rounded-full border border-line" aria-label="Stoğu artır" onClick={() => patch(p, { stock: p.stock + 1 }, "Stok güncellendi")}>＋</button>
                  </>
                ) : <span className="text-sm text-earth">Stok takibi yok</span>}
              </div>

              <button onClick={() => patch(p, { is_featured: !p.is_featured }, p.is_featured ? "Vitrinden çıkarıldı" : "Vitrine eklendi")}
                className={`rounded-full border px-3 py-1.5 text-sm ${p.is_featured ? "border-clay text-clay" : "border-line"}`} aria-pressed={p.is_featured}>
                {p.is_featured ? "★ Vitrinde" : "☆ Vitrin"}
              </button>
              <button onClick={() => patch(p, { status: p.status === "published" ? "draft" : "published" }, p.status === "published" ? "Yayından kaldırıldı" : "Yayına alındı")}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${p.status === "published" ? "bg-sage text-white" : "bg-paper-3"}`}>
                {p.status === "published" ? "● Yayında" : "○ Taslak"}
              </button>
              <Link href={`/admin/urunler/${p.id}`} className="rounded-full border border-line px-3 py-1.5 text-sm">Düzenle</Link>
              <button onClick={() => remove(p)} className="rounded-full px-3 py-1.5 text-sm text-clay-dark hover:bg-clay/10">Sil</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
