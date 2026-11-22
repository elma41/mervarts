import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "merv.arts — Merve Türkdönmez, tezhip ve hat sanatı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const dir = join(process.cwd(), "assets/og");
  const [a, b, c, d] = await Promise.all(
    ["cormorant-garamond-latin-600-normal.woff", "cormorant-garamond-latin-ext-600-normal.woff", "cormorant-garamond-latin-500-italic.woff", "cormorant-garamond-latin-ext-500-italic.woff"].map((f) => readFile(join(dir, f))),
  );
  const ink = "#1c1b2b";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f1e6", position: "relative", overflow: "hidden" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M620 560 C 640 330, 780 250, 930 290 S 1130 420, 1170 160" fill="none" stroke="#1f2a5c" strokeWidth="9" strokeLinecap="round" />
          <path d="M650 600 C 670 380, 820 300, 960 340 S 1150 460, 1190 200" fill="none" stroke="#1f2a5c" strokeWidth="2" strokeLinecap="round" />
          <path d="M1120 40 C 1010 40, 960 110, 1000 170 C 1040 225, 1110 190, 1085 145" fill="none" stroke="#b08a2e" strokeWidth="2" strokeLinecap="round" />
          <circle cx="1170" cy="160" r="9" fill="#7a1f33" />
        </svg>
        <div style={{ position: "absolute", left: 80, top: 130, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Cormorant, CormorantExt", fontWeight: 600, fontSize: 190, color: ink, letterSpacing: -4, lineHeight: 1 }}>merv.arts</div>
          <div style={{ display: "flex", fontFamily: "CormorantI, CormorantIExt", fontStyle: "italic", fontSize: 58, color: "#7a1f33", marginTop: 10 }}>Merve Türkdönmez</div>
          <div style={{ display: "flex", fontFamily: "Cormorant, CormorantExt", fontWeight: 600, fontSize: 38, color: "#5b5547", marginTop: 28 }}>Tezhip ve hat sanatı</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: a, weight: 600, style: "normal" },
        { name: "CormorantExt", data: b, weight: 600, style: "normal" },
        { name: "CormorantI", data: c, weight: 500, style: "italic" },
        { name: "CormorantIExt", data: d, weight: 500, style: "italic" },
      ],
    },
  );
}
