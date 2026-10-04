/**
 * Shared constants mirrored from the backend Prisma enums and role scoping.
 * Keep these in sync with `prisma/schema/enums.prisma` when it changes.
 */

import type {
  AuthProvider,
  ComplaintStatus,
  NotificationType,
  PaymentProvider,
  PaymentPurpose,
  PaymentStatus,
  Priority,
  Role,
  ServiceRequestStatus,
  UserStatus,
} from "@/lib/api/types";

// ============================================================
// Roles
// ============================================================

export const ROLES: readonly Role[] = ["CITIZEN", "AGENT", "ADMIN"] as const;

export const ROLE_LABELS: Record<Role, string> = {
  CITIZEN: "Citizen",
  AGENT: "Agent",
  ADMIN: "Admin",
};

/** Maps a role to its role-specific dashboard root path. */
export const ROLE_HOME: Record<Role, string> = {
  CITIZEN: "/dashboard",
  AGENT: "/provider",
  ADMIN: "/admin",
};

// ============================================================
// Complaint
// ============================================================

export const COMPLAINT_STATUSES: readonly ComplaintStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "REJECTED",
] as const;

export const PRIORITIES: readonly Priority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

/** The single linear progression for display purposes (excludes REJECTED). */
export const COMPLAINT_STATUS_FLOW: readonly ComplaintStatus[] = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;

// ============================================================
// Service Request
// ============================================================

export const SERVICE_REQUEST_STATUSES: readonly ServiceRequestStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;

export const SERVICE_REQUEST_STATUS_FLOW: readonly ServiceRequestStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "IN_REVIEW",
  "APPROVED",
  "COMPLETED",
] as const;

// ============================================================
// Payment
// ============================================================

export const PAYMENT_STATUSES: readonly PaymentStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
] as const;

export const PAYMENT_PURPOSES: readonly PaymentPurpose[] = [
  "SERVICE_REQUEST",
  "COMPLAINT_EXPEDITE",
] as const;

export const PAYMENT_PROVIDERS: readonly PaymentProvider[] = [
  "STRIPE",
  "SSLCOMMERZ",
  "BKASH",
] as const;

// ============================================================
// User / Auth
// ============================================================

export const USER_STATUSES: readonly UserStatus[] = ["ACTIVE", "BANNED"] as const;

export const AUTH_PROVIDERS: readonly AuthProvider[] = ["LOCAL", "GOOGLE"] as const;

// ============================================================
// Notification
// ============================================================

export const NOTIFICATION_TYPES: readonly NotificationType[] = [
  "COMPLAINT",
  "SERVICE",
  "PAYMENT",
  "SYSTEM",
] as const;

// ============================================================
// Pagination defaults (mirror backend getPagination)
// ============================================================

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// ============================================================
// Notification polling interval (backend has no WebSocket)
// ============================================================

export const NOTIFICATIONS_POLL_MS = 60_000;