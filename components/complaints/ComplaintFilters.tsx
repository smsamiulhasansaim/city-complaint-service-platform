"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select, type SelectOption } from "@/components/ui/Select";
import {
  COMPLAINT_STATUSES,
  PRIORITIES,
} from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";
import { useCategories } from "@/hooks/useCategories";
import type { ComplaintStatus, Priority } from "@/lib/api/types";

const statusOptions: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...COMPLAINT_STATUSES.map((s) => ({ value: s, label: humanizeEnum(s) })),
];

const priorityOptions: SelectOption[] = [
  { value: "", label: "All priorities" },
  ...PRIORITIES.map((p) => ({ value: p, label: humanizeEnum(p) })),
];

const sortOptions: SelectOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export interface ComplaintFiltersValue {
  status?: ComplaintStatus;
  priority?: Priority;
  categoryId?: string;
  search?: string;
  sort?: "newest" | "oldest";
}

export interface ComplaintFiltersProps {
  value: ComplaintFiltersValue;
  onChange: (patch: Partial<ComplaintFiltersValue>) => void;
  onReset: () => void;
}

export function ComplaintFilters({
  value,
  onChange,
  onReset,
}: ComplaintFiltersProps) {
  const { data: categories } = useCategories();

  const categoryOptions: SelectOption[] = [
    { value: "", label: "All categories" },
    ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];

  const hasFilters = Boolean(
    value.status ||
      value.priority ||
      value.categoryId ||
      value.search ||
      (value.sort && value.sort !== "newest"),
  );

  return (
    <div className="space-y-3 rounded-lg border-2 border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchInput
          value={value.search ?? ""}
          onChange={(search) => onChange({ search: search || undefined })}
          placeholder="Search title or description"
        />
        <Select
          aria-label="Status"
          value={value.status ?? ""}
          onChange={(e) =>
            onChange({
              status: (e.target.value || undefined) as ComplaintStatus | undefined,
            })
          }
          options={statusOptions}
        />
        <Select
          aria-label="Priority"
          value={value.priority ?? ""}
          onChange={(e) =>
            onChange({
              priority: (e.target.value || undefined) as Priority | undefined,
            })
          }
          options={priorityOptions}
        />
        <Select
          aria-label="Category"
          value={value.categoryId ?? ""}
          onChange={(e) =>
            onChange({ categoryId: e.target.value || undefined })
          }
          options={categoryOptions}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          aria-label="Sort"
          value={value.sort ?? "newest"}
          onChange={(e) =>
            onChange({
              sort: e.target.value as "newest" | "oldest",
            })
          }
          options={sortOptions}
          className="w-40"
        />
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<X className="h-3.5 w-3.5" />}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}