import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl text-clay">404</p>
      <h1 className="mt-3 font-display text-3xl">Aradığınız sayfa bulunamadı.</h1>
      <p className="mt-2 text-earth">Bu parça satılmış ya da adres değişmiş olabilir.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn btn-dark">Ana sayfa</Link>
        <Link href="/urunler" className="btn btn-ghost">Koleksiyon</Link>
      </div>
    </main>
  );
}
