"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Tag } from "lucide-react";

type CouponProps = {
  onApply?: (code: string) => void;
};

export function Coupon({ onApply }: CouponProps) {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const [code, setCode] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;
    onApply?.(code.trim());
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Tag className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="ps-9 h-10 text-xs rounded-xl"
        />
      </div>
      <Button size="sm" onClick={handleApply} className="h-10 px-4 text-xs font-semibold rounded-xl">
        Apply
      </Button>
    </div>
  );
}
