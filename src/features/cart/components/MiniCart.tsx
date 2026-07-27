"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Price } from "@/shared/components/ui/currency";
import { getProductById } from "@/lib/mock-data";
import { useCartStore } from "../store/cart-store";

export function MiniCart() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const locale = useLocale();
  const items = useCartStore((s) => s.items);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const product = getProductById(i.productId);
    return sum + (product ? product.price * i.quantity : 0);
  }, 0);

  return (
    <div className="relative group">
      <Link href="/cart" className="relative flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors">
        <ShoppingBag className="h-5 w-5 text-foreground" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {totalCount}
          </span>
        )}
      </Link>

      {/* Popover preview on hover */}
      <div className="absolute end-0 top-full hidden w-80 rounded-2xl border bg-card p-4 shadow-xl group-hover:block z-50">
        <div className="flex items-center justify-between pb-3 border-b">
          <span className="font-bold text-sm text-foreground">{t("title")}</span>
          <span className="text-xs text-muted-foreground">{t("items", { count: items.length })}</span>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            {t("empty")}
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto divide-y py-2 space-y-2">
              {items.slice(0, 4).map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                const name = locale === "ar" ? product.nameAr : product.name;
                return (
                  <div key={item.productId} className="flex items-center gap-3 pt-2">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-white">
                      <Image src={product.image} alt={name} fill className="object-contain p-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate text-foreground">{name}</p>
                      <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <Price amount={product.price * item.quantity} className="text-xs font-bold text-primary" />
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span>Subtotal:</span>
                <Price amount={subtotal} className="text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm" className="w-full text-xs rounded-xl">
                  <Link href="/cart">{t("title")}</Link>
                </Button>
                <Button asChild size="sm" className="w-full text-xs rounded-xl">
                  <Link href="/checkout">{tc("checkout")}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
