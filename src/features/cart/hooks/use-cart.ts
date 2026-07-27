/**
 * useCart — feature hook that abstracts cart store access.
 *
 * Use this in new components instead of calling useCartStore() directly.
 * This ensures that refactoring the store internals only requires updating
 * this hook, not every consumer.
 */
"use client";

import { useCartStore } from "../store/cart-store";

export function useCart() {
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const walletAmount = useCartStore((s) => s.walletAmount);
  const loyaltyPoints = useCartStore((s) => s.loyaltyPoints);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const setWalletAmount = useCartStore((s) => s.setWalletAmount);
  const setLoyaltyPoints = useCartStore((s) => s.setLoyaltyPoints);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const itemCount = getItemCount();

  return {
    items,
    itemCount,
    couponCode,
    walletAmount,
    loyaltyPoints,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCoupon,
    setWalletAmount,
    setLoyaltyPoints,
  };
}
