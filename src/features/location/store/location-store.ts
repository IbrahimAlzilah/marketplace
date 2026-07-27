import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationState = {
  city: string;
  district: string;
  setLocation: (city: string, district: string) => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: "Riyadh",
      district: "Al Olaya",
      setLocation: (city, district) => set({ city, district }),
    }),
    { name: "yusur-location" }
  )
);
