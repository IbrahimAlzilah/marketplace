"use client";

import { OrderSummary } from "@/features/orders";

type CartSummaryProps = {
  subtotal: number;
  deliveryFees: number;
  onCheckout: () => void;
  className?: string;
};

export function CartSummary({ subtotal, deliveryFees, onCheckout, className }: CartSummaryProps) {
  return (
    <OrderSummary
      subtotal={subtotal}
      deliveryFees={deliveryFees}
      showCoupon={false}
      showWallet={false}
      showLoyalty={false}
      className={className ?? "sticky top-36"}
      onCheckout={onCheckout}
    />
  );
}
