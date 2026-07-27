import { create } from "zustand";
import { persist } from "zustand/middleware";

// Re-export modal store types and hook so existing consumers importing from
// "@/stores/auth-store" continue to work without modification.
export type { AuthModalStep } from "./auth-modal-store";
export { useAuthModalStore } from "./auth-modal-store";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // ---------------------------------------------------------------------------
  // Backward-compat shims — these delegate to useAuthModalStore.
  // Kept here so that components using `useAuthStore()` destructuring
  // (e.g. `const { openAuthModal } = useAuthStore()`) continue working
  // without any code changes.
  // ---------------------------------------------------------------------------
  isAuthModalOpen: boolean;
  authModalStep: import("./auth-modal-store").AuthModalStep;
  authModalResetMode: boolean;
  authModalPhone: string;
  openAuthModal: (step?: import("./auth-modal-store").AuthModalStep) => void;
  closeAuthModal: () => void;
  setAuthModalStep: (step: import("./auth-modal-store").AuthModalStep) => void;
  setAuthModalPhone: (phone: string) => void;
  setAuthModalResetMode: (resetMode: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      // ── Auth domain state ──────────────────────────────────────────────────
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // ── Modal UI shims (delegate to auth-modal-store) ─────────────────────
      // These initial values are overridden at runtime by the modal store
      // subscriptions in components that use both stores.
      // The shims exist purely for backward compatibility.
      isAuthModalOpen: false,
      authModalStep: "login" as const,
      authModalResetMode: false,
      authModalPhone: "",
      openAuthModal: (step = "login") => {
        // Delegate to the dedicated modal store
        import("./auth-modal-store").then(({ useAuthModalStore }) => {
          useAuthModalStore.getState().openAuthModal(step);
        });
      },
      closeAuthModal: () => {
        import("./auth-modal-store").then(({ useAuthModalStore }) => {
          useAuthModalStore.getState().closeAuthModal();
        });
      },
      setAuthModalStep: (step) => {
        import("./auth-modal-store").then(({ useAuthModalStore }) => {
          useAuthModalStore.getState().setAuthModalStep(step);
        });
      },
      setAuthModalPhone: (phone) => {
        import("./auth-modal-store").then(({ useAuthModalStore }) => {
          useAuthModalStore.getState().setAuthModalPhone(phone);
        });
      },
      setAuthModalResetMode: (resetMode) => {
        import("./auth-modal-store").then(({ useAuthModalStore }) => {
          useAuthModalStore.getState().setAuthModalResetMode(resetMode);
        });
      },
    }),
    {
      name: "yusur-auth",
      // Only persist auth domain state — never modal UI state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
