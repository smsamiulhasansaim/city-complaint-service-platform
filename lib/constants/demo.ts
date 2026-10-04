/**
 * One-click demo login credentials, required by the project spec.
 * These are intentionally public, non-production accounts seeded on the
 * backend for evaluators. Never reuse these credentials in production.
 */

import type { Role } from "@/lib/api/types";

export interface DemoAccount {
  role: Role;
  label: string;
  email: string;
  password: string;
}

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    role: "ADMIN",
    label: "Admin",
    email: "admin@citycomplaint.com",
    password: "Admin@1234",
  },
  {
    role: "CITIZEN",
    label: "Citizen",
    email: "citizen1@example.com",
    password: "Citizen@1234",
  },
  {
    role: "AGENT",
    label: "Agent",
    email: "agent@citycomplaint.com",
    password: "Agent@1234",
  },
] as const;