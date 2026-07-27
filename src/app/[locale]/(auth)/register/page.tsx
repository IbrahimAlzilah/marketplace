"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/features/auth";

export default function RegisterPage() {
  const router = useRouter();
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  useEffect(() => {
    openAuthModal("register");
    router.replace("/");
  }, [openAuthModal, router]);

  return null;
}
