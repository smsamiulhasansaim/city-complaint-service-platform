/**
 * Fully typed mirror of the backend API contract.
 *
 * Notes:
 * - Prisma `Decimal(10,2)` columns (Payment.amount, Service.fee) serialize to
 *   JSON as strings. They are typed as `string` here to avoid precision loss.
 * - Dates are ISO 8601 strings over the wire (Prisma DateTime → JSON string).
 * - Envelopes match backend `sendSuccess` / `errorHandler`.
 * - Enums mirror `prisma/schema/enums.prisma` exactly.
 */

// ============================================================
// Enums
// ============================================================

export type Role = "CITIZEN" | "AGENT" | "ADMIN";

export type UserStatus = "ACTIVE" | "BANNED";

export type AuthProvider = "LOCAL" | "GOOGLE";

export type ComplaintStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type ServiceRequestStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export type PaymentProvider = "STRIPE" | "SSLCOMMERZ" | "BKASH";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type PaymentPurpose = "SERVICE_REQUEST" | "COMPLAINT_EXPEDITE";

export type NotificationType = "COMPLAINT" | "SERVICE" | "PAYMENT" | "SYSTEM";

// ============================================================
// Primitive aliases
// ============================================================

/** Prisma Decimal(10,2) over the wire. Never coerce for math. */
export type Decimal = string;

/** ISO 8601 date string. */
export type IsoDate = string;

// ============================================================
// Response envelope
// ============================================================

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  /** Present on notifications list only. */
  unreadCount?: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors: unknown[];
}

// ============================================================
// User
// ============================================================

