"use client";

import { useTranslations } from "next-intl";
import { Bell, Package, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const notifications = [
  {
    id: "n1",
    type: "order",
    title: "Order on the way",
    message: "Your order YUS-28491 from Nahdi Pharmacy is out for delivery.",
    time: "10 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "offer",
    title: "20% off Vitamins",
    message: "Special offer on all vitamin supplements. Valid until Sunday.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "order",
    title: "Order delivered",
    message: "Order YUS-28350 has been delivered. You earned 245 loyalty points!",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n4",
    type: "wallet",
    title: "Wallet credit",
    message: "SAR 45.00 refund has been added to your wallet.",
    time: "2 days ago",
    read: true,
  },
];

export function NotificationsPage() {
  const t = useTranslations("notifications");

  const iconMap = {
    order: Package,
    offer: Tag,
    wallet: Bell,
  };

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-6 text-xl font-bold">{t("title")}</h1>
      <div className="mx-auto max-w-2xl space-y-3">
        {notifications.map((n) => {
          const Icon = iconMap[n.type as keyof typeof iconMap] || Bell;
          return (
            <Card key={n.id} className={!n.read ? "border-primary/30 bg-primary/5" : ""}>
              <CardContent className="flex gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.read && <Badge variant="default" className="text-[10px]">New</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
