import Link from "next/link";
import { CreditCard, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { ServiceRequestStatusBadge } from "@/components/ui/StatusBadge";
import type { ServiceRequest } from "@/lib/api/types";
import { formatCurrency, formatRelative } from "@/lib/utils/format";

export interface ServiceRequestCardProps {
  request: ServiceRequest;
}

export function ServiceRequestCard({ request }: ServiceRequestCardProps) {
  const isPaid = request.status !== "PENDING_PAYMENT";

  return (
    <Link
      href={`/dashboard/service-requests/${request.id}`}
      className="block"
    >
      <Card className="transition-all hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
              <FileText className="h-4 w-4 text-ink-muted" aria-hidden="true" />
              {request.service?.name ?? "Service request"}
            </h3>
            <ServiceRequestStatusBadge status={request.status} />
          </div>

          {request.details && (
            <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
              {request.details}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            {request.service?.fee && (
              <span className="inline-flex items-center gap-1">
                <CreditCard className="h-3 w-3" aria-hidden="true" />
                {formatCurrency(request.service.fee)}
              </span>
            )}
            {!isPaid && (
              <span className="rounded-full bg-warning-bg px-2 py-0.5 font-medium text-warning">
                Payment pending
              </span>
            )}
            <span className="ml-auto">{formatRelative(request.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}