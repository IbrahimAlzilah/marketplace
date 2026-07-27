import type { AllocationStatus } from "@/features/checkout/lib/allocation-evaluator";

export type CartLine = {
  productId: string;
  quantity: number;
};

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
