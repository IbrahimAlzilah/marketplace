import { create } from "zustand";

export type AuthModalStep = "login" | "register" | "forgot-password" | "otp" | "reset-password";

type AuthModalState = {
  isAuthModalOpen: boolean;
  authModalStep: AuthModalStep;
  authModalResetMode: boolean;
  authModalPhone: string;
  openAuthModal: (step?: AuthModalStep) => void;
  closeAuthModal: () => void;
  setAuthModalStep: (step: AuthModalStep) => void;
  setAuthModalPhone: (phone: string) => void;
  setAuthModalResetMode: (resetMode: boolean) => void;
};

/**
 * Auth Modal UI Store — ephemeral UI state, NOT persisted to localStorage.
 * Separated from useAuthStore (domain) to prevent modal open/step state
 * from being accidentally restored on page load.
 */
export const useAuthModalStore = create<AuthModalState>()((set) => ({
  isAuthModalOpen: false,
  authModalStep: "login",
  authModalResetMode: false,
  authModalPhone: "",
  openAuthModal: (step = "login") => set({ isAuthModalOpen: true, authModalStep: step }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthModalStep: (step) => set({ authModalStep: step }),
  setAuthModalPhone: (phone) => set({ authModalPhone: phone }),
  setAuthModalResetMode: (resetMode) => set({ authModalResetMode: resetMode }),
}));
