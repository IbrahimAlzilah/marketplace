"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { QuantityStepper } from "@/shared/components/marketplace";
import { Price } from "@/shared/components/ui/currency";
import { getProductById } from "@/lib/mock-data";
import { useCartStore } from "../store/cart-store";

type CartItemProps = {
  productId: string;
  quantity: number;
};

export function CartItem({ productId, quantity }: CartItemProps) {
  const locale = useLocale();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const product = getProductById(productId);

  if (!product) return null;
  const name = locale === "ar" ? product.nameAr : product.name;

  return (
    <div className="border rounded-xl p-3 flex items-center justify-between gap-4 bg-card">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white flex items-center justify-center">
          <Image src={product.image} alt={name} fill className="object-contain p-1 rounded-lg" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-foreground line-clamp-1 truncate">{name}</h4>
          <Price amount={product.price} className="text-sm font-bold text-primary mt-0.5" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <QuantityStepper
          value={quantity}
          onChange={(q: number) => updateQuantity(productId, q)}
          max={product.stockCount}
        />
      </div>
    </div>
  );
}
