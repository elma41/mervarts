"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "@/components/admin/AdminShell";
import { publicUrl, slugify } from "@/lib/format";
import { toWebp, validateImage } from "@/lib/image";
import type { Category, SiteSettings } from "@/lib/types";

export default function Settings() {
  const sb = browserClient();
  const { toast } = useAdmin();
  const [s, setS] = useState<SiteSettings | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState("");
  const [saving, setSaving] = useState(false);
  const logoInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const [{ data }, { data: c }] = await Promise.all([
      sb.from("site_settings").select("*").eq("id", 1).single(),
      sb.from("categories").select("*").order("sort_order"),
    ]);
    setS(data as SiteSettings);
    setCats((c as Category[]) || []);
  }, [sb]);
  useEffect(() => { void load(); }, [load]);

  if (!s) return <p className="text-earth">Yükleniyor…</p>;
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS({ ...s, [k]: v });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!s) return;
    let wa = (s.whatsapp_number || "").replace(/\D/g, "");
    if (wa.startsWith("0")) wa = "90" + wa.slice(1);
    if (wa.length === 10) wa = "90" + wa;
    if (wa && !/^[0-9]{10,15}$/.test(wa)) { toast("WhatsApp numarası geçersiz. Örn. 905321234567", "err"); return; }
    for (const [k, v] of [["Shopier", s.shopier_url], ["Instagram", s.instagram_url], ["Google yorum", s.google_review_url]] as const) {
      if (v && !/^https:\/\//.test(v)) { toast(`${k} bağlantısı https:// ile başlamalı.`, "err"); return; }
    }
    setSaving(true);
    const { error } = await sb.from("site_settings").update({
      brand_name: s.brand_name.trim(), tagline: s.tagline.trim(), about_text: s.about_text, whatsapp_number: wa || null,
      shopier_url: s.shopier_url.trim(), instagram_url: s.instagram_url.trim(), google_review_url: s.google_review_url?.trim() || null,
      contact_email: s.contact_email?.trim() || null,
    }).eq("id", 1);
    setSaving(false);
    if (error) toast("Kaydedilemedi: " + error.message, "err");
    else { toast("Ayarlar kaydedildi. Sitede en geç 1 dakika içinde görünür."); setS({ ...s, whatsapp_number: wa || null }); }
  }

  async function uploadLogo(file: File) {
    const err = validateImage(file, 10);
    if (err) { toast(err, "err"); return; }
    try {
      const blob = await toWebp(file, 600, 0.9);
      const path = `logo-${Date.now()}.webp`;
      const up = await sb.storage.from("branding").upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
      if (up.error) throw up.error;
      const old = s?.logo_path;
      const { error } = await sb.from("site_settings").update({ logo_path: path }).eq("id", 1);
      if (error) throw error;
      if (old) await sb.storage.from("branding").remove([old]);
      set("logo_path", path);
      toast("Logo güncellendi");
    } catch (e) { toast("Logo yüklenemedi: " + (e as Error).message, "err"); }
  }

  async function removeLogo() {
    if (!s?.logo_path || !confirm("Logo kaldırılsın mı? Yerine yazı logosu görünür.")) return;
    await sb.from("site_settings").update({ logo_path: null }).eq("id", 1);
    await sb.storage.from("branding").remove([s.logo_path]);
    set("logo_path", null); toast("Logo kaldırıldı");
  }

  async function addCat() {
    const name = newCat.trim();
    if (!name) return;
    const { error } = await sb.from("categories").insert({ name, slug: slugify(name) || `kategori-${Date.now()}`, sort_order: cats.length + 1 });
    if (error) toast(error.message.includes("slug") ? "Bu isimde kategori zaten var." : error.message, "err");
    else { setNewCat(""); toast("Kategori eklendi"); void load(); }
  }
  async function renameCat(c: Category, name: string) {
    if (!name.trim() || name === c.name) return;
    const { error } = await sb.from("categories").update({ name: name.trim() }).eq("id", c.id);
    if (error) toast(error.message, "err"); else { toast("Kategori güncellendi"); void load(); }
  }
  async function moveCat(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= cats.length) return;
    const a = cats[i], b = cats[j];
    await Promise.all([
      sb.from("categories").update({ sort_order: j + 1 }).eq("id", a.id),
      sb.from("categories").update({ sort_order: i + 1 }).eq("id", b.id),
    ]);
    void load();
  }
  async function deleteCat(c: Category) {
    if (!confirm(`"${c.name}" kategorisi silinsin mi? Bu kategorideki ürünler "kategorisiz" olur.`)) return;
    await sb.from("products").update({ category_id: null }).eq("category_id", c.id);
    const { error } = await sb.from("categories").delete().eq("id", c.id);
    if (error) toast(error.message, "err"); else { toast("Kategori silindi"); void load(); }
  }

  return (
    <div className="grid gap-6">
      <h1 className="font-display text-3xl">Site ayarları</h1>

      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-display text-xl">Logo</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-48 items-center justify-center rounded-xl border border-line bg-paper-2 p-2">
            {s.logo_path
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={publicUrl("branding", s.logo_path)} alt="Mevcut logo" className="max-h-full max-w-full object-contain" />
              : <span className="font-display text-xl">merv<span className="text-clay">.</span>arts</span>}
          </div>
          <button type="button" className="btn btn-dark !min-h-[42px]" onClick={() => logoInput.current?.click()}>{s.logo_path ? "Logoyu değiştir" : "Logo yükle"}</button>
          {s.logo_path && <button type="button" className="text-sm text-clay-dark underline" onClick={removeLogo}>Kaldır</button>}
          <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadLogo(f); e.target.value = ""; }} />
        </div>
        <p className="mt-2 text-sm text-earth">Şeffaf arka planlı PNG önerilir. Logo yüklenmezse yazı logosu kullanılır.</p>
      </section>

      <form onSubmit={save} className="grid gap-4 rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-display text-xl">Marka ve bağlantılar</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="field-label" htmlFor="bn">Marka / sanatçı adı</label><input id="bn" className="field" value={s.brand_name} onChange={(e) => set("brand_name", e.target.value)} /></div>
          <div><label className="field-label" htmlFor="tg">Kısa slogan</label><input id="tg" className="field" value={s.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
          <div>
            <label className="field-label" htmlFor="wa">WhatsApp numarası</label>
            <input id="wa" className="field" inputMode="tel" placeholder="0532 123 45 67" value={s.whatsapp_number || ""} onChange={(e) => set("whatsapp_number", e.target.value)} />
            <p className="mt-1 text-xs text-earth">Boş bırakılırsa WhatsApp butonları gizlenir.</p>
          </div>
          <div><label className="field-label" htmlFor="em">İletişim e-postası</label><input id="em" type="email" className="field" value={s.contact_email || ""} onChange={(e) => set("contact_email", e.target.value)} /></div>
          <div><label className="field-label" htmlFor="sh">Shopier mağaza bağlantısı</label><input id="sh" type="url" className="field" value={s.shopier_url} onChange={(e) => set("shopier_url", e.target.value)} /></div>
          <div><label className="field-label" htmlFor="ig">Instagram bağlantısı</label><input id="ig" type="url" className="field" value={s.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} /></div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="gr">Google İşletme yorum bağlantısı</label>
            <input id="gr" type="url" className="field" placeholder="https://g.page/r/…/review" value={s.google_review_url || ""} onChange={(e) => set("google_review_url", e.target.value)} />
            <p className="mt-1 text-xs text-earth">Google İşletme Profili → &quot;Yorum iste&quot; bölümündeki bağlantıyı yapıştırın.</p>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="ab">Hakkında yazısı</label>
            <textarea id="ab" className="field" rows={7} value={s.about_text} onChange={(e) => set("about_text", e.target.value)} placeholder="Kendinizi ve üretim hikâyenizi anlatın. Her paragraf için bir satır boşluk bırakın." />
          </div>
        </div>
        <button className="btn btn-primary justify-self-start" disabled={saving}>{saving ? "Kaydediliyor…" : "Ayarları kaydet"}</button>
      </form>

      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-display text-xl">Kategoriler</h2>
        <ul className="mt-3 grid gap-2">
          {cats.map((c, i) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor={`cat-${c.id}`}>Kategori adı</label>
              <input id={`cat-${c.id}`} className="field max-w-xs" defaultValue={c.name} onBlur={(e) => renameCat(c, e.target.value)} />
              <span className="text-xs text-earth">/{c.slug}</span>
              <button className="h-9 w-9 rounded-full border border-line disabled:opacity-30" disabled={i === 0} onClick={() => moveCat(i, -1)} aria-label="Yukarı">↑</button>
              <button className="h-9 w-9 rounded-full border border-line disabled:opacity-30" disabled={i === cats.length - 1} onClick={() => moveCat(i, 1)} aria-label="Aşağı">↓</button>
              <button className="rounded-full px-3 py-1.5 text-sm text-clay-dark hover:bg-clay/10" onClick={() => deleteCat(c)}>Sil</button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <label className="sr-only" htmlFor="nc">Yeni kategori</label>
          <input id="nc" className="field max-w-xs" placeholder="Yeni kategori adı" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void addCat(); } }} />
          <button className="btn btn-dark !min-h-[48px]" onClick={addCat}>Ekle</button>
        </div>
      </section>
    </div>
  );
}
