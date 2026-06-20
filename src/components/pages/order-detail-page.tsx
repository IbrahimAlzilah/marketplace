"use client";

import { useLocale, useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orders, getPharmacyById } from "@/lib/mock-data";
import { cn, formatPrice } from "@/lib/utils";

const timelineSteps = ["pending", "confirmed", "preparing", "shipped", "delivered"] as const;

export function OrderDetailPage({ id }: { id: string }) {
  const order = orders.find((o) => o.id === id);
  const t = useTranslations("orders");
  const locale = useLocale();

  if (!order) notFound();

  const currentStepIndex = timelineSteps.indexOf(order.status as typeof timelineSteps[number]);

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{t("orderNumber", { number: order.orderNumber })}</h1>
        <Badge>{t(`status.${order.status}`)}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("track")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineSteps.map((step, i) => {
                  const isDone = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} className="flex items-center gap-4">
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                        isDone ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                      )}>
                        {isDone && <Check className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className={cn("font-medium", isCurrent && "text-primary")}>
                          {t(`status.${step}`)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.pharmacyIds.map((pharmacyId) => {
                const pharmacy = getPharmacyById(pharmacyId);
                if (!pharmacy) return null;
                return (
                  <div key={pharmacyId} className="rounded-lg border p-4">
                    <p className="font-medium">{locale === "ar" ? pharmacy.nameAr : pharmacy.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ETA: {pharmacy.eta} min
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="sticky top-36">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{order.itemCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
