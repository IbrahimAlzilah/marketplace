/**
 * useCheckout — feature hook that abstracts checkout store access.
 *
 * Use this in new components instead of calling useCheckoutStore directly.
 */
"use client";

import { useCheckoutStore } from "../store/checkout-store";

export function useCheckout() {
  const checkoutAddressId = useCheckoutStore((s) => s.checkoutAddressId);
  const checkoutLines = useCheckoutStore((s) => s.checkoutLines);
  const setCheckoutAddressId = useCheckoutStore((s) => s.setCheckoutAddressId);
  const setCheckoutLines = useCheckoutStore((s) => s.setCheckoutLines);
  const resolvePartialLine = useCheckoutStore((s) => s.resolvePartialLine);
  const resolveRejectedLine = useCheckoutStore((s) => s.resolveRejectedLine);
  const resolvePartialWithSubstituteLine = useCheckoutStore((s) => s.resolvePartialWithSubstituteLine);
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  return {
    checkoutAddressId,
    checkoutLines,
    setCheckoutAddressId,
    setCheckoutLines,
    resolvePartialLine,
    resolveRejectedLine,
    resolvePartialWithSubstituteLine,
    resetCheckout,
  };
}
