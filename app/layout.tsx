import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/config";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Merve Türkdönmez · merv.arts — El emeği sanat ürünleri", template: "%s · merv.arts" },
  description:
    "Merve Türkdönmez tezhip ve hat işleri: Esmâ-ül Hüsnâ levhaları, kişiye özel harf tabloları, gül ve rokoko süslemeleri. Tek eser, kişiye özel sipariş, Shopier ile güvenli alışveriş.",
  applicationName: "merv.arts",
  authors: [{ name: "Merve Türkdönmez" }],
  creator: "Merve Türkdönmez",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "merv.arts — Merve Türkdönmez",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preload" href={`${BASE}/fonts/cormorant-garamond-latin-500-normal.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${BASE}/fonts/inter-tight-latin-wght-normal.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
