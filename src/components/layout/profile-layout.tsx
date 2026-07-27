"use client";

import React from "react";
import { ProfileSidebar } from "./profile-sidebar";

export function ProfileLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-6 text-xl font-bold lg:mb-8 lg:text-2xl">{title}</h1>
      <div className="flex gap-8">
        <ProfileSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
