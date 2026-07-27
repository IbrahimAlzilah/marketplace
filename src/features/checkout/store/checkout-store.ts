import { useCartStore } from "@/features/cart";

export const useCheckoutStore = useCartStore;
export type { CheckoutLine } from "@/features/cart";
