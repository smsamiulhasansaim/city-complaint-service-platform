import Link from "next/link";
import { MapPin, MessageSquare, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { ComplaintStatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import type { Complaint } from "@/lib/api/types";
import { formatRelative, truncate } from "@/lib/utils/format";

export interface ComplaintCardProps {
  complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  return (
    <Link href={`/dashboard/complaints/${complaint.id}`} className="block">
      <Card className="transition-all hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]">
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-ink">
              {complaint.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              {complaint.isExpedited && (
                <span className="inline-flex items-center gap-1 rounded-full bg-danger-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-danger">
                  <Zap className="h-3 w-3" aria-hidden="true" />
                  Expedited
                </span>
              )}
              <ComplaintStatusBadge status={complaint.status} />
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
            {truncate(complaint.description, 200)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            {complaint.category && (
              <span className="rounded-full border border-border-strong px-2 py-0.5 font-medium">
                {complaint.category.name}
              </span>
            )}
            <PriorityBadge priority={complaint.priority} />
            {complaint.ward && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {complaint.ward}
              </span>
            )}
            {typeof complaint._count?.updates === "number" &&
              complaint._count.updates > 0 && (
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" aria-hidden="true" />
                  {complaint._count.updates}
                </span>
              )}
            <span className="ml-auto">{formatRelative(complaint.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}