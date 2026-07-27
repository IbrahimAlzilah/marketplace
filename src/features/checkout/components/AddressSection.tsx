"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, Plus, MapPin } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { addresses } from "@/lib/mock-data";
import { Address } from "@/shared/types/domain";

type AddressSectionProps = {
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onAddAddressClick: () => void;
};

export function AddressSection({
  selectedAddressId,
  onSelectAddress,
  onAddAddressClick,
}: AddressSectionProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {t("deliveryAddress")}
        </h2>
        <Button variant="outline" size="sm" onClick={onAddAddressClick}>
          <Plus className="h-4 w-4 me-1" />
          {t("addNewAddress")}
        </Button>
      </div>

      <RadioGroup
        value={selectedAddressId || ""}
        onValueChange={onSelectAddress}
        className="grid gap-3 sm:grid-cols-2"
      >
        {addresses.map((addr: Address) => (
          <label
            key={addr.id}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAddressId === addr.id
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/30"
            }`}
          >
            <RadioGroupItem value={addr.id} className="mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-sm flex items-center gap-2">
                {addr.label}
                {addr.isDefault && (
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-normal">
                    {t("default")}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {addr.street}, {addr.district}, {addr.city}
              </p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </Card>
  );
}
