import { CheckCircle2, Circle } from "lucide-react";
import type { ServiceRequestStatus } from "@/lib/api/types";
import { SERVICE_REQUEST_STATUS_FLOW } from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export interface ServiceRequestTimelineProps {
  current: ServiceRequestStatus;
}

export function ServiceRequestTimeline({
  current,
}: ServiceRequestTimelineProps) {
  const isRejected = current === "REJECTED";
  const flow: readonly ServiceRequestStatus[] = SERVICE_REQUEST_STATUS_FLOW;
  const currentIndex = flow.indexOf(current);

  return (
    <ol className="space-y-3">
      {flow.map((status, idx) => {
        const done = !isRejected && idx < currentIndex;
        const active = !isRejected && idx === currentIndex;
        return (
          <li key={status} className="flex items-center gap-3">
            {done || active ? (
              <CheckCircle2
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-accent" : "text-success",
                )}
                aria-hidden="true"
              />
            ) : (
              <Circle
                className="h-5 w-5 shrink-0 text-border-strong"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "text-sm",
                active
                  ? "font-semibold text-ink"
                  : done
                    ? "text-ink"
                    : "text-ink-muted",
              )}
            >
              {humanizeEnum(status)}
              {active && (
                <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-ink">
                  current
                </span>
              )}
            </span>
          </li>
        );
      })}
      {isRejected && (
        <li className="flex items-center gap-3">
          <CheckCircle2
            className="h-5 w-5 shrink-0 text-danger"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-danger">
            Rejected
            <span className="ml-2 rounded-full bg-danger-bg px-2 py-0.5 text-[10px] font-medium text-danger">
              current
            </span>
          </span>
        </li>
      )}
    </ol>
  );
}