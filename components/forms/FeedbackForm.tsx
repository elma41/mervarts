"use client";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";
import { Guard, Status, precheck, useChallenge, type RpcResult } from "./shared";

export default function FeedbackForm() {
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
    setState("sending");
    const { data, error: rpcErr } = await browserClient().rpc("submit_feedback", {
      p_challenge: ch!.id, p_answer: Number(answer), p_kvkk: consent, p_honeypot: hp,
      p_kind: fd.get("kind"), p_name: fd.get("name") || null, p_contact: fd.get("contact") || null, p_message: fd.get("message"),
    });
    const r = data as RpcResult | null;
    if (rpcErr || !r?.ok) { setState("error"); setMsg(r?.error || "Gönderilemedi. Lütfen tekrar deneyin."); }
    else { setState("ok"); setMsg("Bildiriminiz için teşekkürler. Her mesajı tek tek okuyoruz."); f.reset(); setConsent(false); }
    setAnswer(""); void refresh();
  }

  return (
    <form onSubmit={onSubmit} onFocusCapture={ensure} onPointerDownCapture={ensure} className="relative grid gap-3">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <div className="grid content-start gap-3">
          <fieldset>
            <legend className="field-label">Bildirim türü *</legend>
            <div className="flex flex-wrap gap-2">
              {[["oneri", "Öneri"], ["istek", "İstek"], ["sikayet", "Şikayet"]].map(([v, l], i) => (
                <label key={v} className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper">
                  <input type="radio" name="kind" value={v} defaultChecked={i === 0} className="accent-[#9e4126]" /> {l}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="f-name" className="field-label">Adınız (isteğe bağlı)</label>
            <input id="f-name" name="name" className="field" maxLength={100} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="f-contact" className="field-label">E-posta / telefon (isteğe bağlı)</label>
            <input id="f-contact" name="contact" className="field" maxLength={160} />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="f-msg" className="field-label">Mesajınız *</label>
          <textarea id="f-msg" name="message" className="field min-h-[11rem] flex-1 md:min-h-0" required minLength={10} maxLength={3000} />
        </div>
      </div>
      <Guard ch={ch} chErr={err} answer={answer} setAnswer={setAnswer} consent={consent} setConsent={setConsent} />
      <Status state={state} message={msg} />
      <button type="submit" className="btn btn-dark justify-self-start" disabled={state === "sending"}>
        {state === "sending" ? "Gönderiliyor…" : "Bildirimi gönder"}
      </button>
    </form>
  );
}
