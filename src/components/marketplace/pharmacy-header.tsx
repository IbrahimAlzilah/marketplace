"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { AllocationStatus } from "@/lib/allocation-evaluator";
import { Badge } from "@/components/ui/badge";
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

  // Determine status color, labels, and icons
  let statusColor = "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  let statusLabel = t("pending");
  let StatusIcon = AlertCircle;

  if (status === AllocationStatus.APPROVED) {
    statusColor = "bg-green-500/10 text-green-600 border-green-500/20";
    statusLabel = t("approve");
    StatusIcon = CheckCircle;
  } else if (status === AllocationStatus.PARTIAL) {
    statusColor = "bg-orange-500/10 text-orange-600 border-orange-500/20";
    statusLabel = t("partiallyAvailable");
    StatusIcon = Clock;
  } else if (status === AllocationStatus.REJECTED) {
    statusColor = "bg-red-500/10 text-red-600 border-red-500/20";
    statusLabel = t("rejected");
    StatusIcon = XCircle;
  }

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
            {licensed && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                <ShieldCheck className="h-3 w-3" />
                {tc("licensed")}
              </span>
            )}
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

      <div className="flex items-center self-end sm:self-center shrink-0">
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border",
            statusColor
          )}
        >
          <StatusIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{statusLabel}</span>
        </Badge>
      </div>
    </div>
  );
}
