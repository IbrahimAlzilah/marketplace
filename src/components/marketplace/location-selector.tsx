"use client";

import { useTranslations } from "next-intl";
import { MapPin, Navigation } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addresses } from "@/lib/mock-data";
import { useLocationStore } from "@/stores/location-store";
import { cn } from "@/lib/utils";

type LocationSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LocationSelector({ open, onOpenChange }: LocationSelectorProps) {
  const t = useTranslations("location");
  const { city, district, setLocation } = useLocationStore();

  const handleSelect = (label: string, addrCity: string, addrDistrict: string) => {
    setLocation(addrCity, addrDistrict || label);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => handleSelect("Current", "Riyadh", "Al Olaya")}
          >
            <Navigation className="h-4 w-4 text-primary" />
            {t("useCurrent")}
          </Button>
          <p className="text-sm font-medium text-muted-foreground">{t("savedAddresses")}</p>
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => handleSelect(addr.label, addr.city, addr.district)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-3 text-start transition-colors hover:bg-primary/5",
                district === addr.district && city === addr.city && "border-primary bg-primary/5"
              )}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium">{addr.label}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.street}, {addr.district}, {addr.city}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
