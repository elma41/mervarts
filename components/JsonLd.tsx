export default function JsonLd({ data }: { data: unknown }) {
  // "<" karakteri kaçırılır; böylece veri içinden </script> enjeksiyonu yapılamaz.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
