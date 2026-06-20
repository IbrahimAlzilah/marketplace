import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YUSUR Marketplace",
  description: "Saudi Arabia's trusted healthcare marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
