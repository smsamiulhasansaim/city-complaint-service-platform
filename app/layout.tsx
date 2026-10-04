import type { Metadata, Viewport } from "next";

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/providers/ToastProvider";

import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: APP_URL ? new URL(APP_URL) : undefined,
  title: {
    default: "City Complaint Service Platform",
    template: "%s | City Complaint Service Platform",
  },
  description:
    "Report civic complaints, request municipal services, pay fees, and track resolutions online.",
  applicationName: "City Complaint Service Platform",
  authors: [{ name: "City Complaint Service Platform" }],
  openGraph: {
    type: "website",
    siteName: "City Complaint Service Platform",
    title: "City Complaint Service Platform",
    description:
      "Report civic complaints and request municipal services online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "City Complaint Service Platform",
    description:
      "Report civic complaints and request municipal services online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf4e4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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