"use client";

import { useState } from "react";
import { Briefcase, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/lib/constants/demo";
import type { LoginInput } from "@/lib/api/types";
import type { Role } from "@/lib/api/types";

const ICONS: Record<Role, React.ReactNode> = {
  ADMIN: <Shield className="h-4 w-4" aria-hidden="true" />,
  AGENT: <Briefcase className="h-4 w-4" aria-hidden="true" />,
  CITIZEN: <UserIcon className="h-4 w-4" aria-hidden="true" />,
};

const DESCRIPTIONS: Record<Role, string> = {
  ADMIN: "Manage users, services, analytics",
  AGENT: "Handle assigned complaints & requests",
  CITIZEN: "File complaints, request services",
};

export interface DemoLoginGridProps {
  onSubmit: (credentials: LoginInput) => void;
  isPending: boolean;
  /** Which demo account is currently loading, if any. */
  activeRole: Role | null;
  onActiveRoleChange: (role: Role | null) => void;
}

export function DemoLoginGrid({
  onSubmit,
  isPending,
  activeRole,
  onActiveRoleChange,
}: DemoLoginGridProps) {
  const handleClick = (account: DemoAccount) => {
    onActiveRoleChange(account.role);
    onSubmit({ email: account.email, password: account.password });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          or
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>

      <div>
        <p className="mb-2 text-center text-sm font-semibold text-ink">
          🚀 Quick Demo Login
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DEMO_ACCOUNTS.filter((a) => a.role !== "AGENT").map((account) => (
            <button
              key={account.role}
              type="button"
              disabled={isPending}
              onClick={() => handleClick(account)}
              className="group flex flex-col items-center gap-1.5 rounded-md border-2 border-border-strong bg-surface px-3 py-3 text-center transition-all hover:border-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/25 text-ink transition-transform group-hover:scale-105">
                {activeRole === account.role && isPending ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  ICONS[account.role]
                )}
              </span>
              <span className="text-xs font-semibold text-ink">
                {account.label}
              </span>
              <span className="line-clamp-2 text-[10px] leading-tight text-ink-muted">
                {DESCRIPTIONS[account.role]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-2.5">
          {DEMO_ACCOUNTS.filter((a) => a.role === "AGENT").map((account) => (
            <button
              key={account.role}
              type="button"
              disabled={isPending}
              onClick={() => handleClick(account)}
              className="group flex w-full items-center gap-3 rounded-md border-2 border-border-strong bg-surface px-4 py-3 text-left transition-all hover:border-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/25 text-ink transition-transform group-hover:scale-105">
                {activeRole === account.role && isPending ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  ICONS[account.role]
                )}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-xs font-semibold text-ink">
                  {account.label}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {DESCRIPTIONS[account.role]}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}