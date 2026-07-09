import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AllocationStatus } from "@/lib/allocation-evaluator";

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
  allocatedQty: string | number;
  status: AllocationStatus;
  resolution: "pending" | "accepted_partial" | "accepted_substitute" | "removed" | "approved";
  substitute?: {
    productId: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
  } | null;
  rejectionReason?: string;
  rejectionReasonAr?: string;
};

type CartState = {
  items: CartLine[];
  couponCode: string | null;
  walletAmount: number;
  loyaltyPoints: number;
  checkoutAddressId: string | null;
  checkoutLines: CheckoutLine[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string | null) => void;
  setWalletAmount: (amount: number) => void;
  setLoyaltyPoints: (points: number) => void;
  getItemCount: () => number;
  setCheckoutAddressId: (id: string | null) => void;
  setCheckoutLines: (lines: CheckoutLine[]) => void;
  resolvePartialLine: (productId: string, accept: boolean) => void;
  resolveRejectedLine: (productId: string, acceptSubstitute: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      walletAmount: 0,
      loyaltyPoints: 0,
      checkoutAddressId: null,
      checkoutLines: [],
      addItem: (productId, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [], couponCode: null, walletAmount: 0, loyaltyPoints: 0, checkoutAddressId: null, checkoutLines: [] }),
      setCoupon: (code) => set({ couponCode: code }),
      setWalletAmount: (amount) => set({ walletAmount: amount }),
      setLoyaltyPoints: (points) => set({ loyaltyPoints: points }),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      setCheckoutAddressId: (id) => set({ checkoutAddressId: id }),
      setCheckoutLines: (lines) => set({ checkoutLines: lines }),
      resolvePartialLine: (productId, accept) => {
        const lines = get().checkoutLines.map((line) => {
          if (line.productId !== productId) return line;
          
          if (accept) {
            const finalQty = typeof line.allocatedQty === "number" 
              ? line.allocatedQty 
              : parseInt(String(line.allocatedQty), 10) || 1;
            return {
              ...line,
              requestedQty: finalQty,
              resolution: "accepted_partial" as const,
            };
          } else {
            return {
              ...line,
              resolution: "removed" as const,
            };
          }
        });
        set({ checkoutLines: lines });
      },
      resolveRejectedLine: (productId, acceptSubstitute) => {
        const lines = get().checkoutLines.map((line) => {
          if (line.productId !== productId) return line;

          if (acceptSubstitute && line.substitute) {
            return {
              ...line,
              productId: line.substitute.productId,
              productName: line.substitute.name,
              productNameAr: line.substitute.nameAr,
              price: line.substitute.price,
              image: line.substitute.image,
              requestedQty: 1, // Default substitute quantity to 1
              allocatedQty: 1,
              status: AllocationStatus.APPROVED,
              resolution: "accepted_substitute" as const,
            };
          } else {
            return {
              ...line,
              resolution: "removed" as const,
            };
          }
        });
        set({ checkoutLines: lines });
      },
    }),
    { name: "yusur-cart" }
  )
);

