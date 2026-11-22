"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase";
import { useAdmin } from "@/components/admin/AdminShell";
import { dateTR } from "@/lib/format";

type Tab = "teklif" | "iletisim" | "oneri";
const TABLE: Record<Tab, string> = { teklif: "quote_requests", iletisim: "contact_messages", oneri: "feedback_messages" };
const STATUS_LABEL: Record<string, string> = { new: "Yeni", read: "Okundu", answered: "Yanıtlandı", archived: "Arşiv" };
const KIND_LABEL: Record<string, string> = { genel: "Genel", isbirligi: "İş birliği", sergi: "Sergi / etkinlik", oneri: "Öneri", istek: "İstek", sikayet: "Şikayet" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function phoneDigits(p?: string | null) {
  if (!p) return null;
  let d = p.replace(/\D/g, "");
  if (d.startsWith("0")) d = "90" + d.slice(1);
  if (d.length === 10) d = "90" + d;
  return d.length >= 11 ? d : null;
}

function Inbox() {
  const sb = browserClient();
  const params = useSearchParams();
  const router = useRouter();
  const { counts, refreshCounts, toast } = useAdmin();
  const tab = (["teklif", "iletisim", "oneri"].includes(params.get("tab") || "") ? params.get("tab") : "teklif") as Tab;
  const [showArchived, setShowArchived] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [img, setImg] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setRows(null);
    let q = sb.from(TABLE[tab]).select(tab === "teklif" ? "*, products(name,slug)" : "*").order("created_at", { ascending: false }).limit(200);
    q = showArchived ? q.eq("status", "archived") : q.neq("status", "archived");
    const { data, error } = await q;
    if (error) toast(error.message, "err");
    setRows((data as Row[]) || []);
  }, [sb, tab, showArchived, toast]);
  useEffect(() => { void load(); }, [load]);

  async function setStatus(r: Row, status: string) {
    const { error } = await sb.from(TABLE[tab]).update({ status }).eq("id", r.id);
    if (error) { toast(error.message, "err"); return; }
    setRows((cur) => (cur || []).map((x) => (x.id === r.id ? { ...x, status } : x)).filter((x) => showArchived ? x.status === "archived" : x.status !== "archived"));
    void refreshCounts();
  }

  async function remove(r: Row) {
    if (!confirm("Bu kayıt kalıcı olarak silinsin mi? (KVKK kapsamında silme talebi için kullanılabilir)")) return;
    if (r.reference_image_path) await sb.storage.from("quote-uploads").remove([r.reference_image_path]);
    const { error } = await sb.from(TABLE[tab]).delete().eq("id", r.id);
    if (error) { toast(error.message, "err"); return; }
    setRows((cur) => (cur || []).filter((x) => x.id !== r.id));
    toast("Silindi"); void refreshCounts();
  }

  async function toggle(r: Row) {
    const next = open === r.id ? null : r.id;
    setOpen(next);
    if (next && r.status === "new") void setStatus(r, "read");
    if (next && r.reference_image_path && !img[r.id]) {
      const { data } = await sb.storage.from("quote-uploads").createSignedUrl(r.reference_image_path, 600);
      if (data?.signedUrl) setImg((m) => ({ ...m, [r.id]: data.signedUrl }));
    }
  }

  const tabs: { k: Tab; l: string; n: number }[] = [
    { k: "teklif", l: "Fiyat teklifleri", n: counts.quotes },
    { k: "iletisim", l: "İletişim mesajları", n: counts.contact },
    { k: "oneri", l: "Öneri / şikayet", n: counts.feedback },
  ];

  return (
    <>
      <h1 className="font-display text-3xl">Gelen kutusu</h1>
      <div className="mt-6 flex flex-wrap items-center gap-2" role="tablist">
        {tabs.map((t) => (
          <button key={t.k} role="tab" aria-selected={tab === t.k} onClick={() => { setOpen(null); router.replace(`/admin/gelen-kutusu?tab=${t.k}`); }}
            className={`rounded-full border px-4 py-2 font-medium ${tab === t.k ? "border-ink bg-ink text-paper" : "border-line bg-paper"}`}>
            {t.l} {t.n > 0 && <span className="ml-1 rounded-full bg-clay px-2 text-xs font-bold text-white">{t.n}</span>}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="accent-[#9e4126]" /> Arşivi göster
        </label>
      </div>

      {rows === null ? <p className="mt-6 text-earth">Yükleniyor…</p> : rows.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line bg-paper p-8 text-center text-earth">Burada henüz kayıt yok.</p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {rows.map((r) => {
            const tel = phoneDigits(r.phone || (tab === "oneri" ? r.contact : null));
            const email = r.email || (tab === "oneri" && /@/.test(r.contact || "") ? r.contact : null);
            const isOpen = open === r.id;
            return (
              <li key={r.id} className={`rounded-2xl border bg-paper ${r.status === "new" ? "border-clay" : "border-line"}`}>
                <button className="flex w-full flex-wrap items-center gap-3 p-4 text-left" aria-expanded={isOpen} onClick={() => toggle(r)}>
                  {r.status === "new" && <span className="h-2.5 w-2.5 rounded-full bg-clay" aria-label="Yeni" />}
                  <span className="font-semibold">{r.name || "İsimsiz"}</span>
                  {r.kind && <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs font-semibold">{KIND_LABEL[r.kind] || r.kind}</span>}
                  {tab === "teklif" && r.products?.name && <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs">{r.products.name}</span>}
                  <span className="min-w-0 flex-1 truncate text-sm text-earth">{r.details || r.message}</span>
                  <span className="text-xs text-earth">{dateTR(r.created_at)}</span>
                  <span className="text-xs font-semibold">{STATUS_LABEL[r.status]}</span>
                </button>
                {isOpen && (
                  <div className="grid gap-4 border-t border-line p-4">
                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                      {r.phone && <div><dt className="text-earth">Telefon</dt><dd className="font-medium">{r.phone}</dd></div>}
                      {r.email && <div><dt className="text-earth">E-posta</dt><dd className="font-medium break-all">{r.email}</dd></div>}
                      {r.contact && <div><dt className="text-earth">İletişim</dt><dd className="font-medium break-all">{r.contact}</dd></div>}
                      {r.dimensions && <div><dt className="text-earth">Ölçü / adet</dt><dd className="font-medium">{r.dimensions}</dd></div>}
                      {tab === "teklif" && r.products?.slug && <div><dt className="text-earth">Ürün</dt><dd><Link className="font-medium text-clay underline" href={`/urun/${r.products.slug}`} target="_blank">{r.products.name}</Link></dd></div>}
                      <div><dt className="text-earth">KVKK onayı</dt><dd className="font-medium">✓ {dateTR(r.kvkk_consent_at)} (metin sürüm {r.kvkk_version})</dd></div>
                    </dl>
                    <p className="whitespace-pre-wrap rounded-xl bg-paper-2 p-4">{r.details || r.message}</p>
                    {r.reference_image_path && (img[r.id]
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <a href={img[r.id]} target="_blank" rel="noopener"><img src={img[r.id]} alt="Müşterinin gönderdiği örnek görsel" className="max-h-72 rounded-xl border border-line" /></a>
                      : <p className="text-sm text-earth">Örnek görsel yükleniyor…</p>)}
                    <div className="flex flex-wrap gap-2">
                      {tel && <a className="btn btn-wa !min-h-[40px] !px-4 text-sm" target="_blank" rel="noopener" href={`https://wa.me/${tel}?text=${encodeURIComponent(`Merhaba ${r.name || ""}, merv.arts'tan yazıyorum. Talebiniz için teşekkürler.`)}`}>WhatsApp ile yanıtla</a>}
                      {email && <a className="btn btn-dark !min-h-[40px] !px-4 text-sm" href={`mailto:${email}?subject=${encodeURIComponent("merv.arts — talebiniz hakkında")}`}>E-posta yaz</a>}
                      {tel && <a className="btn btn-ghost !min-h-[40px] !px-4 text-sm" href={`tel:+${tel}`}>Ara</a>}
                      {tab !== "oneri" && r.status !== "answered" && <button className="btn btn-ghost !min-h-[40px] !px-4 text-sm" onClick={() => setStatus(r, "answered")}>Yanıtlandı işaretle</button>}
                      {r.status !== "new" && <button className="btn btn-ghost !min-h-[40px] !px-4 text-sm" onClick={() => setStatus(r, "new")}>Okunmadı yap</button>}
                      {r.status !== "archived"
                        ? <button className="btn btn-ghost !min-h-[40px] !px-4 text-sm" onClick={() => setStatus(r, "archived")}>Arşivle</button>
                        : <button className="btn btn-ghost !min-h-[40px] !px-4 text-sm" onClick={() => setStatus(r, "read")}>Arşivden çıkar</button>}
                      <button className="ml-auto rounded-full px-4 text-sm text-clay-dark hover:bg-clay/10" onClick={() => remove(r)}>Kalıcı sil</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function Page() {
  return <Suspense fallback={<p className="text-earth">Yükleniyor…</p>}><Inbox /></Suspense>;
}
