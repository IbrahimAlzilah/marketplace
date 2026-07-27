import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AllocationStatus } from "@/lib/allocation-evaluator";

export type CheckoutLine = {
  productId: string;
  productName: string;
  productNameAr: string;
  price: number;
  image: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyNameAr: string;
  requestedQty: number;
  allocatedQty: string | number; // "?", "*", or number
  status: AllocationStatus;
  resolution: "pending" | "accepted_partial" | "accepted_substitute" | "accepted_partial_and_substitute" | "removed" | "approved";
  substitute?: {
    productId: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
  } | null;
  substitutes?: Array<{
    productId: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
  }>;
  selectedSubstitute?: {
    productId: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
  } | null;
  rejectionReason?: string;
  rejectionReasonAr?: string;
};

type CheckoutState = {
  checkoutAddressId: string | null;
  checkoutLines: CheckoutLine[];
  setCheckoutAddressId: (id: string | null) => void;
  setCheckoutLines: (lines: CheckoutLine[]) => void;
  resolvePartialLine: (productId: string, accept: boolean) => void;
  resolveRejectedLine: (productId: string, substitute: CheckoutLine["selectedSubstitute"]) => void;
  resolvePartialWithSubstituteLine: (productId: string, substitute: CheckoutLine["selectedSubstitute"]) => void;
  resetCheckout: () => void;
};

/**
 * Checkout Store — manages the checkout flow state independently of the cart.
 * Persisted so the user can refresh mid-checkout without losing progress.
 */
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      checkoutAddressId: null,
      checkoutLines: [],

      setCheckoutAddressId: (id) => set({ checkoutAddressId: id }),
      setCheckoutLines: (lines) => set({ checkoutLines: lines }),

      resolvePartialLine: (productId, accept) => {
        const lines = get().checkoutLines.map((line) => {
          if (line.productId !== productId) return line;
          return {
            ...line,
            resolution: accept ? ("accepted_partial" as const) : ("removed" as const),
          };
        });
        set({ checkoutLines: lines });
      },

      resolveRejectedLine: (productId, substitute) => {
        const lines = get().checkoutLines.map((line) => {
          if (line.productId !== productId) return line;
          if (substitute) {
            return {
              ...line,
              selectedSubstitute: substitute,
              resolution: "accepted_substitute" as const,
            };
          } else {
            return {
              ...line,
              selectedSubstitute: null,
              resolution: "removed" as const,
            };
          }
        });
        set({ checkoutLines: lines });
      },

      resolvePartialWithSubstituteLine: (productId, substitute) => {
        const lines = get().checkoutLines.map((line) => {
          if (line.productId !== productId) return line;
          if (substitute) {
            return {
              ...line,
              selectedSubstitute: substitute,
              resolution: "accepted_partial_and_substitute" as const,
            };
          } else {
            return {
              ...line,
              selectedSubstitute: null,
              resolution: "accepted_partial" as const,
            };
          }
        });
        set({ checkoutLines: lines });
      },

      resetCheckout: () => set({ checkoutLines: [], checkoutAddressId: null }),
    }),
    { name: "yusur-checkout" }
  )
);
