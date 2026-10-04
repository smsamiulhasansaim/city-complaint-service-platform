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
import { useChangeServiceRequestStatus } from "@/hooks/useServiceRequests";
import { humanizeEnum } from "@/lib/utils/format";
import type {
  ServiceRequest,
  ServiceRequestStatus,
} from "@/lib/api/types";

/** Agent allowed statuses (mirrors backend). */
const AGENT_ALLOWED: ServiceRequestStatus[] = [
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const statusSchema = z.object({
  status: z.enum(["IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"]),
  note: z.string().max(1000, "Note is too long").optional().or(z.literal("")),
});

type StatusFormValues = z.infer<typeof statusSchema>;

export interface AgentServiceRequestStatusFormProps {
  request: ServiceRequest;
}

export function AgentServiceRequestStatusForm({
  request,
}: AgentServiceRequestStatusFormProps) {
  const [open, setOpen] = useState(false);
  const mutation = useChangeServiceRequestStatus();

  const allowed = AGENT_ALLOWED.filter((s) => s !== request.status);

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
      status: (allowed[0] as StatusFormValues["status"] | undefined) ?? "IN_REVIEW",
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
        id: request.id,
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
        title="Update service request status"
        description={`Current status: ${humanizeEnum(request.status)}`}
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
              form="agent-sr-status-form"
              isLoading={mutation.isPending}
            >
              Save
            </Button>
          </>
        }
      >
        <form
          id="agent-sr-status-form"
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
            placeholder="Visible to the citizen"
            error={errors.note?.message}
            {...register("note")}
          />
        </form>
      </Modal>
    </>
  );
}