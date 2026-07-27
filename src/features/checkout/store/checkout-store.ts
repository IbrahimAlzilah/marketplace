import { useCartStore } from "@/stores/cart-store";

export const useCheckoutStore = useCartStore;
export type { CheckoutLine } from "@/stores/cart-store";
