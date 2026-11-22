"use client";
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Görseli tarayıcıda WebP'ye çevirir ve uzun kenarı maxSide olacak şekilde küçültür. */
export async function toWebp(file: File | Blob, maxSide: number, quality = 0.82): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tarayıcı görsel işlemeyi desteklemiyor.");
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/webp", quality));
  if (!blob) throw new Error("Görsel dönüştürülemedi.");
  return blob;
}

export function validateImage(file: File, maxMB: number) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Yalnızca JPG, PNG, WebP veya AVIF görsel yükleyebilirsiniz.";
  if (file.size > maxMB * 1024 * 1024) return `Görsel en fazla ${maxMB} MB olabilir.`;
  return null;
}
