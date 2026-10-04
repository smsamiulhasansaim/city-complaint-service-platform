import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to the City Complaint & Service Platform to file complaints, request services, or manage operations.",
  openGraph: {
    title: "Login | City Complaint Service Platform",
    description:
      "Login to file a complaint or manage municipal service requests.",
  },
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}