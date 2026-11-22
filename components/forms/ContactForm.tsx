"use client";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";
import { Guard, Status, precheck, useChallenge, type RpcResult } from "./shared";

export default function ContactForm() {
  const { ch, err, refresh, ensure } = useChallenge();
  const [answer, setAnswer] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = new FormData(f);
    const { error, hp } = precheck(f, ch, answer, consent);
    if (error) { setState("error"); setMsg(error); return; }
    if (!fd.get("email") && !fd.get("phone")) { setState("error"); setMsg("Size dönebilmemiz için e-posta ya da telefon girin."); return; }
    setState("sending");
    const { data, error: rpcErr } = await browserClient().rpc("submit_contact", {
      p_challenge: ch!.id, p_answer: Number(answer), p_kvkk: consent, p_honeypot: hp,
      p_kind: fd.get("kind"), p_name: fd.get("name"), p_email: fd.get("email") || null, p_phone: fd.get("phone") || null, p_message: fd.get("message"),
    });
    const r = data as RpcResult | null;
    if (rpcErr || !r?.ok) {
      setState("error"); setMsg(r?.error || "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    } else {
      setState("ok"); setMsg("Teşekkürler! Mesajınız ulaştı, en kısa sürede dönüş yapacağız."); f.reset(); setConsent(false);
    }
    setAnswer(""); void refresh();
  }

  return (
    <form onSubmit={onSubmit} onFocusCapture={ensure} onPointerDownCapture={ensure} className="relative grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">Ad Soyad *</label>
          <input id="c-name" name="name" className="field" required minLength={2} maxLength={100} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="c-kind" className="field-label">Konu</label>
          <select id="c-kind" name="kind" className="field" defaultValue="genel">
            <option value="genel">Genel soru</option>
            <option value="isbirligi">İş birliği</option>
            <option value="sergi">Sergi / etkinlik</option>
          </select>
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">E-posta</label>
          <input id="c-email" name="email" type="email" className="field" maxLength={160} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="c-phone" className="field-label">Telefon</label>
          <input id="c-phone" name="phone" type="tel" className="field" minLength={7} maxLength={25} autoComplete="tel" />
        </div>
      </div>
      <p className="-mt-2 text-xs text-earth">E-posta ya da telefondan en az birini yazın.</p>
      <div>
        <label htmlFor="c-msg" className="field-label">Mesajınız *</label>
        <textarea id="c-msg" name="message" className="field" required minLength={10} maxLength={3000} />
      </div>
      <Guard ch={ch} chErr={err} answer={answer} setAnswer={setAnswer} consent={consent} setConsent={setConsent} />
      <Status state={state} message={msg} />
      <button type="submit" className="btn btn-dark justify-self-start" disabled={state === "sending"}>
        {state === "sending" ? "Gönderiliyor…" : "Mesajı gönder"}
      </button>
    </form>
  );
}
