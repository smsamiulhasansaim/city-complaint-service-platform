"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { ImageUploader } from "./ImageUploader";
import {
  complaintWizardSchema,
  type ComplaintWizardValues,
} from "@/lib/validations/complaint.schema";
import { useCategories } from "@/hooks/useCategories";
import { useCreateComplaint } from "@/hooks/useComplaints";
import { cn } from "@/lib/utils/cn";
import { PRIORITIES } from "@/lib/utils/constants";
import { humanizeEnum } from "@/lib/utils/format";

interface StepDef {
  id: number;
  title: string;
  description: string;
  fields: (keyof ComplaintWizardValues)[];
}

const STEPS: readonly StepDef[] = [
  {
    id: 1,
    title: "Category & priority",
    description: "What is this about, and how urgent is it?",
    fields: ["categoryId", "title", "priority"],
  },
  {
    id: 2,
    title: "Description & location",
    description: "Describe the issue and where it is happening.",
    fields: ["description", "ward", "address"],
  },
  {
    id: 3,
    title: "Photos & review",
    description: "Add images (optional) and confirm the details.",
    fields: ["images"],
  },
] as const;

const priorityOptions: SelectOption[] = PRIORITIES.map((p) => ({
  value: p,
  label: humanizeEnum(p),
}));

export function ComplaintWizard() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createComplaint = useCreateComplaint();
  const [step, setStep] = useState(1);
  const [isSubmittingManually, setIsSubmittingManually] = useState(false);

  const categoryOptions: SelectOption[] = useMemo(
    () =>
      (categories ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categories],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintWizardValues>({
    resolver: zodResolver(complaintWizardSchema),
    mode: "onTouched",
    defaultValues: {
      categoryId: "",
      title: "",
      priority: "MEDIUM",
      description: "",
      ward: "",
      address: "",
      images: [],
    },
  });

  const values = watch();
  const currentStep = STEPS[step - 1];

  const goNext = async () => {
    const valid = await trigger(currentStep.fields);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  /**
   * Only invoked from the explicit "File complaint" button click handler.
   * The form element has no onSubmit handler; submitting is always manual.
   */
  const submitComplaint = handleSubmit(async (data) => {
    setIsSubmittingManually(true);
    try {
      const complaint = await createComplaint.mutateAsync({
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        ward: data.ward || undefined,
        address: data.address || undefined,
        images:
          data.images && data.images.length > 0 ? data.images : undefined,
      });
      toast.success("Complaint filed successfully");
      router.replace(`/dashboard/complaints/${complaint.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not file complaint";
      toast.error(message);
      setIsSubmittingManually(false);
    }
  });

  const selectedCategory = categories?.find((c) => c.id === values.categoryId);

  const isBusy = createComplaint.isPending || isSubmitting || isSubmittingManually;

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <ol
        className="flex flex-wrap items-center gap-2 sm:gap-4"
        aria-label="Progress"
      >
        {STEPS.map((s, idx) => {
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <li key={s.id} className="flex items-center gap-2">
              <span
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isDone
                    ? "border-success bg-success text-surface"
                    : isActive
                      ? "border-ink bg-ink text-surface"
                      : "border-border-strong bg-surface text-ink-muted",
                )}
              >
                {isDone ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  s.id
                )}
              </span>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  isActive ? "font-semibold text-ink" : "text-ink-muted",
                )}
              >
                {s.title}
              </span>
              {idx < STEPS.length - 1 && (
                <span
                  className="hidden h-px w-6 bg-border-strong sm:inline-block"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/*
        The form intentionally has NO onSubmit handler. Implicit submission
        via Enter key or autofill is blocked. Submission only happens when
        the user clicks the "File complaint" button.
      */}
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <Card>
          <CardContent className="space-y-5 pt-5">
            <header>
              <h2 className="text-lg font-semibold text-ink">
                {currentStep.title}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                {currentStep.description}
              </p>
            </header>

            {step === 1 && (
              <div className="space-y-4">
                <Select
                  label="Category"
                  required
                  placeholder="Select a category"
                  value={values.categoryId}
                  options={categoryOptions}
                  error={errors.categoryId?.message}
                  {...register("categoryId")}
                />
                <Input
                  label="Title"
                  required
                  placeholder="Short summary of the issue"
                  error={errors.title?.message}
                  {...register("title")}
                />
                <Select
                  label="Priority"
                  required
                  value={values.priority}
                  options={priorityOptions}
                  error={errors.priority?.message}
                  {...register("priority")}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Textarea
                  label="Description"
                  required
                  rows={6}
                  placeholder="What happened? When? Any relevant details."
                  error={errors.description?.message}
                  {...register("description")}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Ward (optional)"
                    placeholder="Ward 5"
                    error={errors.ward?.message}
                    {...register("ward")}
                  />
                  <Input
                    label="Address (optional)"
                    placeholder="Street, landmark"
                    error={errors.address?.message}
                    {...register("address")}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-medium text-ink">
                    Photos (optional, up to 10)
                  </p>
                  <ImageUploader
                    value={values.images ?? []}
                    onChange={(urls) =>
                      setValue("images", urls, { shouldValidate: true })
                    }
                  />
                </div>

                <div className="rounded-lg border-2 border-border bg-surface-2/50 p-4">
                  <h3 className="text-sm font-semibold text-ink">
                    Review your complaint
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <Row label="Category">
                      {selectedCategory?.name ?? "—"}
                    </Row>
                    <Row label="Title">{values.title || "—"}</Row>
                    <Row label="Priority">
                      {humanizeEnum(values.priority)}
                    </Row>
                    <Row label="Ward">{values.ward || "—"}</Row>
                    <Row label="Address">{values.address || "—"}</Row>
                    <Row label="Description">
                      <span className="line-clamp-3">
                        {values.description || "—"}
                      </span>
                    </Row>
                    <Row label="Images">
                      {values.images?.length ?? 0} attached
                    </Row>
                  </dl>
                </div>
              </div>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                disabled={step === 1 || isBusy}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>

              {step < STEPS.length ? (
                <Button
                  type="button"
                  onClick={() => void goNext()}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => void submitComplaint()}
                  isLoading={isBusy}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  File complaint
                </Button>
              )}
            </footer>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-ink">
        {children}
      </dd>
    </div>
  );
}