/** Matches backend `userSelect` — safe public projection. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone: string | null;
  address: string | null;
  ward: string | null;
  avatar: string | null;
  authProvider: AuthProvider;
  createdAt: IsoDate;
  updatedAt: IsoDate;
}

/** Matches backend `publicUserSelect` — minimal projection in lists. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  ward: string | null;
}

// ============================================================
// Category
// ============================================================

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: IsoDate;
  updatedAt: IsoDate;
}

// ============================================================
// Service
// ============================================================

export interface Service {
  id: string;
  name: string;
  description: string;
  fee: Decimal;
  isActive: boolean;
  createdAt: IsoDate;
  updatedAt: IsoDate;
}

// ============================================================
// Complaint
// ============================================================

export interface ComplaintUpdate {
  id: string;
  fromStatus: ComplaintStatus | null;
  toStatus: ComplaintStatus | null;
  note: string;
  createdAt: IsoDate;
  complaintId: string;
  authorId: string;
  author?: PublicUser;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: IsoDate;
  citizenId: string;
  complaintId: string;
  citizen?: PublicUser;
  complaint?: {
    id: string;
    title: string;
    status: ComplaintStatus;
  };
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  ward: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  priority: Priority;
  status: ComplaintStatus;
  isExpedited: boolean;
  resolvedAt: IsoDate | null;
  createdAt: IsoDate;
  updatedAt: IsoDate;
  citizenId: string;
  assignedAgentId: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  citizen?: PublicUser;
  assignedAgent?: PublicUser | null;
  review?: Review | null;
  _count?: {
    updates: number;
  };
}

// ============================================================
// Service Request
// ============================================================

export interface ServiceRequest {
  id: string;
  status: ServiceRequestStatus;
  details: string | null;
  createdAt: IsoDate;
  updatedAt: IsoDate;
  serviceId: string;
  citizenId: string;
  assignedAgentId: string | null;
  service?: {
    id: string;
    name: string;
    fee: Decimal;
    isActive: boolean;
  };
  citizen?: PublicUser;
  assignedAgent?: PublicUser | null;
  payment?: PaymentSummary | null;
}

export interface PaymentSummary {
  id: string;
  status: PaymentStatus;
  amount: Decimal;
  transactionId: string;
  paidAt: IsoDate | null;
}

// ============================================================
// Payment
// ============================================================

export interface Payment {
  id: string;
  transactionId: string;
  amount: Decimal;
  currency: string;
  method: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  purpose: PaymentPurpose;
  paidAt: IsoDate | null;
  createdAt: IsoDate;
  updatedAt: IsoDate;
  payerId: string;
  serviceRequestId: string | null;
  complaintId: string | null;
  payer?: PublicUser;
  serviceRequest?: {
    id: string;
    status: ServiceRequestStatus;
  } | null;
  complaint?: {
    id: string;
    title: string;
    status: ComplaintStatus;
  } | null;
}

export interface CheckoutSession {
  checkoutUrl: string;
  sessionId: string;
  payment: Payment;
}

export interface ConfirmPaymentResult {
  payment: Payment;
  alreadyConfirmed: boolean;
}

// ============================================================
// Notification
// ============================================================

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: IsoDate;
  userId: string;
}

// ============================================================
// Dashboard
// ============================================================

export interface AdminDashboardData {
  users: {
    total: number;
    byRole: Partial<Record<Role, number>>;
  };
  complaints: {
    total: number;
    byStatus: Partial<Record<ComplaintStatus, number>>;
    byPriority: Partial<Record<Priority, number>>;
  };
  serviceRequests: {
    total: number;
    byStatus: Partial<Record<ServiceRequestStatus, number>>;
  };
  revenue: {
    currency: string;
    totalCollected: number;
    paidCount: number;
  };
  recentComplaints: Complaint[];
}

export interface AgentDashboardData {
  complaints: {
    totalAssigned: number;
    resolved: number;
    byStatus: Partial<Record<ComplaintStatus, number>>;
  };
  serviceRequests: {
    totalAssigned: number;
    byStatus: Partial<Record<ServiceRequestStatus, number>>;
  };
}

export interface CitizenDashboardData {
  complaints: {
    total: number;
    byStatus: Partial<Record<ComplaintStatus, number>>;
  };
  serviceRequests: {
    total: number;
    byStatus: Partial<Record<ServiceRequestStatus, number>>;
  };
  totalSpent: number;
  unreadNotifications: number;
}

// ============================================================
// Auth
// ============================================================

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================================
// Request bodies
// ============================================================

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  ward?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleLoginInput {
  idToken: string;
}

export interface UpdateMeInput {
  name?: string;
  phone?: string;
  address?: string;
  ward?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface CreateAgentInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  ward?: string;
}

export interface UpdateRoleInput {
  role: Role;
}

export interface UpdateUserStatusInput {
  status: UserStatus;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CreateServiceInput {
  name: string;
  description: string;
  fee: number;
  isActive?: boolean;
}

export type UpdateServiceInput = Partial<CreateServiceInput>;

export interface CreateComplaintInput {
  title: string;
  description: string;
  categoryId: string;
  ward?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  priority?: Priority;
}

export type UpdateComplaintInput = Partial<CreateComplaintInput>;

export interface AssignInput {
  agentId: string;
}

export interface ComplaintStatusInput {
  status: ComplaintStatus;
  note?: string;
}

export interface AddComplaintUpdateInput {
  note: string;
}

export interface CreateServiceRequestInput {
  serviceId: string;
  details?: string;
}

export interface ServiceRequestStatusInput {
  status: ServiceRequestStatus;
  note?: string;
}

export interface ConfirmPaymentInput {
  sessionId: string;
}

export interface CreateReviewInput {
  complaintId: string;
  rating: number;
  comment: string;
}

// ============================================================
// List query params
// ============================================================

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ListComplaintsQuery extends PaginationQuery {
  status?: ComplaintStatus;
  categoryId?: string;
  priority?: Priority;
  ward?: string;
  search?: string;
  sort?: "newest" | "oldest";
}

export interface ListServiceRequestsQuery extends PaginationQuery {
  status?: ServiceRequestStatus;
  serviceId?: string;
  sort?: "newest" | "oldest";
}

export interface ListUsersQuery extends PaginationQuery {
  role?: Role;
  status?: UserStatus;
  search?: string;
}

export interface ListPaymentsQuery extends PaginationQuery {
  status?: PaymentStatus;
  purpose?: PaymentPurpose;
}

export interface ListNotificationsQuery extends PaginationQuery {
  isRead?: boolean;
}

// ============================================================
// List responses
// ============================================================

export interface Paginated<T> {
  items: T[];
  meta: ApiMeta;
}

export interface ComplaintsListResult {
  complaints: Complaint[];
  total: number;
}

export interface ServiceRequestsListResult {
  requests: ServiceRequest[];
  total: number;
}

export interface UsersListResult {
  users: User[];
  total: number;
}

export interface PaymentsListResult {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface NotificationsListResult {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}