"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Select, type SelectOption } from "@/components/ui/Select";
import { useCreateService, useUpdateService } from "@/hooks/useServicesAdmin";
import type { Service } from "@/lib/api/types";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  description: z
    .string()
    .min(2, "Description is required")
    .max(1000, "Description is too long"),
  fee: z
    .number({ error: "Fee must be a number" })
    .nonnegative("Fee cannot be negative")
    .max(1_000_000, "Fee is too large"),
  isActive: z.enum(["true", "false"]),
});

type FormValues = z.infer<typeof schema>;

const activeOptions: SelectOption[] = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
}

export function ServiceFormModal({
  open,
  onClose,
  service,
}: ServiceFormModalProps) {
  const create = useCreateService();
  const update = useUpdateService();
  const isEdit = service !== null;
  const isPending = create.isPending || update.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      fee: 0,
      isActive: "true",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (service) {
      reset({
        name: service.name,
        description: service.description,
        fee: Number(service.fee),
        isActive: service.isActive ? "true" : "false",
      });
    } else {
      reset({ name: "", description: "", fee: 0, isActive: "true" });
    }
  }, [open, service, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = {
      name: values.name,
      description: values.description,
      fee: values.fee,
      isActive: values.isActive === "true",
    };
    if (isEdit && service) {
      update.mutate(
        { id: service.id, input: payload },
        { onSuccess: () => onClose() },
      );
    } else {
      create.mutate(payload, { onSuccess: () => onClose() });
    }
  });

  return (
    <Modal
      open={open}
      onClose={() => !isPending && onClose()}
      title={isEdit ? "Edit service" : "New service"}
      description={
        isEdit ? "Update this service's details." : "Add a new municipal service."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="service-form" isLoading={isPending}>
            {isEdit ? "Save changes" : "Create service"}
          </Button>
        </>
      }
    >
      <form id="service-form" onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <Textarea
          label="Description"
          required
          rows={4}
          error={errors.description?.message}
          {...register("description")}
        />
        <Input
          label="Fee (USD)"
          type="number"
          step="0.01"
          min="0"
          required
          error={errors.fee?.message}
          {...register("fee", { valueAsNumber: true })}
        />
        <Select
          label="Status"
          required
          options={activeOptions}
          error={errors.isActive?.message}
          {...register("isActive")}
        />
      </form>
    </Modal>
  );
}