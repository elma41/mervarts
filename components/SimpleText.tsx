import React from "react";

/**
 * Admin panelinde yazılan sade metni güvenle biçimlendirir (HTML kabul edilmez → XSS yok).
 *  "## Başlık"  → büyük başlık     "### Alt başlık" → küçük başlık
 *  "- madde"    → madde işareti    boş satır       → yeni paragraf
 *  **kalın**    → kalın yazı
 */
function inline(t: string, key: string) {
  const parts = t.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((x, i) => (x.startsWith("**") && x.endsWith("**") ? <strong key={`${key}-${i}`}>{x.slice(2, -2)}</strong> : x));
}

export default function SimpleText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  const flushList = () => {
    if (list.length) out.push(<ul key={`u${out.length}`}>{list.map((l, i) => <li key={i}>{inline(l, `l${out.length}${i}`)}</li>)}</ul>);
    list = [];
  };
  const flushPara = () => {
    if (para.length) out.push(<p key={`p${out.length}`}>{inline(para.join(" "), `p${out.length}`)}</p>);
    para = [];
  };
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); flushPara(); continue; }
    if (line.startsWith("### ")) { flushList(); flushPara(); out.push(<h3 key={`h${out.length}`}>{line.slice(4)}</h3>); continue; }
    if (line.startsWith("## ")) { flushList(); flushPara(); out.push(<h2 key={`h${out.length}`}>{line.slice(3)}</h2>); continue; }
    if (/^[-•*] /.test(line)) { flushPara(); list.push(line.slice(2)); continue; }
    flushList();
    para.push(line);
  }
  flushList(); flushPara();
  return <>{out}</>;
}
