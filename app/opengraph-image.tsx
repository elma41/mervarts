import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "merv.arts — Merve Türkdönmez, el emeği sanat ürünleri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const dir = join(process.cwd(), "assets/og");
  const [f1, f2, m1, m2] = await Promise.all(
    ["fraunces-latin-400-normal.woff", "fraunces-latin-ext-400-normal.woff", "manrope-latin-600-normal.woff", "manrope-latin-ext-600-normal.woff"].map((f) => readFile(join(dir, f))),
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f1ea", padding: 70, justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontFamily: "Manrope, ManropeExt", fontSize: 28, letterSpacing: 7, color: "#5c5048" }}>EL EMEĞİ ATÖLYE</div>
          <div style={{ fontFamily: "Fraunces, FrauncesExt", fontSize: 128, color: "#221c18", marginTop: 18, display: "flex" }}>
            merv<span style={{ color: "#9e4126" }}>.</span>arts
          </div>
          <div style={{ fontFamily: "Fraunces, FrauncesExt", fontSize: 44, color: "#5c5048", marginTop: 10 }}>Merve Türkdönmez</div>
          <div style={{ fontFamily: "Manrope, ManropeExt", fontSize: 28, color: "#5c5048", marginTop: 26 }}>Tablo · Seramik · Takı · Hediyelik</div>
        </div>
        <div style={{ width: 360, height: 470, borderTopLeftRadius: 180, borderTopRightRadius: 180, background: "#d9b597", display: "flex", overflow: "hidden", position: "relative", border: "2px solid #221c18" }}>
          <div style={{ position: "absolute", top: 110, right: 50, width: 150, height: 150, borderRadius: 999, background: "#9e4126" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 160, background: "#55624a" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 70, background: "#221c18" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: f1, weight: 400, style: "normal" },
        { name: "FrauncesExt", data: f2, weight: 400, style: "normal" },
        { name: "Manrope", data: m1, weight: 600, style: "normal" },
        { name: "ManropeExt", data: m2, weight: 600, style: "normal" },
      ],
    },
  );
}
