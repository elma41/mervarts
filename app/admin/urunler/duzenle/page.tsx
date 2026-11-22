"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "@/components/admin/AdminShell";
import ImageManager, { type ImgItem } from "@/components/admin/ImageManager";
import { productImage, slugify, sortImages } from "@/lib/format";
import { toWebp } from "@/lib/image";
import { BADGES, type Category, type Product } from "@/lib/types";

type Form = {
  name: string; slug: string; code: string; description: string; category_id: string;
  pricing_mode: "fixed" | "quote"; price: string; shopier_url: string;
  track_stock: boolean; stock: number; badges: string[]; status: "draft" | "published"; is_featured: boolean; sort_order: number;
};
const EMPTY: Form = { name: "", slug: "", code: "", description: "", category_id: "", pricing_mode: "fixed", price: "", shopier_url: "", track_stock: true, stock: 1, badges: ["El Yapımı"], status: "draft", is_featured: false, sort_order: 0 };

function EditProduct() {
  const id = useSearchParams().get("id") || "yeni";
  const isNew = id === "yeni";
  const router = useRouter();
  const sb = browserClient();
  const { toast } = useAdmin();
  const [f, setF] = useState<Form>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const [imgs, setImgs] = useState<ImgItem[]>([]);
  const [removed, setRemoved] = useState<ImgItem[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    sb.from("categories").select("*").order("sort_order").then(({ data }) => setCats((data as Category[]) || []));
    if (isNew) return;
    (async () => {
      const { data } = await sb.from("products").select("*, product_images(*)").eq("id", id).maybeSingle();
      const p = data as Product | null;
      if (!p) { toast("Ürün bulunamadı", "err"); router.replace("/admin/urunler"); return; }
      setF({
        name: p.name, slug: p.slug, code: p.code || "", description: p.description, category_id: p.category_id || "",
        pricing_mode: p.pricing_mode, price: p.price != null ? String(p.price) : "", shopier_url: p.shopier_url || "",
        track_stock: p.track_stock, stock: p.stock, badges: p.badges, status: p.status, is_featured: p.is_featured, sort_order: p.sort_order,
      });
      setSlugTouched(true);
      setImgs(sortImages(p.product_images).map((im) => ({ key: im.id, id: im.id, path: im.path, preview: productImage(im.path).sm, alt: im.alt, cover: im.is_cover })));
      setLoading(false);
    })();
  }, [id, isNew, sb, router, toast]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));

  function setImgsTracked(fn: (x: ImgItem[]) => ImgItem[]) {
    setImgs((cur) => {
      const next = fn(cur);
      const gone = cur.filter((c) => c.id && !next.some((n) => n.key === c.key));
      if (gone.length) setRemoved((r) => [...r, ...gone]);
      return next;
    });
  }

  function validate() {
    const e: string[] = [];
    if (!f.name.trim()) e.push("Ürün adı gerekli.");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) e.push("Bağlantı adı yalnızca küçük harf, rakam ve tire içerebilir.");
    if (f.code && !/^[A-Z0-9-]{2,20}$/.test(f.code)) e.push("Ürün kodu 2–20 karakter; büyük harf, rakam ve tire olmalı.");
    if (f.pricing_mode === "fixed" && !f.price) e.push("Sabit fiyatlı ürün için fiyat girin ya da \"Fiyat al / özel sipariş\" seçin.");
    if (f.pricing_mode === "fixed" && f.price && !(Number(f.price.replace(",", ".")) >= 0)) e.push("Fiyat geçerli bir sayı olmalı.");
    if (f.shopier_url && !/^https:\/\/(www\.)?shopier\.com\//.test(f.shopier_url)) e.push("Shopier bağlantısı https://www.shopier.com/ ile başlamalı.");
    if (f.status === "published" && imgs.length === 0) e.push("Yayına almak için en az bir fotoğraf ekleyin.");
    setErrors(e);
    return e.length === 0;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setSaving("Kaydediliyor…");
    const row = {
      name: f.name.trim(), slug: f.slug, code: f.code || null, description: f.description.trim(), category_id: f.category_id || null,
      pricing_mode: f.pricing_mode, price: f.pricing_mode === "fixed" && f.price ? Number(f.price.replace(",", ".")) : null,
      shopier_url: f.shopier_url || null, track_stock: f.track_stock, stock: Math.max(0, f.stock), badges: f.badges.slice(0, 4),
      status: f.status, is_featured: f.is_featured, sort_order: f.sort_order,
    };
    // Önce taslak olarak kaydet (fotoğraflar yüklenmeden yayına çıkmasın)
    const res = isNew
      ? await sb.from("products").insert({ ...row, status: "draft" }).select("id").single()
      : await sb.from("products").update(row).eq("id", id).select("id").single();
    if (res.error) {
      setSaving(null);
      const m = res.error.message.includes("products_slug_key") ? "Bu bağlantı adı başka bir üründe kullanılıyor."
        : res.error.message.includes("products_code_key") ? "Bu ürün kodu başka bir üründe kullanılıyor." : res.error.message;
      toast("Kaydedilemedi: " + m, "err");
      return;
    }
    const pid = res.data.id as string;

    // Kaldırılan görseller
    for (const r of removed) {
      if (r.id) await sb.from("product_images").delete().eq("id", r.id);
      if (r.path) await sb.storage.from("product-images").remove([r.path, r.path.replace(/\.webp$/, "-sm.webp")]);
    }
    setRemoved([]);

    // Yeni görselleri yükle, sırayı ve kapağı kaydet.
    // Veritabanı ürün başına tek kapak kabul ettiği için önce tüm kapak işaretleri kaldırılır.
    await sb.from("product_images").update({ is_cover: false }).eq("product_id", pid);
    const final: ImgItem[] = [];
    let n = 0;
    for (const it of imgs) {
      n++;
      if (it.file) {
        setSaving(`Fotoğraf yükleniyor (${n}/${imgs.length})…`);
        try {
          const name = crypto.randomUUID();
          const path = `${pid}/${name}.webp`;
          const [lg, sm] = await Promise.all([toWebp(it.file, 1600, 0.82), toWebp(it.file, 640, 0.78)]);
          const up1 = await sb.storage.from("product-images").upload(path, lg, { contentType: "image/webp", cacheControl: "31536000" });
          const up2 = await sb.storage.from("product-images").upload(`${pid}/${name}-sm.webp`, sm, { contentType: "image/webp", cacheControl: "31536000" });
          if (up1.error || up2.error) throw up1.error || up2.error;
          const ins = await sb.from("product_images").insert({ product_id: pid, path, alt: it.alt, sort_order: n, is_cover: it.cover }).select("id").single();
          if (ins.error) throw ins.error;
          final.push({ ...it, file: undefined, id: ins.data.id, path });
        } catch (err) {
          toast(`Bir fotoğraf yüklenemedi: ${(err as Error).message}`, "err");
        }
      } else if (it.id) {
        await sb.from("product_images").update({ alt: it.alt, sort_order: n, is_cover: it.cover }).eq("id", it.id);
        final.push(it);
      }
    }
    if (row.status === "published") await sb.from("products").update({ status: "published" }).eq("id", pid);

    setSaving(null);
    toast(row.status === "published" ? "Kaydedildi ve yayında" : "Taslak olarak kaydedildi");
    if (isNew) router.replace(`/admin/urunler/duzenle?id=${pid}`);
    else setImgs(final);
  }

  if (loading) return <p className="text-earth">Yükleniyor…</p>;

  return (
    <form onSubmit={save} className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/urunler" className="text-sm text-earth hover:text-clay">← Ürünler</Link>
          <h1 className="font-display text-3xl">{isNew ? "Yeni ürün" : f.name || "Ürünü düzenle"}</h1>
        </div>
        <div className="flex gap-2">
          {!isNew && f.status === "published" && <Link href={`/urun/${f.slug}`} target="_blank" className="btn btn-ghost !min-h-[44px]">Sitede gör ↗</Link>}
          <button className="btn btn-primary !min-h-[44px]" disabled={!!saving}>{saving || "Kaydet"}</button>
        </div>
      </div>

      {errors.length > 0 && (
        <div role="alert" className="rounded-2xl border border-clay bg-clay/5 p-4 text-sm text-clay-dark">
          <ul className="list-disc pl-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-6">
          <section className="grid gap-4 rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-xl">Temel bilgiler</h2>
            <div>
              <label htmlFor="name" className="field-label">Ürün adı *</label>
              <input id="name" className="field" required maxLength={120} value={f.name}
                onChange={(e) => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="slug" className="field-label">Bağlantı adı</label>
                <input id="slug" className="field" value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
                <p className="mt-1 truncate text-xs text-earth">/urun/{f.slug || "…"}</p>
              </div>
              <div>
                <label htmlFor="code" className="field-label">Ürün kodu (WhatsApp mesajında görünür)</label>
                <input id="code" className="field" maxLength={20} placeholder="Örn. TBL-012" value={f.code} onChange={(e) => set("code", e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))} />
              </div>
            </div>
            <div>
              <label htmlFor="cat" className="field-label">Kategori</label>
              <select id="cat" className="field" value={f.category_id} onChange={(e) => set("category_id", e.target.value)}>
                <option value="">— Kategorisiz —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="desc" className="field-label">Açıklama</label>
              <textarea id="desc" className="field" maxLength={4000} rows={7} value={f.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Malzeme, ölçü, renk, bakım önerisi, hikâyesi…" />
              <p className="mt-1 text-right text-xs text-earth">{f.description.length}/4000</p>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="mb-4 font-display text-xl">Fotoğraflar</h2>
            <ImageManager items={imgs} setItems={setImgsTracked} onError={(m) => toast(m, "err")} />
          </section>
        </div>

        <div className="grid content-start gap-6">
          <section className="grid gap-3 rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-xl">Yayın</h2>
            <label className="flex items-center justify-between gap-3 rounded-xl bg-paper-2 px-4 py-3">
              <span className="font-medium">Sitede yayında</span>
              <input type="checkbox" className="h-5 w-5 accent-[#55624a]" checked={f.status === "published"} onChange={(e) => set("status", e.target.checked ? "published" : "draft")} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-xl bg-paper-2 px-4 py-3">
              <span className="font-medium">Ana sayfa vitrininde göster</span>
              <input type="checkbox" className="h-5 w-5 accent-[#9e4126]" checked={f.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
            </label>
            <div>
              <label htmlFor="sort" className="field-label">Sıra (küçük olan önce)</label>
              <input id="sort" type="number" className="field" value={f.sort_order} onChange={(e) => set("sort_order", Number(e.target.value) || 0)} />
            </div>
          </section>

          <section className="grid gap-3 rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-xl">Fiyat ve satış</h2>
            <fieldset className="grid gap-2">
              <legend className="sr-only">Satış şekli</legend>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line px-4 py-3 has-[:checked]:border-ink">
                <input type="radio" name="pm" className="mt-1 accent-[#9e4126]" checked={f.pricing_mode === "fixed"} onChange={() => set("pricing_mode", "fixed")} />
                <span><strong>Sabit fiyat</strong><br /><span className="text-sm text-earth">Fiyat görünür, &quot;Shopier&apos;den satın al&quot; butonu çıkar.</span></span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line px-4 py-3 has-[:checked]:border-ink">
                <input type="radio" name="pm" className="mt-1 accent-[#9e4126]" checked={f.pricing_mode === "quote"} onChange={() => set("pricing_mode", "quote")} />
                <span><strong>Fiyat al / özel sipariş</strong><br /><span className="text-sm text-earth">Fiyat gizlenir, teklif formu ve WhatsApp öne çıkar.</span></span>
              </label>
            </fieldset>
            {f.pricing_mode === "fixed" && (
              <div>
                <label htmlFor="price" className="field-label">Fiyat (₺)</label>
                <input id="price" className="field" inputMode="decimal" placeholder="Örn. 750" value={f.price} onChange={(e) => set("price", e.target.value.replace(/[^0-9.,]/g, ""))} />
              </div>
            )}
            <div>
              <label htmlFor="shop" className="field-label">Bu ürünün Shopier bağlantısı</label>
              <input id="shop" type="url" className="field" placeholder="https://www.shopier.com/…" value={f.shopier_url} onChange={(e) => set("shopier_url", e.target.value.trim())} />
              <p className="mt-1 text-xs text-earth">Boş bırakılırsa genel mağaza bağlantısı kullanılır.</p>
            </div>
          </section>

          <section className="grid gap-3 rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-xl">Stok</h2>
            <label className="flex items-center justify-between gap-3 rounded-xl bg-paper-2 px-4 py-3">
              <span className="font-medium">Stok takibi yap</span>
              <input type="checkbox" className="h-5 w-5 accent-[#55624a]" checked={f.track_stock} onChange={(e) => set("track_stock", e.target.checked)} />
            </label>
            {f.track_stock && (
              <div>
                <label htmlFor="stock" className="field-label">Adet</label>
                <div className="flex items-center gap-2">
                  <button type="button" className="h-11 w-11 rounded-full border border-line" aria-label="Azalt" onClick={() => set("stock", Math.max(0, f.stock - 1))}>−</button>
                  <input id="stock" type="number" min={0} className="field max-w-[110px] text-center" value={f.stock} onChange={(e) => set("stock", Math.max(0, Number(e.target.value) || 0))} />
                  <button type="button" className="h-11 w-11 rounded-full border border-line" aria-label="Artır" onClick={() => set("stock", f.stock + 1)}>＋</button>
                </div>
                <p className="mt-1 text-xs text-earth">Adet 0 olunca ürün otomatik &quot;Tükendi&quot; olur ve özel sipariş butonu çıkar.</p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-xl">Rozetler <span className="text-sm font-normal text-earth">(en fazla 4)</span></h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {BADGES.map((b) => {
                const on = f.badges.includes(b);
                return (
                  <button key={b} type="button" aria-pressed={on} disabled={!on && f.badges.length >= 4}
                    onClick={() => set("badges", on ? f.badges.filter((x) => x !== b) : [...f.badges, b])}
                    className={`rounded-full border px-3 py-1.5 text-sm disabled:opacity-40 ${on ? "border-ink bg-ink text-paper" : "border-line"}`}>{b}</button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <button className="btn btn-primary shadow-xl" disabled={!!saving}>{saving || "Kaydet"}</button>
      </div>
    </form>
  );
}

export default function Page() {
  return <Suspense fallback={null}><EditProduct /></Suspense>;
}
