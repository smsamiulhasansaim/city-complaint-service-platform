import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate flex min-h-[calc(100dvh-var(--navbar-h,0px))] items-center justify-center overflow-hidden bg-cream px-4 py-10 sm:px-6">
      {/* Pixel dot field — matches not-found.tsx */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#8a9e7b_1.5px,transparent_1.5px)] bg-size-[24px_24px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_90%)]"
      />

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-ink"
          aria-label="Go to home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-surface shadow-[3px_3px_0_0_var(--color-ink)]">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            City Complaint
          </span>
        </Link>

        {children}

        <p className="mt-8 text-center text-xs text-ink-muted">
          By continuing you agree to our{" "}
          <Link href="/about" className="underline underline-offset-4">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/about" className="underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}