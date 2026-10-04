import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Citizen Dashboard",
  },
};

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-cream">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <Sidebar scope="CITIZEN" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}