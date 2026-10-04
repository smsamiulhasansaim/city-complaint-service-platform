"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useAssignServiceRequest } from "@/hooks/useServiceRequests";
import { useUsers } from "@/hooks/useUsers";

const schema = z.object({
  agentId: z.string().uuid("Choose an agent"),
});

type FormValues = z.infer<typeof schema>;

export interface AssignServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  requestId: string;
  currentAgentId: string | null;
}

export function AssignServiceRequestModal({
  open,
  onClose,
  requestId,
  currentAgentId,
}: AssignServiceRequestModalProps) {
  const assign = useAssignServiceRequest();
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
      { id: requestId, input: { agentId: values.agentId } },
      { onSuccess: () => onClose() },
    );
  });

  return (
    <Modal
      open={open}
      onClose={() => !assign.isPending && onClose()}
      title="Assign service request"
      description="Choose an active agent to review this request."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={assign.isPending}>
            Cancel
          </Button>
          <Button type="submit" form="assign-sr-form" isLoading={assign.isPending}>
            Assign
          </Button>
        </>
      }
    >
      <form id="assign-sr-form" onSubmit={onSubmit} className="space-y-4" noValidate>
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