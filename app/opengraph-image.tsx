import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "merv.arts — Merve Türkdönmez, el emeği sanat ürünleri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const dir = join(process.cwd(), "assets/og");
  const [b1, b2, m1, m2] = await Promise.all(
    ["bricolage-grotesque-latin-800-normal.woff", "bricolage-grotesque-latin-ext-800-normal.woff", "manrope-latin-600-normal.woff", "manrope-latin-ext-600-normal.woff"].map((f) => readFile(join(dir, f))),
  );
  const ink = "#1e1233";
  const card = (bg: string, rot: number, top: number, left: number, w: number, h: number) => (
    <div style={{ position: "absolute", top, left, width: w, height: h, background: bg, border: `5px solid ${ink}`, borderRadius: 28, boxShadow: `10px 10px 0 ${ink}`, transform: `rotate(${rot}deg)`, display: "flex" }} />
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fff7ee", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -80, top: -80, width: 380, height: 380, borderRadius: 999, background: "#ffd6e5", display: "flex" }} />
        <div style={{ position: "absolute", right: -60, bottom: -120, width: 460, height: 460, borderRadius: 999, background: "#e7ddff", display: "flex" }} />
        {card("#ffd23f", -8, 90, 760, 220, 290)}
        {card("#ff4f8b", 7, 60, 960, 190, 250)}
        {card("#55c8ff", -2, 330, 860, 220, 230)}
        <div style={{ position: "absolute", left: 70, top: 90, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Manrope, ManropeExt", fontSize: 26, color: ink, background: "#2bd4a8", border: `4px solid ${ink}`, borderRadius: 999, padding: "8px 22px", alignSelf: "flex-start" }}>EL YAPIMI · TEK ÜRÜN</div>
          <div style={{ display: "flex", fontFamily: "Bricolage, BricolageExt", fontSize: 140, color: ink, marginTop: 24, letterSpacing: -6 }}>
            merv<span style={{ width: 46, height: 46, borderRadius: 999, background: "#ff4f8b", margin: "58px 6px 0", display: "flex" }} />arts
          </div>
          <div style={{ display: "flex", fontFamily: "Bricolage, BricolageExt", fontSize: 50, color: ink, marginTop: 4 }}>Merve Türkdönmez</div>
          <div style={{ display: "flex", fontFamily: "Manrope, ManropeExt", fontSize: 30, color: "#5a4a6b", marginTop: 22 }}>Tablo · Seramik · Takı · Hediyelik</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: b1, weight: 800, style: "normal" },
        { name: "BricolageExt", data: b2, weight: 800, style: "normal" },
        { name: "Manrope", data: m1, weight: 600, style: "normal" },
        { name: "ManropeExt", data: m2, weight: 600, style: "normal" },
      ],
    },
  );
}
