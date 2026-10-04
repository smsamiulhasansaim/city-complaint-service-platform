import type { Metadata } from "next";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/providers/ToastProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "City Complaint Service Platform",
    template: "%s | City Complaint Service Platform",
  },
  description:
    "Report civic complaints and request municipal services online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}