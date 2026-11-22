"use client";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { browserClient } from "@/lib/supabase";

export type Challenge = { id: string; question: string } | null;

/** Soru, kullanıcı forma ilk dokunduğunda (odaklandığında) yüklenir; sayfa açılışını yavaşlatmaz. */
export function useChallenge() {
  const [ch, setCh] = useState<Challenge>(null);
  const [err, setErr] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const refresh = useCallback(async () => {
    setErr(null);
    const { data, error } = await browserClient().rpc("form_challenge");
    if (error || !data) {
      setCh(null);
      setErr("Güvenlik sorusu yüklenemedi. Sayfayı yenileyin.");
    } else setCh(data as Challenge);
  }, []);
  const ensure = useCallback(() => { if (!started) setStarted(true); }, [started]);
  useEffect(() => { if (started) void refresh(); }, [started, refresh]);
  return { ch, err, refresh, ensure };
}

/** Gizli honeypot + güvenlik sorusu + KVKK onayı. Formun en altında kullanılır. */
export function Guard({ ch, chErr, answer, setAnswer, consent, setConsent }: {
  ch: Challenge; chErr: string | null; answer: string; setAnswer: (v: string) => void; consent: boolean; setConsent: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-web`}>Web siteniz (boş bırakın)</label>
        <input id={`${id}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor={`${id}-q`} className="field-label">
            Güvenlik sorusu: <span className="font-display text-base">{ch ? ch.question : chErr || "forma yazmaya başlayınca görünür"}</span>
          </label>
          <input id={`${id}-q`} className="field max-w-[180px]" inputMode="numeric" pattern="[0-9]*" required autoComplete="off"
            value={answer} onChange={(e) => setAnswer(e.target.value.replace(/\D/g, "").slice(0, 3))} aria-describedby={`${id}-qh`} />
          <p id={`${id}-qh`} className="mt-1 text-xs text-earth">Bot gönderimlerini engellemek için. Yalnızca rakam girin.</p>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#9e4126]" />
        <span className="text-sm leading-relaxed">
          <Link href="/kvkk" target="_blank" className="font-semibold text-clay underline underline-offset-2">KVKK Aydınlatma Metni</Link>&apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum. <span className="text-clay" aria-hidden="true">*</span>
        </span>
      </label>
    </>
  );
}

export function Status({ state, message }: { state: "idle" | "sending" | "ok" | "error"; message: string }) {
  if (state === "idle" || state === "sending") return <p role="status" aria-live="polite" className="sr-only">{state === "sending" ? "Gönderiliyor" : ""}</p>;
  return (
    <p role={state === "error" ? "alert" : "status"} aria-live="polite"
      className={`rounded-2xl px-4 py-3 text-sm font-medium ${state === "ok" ? "bg-sage/15 text-[#2f3a28]" : "bg-clay/10 text-clay-dark"}`}>
      {message}
    </p>
  );
}

/** Gönderim öncesi ortak kontroller. Hata mesajı döner ya da null. */
export function precheck(form: HTMLFormElement, ch: Challenge, answer: string, consent: boolean) {
  const hp = (form.elements.namedItem("website") as HTMLInputElement | null)?.value || "";
  if (!ch) return { error: "Güvenlik sorusu yüklenemedi. Sayfayı yenileyin.", hp };
  if (!answer) return { error: "Güvenlik sorusunu yanıtlayın.", hp };
  if (!consent) return { error: "Devam etmek için KVKK onay kutusunu işaretleyin.", hp };
  return { error: null, hp };
}

export type RpcResult = { ok: boolean; error?: string };
