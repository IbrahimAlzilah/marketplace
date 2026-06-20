import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentlyViewedState = {
  items: string[];
  addItem: (productId: string) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        const filtered = get().items.filter((id) => id !== productId);
        set({ items: [productId, ...filtered].slice(0, 12) });
      },
    }),
    { name: "yusur-recently-viewed" }
  )
);
