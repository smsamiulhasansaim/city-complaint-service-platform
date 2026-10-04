import type { ComplaintStatus, PaymentStatus, ServiceRequestStatus } from "@/lib/api/types";
import { humanizeEnum } from "@/lib/utils/format";
import { Badge, type BadgeTone } from "./Badge";

const COMPLAINT_TONE: Record<ComplaintStatus, BadgeTone> = {
  PENDING: "warning",
  ASSIGNED: "accent",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CLOSED: "neutral",
  REJECTED: "danger",
};

const SERVICE_REQUEST_TONE: Record<ServiceRequestStatus, BadgeTone> = {
  PENDING_PAYMENT: "warning",
  PAID: "accent",
  IN_REVIEW: "info",
  APPROVED: "success",
  REJECTED: "danger",
  COMPLETED: "success",
};

const PAYMENT_TONE: Record<PaymentStatus, BadgeTone> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "danger",
  REFUNDED: "neutral",
};

interface ComplaintStatusBadgeProps {
  status: ComplaintStatus;
}
export function ComplaintStatusBadge({ status }: ComplaintStatusBadgeProps) {
  return (
    <Badge tone={COMPLAINT_TONE[status]} dot>
      {humanizeEnum(status)}
    </Badge>
  );
}

interface ServiceRequestStatusBadgeProps {
  status: ServiceRequestStatus;
}
export function ServiceRequestStatusBadge({
  status,
}: ServiceRequestStatusBadgeProps) {
  return (
    <Badge tone={SERVICE_REQUEST_TONE[status]} dot>
      {humanizeEnum(status)}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}
export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <Badge tone={PAYMENT_TONE[status]} dot>
      {humanizeEnum(status)}
    </Badge>
  );
}