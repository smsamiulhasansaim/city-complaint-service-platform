import type { Metadata } from "next";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "City Complaint Service Platform",
  description: "City Complaint Service Platform",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}