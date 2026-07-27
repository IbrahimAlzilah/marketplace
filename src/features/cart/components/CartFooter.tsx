"use client";

import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function CartFooter() {
  const tc = useTranslations("common");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t text-muted-foreground text-xs">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
        <span>100% Genuine Healthcare Products</span>
      </div>
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-primary shrink-0" />
        <span>Express Delivery from Licensed Pharmacies</span>
      </div>
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-primary shrink-0" />
        <span>Easy Returns & Resolution Guarantee</span>
      </div>
    </div>
  );
}
