"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CreditCard,
  FileWarning,
  LayoutDashboard,
  ListChecks,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";
import type { Role } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { ROLES } from "@/lib/utils/constants";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const ITEMS: Record<Role, readonly NavItem[]> = {
  CITIZEN: [
    {
      href: "/dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/dashboard/complaints",
      label: "My Complaints",
      icon: <FileWarning className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/dashboard/service-requests",
      label: "Service Requests",
      icon: <ListChecks className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/dashboard/payments",
      label: "Payments",
      icon: <CreditCard className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: <UserIcon className="h-4 w-4" aria-hidden="true" />,
    },
  ],
  AGENT: [
    {
      href: "/provider",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/provider/complaints",
      label: "Assigned Complaints",
      icon: <FileWarning className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/provider/service-requests",
      label: "Assigned Requests",
      icon: <ListChecks className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/provider/profile",
      label: "Profile",
      icon: <UserIcon className="h-4 w-4" aria-hidden="true" />,
    },
  ],
  ADMIN: [
    {
      href: "/admin",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <UserIcon className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: <FileWarning className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/admin/services",
      label: "Services",
      icon: <ListChecks className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/admin/complaints",
      label: "Complaints",
      icon: <FileWarning className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/admin/service-requests",
      label: "Service Requests",
      icon: <ListChecks className="h-4 w-4" aria-hidden="true" />,
    },
    {
      href: "/admin/reports",
      label: "Reports",
      icon: <CreditCard className="h-4 w-4" aria-hidden="true" />,
    },
  ],
};

void ROLES; // keep enum import used

export interface SidebarProps {
  scope: Role;
}

export function Sidebar({ scope }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = ITEMS[scope];

  const isActive = (href: string) => {
    // Exact match for the root of the scope (e.g. /dashboard, /admin)
    const root = items[0]?.href ?? "";
    if (href === root) return pathname === root;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-surface shadow-[4px_4px_0_0_var(--color-ink)] lg:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="dashboard-nav"
      >
        {mobileOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        id="dashboard-nav"
        className={cn(
          "w-60 shrink-0 rounded-lg border-2 border-border bg-surface p-3 shadow-[4px_4px_0_0_var(--color-border-strong)]",
          "lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto",
          mobileOpen
            ? "fixed inset-x-4 bottom-4 top-20 z-20 max-h-none overflow-y-auto"
            : "hidden lg:block",
        )}
      >
        <nav aria-label="Dashboard" className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-ink text-surface"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}