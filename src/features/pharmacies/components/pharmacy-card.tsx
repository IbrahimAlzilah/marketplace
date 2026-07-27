"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Pharmacy } from "@/lib/mock-data";

type PharmacyCardProps = {
  pharmacy: Pharmacy;
  className?: string;
  variant?: "grid" | "horizontal";
};

export function PharmacyCard({ pharmacy, className, variant = "grid" }: PharmacyCardProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const name = locale === "ar" ? pharmacy.nameAr : pharmacy.name;

  if (variant === "horizontal") {
    return (
      <Link href={`/pharmacies/${pharmacy.slug}`}>
        <Card className={cn("overflow-hidden transition-shadow hover:shadow-sm", className)}>
          <div className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border bg-white">
              <Image src={pharmacy.logo} alt={name} fill className="object-contain p-1" sizes="64px" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{name}</h3>
                <Badge variant={pharmacy.isOpen ? "success" : "destructive"}>
                  {pharmacy.isOpen ? t("open") : t("closed")}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {pharmacy.distance} {t("km")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {pharmacy.eta} {t("min")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/pharmacies/${pharmacy.slug}`}>
      <Card className={cn("group h-full overflow-hidden transition-shadow hover:shadow-xs", className)}>
        <div className="relative aspect-[16/6] overflow-hidden bg-muted">
          <Image
            src={pharmacy.cover}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 25vw"
          />
          <div className="absolute start-3 top-3">
            <Badge variant={pharmacy.isOpen ? "success" : "destructive"}>
              {pharmacy.isOpen ? t("open") : t("closed")}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-white">
              <Image src={pharmacy.logo} alt={name} fill className="object-contain p-1 rounded-full" sizes="48px" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold leading-tight">{name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {pharmacy.distance} {t("km")}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {pharmacy.eta} {t("min")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
