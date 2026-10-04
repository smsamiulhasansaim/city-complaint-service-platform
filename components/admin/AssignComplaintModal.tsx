"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useAssignComplaint } from "@/hooks/useComplaints";
import { useUsers } from "@/hooks/useUsers";

const schema = z.object({
  agentId: z.string().uuid("Choose an agent"),
});

type FormValues = z.infer<typeof schema>;

export interface AssignComplaintModalProps {
  open: boolean;
  onClose: () => void;
  complaintId: string;
  currentAgentId: string | null;
}

export function AssignComplaintModal({
  open,
  onClose,
  complaintId,
  currentAgentId,
}: AssignComplaintModalProps) {
  const assign = useAssignComplaint();
  const { data } = useUsers({ role: "AGENT", status: "ACTIVE", limit: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { agentId: currentAgentId ?? "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ agentId: currentAgentId ?? "" });
  }, [open, currentAgentId, reset]);

  const options: SelectOption[] =
    data?.items.map((u) => ({
      value: u.id,
      label: `${u.name}${u.ward ? ` · ${u.ward}` : ""}`,
    })) ?? [];

  const onSubmit = handleSubmit((values) => {
    assign.mutate(
      { id: complaintId, input: { agentId: values.agentId } },
      { onSuccess: () => onClose() },
    );
  });

  return (
    <Modal
      open={open}
      onClose={() => !assign.isPending && onClose()}
      title="Assign complaint"
      description="Pick an active agent to handle this complaint."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={assign.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="assign-form"
            isLoading={assign.isPending}
          >
            Assign
          </Button>
        </>
      }
    >
      <form id="assign-form" onSubmit={onSubmit} className="space-y-4" noValidate>
        <Select
          label="Agent"
          required
          placeholder="Select an agent"
          options={options}
          error={errors.agentId?.message}
          {...register("agentId")}
        />
      </form>
    </Modal>
  );
}