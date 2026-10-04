import { MessageSquare, User as UserIcon } from "lucide-react";
import type { ComplaintUpdate } from "@/lib/api/types";
import { formatRelative, humanizeEnum, initials } from "@/lib/utils/format";
import { EmptyState } from "@/components/ui/EmptyState";

export interface ComplaintTimelineProps {
  updates: ComplaintUpdate[];
}

export function ComplaintTimeline({ updates }: ComplaintTimelineProps) {
  if (updates.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-6 w-6" aria-hidden="true" />}
        title="No updates yet"
        description="Updates from agents and admins will appear here."
      />
    );
  }

  return (
    <ol className="relative space-y-4 border-l-2 border-border pl-6">
      {updates.map((update) => (
        <li key={update.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[31px] top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-border-strong bg-surface"
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>

          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              {update.author ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/30 text-[9px] font-semibold text-ink">
                    {initials(update.author.name)}
                  </span>
                  {update.author.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <UserIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  System
                </span>
              )}
              {update.fromStatus && update.toStatus && (
                <span className="rounded-full border border-border-strong px-2 py-0.5">
                  {humanizeEnum(update.fromStatus)} →{" "}
                  {humanizeEnum(update.toStatus)}
                </span>
              )}
              <span className="ml-auto">
                {formatRelative(update.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {update.note}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}