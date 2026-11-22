import type { Metadata } from "next";
import PageSlider from "@/components/PageSlider";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Koleksiyon — tüm el yapımı ürünler",
  description: "merv.arts koleksiyonu: el yapımı tablolar, seramikler, takı ve hediyelikler. Tek ürün ve sınırlı stok parçalar.",
  alternates: { canonical: "/urunler" },
};

export default async function Page() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <>
    <PageSlider page="urunler" />
    <ProductGrid
      title="Tüm ürünler"
      intro="Atölyeden çıkan her parça tek tek hazırlanır; aynısı ikinci kez olmayabilir."
      products={products}
      categories={categories}
    />
    </>
  );
}
