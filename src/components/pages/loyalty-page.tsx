"use client";

import { useTranslations } from "next-intl";
import { ProfileLayout } from "@/components/layout/profile-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loyaltyTransactions } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Star } from "lucide-react";

export function LoyaltyPage() {
  const t = useTranslations("loyalty");

  return (
    <ProfileLayout title={t("title")}>
      <Card className="mb-6 border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
              <Star className="h-8 w-8 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("balance")}</p>
              <p className="text-4xl font-bold text-secondary">2,400</p>
              <p className="text-sm text-muted-foreground">{t("worth", { amount: formatPrice(24) })}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t("tier")}</span>
              <span className="text-muted-foreground">{t("nextTier", { points: "600" })}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 w-3/4 rounded-full bg-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">{t("history")}</TabsTrigger>
          <TabsTrigger value="earn">{t("earnRules")}</TabsTrigger>
          <TabsTrigger value="redeem">{t("redeemRules")}</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-4 space-y-3">
          {loyaltyTransactions.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
                <Badge variant={tx.type === "earn" ? "success" : "secondary"}>
                  {tx.type === "earn" ? "+" : ""}{tx.points} pts
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="earn" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-2 text-sm text-muted-foreground">
              <p>• Earn 1 point for every SAR 1 spent</p>
              <p>• Bonus points on wellness bundles</p>
              <p>• Double points during promotional periods</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="redeem" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-2 text-sm text-muted-foreground">
              <p>• 100 points = SAR 1 discount</p>
              <p>• Minimum 100 points to redeem</p>
              <p>• Redeem at checkout</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ProfileLayout>
  );
}
