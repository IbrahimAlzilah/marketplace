"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPin, ShieldCheck } from "lucide-react";
import { AllocationStatus } from "@/features/checkout/lib/allocation-evaluator";
import { cn } from "@/lib/utils";

type PharmacyHeaderProps = {
  name: string;
  nameAr: string;
  logo?: string | null;
  status: AllocationStatus;
  eta?: number;
  distance?: number;
  licensed?: boolean;
  className?: string;
};

export function PharmacyHeader({
  name,
  nameAr,
  logo,
  status,
  eta,
  distance,
  licensed = true,
  className
}: PharmacyHeaderProps) {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");
  const locale = useLocale();

  const displayName = locale === "ar" ? nameAr : name;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        {logo ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-white flex items-center justify-center p-0.5">
            <Image
              src={logo}
              alt={displayName}
              fill
              className="object-contain rounded-full"
            />
          </div>
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 border flex items-center justify-center font-bold text-primary text-base">
            {displayName[0]}
          </div>
        )}

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-base text-foreground">{displayName}</h4>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {eta !== undefined && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {eta} {tc("min")}
              </span>
            )}
            {distance !== undefined && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {distance} {tc("km")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
