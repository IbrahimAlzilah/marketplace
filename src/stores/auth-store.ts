import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type AuthModalStep = "login" | "register" | "forgot-password" | "otp" | "reset-password";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  
  // Modal State
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
      // Modal Implementation
      isAuthModalOpen: false,
      authModalStep: "login",
      authModalResetMode: false,
      authModalPhone: "",
      openAuthModal: (step = "login") => set({ isAuthModalOpen: true, authModalStep: step }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      setAuthModalStep: (step) => set({ authModalStep: step }),
      setAuthModalPhone: (phone) => set({ authModalPhone: phone }),
      setAuthModalResetMode: (resetMode) => set({ authModalResetMode: resetMode }),
    }),
    {
      name: "yusur-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
