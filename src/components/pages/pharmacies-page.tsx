"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { PharmacyCard } from "@/components/marketplace/pharmacy-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { pharmacies } from "@/lib/mock-data";

export function PharmaciesPage() {
  const t = useTranslations("pharmacies");
  const locale = useLocale();
  const [openNow, setOpenNow] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [topRated, setTopRated] = useState(false);

  const filtered = useMemo(() => {
    let result = [...pharmacies];
    if (openNow) result = result.filter((p) => p.isOpen);
    if (freeDelivery) result = result.filter((p) => p.deliveryFee === 0);
    if (topRated) result = result.filter((p) => p.rating >= 4.5);
    return result;
  }, [openNow, freeDelivery, topRated]);

  const FiltersSidebar = () => (
    <aside className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox id="open" checked={openNow} onCheckedChange={(c) => setOpenNow(!!c)} />
        <Label htmlFor="open" className="cursor-pointer text-sm">{t("openNow")}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="free" checked={freeDelivery} onCheckedChange={(c) => setFreeDelivery(!!c)} />
        <Label htmlFor="free" className="cursor-pointer text-sm">{t("freeDeliveryFilter")}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="rated" checked={topRated} onCheckedChange={(c) => setTopRated(!!c)} />
        <Label htmlFor="rated" className="cursor-pointer text-sm">{t("topRated")}</Label>
      </div>
      <Separator />
      <Button variant="outline" className="w-full" onClick={() => { setOpenNow(false); setFreeDelivery(false); setTopRated(false); }}>
        Clear filters
      </Button>
    </aside>
  );

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold lg:text-3xl">{t("title")}</h1>
        <span className="text-sm text-muted-foreground">
          {t("results", { count: filtered.length })}
        </span>
      </div>

      <div className="mb-4 lg:hidden">
        <details className="rounded-xl border bg-card">
          <summary className="cursor-pointer px-4 py-3 font-semibold">{t("filters")}</summary>
          <div className="border-t p-4"><FiltersSidebar /></div>
        </details>
      </div>

      <div className="flex gap-8">
        <div className="hidden w-56 shrink-0 lg:block xl:w-64">
          <div className="sticky top-36 rounded-xl border bg-card p-5">
            <h2 className="mb-4 font-semibold">{t("filters")}</h2>
            <FiltersSidebar />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
