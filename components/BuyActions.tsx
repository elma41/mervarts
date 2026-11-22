"use client";
import { useEffect } from "react";
import { browserClient } from "@/lib/supabase";
import { IconBag, IconWhatsApp } from "./Icons";

function track(productId: string, event: "view" | "shopier_click" | "whatsapp_click") {
  try {
    void browserClient().rpc("track_product_event", { p_product_id: productId, p_event: event });
  } catch { /* istatistik hatası alışverişi engellemesin */ }
}

export default function BuyActions({
  productId, shopierUrl, waUrl, canBuy,
}: { productId: string; shopierUrl: string | null; waUrl: string | null; canBuy: boolean }) {
  useEffect(() => {
    const key = `mv-view-${productId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch { /* gizli sekme vb. */ }
    const t = setTimeout(() => track(productId, "view"), 1500);
    return () => clearTimeout(t);
  }, [productId]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {canBuy && shopierUrl ? (
        <a href={shopierUrl} target="_blank" rel="noopener" onClick={() => track(productId, "shopier_click")} className="btn btn-primary flex-1 !min-h-[54px] text-base">
          <IconBag /> Shopier&apos;den satın al
        </a>
      ) : (
        <a href="#teklif" className="btn btn-primary flex-1 !min-h-[54px] text-base">Fiyat al / Özel sipariş ver</a>
      )}
      {waUrl && (
        <a href={waUrl} target="_blank" rel="noopener" onClick={() => track(productId, "whatsapp_click")} className="btn btn-wa flex-1 !min-h-[54px] text-base">
          <IconWhatsApp /> WhatsApp ile sor
        </a>
      )}
    </div>
  );
}
