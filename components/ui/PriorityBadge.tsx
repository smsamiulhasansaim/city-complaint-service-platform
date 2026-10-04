import type { Priority } from "@/lib/api/types";
import { humanizeEnum } from "@/lib/utils/format";
import { Badge, type BadgeTone } from "./Badge";

const PRIORITY_TONE: Record<Priority, BadgeTone> = {
  LOW: "neutral",
  MEDIUM: "accent",
  HIGH: "warning",
  URGENT: "danger",
};

export interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <Badge tone={PRIORITY_TONE[priority]}>{humanizeEnum(priority)}</Badge>;
}