"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { SERVICE_REQUEST_STATUSES } from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";
import type { ServiceRequestStatus } from "@/lib/api/types";

const statusOptions: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...SERVICE_REQUEST_STATUSES.map((s) => ({
    value: s,
    label: humanizeEnum(s),
  })),
];

const sortOptions: SelectOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export interface ServiceRequestFiltersValue {
  status?: ServiceRequestStatus;
  sort?: "newest" | "oldest";
}

export interface ServiceRequestFiltersProps {
  value: ServiceRequestFiltersValue;
  onChange: (patch: Partial<ServiceRequestFiltersValue>) => void;
  onReset: () => void;
}

export function ServiceRequestFilters({
  value,
  onChange,
  onReset,
}: ServiceRequestFiltersProps) {
  const hasFilters = Boolean(
    value.status || (value.sort && value.sort !== "newest"),
  );

  return (
    <div className="space-y-3 rounded-lg border-2 border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          aria-label="Status"
          value={value.status ?? ""}
          onChange={(e) =>
            onChange({
              status: (e.target.value || undefined) as
                | ServiceRequestStatus
                | undefined,
            })
          }
          options={statusOptions}
        />
        <Select
          aria-label="Sort"
          value={value.sort ?? "newest"}
          onChange={(e) =>
            onChange({ sort: e.target.value as "newest" | "oldest" })
          }
          options={sortOptions}
        />
      </div>

      {hasFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<X className="h-3.5 w-3.5" />}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}