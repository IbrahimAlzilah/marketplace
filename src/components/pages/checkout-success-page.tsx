"use client";

import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CheckoutSuccessPage() {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");

  return (
    <div className="container-marketplace flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle className="h-12 w-12 text-success" />
      </div>
      <h1 className="mt-6 text-2xl font-bold lg:text-3xl">{t("success")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        {t("successDescription", { points: "130" })}
      </p>
      <Card className="mt-8 w-full max-w-md">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="text-xl font-bold text-primary">YUS-28500</p>
        </CardContent>
      </Card>
      <div className="mt-8 flex gap-4">
        <Button asChild size="lg">
          <Link href="/orders">Track Order</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">{tc("continueShopping")}</Link>
        </Button>
      </div>
    </div>
  );
}
