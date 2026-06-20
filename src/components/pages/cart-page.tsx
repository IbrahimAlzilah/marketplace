"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Trash2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderSummary } from "@/components/marketplace/order-summary";
import { QuantityStepper } from "@/components/marketplace/product-card";
import { getProductById, getPharmacyById } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartPage() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();

  const cartGroups = items.reduce<
    Record<string, { pharmacyId: string; lines: { productId: string; quantity: number }[] }>
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
  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const deliveryFees = groups.reduce((sum, group) => {
    const pharmacy = getPharmacyById(group.pharmacyId);
    return sum + (pharmacy?.deliveryFee ?? 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container-marketplace flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">{t("empty")}</h1>
        <p className="mt-2 text-muted-foreground">{t("emptyDescription")}</p>
        <Button asChild className="mt-6" size="lg">
          <Link href="/products">{tc("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-6 text-2xl font-bold lg:text-3xl">
        {t("title")} ({t("items", { count: items.length })})
      </h1>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Cart items */}
        <div className="space-y-6 lg:col-span-8">
          {groups.map((group) => {
            const pharmacy = getPharmacyById(group.pharmacyId);
            if (!pharmacy) return null;
            const pharmacyName = locale === "ar" ? pharmacy.nameAr : pharmacy.name;
            const groupSubtotal = group.lines.reduce((sum, line) => {
              const product = getProductById(line.productId);
              return sum + (product ? product.price * line.quantity : 0);
            }, 0);

            return (
              <Card key={group.pharmacyId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {t("groupedBy", { pharmacy: pharmacyName })}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {pharmacy.eta} {tc("min")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.lines.map((line) => {
                    const product = getProductById(line.productId);
                    if (!product) return null;
                    const name = locale === "ar" ? product.nameAr : product.name;
                    return (
                      <div key={line.productId} className="flex gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                          <Image src={product.image} alt={name} fill className="object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <Link href={`/products/${product.slug}`} className="font-medium hover:text-primary line-clamp-2">
                              {name}
                            </Link>
                            <p className="text-sm font-bold text-primary mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <QuantityStepper
                              value={line.quantity}
                              onChange={(q) => updateQuantity(line.productId, q)}
                              max={product.stockCount}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => removeItem(line.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-end font-semibold">
                          {formatPrice(product.price * line.quantity)}
                        </div>
                      </div>
                    );
                  })}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span className="font-medium">{formatPrice(groupSubtotal)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right: Sticky summary */}
        <div className="lg:col-span-4">
          <OrderSummary
            subtotal={subtotal}
            deliveryFees={deliveryFees}
            className="sticky top-36"
            onCheckout={() => router.push("/checkout")}
          />
        </div>
      </div>
    </div>
  );
}
