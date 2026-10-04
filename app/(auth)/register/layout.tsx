import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a citizen account on the City Complaint & Service Platform.",
  openGraph: {
    title: "Register | City Complaint Service Platform",
    description:
      "Join the platform to file complaints and request municipal services.",
  },
};

export default function RegisterLayout({
  children,
}: LayoutProps<"/register">) {
  return children;
}