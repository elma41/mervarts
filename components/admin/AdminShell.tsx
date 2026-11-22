"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { browserClient } from "@/lib/supabase";

type Ctx = { session: Session; counts: { quotes: number; contact: number; feedback: number }; refreshCounts: () => void; toast: (m: string, kind?: "ok" | "err") => void };
const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("AdminShell dışında kullanılamaz");
  return c;
};

const NAV = [
  { href: "/admin", label: "Özet", icon: "◎" },
  { href: "/admin/urunler", label: "Ürünler", icon: "▦" },
  { href: "/admin/gelen-kutusu", label: "Gelen kutusu", icon: "✉" },
  { href: "/admin/ayarlar", label: "Site ayarları", icon: "⚙" },
  { href: "/admin/yasal", label: "KVKK metinleri", icon: "§" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setInfo(null);
    const sb = browserClient();
    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message.includes("Invalid") ? "E-posta ya da şifre hatalı." : error.message);
    } else {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin` });
      if (error) setErr(error.message); else setInfo("Şifre yenileme bağlantısı e-postanıza gönderildi.");
    }
    setBusy(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 px-5 paper-grain">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[28px] border border-line bg-paper p-8 shadow-xl">
        <p className="font-display text-3xl">merv<span className="text-clay">.</span>arts</p>
        <h1 className="mt-1 text-earth">{mode === "login" ? "Yönetim paneline giriş" : "Şifremi unuttum"}</h1>
        <div className="mt-6 grid gap-4">
          <div>
            <label htmlFor="a-email" className="field-label">E-posta</label>
            <input id="a-email" type="email" className="field" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode === "login" && (
            <div>
              <label htmlFor="a-pass" className="field-label">Şifre</label>
              <input id="a-pass" type="password" className="field" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          {err && <p role="alert" className="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay-dark">{err}</p>}
          {info && <p role="status" className="rounded-xl bg-sage/15 px-3 py-2 text-sm">{info}</p>}
          <button className="btn btn-dark w-full" disabled={busy}>{busy ? "Bekleyin…" : mode === "login" ? "Giriş yap" : "Bağlantı gönder"}</button>
          <button type="button" className="text-sm text-earth underline" onClick={() => setMode(mode === "login" ? "reset" : "login")}>
            {mode === "login" ? "Şifremi unuttum" : "Girişe dön"}
          </button>
        </div>
      </form>
    </main>
  );
}

function SetPassword({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 px-5">
      <form className="w-full max-w-sm rounded-[28px] border border-line bg-paper p-8" onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await browserClient().auth.updateUser({ password: p });
        if (error) setErr(error.message); else onDone();
      }}>
        <h1 className="font-display text-2xl">Yeni şifre belirleyin</h1>
        <label htmlFor="np" className="field-label mt-4">Yeni şifre (en az 8 karakter)</label>
        <input id="np" type="password" minLength={8} required className="field" autoComplete="new-password" value={p} onChange={(e) => setP(e.target.value)} />
        {err && <p role="alert" className="mt-2 text-sm text-clay-dark">{err}</p>}
        <button className="btn btn-dark mt-4 w-full">Kaydet</button>
      </form>
    </main>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const sb = browserClient();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [recovery, setRecovery] = useState(false);
  const [counts, setCounts] = useState({ quotes: 0, contact: 0, feedback: 0 });
  const [toastMsg, setToastMsg] = useState<{ m: string; k: "ok" | "err" } | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((ev, s) => {
      if (ev === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    sb.rpc("is_admin").then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session, sb]);

  const refreshCounts = useCallback(async () => {
    const c = async (t: string) => (await sb.from(t).select("id", { count: "exact", head: true }).eq("status", "new")).count || 0;
    const [quotes, contact, feedback] = await Promise.all([c("quote_requests"), c("contact_messages"), c("feedback_messages")]);
    setCounts({ quotes, contact, feedback });
  }, [sb]);

  useEffect(() => {
    if (!isAdmin) return;
    void refreshCounts();
    const t = setInterval(refreshCounts, 60_000);
    return () => clearInterval(t);
  }, [isAdmin, refreshCounts]);

  useEffect(() => {
    const total = counts.quotes + counts.contact + counts.feedback;
    document.title = `${total ? `(${total}) ` : ""}Yönetim · merv.arts`;
  }, [counts]);

  useEffect(() => setMenu(false), [pathname]);

  const toast = useCallback((m: string, k: "ok" | "err" = "ok") => {
    setToastMsg({ m, k });
    setTimeout(() => setToastMsg(null), 3500);
  }, []);

  if (session === undefined) return <div className="flex min-h-screen items-center justify-center text-earth">Yükleniyor…</div>;
  if (recovery && session) return <SetPassword onDone={() => { setRecovery(false); toast("Şifre güncellendi"); }} />;
  if (!session) return <Login />;
  if (isAdmin === null) return <div className="flex min-h-screen items-center justify-center text-earth">Yetki kontrol ediliyor…</div>;
  if (!isAdmin) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
        <h1 className="font-display text-3xl">Bu hesabın yönetici yetkisi yok.</h1>
        <p className="mt-3 text-earth">Giriş yapılan hesap: <strong>{session.user.email}</strong></p>
        <p className="mt-1 break-all text-sm text-earth">Kullanıcı kimliği: <code>{session.user.id}</code></p>
        <button className="btn btn-ghost mt-6 self-start" onClick={() => sb.auth.signOut()}>Çıkış yap</button>
      </main>
    );
  }

  const unread = counts.quotes + counts.contact + counts.feedback;
  return (
    <AdminCtx.Provider value={{ session, counts, refreshCounts, toast }}>
      <div className="min-h-screen bg-paper-2/60 md:grid md:grid-cols-[240px_1fr]">
        <aside className={`${menu ? "block" : "hidden"} border-r border-line bg-paper md:block`}>
          <div className="sticky top-0 flex h-full max-h-screen flex-col p-5">
            <Link href="/admin" className="font-display text-2xl">merv<span className="text-clay">.</span>arts</Link>
            <p className="text-xs uppercase tracking-[0.2em] text-earth">Yönetim</p>
            <nav aria-label="Yönetim menüsü" className="mt-8">
              <ul className="grid gap-1">
                {NAV.map((n) => {
                  const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
                  return (
                    <li key={n.href}>
                      <Link href={n.href} aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium ${active ? "bg-ink text-paper" : "hover:bg-paper-2"}`}>
                        <span aria-hidden="true" className="w-5 text-center">{n.icon}</span>{n.label}
                        {n.href === "/admin/gelen-kutusu" && unread > 0 && (
                          <span className="ml-auto rounded-full bg-clay px-2 py-0.5 text-xs font-bold text-white" aria-label={`${unread} yeni`}>{unread}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-auto grid gap-2 pt-8 text-sm">
              <Link href="/" target="_blank" className="rounded-xl px-3 py-2 hover:bg-paper-2">↗ Siteyi görüntüle</Link>
              <p className="truncate px-3 text-earth" title={session.user.email}>{session.user.email}</p>
              <button className="rounded-xl px-3 py-2 text-left hover:bg-paper-2" onClick={() => sb.auth.signOut()}>Çıkış yap</button>
            </div>
          </div>
        </aside>
        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-line bg-paper px-5 py-3 md:hidden">
            <span className="font-display text-xl">merv<span className="text-clay">.</span>arts</span>
            <button className="rounded-full border border-line px-4 py-2 text-sm" aria-expanded={menu} onClick={() => setMenu(!menu)}>Menü {unread > 0 ? `(${unread})` : ""}</button>
          </div>
          <main className="mx-auto max-w-6xl p-5 sm:p-8">{children}</main>
        </div>
      </div>
      {toastMsg && (
        <div role="status" aria-live="polite" className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold shadow-xl ${toastMsg.k === "ok" ? "bg-ink text-paper" : "bg-clay text-white"}`}>
          {toastMsg.m}
        </div>
      )}
    </AdminCtx.Provider>
  );
}
