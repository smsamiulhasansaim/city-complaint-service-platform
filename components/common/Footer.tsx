import Link from "next/link";
import { Building2, Database, Mail, MapPin, Phone } from "lucide-react";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-ink bg-surface">
              <Building2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-ink">
              City Complaint
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            File civic complaints, request municipal services, and track
            resolutions — transparently.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
            Platform
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { href: "/services", label: "Services" },
              { href: "/about", label: "About" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
            Account
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { href: "/login", label: "Login" },
              { href: "/register", label: "Register" },
              { href: "/dashboard", label: "My dashboard" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              City Corporation, Dhaka 1000, Bangladesh
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              16263 (24×7 helpline)
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              support@citycomplaint.com
            </li>
            <li className="flex items-start gap-2">
              <Database className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Open data — coming soon
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-ink-muted sm:flex-row sm:px-6">
          <p>
            © {YEAR} City Complaint Service Platform. All rights reserved.
          </p>
          <p className="flex items-center gap-3">
            <Link href="/about" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/about" className="hover:text-ink">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}