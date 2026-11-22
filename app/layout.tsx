import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Merve Türkdönmez · merv.arts — El emeği sanat ürünleri", template: "%s · merv.arts" },
  description:
    "Merve Türkdönmez'in elde ürettiği özgün tablolar, seramikler, takılar ve hediyelikler. Tek ürün, kişiye özel sipariş, Shopier ile güvenli alışveriş.",
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
  themeColor: "#fff7ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/bricolage-grotesque-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
