"use client";

import { useTranslations } from "next-intl";
import { CreditCard, Wallet, Banknote } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { PaymentMethod } from "../types/checkout.types";

type PaymentSectionProps = {
  selectedPayment: PaymentMethod;
  onSelectPayment: (method: PaymentMethod) => void;
};

export function PaymentSection({
  selectedPayment,
  onSelectPayment,
}: PaymentSectionProps) {
  const t = useTranslations("checkout");

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-primary" />
        {t("paymentMethod")}
      </h2>

      <RadioGroup
        value={selectedPayment}
        onValueChange={(v) => onSelectPayment(v as PaymentMethod)}
        className="grid gap-3 sm:grid-cols-3"
      >
        <label
          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedPayment === "card"
              ? "border-primary bg-primary/5"
              : "hover:border-muted-foreground/30"
          }`}
        >
          <RadioGroupItem value="card" />
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("creditCard")}</span>
          </div>
        </label>

        <label
          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedPayment === "apple_pay"
              ? "border-primary bg-primary/5"
              : "hover:border-muted-foreground/30"
          }`}
        >
          <RadioGroupItem value="apple_pay" />
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("applePay")}</span>
          </div>
        </label>

        <label
          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedPayment === "cash"
              ? "border-primary bg-primary/5"
              : "hover:border-muted-foreground/30"
          }`}
        >
          <RadioGroupItem value="cash" />
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("cashOnDelivery")}</span>
          </div>
        </label>
      </RadioGroup>
    </Card>
  );
}
