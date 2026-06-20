"use client";

import { useLocale, useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orders, getPharmacyById } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export function OrdersPage() {
  const t = useTranslations("orders");
  const locale = useLocale();

  const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const historyOrders = orders.filter((o) => ["delivered", "cancelled"].includes(o.status));

  const OrderCard = ({ order }: { order: typeof orders[0] }) => {
    const pharmacyNames = order.pharmacyIds
      .map((id) => {
        const p = getPharmacyById(id);
        return p ? (locale === "ar" ? p.nameAr : p.name) : "";
      })
      .join(" + ");

    const statusVariant =
      order.status === "delivered" ? "success" :
        order.status === "cancelled" ? "destructive" :
          order.status === "shipped" ? "secondary" : "default";

    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{t("orderNumber", { number: order.orderNumber })}</p>
                <Badge variant={statusVariant as "default"}>
                  {t(`status.${order.status}`)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{pharmacyNames}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-SA")} · {order.itemCount} items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <p className="text-lg font-bold">{formatPrice(order.total)}</p>
            <div className="flex gap-2">
              {order.status === "shipped" && (
                <Button size="sm" asChild>
                  <Link href={`/orders/${order.id}`}>{t("track")}</Link>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <Link href={`/orders/${order.id}`}>{t("details")}</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-6 text-2xl font-bold lg:text-3xl">{t("title")}</h1>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">{t("active")} ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="history">{t("history")} ({historyOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6 space-y-4">
          {activeOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No active orders</p>
          ) : (
            activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
        <TabsContent value="history" className="mt-6 space-y-4">
          {historyOrders.map((order) => <OrderCard key={order.id} order={order} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
