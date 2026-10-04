"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useChangeComplaintStatus } from "@/hooks/useComplaints";
import { humanizeEnum } from "@/lib/utils/format";
import type { Complaint, ComplaintStatus } from "@/lib/api/types";

/**
 * Mirrors the backend's STATUS_TRANSITIONS and AGENT_ALLOWED_STATUSES so the
 * UI only offers transitions the API will accept.
 *
 * Source of truth: backend `complaint.service.ts`.
 */
const STATUS_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  PENDING: ["ASSIGNED", "REJECTED", "CLOSED"],
  ASSIGNED: ["IN_PROGRESS", "REJECTED", "CLOSED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED", "CLOSED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  REJECTED: ["CLOSED"],
  CLOSED: [],
};

const AGENT_ALLOWED_STATUSES: ComplaintStatus[] = [
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
];

const statusSchema = z.object({
  status: z.enum([
    "IN_PROGRESS",
    "RESOLVED",
    "REJECTED",
    "ASSIGNED",
    "CLOSED",
  ]),
  note: z.string().max(1000, "Note is too long").optional().or(z.literal("")),
});

type StatusFormValues = z.infer<typeof statusSchema>;

export interface AgentComplaintStatusFormProps {
  complaint: Complaint;
}

export function AgentComplaintStatusForm({
  complaint,
}: AgentComplaintStatusFormProps) {
  const [open, setOpen] = useState(false);
  const mutation = useChangeComplaintStatus();

  // The exact set the backend will accept for this complaint right now.
  const allowed = STATUS_TRANSITIONS[complaint.status].filter((s) =>
    AGENT_ALLOWED_STATUSES.includes(s),
  );

  const options: SelectOption[] = allowed.map((s) => ({
    value: s,
    label: humanizeEnum(s),
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: (allowed[0] ?? "IN_PROGRESS") as StatusFormValues["status"],
      note: "",
    },
  });

  if (allowed.length === 0) {
    return (
      <Button variant="outline" disabled>
        No transitions available
      </Button>
    );
  }

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      {
        id: complaint.id,
        input: { status: values.status, note: values.note || undefined },
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Update status
      </Button>

      <Modal
        open={open}
        onClose={() => !mutation.isPending && setOpen(false)}
        title="Update complaint status"
        description={`Current status: ${humanizeEnum(complaint.status)}`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="agent-status-form"
              isLoading={mutation.isPending}
            >
              Save
            </Button>
          </>
        }
      >
        <form
          id="agent-status-form"
          onSubmit={onSubmit}
          className="space-y-4"
          noValidate
        >
          <Select
            label="New status"
            required
            options={options}
            error={errors.status?.message}
            {...register("status")}
          />
          <Textarea
            label="Note (optional)"
            rows={4}
            placeholder="Add context to the timeline"
            error={errors.note?.message}
            {...register("note")}
          />
        </form>
      </Modal>
    </>
  );
}