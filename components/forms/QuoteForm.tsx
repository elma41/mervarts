"use client";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";
import { toWebp, validateImage } from "@/lib/image";
import { Guard, Status, precheck, useChallenge, type RpcResult } from "./shared";

export default function QuoteForm({ productId, productName }: { productId?: string; productName?: string }) {
  const { ch, err, refresh, ensure } = useChallenge();
  const [answer, setAnswer] = useState("");
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = new FormData(f);
    const { error, hp } = precheck(f, ch, answer, consent);
    if (error) { setState("error"); setMsg(error); return; }
    if (!fd.get("email") && !fd.get("phone")) { setState("error"); setMsg("Size dönebilmemiz için telefon ya da e-posta girin."); return; }
    setState("sending");

    let path: string | null = null;
    if (file && !hp) {
      try {
        const blob = await toWebp(file, 1600);
        path = `incoming/${crypto.randomUUID()}.webp`;
        const { error: upErr } = await browserClient().storage.from("quote-uploads").upload(path, blob, { contentType: "image/webp", upsert: false });
        if (upErr) path = null;
      } catch { path = null; }
    }

    const { data, error: rpcErr } = await browserClient().rpc("submit_quote", {
      p_challenge: ch!.id, p_answer: Number(answer), p_kvkk: consent, p_honeypot: hp,
      p_product_id: productId || null, p_name: fd.get("name"), p_phone: fd.get("phone") || null, p_email: fd.get("email") || null,
      p_dimensions: fd.get("dimensions") || null, p_details: fd.get("details"), p_reference_image_path: path,
    });
    const r = data as RpcResult | null;
    if (rpcErr || !r?.ok) { setState("error"); setMsg(r?.error || "Talep gönderilemedi. Lütfen tekrar deneyin."); }
    else {
      setState("ok");
      setMsg(file && !path
        ? "Talebiniz ulaştı. Görsel yüklenemedi; isterseniz WhatsApp'tan gönderebilirsiniz."
        : "Talebiniz ulaştı! Fiyat ve süre bilgisini en kısa sürede ileteceğiz.");
      f.reset(); setConsent(false); setFile(null);
    }
    setAnswer(""); void refresh();
  }

  return (
    <form onSubmit={onSubmit} onFocusCapture={ensure} onPointerDownCapture={ensure} className="relative grid gap-4">
      {productName && (
        <p className="rounded-2xl bg-paper-2 px-4 py-3 text-sm">İlgili ürün: <strong>{productName}</strong></p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="q-name" className="field-label">Ad Soyad *</label>
          <input id="q-name" name="name" className="field" required minLength={2} maxLength={100} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="q-phone" className="field-label">Telefon</label>
          <input id="q-phone" name="phone" type="tel" className="field" minLength={7} maxLength={25} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="q-email" className="field-label">E-posta</label>
          <input id="q-email" name="email" type="email" className="field" maxLength={160} autoComplete="email" />
        </div>
      </div>
      <p className="-mt-2 text-xs text-earth">Telefon ya da e-postadan en az birini yazın.</p>
      <div>
        <label htmlFor="q-dim" className="field-label">Ölçü / adet</label>
        <input id="q-dim" name="dimensions" className="field" maxLength={200} placeholder="Örn. 30×40 cm, 2 adet" />
      </div>
      <div>
        <label htmlFor="q-details" className="field-label">Tasarım detayı *</label>
        <textarea id="q-details" name="details" className="field" required minLength={10} maxLength={3000}
          placeholder="Renkler, yazılacak isim, kullanılacak yer, teslim tarihi…" />
      </div>
      <div>
        <label htmlFor="q-file" className="field-label">Örnek görsel (isteğe bağlı)</label>
        <input id="q-file" type="file" accept="image/jpeg,image/png,image/webp" className="field !min-h-0 file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-paper"
          onChange={(e) => {
            const fl = e.target.files?.[0] || null;
            const v = fl ? validateImage(fl, 5) : null;
            setFileErr(v); setFile(v ? null : fl);
            if (v) e.target.value = "";
          }} aria-describedby="q-file-h" />
        <p id="q-file-h" className={`mt-1 text-xs ${fileErr ? "text-clay-dark" : "text-earth"}`}>{fileErr || "JPG, PNG veya WebP, en fazla 5 MB."}</p>
      </div>
      <Guard ch={ch} chErr={err} answer={answer} setAnswer={setAnswer} consent={consent} setConsent={setConsent} />
      <Status state={state} message={msg} />
      <button type="submit" className="btn btn-primary justify-self-start" disabled={state === "sending"}>
        {state === "sending" ? "Gönderiliyor…" : "Teklif iste"}
      </button>
    </form>
  );
}
