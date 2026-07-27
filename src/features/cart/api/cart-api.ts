import { getMockAllocations, AllocationItem } from "@/features/checkout/lib/allocation-evaluator";
import type { CartLine } from "../types/cart.types";

export async function fetchCartAllocations(items: CartLine[]): Promise<AllocationItem[]> {
  // Simulate network API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockAllocations(items);
}

export async function validateCartCoupon(code: string): Promise<{ valid: boolean; discountAmount: number }> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (code.toUpperCase() === "YUSUR10") {
    return { valid: true, discountAmount: 10 };
  }
  return { valid: false, discountAmount: 0 };
}
