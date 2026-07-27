"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { cn } from "@/lib/utils";

type AddressItem = {
  id: string;
  label: string;
  isMain: boolean;
  address: string;
};

type ShippingProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: AddressItem[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onConfirm: () => void;
};

export function Shipping({
  open,
  onOpenChange,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onConfirm,
}: ShippingProps) {
  const tCheckout = useTranslations("checkout");

  const getAddressLabelTranslation = (label: string) => {
    if (label.includes("home")) return tCheckout("addressHome");
    if (label.includes("job")) return tCheckout("addressJob");
    return label;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 rounded-2xl bg-card">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-bold text-foreground">{tCheckout("chooseAddress")}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Button variant="outline" className="w-full justify-center gap-2 border-dashed border-2 py-6 rounded-xl hover:bg-primary/5">
            <span className="text-xl font-bold">+</span> {tCheckout("addNewTitle")}
          </Button>

          <RadioGroup value={selectedAddressId} onValueChange={onSelectAddress} className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all hover:bg-muted/40",
                  selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <RadioGroupItem value={addr.id} className="mt-1" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{getAddressLabelTranslation(addr.label)}</span>
                    {addr.isMain && (
                      <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                        {tCheckout("main")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">{addr.address}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2 pt-2 border-t">
          <Button
            className="w-full py-6 rounded-xl text-base font-bold text-white bg-primary hover:bg-primary/95"
            onClick={onConfirm}
          >
            {tCheckout("select")}
          </Button>
          <Button
            variant="ghost"
            className="w-full py-6 rounded-xl text-base font-bold text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            {tCheckout("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
