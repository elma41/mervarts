"use client";
import { useRef, useState } from "react";
import { validateImage } from "@/lib/image";

export type ImgItem = {
  key: string;
  id?: string;          // veritabanında varsa
  path?: string;        // depolamadaki yol
  file?: File;          // henüz yüklenmemiş
  preview: string;
  alt: string;
  cover: boolean;
};

export default function ImageManager({ items, setItems, onError }: {
  items: ImgItem[]; setItems: (f: (x: ImgItem[]) => ImgItem[]) => void; onError: (m: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [dragKey, setDragKey] = useState<string | null>(null);

  function add(files: FileList | File[]) {
    const ok: ImgItem[] = [];
    for (const f of Array.from(files)) {
      const err = validateImage(f, 15);
      if (err) { onError(`${f.name}: ${err}`); continue; }
      ok.push({ key: crypto.randomUUID(), file: f, preview: URL.createObjectURL(f), alt: "", cover: false });
    }
    if (!ok.length) return;
    setItems((cur) => {
      const next = [...cur, ...ok];
      if (!next.some((x) => x.cover)) next[0].cover = true;
      return next;
    });
  }

  const move = (k: string, d: number) => setItems((cur) => {
    const i = cur.findIndex((x) => x.key === k);
    const j = i + d;
    if (i < 0 || j < 0 || j >= cur.length) return cur;
    const n = [...cur];
    [n[i], n[j]] = [n[j], n[i]];
    return n;
  });

  const dropOn = (targetKey: string) => setItems((cur) => {
    if (!dragKey || dragKey === targetKey) return cur;
    const from = cur.findIndex((x) => x.key === dragKey);
    const to = cur.findIndex((x) => x.key === targetKey);
    const n = [...cur];
    const [m] = n.splice(from, 1);
    n.splice(to, 0, m);
    return n;
  });

  return (
    <div>
      <div
        onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setOver(true); } }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { if (e.dataTransfer.files.length) { e.preventDefault(); setOver(false); add(e.dataTransfer.files); } }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${over ? "border-clay bg-clay/5" : "border-line bg-paper"}`}
      >
        <p className="font-display text-xl">Fotoğrafları buraya sürükleyip bırakın</p>
        <p className="mt-1 text-sm text-earth">Birden fazla seçebilirsiniz. Otomatik olarak WebP'ye çevrilip küçültülür.</p>
        <button type="button" className="btn btn-dark mt-4 !min-h-[42px]" onClick={() => input.current?.click()}>Bilgisayardan seç</button>
        <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="hidden"
          onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = ""; }} />
      </div>

      {items.length > 0 && (
        <>
          <p className="mt-4 text-sm text-earth">Sıralamak için kartları sürükleyin ya da ok tuşlarını kullanın. ★ işaretli fotoğraf kapak olur.</p>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((it, i) => (
              <li key={it.key} draggable onDragStart={() => setDragKey(it.key)} onDragEnd={() => setDragKey(null)}
                onDragOver={(e) => { if (dragKey) e.preventDefault(); }} onDrop={(e) => { if (dragKey) { e.preventDefault(); dropOn(it.key); } }}
                className={`overflow-hidden rounded-2xl border bg-paper ${it.cover ? "border-clay ring-2 ring-clay/30" : "border-line"} ${dragKey === it.key ? "opacity-50" : ""}`}>
                <div className="relative aspect-[4/5] cursor-grab bg-paper-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.preview} alt="" className="h-full w-full object-cover" />
                  {it.file && <span className="badge absolute left-2 top-2">Yeni</span>}
                  {it.cover && <span className="badge absolute right-2 top-2 !bg-clay !text-white !border-clay">Kapak</span>}
                </div>
                <div className="grid gap-2 p-2">
                  <label className="sr-only" htmlFor={`alt-${it.key}`}>Görsel açıklaması</label>
                  <input id={`alt-${it.key}`} className="field !min-h-[36px] !py-1.5 text-sm" placeholder="Açıklama (erişilebilirlik)" maxLength={200}
                    value={it.alt} onChange={(e) => setItems((cur) => cur.map((x) => x.key === it.key ? { ...x, alt: e.target.value } : x))} />
                  <div className="flex items-center justify-between gap-1 text-sm">
                    <button type="button" className="h-8 w-8 rounded-full border border-line disabled:opacity-30" disabled={i === 0} onClick={() => move(it.key, -1)} aria-label="Sola taşı">←</button>
                    <button type="button" className={`rounded-full px-2 py-1 ${it.cover ? "text-clay" : ""}`} aria-pressed={it.cover}
                      onClick={() => setItems((cur) => cur.map((x) => ({ ...x, cover: x.key === it.key })))}>{it.cover ? "★ Kapak" : "☆ Kapak yap"}</button>
                    <button type="button" className="h-8 w-8 rounded-full border border-line disabled:opacity-30" disabled={i === items.length - 1} onClick={() => move(it.key, 1)} aria-label="Sağa taşı">→</button>
                  </div>
                  <button type="button" className="rounded-full py-1 text-sm text-clay-dark hover:bg-clay/10"
                    onClick={() => setItems((cur) => {
                      const n = cur.filter((x) => x.key !== it.key);
                      if (it.cover && n[0]) n[0] = { ...n[0], cover: true };
                      return n;
                    })}>Kaldır</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
