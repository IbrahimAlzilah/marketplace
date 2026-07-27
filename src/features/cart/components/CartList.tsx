"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Price } from "@/shared/components/ui/currency";
import { getProductById, getPharmacyById } from "@/lib/mock-data";
import { CartItem } from "./CartItem";
import type { CartLine } from "../types/cart.types";

type CartListProps = {
  items: CartLine[];
};

export function CartList({ items }: CartListProps) {
  const t = useTranslations("cart");
  const locale = useLocale();

  const cartGroups = items.reduce<
    Record<string, { pharmacyId: string; lines: CartLine[] }>
  >((acc, item) => {
    const product = getProductById(item.productId);
    if (!product) return acc;
    if (!acc[product.pharmacyId]) {
      acc[product.pharmacyId] = { pharmacyId: product.pharmacyId, lines: [] };
    }
    acc[product.pharmacyId].lines.push(item);
    return acc;
  }, {});

  const groups = Object.values(cartGroups);

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const pharmacy = getPharmacyById(group.pharmacyId);
        if (!pharmacy) return null;
        const pharmacyName = locale === "ar" ? pharmacy.nameAr : pharmacy.name;
        const groupSubtotal = group.lines.reduce((sum, line) => {
          const product = getProductById(line.productId);
          return sum + (product ? product.price * line.quantity : 0);
        }, 0);

        const freeDeliveryThreshold = 200;
        const isFreeDeliveryUnlocked = groupSubtotal >= freeDeliveryThreshold;
        const remainingForFree = Math.max(0, freeDeliveryThreshold - groupSubtotal);
        const freeDeliveryPercent = Math.min(100, Math.round((groupSubtotal / freeDeliveryThreshold) * 100));

        return (
          <Card key={group.pharmacyId} className="shadow-none border rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary text-[10px]">
                    🏥
                  </div>
                  <CardTitle className="text-base font-bold text-primary">
                    {pharmacyName}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                {group.lines.map((line) => (
                  <CartItem key={line.productId} productId={line.productId} quantity={line.quantity} />
                ))}
              </div>

              {isFreeDeliveryUnlocked ? (
                <div className="p-2.5 rounded-lg border border-green-500/10 bg-green-500/5 text-xs text-green-600 font-medium text-start">
                  {t("freeDeliveryUnlocked")}
                </div>
              ) : (
                <div className="p-3 rounded-lg border bg-muted/10 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      {t.rich("addMoreForFree", {
                        amount: () => <Price amount={remainingForFree} className="font-semibold text-muted-foreground" iconClassName="text-muted-foreground" />
                      })}
                    </span>
                    <span>{freeDeliveryPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${freeDeliveryPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <Separator className="mb-1" />
              <div className="flex justify-between text-sm pt-2">
                <span className="text-muted-foreground">
                  {locale === "ar" ? "المجموع الفرعي للصيدلية:" : "Pharmacy Subtotal:"}
                </span>
                <Price amount={groupSubtotal} className="font-bold text-foreground" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
