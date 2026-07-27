import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },
      toggleItem: (productId) => {
        if (get().items.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },
      isInWishlist: (productId) => get().items.includes(productId),
    }),
    { name: "yusur-wishlist" }
  )
);
