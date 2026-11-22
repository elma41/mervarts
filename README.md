# merv.arts — Merve Türkdönmez

El emeği sanat ürünleri için vitrin sitesi ve yönetim paneli.

**Teknoloji:** Next.js 16 (App Router) · Tailwind CSS 4 · Supabase (veritabanı, dosya depolama, giriş) · Vercel

## Klasör yapısı

```
app/
  (site)/              Herkese açık site
    page.tsx           Ana sayfa
    urunler/           Koleksiyon + kategori sayfaları
    urun/[slug]/       Ürün detayı (galeri, satın al, WhatsApp, teklif formu)
    ozel-siparis/      Özel sipariş / teklif formu
    iletisim/          İletişim + öneri/şikayet formları
    hakkinda/          Sanatçı sayfası
    kvkk/ gizlilik-politikasi/ cerez-politikasi/
  admin/               Yönetim paneli (/admin)
    urunler/           Ürün listesi ve düzenleme (sürükle-bırak fotoğraf)
    gelen-kutusu/      Teklifler, iletişim mesajları, öneri/şikayetler
    ayarlar/           Logo, WhatsApp, Shopier, Google yorum, kategoriler
    yasal/             KVKK metinlerini düzenleme
  sitemap.ts robots.ts opengraph-image.tsx
components/            Arayüz parçaları, formlar, admin bileşenleri
lib/                   Supabase bağlantısı, veri okuma, yardımcılar
```

Veritabanı şeması ve RLS kuralları Supabase projesindedir (Dashboard → Database → Migrations): `merv_arts_initial_schema`, `form_submission_rpcs`, `form_rpcs_return_status`, `purge_rate_limit_logs`.

## Yayına alma (Vercel)

1. [vercel.com](https://vercel.com) → **Add New → Project** → GitHub'dan `mervarts` deposunu seçin.
2. Ayar değiştirmeden **Deploy**'a basın. (Supabase adresi ve herkese açık anahtar kodda varsayılan olarak tanımlı.)
3. İsteğe bağlı ortam değişkenleri: `.env.example` dosyasına bakın. Alan adı alınınca `NEXT_PUBLIC_SITE_URL` ekleyin.
4. Supabase → **Authentication → URL Configuration** → *Site URL* alanına Vercel adresini yazın (şifre sıfırlama e-postaları için).

Her `git push` sonrası Vercel siteyi otomatik günceller. Panelde yapılan değişiklikler sitede en geç 1 dakikada görünür.

## Yönetici hesabı

1. Supabase → **Authentication → Users → Add user** ile e-posta ve şifre oluşturun.
2. Kullanıcıyı yönetici yapın (SQL Editor):
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'ornek@eposta.com';
   ```
3. `/admin` adresinden giriş yapın.

## Güvenlik

- Tüm tablolarda **RLS** açık: ziyaretçi yalnızca yayındaki ürünleri, kategorileri, ayarları ve yasal metinleri okuyabilir. Yazma ve mesajları görme yalnızca `admin_users` tablosundaki hesaplara açık.
- Formlar tablolara doğrudan yazamaz; yalnızca `submit_contact`, `submit_quote` ve `submit_feedback` veritabanı fonksiyonları üzerinden gönderilir. Bu fonksiyonlar:
  - tek kullanımlık matematik güvenlik sorusunu doğrular (her soru tek denemelik, 30 dk geçerli),
  - gizli **honeypot** alanını kontrol eder,
  - IP başına **hız sınırı** uygular (10 dakikada 3, günde 20 gönderim; IP açık saklanmaz, tuzlanmış özeti tutulur),
  - HTML etiketlerini ve kontrol karakterlerini temizler, KVKK onayını ve metin sürümünü kaydeder.
- Yüklenen görseller tarayıcıda WebP'ye çevrilir; depolama alanları dosya türü ve boyut sınırlıdır.
- Güvenlik başlıkları (CSP, HSTS, X-Frame-Options vb.) `next.config.ts` içinde.

## Performans

- Görseller iki boyutta (640 px ve 1600 px WebP) saklanır, `srcset` ve sabit en-boy oranıyla gösterilir (CLS = 0).
- Yazı tipleri kendi sunucumuzda, Türkçe karakter alt kümeleriyle; harici script, CAPTCHA veya analiz aracı yok.
- Sayfalar statik üretilir, 60 sn'de bir arka planda yenilenir.

## Yerelde çalıştırma

```bash
npm install
npm run dev     # http://localhost:3000
```

> KVKK, Gizlilik ve Çerez metinleri taslaktır. `[adres eklenecek]` ve `[e-posta eklenecek]` yerlerini panelden doldurun; yayına almadan önce bir hukukçuya kontrol ettirmeniz önerilir.
