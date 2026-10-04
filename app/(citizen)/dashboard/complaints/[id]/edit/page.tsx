"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { useComplaint, useUpdateComplaint } from "@/hooks/useComplaints";
import { useCategories } from "@/hooks/useCategories";
import { PRIORITIES } from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";
import {
  complaintWizardSchema,
  type ComplaintWizardValues,
} from "@/lib/validations/complaint.schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

const priorityOptions: SelectOption[] = PRIORITIES.map((p) => ({
  value: p,
  label: humanizeEnum(p),
}));

export default function EditComplaintPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const complaint = useComplaint(id);
  const update = useUpdateComplaint();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintWizardValues>({
    resolver: zodResolver(complaintWizardSchema),
    defaultValues: {
      categoryId: "",
      title: "",
      priority: "MEDIUM",
      description: "",
      ward: "",
      address: "",
    },
  });

  useEffect(() => {
    if (complaint.data) {
      reset({
        categoryId: complaint.data.categoryId,
        title: complaint.data.title,
        priority: complaint.data.priority,
        description: complaint.data.description,
        ward: complaint.data.ward ?? "",
        address: complaint.data.address ?? "",
      });
    }
  }, [complaint.data, reset]);

  if (complaint.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (complaint.isError || !complaint.data) {
    return (
      <ErrorState
        title="Complaint not found"
        onRetry={() => void complaint.refetch()}
      />
    );
  }

  if (complaint.data.status !== "PENDING") {
    return (
      <ErrorState
        title="Cannot edit"
        message="Only complaints that are still PENDING can be edited."
      />
    );
  }

  const categoryOptions: SelectOption[] = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const onSubmit = handleSubmit((values) => {
    update.mutate(
      {
        id,
        input: {
          categoryId: values.categoryId,
          title: values.title,
          description: values.description,
          priority: values.priority,
          ward: values.ward || undefined,
          address: values.address || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Complaint updated");
          router.replace(`/dashboard/complaints/${id}`);
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/complaints/${id}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to complaint
      </Link>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Edit complaint
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Only complaints that are still PENDING can be edited.
        </p>
      </header>

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Select
              label="Category"
              required
              options={categoryOptions}
              error={errors.categoryId?.message}
              {...register("categoryId")}
            />
            <Input
              label="Title"
              required
              error={errors.title?.message}
              {...register("title")}
            />
            <Select
              label="Priority"
              required
              options={priorityOptions}
              error={errors.priority?.message}
              {...register("priority")}
            />
            <Textarea
              label="Description"
              required
              rows={6}
              error={errors.description?.message}
              {...register("description")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Ward"
                error={errors.ward?.message}
                {...register("ward")}
              />
              <Input
                label="Address"
                error={errors.address?.message}
                {...register("address")}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Link href={`/dashboard/complaints/${id}`}>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                isLoading={isSubmitting || update.isPending}
              >
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}