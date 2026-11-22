#!/bin/sh
# GitHub Pages (statik) yayını öncesi: alt yol ve statik dışa aktarım için gereken küçük düzeltmeler.
set -e
sed -i 's#url("/fonts/#url("/mervarts/fonts/#g' app/globals.css
sed -i 's#^export const dynamicParams = true;#export const dynamicParams = false;#' "app/(site)/urun/[slug]/page.tsx" "app/(site)/urunler/kategori/[slug]/page.tsx"
