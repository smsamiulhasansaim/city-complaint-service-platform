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
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategoriesAdmin";
import type { Category } from "@/lib/api/types";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional().or(z.literal("")),
  isActive: z.enum(["true", "false"]),
});

type FormValues = z.infer<typeof schema>;

const activeOptions: SelectOption[] = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

export function CategoryFormModal({
  open,
  onClose,
  category,
}: CategoryFormModalProps) {
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const isEdit = category !== null;
  const isPending = create.isPending || update.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", isActive: "true" },
  });

  useEffect(() => {
    if (!open) return;
    if (category) {
      reset({
        name: category.name,
        description: category.description ?? "",
        isActive: category.isActive ? "true" : "false",
      });
    } else {
      reset({ name: "", description: "", isActive: "true" });
    }
  }, [open, category, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      isActive: values.isActive === "true",
    };
    if (isEdit && category) {
      update.mutate(
        { id: category.id, input: payload },
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
      title={isEdit ? "Edit category" : "New category"}
      description={
        isEdit
          ? "Update the category details."
          : "Add a new complaint category."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-form"
            isLoading={isPending}
          >
            {isEdit ? "Save changes" : "Create category"}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <Textarea
          label="Description (optional)"
          rows={4}
          error={errors.description?.message}
          {...register("description")}
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