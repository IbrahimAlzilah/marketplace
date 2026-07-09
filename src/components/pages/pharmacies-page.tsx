"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { PharmacyCard } from "@/components/marketplace/pharmacy-card";
import { Button } from "@/components/ui/button";
import { pharmacies } from "@/lib/mock-data";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

  const activeFiltersCount = [openNow, freeDelivery, topRated].filter(Boolean).length;

  return (
    <div className="container-marketplace py-6 lg:py-6">
      {/* Title Row with Filter Dropdown */}
      <div className="mb-5 flex items-center justify-between relative">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold lg:text-3xl">{t("title")}</h1>
        </div>

        <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-xl cursor-pointer"
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">{t("filters")}</span>
              {activeFiltersCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className="size-4 transition-transform duration-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
            <DropdownMenuCheckboxItem
              checked={openNow}
              onCheckedChange={(c) => setOpenNow(!!c)}
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer py-2 rounded-lg"
            >
              {t("openNow")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={freeDelivery}
              onCheckedChange={(c) => setFreeDelivery(!!c)}
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer py-2 rounded-lg"
            >
              {t("freeDeliveryFilter")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={topRated}
              onCheckedChange={(c) => setTopRated(!!c)}
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer py-2 rounded-lg"
            >
              {t("topRated")}
            </DropdownMenuCheckboxItem>
            {(openNow || freeDelivery || topRated) && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-foreground mt-1 cursor-pointer"
                  onClick={() => {
                    setOpenNow(false);
                    setFreeDelivery(false);
                    setTopRated(false);
                  }}
                >
                  Clear filters
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid of Pharmacy Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((pharmacy) => (
          <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
        ))}
      </div>
    </div>
  );
}
