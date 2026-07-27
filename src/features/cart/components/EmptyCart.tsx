"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";

export function EmptyCart() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");

  return (
    <div className="container-marketplace flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl mb-4">
        🛒
      </div>
      <h1 className="text-2xl font-bold">{t("empty")}</h1>
      <p className="mt-2 text-muted-foreground">{t("emptyDescription")}</p>
      <Button asChild className="mt-6" size="lg">
        <Link href="/products">{tc("continueShopping")}</Link>
      </Button>
    </div>
  );
}
