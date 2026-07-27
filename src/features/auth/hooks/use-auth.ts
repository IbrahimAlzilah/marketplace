/**
 * useAuth — feature hook that abstracts auth store access.
 *
 * Combines useAuthStore (domain) and useAuthModalStore (UI) into a single
 * unified interface matching the original useAuthStore() API.
 */
"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useAuthModalStore } from "@/stores/auth-modal-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const isAuthModalOpen = useAuthModalStore((s) => s.isAuthModalOpen);
  const authModalStep = useAuthModalStore((s) => s.authModalStep);
  const authModalResetMode = useAuthModalStore((s) => s.authModalResetMode);
  const authModalPhone = useAuthModalStore((s) => s.authModalPhone);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const closeAuthModal = useAuthModalStore((s) => s.closeAuthModal);
  const setAuthModalStep = useAuthModalStore((s) => s.setAuthModalStep);
  const setAuthModalPhone = useAuthModalStore((s) => s.setAuthModalPhone);
  const setAuthModalResetMode = useAuthModalStore((s) => s.setAuthModalResetMode);

  return {
    // Domain
    user,
    isAuthenticated,
    login,
    logout,
    // Modal UI
    isAuthModalOpen,
    authModalStep,
    authModalResetMode,
    authModalPhone,
    openAuthModal,
    closeAuthModal,
    setAuthModalStep,
    setAuthModalPhone,
    setAuthModalResetMode,
  };
}
