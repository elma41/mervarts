"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "@/components/admin/AdminShell";
import SimpleText from "@/components/SimpleText";
import { dateTR } from "@/lib/format";
import type { LegalPage } from "@/lib/types";

export default function Legal() {
  const sb = browserClient();
  const { toast } = useAdmin();
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [cur, setCur] = useState<string>("kvkk");
  const [draft, setDraft] = useState<{ title: string; body: string } | null>(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    sb.from("legal_pages").select("*").order("slug").then(({ data }) => {
      const ps = (data as LegalPage[]) || [];
      setPages(ps);
      const k = ps.find((p) => p.slug === "kvkk") || ps[0];
      if (k) setDraft({ title: k.title, body: k.body });
    });
  }, [sb]);

  const page = pages.find((p) => p.slug === cur);
  const dirty = !!page && !!draft && (draft.title !== page.title || draft.body !== page.body);

  function pick(slug: string) {
    if (dirty && !confirm("Kaydedilmemiş değişiklikler kaybolacak. Devam edilsin mi?")) return;
    const p = pages.find((x) => x.slug === slug);
    setCur(slug); setPreview(false);
    if (p) setDraft({ title: p.title, body: p.body });
  }

  async function save() {
    if (!draft || !page) return;
    setSaving(true);
    const { data, error } = await sb.from("legal_pages").update({ title: draft.title.trim(), body: draft.body }).eq("slug", page.slug).select("*").single();
    setSaving(false);
    if (error) { toast("Kaydedilemedi: " + error.message, "err"); return; }
    setPages((ps) => ps.map((p) => (p.slug === page.slug ? (data as LegalPage) : p)));
    toast(`Kaydedildi (sürüm ${(data as LegalPage).version})`);
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl">KVKK ve yasal metinler</h1>
        <p className="text-earth">Metin değiştiğinde sürüm numarası otomatik artar; form onayları hangi sürüme verildiğiyle birlikte saklanır.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {pages.map((p) => (
          <button key={p.slug} role="tab" aria-selected={cur === p.slug} onClick={() => pick(p.slug)}
            className={`rounded-full border px-4 py-2 font-medium ${cur === p.slug ? "border-ink bg-ink text-paper" : "border-line bg-paper"}`}>{p.title}</button>
        ))}
      </div>

      {page && draft && (
        <section className="grid gap-4 rounded-2xl border border-line bg-paper p-5">
          <p className="text-sm text-earth">Sürüm {page.version} · Son güncelleme {dateTR(page.updated_at)} · <Link href={`/${page.slug}`} target="_blank" className="text-clay underline">Sitede gör ↗</Link></p>
          <div>
            <label htmlFor="lt" className="field-label">Başlık</label>
            <input id="lt" className="field" maxLength={120} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="button" className={`rounded-full border px-4 py-1.5 text-sm ${!preview ? "border-ink bg-ink text-paper" : "border-line"}`} onClick={() => setPreview(false)}>Düzenle</button>
            <button type="button" className={`rounded-full border px-4 py-1.5 text-sm ${preview ? "border-ink bg-ink text-paper" : "border-line"}`} onClick={() => setPreview(true)}>Önizleme</button>
          </div>
          {preview ? (
            <div className="prose-art rounded-xl border border-line bg-paper-2/40 p-5"><SimpleText text={draft.body} /></div>
          ) : (
            <>
              <label htmlFor="lb" className="sr-only">Metin</label>
              <textarea id="lb" className="field font-mono text-sm" rows={22} maxLength={60000} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              <p className="text-xs text-earth">Biçim: <code>## Başlık</code>, <code>### Alt başlık</code>, <code>- madde</code>, <code>**kalın**</code>. Paragraflar arasında boş satır bırakın.</p>
            </>
          )}
          <button className="btn btn-primary justify-self-start" disabled={saving || !dirty} onClick={save}>{saving ? "Kaydediliyor…" : dirty ? "Kaydet" : "Değişiklik yok"}</button>
        </section>
      )}
    </div>
  );
}
