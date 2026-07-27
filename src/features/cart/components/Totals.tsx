"use client";

import { useTranslations } from "next-intl";
import { Price } from "@/shared/components/ui/currency";

type TotalsProps = {
  subtotal: number;
  deliveryFees: number;
  discount?: number;
  total: number;
};

export function Totals({ subtotal, deliveryFees, discount = 0, total }: TotalsProps) {
  const t = useTranslations("cart");

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>Subtotal</span>
        <Price amount={subtotal} className="font-medium text-foreground" />
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Delivery Fees</span>
        <Price amount={deliveryFees} className="font-medium text-foreground" />
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-<Price amount={discount} className="font-medium text-green-600" /></span>
        </div>
      )}
      <div className="flex justify-between pt-2 border-t font-bold text-base text-foreground">
        <span>Total</span>
        <Price amount={total} className="font-bold text-primary text-base" />
      </div>
    </div>
  );
}
