import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/data";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getCategories()).find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — el yapımı`,
    description: `merv.arts ${cat.name.toLocaleLowerCase("tr-TR")} koleksiyonu. El emeği, özgün ve tek ürün parçalar.`,
    alternates: { canonical: `/urunler/kategori/${cat.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const products = await getProducts({ categoryId: cat.id });
  return (
    <ProductGrid
      title={cat.name}
      intro={`El yapımı ${cat.name.toLocaleLowerCase("tr-TR")}. Beğendiğiniz bir parçanın benzerini ölçünüze göre de yaptırabilirsiniz.`}
      products={products}
      categories={categories}
      active={cat.slug}
    />
  );
}
