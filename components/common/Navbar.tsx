"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User as UserIcon,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";
import { ROLE_HOME } from "@/lib/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadCount } from "@/hooks/useNotifications";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { user, initialized, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = useUnreadCount();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="City Complaint Service Platform — home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-surface shadow-[3px_3px_0_0_var(--color-ink)]">
            <Building2 className="h-4.5 w-4.5" aria-hidden="true" />
          </span>

          <span className="hidden text-sm font-semibold tracking-tight text-ink sm:inline">
            City Complaint
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="ml-4 hidden flex-1 items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-surface-2 text-ink"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {!initialized ? (
            <div className="h-9 w-24 animate-skeleton rounded-md bg-surface-2" />
          ) : user ? (
            <>
              {/* Notifications */}
              <Link
                href="/dashboard/notifications"
                className="relative rounded-md border-2 border-border-strong bg-surface p-2 transition-colors hover:bg-surface-2"
                aria-label={`Notifications${
                  unread.data ? `, ${unread.data} unread` : ""
                }`}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />

                {Boolean(unread.data) && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-surface bg-danger px-1 text-[9px] font-bold text-surface">
                    {unread.data! > 9 ? "9+" : unread.data}
                  </span>
                )}
              </Link>

              <UserMenu
                name={user.name}
                email={user.email}
                role={user.role}
                avatar={user.avatar}
                onLogout={() => void logout()}
              />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="ml-auto rounded-md border-2 border-border-strong bg-surface p-2 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-surface lg:hidden"
        >
          <nav
            aria-label="Mobile primary"
            className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6"
          >
            {PUBLIC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium",
                  isActive(link.href)
                    ? "bg-surface-2 text-ink"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {!initialized ? (
                <div className="h-10 w-full animate-skeleton rounded-md bg-surface-2" />
              ) : user ? (
                <>
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button
                      variant="outline"
                      fullWidth
                      size="sm"
                      leftIcon={<Bell className="h-4 w-4" />}
                    >
                      Notifications
                      {Boolean(unread.data) && (
                        <span className="ml-1 rounded-full bg-danger px-1.5 py-0.5 text-[9px] font-bold text-surface">
                          {unread.data! > 9 ? "9+" : unread.data}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link
                    href={ROLE_HOME[user.role]}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button
                      variant="outline"
                      fullWidth
                      size="sm"
                    >
                      <LayoutDashboard
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                      Go to dashboard
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      void logout();
                    }}
                    leftIcon={<LogOut className="h-4 w-4" />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="outline" fullWidth size="sm">
                      Login
                    </Button>
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button fullWidth size="sm">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

interface UserMenuProps {
  name: string;
  email: string;
  role: "CITIZEN" | "AGENT" | "ADMIN";
  avatar: string | null;
  onLogout: () => void;
}

function UserMenu({
  name,
  email,
  role,
  avatar,
  onLogout,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const home = ROLE_HOME[role];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md border-2 border-border-strong bg-surface px-2 py-1.5 text-sm transition-colors hover:bg-surface-2"
      >
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="h-6 w-6 rounded-full border border-border object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/30 text-[10px] font-semibold text-ink">
            {initials(name)}
          </span>
        )}

        <span className="max-w-24 truncate font-medium text-ink">
          {name}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-[4px_4px_0_0_var(--color-ink)]"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-semibold text-ink">
                {name}
              </p>

              <p className="truncate text-xs text-ink-muted">
                {email}
              </p>

              <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-border-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                {role === "ADMIN" ? (
                  <Shield className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <UserIcon className="h-3 w-3" aria-hidden="true" />
                )}
                {role}
              </p>
            </div>

            <Link
              href={home}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-surface-2"
            >
              <LayoutDashboard
                className="h-4 w-4"
                aria-hidden="true"
              />
              My dashboard
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-left text-sm text-danger hover:bg-danger-bg/50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

