"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

type OrderSummaryProps = {
  subtotal: number;
  deliveryFees: number;
  discount?: number;
  showCoupon?: boolean;
  showWallet?: boolean;
  showLoyalty?: boolean;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  className?: string;
};

const WALLET_BALANCE = 125.5;
const LOYALTY_POINTS = 2400;
const POINTS_TO_SAR = 0.01;

export function OrderSummary({
  subtotal,
  deliveryFees,
  discount = 0,
  showCoupon = true,
  showWallet = true,
  showLoyalty = true,
  showCheckoutButton = true,
  onCheckout,
  className,
}: OrderSummaryProps) {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const tCheckout = useTranslations("checkout");
  const {
    couponCode,
    setCoupon,
    walletAmount,
    setWalletAmount,
    loyaltyPoints,
    setLoyaltyPoints,
  } = useCartStore();

  const loyaltyDiscount = loyaltyPoints * POINTS_TO_SAR;
  const total = Math.max(0, subtotal + deliveryFees - discount - walletAmount - loyaltyDiscount);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t("orderSummary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showCoupon && (
          <div className="flex gap-2">
            <Input
              placeholder={t("couponPlaceholder")}
              value={couponCode ?? ""}
              onChange={(e) => setCoupon(e.target.value || null)}
            />
            <Button variant="outline" className="shrink-0">{tc("apply")}</Button>
          </div>
        )}

        {showWallet && (
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="wallet"
                checked={walletAmount > 0}
                onCheckedChange={(checked) => setWalletAmount(checked ? Math.min(WALLET_BALANCE, subtotal) : 0)}
              />
              <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                {tc("useWallet")}
              </Label>
              <span className="text-sm font-medium text-primary">{formatPrice(WALLET_BALANCE)}</span>
            </div>
          </div>
        )}

        {showLoyalty && (
          <div className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center justify-between text-sm">
              <span>{tc("useLoyalty")}</span>
              <span className="font-medium">{LOYALTY_POINTS} pts</span>
            </div>
            <Slider
              value={[loyaltyPoints]}
              onValueChange={([v]) => setLoyaltyPoints(v)}
              max={Math.min(LOYALTY_POINTS, Math.floor(subtotal / POINTS_TO_SAR))}
              step={100}
            />
            <p className="text-xs text-muted-foreground">
              {loyaltyPoints} pts = {formatPrice(loyaltyDiscount)}
            </p>
          </div>
        )}

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{tc("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("deliveryFees")}</span>
            <span>{formatPrice(deliveryFees)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("vat15")}</span>
            <span>{formatPrice(total * 0.15)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>{t("discount")}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          {walletAmount > 0 && (
            <div className="flex justify-between text-primary">
              <span>{t("walletApplied")}</span>
              <span>-{formatPrice(walletAmount)}</span>
            </div>
          )}
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-secondary">
              <span>{t("loyaltyApplied")}</span>
              <span>-{formatPrice(loyaltyDiscount)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>{t("totalAmount")}</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>

        {showCheckoutButton && (
          <Button className="w-full" size="lg" onClick={onCheckout}>
            {tc("checkout")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
