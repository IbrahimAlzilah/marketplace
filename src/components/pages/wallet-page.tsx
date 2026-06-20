"use client";

import { useTranslations } from "next-intl";
import { ProfileLayout } from "@/components/layout/profile-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { walletTransactions } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Wallet } from "lucide-react";

export function WalletPage() {
  const t = useTranslations("wallet");
  const tc = useTranslations("common");

  return (
    <ProfileLayout title={t("title")}>
      <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="flex items-center gap-4 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("balance")}</p>
            <p className="text-4xl font-bold text-primary">{formatPrice(125.5)}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("useAtCheckout")}</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 font-semibold text-lg">{t("transactions")}</h2>
      <div className="space-y-3">
        {walletTransactions.map((tx) => (
          <Card key={tx.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-muted-foreground">{tx.date}</p>
              </div>
              <div className="text-end">
                <p className={`font-bold ${tx.type === "credit" ? "text-success" : "text-destructive"}`}>
                  {tx.type === "credit" ? "+" : "-"}{formatPrice(tx.amount)}
                </p>
                <Badge variant="outline" className="text-xs">
                  {tx.type === "credit" ? t("credit") : t("debit")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ProfileLayout>
  );
}
