"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAddComplaintUpdate } from "@/hooks/useComplaints";
import {
  addComplaintUpdateSchema,
  type AddComplaintUpdateValues,
} from "@/lib/validations/complaint.schema";

export interface AddUpdateFormProps {
  complaintId: string;
}

export function AddUpdateForm({ complaintId }: AddUpdateFormProps) {
  const addUpdate = useAddComplaintUpdate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddComplaintUpdateValues>({
    resolver: zodResolver(addComplaintUpdateSchema),
    defaultValues: { note: "" },
  });

  const onSubmit = handleSubmit((values) => {
    addUpdate.mutate(
      { id: complaintId, input: values },
      { onSuccess: () => reset() },
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <Textarea
        rows={3}
        placeholder="Add a comment to the timeline…"
        error={errors.note?.message}
        {...register("note")}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          isLoading={addUpdate.isPending}
          leftIcon={<Send className="h-3.5 w-3.5" />}
        >
          Post update
        </Button>
      </div>
    </form>
  );
}