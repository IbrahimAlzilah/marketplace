import { create } from "zustand";
import { persist } from "zustand/middleware";

// Re-export CheckoutLine and useCheckoutStore so existing consumers importing
// from "@/stores/cart-store" continue to work without modification.
export type { CheckoutLine } from "@/features/checkout";
export { useCheckoutStore } from "@/features/checkout";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  couponCode: string | null;
  walletAmount: number;
  loyaltyPoints: number;

  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string | null) => void;
  setWalletAmount: (amount: number) => void;
  setLoyaltyPoints: (points: number) => void;
  getItemCount: () => number;

  // ---------------------------------------------------------------------------
  // Backward-compat shims: checkout fields that components still destructure
  // from useCartStore(). They delegate to useCheckoutStore.
  // ---------------------------------------------------------------------------
  checkoutAddressId: string | null;
  checkoutLines: import("@/features/checkout").CheckoutLine[];
  setCheckoutAddressId: (id: string | null) => void;
  setCheckoutLines: (lines: import("@/features/checkout").CheckoutLine[]) => void;
  resolvePartialLine: (productId: string, accept: boolean) => void;
  resolveRejectedLine: (productId: string, substitute: import("@/features/checkout").CheckoutLine["selectedSubstitute"]) => void;
  resolvePartialWithSubstituteLine: (productId: string, substitute: import("@/features/checkout").CheckoutLine["selectedSubstitute"]) => void;
  resetCheckout: () => void;

  // Dev-only: scenario selector state
  activeScenarioId: string | null;
  setActiveScenarioId: (id: string | null) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ── Cart domain state ──────────────────────────────────────────────────
      items: [],
      couponCode: null,
      walletAmount: 0,
      loyaltyPoints: 0,

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

      clearCart: () => {
        set({ items: [], couponCode: null, walletAmount: 0, loyaltyPoints: 0 });
        // Also reset checkout state in the checkout store
        import("@/features/checkout").then(({ useCheckoutStore }) => {
          useCheckoutStore.getState().resetCheckout();
        });
      },

      setCoupon: (code) => set({ couponCode: code }),
      setWalletAmount: (amount) => set({ walletAmount: amount }),
      setLoyaltyPoints: (points) => set({ loyaltyPoints: points }),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      // ── Checkout shims (delegate to checkout-store) ────────────────────────
      checkoutAddressId: null,
      checkoutLines: [],
      setCheckoutAddressId: (id) => {
        import("@/features/checkout").then(({ useCheckoutStore }) => {
          useCheckoutStore.getState().setCheckoutAddressId(id);
        });
      },
      setCheckoutLines: (lines) => {
        import("@/features/checkout").then(({ useCheckoutStore }) => {
          useCheckoutStore.getState().setCheckoutLines(lines);
        });
      },
      resolvePartialLine: (productId, accept) => {
        import("@/features/checkout").then(({ useCheckoutStore }) => {
          useCheckoutStore.getState().resolvePartialLine(productId, accept);
        });
      },
      resolveRejectedLine: (productId, substitute) => {
        import("@/features/checkout").then(({ useCheckoutStore }) => {
          useCheckoutStore.getState().resolveRejectedLine(productId, substitute);
        });
      },
      resolvePartialWithSubstituteLine: (productId, substitute) => {
        import("@/features/checkout").then(({ useCheckoutStore }) => {
          useCheckoutStore.getState().resolvePartialWithSubstituteLine(productId, substitute);
        });
      },
      resetCheckout: () => {
        import("@/features/checkout").then(({ useCheckoutStore }) => {
          useCheckoutStore.getState().resetCheckout();
        });
      },

      // ── Dev-only scenario state ────────────────────────────────────────────
      activeScenarioId: null,
      setActiveScenarioId: (id) => set({ activeScenarioId: id }),
    }),
    {
      name: "yusur-cart",
      // Only persist cart domain state
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        walletAmount: state.walletAmount,
        loyaltyPoints: state.loyaltyPoints,
        activeScenarioId: state.activeScenarioId,
      }),
    }
  )
);
